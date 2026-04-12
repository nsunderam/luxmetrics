// Brand detection patterns
const BRAND_PATTERNS = [
  { pattern: /herm[eè]s/i, brand: 'hermes', brandName: 'Hermès', tier: 'Ultra Luxury' },
  { pattern: /chanel/i, brand: 'chanel', brandName: 'Chanel', tier: 'Ultra Luxury' },
  { pattern: /christian\s*dior|lady\s*dior|\bdior\b/i, brand: 'dior', brandName: 'Christian Dior', tier: 'High Luxury' },
  { pattern: /louis\s*vuitton|\bLV\b/i, brand: 'louisvuitton', brandName: 'Louis Vuitton', tier: 'High Luxury' },
  { pattern: /goyard/i, brand: 'goyard', brandName: 'Goyard', tier: 'High Luxury' },
  { pattern: /bottega\s*veneta/i, brand: 'bottega', brandName: 'Bottega Veneta', tier: 'High Luxury' },
  { pattern: /celine|céline/i, brand: 'celine', brandName: 'Celine', tier: 'Luxury' },
  { pattern: /saint\s*laurent|\bYSL\b/i, brand: 'ysl', brandName: 'Saint Laurent', tier: 'Luxury' },
  { pattern: /fendi/i, brand: 'fendi', brandName: 'Fendi', tier: 'Luxury' },
  { pattern: /prada/i, brand: 'prada', brandName: 'Prada', tier: 'Luxury' },
  { pattern: /loewe/i, brand: 'loewe', brandName: 'Loewe', tier: 'Luxury' },
  { pattern: /valentino\s*garavani|valentino/i, brand: 'valentino', brandName: 'Valentino', tier: 'Luxury' },
  { pattern: /gucci/i, brand: 'gucci', brandName: 'Gucci', tier: 'High Luxury' },
  { pattern: /balenciaga/i, brand: 'balenciaga', brandName: 'Balenciaga', tier: 'Luxury' },
  { pattern: /miu\s*miu/i, brand: 'miumiu', brandName: 'Miu Miu', tier: 'Luxury' },
  { pattern: /chlo[eé]|chloe/i, brand: 'chloe', brandName: 'Chloé', tier: 'Luxury' },
]

