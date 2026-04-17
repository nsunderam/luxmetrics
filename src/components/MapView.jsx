import { useState, useEffect, useMemo } from 'react'
import WorldMap from 'react-svg-worldmap'
import { Globe, MapPin, TrendingDown } from 'lucide-react'
import { RESELLERS, COUNTRY_LABELS } from '../data/resellers'
import { formatPrice, convertCurrency } from '../data/currencies'

const COUNTRY_NAMES = {
  US: 'United States', UK: 'United Kingdom', AU: 'Australia',
  AE: 'United Arab Emirates', IN: 'India', SG: 'Singapore',
  FR: 'France', JP: 'Japan', DE: 'Germany',
}

// react-svg-worldmap uses lowercase ISO codes, and UK = gb
function toIso(code) {
  if (code === 'UK') return 'gb'
  return code.toLowerCase()
}

export default function MapView({ listings, apiStats, currency, onCountryClick }) {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [countryStats, setCountryStats] = useState({})

  useEffect(() => {
    if (!listings || listings.length === 0) return

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

    Object.keys(stats).forEach(function(k) {
      stats[k].resellerCount = stats[k].resellers.size
      stats[k].avgPrice = stats[k].listings > 0 ? Math.round(stats[k].totalPrice / stats[k].listings) : 0
      delete stats[k].resellers
    })

    setCountryStats(stats)
  }, [listings])

  // Build data for react-svg-worldmap
  const mapData = useMemo(() => {
    return Object.entries(countryStats).map(function([code, stats]) {
      return { country: toIso(code), value: stats.listings }
    })
  }, [countryStats])

  const activeCountries = Object.keys(countryStats)
  const totalCountries = activeCountries.length
  const totalResellers = apiStats?.resellers || 0
  const totalListings = apiStats?.totalListings || listings.length

  function handleClick(event) {
    // event has countryCode in uppercase
    const code = event.countryCode
    const ourCode = code === 'GB' ? 'UK' : code
    if (countryStats[ourCode]) {
      setSelectedCountry(ourCode)
    }
  }

  function handleViewListings(countryCode) {
    if (onCountryClick) onCountryClick(countryCode)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-graphite/30 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-graphite/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-md shadow-gold/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-ivory">Global Market Coverage</h2>
              <p className="text-xs text-muted mt-0.5">Click a country to explore listings</p>
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
      <div className="p-4 flex justify-center">
        <WorldMap
          color="#b08d57"
          tooltipBgColor="#1a1a1a"
          tooltipTextColor="#ffffff"
          valueSuffix=" listings"
          size="responsive"
          data={mapData}
          backgroundColor="white"
          borderColor="#e5e5e5"
          onClickFunction={handleClick}
          styleFunction={(context) => {
            const { countryCode, countryValue, minValue, maxValue, color } = context
            const ourCode = countryCode === 'GB' ? 'UK' : countryCode
            const isActive = countryStats[ourCode]
            const isSelected = selectedCountry === ourCode

            if (!isActive) {
              return {
                fill: '#f5f5f4',
                stroke: '#e7e5e4',
                strokeWidth: 0.5,
                cursor: 'default',
              }
            }

            const hasDeals = countryStats[ourCode]?.underpriced > 0
            const opacity = 0.6 + (countryValue / (maxValue || 1)) * 0.4

            return {
              fill: hasDeals ? '#059669' : '#b08d57',
              fillOpacity: opacity,
              stroke: isSelected ? '#8c6d3f' : '#ffffff',
              strokeWidth: isSelected ? 2 : 1,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }
          }}
        />
      </div>

      {/* Country cards */}
      <div className="px-6 pb-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {activeCountries.map(function(code) {
            const stats = countryStats[code]
            if (!stats) return null
            const isSelected = selectedCountry === code
            const hasDeals = stats.underpriced > 0

            return (
              <button
                key={code}
                onClick={function() {
                  setSelectedCountry(code)
                }}
                className={`p-3 rounded-xl text-left transition-all cursor-pointer border
                  ${isSelected
                    ? 'border-gold bg-gold/5 shadow-md shadow-gold/10'
                    : 'border-graphite/30 hover:border-gold/40 hover:bg-carbon'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold tracking-wide ${isSelected ? 'text-gold-dark' : 'text-ivory'}`}>
                    {COUNTRY_LABELS[code] || code}
                  </span>
                  {hasDeals && (
                    <span className="w-2 h-2 rounded-full bg-emerald-accent animate-pulse" />
                  )}
                </div>
                <p className="text-lg font-bold text-ivory">{stats.listings.toLocaleString()}</p>
                <p className="text-[9px] text-muted">{stats.resellerCount} reseller{stats.resellerCount !== 1 ? 's' : ''}</p>
                {stats.underpriced > 0 && (
                  <p className="text-[9px] text-emerald-accent font-semibold mt-0.5 flex items-center gap-0.5">
                    <TrendingDown className="w-2.5 h-2.5" />
                    {stats.underpriced} deals
                  </p>
                )}
              </button>
            )
          })}
        </div>

        {/* Selected country detail */}
        {selectedCountry && countryStats[selectedCountry] && (
          <div className="mt-4 p-4 rounded-xl bg-carbon border border-graphite/30 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-dark" />
                <h3 className="font-semibold text-sm text-ivory">{COUNTRY_NAMES[selectedCountry] || selectedCountry}</h3>
              </div>
              <button
                onClick={function() { handleViewListings(selectedCountry) }}
                className="px-4 py-1.5 rounded-lg bg-gold-dark text-white text-xs font-semibold hover:bg-gold transition-colors cursor-pointer"
              >
                View {countryStats[selectedCountry].listings} listings
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-ivory">{countryStats[selectedCountry].resellerCount}</p>
                <p className="text-[9px] text-muted uppercase">Resellers</p>
              </div>
              <div>
                <p className="text-lg font-bold text-ivory">{countryStats[selectedCountry].listings.toLocaleString()}</p>
                <p className="text-[9px] text-muted uppercase">Listings</p>
              </div>
              <div>
                <p className="text-lg font-bold text-ivory">{formatPrice(convertCurrency(countryStats[selectedCountry].avgPrice, currency), currency)}</p>
                <p className="text-[9px] text-muted uppercase">Avg Price</p>
              </div>
              <div>
                <p className="text-lg font-bold text-emerald-accent">{countryStats[selectedCountry].underpriced}</p>
                <p className="text-[9px] text-muted uppercase">Deals</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-graphite/30 flex items-center justify-center gap-6 text-[10px] text-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gold" />
          Active market
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-accent" />
          Deals available
        </div>
        <div className="flex items-center gap-1.5">
          Darker = more listings
        </div>
      </div>
    </div>
  )
}
