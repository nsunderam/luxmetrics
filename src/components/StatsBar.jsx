import { useState, useEffect, useRef } from 'react'
import { TrendingDown, TrendingUp, Package, Globe, AlertTriangle, Gem } from 'lucide-react'
import { formatPrice, convertCurrency } from '../data/currencies'

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0)
  const prevTarget = useRef(0)

  useEffect(() => {
    if (target === prevTarget.current) return
    const start = prevTarget.current
    const diff = target - start
    if (diff === 0) return
    prevTarget.current = target

    const startTime = Date.now()
    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(start + diff * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  return value
}

function AnimatedStat({ target, suffix = '', prefix = '', format = true }) {
  const num = typeof target === 'number' ? target : parseFloat(target) || 0
  const animated = useCountUp(num)
  const display = format ? animated.toLocaleString() : animated
  return <>{prefix}{display}{suffix}</>
}

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
      numValue: totalListings,
      displayValue: <AnimatedStat target={totalListings} />,
      icon: Package,
      color: 'text-blue-accent',
      bg: 'bg-blue-accent/10',
    },
    {
      label: 'Underpriced',
      numValue: underpriced,
      displayValue: <AnimatedStat target={underpriced} />,
      sub: '> 10% below FMV',
      icon: TrendingDown,
      color: 'text-emerald-accent',
      bg: 'bg-emerald-accent/10',
    },
    {
      label: 'Overpriced',
      numValue: overpriced,
      displayValue: <AnimatedStat target={overpriced} />,
      sub: '> 15% above FMV',
      icon: TrendingUp,
      color: 'text-rose-accent',
      bg: 'bg-rose-accent/10',
    },
    {
      label: 'Best Deal',
      displayValue: bestDeal?.mispricingPct != null
        ? <><AnimatedStat target={Math.abs(Math.round(bestDeal.mispricingPct))} prefix="-" suffix="%" format={false} /></>
        : 'N/A',
      sub: bestDeal?.name || (bestDeal?.brandName ? `${bestDeal.brandName} ${bestDeal.model}` : ''),
      icon: Gem,
      color: 'text-emerald-accent',
      bg: 'bg-emerald-accent/10',
      highlight: true,
    },
    {
      label: 'Avg Mispricing',
      displayValue: <><AnimatedStat target={Math.round(Number(avgMispricing) * 10) / 10} format={false} /><span>%</span></>,
      sub: `Across ${uniqueResellers} resellers`,
      icon: AlertTriangle,
      color: 'text-amber-accent',
      bg: 'bg-amber-accent/10',
    },
    {
      label: 'Coverage',
      displayValue: <><AnimatedStat target={uniqueResellers} format={false} /> <span className="text-base font-normal">Resellers</span></>,
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
              ? 'bg-gradient-to-br from-gold/5 to-gold/15 border border-gold/30 hover:border-gold/50'
              : 'bg-carbon border border-graphite/60 hover:border-gold/20'
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
          <p className={`text-xl font-bold ${s.color}`}>{s.displayValue}</p>
          {s.sub && <p className="text-[10px] text-muted mt-0.5 truncate">{s.sub}</p>}
        </div>
      ))}
    </div>
  )
}
