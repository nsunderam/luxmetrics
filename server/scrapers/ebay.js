const { normalize } = require('../services/normalizer')

// eBay Browse API category for Women's Bags & Handbags
const HANDBAG_CATEGORY = '169291'

// Only search for the exact brands we track
const BRAND_SEARCHES = [
  { query: 'Hermes Birkin', brand: 'hermes' },
  { query: 'Hermes Kelly', brand: 'hermes' },
  { query: 'Hermes Constance', brand: 'hermes' },
  { query: 'Hermes Picotin', brand: 'hermes' },
  { query: 'Chanel Classic Flap', brand: 'chanel' },
  { query: 'Chanel Boy Bag', brand: 'chanel' },
  { query: 'Chanel 19', brand: 'chanel' },
  { query: 'Chanel Deauville', brand: 'chanel' },
  { query: 'Chanel Gabrielle', brand: 'chanel' },
  { query: 'Louis Vuitton Neverfull', brand: 'louisvuitton' },
  { query: 'Louis Vuitton Speedy', brand: 'louisvuitton' },
  { query: 'Louis Vuitton Alma', brand: 'louisvuitton' },
  { query: 'Louis Vuitton Capucines', brand: 'louisvuitton' },
  { query: 'Louis Vuitton OnTheGo', brand: 'louisvuitton' },
  { query: 'Christian Dior Lady Dior', brand: 'dior' },
  { query: 'Dior Saddle Bag', brand: 'dior' },
  { query: 'Dior Book Tote', brand: 'dior' },
  { query: 'Dior Bobby', brand: 'dior' },
  { query: 'Goyard Saint Louis', brand: 'goyard' },
  { query: 'Goyard Anjou', brand: 'goyard' },
  { query: 'Bottega Veneta Jodie', brand: 'bottega' },
  { query: 'Bottega Veneta Cassette', brand: 'bottega' },
  { query: 'Bottega Veneta Pouch', brand: 'bottega' },
  { query: 'Celine Luggage', brand: 'celine' },
  { query: 'Celine Belt Bag', brand: 'celine' },
  { query: 'Celine Triomphe', brand: 'celine' },
  { query: 'Saint Laurent Loulou', brand: 'ysl' },
  { query: 'Saint Laurent Kate', brand: 'ysl' },
  { query: 'Saint Laurent Envelope', brand: 'ysl' },
  { query: 'Fendi Baguette', brand: 'fendi' },
  { query: 'Fendi Peekaboo', brand: 'fendi' },
  { query: 'Prada Galleria', brand: 'prada' },
  { query: 'Prada Re-Edition', brand: 'prada' },
  { query: 'Loewe Puzzle', brand: 'loewe' },
  { query: 'Loewe Hammock', brand: 'loewe' },
  { query: 'Valentino Rockstud', brand: 'valentino' },
  { query: 'Valentino VSling', brand: 'valentino' },
  { query: 'Valentino Roman Stud', brand: 'valentino' },
]

// Exclude non-bag items
const EXCLUDES = [
  'card holder', 'card case', 'cardholder', 'coin purse', 'coin pouch',
  'wallet', 'key holder', 'key ring', 'keychain', 'phone case',
  'belt bag', 'belt-bag', 'chain belt',
  'pochette', 'mini pouch', 'extra mini',
  'clutch', 'camera bag', 'camera case',
  'scarf', 'shoes', 'sneaker', 'sandal', 'boot', 'watch',
  'bracelet', 'necklace', 'earring', 'brooch', 'sunglasses',
  'charm', 'twilly', 'strap', 'notebook', 'agenda',
  'cover', 'defender', 'cosmetic',
]

const CONDITION_MAP = {
  1000: 'New',
  1500: 'New',      // New other
  2000: 'New',      // Certified refurbished
  2500: 'Excellent', // Seller refurbished
  3000: 'Pre-Owned',
  4000: 'Very Good',
  5000: 'Good',
  6000: 'Fair',
  7000: 'Fair',      // For parts
}

const COLORS = ['Black','Gold','Etoupe','Etain','White','Beige','Navy','Red','Rouge','Pink','Rose','Blue','Bleu','Green','Vert','Grey','Gris','Brown','Tan','Cream','Orange','Yellow','Burgundy','Bordeaux','Silver','Purple','Ivory']

