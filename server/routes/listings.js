const express = require('express')
const router = express.Router()

// GET /api/listings
router.get('/', (req, res) => {
  const db = req.db
  const {
    brand, condition, reseller, search,
    minPrice, maxPrice, mispricingBelow, minResellers,
    sort = 'mispricing_asc',
    page = 1, limit = 36,
  } = req.query

  let where = ['isActive = 1']
  const params = []

  if (brand) {
    const brands = brand.split(',')
    where.push(`brand IN (${brands.map(() => '?').join(',')})`)
    params.push(...brands)
  }

  if (condition) {
    const conditions = condition.split(',')
    where.push(`condition IN (${conditions.map(() => '?').join(',')})`)
    params.push(...conditions)
  }

  if (reseller) {
    where.push('resellerId = ?')
    params.push(reseller)
  }

  if (search) {
    where.push('(brandName LIKE ? OR model LIKE ? OR color LIKE ? OR material LIKE ?)')
    const term = `%${search}%`
    params.push(term, term, term, term)
  }

  if (minPrice) {
    where.push('priceUSD >= ?')
    params.push(Number(minPrice))
  }

  if (maxPrice) {
    where.push('priceUSD <= ?')
    params.push(Number(maxPrice))
  }

  if (mispricingBelow) {
    where.push('mispricingPct < ?')
    params.push(Number(mispricingBelow))
  }

  if (minResellers && Number(minResellers) > 1) {
    where.push(`modelKey IN (SELECT modelKey FROM listings WHERE isActive = 1 GROUP BY modelKey HAVING COUNT(DISTINCT resellerId) >= ?)`)
    params.push(Number(minResellers))
  }

  const whereClause = where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''

  // Sort
  const sortMap = {
    'mispricing_asc': 'CASE WHEN mispricingPct IS NULL THEN 1 ELSE 0 END, mispricingPct ASC',
    'mispricing_desc': 'CASE WHEN mispricingPct IS NULL THEN 1 ELSE 0 END, mispricingPct DESC',
    'price_asc': 'priceUSD ASC',
    'price_desc': 'priceUSD DESC',
    'days_desc': 'daysListed DESC',
    'days_asc': 'daysListed ASC',
  }
  const orderBy = sortMap[sort] || sortMap['mispricing_asc']

  // Count total
  const countRow = db.prepare(`SELECT COUNT(*) as total FROM listings ${whereClause}`).get(...params)
  const total = countRow.total

  // Paginate
  const offset = (Number(page) - 1) * Number(limit)
  const rows = db.prepare(`SELECT * FROM listings ${whereClause} ORDER BY ${orderBy} LIMIT ? OFFSET ?`).all(...params, Number(limit), offset)

  // Parse accessories JSON and add retail base price
  const fvCache = {}
  const listings = rows.map(row => {
    // Look up retail base value for explanation
    if (!fvCache[row.modelKey]) {
      const fv = db.prepare('SELECT baseValueUSD FROM fair_values WHERE modelKey = ?').get(row.modelKey)
      fvCache[row.modelKey] = fv ? fv.baseValueUSD : null
    }
    return {
      ...row,
      accessories: row.accessories ? JSON.parse(row.accessories) : [],
      retailBaseUSD: fvCache[row.modelKey],
    }
  })

  res.json({
    listings,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  })
})

// GET /api/listings/:id
router.get('/:id', (req, res) => {
  const db = req.db
  const row = db.prepare('SELECT * FROM listings WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Listing not found' })

  row.accessories = row.accessories ? JSON.parse(row.accessories) : []
  res.json(row)
})

module.exports = router
