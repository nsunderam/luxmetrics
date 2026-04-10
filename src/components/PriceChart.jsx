import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { formatPrice, convertCurrency } from '../data/currencies'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function PriceChart({ listingId, modelKey, currentPriceUSD, currency }) {
  const [listingHistory, setListingHistory] = useState([])
  const [modelHistory, setModelHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`${API_BASE}/api/listings/history/${listingId}`).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE}/api/listings/model-history/${encodeURIComponent(modelKey)}`).then(r => r.json()).catch(() => []),
    ]).then(([lh, mh]) => {
      setListingHistory(lh)
      setModelHistory(mh)
      setLoading(false)
    })
  }, [listingId, modelKey])

  if (loading) {
    return (
      <div className="mt-6 p-4 bg-carbon rounded-xl">
        <div className="h-40 shimmer rounded-lg" />
      </div>
    )
  }

  // Need at least the current price point
  const hasListingData = listingHistory.length > 0
  const hasModelData = modelHistory.length > 0

  if (!hasListingData && !hasModelData) {
    return (
      <div className="mt-6 p-5 bg-carbon rounded-xl border border-graphite/60">
        <h4 className="text-sm font-semibold text-ivory mb-2">Price History</h4>
        <p className="text-xs text-muted">Price tracking started — chart will appear after the next price update.</p>
      </div>
    )
  }

  // Combine all prices to determine Y axis range
  const allPrices = [
    ...listingHistory.map(p => p.priceUSD),
    ...modelHistory.map(p => p.medianPriceUSD),
    currentPriceUSD,
  ].filter(Boolean)

  const minPrice = Math.min(...allPrices) * 0.92
  const maxPrice = Math.max(...allPrices) * 1.08
  const priceRange = maxPrice - minPrice || 1

  // Combine all dates for X axis
  const allDates = [
    ...listingHistory.map(p => new Date(p.recordedAt).getTime()),
    ...modelHistory.map(p => new Date(p.recordedAt).getTime()),
  ].sort((a, b) => a - b)

  const minDate = allDates[0] || Date.now() - 86400000
  const maxDate = Math.max(allDates[allDates.length - 1] || Date.now(), Date.now())
  const dateRange = maxDate - minDate || 86400000

  // SVG dimensions
  const W = 500
  const H = 160
  const PAD = { top: 10, right: 10, bottom: 25, left: 50 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  function toX(date) {
    return PAD.left + ((new Date(date).getTime() - minDate) / dateRange) * chartW
  }

  function toY(price) {
    return PAD.top + chartH - ((price - minPrice) / priceRange) * chartH
  }

  function makePath(points, priceKey) {
    return points
      .map((p, i) => {
        const x = toX(p.recordedAt)
        const y = toY(p[priceKey])
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
      })
      .join(' ')
  }

  // Price trend
  const trend = listingHistory.length >= 2
    ? listingHistory[listingHistory.length - 1].priceUSD - listingHistory[0].priceUSD
    : 0

  // Y axis labels (3 ticks)
  const yTicks = [minPrice, (minPrice + maxPrice) / 2, maxPrice]

  // X axis labels
  const xLabels = []
  if (allDates.length >= 2) {
    xLabels.push({ date: allDates[0], label: formatDate(allDates[0]) })
    if (allDates.length >= 3) {
      xLabels.push({ date: allDates[Math.floor(allDates.length / 2)], label: formatDate(allDates[Math.floor(allDates.length / 2)]) })
    }
    xLabels.push({ date: allDates[allDates.length - 1], label: formatDate(allDates[allDates.length - 1]) })
  }

  return (
    <div className="mt-6 p-5 bg-carbon rounded-xl border border-graphite/60">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-ivory">Price History</h4>
        {listingHistory.length >= 2 && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend < 0 ? 'text-emerald-accent' : trend > 0 ? 'text-rose-accent' : 'text-muted'}`}>
            {trend < 0 ? <TrendingDown className="w-3.5 h-3.5" /> : trend > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            {trend < 0 ? '' : '+'}{formatPrice(convertCurrency(Math.abs(trend), currency), currency)}
          </div>
        )}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxHeight: '200px' }}>
        {/* Grid lines */}
        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={PAD.left} y1={toY(tick)}
              x2={W - PAD.right} y2={toY(tick)}
              stroke="#e5e5e5" strokeWidth="1" strokeDasharray="4 4"
            />
            <text x={PAD.left - 4} y={toY(tick) + 3} textAnchor="end" fontSize="9" fill="#a3a3a3">
              {formatPrice(convertCurrency(tick, currency), currency)}
            </text>
          </g>
        ))}

        {/* X axis labels */}
        {xLabels.map((xl, i) => (
          <text key={i} x={toX(xl.date)} y={H - 4} textAnchor="middle" fontSize="9" fill="#a3a3a3">
            {xl.label}
          </text>
        ))}

        {/* Model median line (grey dashed) */}
        {hasModelData && modelHistory.length >= 2 && (
          <path
            d={makePath(modelHistory, 'medianPriceUSD')}
            fill="none" stroke="#d4d4d4" strokeWidth="1.5" strokeDasharray="6 3"
          />
        )}

        {/* Listing price line (gold) */}
        {hasListingData && listingHistory.length >= 2 && (
          <>
            {/* Gradient fill under the line */}
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b08d57" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#b08d57" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={makePath(listingHistory, 'priceUSD') + ` L ${toX(listingHistory[listingHistory.length - 1].recordedAt).toFixed(1)} ${(PAD.top + chartH).toFixed(1)} L ${toX(listingHistory[0].recordedAt).toFixed(1)} ${(PAD.top + chartH).toFixed(1)} Z`}
              fill="url(#goldGrad)"
            />
            <path
              d={makePath(listingHistory, 'priceUSD')}
              fill="none" stroke="#b08d57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
          </>
        )}

        {/* Data points */}
        {hasListingData && listingHistory.map((p, i) => (
          <circle key={i} cx={toX(p.recordedAt)} cy={toY(p.priceUSD)} r="3" fill="#b08d57" stroke="white" strokeWidth="1.5" />
        ))}

        {/* Current price marker */}
        {hasListingData && (
          <circle
            cx={toX(listingHistory[listingHistory.length - 1].recordedAt)}
            cy={toY(listingHistory[listingHistory.length - 1].priceUSD)}
            r="5" fill="#b08d57" stroke="white" strokeWidth="2"
          />
        )}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-[10px] text-muted">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-gold rounded" />
          <span>This listing</span>
        </div>
        {hasModelData && (
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-slate-dark rounded" style={{ borderTop: '1.5px dashed #d4d4d4' }} />
            <span>Model median</span>
          </div>
        )}
      </div>
    </div>
  )
}

function formatDate(timestamp) {
  const d = new Date(timestamp)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[d.getMonth()] + ' ' + d.getDate()
}

// Sparkline component for BagCard
export function PriceSparkline({ listingId }) {
  const [history, setHistory] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/listings/history/${listingId}`)
      .then(r => r.json())
      .then(data => setHistory(data))
      .catch(() => {})
  }, [listingId])

  if (!history || history.length < 2) return null

  const prices = history.map(p => p.priceUSD)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  const trend = prices[prices.length - 1] - prices[0]

  const w = 40
  const h = 16
  const points = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * w
    const y = h - ((p - min) / range) * (h - 2) - 1
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  return (
    <svg width={w} height={h} className="inline-block ml-1">
      <polyline
        points={points}
        fill="none"
        stroke={trend < 0 ? '#059669' : trend > 0 ? '#e11d48' : '#a3a3a3'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
