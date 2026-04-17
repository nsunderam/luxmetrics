import { useState, useEffect } from 'react'
import { Globe, MapPin, TrendingDown } from 'lucide-react'
import { CONTINENT_PATHS, COUNTRY_PINS } from '../data/mapData'
import { RESELLERS, COUNTRY_LABELS } from '../data/resellers'
import { formatPrice, convertCurrency } from '../data/currencies'

export default function MapView({ listings, apiStats, currency, onCountryClick }) {
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [countryStats, setCountryStats] = useState({})

  useEffect(() => {
    if (!listings || listings.length === 0) return

    // Aggregate listings by country
    const stats = {}
    listings.forEach(function(l) {
      const reseller = RESELLERS.find(function(r) { return r.id === l.resellerId })
      if (!reseller) return
      const country = reseller.country
      if (!stats[country]) {
        stats[country] = {
          listings: 0,
          resellers: new Set(),
          totalPrice: 0,
          underpriced: 0,
          bestDeal: null,
        }
      }
      stats[country].listings++
      stats[country].resellers.add(l.resellerId)
      stats[country].totalPrice += l.priceUSD || 0
      if (l.mispricingPct && l.mispricingPct < -5) stats[country].underpriced++
      if (!stats[country].bestDeal || (l.mispricingPct && l.mispricingPct < (stats[country].bestDeal.mispricingPct || 0))) {
        stats[country].bestDeal = l
      }
    })

    // Convert Sets to counts
    Object.keys(stats).forEach(function(k) {
      stats[k].resellerCount = stats[k].resellers.size
      stats[k].avgPrice = stats[k].listings > 0 ? Math.round(stats[k].totalPrice / stats[k].listings) : 0
      delete stats[k].resellers
    })

    setCountryStats(stats)
  }, [listings])

  const activeCountries = Object.keys(countryStats).filter(function(c) { return COUNTRY_PINS[c] })
  const maxListings = Math.max(1, ...activeCountries.map(function(c) { return countryStats[c].listings }))

  // Summary stats
  const totalCountries = activeCountries.length
  const totalResellers = apiStats?.resellers || 0
  const totalListings = apiStats?.totalListings || listings.length

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-graphite/30 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-graphite/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-md shadow-gold/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-ivory">Global Market Coverage</h2>
              <p className="text-xs text-muted mt-0.5">Click a region to explore listings</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-xl font-bold text-ivory">{totalCountries}</p>
              <p className="text-[10px] text-muted uppercase tracking-wide">Countries</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-ivory">{totalResellers}</p>
              <p className="text-[10px] text-muted uppercase tracking-wide">Resellers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gold-dark">{totalListings.toLocaleString()}</p>
              <p className="text-[10px] text-muted uppercase tracking-wide">Listings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative p-6">
        <svg viewBox="0 0 520 340" className="w-full h-auto" style={{ maxHeight: '500px' }}>
          {/* Background */}
          <rect x="0" y="0" width="520" height="340" fill="#fafafa" rx="8" />

          {/* Grid lines */}
          {[68, 136, 204, 272].map(function(y) {
            return <line key={'h'+y} x1="0" y1={y} x2="520" y2={y} stroke="#f0f0f0" strokeWidth="0.5" />
          })}
          {[104, 208, 312, 416].map(function(x) {
            return <line key={'v'+x} x1={x} y1="0" x2={x} y2="340" stroke="#f0f0f0" strokeWidth="0.5" />
          })}

          {/* Continents */}
          {Object.entries(CONTINENT_PATHS).map(function([name, path]) {
            return (
              <path
                key={name}
                d={path}
                fill="#e8e5e0"
                stroke="#d4d0ca"
                strokeWidth="0.5"
                opacity="0.6"
              />
            )
          })}

          {/* Connection lines between active countries */}
          {activeCountries.length > 1 && activeCountries.map(function(c, i) {
            if (i === 0) return null
            const prev = COUNTRY_PINS[activeCountries[i - 1]]
            const curr = COUNTRY_PINS[c]
            return (
              <line
                key={'line-'+c}
                x1={prev.x} y1={prev.y}
                x2={curr.x} y2={curr.y}
                stroke="#b08d57"
                strokeWidth="0.5"
                opacity="0.15"
                strokeDasharray="4 4"
              />
            )
          })}

          {/* Country bubbles */}
          {activeCountries.map(function(countryCode) {
            const pin = COUNTRY_PINS[countryCode]
            const stats = countryStats[countryCode]
            if (!pin || !stats) return null

            const sizeFactor = Math.sqrt(stats.listings / maxListings)
            const radius = 12 + sizeFactor * 20
            const hasDeals = stats.underpriced > 0
            const isHovered = hoveredCountry === countryCode

            return (
              <g key={countryCode}>
                {/* Pulse ring */}
                <circle
                  cx={pin.x} cy={pin.y} r={radius + 4}
                  fill="none"
                  stroke={hasDeals ? '#059669' : '#b08d57'}
                  strokeWidth="1"
                  opacity="0.3"
                >
                  <animate
                    attributeName="r"
                    from={radius + 2}
                    to={radius + 12}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.4"
                    to="0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Main bubble */}
                <circle
                  cx={pin.x} cy={pin.y} r={isHovered ? radius + 3 : radius}
                  fill={hasDeals ? 'url(#dealGradient)' : 'url(#goldGradient)'}
                  stroke={isHovered ? '#8c6d3f' : 'white'}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  style={{ cursor: 'pointer', transition: 'r 0.2s ease' }}
                  onMouseEnter={function() { setHoveredCountry(countryCode) }}
                  onMouseLeave={function() { setHoveredCountry(null) }}
                  onClick={function() { onCountryClick && onCountryClick(countryCode) }}
                  filter="url(#shadow)"
                />

                {/* Country label */}
                <text
                  x={pin.x} y={pin.y - 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={radius > 20 ? '11' : '9'}
                  fontWeight="700"
                  fontFamily="Inter, sans-serif"
                  style={{ pointerEvents: 'none' }}
                >
                  {COUNTRY_LABELS[countryCode] || countryCode}
                </text>

                {/* Listing count below label */}
                <text
                  x={pin.x} y={pin.y + (radius > 20 ? 11 : 9)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="rgba(255,255,255,0.85)"
                  fontSize="7"
                  fontWeight="500"
                  fontFamily="Inter, sans-serif"
                  style={{ pointerEvents: 'none' }}
                >
                  {stats.listings.toLocaleString()}
                </text>
              </g>
            )
          })}

          {/* Gradient definitions */}
          <defs>
            <radialGradient id="goldGradient" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#c9a96e" />
              <stop offset="100%" stopColor="#8c6d3f" />
            </radialGradient>
            <radialGradient id="dealGradient" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </radialGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>
        </svg>

        {/* Hover tooltip */}
        {hoveredCountry && countryStats[hoveredCountry] && COUNTRY_PINS[hoveredCountry] && (
          <div
            className="absolute bg-white rounded-xl shadow-xl shadow-black/10 border border-graphite/30 p-4 min-w-[200px] animate-fade-in z-10"
            style={{
              left: Math.min(COUNTRY_PINS[hoveredCountry].x / 520 * 100, 70) + '%',
              top: Math.min(COUNTRY_PINS[hoveredCountry].y / 340 * 100 - 5, 60) + '%',
              transform: 'translate(-50%, -110%)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gold-dark" />
              <h3 className="font-semibold text-sm text-ivory">{COUNTRY_PINS[hoveredCountry].name}</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <span className="text-muted">Resellers</span>
              <span className="font-semibold text-ivory text-right">{countryStats[hoveredCountry].resellerCount}</span>
              <span className="text-muted">Listings</span>
              <span className="font-semibold text-ivory text-right">{countryStats[hoveredCountry].listings.toLocaleString()}</span>
              <span className="text-muted">Avg Price</span>
              <span className="font-semibold text-ivory text-right">{formatPrice(convertCurrency(countryStats[hoveredCountry].avgPrice, currency), currency)}</span>
              {countryStats[hoveredCountry].underpriced > 0 && (
                <>
                  <span className="text-muted">Deals</span>
                  <span className="font-semibold text-emerald-accent text-right flex items-center justify-end gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {countryStats[hoveredCountry].underpriced}
                  </span>
                </>
              )}
            </div>
            <p className="text-[9px] text-muted mt-2 border-t border-graphite/30 pt-2">Click to view listings</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-graphite/30 flex items-center justify-center gap-6 text-[10px] text-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gradient-to-br from-gold-light to-gold-dark" />
          Standard pricing
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700" />
          Deals available
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-muted">Bubble size = listing volume</span>
        </div>
      </div>
    </div>
  )
}