// Model detection patterns per brand
const MODEL_PATTERNS = {
  hermes: [
    { pattern: /birkin\s*(\d+)/i, model: 'Birkin', sizeGroup: 1, sizeSuffix: 'cm' },
    { pattern: /kelly\s*pochette/i, model: 'Kelly Pochette', size: 'Pochette' },
    { pattern: /kelly\s*(\d+)/i, model: 'Kelly', sizeGroup: 1, sizeSuffix: 'cm' },
    { pattern: /constance\s*(\d+)/i, model: 'Constance', sizeGroup: 1, sizeSuffix: 'cm' },
    { pattern: /picotin\s*(?:lock\s*)?(\d+)/i, model: 'Picotin Lock', sizeGroup: 1, sizeSuffix: 'cm' },
    { pattern: /garden\s*party\s*(\d+)/i, model: 'Garden Party', sizeGroup: 1, sizeSuffix: 'cm' },
  ],
  chanel: [
    { pattern: /classic\s*(?:double\s*)?flap.*?(mini|small|medium|large|jumbo|maxi)/i, model: 'Classic Flap', sizeGroup: 1 },
    { pattern: /classic\s*(?:double\s*)?flap/i, model: 'Classic Flap', size: 'Medium' },
    { pattern: /(?:medium|small|large|jumbo|maxi)\s*(?:classic\s*)?(?:double\s*)?flap/i, model: 'Classic Flap', size: 'Medium' },
    { pattern: /boy\s*(?:bag|chanel)?.*?(small|medium|large|new medium|old medium)/i, model: 'Boy Bag', sizeGroup: 1 },
    { pattern: /boy\s*(?:bag|chanel)/i, model: 'Boy Bag', size: 'Medium' },
    { pattern: /chanel\s*19.*?(small|medium|large)/i, model: 'Chanel 19', sizeGroup: 1 },
    { pattern: /chanel\s*19/i, model: 'Chanel 19', size: 'Medium' },
    { pattern: /wallet\s*on\s*chain|WOC/i, model: 'Wallet on Chain', size: 'WOC' },
    { pattern: /small\s*deauville|deauville.*small/i, model: 'Deauville Tote', size: 'Small' },
    { pattern: /medium\s*deauville|deauville.*medium/i, model: 'Deauville Tote', size: 'Medium' },
    { pattern: /deauville/i, model: 'Deauville Tote', size: 'Large' },
    { pattern: /gabrielle/i, model: 'Gabrielle Hobo', size: 'Medium' },
    { pattern: /2\.55\s*reissue|reissue.*?(mini|224|225|226|227)/i, model: '2.55 Reissue', size: '226' },
    { pattern: /2\.55|reissue/i, model: '2.55 Reissue', size: '226' },
    { pattern: /grand\s*shopping\s*tote|GST/i, model: 'Grand Shopping Tote', size: 'Large' },
    { pattern: /coco\s*handle/i, model: 'Coco Handle', size: 'Medium' },
    { pattern: /trendy\s*cc/i, model: 'Trendy CC', size: 'Medium' },
    { pattern: /mini\s*flap/i, model: 'Classic Flap', size: 'Mini' },
    { pattern: /jumbo\s*flap/i, model: 'Classic Flap', size: 'Jumbo' },
  ],
  dior: [
    { pattern: /lady\s*dior.*?(mini|small|medium|large)/i, model: 'Lady Dior', sizeGroup: 1 },
    { pattern: /lady\s*dior/i, model: 'Lady Dior', size: 'Medium' },
    { pattern: /saddle/i, model: 'Saddle Bag', size: 'Medium' },
    { pattern: /book\s*tote/i, model: 'Book Tote', size: 'Large' },
    { pattern: /bobby/i, model: 'Bobby Bag', size: 'Medium' },
    { pattern: /30\s*montaigne/i, model: '30 Montaigne', size: 'Medium' },
  ],
  louisvuitton: [
    { pattern: /neverfull\s*(pm|mm|gm)/i, model: 'Neverfull', sizeGroup: 1 },
    { pattern: /neverfull/i, model: 'Neverfull', size: 'MM' },
    { pattern: /speedy\s*(?:bandouli[eè]re\s*)?(\d+)/i, model: 'Speedy Bandoulière', sizeGroup: 1 },
    { pattern: /speedy/i, model: 'Speedy Bandoulière', size: '30' },
    { pattern: /alma\s*(bb|pm|mm|gm)/i, model: 'Alma', sizeGroup: 1 },
    { pattern: /alma/i, model: 'Alma', size: 'PM' },
    { pattern: /capucines\s*(bb|pm|mm|gm)/i, model: 'Capucines', sizeGroup: 1 },
    { pattern: /twist\s*(pm|mm|gm)/i, model: 'Twist', sizeGroup: 1 },
    { pattern: /pochette\s*m[eé]tis/i, model: 'Pochette Métis', size: 'One Size' },
    { pattern: /on\s*the\s*go\s*(pm|mm|gm)/i, model: 'OnTheGo', sizeGroup: 1 },
    { pattern: /onthego\s*(pm|mm|gm)/i, model: 'OnTheGo', sizeGroup: 1 },
    { pattern: /totally\s*(pm|mm|gm)/i, model: 'Totally', sizeGroup: 1 },
    { pattern: /totally/i, model: 'Totally', size: 'MM' },
    { pattern: /artsy\s*(mm|gm)/i, model: 'Artsy', sizeGroup: 1 },
    { pattern: /artsy/i, model: 'Artsy', size: 'MM' },
    { pattern: /keepall\s*(?:bandouli[eè]re\s*)?(\d+)/i, model: 'Keepall', sizeGroup: 1 },
    { pattern: /petit\s*no[eé]/i, model: 'Petit Noé', size: 'PM' },
    { pattern: /no[eé]\s*(bb|pm|mm|gm)/i, model: 'Noé', sizeGroup: 1 },
    { pattern: /\bnoe\b|\bno[eé]\b/i, model: 'Noé', size: 'MM' },
    { pattern: /dauphine\s*(mini|mm)/i, model: 'Dauphine', sizeGroup: 1 },
    { pattern: /dauphine/i, model: 'Dauphine', size: 'MM' },
    { pattern: /montaigne\s*(bb|mm|gm)/i, model: 'Montaigne', sizeGroup: 1 },
    { pattern: /favorite\s*(pm|mm)/i, model: 'Favorite', sizeGroup: 1 },
    { pattern: /graceful\s*(pm|mm)/i, model: 'Graceful', sizeGroup: 1 },
  ],
  goyard: [
    { pattern: /saint\s*louis\s*(pm|gm)/i, model: 'Saint Louis', sizeGroup: 1 },
    { pattern: /anjou\s*(mini|pm|gm)/i, model: 'Anjou', sizeGroup: 1 },
    { pattern: /cap\s*vert/i, model: 'Cap Vert', size: 'PM' },
  ],
  bottega: [
    { pattern: /jodie\s*(mini|teen|small|medium)/i, model: 'Jodie', sizeGroup: 1 },
    { pattern: /jodie/i, model: 'Jodie', size: 'Mini' },
    { pattern: /padded\s*cassette/i, model: 'Padded Cassette', size: 'Medium' },
    { pattern: /cassette/i, model: 'Cassette', size: 'Medium' },
    { pattern: /pouch/i, model: 'The Pouch', size: 'Medium' },
    { pattern: /arco\s*tote/i, model: 'Arco Tote', size: 'Medium' },
  ],
  celine: [
    { pattern: /luggage\s*(nano|micro|mini|small|medium)/i, model: 'Luggage', sizeGroup: 1 },
    { pattern: /belt\s*bag\s*(nano|micro|mini|small|medium)/i, model: 'Belt Bag', sizeGroup: 1 },
    { pattern: /belt\s*bag/i, model: 'Belt Bag', size: 'Mini' },
    { pattern: /triomphe/i, model: 'Triomphe', size: 'Medium' },
    { pattern: /sangle/i, model: 'Sangle Seau', size: 'Small' },
  ],
  ysl: [
    { pattern: /loulou\s*(small|medium|large)/i, model: 'Loulou', sizeGroup: 1 },
    { pattern: /loulou/i, model: 'Loulou', size: 'Medium' },
    { pattern: /kate\s*(small|medium|large)/i, model: 'Kate', sizeGroup: 1 },
    { pattern: /kate/i, model: 'Kate', size: 'Medium' },
    { pattern: /envelope/i, model: 'Envelope', size: 'Medium' },
  ],
  fendi: [
    { pattern: /mini\s*peekaboo|peekaboo.*mini/i, model: 'Mini Peekaboo', size: 'Mini' },
    { pattern: /peekaboo\s*(?:iseeu)?\s*(mini|small|medium|large)/i, model: 'Peekaboo ISeeU', sizeGroup: 1 },
    { pattern: /peekaboo\s*(?:iseeu)/i, model: 'Peekaboo ISeeU', size: 'Medium' },
    { pattern: /mini\s*baguette|baguette.*mini/i, model: 'Baguette', size: 'Mini' },
    { pattern: /baguette\s*(small|medium|large)/i, model: 'Baguette', sizeGroup: 1 },
    { pattern: /baguette/i, model: 'Baguette', size: 'Medium' },
    { pattern: /fendi\s*first\s*(small|medium|large)/i, model: 'Fendi First', sizeGroup: 1 },
    { pattern: /fendi\s*first/i, model: 'Fendi First', size: 'Medium' },
  ],
  prada: [
    { pattern: /galleria\s*(small|medium|large)/i, model: 'Galleria', sizeGroup: 1 },
    { pattern: /galleria/i, model: 'Galleria', size: 'Medium' },
    { pattern: /re-?edition\s*2005/i, model: 'Re-Edition 2005', size: 'One Size' },
    { pattern: /cleo/i, model: 'Cleo', size: 'Medium' },
  ],
  loewe: [
    { pattern: /puzzle\s*(mini|small|medium|large)/i, model: 'Puzzle', sizeGroup: 1 },
    { pattern: /puzzle/i, model: 'Puzzle', size: 'Small' },
    { pattern: /hammock\s*(mini|small|medium)/i, model: 'Hammock', sizeGroup: 1 },
    { pattern: /hammock/i, model: 'Hammock', size: 'Small' },
  ],
  valentino: [
    { pattern: /rockstud\s*spike.*?(small|medium|large)/i, model: 'Rockstud Spike', sizeGroup: 1 },
    { pattern: /rockstud\s*spike/i, model: 'Rockstud Spike', size: 'Medium' },
    { pattern: /vsling.*?(mini|small|medium|large)/i, model: 'VSling', sizeGroup: 1 },
    { pattern: /vsling/i, model: 'VSling', size: 'Medium' },
    { pattern: /roman\s*stud.*?(small|medium|large)/i, model: 'Roman Stud', sizeGroup: 1 },
    { pattern: /roman\s*stud/i, model: 'Roman Stud', size: 'Medium' },
    { pattern: /one\s*stud.*?(small|medium|large)/i, model: 'One Stud', sizeGroup: 1 },
    { pattern: /one\s*stud/i, model: 'One Stud', size: 'Medium' },
    { pattern: /loco.*?(small|medium)/i, model: 'Locò', sizeGroup: 1 },
    { pattern: /loco|locò/i, model: 'Locò', size: 'Small' },
    { pattern: /garavani/i, model: 'Garavani', size: 'Medium' },
  ],
  gucci: [
    { pattern: /(?:gg\s*)?marmont.*?(mini|small|medium|large)/i, model: 'GG Marmont', sizeGroup: 1 },
    { pattern: /(?:gg\s*)?marmont/i, model: 'GG Marmont', size: 'Small' },
    { pattern: /dionysus.*?(mini|small|medium|large)/i, model: 'Dionysus', sizeGroup: 1 },
    { pattern: /dionysus/i, model: 'Dionysus', size: 'Small' },
    { pattern: /jackie\s*1961.*?(mini|small|medium|large)/i, model: 'Jackie 1961', sizeGroup: 1 },
    { pattern: /jackie\s*1961/i, model: 'Jackie 1961', size: 'Medium' },
    { pattern: /jackie/i, model: 'Jackie 1961', size: 'Medium' },
    { pattern: /ophidia.*?(mini|small|medium|large)/i, model: 'Ophidia', sizeGroup: 1 },
    { pattern: /ophidia/i, model: 'Ophidia', size: 'Medium' },
    { pattern: /bamboo\s*1947.*?(mini|small|medium)/i, model: 'Bamboo 1947', sizeGroup: 1 },
    { pattern: /bamboo/i, model: 'Bamboo 1947', size: 'Small' },
    { pattern: /horsebit\s*1955.*?(mini|small|medium|large)/i, model: 'Horsebit 1955', sizeGroup: 1 },
    { pattern: /horsebit/i, model: 'Horsebit 1955', size: 'Small' },
    { pattern: /soho.*?(small|medium|large|disco)/i, model: 'Soho', sizeGroup: 1 },
    { pattern: /soho/i, model: 'Soho', size: 'Disco' },
    { pattern: /sylvie.*?(mini|small|medium)/i, model: 'Sylvie', sizeGroup: 1 },
    { pattern: /sylvie/i, model: 'Sylvie', size: 'Small' },
    { pattern: /gucci\s*blondie/i, model: 'Blondie', size: 'Medium' },
    { pattern: /padlock.*?(small|medium)/i, model: 'Padlock', sizeGroup: 1 },
    { pattern: /padlock/i, model: 'Padlock', size: 'Medium' },
  ],
  balenciaga: [
    { pattern: /city.*?(mini|small|medium|large)/i, model: 'City', sizeGroup: 1 },
    { pattern: /city/i, model: 'City', size: 'Medium' },
    { pattern: /hourglass.*?(xs|small|medium|large)/i, model: 'Hourglass', sizeGroup: 1 },
    { pattern: /hourglass/i, model: 'Hourglass', size: 'Small' },
    { pattern: /le\s*cagole.*?(xs|small|medium)/i, model: 'Le Cagole', sizeGroup: 1 },
    { pattern: /le\s*cagole|cagole/i, model: 'Le Cagole', size: 'Small' },
    { pattern: /neo\s*classic.*?(mini|small|medium|large)/i, model: 'Neo Classic', sizeGroup: 1 },
    { pattern: /neo\s*classic/i, model: 'Neo Classic', size: 'Medium' },
    { pattern: /papier/i, model: 'Papier', size: 'Medium' },
    { pattern: /motorcycle|motocross/i, model: 'City', size: 'Medium' },
  ],
  miumiu: [
    { pattern: /wander.*?(mini|small|medium)/i, model: 'Wander', sizeGroup: 1 },
    { pattern: /wander/i, model: 'Wander', size: 'Medium' },
    { pattern: /arcadie.*?(mini|small|medium)/i, model: 'Arcadie', sizeGroup: 1 },
    { pattern: /arcadie/i, model: 'Arcadie', size: 'Medium' },
    { pattern: /matelass[eé]/i, model: 'Matelassé', size: 'Medium' },
    { pattern: /confidential/i, model: 'Confidential', size: 'Medium' },
  ],
  chloe: [
    { pattern: /marcie.*?(mini|small|medium|large)/i, model: 'Marcie', sizeGroup: 1 },
    { pattern: /marcie/i, model: 'Marcie', size: 'Medium' },
    { pattern: /woody.*?(mini|small|medium|large)/i, model: 'Woody', sizeGroup: 1 },
    { pattern: /woody/i, model: 'Woody', size: 'Medium' },
    { pattern: /drew.*?(mini|small|medium)/i, model: 'Drew', sizeGroup: 1 },
    { pattern: /drew/i, model: 'Drew', size: 'Small' },
    { pattern: /faye.*?(mini|small|medium|large)/i, model: 'Faye', sizeGroup: 1 },
    { pattern: /faye/i, model: 'Faye', size: 'Small' },
    { pattern: /nile/i, model: 'Nile', size: 'Small' },
    { pattern: /tess.*?(small|medium)/i, model: 'Tess', sizeGroup: 1 },
    { pattern: /tess/i, model: 'Tess', size: 'Small' },
    { pattern: /aby.*?(mini|small|medium|large)/i, model: 'Aby', sizeGroup: 1 },
    { pattern: /aby/i, model: 'Aby', size: 'Medium' },
    { pattern: /paraty|pareti/i, model: 'Paraty', size: 'Medium' },
    { pattern: /paddington/i, model: 'Paddington', size: 'Medium' },
    { pattern: /baylee/i, model: 'Baylee', size: 'Medium' },
    { pattern: /pixie/i, model: 'Pixie', size: 'Small' },
    { pattern: /edith/i, model: 'Edith', size: 'Medium' },
  ],
}

