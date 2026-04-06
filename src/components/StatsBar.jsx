import { TrendingDown, TrendingUp, Package, Globe, AlertTriangle, Gem } from 'lucide-react'
import { formatPrice, convertCurrency } from '../data/currencies'

export default function StatsBar({ listings, currency, total, stats: apiStats }) {
  const totalListings = apiStats?.totalListings || total || listings.length
  const uniqueBrands = apiStats?.brands || new Set(listings.map(l => l.brand)).size
  const uniqueResellers = apiStats?.resellers || new Set(listings.map(l => l.resellerId)).size

  const underpriced = apiStats?.underpriced || listings.filter(l => l.mispricingPct < -10).length
  const overpriced = apiStats?.overpriced || listings.filter(l => l.mispricingPct > 15).length

  const bestDeal = apiStats?.bestDeal || listings.reduce((best, l) =>
    l.mispricingPct < (best?.mispricingPct ?? 0) ? l : best
  , null)

  const avgMispricing = apiStats?.avgMispricing || (listings.length > 0
    ? listings.reduce((s, l) => s + Math.abs(l.mispricingPct || 0), 0) / listings.length
    : 0)

  const stats = [
    {
      label: 'Total Listings',
      value: totalListings.toLocaleString(),
      icon: Package,
      color: 'text-blue-accent',
      bg: 'bg-blue-accent/10',
    },
    {
      label: 'Underpriced',
      value: underpriced.toLocaleString ? underpriced.toLocaleString() : underpriced,
      sub: '> 10% below FMV',
      icon: TrendingDown,
      color: 'text-emerald-accent',
      bg: 'bg-emerald-accent/10',
    },
    {
      label: 'Overpriced',
      value: overpriced.toLocaleString ? overpriced.toLocaleString() : overpriced,
      sub: '> 15% above FMV',
      icon: TrendingUp,
      color: 'text-rose-accent',
      bg: 'bg-rose-accent/10',
    },
    {
      label: 'Best Deal',
      value: bestDeal?.mispricingPct != null ? `${bestDeal.mispricingPct.toFixed(0)}%` : 'N/A',
      sub: bestDeal?.name || (bestDeal?.brandName ? `${bestDeal.brandName} ${bestDeal.model}` : ''),
      icon: Gem,
      color: 'text-emerald-accent',
      bg: 'bg-emerald-accent/10',
      highlight: true,
    },
    {
      label: 'Avg Mispricing',
      value: `${Number(avgMispricing).toFixed(1)}%`,
      sub: `Across ${uniqueResellers} resellers`,
      icon: AlertTriangle,
      color: 'text-amber-accent',
      bg: 'bg-amber-accent/10',
    },
    {
      label: 'Coverage',
      value: `${uniqueResellers} Resellers`,
      sub: `${uniqueBrands} brands tracked`,
      icon: Globe,
      color: 'text-blue-accent',
      bg: 'bg-blue-accent/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`rounded-xl p-4 animate-fade-in transition-all duration-300 hover:shadow-md
            ${s.highlight
              ? 'bg-gradient-to-br from-emerald-accent/5 to-emerald-accent/15 border-2 border-emerald-accent/30 hover:border-emerald-accent/50'
              : 'bg-carbon border border-graphite hover:border-steel'
            }
          `}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center`}>
              <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
            </div>
            <span className="text-[11px] text-muted uppercase tracking-wider">{s.label}</span>
          </div>
          <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          {s.sub && <p className="text-[10px] text-muted mt-0.5 truncate">{s.sub}</p>}
        </div>
      ))}
    </div>
  )
}
