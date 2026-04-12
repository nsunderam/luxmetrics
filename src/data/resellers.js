export const COUNTRY_FLAGS = {
  US: '🇺🇸', UK: '🇬🇧', AU: '🇦🇺', AE: '🇦🇪', IN: '🇮🇳', SG: '🇸🇬',
  FR: '🇫🇷', JP: '🇯🇵', HK: '🇭🇰', KR: '🇰🇷', BR: '🇧🇷',
}

// Text fallback for Windows which doesn't render flag emojis
export const COUNTRY_LABELS = {
  US: 'US', UK: 'UK', AU: 'AU', AE: 'UAE', IN: 'IN', SG: 'SG',
  FR: 'FR', JP: 'JP', HK: 'HK', KR: 'KR', BR: 'BR',
}

export const COUNTRY_COLORS = {
  US: 'bg-blue-100 text-blue-700',
  UK: 'bg-red-100 text-red-700',
  AU: 'bg-yellow-100 text-yellow-700',
  AE: 'bg-emerald-100 text-emerald-700',
  IN: 'bg-orange-100 text-orange-700',
  SG: 'bg-red-100 text-red-700',
}

export const RESELLERS = [
  { id: 'fashionphile', name: 'Fashionphile', country: 'US', currency: 'USD', region: 'North America', trustScore: 4.8 },
  { id: 'rebag', name: 'Rebag', country: 'US', currency: 'USD', region: 'North America', trustScore: 4.7 },
  { id: 'luxedh', name: 'LuxeDH', country: 'US', currency: 'USD', region: 'North America', trustScore: 4.4 },
  { id: 'coutureusa', name: 'Couture USA', country: 'US', currency: 'USD', region: 'North America', trustScore: 4.3 },
  { id: 'ebay', name: 'eBay', country: 'US', currency: 'USD', region: 'North America', trustScore: 4.0 },
  { id: 'theladybag', name: 'The Lady Bag', country: 'US', currency: 'USD', region: 'North America', trustScore: 4.3 },
  { id: 'luxurypromise', name: 'Luxury Promise', country: 'UK', currency: 'GBP', region: 'Europe', trustScore: 4.6 },
  { id: 'luxeitfwd', name: 'Luxe.It.Fwd', country: 'AU', currency: 'AUD', region: 'Asia Pacific', trustScore: 4.5 },
  { id: 'baghunter', name: 'BagHunter', country: 'US', currency: 'USD', region: 'North America', trustScore: 4.5 },
  { id: 'luxurysnob', name: 'Luxury Snob', country: 'IN', currency: 'USD', region: 'Asia Pacific', trustScore: 4.2 },
  { id: 'garderobe', name: 'Garderobe', country: 'AE', currency: 'AED', region: 'Middle East', trustScore: 4.5 },
  { id: 'bagista', name: 'Bagista', country: 'UK', currency: 'GBP', region: 'Europe', trustScore: 4.7 },
]
