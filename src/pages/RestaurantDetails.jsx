import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Star, Clock, Bike, Leaf, ArrowLeft, UtensilsCrossed } from 'lucide-react'
import FoodCard from '../components/FoodCard'
import { SkeletonCard } from '../components/LoadingSpinner'
import { useData } from '../context/DataContext'

const RestaurantDetails = () => {
  const { id } = useParams()
  const { restaurants, foods } = useData()
  const restaurant = restaurants.find((r) => String(r.id) === String(id))
  const [activeCat, setActiveCat] = useState('Recommended')
  const [loading, setLoading] = useState(true)
  const categoryRefs = useRef({})

  useEffect(() => {
    setLoading(true)
    setActiveCat('Recommended')
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [id])

  // Scroll-spy: highlight the category tab that's currently in view.
  useEffect(() => {
    if (loading || !restaurant) return undefined
    const sections = (restaurant.categories || [])
      .map((cat) => categoryRefs.current[cat])
      .filter(Boolean)
    if (sections.length === 0) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCat(entry.target.getAttribute('data-cat'))
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0.05 }
    )
    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [loading, restaurant, id])

  if (!restaurant) {
    return (
      <div style={{ textAlign: 'center', padding: 80 }}>
        <div style={{ fontSize: 48 }}>😕</div>
        <h2 style={{ marginBottom: 12 }}>Restaurant not found</h2>
        <a href="/restaurants" className="btn btn-primary">Back to Restaurants</a>
      </div>
    )
  }

  const cats = restaurant.categories
  const restFoods = foods.filter((f) => f.restaurantId === restaurant.id)

  const scrollToCategory = (cat) => {
    setActiveCat(cat)
    const el = categoryRefs.current[cat]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const ratingColor = restaurant.rating >= 4.5 ? '#22C55E' : '#FFC857'

  return (
    <main className="page-enter">
      <section className="restaurant-hero" style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
        <img src={restaurant.image} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(16,24,40,0.9), rgba(16,24,40,0.1))' }} />
        <button
          onClick={() => window.history.back()}
          aria-label="Go back"
          style={{ position: 'absolute', top: 20, left: 20, width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}
        >
          <ArrowLeft size={20} color="var(--navy)" />
        </button>
        <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0 }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
              <img src={restaurant.logo} alt={`${restaurant.name} logo`} style={{ width: 90, height: 90, borderRadius: 24, border: '4px solid #fff', boxShadow: 'var(--shadow-lg)', objectFit: 'cover' }} />
              <div style={{ color: '#fff', flex: 1, minWidth: 200 }}>
                <h1 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: 4 }}>{restaurant.name}</h1>
                <p style={{ color: '#CBD5E1', fontSize: 14 }}>{restaurant.cuisine} • {restaurant.priceRange}</p>
                <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 13, flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ background: ratingColor, color: '#fff', borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>
                      <Star size={11} fill="#fff" style={{ verticalAlign: 'middle', marginRight: 3 }} />{restaurant.rating}
                    </span>
                    {restaurant.reviews.toLocaleString()} ratings
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> {restaurant.deliveryTime}-{restaurant.deliveryTime + 10} min</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Bike size={14} /> ₹{restaurant.deliveryFee}</span>
                  {restaurant.vegetarian && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Leaf size={14} /> Pure Veg</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="restaurant-desc" style={{ padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <span className="badge badge-offer" style={{ marginBottom: 8 }}>OFFER&nbsp;&nbsp;{restaurant.discount}</span>
          <p style={{ fontSize: 14, color: 'var(--text-gray)', maxWidth: 700 }}>{restaurant.description}</p>
        </div>
      </section>

      <nav className="category-nav" aria-label="Menu categories" style={{ position: 'sticky', top: 'var(--header-height)', zIndex: 50, background: '#fff', borderBottom: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(16,24,40,0.05)' }}>
        <div className="container" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '14px 0', scrollbarWidth: 'thin' }}>
          {cats.map((cat) => (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              className={`category-tab ${activeCat === cat ? 'active' : ''}`}
              aria-current={activeCat === cat ? 'true' : undefined}
              style={{
                padding: '9px 18px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
                fontSize: 14,
                fontWeight: activeCat === cat ? 700 : 500,
                background: activeCat === cat ? 'var(--coral)' : '#F3F4F6',
                color: activeCat === cat ? '#fff' : 'var(--navy)',
                transition: 'all 0.3s',
                flexShrink: 0,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      <div className="container restaurant-menu" style={{ padding: '24px 0 60px', display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr)', gap: 30 }}>
        {cats.map((cat) => {
          const catFoods = cat === 'Recommended'
            ? restFoods.filter((f) => f.bestseller)
            : restFoods.filter((f) => f.category === cat)
          if (catFoods.length === 0) return null
          return (
            <section key={cat} data-cat={cat} ref={(el) => { categoryRefs.current[cat] = el }} style={{ scrollMarginTop: 200 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy)', marginBottom: 20, paddingTop: 12 }}>
                {cat} <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-light)', verticalAlign: 'middle' }}>({catFoods.length} items)</span>
              </h2>
              {loading ? (
                <div className="food-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
                  {[...Array(3)].map((_, i) => <SkeletonCard key={i} height={170} />)}
                </div>
              ) : (
                <div className="food-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
                  {catFoods.map((food) => <FoodCard key={food.id} food={food} restaurantName={restaurant.name} />)}
                </div>
              )}
            </section>
          )
        })}
        {restFoods.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <UtensilsCrossed size={44} color="var(--text-light)" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ fontSize: 22, color: 'var(--navy)', marginBottom: 8 }}>Menu coming soon</h2>
            <p style={{ color: 'var(--text-gray)', marginBottom: 20 }}>This restaurant hasn't added their menu yet.</p>
            <a href="/restaurants" className="btn btn-primary">Browse other restaurants</a>
          </div>
        )}
      </div>
    </main>
  )
}

export default RestaurantDetails
