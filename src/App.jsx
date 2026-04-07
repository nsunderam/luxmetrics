import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import Filters from './components/Filters'
import BagCard from './components/BagCard'
import DetailModal from './components/DetailModal'
import MispricingChart from './components/MispricingChart'
import { LayoutGrid, BarChart3, Loader2, Diamond, Search } from 'lucide-react'

export default function App() {
  const [currency, setCurrency] = useState('USD')
  const [selectedListing, setSelectedListing] = useState(null)
  const [view, setView] = useState('grid')
  const [listings, setListings] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [apiStats, setApiStats] = useState(null)
  const [filters, setFilters] = useState({
    search: '',
    brands: [],
    conditions: [],
    sort: 'mispricing-asc',
    mispricingOnly: false,
    reseller: '',
    minPrice: '',
    maxPrice: '',
  })
  const [page, setPage] = useState(1)
  const PER_PAGE = 36

  // Build query string from filters
  const buildQuery = useCallback(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.brands.length > 0) params.set('brand', filters.brands.join(','))
    if (filters.conditions.length > 0) params.set('condition', filters.conditions.join(','))
    if (filters.reseller) params.set('reseller', filters.reseller)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.minResellers) params.set('minResellers', filters.minResellers)
    if (filters.mispricingOnly) params.set('mispricingBelow', '-10')

    // Map frontend sort names to API sort names
    const sortMap = {
      'mispricing-asc': 'mispricing_asc',
      'mispricing-desc': 'mispricing_desc',
      'price-asc': 'price_asc',
      'price-desc': 'price_desc',
      'days-desc': 'days_desc',
      'days-asc': 'days_asc',
    }
    params.set('sort', sortMap[filters.sort] || 'mispricing_asc')
    params.set('page', page)
    params.set('limit', PER_PAGE)

    return params.toString()
  }, [filters, page])

  // Fetch global stats
  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setApiStats).catch(() => {})
  }, [])

  // Fetch listings from API
  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch(`/api/listings?${buildQuery()}`)
      .then(res => {
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        return res.json()
      })
      .then(data => {
        setListings(data.listings)
        setTotal(data.total)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to fetch listings:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [buildQuery])

  const totalPages = Math.ceil(total / PER_PAGE)

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-midnight">
      <Header currency={currency} onCurrencyChange={setCurrency} />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Hero */}
        <div className="text-center py-6 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-ivory tracking-tight">
            Luxury bags, <span className="bg-gradient-to-r from-gold-dark via-gold to-gold-dark bg-clip-text text-transparent">priced below market</span>
          </h1>
          <p className="text-sm text-muted mt-2 tracking-wide">
            {apiStats ? `${apiStats.totalListings.toLocaleString()} bags` : '...'} · {apiStats?.resellers || '...'} resellers · {apiStats?.brands || '...'} brands · Updated live
          </p>
        </div>

        {/* Stats */}
        <StatsBar listings={listings} currency={currency} total={total} stats={apiStats} />

        {/* Filters */}
        <Filters filters={filters} onFilterChange={handleFilterChange} />

        {/* Results bar: count + view toggle */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-silver font-medium">
            <span className="text-ivory">{total.toLocaleString()}</span> listing{total !== 1 ? 's' : ''}
            {(filters.brands.length > 0 || filters.conditions.length > 0 || filters.search || filters.reseller || filters.mispricingOnly || filters.minResellers) && (
              <span className="text-muted"> after filters</span>
            )}
            {loading && <Loader2 className="w-3 h-3 inline ml-2 animate-spin" />}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${view === 'grid' ? 'bg-gold/10 text-gold-dark' : 'text-muted hover:text-ivory'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('analytics')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${view === 'analytics' ? 'bg-gold/10 text-gold-dark' : 'text-muted hover:text-ivory'}`}
            >
              <BarChart3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center py-10 bg-rose-accent/10 border border-rose-accent/30 rounded-xl">
            <p className="text-sm text-rose-accent mb-1">Failed to load listings</p>
            <p className="text-xs text-muted">{error}</p>
            <p className="text-xs text-muted mt-2">Make sure the backend is running: <code className="bg-carbon px-2 py-0.5 rounded">npm run dev:server</code></p>
          </div>
        )}

        {/* Analytics View */}
        {view === 'analytics' && <MispricingChart listings={listings} />}

        {/* Grid View */}
        {view === 'grid' && !error && (
          <>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                    <div className="h-52 shimmer" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 w-3/4 rounded shimmer" />
                      <div className="h-3 w-1/2 rounded shimmer" />
                      <div className="h-6 w-2/3 rounded shimmer" />
                      <div className="h-px bg-graphite/50" />
                      <div className="h-3 w-1/3 rounded shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {listings.map((listing, i) => (
                <div key={listing.id} style={{ animationDelay: `${i * 30}ms` }} className="animate-fade-in">
                  <BagCard
                    listing={listing}
                    currency={currency}
                    onClick={() => setSelectedListing(listing)}
                  />
                </div>
              ))}
            </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg bg-carbon border border-graphite text-sm text-silver hover:text-ivory hover:border-steel disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 7) {
                      pageNum = i + 1
                    } else if (page <= 4) {
                      pageNum = i + 1
                    } else if (page >= totalPages - 3) {
                      pageNum = totalPages - 6 + i
                    } else {
                      pageNum = page - 3 + i
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer
                          ${page === pageNum
                            ? 'bg-black/10 text-ivory border border-graphite'
                            : 'text-muted hover:text-ivory hover:bg-carbon'
                          }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg bg-carbon border border-graphite text-sm text-silver hover:text-ivory hover:border-steel disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && !error && listings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-lg text-muted mb-2">No listings match your filters</p>
            <p className="text-sm text-muted/60">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <DetailModal
        listing={selectedListing}
        currency={currency}
        onClose={() => setSelectedListing(null)}
      />
    </div>
  )
}
