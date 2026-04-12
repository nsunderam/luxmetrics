// Fair market values in USD for reference pricing
const FAIR_VALUES = {
  'birkin-25-togo': 12500,
  'birkin-30-togo': 14000,
  'birkin-35-togo': 13000,
  'birkin-25-epsom': 11800,
  'birkin-30-epsom': 13200,
  'birkin-25-ostrich': 28000,
  'birkin-30-crocodile': 55000,
  'kelly-25-epsom': 14500,
  'kelly-28-togo': 13500,
  'kelly-32-togo': 12000,
  'kelly-pochette-epsom': 9800,
  'constance-18-evercolor': 12000,
  'constance-24-epsom': 14000,
  'picotin-18-clemence': 3800,
  'picotin-22-clemence': 4200,
  'garden-party-36': 2800,
  'chanel-classic-medium': 10500,
  'chanel-classic-jumbo': 11500,
  'chanel-classic-mini': 9000,
  'chanel-classic-small': 9800,
  'chanel-boy-medium': 7200,
  'chanel-boy-small': 6800,
  'chanel-19-medium': 6500,
  'chanel-19-large': 7000,
  'chanel-woc': 4200,
  'chanel-deauville-large': 4800,
  'chanel-gabrielle-medium': 5500,
  'dior-lady-medium': 6800,
  'dior-lady-small': 5800,
  'dior-lady-mini': 5200,
  'dior-saddle-medium': 4200,
  'dior-book-tote-large': 3800,
  'dior-bobby-medium': 4000,
  'dior-30montaigne': 4500,
  'lv-neverfull-mm': 2200,
  'lv-neverfull-gm': 2400,
  'lv-speedy-25': 1800,
  'lv-speedy-30': 1900,
  'lv-alma-bb': 2000,
  'lv-capucines-mm': 6500,
  'lv-capucines-bb': 5800,
  'lv-twist-mm': 4200,
  'lv-pochette-metis': 3200,
  'lv-onthego-mm': 3400,
  'goyard-st-louis-pm': 2200,
  'goyard-st-louis-gm': 2600,
  'goyard-anjou-mini': 3200,
  'goyard-cap-vert-pm': 2800,
  'bottega-jodie-mini': 3200,
  'bottega-jodie-teen': 3800,
  'bottega-cassette': 3500,
  'bottega-padded-cassette': 4200,
  'bottega-pouch': 3800,
  'bottega-arco-tote': 5200,
  'celine-luggage-nano': 3200,
  'celine-luggage-micro': 3800,
  'celine-belt-mini': 3000,
  'celine-triomphe': 3500,
  'celine-sangle': 3200,
  'ysl-loulou-medium': 2800,
  'ysl-loulou-small': 2500,
  'ysl-kate-medium': 2200,
  'ysl-envelope-medium': 2400,
  'fendi-baguette': 3800,
  'fendi-peekaboo-medium': 5200,
  'fendi-first-medium': 3500,
  'prada-galleria-medium': 3600,
  'prada-re-edition-2005': 2200,
  'prada-cleo': 2400,
  'loewe-puzzle-small': 3200,
  'loewe-puzzle-medium': 3600,
  'loewe-hammock-small': 3000,
}

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
  valentino: { name: 'Valentino', tier: 'Luxury' },
  gucci: { name: 'Gucci', tier: 'High Luxury' },
  balenciaga: { name: 'Balenciaga', tier: 'Luxury' },
  miumiu: { name: 'Miu Miu', tier: 'Luxury' },
}

const CONDITIONS = ['New', 'Excellent', 'Very Good', 'Good', 'Fair']
const CONDITION_DISCOUNTS = { 'New': 1.0, 'Excellent': 0.92, 'Very Good': 0.82, 'Good': 0.70, 'Fair': 0.55 }