// Material detection
const MATERIAL_PATTERNS = [
  { pattern: /togo/i, material: 'Togo Leather', slug: 'togo' },
  { pattern: /epsom/i, material: 'Epsom Leather', slug: 'epsom' },
  { pattern: /clemence/i, material: 'Clemence', slug: 'clemence' },
  { pattern: /evercolor/i, material: 'Evercolor', slug: 'evercolor' },
  { pattern: /ostrich/i, material: 'Ostrich', slug: 'ostrich' },
  { pattern: /crocodile|croc|niloticus|porosus/i, material: 'Niloticus Crocodile', slug: 'crocodile' },
  { pattern: /caviar/i, material: 'Caviar Leather', slug: 'caviar' },
  { pattern: /lambskin/i, material: 'Lambskin', slug: 'lambskin' },
  { pattern: /calfskin/i, material: 'Calfskin', slug: 'calfskin' },
  { pattern: /saffiano/i, material: 'Saffiano Leather', slug: 'saffiano' },
  { pattern: /canvas/i, material: 'Canvas', slug: 'canvas' },
  { pattern: /monogram/i, material: 'Monogram Canvas', slug: 'monogram' },
  { pattern: /damier\s*ebene/i, material: 'Damier Ebene', slug: 'damier-ebene' },
  { pattern: /damier\s*azur/i, material: 'Damier Azur', slug: 'damier-azur' },
  { pattern: /epi/i, material: 'Epi Leather', slug: 'epi' },
  { pattern: /empreinte/i, material: 'Monogram Empreinte', slug: 'empreinte' },
  { pattern: /intrecciato/i, material: 'Intrecciato Nappa', slug: 'intrecciato' },
  { pattern: /nappa/i, material: 'Nappa Leather', slug: 'nappa' },
  { pattern: /goyardine/i, material: 'Goyardine Canvas', slug: 'goyardine' },
  { pattern: /oblique/i, material: 'Oblique Canvas', slug: 'oblique' },
  { pattern: /cannage/i, material: 'Cannage Lambskin', slug: 'cannage' },
]