class EbayScraper {
  constructor(config) {
    this.resellerId = 'ebay'
    this.clientId = process.env.EBAY_CLIENT_ID
    this.clientSecret = process.env.EBAY_CLIENT_SECRET
    this.oauthToken = process.env.EBAY_OAUTH_TOKEN
    this.token = null
    this.tokenExpiry = 0
    this.config = {
      maxPerSearch: 50,
      delayMs: 500,
      ...config,
    }
  }

  async getToken() {
    // Use pre-generated OAuth token if available
    if (this.oauthToken) return this.oauthToken

    if (this.token && Date.now() < this.tokenExpiry) return this.token

    if (!this.clientId || !this.clientSecret) {
      throw new Error('Set EBAY_OAUTH_TOKEN or both EBAY_CLIENT_ID and EBAY_CLIENT_SECRET')
    }

    const creds = Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64')
    const res = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + creds,
      },
      body: 'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope',
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error('eBay OAuth failed: ' + res.status + ' ' + text.slice(0, 200))
    }

    const data = await res.json()
    this.token = data.access_token
    this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
    return this.token
  }

  async run() {
    const token = await this.getToken()
    const allListings = []
    const seenIds = new Set()

    for (const search of BRAND_SEARCHES) {
      try {
        const listings = await this.searchBrand(search.query, token)
        // Deduplicate
        for (const l of listings) {
          if (!seenIds.has(l.sourceId)) {
            seenIds.add(l.sourceId)
            allListings.push(l)
          }
        }
        console.log('  eBay ' + search.query + ': ' + listings.length + ' listings')
        await new Promise(function(r) { return setTimeout(r, 500) })
      } catch (err) {
        console.warn('  eBay ' + search.query + ' failed: ' + err.message)
      }
    }

    console.log('  Total eBay listings scraped: ' + allListings.length)
    return allListings
  }

  async searchBrand(query, token) {
    // Use Buy It Now only, exclude auctions for stable pricing
    const params = new URLSearchParams({
      q: query,
      category_ids: HANDBAG_CATEGORY,
      filter: 'buyingOptions:{FIXED_PRICE},price:[100..],priceCurrency:USD',
      sort: 'newlyListed',
      limit: String(this.config.maxPerSearch),
    })

    const url = 'https://api.ebay.com/buy/browse/v1/item_summary/search?' + params.toString()

    const res = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
        'X-EBAY-C-ENDUSERCTX': 'contextualLocation=country=US',
      },
    })

    if (!res.ok) {
      if (res.status === 429) {
        console.warn('    eBay rate limited, waiting...')
        await new Promise(function(r) { return setTimeout(r, 5000) })
        return []
      }
      throw new Error('eBay API ' + res.status)
    }

    const data = await res.json()
    if (!data.itemSummaries || data.itemSummaries.length === 0) return []

    const listings = []
    for (const item of data.itemSummaries) {
      const parsed = this.parseItem(item)
      if (parsed) listings.push(parsed)
    }
    return listings
  }

  parseItem(item) {
    const title = item.title
    if (!title) return null

    // Exclude non-bag items
    const titleLower = title.toLowerCase()
    if (EXCLUDES.some(function(e) { return titleLower.includes(e) })) return null

    // Must match our normalizer
    const normalized = normalize(title, null, null)
    if (!normalized) return null

    // Extract price
    const price = item.price ? parseFloat(item.price.value) : null
    if (!price || price < 100) return null

    // Extract image
    const image = item.image ? item.image.imageUrl : (item.thumbnailImages && item.thumbnailImages[0] ? item.thumbnailImages[0].imageUrl : null)

    // Map condition
    const condId = item.condition ? parseInt(item.condition) : (item.conditionId ? parseInt(item.conditionId) : 3000)
    const condition = CONDITION_MAP[condId] || 'Pre-Owned'

    // Detect color
    let color = null
    for (const c of COLORS) {
      if (titleLower.includes(c.toLowerCase())) { color = c; break }
    }

    // Source ID from itemId
    const sourceId = item.itemId || item.legacyItemId || null
    if (!sourceId) return null

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
      condition: condition,
      year: null,
      accessories: [],
      localPrice: price,
      localCurrency: item.price ? item.price.currency : 'USD',
      image: image,
      sourceUrl: item.itemWebUrl || item.itemHref || null,
      sourceId: sourceId,
      daysListed: 1,
    }
  }
}

module.exports = EbayScraper
