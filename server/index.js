const express = require('express')
const path = require('path')
const cors = require('cors')
const { initDB } = require('./db/init')
const { startScheduler } = require('./services/scheduler')
const listingsRouter = require('./routes/listings')
const statsRouter = require('./routes/stats')
const scrapersRouter = require('./routes/scrapers')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Initialize database
const db = initDB()

// Inject db into every request
app.use((req, res, next) => {
  req.db = db
  next()
})

// API Routes
app.use('/api/listings', listingsRouter)
app.use('/api/stats', statsRouter)
app.use('/api/scrapers', scrapersRouter)

// eBay Marketplace Account Deletion webhook (compliance requirement)
app.post('/api/ebay/deletion', (req, res) => {
  console.log('[eBay] Account deletion notification received:', JSON.stringify(req.body))
  // We don't store any eBay user data, so just acknowledge
  res.status(200).json({ status: 'acknowledged' })
})
app.get('/api/ebay/deletion', (req, res) => {
  // eBay may send a GET to verify the endpoint exists
  res.status(200).json({ status: 'ok' })
})

// Health check
app.get('/api/health', (req, res) => {
  const listingCount = db.prepare('SELECT COUNT(*) as c FROM listings WHERE isActive = 1').get().c
  res.json({ status: 'ok', listings: listingCount, timestamp: new Date().toISOString() })
})

// Serve static frontend in production
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

// Start scheduler for automated scraping
startScheduler(db)

// Auto-scrape on startup if database is empty (fresh deploy)
const listingCount = db.prepare('SELECT COUNT(*) as c FROM listings').get().c
if (listingCount < 500) {
  console.log('Only ' + listingCount + ' listings found — running initial scrape...')
  const { getScraper } = require('./scrapers/registry')
  const { calculateFMV, calculateMispricing } = require('./services/fmv')
  const { getRates, convertToUSD } = require('./services/currency')
  ;(async () => {
    const scrapersToRun = ['fashionphile', 'rebag']
    for (const resellerId of scrapersToRun) {
      try {
        console.log('Scraping ' + resellerId + '...')
        const scraper = getScraper(resellerId)
        const rawListings = await scraper.run()
        const rates = getRates(db)
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
            const priceUSD = listing.localCurrency === 'USD' ? listing.localPrice : convertToUSD(listing.localPrice, listing.localCurrency, rates)
            const fairValueUSD = calculateFMV(listing.modelKey, listing.condition, db)
            const mispricingPct = fairValueUSD ? calculateMispricing(priceUSD, fairValueUSD) : null
            upsert.run(listing.brand, listing.brandName, listing.tier, listing.model, listing.modelKey, listing.material, listing.size, listing.color, listing.hardware, listing.condition, listing.year, JSON.stringify(listing.accessories || []), resellerId, listing.localPrice, listing.localCurrency, priceUSD, fairValueUSD, mispricingPct, listing.daysListed || 1, listing.image, listing.sourceUrl, listing.sourceId, now)
          }
        })
        tx()
        console.log(resellerId + ' done: ' + rawListings.length + ' listings')
      } catch (err) {
        console.error(resellerId + ' scrape failed:', err.message)
      }
    }
    console.log('Initial scrape complete.')
  })()
}

app.listen(PORT, () => {
  console.log(`\nLuxMetrics API running on http://localhost:${PORT}`)
  console.log(`  GET  /api/health        - Health check`)
  console.log(`  GET  /api/listings       - Browse listings`)
  console.log(`  GET  /api/stats          - Dashboard stats`)
  console.log(`  GET  /api/scrapers/status - Scraper status`)
  console.log(`  POST /api/scrapers/run    - Trigger manual scrape\n`)
})
