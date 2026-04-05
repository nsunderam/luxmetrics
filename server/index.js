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

app.listen(PORT, () => {
  console.log(`\nLuxMetrics API running on http://localhost:${PORT}`)
  console.log(`  GET  /api/health        - Health check`)
  console.log(`  GET  /api/listings       - Browse listings`)
  console.log(`  GET  /api/stats          - Dashboard stats`)
  console.log(`  GET  /api/scrapers/status - Scraper status`)
  console.log(`  POST /api/scrapers/run    - Trigger manual scrape\n`)
})