// Condition normalization
const CONDITION_MAP = {
  'new': 'New', 'brand new': 'New', 'never worn': 'New', 'unworn': 'New', 'bnib': 'New',
  'pristine': 'Excellent', 'excellent': 'Excellent', 'like new': 'Excellent', 'mint': 'Excellent',
  'very good': 'Very Good', 'very good condition': 'Very Good', 'gently used': 'Very Good',
  'good': 'Good', 'good condition': 'Good', 'pre-owned': 'Good', 'used': 'Good',
  'fair': 'Fair', 'fair condition': 'Fair', 'well loved': 'Fair', 'vintage': 'Fair',
}

function detectBrand(title) {
  for (const bp of BRAND_PATTERNS) {
    if (bp.pattern.test(title)) {
      return { brand: bp.brand, brandName: bp.brandName, tier: bp.tier }
    }
  }
  return null
}

function detectModel(title, brand) {
  const patterns = MODEL_PATTERNS[brand]
  if (!patterns) return null

  for (const mp of patterns) {
    const match = title.match(mp.pattern)
    if (match) {
      let size = mp.size || 'One Size'
      if (mp.sizeGroup && match[mp.sizeGroup]) {
        size = match[mp.sizeGroup]
        if (mp.sizeSuffix) size += mp.sizeSuffix
      }
      // Capitalize size
      size = size.charAt(0).toUpperCase() + size.slice(1)
      return { model: mp.model, size }
    }
  }
  return null
}

