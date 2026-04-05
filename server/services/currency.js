const STATIC_RATES = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.50, SGD: 1.34,
  INR: 83.50, AED: 3.67, KRW: 1320.00, HKD: 7.82, AUD: 1.53,
}

async function fetchLiveRates() {
  try {
    const res = await fetch('https://api.exchangerate.host/latest?base=USD')
    const data = await res.json()
    if (data.success && data.rates) {
      return data.rates
    }
  } catch (err) {
    console.warn('Failed to fetch live rates, using static fallback:', err.message)
  }
  return STATIC_RATES
}

function getRates(db) {
  const rows = db.prepare('SELECT currency, rateToUSD FROM currency_rates').all()
  const rates = {}
  for (const row of rows) {
    rates[row.currency] = row.rateToUSD
  }
  return Object.keys(rates).length > 0 ? rates : STATIC_RATES
}

async function refreshRates(db) {
  const rates = await fetchLiveRates()
  const insert = db.prepare('INSERT OR REPLACE INTO currency_rates (currency, rateToUSD, updatedAt) VALUES (?, ?, datetime("now"))')
  const tx = db.transaction(() => {
    for (const [currency, rate] of Object.entries(rates)) {
      if (['USD', 'EUR', 'GBP', 'JPY', 'SGD', 'INR', 'AED', 'KRW', 'HKD', 'AUD'].includes(currency)) {
        insert.run(currency, rate)
      }
    }
  })
  tx()
  console.log('Currency rates refreshed')
  return rates
}

function convertToUSD(amount, fromCurrency, rates) {
  if (fromCurrency === 'USD') return amount
  const rate = rates[fromCurrency]
  if (!rate) return amount
  return Math.round(amount / rate)
}

module.exports = { getRates, refreshRates, convertToUSD, STATIC_RATES }
