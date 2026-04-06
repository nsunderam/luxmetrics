import { useState } from 'react'
import { TrendingDown, TrendingUp, Clock, MapPin, ChevronRight, ExternalLink } from 'lucide-react'
import { formatPrice, convertCurrency } from '../data/currencies'
import { RESELLERS } from '../data/resellers'

const BRAND_GRADIENTS = {
  hermes: 'from-orange-50 to-amber-50',
  chanel: 'from-neutral-100 to-stone-100',
  dior: 'from-blue-50 to-indigo-50',
  louisvuitton: 'from-amber-50 to-yellow-50',
  goyard: 'from-yellow-50 to-amber-50',
  bottega: 'from-green-50 to-emerald-50',
  celine: 'from-stone-100 to-neutral-50',
  ysl: 'from-red-50 to-rose-50',
  fendi: 'from-yellow-50 to-amber-50',
  prada: 'from-slate-50 to-zinc-50',
  loewe: 'from-teal-50 to-cyan-50',
  valentino: 'from-red-50 to-pink-50',
}

const CONDITION_COLORS = {
  'New': 'bg-emerald-accent/15 text-emerald-accent border-emerald-accent/30',
  'Excellent': 'bg-blue-accent/15 text-blue-accent border-blue-accent/30',
  'Very Good': 'bg-amber-accent/15 text-amber-accent border-amber-accent/30',
  'Good': 'bg-orange-400/15 text-orange-400 border-orange-400/30',
  'Fair': 'bg-muted/15 text-muted border-muted/30',
}

export default function BagCard({ listing, currency, onClick }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const reseller = RESELLERS.find(r => r.id === listing.resellerId)
  const priceInCurrency = convertCurrency(listing.priceUSD, currency)
  const hasFMV = listing.fairValueUSD != null && listing.mispricingPct != null
  const fmvInCurrency = hasFMV ? convertCurrency(listing.fairValueUSD, currency) : null
  const mispricing = listing.mispricingPct ?? 0
  const isUnderpriced = hasFMV && mispricing < -5
  const isOverpriced = hasFMV && mispricing > 10
  const isDeal = hasFMV && mispricing < -10
  const hasImage = listing.image && !imgError

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white border rounded-xl overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-black/10
        ${isDeal ? 'border-emerald-accent/40 hover:border-emerald-accent/70' : 'border-graphite hover:border-steel'}
      `}
    >
      {/* Image / Brand hero area */}
      <div className="relative h-52 overflow-hidden">
        {/* Product image */}
        {listing.image && !imgError && (
          <img
            src={listing.image}
            alt={`${listing.brandName} ${listing.model}`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`absolute inset-0 w-full h-full object-contain p-3 transition-all duration-500 group-hover:scale-105
              ${imgLoaded ? 'opacity-100' : 'opacity-0'}
            `}
          />
        )}

        {/* Shimmer loading / fallback gradient */}
        {(!hasImage || !imgLoaded) && (
          <div className={`absolute inset-0 bg-gradient-to-br ${BRAND_GRADIENTS[listing.brand] || 'from-neutral-50 to-stone-50'} flex items-center justify-center`}>
            {!hasImage ? (
              <div className="text-center px-4">
                <p className="font-display text-2xl font-semibold text-black/10">{listing.brandName}</p>
              </div>
            ) : (
              <div className="shimmer absolute inset-0" />
            )}
          </div>
        )}

        {/* Dark gradient at bottom for readability */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Brand pill - top left */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="px-2 py-0.5 rounded-md text-[9px] font-semibold uppercase tracking-wider bg-white/90 text-black/70 backdrop-blur-sm">
            {listing.brandName}
          </span>
        </div>

        {/* Mispricing badge - top right */}
        {hasFMV ? (
          <div className={`absolute top-2.5 right-2.5 z-10 flex items-center gap-0.5 px-2 py-1 rounded-md text-[11px] font-bold backdrop-blur-sm
            ${isUnderpriced ? 'bg-emerald-accent/90 text-white' : isOverpriced ? 'bg-rose-accent/90 text-white' : 'bg-white/90 text-black/70'}
          `}>
            {isUnderpriced ? <TrendingDown className="w-3 h-3" /> : isOverpriced ? <TrendingUp className="w-3 h-3" /> : null}
            {mispricing > 0 ? '+' : ''}{mispricing.toFixed(0)}%
          </div>
        ) : null}

        {/* Condition badge - bottom left over gradient */}
        <div className={`absolute bottom-2 left-2.5 z-10 px-2 py-0.5 rounded-md text-[9px] font-medium border backdrop-blur-sm ${CONDITION_COLORS[listing.condition]}`}>
          {listing.condition}
        </div>

        {/* Deal badge - pulsing */}
        {isDeal && (
          <div className="absolute bottom-2 right-2.5 z-10 px-2 py-0.5 rounded-md bg-emerald-accent text-white text-[9px] font-bold uppercase tracking-wider animate-pulse-gold">
            Deal
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Model name */}
        <h3 className="text-sm font-semibold text-ivory leading-tight mb-0.5">{listing.model}</h3>
        <p className="text-[10px] text-muted mb-3">{[listing.size, listing.color, listing.material].filter(Boolean).join(' · ') || '\u00a0'}</p>

        {/* Price */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xl font-bold text-ivory tracking-tight">{formatPrice(priceInCurrency, currency)}</p>
            <p className="text-[10px] text-muted mt-0.5">{hasFMV ? `FMV ${formatPrice(fmvInCurrency, currency)}` : ''}</p>
          </div>
          {hasFMV && isUnderpriced && (
            <p className="text-[11px] font-semibold text-emerald-accent">
              Save {formatPrice(fmvInCurrency - priceInCurrency, currency)}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-graphite/50">
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
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <span className="flex items-center gap-1.5 text-xs font-medium bg-black text-white px-4 py-2 rounded-full shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          View Details <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  )
}
