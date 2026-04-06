import { useState } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown, RotateCcw } from 'lucide-react'
import { BRANDS, CONDITIONS } from '../data/bags'
import { RESELLERS } from '../data/resellers'

const BRAND_LIST = Object.entries(BRANDS).map(([key, val]) => ({ key, ...val }))

const SORT_OPTIONS = [
  { value: 'mispricing-asc', label: 'Best Deals First' },
  { value: 'mispricing-desc', label: 'Most Overpriced' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'days-desc', label: 'Longest Listed' },
  { value: 'days-asc', label: 'Recently Listed' },
]

export default function Filters({ filters, onFilterChange }) {
  const [expanded, setExpanded] = useState(false)

  const toggleBrand = (brand) => {
    const brands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand]
    onFilterChange({ ...filters, brands })
  }

  const toggleCondition = (cond) => {
    const conditions = filters.conditions.includes(cond)
      ? filters.conditions.filter(c => c !== cond)
      : [...filters.conditions, cond]
    onFilterChange({ ...filters, conditions })
  }

  const activeFilterCount = filters.brands.length + filters.conditions.length
    + (filters.search ? 1 : 0) + (filters.mispricingOnly ? 1 : 0)
    + (filters.reseller ? 1 : 0) + (filters.minResellers ? 1 : 0)

  const resetFilters = () => {
    onFilterChange({
      search: '',
      brands: [],
      conditions: [],
      sort: 'mispricing-asc',
      mispricingOnly: false,
      reseller: '',
      minResellers: '',
      minPrice: '',
      maxPrice: '',
    })
  }

  return (
    <div className="bg-carbon border border-graphite rounded-xl overflow-hidden">
      {/* Top bar */}
      <div className="p-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={filters.search}
            onChange={e => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Search bags, brands, models..."
            className="w-full pl-10 pr-4 py-2.5 bg-obsidian border border-graphite rounded-lg text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-gold/50 transition-colors"
          />
          {filters.search && (
            <button onClick={() => onFilterChange({ ...filters, search: '' })} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
              <X className="w-3.5 h-3.5 text-muted hover:text-ivory" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={filters.sort}
            onChange={e => onFilterChange({ ...filters, sort: e.target.value })}
            className="appearance-none px-4 py-2.5 pr-9 bg-obsidian border border-graphite rounded-lg text-sm text-ivory cursor-pointer focus:outline-none focus:border-gold/50"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
        </div>

        {/* Mispricing toggle */}
        <button
          onClick={() => onFilterChange({ ...filters, mispricingOnly: !filters.mispricingOnly })}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-all cursor-pointer
            ${filters.mispricingOnly
              ? 'bg-emerald-accent/15 border-emerald-accent/40 text-emerald-accent'
              : 'bg-obsidian border-graphite text-muted hover:text-ivory hover:border-graphite'
            }`}
        >
          Deals Only
        </button>

        {/* Filter toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm border transition-all cursor-pointer
            ${expanded || activeFilterCount > 0
              ? 'bg-gold/10 border-gold/30 text-gold'
              : 'bg-obsidian border-graphite text-muted hover:text-ivory'
            }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-gold text-midnight text-xs font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button onClick={resetFilters} className="flex items-center gap-1.5 px-3 py-2.5 text-xs text-muted hover:text-ivory transition-colors cursor-pointer">
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-graphite/50 space-y-4 animate-fade-in">
          {/* Brands */}
          <div>
            <label className="text-[11px] text-muted uppercase tracking-wider mb-2 block">Brands</label>
            <div className="flex flex-wrap gap-2">
              {BRAND_LIST.map(b => (
                <button
                  key={b.key}
                  onClick={() => toggleBrand(b.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer
                    ${filters.brands.includes(b.key)
                      ? 'bg-gold/15 border-gold/40 text-gold'
                      : 'bg-obsidian border-graphite text-silver hover:border-steel hover:text-ivory'
                    }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="text-[11px] text-muted uppercase tracking-wider mb-2 block">Condition</label>
            <div className="flex flex-wrap gap-2">
              {CONDITIONS.map(c => (
                <button
                  key={c}
                  onClick={() => toggleCondition(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer
                    ${filters.conditions.includes(c)
                      ? 'bg-gold/15 border-gold/40 text-gold'
                      : 'bg-obsidian border-graphite text-silver hover:border-steel hover:text-ivory'
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Reseller + Price Range */}
          <div className="flex flex-wrap gap-4">
            <div className="min-w-[200px]">
              <label className="text-[11px] text-muted uppercase tracking-wider mb-2 block">Reseller</label>
              <select
                value={filters.reseller}
                onChange={e => onFilterChange({ ...filters, reseller: e.target.value })}
                className="w-full px-3 py-2 bg-obsidian border border-graphite rounded-lg text-sm text-ivory focus:outline-none focus:border-gold/50"
              >
                <option value="">All Resellers</option>
                {RESELLERS.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.country})</option>
                ))}
              </select>
            </div>

            <div className="min-w-[160px]">
              <label className="text-[11px] text-muted uppercase tracking-wider mb-2 block">Cross-Listed At</label>
              <select
                value={filters.minResellers || ''}
                onChange={e => onFilterChange({ ...filters, minResellers: e.target.value })}
                className="w-full px-3 py-2 bg-obsidian border border-graphite rounded-lg text-sm text-ivory focus:outline-none focus:border-gold/50"
              >
                <option value="">Any</option>
                <option value="2">2+ Resellers</option>
                <option value="3">3+ Resellers</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-muted uppercase tracking-wider mb-2 block">Price Range (USD)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={e => onFilterChange({ ...filters, minPrice: e.target.value })}
                  className="w-24 px-3 py-2 bg-obsidian border border-graphite rounded-lg text-sm text-ivory focus:outline-none focus:border-gold/50"
                />
                <span className="text-muted text-sm">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={e => onFilterChange({ ...filters, maxPrice: e.target.value })}
                  className="w-24 px-3 py-2 bg-obsidian border border-graphite rounded-lg text-sm text-ivory focus:outline-none focus:border-gold/50"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
