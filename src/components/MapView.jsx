import { useState, useEffect, useMemo } from 'react'
import WorldMap from 'react-svg-worldmap'
import { Globe, MapPin, TrendingDown, ChevronDown } from 'lucide-react'
import { RESELLERS, COUNTRY_LABELS } from '../data/resellers'
import { BRANDS } from '../data/bags'
import { formatPrice, convertCurrency } from '../data/currencies'

const COUNTRY_NAMES = {
  US: 'United States', UK: 'United Kingdom', AU: 'Australia',
  AE: 'United Arab Emirates', IN: 'India', SG: 'Singapore',
  FR: 'France', JP: 'Japan', DE: 'Germany',
}

const CONDITIONS = ['New', 'Excellent', 'Very Good', 'Good', 'Shows Wear', 'Pre-Owned', 'Fair']

function toIso(code) {
  if (code === 'UK') return 'gb'
  return code.toLowerCase()
}

export default function MapView({ apiStats, currency, onCountryClick }) {
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [countryStats, setCountryStats] = useState({})
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedCondition, setSelectedCondition] = useState('')

  useEffect(() => {
    let url = '/api/stats/map'
    const params = []
    if (selectedBrand) params.push('brand=' + selectedBrand)
    if (selectedCondition) params.push('condition=' + selectedCondition)
    if (params.length > 0) url += '?' + params.join('&')

    fetch(url)
      .then(function(r) { return r.json() })
      .then(function(rows) {
        const stats = {}
        rows.forEach(function(row) {
          const reseller = RESELLERS.find(function(r) { return r.id === row.resellerId })
          if (!reseller) return
          const country = reseller.country
          if (!stats[country]) {
            stats[country] = { listings: 0, resellers: new Set(), totalPrice: 0, underpriced: 0 }
          }
          stats[country].listings += row.listings
          stats[country].resellers.add(row.resellerId)
          stats[country].totalPrice += (row.avgPrice || 0) * row.listings
          stats[country].underpriced += row.underpriced || 0
        })

        Object.keys(stats).forEach(function(k) {
          stats[k].resellerCount = stats[k].resellers.size
          stats[k].avgPrice = stats[k].listings > 0 ? Math.round(stats[k].totalPrice / stats[k].listings) : 0
          delete stats[k].resellers
        })

        setCountryStats(stats)
        // Clear selection if filtered country has no results
        if (selectedCountry && !stats[selectedCountry]) setSelectedCountry(null)
      })
      .catch(function() {})
  }, [selectedBrand, selectedCondition])

  const mapData = useMemo(() => {
    return Object.entries(countryStats).map(function([code, stats]) {
      return { country: toIso(code), value: stats.listings }
    })
  }, [countryStats])

  const activeCountries = Object.keys(countryStats)
  const totalCountries = activeCountries.length
  const totalListings = activeCountries.reduce(function(sum, c) { return sum + countryStats[c].listings }, 0)
  const totalResellers = new Set(activeCountries.flatMap(function(c) {
    return RESELLERS.filter(function(r) { return r.country === c }).map(function(r) { return r.id })
  })).size

  const filterLabel = [
    selectedBrand ? BRANDS[selectedBrand]?.name : null,
    selectedCondition || null,
  ].filter(Boolean).join(' · ') || 'All Bags'

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-graphite/30 overflow-hidden">
      {/* Header with filters */}
      <div className="px-6 py-4 border-b border-graphite/30">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-md shadow-gold/20">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-ivory">Global Market Coverage</h2>
              <p className="text-xs text-muted mt-0.5">
                {filterLabel} · {totalListings.toLocaleString()} listings across {totalCountries} countries
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-xl font-bold text-ivory">{totalCountries}</p>
              <p className="text-[10px] text-muted uppercase tracking-wide">Countries</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gold-dark">{totalListings.toLocaleString()}</p>
              <p className="text-[10px] text-muted uppercase tracking-wide">Listings</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedBrand}
            onChange={function(e) { setSelectedBrand(e.target.value) }}
            className="px-3 py-1.5 rounded-lg border border-graphite/40 bg-white text-xs text-ivory cursor-pointer hover:border-gold/40 transition-colors"
          >
            <option value="">All Brands</option>
            {Object.entries(BRANDS).map(function([key, b]) {
              return <option key={key} value={key}>{b.name}</option>
            })}
          </select>

          <select
            value={selectedCondition}
            onChange={function(e) { setSelectedCondition(e.target.value) }}
            className="px-3 py-1.5 rounded-lg border border-graphite/40 bg-white text-xs text-ivory cursor-pointer hover:border-gold/40 transition-colors"
          >
            <option value="">All Conditions</option>
            {CONDITIONS.map(function(c) {
              return <option key={c} value={c}>{c}</option>
            })}
          </select>

          {(selectedBrand || selectedCondition) && (
            <button
              onClick={function() { setSelectedBrand(''); setSelectedCondition('') }}
              className="px-3 py-1.5 rounded-lg text-xs text-gold-dark hover:bg-gold/10 transition-colors cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Full-width Map */}
      <div className="w-full" style={{ minHeight: '500px' }}>
        <WorldMap
          color="#b08d57"
          tooltipBgColor="#1a1a1a"
          tooltipTextColor="#ffffff"
          valueSuffix=" listings"
          size="xxl"
          data={mapData}
          backgroundColor="white"
          borderColor="#e5e5e5"
          onClickFunction={function(event) {
            const code = event.countryCode
            const ourCode = code === 'GB' ? 'UK' : code
            if (countryStats[ourCode]) {
              setSelectedCountry(ourCode)
            }
          }}
          styleFunction={function(context) {
            const { countryCode, countryValue, maxValue } = context
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
            const opacity = 0.5 + (countryValue / (maxValue || 1)) * 0.5

            return {
              fill: hasDeals ? '#059669' : '#b08d57',
              fillOpacity: opacity,
              stroke: isSelected ? '#8c6d3f' : '#ffffff',
              strokeWidth: isSelected ? 2.5 : 1,
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
                onClick={function() { setSelectedCountry(code) }}
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
                {selectedBrand && <span className="text-xs text-muted">· {BRANDS[selectedBrand]?.name}</span>}
              </div>
              <button
                onClick={function() { onCountryClick && onCountryClick(selectedCountry) }}
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
