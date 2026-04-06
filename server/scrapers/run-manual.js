// Manual scrape runner: npm run scrape [resellerId]
const { initDB } = require('../db/init')
const { getAvailableScrapers, getScraper } = require('./registry')
const { calculateFMV, calculateMarketFMV, calculateMispricing } = require('../services/fmv')
const { getRates, convertToUSD } = require('../services/currency')

async function main() {
  const db = initDB()
  const targets = process.argv.slice(2)
  const available = getAvailableScrapers()

  const scrapersToRun = targets.length > 0 ? targets : available

  for (const id of scrapersToRun) {
    if (!available.includes(id)) {
      console.error(`No scraper for: ${id}. Available: ${available.join(', ')}`)
      continue
    }

    console.log(`\nRunning scraper: ${id}`)
    const run = db.prepare('INSERT INTO scrape_runs (resellerId) VALUES (?)').run(id)
    const runId = run.lastInsertRowid

    try {
      const scraper = getScraper(id)
      const rawListings = await scraper.run()
      const rates = getRates(db)

      let newCount = 0, updatedCount = 0

      const now = new Date().toISOString()
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
            listing.brand, listing.brandName, listing.tier,
            listing.model, listing.modelKey,
            listing.material, listing.size, listing.color, listing.hardware,
            listing.condition, listing.year,
            JSON.stringify(listing.accessories || []),
            id, listing.localPrice, listing.localCurrency,
            priceUSD, fairValueUSD, mispricingPct,
            listing.daysListed || 1, listing.image, listing.sourceUrl, listing.sourceId,
            now
          )
          updatedCount++
        }
      })
      tx()

      db.prepare("UPDATE scrape_runs SET completedAt = datetime('now'), status = 'completed', listingsFound = ?, listingsNew = ?, listingsUpdated = ? WHERE id = ?")
        .run(rawListings.length, newCount, updatedCount, runId)

      console.log(`Done: ${rawListings.length} found, ${updatedCount} saved`)
    } catch (err) {
      db.prepare("UPDATE scrape_runs SET completedAt = datetime('now'), status = 'failed', errorMessage = ? WHERE id = ?")
        .run(err.message, runId)
      console.error(`Failed: ${err.message}`)
    }
  }

  // Compute market-driven FMV for all listings
  console.log('\nComputing market-driven FMV...')
  const modelKeys = db.prepare('SELECT DISTINCT modelKey FROM listings WHERE isActive = 1').all()
  const updateMkt = db.prepare('UPDATE listings SET marketFmvUSD = ?, marketMispricingPct = ? WHERE id = ?')
  const mktTx = db.transaction(() => {
    for (const { modelKey } of modelKeys) {
      const marketFmv = calculateMarketFMV(modelKey, db)
      if (!marketFmv) continue
      const rows = db.prepare('SELECT id, priceUSD FROM listings WHERE modelKey = ? AND isActive = 1').all(modelKey)
      for (const r of rows) {
        const mkt = calculateMispricing(r.priceUSD, marketFmv)
        updateMkt.run(marketFmv, mkt, r.id)
      }
    }
  })
  mktTx()
  console.log('Market FMV computed for ' + modelKeys.length + ' model keys')

  db.close()
  console.log('\nAll scrapes complete.')
}

main().catch(console.error)
