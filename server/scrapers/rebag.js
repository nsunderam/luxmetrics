const BaseScraper = require('./base-scraper')

class RebagScraper extends BaseScraper {
  constructor(config) {
    super('rebag', config)
    this.baseUrl = 'https://www.rebag.com'
  }

  getSearchUrls() {
    return [
      `${this.baseUrl}/collections/hermes-handbags?sort_by=created-descending`,
      `${this.baseUrl}/collections/chanel-handbags?sort_by=created-descending`,
      `${this.baseUrl}/collections/louis-vuitton-handbags?sort_by=created-descending`,
      `${this.baseUrl}/collections/dior-handbags?sort_by=created-descending`,
      `${this.baseUrl}/collections/bottega-veneta-handbags?sort_by=created-descending`,
      `${this.baseUrl}/collections/fendi-handbags?sort_by=created-descending`,
      `${this.baseUrl}/collections/prada-handbags?sort_by=created-descending`,
      `${this.baseUrl}/collections/saint-laurent-handbags?sort_by=created-descending`,
    ]
  }

  async parseListings(page) {
    try {
      await page.waitForSelector('[class*="product"], [class*="ProductCard"], article', { timeout: 8000 })
    } catch {
      console.warn('  No product cards found on page')
      return []
    }

    const rawListings = await page.evaluate(() => {
      const cards = document.querySelectorAll('[class*="ProductCard"], [class*="product-card"], .grid-item, article')
      const results = []

      cards.forEach(card => {
        try {
          const titleEl = card.querySelector('h2, h3, [class*="title"], [class*="name"]')
          const title = titleEl?.textContent?.trim()

          const priceEl = card.querySelector('[class*="price"], [class*="Price"]')
          const priceText = priceEl?.textContent?.trim()

          const imgEl = card.querySelector('img')
          const imageUrl = imgEl?.src || imgEl?.getAttribute('data-src')

          const linkEl = card.querySelector('a')
          const href = linkEl?.href || linkEl?.getAttribute('href')
          const sourceUrl = href?.startsWith('http') ? href : (href ? `https://www.rebag.com${href}` : null)

          const sourceId = sourceUrl?.split('/').pop()?.split('?')[0]

          const condEl = card.querySelector('[class*="condition"], [class*="Condition"]')
          const rawCondition = condEl?.textContent?.trim()

          if (title && priceText) {
            results.push({ title, priceText, imageUrl, sourceUrl, sourceId, rawCondition })
          }
        } catch (e) {}
      })

      return results
    })

    return rawListings
      .map(raw => this.normalizeListing({ ...raw, localCurrency: 'USD' }))
      .filter(Boolean)
  }
}

module.exports = RebagScraper
