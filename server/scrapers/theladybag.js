const ShopifyScraper = require('./shopify-scraper')

class TheLadyBagScraper extends ShopifyScraper {
  constructor(config) {
    super('theladybag', 'https://www.theladybag.com', {
      collections: ['__root__'],
      filterBags: true,
      maxPages: 10,
      currency: 'USD',
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
          const isBag = ptype.includes('bag') || ptype.includes('handbag') || ptype.includes('tote')
            || ptype.includes('crossbody') || ptype.includes('satchel')
            || ptype.includes('shoulder') || ptype.includes('backpack')
          if (this.config.filterBags && !isBag) continue

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
}

module.exports = TheLadyBagScraper
