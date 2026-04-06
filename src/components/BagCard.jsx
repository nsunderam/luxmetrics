import { useState } from 'react'
import { TrendingDown, TrendingUp, Clock, MapPin, ChevronRight, ExternalLink } from 'lucide-react'
import { formatPrice, convertCurrency } from '../data/currencies'
import { RESELLERS } from '../data/resellers'

const BRAND_GRADIENTS = {
  hermes: 'from-orange-900/40 to-amber-900/20',
  chanel: 'from-neutral-800/40 to-stone-800/20',
  dior: 'from-blue-900/40 to-indigo-900/20',
  louisvuitton: 'from-amber-900/40 to-yellow-900/20',
  goyard: 'from-yellow-900/40 to-amber-900/20',
  bottega: 'from-green-900/40 to-emerald-900/20',
  celine: 'from-stone-800/40 to-neutral-800/20',
  ysl: 'from-red-900/40 to-rose-900/20',
  fendi: 'from-yellow-900/40 to-amber-900/20',
  prada: 'from-slate-800/40 to-zinc-800/20',
  loewe: 'from-teal-900/40 to-cyan-900/20',
  valentino: 'from-red-900/40 to-pink-900/20',
}

const CONDITION_COLORS = {
  'New': 'bg-emerald-accent/15 text-emerald-accent border-emerald-accent/30',
  'Excellent': 'bg-blue-accent/15 text-blue-accent border-blue-accent/30',
  'Very Good': 'bg-amber-accent/15 text-amber-accent border-amber-accent/30',
  'Good': 'bg-orange-400/15 text-orange-400 border-orange-400/30',
  'Pre-Owned': 'bg-silver/10 text-silver border-silver/20',
  'Fair': 'bg-muted/15 text-muted border-muted/30',
}

export default function BagCard({ listing, currency, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const reseller = RESELLERS.find(r => r.id === listing.resellerId)
  const priceInCurrency = convertCurrency(listing.priceUSD, currency)
  const hasFMV = listing.fairValueUSD != null && listing.mispricingPct != null
  const hasMarketFMV = listing.marketFmvUSD != null && listing.marketMispricingPct != null
  const fmvInCurrency = hasFMV ? convertCurrency(listing.fairValueUSD, currency) : null
  const marketFmvInCurrency = hasMarketFMV ? convertCurrency(listing.marketFmvUSD, currency) : null
  const mispricing = listing.mispricingPct ?? 0
  const marketMispricing = listing.marketMispricingPct ?? 0
  const isUnderpriced = hasFMV && mispricing < -5
  const isOverpriced = hasFMV && mispricing > 10
  const isMarketUnder = hasMarketFMV && marketMispricing < -5
  const isDeal = (hasFMV && mispricing < -10) || (hasMarketFMV && marketMispricing < -10)
  const hasImage = listing.image && !imgError

  return (
    <div
      onClick={onClick}
      className={`group relative bg-carbon border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold/5
        ${isDeal ? 'border-emerald-accent/30 hover:border-emerald-accent/50' : 'border-graphite/60 hover:border-gold/30'}
      `}
    >
      {/* Image area */}
      <div className="relative h-56 overflow-hidden bg-obsidian">
        {listing.image && !imgError && (
          <img
            src={listing.image}
            alt={`${listing.brandName} ${listing.model}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`absolute inset-0 w-full h-full object-contain p-4 transition-all duration-500 group-hover:scale-105
              ${imgLoaded ? 'opacity-100' : 'opacity-0'}
            `}
          />
        )}

        {/* Fallback gradient */}
        {(!hasImage || !imgLoaded) && (
          <div className={`absolute inset-0 bg-gradient-to-br ${BRAND_GRADIENTS[listing.brand] || 'from-graphite to-carbon'} flex items-center justify-center`}>
            {!hasImage ? (
              <p className="font-display text-2xl font-semibold text-ivory/10">{listing.brandName}</p>
            ) : (
              <div className="shimmer absolute inset-0" />
            )}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent opacity-80" />

        {/* Brand pill */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-wider bg-black/60 text-gold backdrop-blur-sm border border-gold/20">
            {listing.brandName}
          </span>
        </div>

        {/* Mispricing badge */}
        {hasFMV ? (
          <div className={`absolute top-3 right-3 z-10 flex items-center gap-0.5 px-2.5 py-1 rounded-lg text-[11px] font-bold backdrop-blur-sm border
            ${isUnderpriced ? 'bg-emerald-accent/20 text-emerald-accent border-emerald-accent/30' : isOverpriced ? 'bg-rose-accent/20 text-rose-accent border-rose-accent/30' : 'bg-black/60 text-silver border-graphite/50'}
          `}>
            {isUnderpriced ? <TrendingDown className="w-3 h-3" /> : isOverpriced ? <TrendingUp className="w-3 h-3" /> : null}
            {mispricing > 0 ? '+' : ''}{mispricing.toFixed(0)}%
          </div>
        ) : null}

        {/* Condition badge */}
        <div className={`absolute bottom-3 left-3 z-10 px-2 py-0.5 rounded-lg text-[9px] font-medium border backdrop-blur-sm ${CONDITION_COLORS[listing.condition] || CONDITION_COLORS['Pre-Owned']}`}>
          {listing.condition}
        </div>

        {/* Deal pulse */}
        {isDeal && (
          <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-emerald-accent/20 border border-emerald-accent/40 text-emerald-accent text-[9px] font-bold uppercase tracking-wider animate-pulse-gold">
            Deal
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-ivory leading-tight mb-0.5">{listing.model}</h3>
        <p className="text-[10px] text-muted mb-3">{[listing.size, listing.color, listing.material].filter(Boolean).join(' · ') || '\u00a0'}</p>

        {/* Price */}
        <div className="mb-3">
          <p className="text-xl font-bold text-ivory tracking-tight mb-1.5">{formatPrice(priceInCurrency, currency)}</p>
          <div className="flex items-center gap-3 text-[10px]">
            {hasFMV && (
              <span className="text-muted">
                Retail FMV <span className={`font-semibold ${isUnderpriced ? 'text-emerald-accent' : isOverpriced ? 'text-rose-accent' : 'text-silver'}`}>{formatPrice(fmvInCurrency, currency)}</span>
              </span>
            )}
            {hasMarketFMV && (
              <span className="text-muted">
                Market <span className={`font-semibold ${isMarketUnder ? 'text-emerald-accent' : 'text-silver'}`}>{formatPrice(marketFmvInCurrency, currency)}</span>
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-graphite/40">
          <div className="flex items-center gap-1.5 text-[10px] text-muted">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[100px]">{reseller?.name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted">
            <Clock className="w-3 h-3" />
            {listing.daysListed}d
          </div>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="flex items-center gap-1.5 text-xs font-medium bg-gold text-midnight px-4 py-2 rounded-full shadow-lg shadow-gold/20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          View Details <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  )
}