const COLORS = {
  hermes: ['Black', 'Gold', 'Etoupe', 'Etain', 'Bleu Nuit', 'Bleu Electric', 'Rouge Casaque', 'Rose Sakura', 'Vert Cypress', 'Craie', 'Gris Perle', 'Bambou', 'Bleu Frida', 'Jaune de Naples', 'Mauve Sylvestre'],
  chanel: ['Black', 'Beige', 'Navy', 'Red', 'White', 'Pink', 'Grey', 'Burgundy', 'Light Blue', 'Green'],
  dior: ['Black', 'Latte', 'Grey', 'Blue', 'Red', 'Rose des Vents', 'Blush', 'Cloud Blue', 'Amber'],
  louisvuitton: ['Monogram', 'Damier Ebene', 'Damier Azur', 'Epi Noir', 'Epi Rose', 'Empreinte Noir', 'Empreinte Tourterelle'],
  goyard: ['Black', 'Navy', 'Green', 'Red', 'Grey', 'Bordeaux', 'Sky Blue', 'Yellow', 'Orange', 'White'],
  bottega: ['Black', 'Thunder', 'Chalk', 'Camping', 'Space', 'Barolo', 'Travertine', 'Kiwi', 'Tangerine'],
  celine: ['Black', 'Tan', 'Grey', 'Amazone', 'Dune', 'Slate'],
  ysl: ['Black', 'Dark Beige', 'Red', 'White', 'Emerald'],
  fendi: ['Black', 'Brown', 'Pink', 'Yellow', 'Grey', 'Light Blue'],
  prada: ['Black', 'Cameo Beige', 'Astral Blue', 'Alabaster Pink'],
  loewe: ['Tan', 'Black', 'Sand', 'Light Oat', 'Ocean'],
}

