const { normalize, parsePrice } = require('../services/normalizer')

class RebagScraper {
  constructor(config) {
    this.resellerId = 'rebag'
    this.baseUrl = 'https://shop.rebag.com'
    this.config = { maxPages: 10, perPage: 250, ...config }
  }

  async run() {
    console.log('  Scraping Rebag via Shopify JSON API...')

    // Rebag uses Shopify at shop.rebag.com — use /products.json (all products)
    const allListings = await this.scrapeCollection('all')

    console.log('  Total raw listings scraped: ' + allListings.length)
    return allListings
  }

  async scrapeCollection(collection) {
    const listings = []
    let page = 1

    while (page <= this.config.maxPages) {
      const url = this.baseUrl + '/collections/' + collection + '/products.json?limit=' + this.config.perPage + '&page=' + page

      try {
        const res = await fetch(url)
        if (!res.ok) break

        const data = await res.json()
        if (!data.products || data.products.length === 0) break

        for (const product of data.products) {
          const listing = this.parseProduct(product)
          if (listing) listings.push(listing)
        }

        if (data.products.length < this.config.perPage) break
        page++
        await new Promise(function(r) { return setTimeout(r, 1000) })
      } catch (err) {
        console.warn('    Page ' + page + ' failed: ' + err.message)
        break
      }
    }

    return listings
  }

  parseProduct(product) {
    const title = product.title
    if (!title) return null

    // Filter out non-bag items using handle, product_type, and title
    const handle = (product.handle || '').toLowerCase()
    const ptype = (product.product_type || '').toLowerCase()
    const titleLower = title.toLowerCase()

    // Exclude accessories: card holders, wallets, phone cases, keychains, etc.
    const excludePatterns = [
      'card holder', 'card case', 'cardholder', 'coin purse', 'coin pouch',
      'wallet', 'key holder', 'key ring', 'keychain', 'phone case', 'phone pouch',
      'belt', 'scarf', 'shoes', 'sneaker', 'sandal', 'boot', 'loafer',
      'watch', 'bracelet', 'necklace', 'earring', 'ring', 'brooch',
      'sunglasses', 'eyeglasses', 'hat', 'beanie', 'gloves',
      'notebook', 'agenda', 'passport', 'luggage-tag', 'bookmark',
    ]
    const isExcluded = excludePatterns.some(function(p) {
      return handle.includes(p.replace(/ /g, '-')) || titleLower.includes(p)
    })
    if (isExcluded) return null

    // Also check if handle starts with "accessories-" which Rebag uses for non-bag items
    if (handle.startsWith('accessories-') && !handle.includes('bag') && !handle.includes('tote') && !handle.includes('clutch')) return null

    const vendor = (product.vendor || '').toLowerCase()
    let normalized = normalize(title, null, null)
    if (!normalized) normalized = normalize(vendor + ' ' + title, null, null)
    if (!normalized) return null

    const price = product.variants && product.variants[0] ? parseFloat(product.variants[0].price) : null
    if (!price) return null

    const image = product.images && product.images[0] ? product.images[0].src : null
    const handleMatch = (product.handle || '').match(/(\d{5,})$/)
    const sourceId = handleMatch ? handleMatch[1] : (product.id ? String(product.id) : null)

    const colors = ['Black','Gold','Etoupe','Etain','White','Beige','Navy','Red','Rouge','Pink','Rose','Blue','Bleu','Green','Vert','Grey','Gris','Brown','Tan','Cream','Orange','Yellow','Burgundy','Bordeaux']
    let color = null
    for (const c of colors) {
      if (title.toLowerCase().includes(c.toLowerCase())) { color = c; break }
    }

    return {
      brand: normalized.brand,
      brandName: normalized.brandName,
      tier: normalized.tier,
      model: normalized.model,
      modelKey: normalized.modelKey,
      material: normalized.material,
      size: normalized.size,
      color: color,
      hardware: null,
      condition: 'Good',
      year: null,
      accessories: [],
      localPrice: price,
      localCurrency: 'USD',
      image: image,
      sourceUrl: this.baseUrl + '/products/' + product.handle,
      sourceId: sourceId,
      daysListed: 1,
    }
  }
}

module.exports = RebagScraper
