const CONDITION_MULTIPLIERS = {
  'New': 1.00,
  'Excellent': 0.92,
  'Very Good': 0.82,
  'Good': 0.70,
  'Fair': 0.55,
}

function calculateFMV(modelKey, condition, db) {
  const row = db.prepare('SELECT baseValueUSD FROM fair_values WHERE modelKey = ?').get(modelKey)
  if (!row) return null
  const multiplier = CONDITION_MULTIPLIERS[condition] || 0.82
  return Math.round(row.baseValueUSD * multiplier)
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

module.exports = { calculateFMV, calculateMispricing, getAllFairValues, updateFairValue, CONDITION_MULTIPLIERS }
