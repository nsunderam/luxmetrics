const BaseScraper = require('./base-scraper')

class VestiaireScraper extends BaseScraper {
  constructor(config) {
    super('vestiaire', config)
    this.baseUrl = 'https://www.vestiairecollective.com'
  }

  getSearchUrls() {
    return [
      `${this.baseUrl}/search/?q=hermes+birkin&category=bags`,
      `${this.baseUrl}/search/?q=hermes+kelly&category=bags`,
      `${this.baseUrl}/search/?q=chanel+classic+flap&category=bags`,
      `${this.baseUrl}/search/?q=chanel+boy+bag&category=bags`,
      `${this.baseUrl}/search/?q=louis+vuitton+neverfull&category=bags`,
      `${this.baseUrl}/search/?q=louis+vuitton+speedy&category=bags`,
      `${this.baseUrl}/search/?q=dior+lady+dior&category=bags`,
      `${this.baseUrl}/search/?q=bottega+veneta+jodie&category=bags`,
    ]
  }

  async parseListings(page) {
    try {
      await page.waitForSelector('[class*="product"], [data-testid*="product"], article', { timeout: 10000 })
    } catch {
      console.warn('  No product cards found on page')
      return []
    }

    const rawListings = await page.evaluate(() => {
      const cards = document.querySelectorAll('[class*="productCard"], [data-testid*="product-card"], [class*="catalog__product"], article')
      const results = []

      cards.forEach(card => {
        try {
          const titleEl = card.querySelector('[class*="title"], [class*="name"], h2, h3, p[class*="product"]')
          const title = titleEl?.textContent?.trim()

          const priceEl = card.querySelector('[class*="price"], [data-testid*="price"]')
          const priceText = priceEl?.textContent?.trim()

          const imgEl = card.querySelector('img')
          const imageUrl = imgEl?.src || imgEl?.getAttribute('data-src')

          const linkEl = card.querySelector('a')
          const href = linkEl?.href || linkEl?.getAttribute('href')
          const sourceUrl = href?.startsWith('http') ? href : (href ? `https://www.vestiairecollective.com${href}` : null)

          // Vestiaire URLs often contain a numeric ID
          const sourceId = sourceUrl?.match(/(\d{6,})/)?.[1]

          const condEl = card.querySelector('[class*="condition"]')
          const rawCondition = condEl?.textContent?.trim()

          if (title && priceText) {
            results.push({ title, priceText, imageUrl, sourceUrl, sourceId, rawCondition })
          }
        } catch (e) {}
      })

      return results
    })

    return rawListings
      .map(raw => this.normalizeListing({ ...raw, localCurrency: 'EUR' }))
      .filter(Boolean)
  }
}

module.exports = VestiaireScraper
