const express = require('express')
const router = express.Router()
const { getAvailableScrapers, getScraper } = require('../scrapers/registry')
const { calculateFMV, calculateMispricing } = require('../services/fmv')
const { getRates, convertToUSD } = require('../services/currency')

// GET /api/scrapers/status
router.get('/status', (req, res) => {
  const db = req.db
  const available = getAvailableScrapers()

  const runs = db.prepare(`
    SELECT sr.*,
      (SELECT COUNT(*) FROM listings WHERE resellerId = sr.resellerId AND isActive = 1) as totalActive
    FROM scrape_runs sr
    WHERE sr.id IN (SELECT MAX(id) FROM scrape_runs GROUP BY resellerId)
    ORDER BY sr.startedAt DESC
  `).all()

  res.json({
    availableScrapers: available,
    lastRuns: runs,
  })
})

// POST /api/scrapers/run
router.post('/run', async (req, res) => {
  const db = req.db
  const { resellerId } = req.body
  const available = getAvailableScrapers()

  const scrapersToRun = resellerId ? [resellerId] : available

  // Validate
  for (const id of scrapersToRun) {
    if (!available.includes(id)) {
      return res.status(400).json({ error: `No scraper available for: ${id}` })
    }
  }

  // Start async - return immediately
  res.json({ status: 'started', scrapers: scrapersToRun })

  // Run scrapers sequentially in background
  for (const id of scrapersToRun) {
    try {
      await runScraper(id, db)
    } catch (err) {
      console.error(`Scraper ${id} failed:`, err.message)
    }
  }
})

async function runScraper(resellerId, db) {
  // Log the run
  const run = db.prepare('INSERT INTO scrape_runs (resellerId) VALUES (?)').run(resellerId)
  const runId = run.lastInsertRowid

  try {
    console.log(`Starting scrape: ${resellerId}`)
    const scraper = getScraper(resellerId)
    const rawListings = await scraper.run()

    const rates = getRates(db)
    let newCount = 0
    let updatedCount = 0

    const upsert = db.prepare(`
      INSERT INTO listings (brand, brandName, tier, model, modelKey, material, size, color, hardware, condition, year, accessories, resellerId, localPrice, localCurrency, priceUSD, fairValueUSD, mispricingPct, daysListed, image, sourceUrl, sourceId, lastSeen)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(resellerId, sourceId) DO UPDATE SET
        localPrice = excluded.localPrice,
        priceUSD = excluded.priceUSD,
        fairValueUSD = excluded.fairValueUSD,
        mispricingPct = excluded.mispricingPct,
        lastSeen = datetime('now'),
        isActive = 1
    `)

    const tx = db.transaction(() => {
      for (const listing of rawListings) {
        if (!listing.brand || !listing.model || !listing.sourceId) continue

        const priceUSD = listing.localCurrency === 'USD'
          ? listing.localPrice
          : convertToUSD(listing.localPrice, listing.localCurrency, rates)

        const fairValueUSD = calculateFMV(listing.modelKey, listing.condition, db)
        const mispricingPct = fairValueUSD ? calculateMispricing(priceUSD, fairValueUSD) : null

        const result = upsert.run(
          listing.brand, listing.brandName, listing.tier,
          listing.model, listing.modelKey,
          listing.material || null, listing.size || null,
          listing.color || null, listing.hardware || null,
          listing.condition, listing.year || null,
          JSON.stringify(listing.accessories || []),
          resellerId,
          listing.localPrice, listing.localCurrency,
          priceUSD, fairValueUSD, mispricingPct,
          listing.daysListed || 1,
          listing.image || null, listing.sourceUrl || null,
          listing.sourceId
        )

        if (result.changes > 0) {
          updatedCount++
        } else {
          newCount++
        }
      }
    })
    tx()

    // Update run log
    db.prepare('UPDATE scrape_runs SET completedAt = datetime("now"), status = "completed", listingsFound = ?, listingsNew = ?, listingsUpdated = ? WHERE id = ?')
      .run(rawListings.length, newCount, updatedCount, runId)

    console.log(`Scrape complete: ${resellerId} - ${rawListings.length} found, ${newCount} new, ${updatedCount} updated`)
  } catch (err) {
    db.prepare('UPDATE scrape_runs SET completedAt = datetime("now"), status = "failed", errorMessage = ? WHERE id = ?')
      .run(err.message, runId)
    throw err
  }
}

module.exports = router
