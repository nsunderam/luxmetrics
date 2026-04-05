// Seeds the database with synthetic data from the frontend's mock generator
// This ensures the app works immediately while scrapers are being developed
const { initDB } = require('./init')

// Re-use the same generation logic from the frontend
const FAIR_VALUES = require('../config/fair-values.json')

const BRANDS = {
  hermes: { name: 'Hermès', tier: 'Ultra Luxury' },
  chanel: { name: 'Chanel', tier: 'Ultra Luxury' },
  dior: { name: 'Christian Dior', tier: 'High Luxury' },
  louisvuitton: { name: 'Louis Vuitton', tier: 'High Luxury' },
  goyard: { name: 'Goyard', tier: 'High Luxury' },
  bottega: { name: 'Bottega Veneta', tier: 'High Luxury' },
  celine: { name: 'Celine', tier: 'Luxury' },
  ysl: { name: 'Saint Laurent', tier: 'Luxury' },
  fendi: { name: 'Fendi', tier: 'Luxury' },
  prada: { name: 'Prada', tier: 'Luxury' },
  loewe: { name: 'Loewe', tier: 'Luxury' },
}

const CONDITIONS = ['New', 'Excellent', 'Very Good', 'Good', 'Fair']
const CONDITION_DISCOUNTS = { 'New': 1.0, 'Excellent': 0.92, 'Very Good': 0.82, 'Good': 0.70, 'Fair': 0.55 }

const COLORS = {
  hermes: ['Black', 'Gold', 'Etoupe', 'Etain', 'Bleu Nuit', 'Rouge Casaque', 'Rose Sakura', 'Vert Cypress', 'Craie'],
  chanel: ['Black', 'Beige', 'Navy', 'Red', 'White', 'Pink', 'Grey'],
  dior: ['Black', 'Latte', 'Grey', 'Blue', 'Red', 'Rose des Vents'],
  louisvuitton: ['Monogram', 'Damier Ebene', 'Damier Azur', 'Epi Noir', 'Empreinte Noir'],
  goyard: ['Black', 'Navy', 'Green', 'Red', 'Grey'],
  bottega: ['Black', 'Thunder', 'Chalk', 'Camping', 'Space'],
  celine: ['Black', 'Tan', 'Grey', 'Amazone', 'Dune'],
  ysl: ['Black', 'Dark Beige', 'Red', 'White'],
  fendi: ['Black', 'Brown', 'Pink', 'Yellow', 'Grey'],
  prada: ['Black', 'Cameo Beige', 'Astral Blue'],
  loewe: ['Tan', 'Black', 'Sand', 'Light Oat'],
}

const RESELLERS = [
  { id: 'fashionphile', currency: 'USD' }, { id: 'therealreal', currency: 'USD' },
  { id: 'rebag', currency: 'USD' }, { id: 'vestiaire', currency: 'EUR' },
  { id: 'collectorsquare', currency: 'EUR' }, { id: 'xupes', currency: 'GBP' },
  { id: 'luxurypromise', currency: 'GBP' }, { id: 'loveluxury', currency: 'GBP' },
  { id: 'labellov', currency: 'EUR' }, { id: 'saclabparis', currency: 'EUR' },
  { id: 'brandoff', currency: 'JPY' }, { id: 'reebonz', currency: 'SGD' },
  { id: 'luxcollect', currency: 'SGD' }, { id: 'bananasg', currency: 'SGD' },
  { id: 'prelovedbagsg', currency: 'SGD' }, { id: 'darveys', currency: 'INR' },
  { id: 'luxurygaragesale', currency: 'USD' }, { id: 'cresus', currency: 'EUR' },
  { id: 'designerexchange', currency: 'AED' }, { id: 'catchys', currency: 'KRW' },
]

const RATES = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.50, SGD: 1.34, INR: 83.50, AED: 3.67, KRW: 1320.00 }

