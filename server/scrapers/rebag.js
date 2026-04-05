const BaseScraper = require('./base-scraper')

class RebagScraper extends BaseScraper {
  constructor(config) {
    super('rebag', config)
    this.baseUrl = 'https://www.rebag.com'
  }

  getSearchUrls() {
    return [
      this.baseUrl + '/shop/handbags/',
      this.baseUrl + '/shop/handbags/?page=2',
      this.baseUrl + '/shop/handbags/?page=3',
    ]
  }

  async parseListings(page) {
    try {
      await page.waitForSelector('.plp__product', { timeout: 10000 })
    } catch {
      console.warn('  No product cards found on page')
      return []
    }

    const rawListings = await page.evaluate(function() {
      var products = document.querySelectorAll('.plp__product')
      var results = []

      products.forEach(function(card) {
        try {
          var brand = card.querySelector('.products-carousel__card-designer')
          var titleEl = card.querySelector('.products-carousel__card-title')
          var priceEl = card.querySelector('.rewards-plus-plp__product-price-value')
          var linkEl = card.querySelector('a')
          var imgEl = card.querySelector('img')
          var condEl = card.querySelector('.products-carousel__tag')

          var brandText = brand ? brand.textContent.trim() : ''
          var titleText = titleEl ? titleEl.textContent.trim() : ''
          var priceText = priceEl ? priceEl.textContent.trim() : ''
          var href = linkEl ? linkEl.href : null
          var imgSrc = imgEl ? (imgEl.src || imgEl.getAttribute('data-src')) : null
          var rawCondition = condEl ? condEl.textContent.trim() : null

          // Extract sourceId from URL path
          var sourceId = href ? href.split('/').pop().split('?')[0] : null

          // Combine brand + title for normalization
          var fullTitle = brandText + ' ' + titleText

          if (fullTitle && priceText) {
            results.push({
              title: fullTitle,
              priceText: priceText,
              imageUrl: imgSrc,
              sourceUrl: href,
              sourceId: sourceId,
              rawCondition: rawCondition
            })
          }
        } catch(e) {}
      })

      return results
    })

    return rawListings
      .map(function(raw) { return this.normalizeListing(Object.assign({}, raw, { localCurrency: 'USD' })) }.bind(this))
      .filter(Boolean)
  }
}

module.exports = RebagScraper
