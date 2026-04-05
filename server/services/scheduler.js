const cron = require('node-cron')
const { getAvailableScrapers, getScraper } = require('../scrapers/registry')
const { calculateFMV, calculateMispricing } = require('./fmv')
const { getRates, convertToUSD, refreshRates } = require('./currency')

function startScheduler(db) {
  // Run every 6 hours: at minute 0 of hours 0, 6, 12, 18
  cron.schedule('0 */6 * * *', async () => {
    console.log('\n[Scheduler] Starting scheduled scrape cycle...')

    // Refresh currency rates first
    try {
      await refreshRates(db)
    } catch (err) {
      console.warn('[Scheduler] Currency refresh failed:', err.message)
    }

    const scrapers = getAvailableScrapers()
    for (const id of scrapers) {
      try {
        console.log(`[Scheduler] Running: ${id}`)
        const scraper = getScraper(id)
        const run = db.prepare('INSERT INTO scrape_runs (resellerId) VALUES (?)').run(id)
        const runId = run.lastInsertRowid

        const rawListings = await scraper.run()
        const rates = getRates(db)
        let count = 0

        const upsert = db.prepare(`
          INSERT INTO listings (brand, brandName, tier, model, modelKey, material, size, color, hardware, condition, year, accessories, resellerId, localPrice, localCurrency, priceUSD, fairValueUSD, mispricingPct, daysListed, image, sourceUrl, sourceId, lastSeen)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
          ON CONFLICT(resellerId, sourceId) DO UPDATE SET
            localPrice = excluded.localPrice, priceUSD = excluded.priceUSD,
            fairValueUSD = excluded.fairValueUSD, mispricingPct = excluded.mispricingPct,
            lastSeen = datetime('now'), isActive = 1
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
              listing.image, listing.sourceUrl, listing.sourceId
            )
            count++
          }
        })
        tx()

        db.prepare('UPDATE scrape_runs SET completedAt = datetime("now"), status = "completed", listingsFound = ?, listingsUpdated = ? WHERE id = ?')
          .run(rawListings.length, count, runId)

        console.log(`[Scheduler] ${id}: ${rawListings.length} found, ${count} saved`)
      } catch (err) {
        console.error(`[Scheduler] ${id} failed:`, err.message)
      }

      // 30s delay between scrapers
      await new Promise(r => setTimeout(r, 30000))
    }

    console.log('[Scheduler] Scrape cycle complete.\n')
  })

  console.log('Scheduler started: scrapes every 6 hours')
}

module.exports = { startScheduler }