const HARDWARE = ['Gold Hardware (GHW)', 'Palladium Hardware (PHW)', 'Silver Hardware (SHW)', 'Ruthenium Hardware (RHW)', 'Rose Gold Hardware (RGHW)']

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateListings() {
  const listings = []
  let id = 1
  const resellers = [
    { id: 'fashionphile', currency: 'USD' },
    { id: 'therealreal', currency: 'USD' },
    { id: 'rebag', currency: 'USD' },
    { id: 'vestiaire', currency: 'EUR' },
    { id: 'collectorsquare', currency: 'EUR' },
    { id: 'xupes', currency: 'GBP' },
    { id: 'luxurypromise', currency: 'GBP' },
    { id: 'loveluxury', currency: 'GBP' },
    { id: 'labellov', currency: 'EUR' },
    { id: 'saclabparis', currency: 'EUR' },
    { id: 'brandoff', currency: 'JPY' },
    { id: 'reebonz', currency: 'SGD' },
    { id: 'luxcollect', currency: 'SGD' },
    { id: 'bananasg', currency: 'SGD' },
    { id: 'prelovedbagsg', currency: 'SGD' },
    { id: 'darveys', currency: 'INR' },
    { id: 'luxurygaragesale', currency: 'USD' },
    { id: 'cresus', currency: 'EUR' },
    { id: 'designerexchange', currency: 'AED' },
    { id: 'catchys', currency: 'KRW' },
  ]

  const CURRENCY_RATES = {
    USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.50, SGD: 1.34,
    INR: 83.50, AED: 3.67, KRW: 1320.00, HKD: 7.82, AUD: 1.53,
  }

  const bagModels = [
    // Hermès
    { modelKey: 'birkin-25-togo', brand: 'hermes', model: 'Birkin 25', material: 'Togo Leather', size: '25cm', image: 'birkin' },
    { modelKey: 'birkin-30-togo', brand: 'hermes', model: 'Birkin 30', material: 'Togo Leather', size: '30cm', image: 'birkin' },
    { modelKey: 'birkin-35-togo', brand: 'hermes', model: 'Birkin 35', material: 'Togo Leather', size: '35cm', image: 'birkin' },
    { modelKey: 'birkin-25-epsom', brand: 'hermes', model: 'Birkin 25', material: 'Epsom Leather', size: '25cm', image: 'birkin' },
    { modelKey: 'birkin-25-ostrich', brand: 'hermes', model: 'Birkin 25', material: 'Ostrich', size: '25cm', image: 'birkin' },
    { modelKey: 'birkin-30-crocodile', brand: 'hermes', model: 'Birkin 30', material: 'Niloticus Crocodile', size: '30cm', image: 'birkin' },
    { modelKey: 'kelly-25-epsom', brand: 'hermes', model: 'Kelly 25', material: 'Epsom Leather', size: '25cm', image: 'kelly' },
    { modelKey: 'kelly-28-togo', brand: 'hermes', model: 'Kelly 28', material: 'Togo Leather', size: '28cm', image: 'kelly' },
    { modelKey: 'kelly-32-togo', brand: 'hermes', model: 'Kelly 32', material: 'Togo Leather', size: '32cm', image: 'kelly' },
    { modelKey: 'kelly-pochette-epsom', brand: 'hermes', model: 'Kelly Pochette', material: 'Epsom Leather', size: 'Pochette', image: 'kelly' },
    { modelKey: 'constance-18-evercolor', brand: 'hermes', model: 'Constance 18', material: 'Evercolor', size: '18cm', image: 'constance' },
    { modelKey: 'constance-24-epsom', brand: 'hermes', model: 'Constance 24', material: 'Epsom Leather', size: '24cm', image: 'constance' },
    { modelKey: 'picotin-18-clemence', brand: 'hermes', model: 'Picotin Lock 18', material: 'Clemence', size: '18cm', image: 'picotin' },
    { modelKey: 'picotin-22-clemence', brand: 'hermes', model: 'Picotin Lock 22', material: 'Clemence', size: '22cm', image: 'picotin' },
    { modelKey: 'garden-party-36', brand: 'hermes', model: 'Garden Party 36', material: 'Negonda/Toile', size: '36cm', image: 'garden' },
    // Chanel
    { modelKey: 'chanel-classic-medium', brand: 'chanel', model: 'Classic Flap Medium', material: 'Caviar Leather', size: 'Medium/Large', image: 'classic' },
    { modelKey: 'chanel-classic-jumbo', brand: 'chanel', model: 'Classic Flap Jumbo', material: 'Caviar Leather', size: 'Jumbo', image: 'classic' },
    { modelKey: 'chanel-classic-mini', brand: 'chanel', model: 'Classic Flap Mini', material: 'Lambskin', size: 'Mini', image: 'classic' },
    { modelKey: 'chanel-classic-small', brand: 'chanel', model: 'Classic Flap Small', material: 'Caviar Leather', size: 'Small', image: 'classic' },
    { modelKey: 'chanel-boy-medium', brand: 'chanel', model: 'Boy Bag', material: 'Caviar Leather', size: 'Medium', image: 'boy' },
    { modelKey: 'chanel-boy-small', brand: 'chanel', model: 'Boy Bag', material: 'Caviar Leather', size: 'Small', image: 'boy' },
    { modelKey: 'chanel-19-medium', brand: 'chanel', model: 'Chanel 19', material: 'Lambskin', size: 'Medium', image: '19' },
    { modelKey: 'chanel-woc', brand: 'chanel', model: 'Wallet on Chain', material: 'Caviar Leather', size: 'WOC', image: 'woc' },
    { modelKey: 'chanel-deauville-large', brand: 'chanel', model: 'Deauville Tote', material: 'Canvas/Leather', size: 'Large', image: 'deauville' },
    { modelKey: 'chanel-gabrielle-medium', brand: 'chanel', model: 'Gabrielle Hobo', material: 'Aged Calfskin', size: 'Medium', image: 'gabrielle' },
    // Dior
    { modelKey: 'dior-lady-medium', brand: 'dior', model: 'Lady Dior', material: 'Cannage Lambskin', size: 'Medium', image: 'lady' },
    { modelKey: 'dior-lady-small', brand: 'dior', model: 'Lady Dior', material: 'Cannage Lambskin', size: 'Small', image: 'lady' },
    { modelKey: 'dior-lady-mini', brand: 'dior', model: 'Lady Dior', material: 'Cannage Lambskin', size: 'Mini', image: 'lady' },
    { modelKey: 'dior-saddle-medium', brand: 'dior', model: 'Saddle Bag', material: 'Oblique Canvas', size: 'Medium', image: 'saddle' },
    { modelKey: 'dior-book-tote-large', brand: 'dior', model: 'Book Tote', material: 'Oblique Canvas', size: 'Large', image: 'booktote' },
    { modelKey: 'dior-bobby-medium', brand: 'dior', model: 'Bobby Bag', material: 'Box Calfskin', size: 'Medium', image: 'bobby' },
    { modelKey: 'dior-30montaigne', brand: 'dior', model: '30 Montaigne', material: 'Box Calfskin', size: 'Medium', image: 'montaigne' },
    // Louis Vuitton
    { modelKey: 'lv-neverfull-mm', brand: 'louisvuitton', model: 'Neverfull MM', material: 'Monogram Canvas', size: 'MM', image: 'neverfull' },
    { modelKey: 'lv-neverfull-gm', brand: 'louisvuitton', model: 'Neverfull GM', material: 'Monogram Canvas', size: 'GM', image: 'neverfull' },
    { modelKey: 'lv-speedy-25', brand: 'louisvuitton', model: 'Speedy Bandoulière 25', material: 'Monogram Canvas', size: '25', image: 'speedy' },
    { modelKey: 'lv-speedy-30', brand: 'louisvuitton', model: 'Speedy Bandoulière 30', material: 'Monogram Canvas', size: '30', image: 'speedy' },
    { modelKey: 'lv-alma-bb', brand: 'louisvuitton', model: 'Alma BB', material: 'Epi Leather', size: 'BB', image: 'alma' },
    { modelKey: 'lv-capucines-mm', brand: 'louisvuitton', model: 'Capucines MM', material: 'Taurillon Leather', size: 'MM', image: 'capucines' },
    { modelKey: 'lv-capucines-bb', brand: 'louisvuitton', model: 'Capucines BB', material: 'Taurillon Leather', size: 'BB', image: 'capucines' },
    { modelKey: 'lv-twist-mm', brand: 'louisvuitton', model: 'Twist MM', material: 'Epi Leather', size: 'MM', image: 'twist' },
    { modelKey: 'lv-pochette-metis', brand: 'louisvuitton', model: 'Pochette Métis', material: 'Monogram Canvas', size: 'One Size', image: 'metis' },
    { modelKey: 'lv-onthego-mm', brand: 'louisvuitton', model: 'OnTheGo MM', material: 'Monogram Empreinte', size: 'MM', image: 'onthego' },
    // Goyard
    { modelKey: 'goyard-st-louis-pm', brand: 'goyard', model: 'Saint Louis PM', material: 'Goyardine Canvas', size: 'PM', image: 'stlouis' },
    { modelKey: 'goyard-st-louis-gm', brand: 'goyard', model: 'Saint Louis GM', material: 'Goyardine Canvas', size: 'GM', image: 'stlouis' },
    { modelKey: 'goyard-anjou-mini', brand: 'goyard', model: 'Anjou Mini', material: 'Goyardine Canvas', size: 'Mini', image: 'anjou' },
    { modelKey: 'goyard-cap-vert-pm', brand: 'goyard', model: 'Cap Vert PM', material: 'Goyardine Canvas', size: 'PM', image: 'capvert' },
    // Bottega Veneta
    { modelKey: 'bottega-jodie-mini', brand: 'bottega', model: 'Jodie', material: 'Intrecciato Nappa', size: 'Mini', image: 'jodie' },
    { modelKey: 'bottega-jodie-teen', brand: 'bottega', model: 'Jodie', material: 'Intrecciato Nappa', size: 'Teen', image: 'jodie' },
    { modelKey: 'bottega-cassette', brand: 'bottega', model: 'Cassette', material: 'Intrecciato Nappa', size: 'Medium', image: 'cassette' },
    { modelKey: 'bottega-padded-cassette', brand: 'bottega', model: 'Padded Cassette', material: 'Intrecciato Nappa', size: 'Medium', image: 'cassette' },
    { modelKey: 'bottega-pouch', brand: 'bottega', model: 'The Pouch', material: 'Butter Calfskin', size: 'Medium', image: 'pouch' },
    { modelKey: 'bottega-arco-tote', brand: 'bottega', model: 'Arco Tote', material: 'Intrecciato Calfskin', size: 'Medium', image: 'arco' },
    // Celine
    { modelKey: 'celine-luggage-nano', brand: 'celine', model: 'Luggage Nano', material: 'Drummed Calfskin', size: 'Nano', image: 'luggage' },
    { modelKey: 'celine-luggage-micro', brand: 'celine', model: 'Luggage Micro', material: 'Drummed Calfskin', size: 'Micro', image: 'luggage' },
    { modelKey: 'celine-belt-mini', brand: 'celine', model: 'Belt Bag', material: 'Grained Calfskin', size: 'Mini', image: 'belt' },
    { modelKey: 'celine-triomphe', brand: 'celine', model: 'Triomphe', material: 'Calfskin', size: 'Medium', image: 'triomphe' },
    { modelKey: 'celine-sangle', brand: 'celine', model: 'Sangle Seau', material: 'Soft Grained Calfskin', size: 'Small', image: 'sangle' },
    // Saint Laurent
    { modelKey: 'ysl-loulou-medium', brand: 'ysl', model: 'Loulou', material: 'Quilted Leather', size: 'Medium', image: 'loulou' },
    { modelKey: 'ysl-loulou-small', brand: 'ysl', model: 'Loulou', material: 'Quilted Leather', size: 'Small', image: 'loulou' },
    { modelKey: 'ysl-kate-medium', brand: 'ysl', model: 'Kate', material: 'Grain de Poudre', size: 'Medium', image: 'kate' },
    { modelKey: 'ysl-envelope-medium', brand: 'ysl', model: 'Envelope', material: 'Quilted Leather', size: 'Medium', image: 'envelope' },
    // Fendi
    { modelKey: 'fendi-baguette', brand: 'fendi', model: 'Baguette', material: 'FF Jacquard', size: 'Medium', image: 'baguette' },
    { modelKey: 'fendi-peekaboo-medium', brand: 'fendi', model: 'Peekaboo ISeeU', material: 'Cuoio Romano', size: 'Medium', image: 'peekaboo' },
    { modelKey: 'fendi-first-medium', brand: 'fendi', model: 'Fendi First', material: 'Nappa Leather', size: 'Medium', image: 'first' },
    // Prada
    { modelKey: 'prada-galleria-medium', brand: 'prada', model: 'Galleria', material: 'Saffiano Leather', size: 'Medium', image: 'galleria' },
    { modelKey: 'prada-re-edition-2005', brand: 'prada', model: 'Re-Edition 2005', material: 'Saffiano Leather', size: 'One Size', image: 'reedition' },
    { modelKey: 'prada-cleo', brand: 'prada', model: 'Cleo', material: 'Brushed Leather', size: 'Medium', image: 'cleo' },
    // Loewe
    { modelKey: 'loewe-puzzle-small', brand: 'loewe', model: 'Puzzle', material: 'Classic Calfskin', size: 'Small', image: 'puzzle' },
    { modelKey: 'loewe-puzzle-medium', brand: 'loewe', model: 'Puzzle', material: 'Classic Calfskin', size: 'Medium', image: 'puzzle' },
    { modelKey: 'loewe-hammock-small', brand: 'loewe', model: 'Hammock', material: 'Classic Calfskin', size: 'Small', image: 'hammock' },
  ]

  let seed = 42

  for (const bag of bagModels) {
    const fairValueUSD = FAIR_VALUES[bag.modelKey]
    const brandColors = COLORS[bag.brand]
    const brandData = BRANDS[bag.brand]

    // Generate 3-8 listings per bag model
    const numListings = 3 + Math.floor(seededRandom(seed++) * 6)

    for (let i = 0; i < numListings; i++) {
      const reseller = resellers[Math.floor(seededRandom(seed++) * resellers.length)]
      const condition = CONDITIONS[Math.floor(seededRandom(seed++) * CONDITIONS.length)]
      const color = brandColors[Math.floor(seededRandom(seed++) * brandColors.length)]
      const hw = bag.brand === 'hermes'
        ? HARDWARE[Math.floor(seededRandom(seed++) * 2)]
        : HARDWARE[Math.floor(seededRandom(seed++) * HARDWARE.length)]

      const conditionMultiplier = CONDITION_DISCOUNTS[condition]

      // Add regional pricing variance (-20% to +30% to simulate mispricing)
      const pricingVariance = -0.20 + seededRandom(seed++) * 0.50
      const priceUSD = Math.round(fairValueUSD * conditionMultiplier * (1 + pricingVariance))

      // Convert to local currency
      const localRate = CURRENCY_RATES[reseller.currency]
      const localPrice = Math.round(priceUSD * localRate)

      // Days listed
      const daysListed = Math.floor(seededRandom(seed++) * 90) + 1

      // Include accessories
      const hasBox = seededRandom(seed++) > 0.3
      const hasDustbag = seededRandom(seed++) > 0.2
      const hasReceipt = seededRandom(seed++) > 0.5
      const hasCloches = bag.brand === 'hermes' && seededRandom(seed++) > 0.4
      const hasCareCard = seededRandom(seed++) > 0.3

      const accessories = []
      if (hasBox) accessories.push('Box')
      if (hasDustbag) accessories.push('Dust Bag')
      if (hasReceipt) accessories.push('Receipt')
      if (hasCloches) accessories.push('Clochette & Keys')
      if (hasCareCard) accessories.push('Care Card')

      // Year
      const year = 2018 + Math.floor(seededRandom(seed++) * 7)

      listings.push({
        id: id++,
        brand: bag.brand,
        brandName: brandData.name,
        tier: brandData.tier,
        model: bag.model,
        modelKey: bag.modelKey,
        material: bag.material,
        size: bag.size,
        color,
        hardware: hw,
        condition,
        year,
        accessories,
        resellerId: reseller.id,
        localPrice,
        localCurrency: reseller.currency,
        priceUSD,
        fairValueUSD: Math.round(fairValueUSD * conditionMultiplier),
        mispricingPct: pricingVariance * 100,
        daysListed,
        image: bag.image,
      })
    }
  }

  return listings
}

export const LISTINGS = generateListings()
export { BRANDS, CONDITIONS, FAIR_VALUES }
