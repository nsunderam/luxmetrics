const { normalize } = require('../services/normalizer')

const COLORS = ['Black','Gold','Etoupe','Etain','White','Beige','Navy','Red','Rouge','Pink','Rose','Blue','Bleu','Green','Vert','Grey','Gris','Brown','Tan','Cream','Orange','Yellow','Burgundy','Bordeaux','Silver','Purple','Ivory']

class ShopifyScraper {
  constructor(resellerId, baseUrl, config = {}) {
    this.resellerId = resellerId
    this.baseUrl = baseUrl
    this.config = {
      maxPages: 20,
      perPage: 250,
      collections: ['handbags'],
      currency: 'USD',
      filterBags: true,
      delayMs: 1200,
      ...config,
    }
  }

  async run() {
    const allListings = []

    for (const collection of this.config.collections) {
      console.log('  Scraping ' + collection + ' from ' + this.resellerId + '...')
      const listings = await this.scrapeCollection(collection)
      allListings.push(...listings)
      console.log('  ' + collection + ': ' + listings.length + ' listings')
    }

    console.log('  Total raw listings scraped: ' + allListings.length)
    return allListings
  }

  async scrapeCollection(collection) {
    const listings = []
    let page = 1

    while (page <= this.config.maxPages) {
      const url = this.baseUrl + '/collections/' + collection + '/products.json?limit=' + this.config.perPage + '&page=' + page

      let res
      try {
        res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } })
      } catch (e) {
        console.warn('    Fetch error page ' + page + ': ' + e.message)
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
        // Optionally filter to bags only
        if (this.config.filterBags) {
          const ptype = (product.product_type || '').toLowerCase()
          const tags = (Array.isArray(product.tags) ? product.tags.join(' ') : (product.tags || '')).toLowerCase()
          const isBag = ptype.includes('bag') || ptype.includes('handbag') || ptype.includes('tote')
            || ptype.includes('clutch') || ptype.includes('crossbody') || ptype.includes('satchel')
            || ptype.includes('shoulder') || ptype.includes('backpack')
            || tags.includes('handbag') || tags.includes('bags')
          if (!isBag) continue
        }

        const listing = this.parseProduct(product)
        if (listing) listings.push(listing)
      }

      if (data.products.length < this.config.perPage) break
      page++
      await new Promise(function(r) { return setTimeout(r, 1200) })
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
      'clutch', 'chain clutch', 'camera bag', 'camera case',
      'mini bag', 'nano bag', 'micro bag',
      'scarf', 'shoes', 'sneaker', 'sandal', 'boot', 'loafer', 'heel', 'flat',
      'watch', 'bracelet', 'necklace', 'earring', 'brooch', 'cufflink',
      'sunglasses', 'eyeglasses', 'hat', 'beanie', 'gloves', 'cap',
      'notebook', 'agenda', 'passport', 'luggage tag', 'bookmark',
      'cosmetic case', 'vanity', 'jewelry box', 'pencil case',
      'ipad case', 'laptop sleeve', 'tech case',
      'cover', 'defender', 'strap', 'charm', 'twilly',
    ]
    if (excludes.some(function(e) { return combined.includes(e) })) return null

    // Also exclude if handle starts with "accessories-" and doesn't contain bag keywords
    if (handle.startsWith('accessories-') && !handle.includes('bag') && !handle.includes('tote') && !handle.includes('clutch') && !handle.includes('satchel')) return null

    // Try title first (often already includes brand), then with vendor prefix
    let normalized = normalize(title, null, null)
    if (!normalized) {
      const vendor = (product.vendor || '')
      // Avoid doubling brand name if title already starts with it
      if (!title.toLowerCase().startsWith(vendor.toLowerCase())) {
        normalized = normalize(vendor + ' ' + title, null, null)
      }
    }
    if (!normalized) return null

    const price = product.variants && product.variants[0] ? parseFloat(product.variants[0].price) : null
    if (!price || price === 0) return null

    const image = product.images && product.images[0] ? product.images[0].src : null
    const sourceId = product.id ? String(product.id) : null

    let color = null
    for (const c of COLORS) {
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
      localCurrency: this.config.currency,
      image: image,
      sourceUrl: this.baseUrl + '/products/' + product.handle,
      sourceId: sourceId,
      daysListed: 1,
    }
  }
}

module.exports = ShopifyScraper
