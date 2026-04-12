const ShopifyScraper = require('./shopify-scraper')

class BagistaScraper extends ShopifyScraper {
  constructor(config) {
    super('bagista', 'https://www.bagista.co.uk', {
      collections: ['all'],
      currency: 'GBP',
      filterBags: false,  // Bagista is bags-only store
      maxPages: 15,
      perPage: 250,
      delayMs: 1500,
      ...config,
    })
  }

  parseProduct(product) {
    const listing = super.parseProduct(product)
    if (!listing) return null

    // Extract condition from tags or body_html
    const tags = typeof product.tags === 'string'
      ? product.tags.toLowerCase()
      : (product.tags || []).join(' ').toLowerCase()

    const body = (product.body_html || '').replace(/<[^>]+>/g, ' ').toLowerCase()
    const combined = tags + ' ' + body

    // Bagista condition levels
    if (combined.includes('brand new') || combined.includes('bnib') || combined.includes('unworn')) {
      listing.condition = 'New'
    } else if (combined.includes('pristine') || combined.includes('like new') || combined.includes('mint')) {
      listing.condition = 'Excellent'
    } else if (combined.includes('excellent')) {
      listing.condition = 'Excellent'
    } else if (combined.includes('very good')) {
      listing.condition = 'Very Good'
    } else if (combined.includes('good condition') || combined.includes('good')) {
      listing.condition = 'Good'
    } else if (combined.includes('shows wear') || combined.includes('fair')) {
      listing.condition = 'Fair'
    } else if (combined.includes('pre-loved') || combined.includes('pre loved') || combined.includes('preloved')) {
      listing.condition = 'Pre-Owned'
    }

    // Also try Condition: X pattern in body
    const condMatch = body.match(/condition[:\s]*(brand new|pristine|excellent|very good|good|fair|pre-?loved|like new|shows wear|worn)/i)
    if (condMatch) {
      const raw = condMatch[1].trim().toLowerCase()
      if (raw === 'brand new') listing.condition = 'New'
      else if (raw === 'pristine' || raw === 'like new') listing.condition = 'Excellent'
      else if (raw === 'excellent') listing.condition = 'Excellent'
      else if (raw === 'very good') listing.condition = 'Very Good'
      else if (raw === 'good') listing.condition = 'Good'
      else if (raw === 'fair' || raw === 'worn' || raw === 'shows wear') listing.condition = 'Fair'
      else if (raw.includes('pre')) listing.condition = 'Pre-Owned'
    }

    return listing
  }
}

module.exports = BagistaScraper
