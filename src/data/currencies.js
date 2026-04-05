export const CURRENCIES = {
  USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸', rate: 1.0 },
  GBP: { symbol: '£', name: 'British Pound', flag: '🇬🇧', rate: 0.79 },
  INR: { symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', rate: 83.50 },
  AUD: { symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', rate: 1.53 },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', rate: 1.34 },
  EUR: { symbol: '€', name: 'Euro', flag: '🇪🇺', rate: 0.92 },
  JPY: { symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', rate: 149.50 },
  HKD: { symbol: 'HK$', name: 'Hong Kong Dollar', flag: '🇭🇰', rate: 7.82 },
  KRW: { symbol: '₩', name: 'South Korean Won', flag: '🇰🇷', rate: 1320.00 },
  AED: { symbol: 'د.إ', name: 'UAE Dirham', flag: '🇦🇪', rate: 3.67 },
}

export function convertCurrency(amountUSD, toCurrency) {
  const rate = CURRENCIES[toCurrency]?.rate ?? 1
  return amountUSD * rate
}

export function convertToUSD(amount, fromCurrency) {
  const rate = CURRENCIES[fromCurrency]?.rate ?? 1
  return amount / rate
}

export function formatPrice(amount, currency) {
  const { symbol } = CURRENCIES[currency] || { symbol: '$' }
  if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(2)}M`
  }
  return `${symbol}${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}
