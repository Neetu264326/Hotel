import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import FoodCard from '../components/FoodCard'
import { SkeletonCard } from '../components/LoadingSpinner'
import { useData } from '../context/DataContext'

const SearchResults = () => {
  const { restaurants, foods } = useData()
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [loading, setLoading] = useState(true)

  const restById = useMemo(() => {
    const map = {}
    restaurants.forEach((r) => { map[r.id] = r })
    return map
  }, [restaurants])

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [query])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const words = q.split(/\s+/).filter(Boolean)

    const matches = foods.filter((f) => {
      const haystack = [
        f.name,
        f.description,
        f.category,
        ...(f.ingredients || []),
      ].filter(Boolean).join(' ').toLowerCase()
      return words.every((w) => haystack.includes(w))
    })

    const rated = [...matches].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return rated
  }, [foods, query])

  return (
    <main className="page-enter" style={{ minHeight: '70vh' }}>
      <section style={{ background: 'var(--gradient-dark)', padding: '60px 0' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: 8 }}>Search Food</h1>
          <p style={{ color: '#9CA3AF', fontSize: 15, marginBottom: 20 }}>
            {query ? `Found ${results.length} dishes for "${query}"` : 'Search for any dish across all restaurants'}
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); setQuery(e.currentTarget.query.value) }}
            style={{ display: 'flex', gap: 10, maxWidth: 540, background: '#fff', borderRadius: 16, padding: 8, boxShadow: 'var(--shadow-lg)' }}
          >
            <input
              name="query"
              defaultValue={query}
              placeholder="Search dishes e.g. biryani, pizza, paneer..."
              aria-label="Search dishes"
              style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', fontSize: 16, padding: '12px 14px', color: '#1F2937', background: 'transparent' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: 15, whiteSpace: 'nowrap', flexShrink: 0 }}>
              <Search size={18} /> Search
            </button>
          </form>
        </div>
      </section>

      <section className="container" style={{ padding: '40px 0 60px' }}>
        {loading ? (
          <div className="food-grid">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} height={170} />)}
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 56 }}>🍽️</div>
            <h2 style={{ fontSize: 22, color: 'var(--navy)', marginBottom: 8 }}>No dishes found</h2>
            <p style={{ color: 'var(--text-gray)', marginBottom: 20 }}>Try a different dish name or explore all restaurants</p>
            <a href="/restaurants" className="btn btn-primary">Browse Restaurants</a>
          </div>
        ) : (
          <div className="food-grid">
            {results.map((food) => {
              const rest = restById[food.restaurantId]
              return <FoodCard key={food.id} food={food} restaurantName={rest?.name} />
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export default SearchResults