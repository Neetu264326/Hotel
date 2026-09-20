import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Leaf, Tag } from 'lucide-react'
import RestaurantCard from '../components/RestaurantCard'
import { SkeletonCard } from '../components/LoadingSpinner'
import { useData } from '../context/DataContext'

const priceRange = (r) => (r.priceRange.match(/\d[\d,]*/g) || []).map((s) => parseInt(s.replace(/,/g, ''), 10))

const priceValue = (r) => {
  const [min, max] = priceRange(r)
  return Math.round(((min || 0) + (max || min || 0)) / 2)
}

const Restaurants = () => {
  const { restaurants, foods, cuisines } = useData()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    cuisine: 'All',
    rating: 0,
    price: 'All',
    deliveryTime: 0,
    vegOnly: false,
    offersOnly: false,
  })
  const [sort, setSort] = useState('recommended')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    const cuisine = searchParams.get('cuisine')
    const search = searchParams.get('search')
    if (cuisine) setFilters((f) => ({ ...f, cuisine }))
    if (search) setSearchQuery(search)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    let result = [...restaurants]

    if (filters.cuisine !== 'All') {
      result = result.filter((r) => r.cuisine.toLowerCase() === filters.cuisine.toLowerCase())
    }
    if (filters.rating > 0) {
      result = result.filter((r) => r.rating >= filters.rating)
    }
    if (filters.price === 'Low') {
      result = result.filter((r) => priceValue(r) <= 250)
    } else if (filters.price === 'Mid') {
      result = result.filter((r) => priceValue(r) > 250 && priceValue(r) <= 400)
    } else if (filters.price === 'High') {
      result = result.filter((r) => priceValue(r) > 400)
    }
    if (filters.deliveryTime > 0) {
      result = result.filter((r) => r.deliveryTime <= filters.deliveryTime)
    }
    if (filters.vegOnly) {
      result = result.filter((r) => r.vegetarian)
    }
    if (filters.offersOnly) {
      result = result.filter((r) => r.discount && r.discount !== '')
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((r) => {
        if (r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)) return true
        return foods.some(
          (f) =>
            f.restaurantId === r.id &&
            (f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q) || f.category.toLowerCase().includes(q))
        )
      })
    }

    switch (sort) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'fastest':
        result.sort((a, b) => a.deliveryTime - b.deliveryTime)
        break
      case 'price-low':
        result.sort((a, b) => priceValue(a) - priceValue(b))
        break
      case 'price-high':
        result.sort((a, b) => priceValue(b) - priceValue(a))
        break
      default:
        result.sort((a, b) => b.reviews - a.reviews)
    }
    return result
  }, [restaurants, foods, filters, sort, searchQuery])

  const updateFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }))

  const clearFilters = () => setFilters({ cuisine: 'All', rating: 0, price: 'All', deliveryTime: 0, vegOnly: false, offersOnly: false })

  return (
    <main className="page-enter" style={{ minHeight: '70vh' }}>
      <section className="restaurants-hero" style={{ background: 'var(--gradient-dark)', padding: '60px 0' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: 8 }}>Discover Restaurants</h1>
          <p style={{ color: '#9CA3AF', fontSize: 15 }}>Finding {filtered.length} restaurants {filters.cuisine !== 'All' ? `serving ${filters.cuisine}` : 'near you'}</p>
        </div>
      </section>

      <section className="container" style={{ padding: '40px 0' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
          <button
            className="btn btn-outline filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-controls="filters"
            style={{ padding: '10px 18px', fontSize: 14, borderColor: 'var(--navy)', color: 'var(--navy)' }}
          >
            <SlidersHorizontal size={18} /> Filters
            {Object.values(filters).some((v) => v && v !== 'All') && <span style={{ background: 'var(--coral)', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}></span>}
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort restaurants"
            style={{ padding: '10px 16px', borderRadius: 12, border: '2px solid var(--border)', fontSize: 14, background: '#fff', outline: 'none', fontWeight: 500 }}
          >
            <option value="recommended">Recommended</option>
            <option value="rating">Rating: High to Low</option>
            <option value="fastest">Fastest Delivery</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search restaurants..."
            aria-label="Search restaurants"
            style={{ padding: '10px 16px', borderRadius: 12, border: '2px solid var(--border)', fontSize: 14, outline: 'none', flex: 1, minWidth: 200 }}
          />
        </div>

        {showFilters && (
          <div id="filters" className="filters-panel animate-scale-in" style={{ background: '#fff', borderRadius: 20, boxShadow: 'var(--shadow-md)', padding: 24, marginBottom: 28 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', display: 'block', marginBottom: 8 }}>Cuisine</label>
                <select value={filters.cuisine} onChange={(e) => updateFilter('cuisine', e.target.value)} aria-label="Filter by cuisine" style={{ width: '100%', padding: '10px', borderRadius: 10, border: '2px solid var(--border)', fontSize: 14, outline: 'none' }}>
                  {cuisines.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', display: 'block', marginBottom: 8 }}>Minimum Rating</label>
                <select value={filters.rating} onChange={(e) => updateFilter('rating', Number(e.target.value))} aria-label="Filter by rating" style={{ width: '100%', padding: '10px', borderRadius: 10, border: '2px solid var(--border)', fontSize: 14, outline: 'none' }}>
                  <option value={0}>Any</option>
                  <option value={4.5}>4.5+</option>
                  <option value={4.0}>4.0+</option>
                  <option value={3.5}>3.5+</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', display: 'block', marginBottom: 8 }}>Price Range</label>
                <select value={filters.price} onChange={(e) => updateFilter('price', e.target.value)} aria-label="Filter by price" style={{ width: '100%', padding: '10px', borderRadius: 10, border: '2px solid var(--border)', fontSize: 14, outline: 'none' }}>
                  <option value="All">Any</option>
                  <option value="Low">Budget (under ₹250)</option>
                  <option value="Mid">Mid (₹250-₹400)</option>
                  <option value="High">Premium (₹400+)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', display: 'block', marginBottom: 8 }}>Delivery Time</label>
                <select value={filters.deliveryTime} onChange={(e) => updateFilter('deliveryTime', Number(e.target.value))} aria-label="Filter by delivery time" style={{ width: '100%', padding: '10px', borderRadius: 10, border: '2px solid var(--border)', fontSize: 14, outline: 'none' }}>
                  <option value={0}>Any</option>
                  <option value={20}>Under 20 min</option>
                  <option value={25}>Under 25 min</option>
                  <option value={30}>Under 30 min</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', display: 'block', marginBottom: 8 }}>Preferences</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button onClick={() => updateFilter('vegOnly', !filters.vegOnly)} aria-pressed={filters.vegOnly} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
                    <span className="veg-toggle" style={{ width: 18, height: 18, borderRadius: 5, border: filters.vegOnly ? '2px solid #22C55E' : '2px solid #D1D5DB', background: filters.vegOnly ? '#DCFCE7' : '#fff', display: 'inline-block', position: 'relative' }}>
                      {filters.vegOnly && <span style={{ position: 'absolute', inset: 3, borderRadius: '50%', background: '#22C55E' }} />}
                    </span>
                    <Leaf size={15} color="#22C55E" /> Vegetarian only
                  </button>
                  <button onClick={() => updateFilter('offersOnly', !filters.offersOnly)} aria-pressed={filters.offersOnly} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
                    <span className="veg-toggle" style={{ width: 18, height: 18, borderRadius: 5, border: filters.offersOnly ? '2px solid #FF6B35' : '2px solid #D1D5DB', background: filters.offersOnly ? '#FFF1E6' : '#fff', display: 'inline-block', position: 'relative' }}>
                      {filters.offersOnly && <span style={{ position: 'absolute', inset: 3, borderRadius: '50%', background: '#FF6B35' }} />}
                    </span>
                    <Tag size={15} color="#FF6B35" /> Offers available
                  </button>
                </div>
              </div>
            </div>
            <button onClick={clearFilters} style={{ marginTop: 16, color: 'var(--coral)', fontWeight: 600, fontSize: 14 }}>Clear all filters</button>
          </div>
        )}

        {loading ? (
          <div className="restaurant-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 24 }}>
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} height={200} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 56 }}>🍽️</div>
            <h2 style={{ fontSize: 22, color: 'var(--navy)', marginBottom: 8 }}>No restaurants found</h2>
            <p style={{ color: 'var(--text-gray)', marginBottom: 20 }}>Try adjusting your filters or search query</p>
            <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <div className="restaurant-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 24 }}>
            {filtered.map((rest) => <RestaurantCard key={rest.id} restaurant={rest} />)}
          </div>
        )}
      </section>
    </main>
  )
}

export default Restaurants
