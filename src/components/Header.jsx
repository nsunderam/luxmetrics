import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Diamond } from 'lucide-react'
import { CURRENCIES } from '../data/currencies'

const SELECTABLE_CURRENCIES = ['USD', 'GBP', 'AED', 'INR', 'AUD', 'SGD']

export default function Header({ currency, onCurrencyChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const cur = CURRENCIES[currency]

  return (
    <header className="sticky top-0 z-50 border-b border-graphite glass">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-md shadow-gold/20">
            <Diamond className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-ivory tracking-wide">LuxMetrics</h1>
            <p className="text-[10px] text-gold tracking-[0.2em] uppercase -mt-0.5">Price Intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-accent/10 border border-emerald-accent/20 text-xs text-emerald-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-accent animate-pulse" />
            Live Data
          </div>

          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-carbon border border-graphite hover:border-gold/40 transition-colors cursor-pointer"
            >
              <span className="text-lg">{cur.flag}</span>
              <span className="text-sm font-medium text-ivory">{currency}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-graphite rounded-xl shadow-2xl shadow-black/10 overflow-hidden animate-fade-in">
                <div className="p-2">
                  {SELECTABLE_CURRENCIES.map(code => {
                    const c = CURRENCIES[code]
                    return (
                      <button
                        key={code}
                        onClick={() => { onCurrencyChange(code); setOpen(false) }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors cursor-pointer
                          ${currency === code
                            ? 'bg-gold/10 text-gold-dark font-semibold'
                            : 'hover:bg-carbon text-pearl'
                          }`}
                      >
                        <span className="text-lg">{c.flag}</span>
                        <span className="font-medium">{code}</span>
                        <span className="text-muted text-xs ml-auto">{c.symbol}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
