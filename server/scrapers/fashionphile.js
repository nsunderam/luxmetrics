const { normalize, parsePrice } = require('../services/normalizer')

class FashionphileScraper {
  constructor(config) {
    this.resellerId = 'fashionphile'
    this.baseUrl = 'https://www.fashionphile.com'
    this.config = { maxPages: 10, perPage: 50, ...config }
  }

  async run() {
    console.log('  Scraping handbags collection via Shopify JSON API...')
    const allListings = await this.scrapeCollection('handbags')

    // Fetch condition from product pages (batched with delays)
    console.log('  Fetching condition data for ' + allListings.length + ' listings...')
    let condFound = 0
    for (let i = 0; i < allListings.length; i++) {
      const listing = allListings[i]
      try {
        const condition = await this.fetchCondition(listing.sourceUrl)
        if (condition) {
          listing.condition = condition
          condFound++
        }
      } catch (e) {
        // Silently skip — keep Pre-Owned default
      }
      // Small delay every 5 requests to avoid rate limiting
      if (i > 0 && i % 5 === 0) {
        await new Promise(function(r) { return setTimeout(r, 800) })
      }
    }
    console.log('  Condition found for ' + condFound + '/' + allListings.length + ' listings')

    console.log('  Total raw listings scraped: ' + allListings.length)
    return allListings
  }

  async fetchCondition(productUrl) {
    if (!productUrl) return null

    const res = await fetch(productUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null

    const html = await res.text()

    // Extract from: <h2 class="h6 fp-product__condition">Excellent</h2>
    const match = html.match(/class="h6 fp-product__condition"[^>]*>\s*([\w\s]+?)\s*</i)
    if (match) {
      const raw = match[1].trim().toLowerCase()
      if (raw === 'new' || raw === 'new with tags') return 'New'
      if (raw === 'excellent') return 'Excellent'
      if (raw === 'very good') return 'Very Good'
      if (raw === 'good') return 'Good'
      if (raw === 'shows wear') return 'Shows Wear'
      if (raw === 'worn') return 'Fair'
      if (raw === 'fair') return 'Fair'
      return raw.charAt(0).toUpperCase() + raw.slice(1)
    }

    // Fallback: check the thermometer pointer class
    const pointer = html.match(/fp-pointer-([\w_]+)/i)
    if (pointer) {
      const p = pointer[1].toLowerCase()
      if (p.startsWith('new')) return 'New'
      if (p.startsWith('excellent')) return 'Excellent'
      if (p.startsWith('shows') || p.startsWith('show')) return 'Shows Wear'
      if (p.startsWith('worn')) return 'Fair'
      if (p.startsWith('fair')) return 'Fair'
      if (p.startsWith('good') || p.startsWith('very')) return 'Very Good'
    }

    return null
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

    const titleLower = title.toLowerCase()
    const handle = (product.handle || '').toLowerCase()
    const combined = titleLower + ' ' + handle
    const excludes = [
      'card holder', 'card case', 'cardholder', 'coin purse', 'coin pouch',
      'wallet on chain', 'wallet-on-chain', 'woc',
      'wallet', 'key holder', 'key ring', 'keychain', 'phone case', 'phone pouch',
      'belt bag', 'belt-bag', 'chain belt',
      'pochette', 'pouch', 'o-case', 'o case', 'vanity case',
      'clutch', 'chain clutch', 'camera bag', 'camera case',
      'mini bag', 'nano bag', 'micro bag', 'nano ', 'micro ',
      'cosmetic', 'makeup', 'toiletry',
      'scarf', 'shoes', 'sneaker', 'sandal', 'boot', 'loafer', 'heel', 'flat',
      'watch', 'bracelet', 'necklace', 'earring', 'brooch', 'cufflink', 'ring ',
      'sunglasses', 'eyeglasses', 'hat', 'beanie', 'gloves', 'cap',
      'notebook', 'agenda', 'passport', 'luggage tag', 'bookmark',
      'jewelry box', 'pencil case', 'pen case',
      'ipad case', 'laptop sleeve', 'tech case',
      'cover', 'defender', 'strap', 'charm', 'twilly',
      'wristlet', 'zip around', 'continental', 'bifold', 'trifold',
      'espadrille', 'mule', 'pump', 'slide', 'trainer',
      'raffle', 'coupon', 'gift card', 'giftcard', 'voucher',
      'mini hl', 'nano speedy', 'nano noe', 'nano bag',
      'bandeau', 'headband', 'hair clip', 'barrette',
    ]
    if (excludes.some(function(e) { return combined.includes(e) })) return null

    const vendor = (product.vendor || '').toLowerCase()
    let normalized = normalize(title, null, null)
    if (!normalized) normalized = normalize(vendor + ' ' + title, null, null)
    if (!normalized) return null

    const price = product.variants && product.variants[0] ? parseFloat(product.variants[0].price) : null
    if (!price || price < 100) return null

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
      condition: 'Pre-Owned',  // Will be overwritten by fetchCondition
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
