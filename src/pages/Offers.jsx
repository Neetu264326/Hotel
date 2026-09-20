import { useData } from '../context/DataContext'
import RestaurantCard from '../components/RestaurantCard'

const Offers = () => {
  const { restaurants, coupons } = useData()
  const offerRestaurants = restaurants.filter((r) => r.discount)

  const couponCards = coupons.map((c, i) => ({
    code: c.code,
    desc: c.description,
    icon: ['🎉', '🍔', '🚀', '💎'][i % 4],
  }))

  return (
    <main className="page-enter" style={{ minHeight: '70vh', paddingBottom: 80 }}>
      <section style={{ background: 'var(--gradient-dark)', padding: '60px 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 4vw, 2.6rem)', marginBottom: 8 }}>Exclusive Offers</h1>
          <p style={{ color: '#9CA3AF', fontSize: 16 }}>Save big on every order with these deals</p>
        </div>
      </section>

      <section className="container section-padding" style={{ paddingTop: 40 }}>
        <h2 className="section-title" style={{ fontSize: '1.6rem' }}>Coupon Codes</h2>
        <p className="section-subtitle">Apply these at checkout</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>
          {couponCards.map((c) => (
            <div key={c.code} style={{ background: '#fff', border: '2px dashed var(--coral)', borderRadius: 18, padding: 24, textAlign: 'center', transition: 'transform 0.3s' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{c.icon}</div>
              <h3 style={{ color: 'var(--coral)', fontSize: 20, fontWeight: 800, letterSpacing: 1 }}>{c.code}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-gray)' }}>{c.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="section-title" style={{ fontSize: '1.6rem' }}>Restaurants With Active Offers</h2>
        <p className="section-subtitle">Limited time offers on your favorites</p>
        <div className="restaurant-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 24 }}>
          {offerRestaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      </section>
    </main>
  )
}

export default Offers
