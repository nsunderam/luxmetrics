const { normalize, parsePrice } = require('../services/normalizer')

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15',
]

class BaseScraper {
  constructor(resellerId, config = {}) {
    this.resellerId = resellerId
    this.config = {
      headless: true,
      maxPages: 10,
      minDelay: 2000,
      maxDelay: 5000,
      timeout: 30000,
      ...config,
    }
    this.browser = null
    this.context = null
  }

  async init() {
    // Lazy-load playwright to avoid import errors if not installed
    const { chromium } = require('playwright')

    this.browser = await chromium.launch({
      headless: this.config.headless,
      args: ['--disable-blink-features=AutomationControlled'],
    })

    const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
    this.context = await this.browser.newContext({
      userAgent,
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      timezoneId: 'America/New_York',
    })

    // Block heavy resources to speed up scraping
    await this.context.route('**/*.{png,jpg,jpeg,gif,svg,woff,woff2,mp4,webm}', route => route.abort())
  }

  // Subclasses MUST implement these
  getSearchUrls() { throw new Error('getSearchUrls() not implemented') }
  async parseListings(page) { throw new Error('parseListings() not implemented') }

  async run() {
    await this.init()
    const allListings = []

    try {
      const urls = this.getSearchUrls()
      let pageCount = 0

      for (const url of urls) {
        if (pageCount >= this.config.maxPages) break

        try {
          const page = await this.context.newPage()
          console.log(`  Scraping: ${url}`)
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: this.config.timeout })

          // Wait a bit for dynamic content
          await page.waitForTimeout(1500)

          const listings = await this.parseListings(page)
          allListings.push(...listings)

          await page.close()
          pageCount++

          // Random delay between pages
          await this.delay()
        } catch (err) {
          console.warn(`  Failed to scrape ${url}: ${err.message}`)
        }
      }
    } finally {
      if (this.browser) await this.browser.close()
    }

    console.log(`  Total raw listings scraped: ${allListings.length}`)
    return allListings
  }

  async delay() {
    const ms = this.config.minDelay + Math.random() * (this.config.maxDelay - this.config.minDelay)
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Helper to normalize a raw scraped listing into the DB schema
  normalizeListing(raw) {
    const { title, priceText, rawCondition, imageUrl, sourceUrl, sourceId, localCurrency } = raw

    const price = parsePrice(priceText)
    if (!price) return null

    const normalized = normalize(title, rawCondition)
    if (!normalized) return null

    return {
      ...normalized,
      localPrice: price,
      localCurrency: localCurrency || 'USD',
      image: imageUrl || null,
      sourceUrl: sourceUrl || null,
      sourceId: sourceId || null,
      accessories: [],
      hardware: null,
      color: null,
      year: null,
      daysListed: 1,
    }
  }
}

module.exports = BaseScraper
