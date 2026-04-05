const scraperMap = {
  fashionphile: () => new (require('./fashionphile'))(),
  rebag: () => new (require('./rebag'))(),
  vestiaire: () => new (require('./vestiaire'))(),
}

function getScraper(resellerId, config) {
  const factory = scraperMap[resellerId]
  if (!factory) throw new Error(`No scraper registered for: ${resellerId}`)
  return factory(config)
}

function getAvailableScrapers() {
  return Object.keys(scraperMap)
}

module.exports = { getScraper, getAvailableScrapers }
