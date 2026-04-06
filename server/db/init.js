const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'luxmetrics.db')

function initDB() {
  const db = new Database(DB_PATH)

  // Enable WAL mode for better concurrent read performance
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  // Run schema
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  db.exec(schema)

  // Seed fair values if empty
  const count = db.prepare('SELECT COUNT(*) as c FROM fair_values').get()
  if (count.c === 0) {
    seedFairValues(db)
  }

  // Seed currency rates if empty
  const rateCount = db.prepare('SELECT COUNT(*) as c FROM currency_rates').get()
  if (rateCount.c === 0) {
    seedCurrencyRates(db)
  }

  // Migration: add market FMV columns if they don't exist
  try {
    db.prepare('SELECT marketFmvUSD FROM listings LIMIT 1').get()
  } catch (e) {
    db.exec('ALTER TABLE listings ADD COLUMN marketFmvUSD REAL')
    db.exec('ALTER TABLE listings ADD COLUMN marketMispricingPct REAL')
    console.log('Migrated: added marketFmvUSD, marketMispricingPct columns')
  }

  console.log(`Database initialized at ${DB_PATH}`)
  return db
}

function seedFairValues(db) {
  const fairValues = require('../config/fair-values.json')
  const insert = db.prepare('INSERT OR IGNORE INTO fair_values (modelKey, baseValueUSD) VALUES (?, ?)')
  const tx = db.transaction(() => {
    for (const [modelKey, value] of Object.entries(fairValues)) {
      insert.run(modelKey, value)
    }
  })
  tx()
  console.log(`Seeded ${Object.keys(fairValues).length} fair values`)
}

function seedCurrencyRates(db) {
  const rates = {
    USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.50, SGD: 1.34,
    INR: 83.50, AED: 3.67, KRW: 1320.00, HKD: 7.82, AUD: 1.53,
  }
  const insert = db.prepare('INSERT OR REPLACE INTO currency_rates (currency, rateToUSD) VALUES (?, ?)')
  const tx = db.transaction(() => {
    for (const [currency, rate] of Object.entries(rates)) {
      insert.run(currency, rate)
    }
  })
  tx()
  console.log(`Seeded ${Object.keys(rates).length} currency rates`)
}

module.exports = { initDB, DB_PATH }