const BAG_MODELS = [
  { modelKey: 'birkin-25-togo', brand: 'hermes', model: 'Birkin 25', material: 'Togo Leather', size: '25cm' },
  { modelKey: 'birkin-30-togo', brand: 'hermes', model: 'Birkin 30', material: 'Togo Leather', size: '30cm' },
  { modelKey: 'birkin-35-togo', brand: 'hermes', model: 'Birkin 35', material: 'Togo Leather', size: '35cm' },
  { modelKey: 'kelly-25-epsom', brand: 'hermes', model: 'Kelly 25', material: 'Epsom Leather', size: '25cm' },
  { modelKey: 'kelly-28-togo', brand: 'hermes', model: 'Kelly 28', material: 'Togo Leather', size: '28cm' },
  { modelKey: 'constance-18-evercolor', brand: 'hermes', model: 'Constance 18', material: 'Evercolor', size: '18cm' },
  { modelKey: 'picotin-18-clemence', brand: 'hermes', model: 'Picotin Lock 18', material: 'Clemence', size: '18cm' },
  { modelKey: 'chanel-classic-medium', brand: 'chanel', model: 'Classic Flap Medium', material: 'Caviar Leather', size: 'Medium' },
  { modelKey: 'chanel-classic-jumbo', brand: 'chanel', model: 'Classic Flap Jumbo', material: 'Caviar Leather', size: 'Jumbo' },
  { modelKey: 'chanel-classic-mini', brand: 'chanel', model: 'Classic Flap Mini', material: 'Lambskin', size: 'Mini' },
  { modelKey: 'chanel-boy-medium', brand: 'chanel', model: 'Boy Bag', material: 'Caviar Leather', size: 'Medium' },
  { modelKey: 'chanel-woc', brand: 'chanel', model: 'Wallet on Chain', material: 'Caviar Leather', size: 'WOC' },
  { modelKey: 'dior-lady-medium', brand: 'dior', model: 'Lady Dior', material: 'Cannage Lambskin', size: 'Medium' },
  { modelKey: 'dior-lady-mini', brand: 'dior', model: 'Lady Dior', material: 'Cannage Lambskin', size: 'Mini' },
  { modelKey: 'dior-saddle-medium', brand: 'dior', model: 'Saddle Bag', material: 'Oblique Canvas', size: 'Medium' },
  { modelKey: 'lv-neverfull-mm', brand: 'louisvuitton', model: 'Neverfull MM', material: 'Monogram Canvas', size: 'MM' },
  { modelKey: 'lv-speedy-30', brand: 'louisvuitton', model: 'Speedy Bandoulière 30', material: 'Monogram Canvas', size: '30' },
  { modelKey: 'lv-alma-bb', brand: 'louisvuitton', model: 'Alma BB', material: 'Epi Leather', size: 'BB' },
  { modelKey: 'lv-capucines-mm', brand: 'louisvuitton', model: 'Capucines MM', material: 'Taurillon Leather', size: 'MM' },
  { modelKey: 'lv-pochette-metis', brand: 'louisvuitton', model: 'Pochette Métis', material: 'Monogram Canvas', size: 'One Size' },
  { modelKey: 'goyard-st-louis-pm', brand: 'goyard', model: 'Saint Louis PM', material: 'Goyardine Canvas', size: 'PM' },
  { modelKey: 'bottega-jodie-mini', brand: 'bottega', model: 'Jodie', material: 'Intrecciato Nappa', size: 'Mini' },
  { modelKey: 'bottega-cassette', brand: 'bottega', model: 'Cassette', material: 'Intrecciato Nappa', size: 'Medium' },
  { modelKey: 'celine-luggage-nano', brand: 'celine', model: 'Luggage Nano', material: 'Drummed Calfskin', size: 'Nano' },
  { modelKey: 'ysl-loulou-medium', brand: 'ysl', model: 'Loulou', material: 'Quilted Leather', size: 'Medium' },
  { modelKey: 'fendi-peekaboo-medium', brand: 'fendi', model: 'Peekaboo ISeeU', material: 'Cuoio Romano', size: 'Medium' },
  { modelKey: 'prada-galleria-medium', brand: 'prada', model: 'Galleria', material: 'Saffiano Leather', size: 'Medium' },
  { modelKey: 'loewe-puzzle-small', brand: 'loewe', model: 'Puzzle', material: 'Classic Calfskin', size: 'Small' },
]

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function main() {
  const db = initDB()

  // Clear existing listings
  db.prepare('DELETE FROM listings').run()
  console.log('Cleared existing listings')

  const insert = db.prepare(`
    INSERT INTO listings (brand, brandName, tier, model, modelKey, material, size, color, hardware, condition, year, accessories, resellerId, localPrice, localCurrency, priceUSD, fairValueUSD, mispricingPct, daysListed, image, sourceUrl, sourceId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  let seed = 42
  let count = 0

  const tx = db.transaction(() => {
    for (const bag of BAG_MODELS) {
      const fairValueUSD = FAIR_VALUES[bag.modelKey]
      if (!fairValueUSD) continue

      const brandData = BRANDS[bag.brand]
      const brandColors = COLORS[bag.brand] || ['Black']
      const numListings = 4 + Math.floor(seededRandom(seed++) * 6)

      for (let i = 0; i < numListings; i++) {
        const reseller = RESELLERS[Math.floor(seededRandom(seed++) * RESELLERS.length)]
        const condition = CONDITIONS[Math.floor(seededRandom(seed++) * CONDITIONS.length)]
        const color = brandColors[Math.floor(seededRandom(seed++) * brandColors.length)]
        const condMult = CONDITION_DISCOUNTS[condition]
        const variance = -0.20 + seededRandom(seed++) * 0.50
        const priceUSD = Math.round(fairValueUSD * condMult * (1 + variance))
        const localRate = RATES[reseller.currency] || 1
        const localPrice = Math.round(priceUSD * localRate)
        const adjFMV = Math.round(fairValueUSD * condMult)
        const mispricingPct = variance * 100
        const daysListed = Math.floor(seededRandom(seed++) * 90) + 1
        const year = 2018 + Math.floor(seededRandom(seed++) * 7)
        const hw = bag.brand === 'hermes' ? 'Gold Hardware (GHW)' : 'Silver Hardware (SHW)'

        const accessories = []
        if (seededRandom(seed++) > 0.3) accessories.push('Box')
        if (seededRandom(seed++) > 0.2) accessories.push('Dust Bag')
        if (seededRandom(seed++) > 0.5) accessories.push('Receipt')

        insert.run(
          bag.brand, brandData.name, brandData.tier,
          bag.model, bag.modelKey, bag.material, bag.size,
          color, hw, condition, year,
          JSON.stringify(accessories),
          reseller.id, localPrice, reseller.currency,
          priceUSD, adjFMV, mispricingPct, daysListed,
          null, null, `seed-${bag.modelKey}-${i}`
        )
        count++
      }
    }
  })
  tx()

  console.log(`Seeded ${count} listings across ${BAG_MODELS.length} models`)
  db.close()
}

main()
