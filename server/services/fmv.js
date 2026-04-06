const CONDITION_MULTIPLIERS = {
  'New': 1.00,
  'Excellent': 0.92,
  'Very Good': 0.82,
  'Good': 0.70,
  'Pre-Owned': 0.75,  // Unknown condition — use midpoint between Good and Very Good
  'Fair': 0.55,
}

// Retail-based FMV: brand new retail price × condition discount
function calculateFMV(modelKey, condition, db) {
  const row = db.prepare('SELECT baseValueUSD FROM fair_values WHERE modelKey = ?').get(modelKey)
  if (!row) return null
  const multiplier = CONDITION_MULTIPLIERS[condition] || 0.82
  return Math.round(row.baseValueUSD * multiplier)
}

// Get the retail base value (before condition adjustment)
function getRetailBase(modelKey, db) {
  const row = db.prepare('SELECT baseValueUSD FROM fair_values WHERE modelKey = ?').get(modelKey)
  return row ? row.baseValueUSD : null
}

// Market-driven FMV: median price of all active listings with same modelKey
function calculateMarketFMV(modelKey, db) {
  const rows = db.prepare(
    'SELECT priceUSD FROM listings WHERE modelKey = ? AND isActive = 1 ORDER BY priceUSD'
  ).all(modelKey)

  if (rows.length < 2) return null // Need at least 2 listings to compute meaningful median

  const mid = Math.floor(rows.length / 2)
  if (rows.length % 2 === 0) {
    return Math.round((rows[mid - 1].priceUSD + rows[mid].priceUSD) / 2)
  }
  return Math.round(rows[mid].priceUSD)
}

function calculateMispricing(priceUSD, fairValueUSD) {
  if (!fairValueUSD || fairValueUSD === 0) return null
  return ((priceUSD - fairValueUSD) / fairValueUSD) * 100
}

function getAllFairValues(db) {
  return db.prepare('SELECT * FROM fair_values ORDER BY modelKey').all()
}

function updateFairValue(modelKey, baseValueUSD, db) {
  db.prepare('INSERT OR REPLACE INTO fair_values (modelKey, baseValueUSD, updatedAt) VALUES (?, ?, datetime("now"))').run(modelKey, baseValueUSD)
}

module.exports = {
  calculateFMV, calculateMarketFMV, calculateMispricing,
  getRetailBase, getAllFairValues, updateFairValue,
  CONDITION_MULTIPLIERS
}
