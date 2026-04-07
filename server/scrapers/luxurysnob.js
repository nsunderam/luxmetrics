const ShopifyScraper = require('./shopify-scraper')

class LuxurySnobScraper extends ShopifyScraper {
  constructor(config) {
    super('luxurysnob', 'https://www.luxurysnob.com', {
      collections: ['__root__'],
      filterBags: true,
      maxPages: 20,
      currency: 'USD', // Luxurysnob prices in USD
      ...config,
    })
  }

  async scrapeCollection(collection) {
    if (collection === '__root__') {
      const listings = []
      let page = 1

      while (page <= this.config.maxPages) {
        const url = this.baseUrl + '/products.json?limit=' + this.config.perPage + '&page=' + page

        let res
        try {
          res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } })
        } catch (e) { break }
        if (!res.ok) break

        let data
        try { data = await res.json() } catch (e) { break }
        if (!data.products || data.products.length === 0) break

        for (const product of data.products) {
          const ptype = (product.product_type || '').toLowerCase()
          const tags = (typeof product.tags === 'string' ? product.tags : (product.tags || []).join(' ')).toLowerCase()
          const title = (product.title || '').toLowerCase()

          const isBag = ptype.includes('bag') || ptype.includes('handbag') || ptype.includes('tote')
            || ptype.includes('crossbody') || ptype.includes('satchel')
            || ptype.includes('shoulder') || ptype.includes('backpack')
            || tags.includes('handbag') || tags.includes('bags')
            || title.includes('bag') || title.includes('tote') || title.includes('satchel')
          if (this.config.filterBags && !isBag) continue

          const listing = this.parseProduct(product)
          if (listing) {
            // Try to extract condition from body_html
            const condition = this.extractCondition(product)
            if (condition) listing.condition = condition
            listings.push(listing)
          }
        }

        if (data.products.length < this.config.perPage) break
        page++
        await new Promise(function(r) { return setTimeout(r, 1500) })
      }

      return listings
    }
    return super.scrapeCollection(collection)
  }

  extractCondition(product) {
    const body = (product.body_html || '').replace(/<[^>]+>/g, ' ').toLowerCase()
    const tags = (typeof product.tags === 'string' ? product.tags : (product.tags || []).join(', ')).toLowerCase()

    // Check tags first
    if (tags.includes('new with tags') || tags.includes('brand new') || tags.includes('nwt')) return 'New'
    if (tags.includes('like new') || tags.includes('pristine')) return 'Excellent'
    if (tags.includes('excellent')) return 'Excellent'
    if (tags.includes('very good')) return 'Very Good'
    if (tags.includes('good condition') || tags.includes('good')) return 'Good'
    if (tags.includes('gently used')) return 'Good'
    if (tags.includes('fair')) return 'Fair'

    // Check body
    const condMatch = body.match(/condition[:\s]*([\w\s]+?)(?:\.|,|<|\n)/i)
    if (condMatch) {
      const raw = condMatch[1].trim()
      if (raw.includes('new') || raw.includes('pristine')) return 'New'
      if (raw.includes('excellent') || raw.includes('like new')) return 'Excellent'
      if (raw.includes('very good')) return 'Very Good'
      if (raw.includes('good') || raw.includes('gently')) return 'Good'
      if (raw.includes('fair') || raw.includes('worn')) return 'Fair'
    }

    return null // Will default to 'Pre-Owned' from base class
  }
}

module.exports = LuxurySnobScraper
