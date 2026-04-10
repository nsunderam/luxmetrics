const ShopifyScraper = require('./shopify-scraper')

class GarderobeScraper extends ShopifyScraper {
  constructor(config) {
    super('garderobe', 'https://www.garderobe.ae', {
      collections: ['__root__'],
      filterBags: true,
      currency: 'AED',
      maxPages: 10,
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
          res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }, signal: AbortSignal.timeout(15000) })
        } catch (e) {
          break
        }
        if (!res.ok) break

        let data
        try {
          data = await res.json()
        } catch (e) {
          break
        }

        if (!data.products || data.products.length === 0) break

        for (const product of data.products) {
          // Filter bags by product type or tags
          const ptype = (product.product_type || '').toLowerCase()
          const tags = (typeof product.tags === 'string' ? product.tags : (product.tags || []).join(' ')).toLowerCase()
          const title = (product.title || '').toLowerCase()
          const isBag = ptype.includes('bag') || ptype.includes('handbag') || ptype.includes('tote')
            || ptype.includes('crossbody') || ptype.includes('shoulder') || ptype.includes('satchel')
            || ptype.includes('backpack')
            || tags.includes('handbag') || tags.includes('bags')
            || title.includes('bag') || title.includes('tote') || title.includes('kelly')
            || title.includes('birkin') || title.includes('flap') || title.includes('speedy')
          if (!isBag) continue

          const listing = this.parseProduct(product)
          if (listing) listings.push(listing)
        }

        if (data.products.length < this.config.perPage) break
        page++
        await new Promise(function(r) { return setTimeout(r, 1200) })
      }

      return listings
    }

    return super.scrapeCollection(collection)
  }

  // Override to extract condition from body_html if available
  parseProduct(product) {
    const listing = super.parseProduct(product)
    if (!listing) return null

    // Try to extract condition from body_html
    const body = (product.body_html || '').replace(/<[^>]+>/g, ' ').toLowerCase()
    if (body.includes('brand new') || body.includes('new with')) listing.condition = 'New'
    else if (body.includes('pristine')) listing.condition = 'Excellent'
    else if (body.includes('excellent')) listing.condition = 'Excellent'
    else if (body.includes('very good')) listing.condition = 'Very Good'
    else if (body.includes('good condition') || body.includes('good')) listing.condition = 'Good'
    else if (body.includes('shows wear') || body.includes('signs of wear')) listing.condition = 'Shows Wear'
    else if (body.includes('fair')) listing.condition = 'Fair'

    return listing
  }
}

module.exports = GarderobeScraper
