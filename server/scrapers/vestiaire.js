const BaseScraper = require('./base-scraper')

class VestiaireScraper extends BaseScraper {
  constructor(config) {
    super('vestiaire', config)
    this.baseUrl = 'https://us.vestiairecollective.com'
  }

  getSearchUrls() {
    return [
      this.baseUrl + '/search/?q=hermes+birkin',
      this.baseUrl + '/search/?q=hermes+kelly',
      this.baseUrl + '/search/?q=chanel+classic+flap',
      this.baseUrl + '/search/?q=chanel+boy+bag',
      this.baseUrl + '/search/?q=louis+vuitton+neverfull',
      this.baseUrl + '/search/?q=dior+lady+dior',
      this.baseUrl + '/search/?q=bottega+veneta+cassette',
      this.baseUrl + '/search/?q=prada+galleria',
      this.baseUrl + '/search/?q=fendi+peekaboo',
      this.baseUrl + '/search/?q=loewe+puzzle',
    ]
  }

  async parseListings(page) {
    try {
      await page.waitForSelector('[class*="productCard__sGjCz"]', { timeout: 10000 })
    } catch {
      console.warn('  No product cards found on page')
      return []
    }

    const rawListings = await page.evaluate(function() {
      var cards = document.querySelectorAll('a[class*="productCard__sGjCz"]')
      var results = []

      cards.forEach(function(card) {
        try {
          var brandEl = card.querySelector('[class*="text--brand"]')
          var nameEl = card.querySelector('[class*="text--name"]')
          var priceEl = card.querySelector('[class*="text--price"] span')
          var imgEl = card.querySelector('img')
          var href = card.href

          var brand = brandEl ? brandEl.textContent.trim() : ''
          var name = nameEl ? nameEl.textContent.trim() : ''
          var priceText = priceEl ? priceEl.textContent.trim() : ''
          var imgSrc = imgEl ? (imgEl.src || imgEl.getAttribute('data-src')) : null

          // Extract numeric ID from URL
          var idMatch = href ? href.match(/(\d{6,})/) : null
          var sourceId = idMatch ? idMatch[1] : null

          var fullTitle = brand + ' ' + name

          if (fullTitle.trim() && priceText) {
            results.push({
              title: fullTitle,
              priceText: priceText,
              imageUrl: imgSrc,
              sourceUrl: href,
              sourceId: sourceId,
              rawCondition: null
            })
          }
        } catch(e) {}
      })

      return results
    })

    // Detect currency from price format
    var currency = 'USD'
    if (rawListings.length > 0) {
      var firstPrice = rawListings[0].priceText
      if (firstPrice.includes('£')) currency = 'GBP'
      else if (firstPrice.includes('€')) currency = 'EUR'
    }

    return rawListings
      .map(function(raw) { return this.normalizeListing(Object.assign({}, raw, { localCurrency: currency })) }.bind(this))
      .filter(Boolean)
  }
}

module.exports = VestiaireScraper
