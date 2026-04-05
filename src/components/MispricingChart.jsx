import { useMemo } from 'react'
import { BRANDS } from '../data/bags'

export default function MispricingChart({ listings }) {
  const brandData = useMemo(() => {
    const grouped = {}
    for (const l of listings) {
      if (!grouped[l.brand]) grouped[l.brand] = { total: 0, sum: 0, deals: 0, overpriced: 0 }
      grouped[l.brand].total++
      grouped[l.brand].sum += l.mispricingPct
      if (l.mispricingPct < -10) grouped[l.brand].deals++
      if (l.mispricingPct > 15) grouped[l.brand].overpriced++
    }
    return Object.entries(grouped)
      .map(([brand, data]) => ({
        brand,
        name: BRANDS[brand]?.name || brand,
        avg: data.sum / data.total,
        deals: data.deals,
        overpriced: data.overpriced,
        total: data.total,
      }))
      .sort((a, b) => a.avg - b.avg)
  }, [listings])

  const maxAbs = Math.max(...brandData.map(d => Math.abs(d.avg)), 1)

  return (
    <div className="bg-carbon border border-graphite rounded-xl p-5">
      <h3 className="text-[11px] text-muted uppercase tracking-wider mb-4">Average Mispricing by Brand</h3>
      <div className="space-y-2.5">
        {brandData.map(d => {
          const isNeg = d.avg < 0
          const width = Math.min(Math.abs(d.avg) / maxAbs * 100, 100)
          return (
            <div key={d.brand} className="flex items-center gap-3">
              <span className="text-xs text-silver w-28 truncate text-right">{d.name}</span>
              <div className="flex-1 h-6 relative">
                {/* Center line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-graphite" />
                {/* Bar */}
                <div
                  className={`absolute top-0.5 bottom-0.5 rounded-sm transition-all duration-500
                    ${isNeg ? 'bg-emerald-accent/40' : 'bg-rose-accent/40'}
                  `}
                  style={{
                    width: `${width / 2}%`,
                    ...(isNeg
                      ? { right: '50%' }
                      : { left: '50%' }
                    ),
                  }}
                />
              </div>
              <span className={`text-xs font-medium w-14 text-right ${isNeg ? 'text-emerald-accent' : 'text-rose-accent'}`}>
                {d.avg > 0 ? '+' : ''}{d.avg.toFixed(1)}%
              </span>
              <span className="text-[10px] text-muted w-16">
                {d.deals > 0 && <span className="text-emerald-accent">{d.deals} deals</span>}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
