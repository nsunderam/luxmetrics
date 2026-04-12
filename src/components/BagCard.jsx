import { useState } from 'react'
import { TrendingDown, TrendingUp, Clock, MapPin, ChevronRight } from 'lucide-react'
import { formatPrice, convertCurrency } from '../data/currencies'
import { RESELLERS } from '../data/resellers'

const BRAND_GRADIENTS = {
  hermes: 'from-orange-50 to-amber-50',
  chanel: 'from-neutral-50 to-stone-50',
  dior: 'from-blue-50 to-indigo-50',
  louisvuitton: 'from-amber-50 to-yellow-50',
  goyard: 'from-yellow-50 to-amber-50',
  bottega: 'from-green-50 to-emerald-50',
  celine: 'from-stone-50 to-neutral-50',
  ysl: 'from-red-50 to-rose-50',
  fendi: 'from-yellow-50 to-amber-50',
  prada: 'from-slate-50 to-zinc-50',
  loewe: 'from-teal-50 to-cyan-50',
  valentino: 'from-red-50 to-pink-50',
  gucci: 'from-green-50 to-emerald-50',
  balenciaga: 'from-neutral-50 to-zinc-50',
  miumiu: 'from-pink-50 to-rose-50',
}

const CONDITION_COLORS = {
  'New': 'bg-emerald-accent/10 text-emerald-accent border-emerald-accent/20',
  'Excellent': 'bg-blue-accent/10 text-blue-accent border-blue-accent/20',
  'Very Good': 'bg-amber-accent/10 text-amber-accent border-amber-accent/20',
  'Good': 'bg-orange-400/10 text-orange-500 border-orange-400/20',
  'Shows Wear': 'bg-orange-400/10 text-orange-500 border-orange-400/20',
  'Pre-Owned': 'bg-muted/8 text-muted border-muted/15',
  'Fair': 'bg-rose-accent/8 text-rose-accent border-rose-accent/15',
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
      className={`group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-black/8
        ${isDeal ? 'ring-1 ring-emerald-accent/30 shadow-md shadow-emerald-accent/5' : 'shadow-sm shadow-black/5 hover:shadow-black/10'}
      `}
    >
      {/* Gold top accent line */}
      <div className="h-[2px] bg-gradient-to-r from-gold-dark via-gold-light to-gold-dark" />

      {/* Image area */}
      <div className={`relative h-56 overflow-hidden bg-gradient-to-br ${BRAND_GRADIENTS[listing.brand] || 'from-neutral-50 to-stone-50'}`}>
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

        {/* Shimmer / fallback */}
        {(!hasImage || !imgLoaded) && (
          <div className="absolute inset-0 flex items-center justify-center">
            {!hasImage ? (
              <p className="font-display text-2xl font-semibold text-black/8">{listing.brandName}</p>
            ) : (
              <div className="shimmer absolute inset-0" />
            )}
          </div>
        )}

        {/* Brand pill */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest bg-white/80 text-gold-dark backdrop-blur-sm shadow-sm">
            {listing.brandName}
          </span>
        </div>

        {/* Mispricing badge */}
        {hasFMV ? (
          <div className={`absolute top-3 right-3 z-10 flex items-center gap-0.5 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-sm
            ${isUnderpriced ? 'bg-emerald-accent text-white' : isOverpriced ? 'bg-rose-accent text-white' : 'bg-white/80 text-silver backdrop-blur-sm'}
          `}>
            {isUnderpriced ? <TrendingDown className="w-3 h-3" /> : isOverpriced ? <TrendingUp className="w-3 h-3" /> : null}
            {mispricing > 0 ? '+' : ''}{mispricing.toFixed(0)}%
          </div>
        ) : null}

        {/* Condition badge */}
        <div className={`absolute bottom-3 left-3 z-10 px-2 py-0.5 rounded-md text-[9px] font-medium border backdrop-blur-sm ${CONDITION_COLORS[listing.condition] || CONDITION_COLORS['Pre-Owned']}`}>
          {listing.condition}
        </div>

        {/* Deal pulse */}
        {isDeal && (
          <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-md bg-emerald-accent text-white text-[9px] font-bold uppercase tracking-wider animate-pulse-gold shadow-sm">
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
        <div className="flex items-center justify-between pt-3 border-t border-graphite/60">
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
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="flex items-center gap-1.5 text-xs font-semibold bg-gold-dark text-white px-5 py-2.5 rounded-full shadow-lg shadow-gold-dark/20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          View Details <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  )
}
