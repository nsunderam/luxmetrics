import { TrendingDown, TrendingUp, Clock, MapPin, Star, ChevronRight, ShieldCheck } from 'lucide-react'
import { formatPrice, convertCurrency } from '../data/currencies'
import { RESELLERS } from '../data/resellers'

// Brand color gradients for light theme
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
}

const BRAND_ACCENT = {
  hermes: 'text-orange-700',
  chanel: 'text-neutral-800',
  dior: 'text-blue-700',
  louisvuitton: 'text-amber-800',
  goyard: 'text-yellow-700',
  bottega: 'text-green-700',
  celine: 'text-stone-600',
  ysl: 'text-red-700',
  fendi: 'text-yellow-700',
  prada: 'text-slate-600',
  loewe: 'text-teal-700',
}

const CONDITION_COLORS = {
  'New': 'bg-emerald-accent/15 text-emerald-accent border-emerald-accent/30',
  'Excellent': 'bg-blue-accent/15 text-blue-accent border-blue-accent/30',
  'Very Good': 'bg-amber-accent/15 text-amber-accent border-amber-accent/30',
  'Good': 'bg-orange-400/15 text-orange-400 border-orange-400/30',
  'Fair': 'bg-muted/15 text-muted border-muted/30',
}

export default function BagCard({ listing, currency, onClick }) {
  const reseller = RESELLERS.find(r => r.id === listing.resellerId)
  const priceInCurrency = convertCurrency(listing.priceUSD, currency)
  const hasFMV = listing.fairValueUSD != null && listing.mispricingPct != null
  const fmvInCurrency = hasFMV ? convertCurrency(listing.fairValueUSD, currency) : null
  const mispricing = listing.mispricingPct ?? 0
  const isUnderpriced = hasFMV && mispricing < -5
  const isOverpriced = hasFMV && mispricing > 10
  const isDeal = hasFMV && mispricing < -10

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-black/8 transition-all duration-300 cursor-pointer
        ${isDeal ? 'border-emerald-accent/40 hover:border-emerald-accent/70' : 'border-graphite hover:border-steel'}
      `}
    >
      {/* Deal badge */}
      {isDeal && (
        <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-emerald-accent/20 border border-emerald-accent/40 text-emerald-accent text-[10px] font-bold uppercase tracking-wider animate-pulse-gold">
          Deal
        </div>
      )}

      {/* Brand color strip */}
      <div className={`h-1 bg-gradient-to-r ${BRAND_GRADIENTS[listing.brand] || 'from-gold/20 to-gold-dark/20'}`} />

      {/* Brand header area */}
      <div className={`relative h-32 bg-gradient-to-br ${BRAND_GRADIENTS[listing.brand] || 'from-gold/10 to-gold-dark/10'} flex items-center justify-center`}>
        <div className="text-center px-4">
          <p className={`font-display text-xl font-semibold ${BRAND_ACCENT[listing.brand] || 'text-gold'} opacity-60`}>
            {listing.brandName}
          </p>
          <p className="text-[11px] text-muted/70 mt-1">{listing.model}</p>
        </div>

        {/* Condition badge */}
        <div className={`absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-medium border ${CONDITION_COLORS[listing.condition]}`}>
          {listing.condition}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand & Model */}
        <div className="mb-3">
          <p className="text-[10px] text-muted uppercase tracking-[0.15em] mb-0.5">{listing.brandName}</p>
          <h3 className="text-sm font-semibold text-ivory leading-tight">{listing.model}</h3>
          <p className="text-xs text-silver mt-0.5">{[listing.color, listing.material].filter(Boolean).join(' \u00b7 ') || '\u00a0'}</p>
        </div>

        {/* Price section */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-lg font-bold text-ivory">{formatPrice(priceInCurrency, currency)}</p>
            <p className="text-[10px] text-muted">{hasFMV ? `FMV: ${formatPrice(fmvInCurrency, currency)}` : 'FMV: --'}</p>
          </div>
          {hasFMV ? (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold
              ${isUnderpriced ? 'bg-emerald-accent/15 text-emerald-accent' : isOverpriced ? 'bg-rose-accent/15 text-rose-accent' : 'bg-graphite text-silver'}
            `}>
              {isUnderpriced ? <TrendingDown className="w-3 h-3" /> : isOverpriced ? <TrendingUp className="w-3 h-3" /> : null}
              {mispricing > 0 ? '+' : ''}{mispricing.toFixed(1)}%
            </div>
          ) : (
            <div className="px-2 py-1 rounded-md text-xs text-muted bg-graphite">--</div>
          )}
        </div>

        {/* Meta info */}
        <div className="flex items-center justify-between pt-3 border-t border-graphite/50">
          <div className="flex items-center gap-1.5 text-[11px] text-muted">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[100px]">{reseller?.name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted">
            <Clock className="w-3 h-3" />
            {listing.daysListed}d
          </div>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
        <span className="flex items-center gap-1 text-xs text-ivory font-medium bg-black/80 text-white px-3 py-1.5 rounded-full">
          View Details <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  )
}
