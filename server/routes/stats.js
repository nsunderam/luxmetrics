const express = require('express')
const router = express.Router()

// GET /api/stats
router.get('/', (req, res) => {
  const db = req.db

  const total = db.prepare('SELECT COUNT(*) as c FROM listings WHERE isActive = 1').get().c
  const underpriced = db.prepare('SELECT COUNT(*) as c FROM listings WHERE isActive = 1 AND mispricingPct < -10').get().c
  const overpriced = db.prepare('SELECT COUNT(*) as c FROM listings WHERE isActive = 1 AND mispricingPct > 15').get().c

  const bestDeal = db.prepare('SELECT brandName, model, mispricingPct FROM listings WHERE isActive = 1 ORDER BY mispricingPct ASC LIMIT 1').get()

  const avgRow = db.prepare('SELECT AVG(ABS(mispricingPct)) as avg FROM listings WHERE isActive = 1').get()
  const avgMispricing = avgRow?.avg || 0

  const resellers = db.prepare('SELECT COUNT(DISTINCT resellerId) as c FROM listings WHERE isActive = 1').get().c
  const brands = db.prepare('SELECT COUNT(DISTINCT brand) as c FROM listings WHERE isActive = 1').get().c

  const lastScrape = db.prepare('SELECT * FROM scrape_runs ORDER BY startedAt DESC LIMIT 1').get()

  res.json({
    totalListings: total,
    underpriced,
    overpriced,
    bestDeal: bestDeal ? {
      name: `${bestDeal.brandName} ${bestDeal.model}`,
      mispricingPct: bestDeal.mispricingPct,
    } : null,
    avgMispricing: Math.round(avgMispricing * 10) / 10,
    resellers,
    brands,
    lastScrape: lastScrape || null,
  })
})

// GET /api/resellers
router.get('/resellers', (req, res) => {
  const resellers = require('../config/resellers.json')
  const db = req.db

  const counts = db.prepare('SELECT resellerId, COUNT(*) as c FROM listings WHERE isActive = 1 GROUP BY resellerId').all()
  const countMap = {}
  for (const row of counts) countMap[row.resellerId] = row.c

  const result = resellers.map(r => ({
    ...r,
    listingCount: countMap[r.id] || 0,
  }))

  res.json(result)
})

module.exports = router
