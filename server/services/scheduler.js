const cron = require('node-cron')
const { getAvailableScrapers, getScraper } = require('../scrapers/registry')
const { calculateFMV, calculateMarketFMV, calculateMispricing } = require('./fmv')
const { getRates, convertToUSD, refreshRates } = require('./currency')

async function runScrapeForReseller(id, db) {
  try {
    console.log(`[Scheduler] Running: ${id}`)
    const scraper = getScraper(id)
    const run = db.prepare('INSERT INTO scrape_runs (resellerId) VALUES (?)').run(id)
    const runId = run.lastInsertRowid

    const rawListings = await scraper.run()
    const rates = getRates(db)
    const now = new Date().toISOString()
    let count = 0

    const upsert = db.prepare(`
      INSERT INTO listings (brand, brandName, tier, model, modelKey, material, size, color, hardware, condition, year, accessories, resellerId, localPrice, localCurrency, priceUSD, fairValueUSD, mispricingPct, daysListed, image, sourceUrl, sourceId, lastSeen)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(resellerId, sourceId) DO UPDATE SET
        localPrice = excluded.localPrice, priceUSD = excluded.priceUSD,
        fairValueUSD = excluded.fairValueUSD, mispricingPct = excluded.mispricingPct,
        lastSeen = excluded.lastSeen, isActive = 1
    `)

    const tx = db.transaction(() => {
      for (const listing of rawListings) {
        if (!listing.brand || !listing.model || !listing.sourceId) continue
        const priceUSD = listing.localCurrency === 'USD'
          ? listing.localPrice : convertToUSD(listing.localPrice, listing.localCurrency, rates)
        const fairValueUSD = calculateFMV(listing.modelKey, listing.condition, db)
        const mispricingPct = fairValueUSD ? calculateMispricing(priceUSD, fairValueUSD) : null
        upsert.run(
          listing.brand, listing.brandName, listing.tier, listing.model, listing.modelKey,
          listing.material, listing.size, listing.color, listing.hardware, listing.condition, listing.year,
          JSON.stringify(listing.accessories || []), id, listing.localPrice, listing.localCurrency,
          priceUSD, fairValueUSD, mispricingPct, listing.daysListed || 1,
          listing.image, listing.sourceUrl, listing.sourceId, now
        )
        count++
      }
    })
    tx()

    db.prepare("UPDATE scrape_runs SET completedAt = ?, status = 'completed', listingsFound = ?, listingsUpdated = ? WHERE id = ?")
      .run(now, rawListings.length, count, runId)

    console.log(`[Scheduler] ${id}: ${rawListings.length} found, ${count} saved`)

    // Compute market FMV immediately after each scraper
    if (count > 0) computeAllMarketFMV(db)

    return count
  } catch (err) {
    console.error(`[Scheduler] ${id} failed:`, err.message)
    return 0
  }
}

async function runFullScrape(db) {
  console.log('\n[Scheduler] Starting scrape cycle...')

  try {
    await refreshRates(db)
  } catch (err) {
    console.warn('[Scheduler] Currency refresh failed:', err.message)
  }

  // Run all fetch-based scrapers (Shopify + eBay API)
  const scrapers = ['fashionphile', 'rebag', 'luxedh', 'coutureusa', 'ebay', 'theladybag', 'luxurypromise', 'luxeitfwd', 'baghunter', 'luxurysnob']
  for (const id of scrapers) {
    await runScrapeForReseller(id, db)
    // 30s delay between scrapers to avoid rate limits
    await new Promise(r => setTimeout(r, 30000))
  }

  console.log('[Scheduler] Scrape cycle complete.\n')
}

function computeAllMarketFMV(db) {
  const modelKeys = db.prepare('SELECT DISTINCT modelKey FROM listings WHERE isActive = 1').all()
  const update = db.prepare('UPDATE listings SET marketFmvUSD = ?, marketMispricingPct = ? WHERE id = ?')

  const tx = db.transaction(() => {
    for (const { modelKey } of modelKeys) {
      const marketFmv = calculateMarketFMV(modelKey, db)
      if (!marketFmv) continue

      const listings = db.prepare('SELECT id, priceUSD FROM listings WHERE modelKey = ? AND isActive = 1').all(modelKey)
      for (const l of listings) {
        const mkt = calculateMispricing(l.priceUSD, marketFmv)
        update.run(marketFmv, mkt, l.id)
      }
    }
  })
  tx()
  console.log('  Market FMV computed for ' + modelKeys.length + ' model keys')
}

function startScheduler(db) {
  // Run every 6 hours
  cron.schedule('0 */6 * * *', () => runFullScrape(db))
  console.log('Scheduler started: scrapes every 6 hours')

  // Auto-scrape on startup if DB is empty
  const count = db.prepare('SELECT COUNT(*) as c FROM listings WHERE isActive = 1').get()
  if (count.c === 0) {
    console.log('[Scheduler] Empty DB detected — running initial scrape in 5s...')
    setTimeout(() => runFullScrape(db), 5000)
  }
}

module.exports = { startScheduler }
