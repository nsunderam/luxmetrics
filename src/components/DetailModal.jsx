import { useMemo, useState, useEffect } from 'react'
import { X, TrendingDown, TrendingUp, MapPin, Clock, Star, Package, Calendar, Tag, ArrowRight, ExternalLink } from 'lucide-react'
import { formatPrice, convertCurrency, CURRENCIES } from '../data/currencies'
import { RESELLERS } from '../data/resellers'

export default function DetailModal({ listing, currency, onClose }) {
  if (!listing) return null

  const reseller = RESELLERS.find(r => r.id === listing.resellerId)
  const priceInCurrency = convertCurrency(listing.priceUSD, currency)

  // Retail-based FMV
  const hasFMV = listing.fairValueUSD != null && listing.mispricingPct != null
  const fmvInCurrency = hasFMV ? convertCurrency(listing.fairValueUSD, currency) : null
  const mispricing = listing.mispricingPct ?? 0
  const isUnderpriced = hasFMV && mispricing < -5
  const isOverpriced = hasFMV && mispricing > 10
  const savings = hasFMV ? fmvInCurrency - priceInCurrency : 0

  // Market-driven FMV
  const hasMarketFMV = listing.marketFmvUSD != null && listing.marketMispricingPct != null
  const marketFmvInCurrency = hasMarketFMV ? convertCurrency(listing.marketFmvUSD, currency) : null
  const marketMispricing = listing.marketMispricingPct ?? 0
  const isMarketUnder = hasMarketFMV && marketMispricing < -5
  const isMarketOver = hasMarketFMV && marketMispricing > 10

  // Retail base for explanation
  const retailBase = listing.retailBaseUSD ? convertCurrency(listing.retailBaseUSD, currency) : null
  const condMultiplier = { 'New': 100, 'Excellent': 92, 'Very Good': 82, 'Good': 70, 'Pre-Owned': 75, 'Fair': 55 }
  const condPct = condMultiplier[listing.condition] || 70

  // Fetch all listings for this model from API
  const [allForModel, setAllForModel] = useState([])
  useEffect(() => {
    if (!listing) return
    fetch(`/api/listings?search=${encodeURIComponent(listing.model)}&brand=${listing.brand}&limit=100`)
      .then(r => r.json())
      .then(data => {
        const filtered = (data.listings || [])
          .filter(l => l.modelKey === listing.modelKey)
          .sort((a, b) => a.priceUSD - b.priceUSD)
        setAllForModel(filtered)
      })
      .catch(() => setAllForModel([]))
  }, [listing?.modelKey, listing?.model, listing?.brand])

  // Aggregate by reseller: cheapest price per reseller for this model
  const resellerPricing = useMemo(() => {
    const grouped = {}
    for (const l of allForModel) {
      if (!grouped[l.resellerId]) {
        grouped[l.resellerId] = { listings: [], minPriceUSD: Infinity, maxPriceUSD: 0 }
      }
      grouped[l.resellerId].listings.push(l)
      grouped[l.resellerId].minPriceUSD = Math.min(grouped[l.resellerId].minPriceUSD, l.priceUSD)
      grouped[l.resellerId].maxPriceUSD = Math.max(grouped[l.resellerId].maxPriceUSD, l.priceUSD)
    }

    return Object.entries(grouped)
      .map(([resellerId, data]) => {
        const r = RESELLERS.find(x => x.id === resellerId)
        const avgPrice = data.listings.reduce((s, l) => s + l.priceUSD, 0) / data.listings.length
        const hasCurrentListing = data.listings.some(l => l.id === listing.id)
        return {
          resellerId,
          resellerName: r?.name || resellerId,
          country: r?.country || '',
          region: r?.region || '',
          trustScore: r?.trustScore || 0,
          count: data.listings.length,
          minPriceUSD: data.minPriceUSD,
          maxPriceUSD: data.maxPriceUSD,
          avgPriceUSD: avgPrice,
          hasCurrentListing,
        }
      })
      .sort((a, b) => a.avgPriceUSD - b.avgPriceUSD)
  }, [allForModel, listing.id])

  // FMV line position — use the same condition-adjusted FMV shown in header
  const baseFmvUSD = hasFMV ? listing.fairValueUSD : listing.priceUSD

  // Price range for the chart — include FMV so the scale is meaningful
  const allPrices = resellerPricing.flatMap(r => [r.minPriceUSD, r.maxPriceUSD])
  if (hasFMV) allPrices.push(baseFmvUSD)
  const globalMin = Math.min(...allPrices) * 0.9
  const globalMax = Math.max(...allPrices) * 1.1
  const range = globalMax - globalMin || 1

  // Same model, same condition comparables for the table
  const comparables = allForModel
    .filter(l => l.id !== listing.id && l.condition === listing.condition)
    .slice(0, 8)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white border border-graphite rounded-2xl shadow-2xl shadow-black/10 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-graphite px-6 py-4 flex items-start justify-between">
          <div>
            <p className="text-[10px] text-black uppercase tracking-[0.2em] mb-1">{listing.brandName}</p>
            <h2 className="text-xl font-display font-semibold text-ivory">{listing.model}</h2>
            <p className="text-sm text-silver mt-0.5">{[listing.color, listing.material, listing.size].filter(Boolean).join(' \u00b7 ')}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-carbon transition-colors cursor-pointer">
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Image + Quick Info */}
          {/* Product Image + Dual FMV */}
          <div className="flex gap-6 items-start">
            {listing.image && (
              <div className="w-56 h-56 flex-shrink-0 bg-carbon border border-graphite rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={listing.image}
                  alt={`${listing.brandName} ${listing.model}`}
                  className="max-w-full max-h-full object-contain p-3"
                />
              </div>
            )}
            <div className="flex-1 space-y-3">
              {/* Listed Price */}
              <div className="bg-carbon border border-graphite rounded-xl p-3">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Listed Price</p>
                <p className="text-2xl font-bold text-ivory">{formatPrice(priceInCurrency, currency)}</p>
              </div>

              {/* Dual FMV Cards */}
              <div className="grid grid-cols-2 gap-3">
                {/* Retail FMV */}
                <div className={`rounded-xl p-3 border ${isUnderpriced ? 'bg-emerald-accent/5 border-emerald-accent/30' : isOverpriced ? 'bg-rose-accent/5 border-rose-accent/30' : 'bg-carbon border-graphite'}`}>
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Retail FMV</p>
                  <p className={`text-lg font-bold ${isUnderpriced ? 'text-emerald-accent' : isOverpriced ? 'text-rose-accent' : 'text-ivory'}`}>
                    {hasFMV ? formatPrice(fmvInCurrency, currency) : '--'}
                  </p>
                  {hasFMV && (
                    <p className={`text-[10px] mt-1 font-semibold ${isUnderpriced ? 'text-emerald-accent' : isOverpriced ? 'text-rose-accent' : 'text-muted'}`}>
                      {mispricing > 0 ? '+' : ''}{mispricing.toFixed(1)}% vs retail
                    </p>
                  )}
                  {retailBase && (
                    <p className="text-[9px] text-muted mt-0.5">
                      {condPct}% of {formatPrice(retailBase, currency)} retail ({listing.condition})
                    </p>
                  )}
                </div>

                {/* Market FMV */}
                <div className={`rounded-xl p-3 border ${isMarketUnder ? 'bg-emerald-accent/5 border-emerald-accent/30' : isMarketOver ? 'bg-rose-accent/5 border-rose-accent/30' : 'bg-carbon border-graphite'}`}>
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Market Value</p>
                  <p className={`text-lg font-bold ${isMarketUnder ? 'text-emerald-accent' : isMarketOver ? 'text-rose-accent' : 'text-ivory'}`}>
                    {hasMarketFMV ? formatPrice(marketFmvInCurrency, currency) : '--'}
                  </p>
                  {hasMarketFMV && (
                    <p className={`text-[10px] mt-1 font-semibold ${isMarketUnder ? 'text-emerald-accent' : isMarketOver ? 'text-rose-accent' : 'text-muted'}`}>
                      {marketMispricing > 0 ? '+' : ''}{marketMispricing.toFixed(1)}% vs market
                    </p>
                  )}
                  <p className="text-[9px] text-muted mt-0.5">
                    Median of reseller listings
                  </p>
                </div>
              </div>

              {/* CTA */}
              {listing.sourceUrl && (
                <a
                  href={listing.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-black text-white text-sm font-medium rounded-xl hover:bg-black/80 transition-colors"
                  onClick={e => e.stopPropagation()}
                >
                  View on {reseller?.name || 'Reseller'} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Key Pricing (fallback if no image) */}
          {!listing.image && (
          <div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-carbon border border-graphite rounded-xl p-4">
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Listed Price</p>
                  <p className="text-2xl font-bold text-ivory">{formatPrice(priceInCurrency, currency)}</p>
                  <p className="text-xs text-muted mt-1">
                    {listing.localCurrency !== currency && `${CURRENCIES[listing.localCurrency]?.symbol}${listing.localPrice.toLocaleString()} ${listing.localCurrency}`}
                  </p>
                </div>
                <div className="bg-carbon border border-graphite rounded-xl p-4">
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Fair Market Value</p>
                  <p className="text-2xl font-bold text-black">{hasFMV ? formatPrice(fmvInCurrency, currency) : '--'}</p>
                  <p className="text-xs text-muted mt-1">{listing.condition} condition</p>
                </div>
              </div>

              {/* Mispricing callout */}
              {hasFMV ? (
                <div className={`rounded-xl p-4 border ${isUnderpriced ? 'bg-emerald-accent/10 border-emerald-accent/30' : isOverpriced ? 'bg-rose-accent/10 border-rose-accent/30' : 'bg-carbon border-graphite'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Mispricing</p>
                      <div className="flex items-center gap-2">
                        {isUnderpriced ? <TrendingDown className="w-5 h-5 text-emerald-accent" /> : isOverpriced ? <TrendingUp className="w-5 h-5 text-rose-accent" /> : null}
                        <p className={`text-2xl font-bold ${isUnderpriced ? 'text-emerald-accent' : isOverpriced ? 'text-rose-accent' : 'text-silver'}`}>
                          {mispricing > 0 ? '+' : ''}{mispricing.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    {isUnderpriced && savings > 0 && (
                      <div className="text-right">
                        <p className="text-[10px] text-muted uppercase tracking-wider mb-1">You Save</p>
                        <p className="text-xl font-bold text-emerald-accent">{formatPrice(savings, currency)}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl p-4 border bg-carbon border-graphite">
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Mispricing</p>
                  <p className="text-lg text-muted">No FMV data available for this model</p>
                </div>
              )}

              {/* Details row */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: MapPin, label: 'Reseller', value: reseller?.name },
                  { icon: Star, label: 'Trust', value: `${reseller?.trustScore}/5` },
                  { icon: Calendar, label: 'Year', value: listing.year },
                  { icon: Clock, label: 'Listed', value: `${listing.daysListed}d` },
                ].map((d, i) => (
                  <div key={i} className="bg-carbon/60 border border-graphite/50 rounded-lg p-2.5 text-center">
                    <d.icon className="w-3 h-3 text-muted mx-auto mb-1" />
                    <p className="text-xs font-medium text-ivory">{d.value}</p>
                    <p className="text-[9px] text-muted">{d.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* View on Reseller CTA (if image layout didn't show it) */}
          {!listing.image && listing.sourceUrl && (
            <a
              href={listing.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white text-sm font-medium rounded-xl hover:bg-black/80 transition-colors"
              onClick={e => e.stopPropagation()}
            >
              View on {reseller?.name || 'Reseller'} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Accessories */}
          {listing.accessories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {listing.accessories.map(a => (
                <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 bg-carbon border border-graphite rounded-full text-xs text-silver">
                  <Package className="w-3 h-3 text-black/60" />
                  {a}
                </span>
              ))}
              <span className="px-3 py-1.5 text-xs text-muted">{listing.hardware}</span>
            </div>
          )}

          {/* RELATIVE PRICING CHART - the key feature */}
          <div className="bg-carbon border border-graphite rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-ivory">Relative Pricing Across Resellers</h3>
                <p className="text-[11px] text-muted mt-0.5">{listing.model} &mdash; {allForModel.length} listings across {resellerPricing.length} resellers</p>
              </div>
              <div className="flex items-center gap-4 text-[10px]">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-accent" /> Below FMV</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-accent" /> Above FMV</span>
                <span className="flex items-center gap-1.5"><span className="w-0.5 h-3 bg-gold" /> FMV</span>
              </div>
            </div>

            <div className="space-y-2">
              {resellerPricing.map((rp) => {
                const minPct = ((rp.minPriceUSD - globalMin) / range) * 100
                const maxPct = ((rp.maxPriceUSD - globalMin) / range) * 100
                const avgPct = ((rp.avgPriceUSD - globalMin) / range) * 100
                const fmvPct = ((baseFmvUSD - globalMin) / range) * 100
                const isBelow = rp.avgPriceUSD < baseFmvUSD
                const currentPct = rp.hasCurrentListing ? ((listing.priceUSD - globalMin) / range) * 100 : null

                return (
                  <div key={rp.resellerId} className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${rp.hasCurrentListing ? 'bg-black/5 border border-black/10' : 'hover:bg-graphite/30'}`}>
                    {/* Reseller name */}
                    <div className="w-32 flex-shrink-0">
                      <p className={`text-xs font-medium truncate ${rp.hasCurrentListing ? 'text-black' : 'text-silver'}`}>
                        {rp.resellerName}
                      </p>
                      <p className="text-[9px] text-muted">{rp.country} &middot; {rp.count} listing{rp.count > 1 ? 's' : ''}</p>
                    </div>

                    {/* Bar chart */}
                    <div className="flex-1 relative h-7">
                      {/* FMV reference line */}
                      <div
                        className="absolute top-0 bottom-0 w-px bg-black/30 z-10"
                        style={{ left: `${Math.min(Math.max(fmvPct, 0), 100)}%` }}
                      >
                        {rp === resellerPricing[0] && (
                          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] text-black whitespace-nowrap">FMV</span>
                        )}
                      </div>

                      {/* Price range bar */}
                      {rp.count > 1 ? (
                        <div
                          className="absolute top-2 h-3 rounded-full bg-graphite/40"
                          style={{
                            left: `${minPct}%`,
                            width: `${Math.max(maxPct - minPct, 1)}%`,
                          }}
                        />
                      ) : null}

                      {/* Average price dot */}
                      <div
                        className={`absolute top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center z-20 ${
                          isBelow
                            ? 'bg-emerald-accent/20 border-emerald-accent'
                            : 'bg-rose-accent/20 border-rose-accent'
                        }`}
                        style={{ left: `${avgPct}%`, transform: 'translateX(-50%)' }}
                        title={`Avg: ${formatPrice(convertCurrency(rp.avgPriceUSD, currency), currency)}`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${isBelow ? 'bg-emerald-accent' : 'bg-rose-accent'}`} />
                      </div>

                      {/* Current listing indicator */}
                      {currentPct !== null && (
                        <div
                          className="absolute top-0.5 z-30"
                          style={{ left: `${currentPct}%`, transform: 'translateX(-50%)' }}
                        >
                          <div className="w-6 h-6 rounded-md bg-black/10 border-2 border-black flex items-center justify-center">
                            <Tag className="w-2.5 h-2.5 text-black" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price label */}
                    <div className="w-20 text-right flex-shrink-0">
                      <p className={`text-xs font-semibold ${isBelow ? 'text-emerald-accent' : 'text-rose-accent'}`}>
                        {formatPrice(convertCurrency(rp.avgPriceUSD, currency), currency)}
                      </p>
                      {rp.count > 1 && (
                        <p className="text-[9px] text-muted">
                          {formatPrice(convertCurrency(rp.minPriceUSD, currency), currency)} - {formatPrice(convertCurrency(rp.maxPriceUSD, currency), currency)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Chart x-axis labels */}
            <div className="flex justify-between mt-3 pt-2 border-t border-graphite/30">
              <span className="text-[9px] text-muted">{formatPrice(convertCurrency(globalMin, currency), currency)}</span>
              <span className="text-[9px] text-black">FMV: {formatPrice(convertCurrency(baseFmvUSD, currency), currency)}</span>
              <span className="text-[9px] text-muted">{formatPrice(convertCurrency(globalMax, currency), currency)}</span>
            </div>
          </div>

          {/* Same-condition comparables table */}
          {comparables.length > 0 && (
            <div>
              <p className="text-[11px] text-muted uppercase tracking-wider mb-3">
                Same Condition Comparables &mdash; {listing.model} ({listing.condition})
              </p>
              <div className="border border-graphite rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-carbon/80">
                      <th className="text-left px-4 py-2.5 text-[10px] text-muted uppercase tracking-wider font-medium">Reseller</th>
                      <th className="text-left px-4 py-2.5 text-[10px] text-muted uppercase tracking-wider font-medium">Color</th>
                      <th className="text-left px-4 py-2.5 text-[10px] text-muted uppercase tracking-wider font-medium">Year</th>
                      <th className="text-right px-4 py-2.5 text-[10px] text-muted uppercase tracking-wider font-medium">Price</th>
                      <th className="text-right px-4 py-2.5 text-[10px] text-muted uppercase tracking-wider font-medium">vs FMV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Current listing highlighted */}
                    <tr className="bg-black/3 border-b border-graphite/30">
                      <td className="px-4 py-2.5 text-black font-medium">
                        <div className="flex items-center gap-1.5">
                          <Tag className="w-3 h-3" />
                          {reseller?.name} <span className="text-[10px] text-muted">(this)</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-silver">{listing.color}</td>
                      <td className="px-4 py-2.5 text-muted">{listing.year}</td>
                      <td className="px-4 py-2.5 text-right text-ivory font-medium">{formatPrice(priceInCurrency, currency)}</td>
                      <td className={`px-4 py-2.5 text-right font-medium ${isUnderpriced ? 'text-emerald-accent' : isOverpriced ? 'text-rose-accent' : 'text-silver'}`}>
                        {hasFMV ? `${mispricing > 0 ? '+' : ''}${mispricing.toFixed(1)}%` : '--'}
                      </td>
                    </tr>
                    {comparables.map(c => {
                      const cReseller = RESELLERS.find(r => r.id === c.resellerId)
                      const cPrice = convertCurrency(c.priceUSD, currency)
                      const cMispricing = c.mispricingPct ?? 0
                      const cHasFMV = c.mispricingPct != null
                      const cUnder = cHasFMV && cMispricing < -5
                      const cOver = cHasFMV && cMispricing > 10
                      return (
                        <tr key={c.id} className="border-b border-graphite/20 hover:bg-carbon/40">
                          <td className="px-4 py-2.5 text-silver">{cReseller?.name}</td>
                          <td className="px-4 py-2.5 text-muted">{c.color}</td>
                          <td className="px-4 py-2.5 text-muted">{c.year}</td>
                          <td className="px-4 py-2.5 text-right text-ivory">{formatPrice(cPrice, currency)}</td>
                          <td className={`px-4 py-2.5 text-right font-medium ${cUnder ? 'text-emerald-accent' : cOver ? 'text-rose-accent' : 'text-silver'}`}>
                            {cHasFMV ? `${cMispricing > 0 ? '+' : ''}${cMispricing.toFixed(1)}%` : '--'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