function detectMaterial(title) {
  for (const mp of MATERIAL_PATTERNS) {
    if (mp.pattern.test(title)) {
      return { material: mp.material, materialSlug: mp.slug }
    }
  }
  return { material: 'Leather', materialSlug: 'leather' }
}

function normalizeCondition(rawCondition) {
  if (!rawCondition) return 'Good'
  const key = rawCondition.toLowerCase().trim()
  return CONDITION_MAP[key] || 'Good'
}

function buildModelKey(model, size, materialSlug, brand) {
  const brandPrefix = {
    hermes: '', chanel: 'chanel-', dior: 'dior-', louisvuitton: 'lv-',
    goyard: 'goyard-', bottega: 'bottega-', celine: 'celine-',
    ysl: 'ysl-', fendi: 'fendi-', prada: 'prada-', loewe: 'loewe-',
    valentino: 'valentino-', gucci: 'gucci-', balenciaga: 'balenciaga-',
    miumiu: 'miumiu-', chloe: 'chloe-',
  }

  const prefix = brandPrefix[brand] || ''

  // Strip 'cm' suffix from sizes (25cm -> 25)
  let sizeClean = size.replace(/cm$/i, '').trim()
  const sizeSlug = sizeClean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')

  // For Hermès, model keys follow pattern: birkin-25-togo
  if (brand === 'hermes') {
    // Use just the first word of model (Birkin, Kelly, Constance, Picotin, Garden)
    const modelFirst = model.split(' ')[0].toLowerCase()
    // Special cases
    if (model.toLowerCase().includes('picotin')) return `picotin-${sizeSlug}-${materialSlug}`
    if (model.toLowerCase().includes('garden party')) return `garden-party-${sizeSlug}`
    if (model.toLowerCase().includes('kelly pochette')) return `kelly-pochette-${materialSlug}`
    return `${modelFirst}-${sizeSlug}-${materialSlug}`
  }

  // For others, use well-known key patterns matching fair-values.json
  const KEY_OVERRIDES = {
    'chanel-classic-flap': 'chanel-classic',
    'chanel-boy-bag': 'chanel-boy',
    'chanel-chanel-19': 'chanel-19',
    'chanel-wallet-on-chain': 'chanel-woc',
    'chanel-deauville-tote': 'chanel-deauville',
    'chanel-gabrielle-hobo': 'chanel-gabrielle',
    'dior-lady-dior': 'dior-lady',
    'dior-saddle-bag': 'dior-saddle',
    'dior-book-tote': 'dior-book-tote',
    'dior-bobby-bag': 'dior-bobby',
    'dior-30-montaigne': 'dior-30montaigne',
    'lv-petit-no-': 'lv-petit-noe',
    'lv-speedy-bandouli-re': 'lv-speedy',
    'lv-pochette-m-tis': 'lv-pochette-metis',
    'lv-onthego': 'lv-onthego',
    'bottega-the-pouch': 'bottega-pouch',
    'bottega-padded-cassette': 'bottega-padded-cassette',
    'bottega-arco-tote': 'bottega-arco-tote',
    'celine-luggage': 'celine-luggage',
    'celine-belt-bag': 'celine-belt',
    'celine-sangle-seau': 'celine-sangle',
    'fendi-peekaboo-iseeu': 'fendi-peekaboo',
    'fendi-mini-peekaboo': 'fendi-mini-peekaboo',
    'fendi-fendi-first': 'fendi-first',
    'prada-re-edition-2005': 'prada-re-edition-2005',
    'loewe-puzzle': 'loewe-puzzle',
    'loewe-hammock': 'loewe-hammock',
    'ysl-loulou': 'ysl-loulou',
    'ysl-kate': 'ysl-kate',
    'ysl-envelope': 'ysl-envelope',
    'goyard-saint-louis': 'goyard-st-louis',
    'goyard-anjou': 'goyard-anjou',
    'goyard-cap-vert': 'goyard-cap-vert',
  }

  const modelSlug = model.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  const rawKey = prefix + modelSlug

  // Check if we have an override for this model
  const overrideKey = KEY_OVERRIDES[rawKey]
  if (overrideKey) return overrideKey + '-' + sizeSlug

  return rawKey + '-' + sizeSlug
}

function normalize(title, rawCondition, knownBrand) {
  const brandInfo = knownBrand ? BRAND_PATTERNS.find(bp => bp.brand === knownBrand) : detectBrand(title)
  if (!brandInfo) return null

  const brand = brandInfo.brand || knownBrand
  const modelInfo = detectModel(title, brand)
  if (!modelInfo) return null

  const materialInfo = detectMaterial(title)
  const condition = normalizeCondition(rawCondition)
  const modelKey = buildModelKey(modelInfo.model, modelInfo.size, materialInfo.materialSlug, brand)

  return {
    brand,
    brandName: brandInfo.brandName,
    tier: brandInfo.tier,
    model: `${modelInfo.model}${modelInfo.size !== 'One Size' ? ' ' + modelInfo.size : ''}`,
    modelKey,
    material: materialInfo.material,
    size: modelInfo.size,
    condition,
  }
}

function parsePrice(priceText) {
  if (!priceText) return null
  // Remove currency symbols and commas, extract number
  const cleaned = priceText.replace(/[^0-9.,]/g, '').replace(/,/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

module.exports = { normalize, detectBrand, detectModel, detectMaterial, normalizeCondition, parsePrice, buildModelKey }
