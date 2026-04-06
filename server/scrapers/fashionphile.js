const { normalize, parsePrice } = require('../services/normalizer')

class FashionphileScraper {
  constructor(config) {
    this.resellerId = 'fashionphile'
    this.baseUrl = 'https://www.fashionphile.com'
    this.config = { maxPages: 10, perPage: 50, ...config }
  }

  async run() {
    // Fashionphile uses a single 'handbags' collection for all brands
    console.log('  Scraping handbags collection via Shopify JSON API...')
    const allListings = await this.scrapeCollection('handbags')
    console.log('  Total raw listings scraped: ' + allListings.length)
    return allListings
  }

  async scrapeCollection(collection) {
    const listings = []
    let page = 1

    while (page <= this.config.maxPages) {
      const url = this.baseUrl + '/collections/' + collection + '/products.json?limit=' + this.config.perPage + '&page=' + page

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
    }

    return listings
  }

  parseProduct(product) {
    const title = product.title
    if (!title) return null

    // Exclude non-bag items
    const titleLower = title.toLowerCase()
    const handle = (product.handle || '').toLowerCase()
    const combined = titleLower + ' ' + handle
    const excludes = [
      'card holder', 'card case', 'cardholder', 'coin purse', 'coin pouch',
      'wallet on chain', 'wallet-on-chain', 'woc',
      'wallet', 'key holder', 'key ring', 'keychain', 'phone case', 'phone pouch',
      'belt bag', 'belt-bag', 'chain belt',
      'pochette', 'pouch crossbody', 'mini pouch', 'extra mini',
      'scarf', 'shoes', 'sneaker', 'sandal', 'boot', 'loafer', 'heel', 'flat',
      'watch', 'bracelet', 'necklace', 'earring', 'brooch', 'cufflink',
      'sunglasses', 'eyeglasses', 'hat', 'beanie', 'gloves', 'cap',
      'notebook', 'agenda', 'passport', 'luggage tag', 'bookmark',
      'cosmetic case', 'vanity', 'jewelry box', 'pencil case',
    ]
    if (excludes.some(function(e) { return combined.includes(e) })) return null

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

module.exports = FashionphileScraper
