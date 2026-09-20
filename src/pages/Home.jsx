import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, ArrowRight, Tag, Star, ChefHat, Smartphone, Package, Truck, Bell, Check } from 'lucide-react'
import RestaurantCard from '../components/RestaurantCard'
import FoodCard from '../components/FoodCard'
import { useData } from '../context/DataContext'
import { locations, getLocation, setLocation } from '../utils/location'

const HeroSection = () => {
  const [location, setLoc] = useState(getLocation)
  const [pickerOpen, setPickerOpen] = useState(false)
  const pickerRef = useRef(null)

  useEffect(() => {
    const onClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setPickerOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleLocationSelect = (l) => {
    setLoc(l.label)
    setLocation(l.label)
    setPickerOpen(false)
  }

  return (
    <section className="hero-section" style={{ position: 'relative', minHeight: 'calc(100vh - var(--header-height))', display: 'flex', alignItems: 'center', overflow: 'hidden', background: 'linear-gradient(135deg, #FFF8F0 0%, #FFFFFF 50%, #FFF1E6 100%)' }}>
      <div className="hero-blob hero-blob-1" style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,107,53,0.1)', filter: 'blur(60px)' }} />
      <div className="hero-blob hero-blob-2" style={{ position: 'absolute', bottom: -100, left: 100, width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,200,87,0.15)', filter: 'blur(60px)' }} />

      <div className="container hero-grid">
        <div className="hero-content">
          <span className="hero-badge animate-slide-left" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #FFD9C4', borderRadius: 999, padding: '8px 16px', color: 'var(--coral)', fontSize: 13, fontWeight: 600, boxShadow: 'var(--shadow-sm)', marginBottom: 24 }}>
            <ChefHat size={16} /> Over 500+ restaurants near you
          </span>

          <h1 className="animate-fade-up" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20, fontFamily: 'var(--font-heading)', color: 'var(--navy)', letterSpacing: '-1px' }}>
            Good Food.
            <br />
            <span style={{ background: 'linear-gradient(135deg, var(--coral), var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Delivered Fast.
            </span>
          </h1>

          <p className="animate-fade-up" style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'var(--text-gray)', maxWidth: 480, marginBottom: 28 }}>
            Discover delicious meals from your favorite restaurants and get them delivered to your doorstep.
          </p>

          <div className="hero-location animate-fade-up" ref={pickerRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, color: 'var(--text-gray)', fontSize: 14 }}>
            <MapPin size={18} color="var(--coral)" />
            <span>Delivering to</span>
            <span style={{ color: 'var(--coral)', fontWeight: 700 }}>{location}</span>
            <span style={{ color: 'var(--text-light)' }}>•</span>
            <button
              onClick={() => setPickerOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={pickerOpen}
              style={{ color: 'var(--navy)', fontWeight: 600, textDecoration: 'underline' }}
            >
              Change
            </button>
            {pickerOpen && (
              <div
                role="listbox"
                aria-label="Select delivery location"
                className="location-picker animate-scale-in"
                style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow-lg)', minWidth: 220, padding: 8, zIndex: 60 }}
              >
                {locations.map((l) => {
                  const active = l.label === location
                  return (
                    <button
                      key={l.label}
                      role="option"
                      aria-selected={active}
                      onClick={() => handleLocationSelect(l)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 14, fontWeight: active ? 700 : 500, color: active ? 'var(--coral)' : 'var(--navy)', textAlign: 'left' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#FFF8F0' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <MapPin size={16} color={active ? 'var(--coral)' : 'var(--text-light)'} />
                      <span style={{ flex: 1 }}>{l.label}</span>
                      {active && <Check size={16} color="var(--coral)" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="hero-ctas animate-fade-up" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/restaurants" className="btn btn-primary btn-lg">
              Explore Food <ArrowRight size={18} />
            </Link>
            <Link to="/offers" className="btn btn-gold btn-lg">
              <Tag size={18} /> View Offers
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&auto=format&fit=crop"
            alt="Delicious food platter"
            className="hero-main-img float-slow"
            style={{ width: 'min(100%, 520px)', height: 'auto', borderRadius: 40, boxShadow: '0 30px 80px rgba(255,107,53,0.25)', transform: 'rotate(3deg)' }}
          />
          <div className="float-card float-animation" style={{ position: 'absolute', top: 30, right: '4%', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '12px 18px', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--gradient-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Star size={22} fill="#fff" />
            </div>
            <div>
              <strong style={{ fontSize: 16, color: 'var(--navy)' }}>4.8 / 5</strong>
              <p style={{ fontSize: 12, color: 'var(--text-gray)' }}>2k+ reviews</p>
            </div>
          </div>
          <div className="float-card float-slow" style={{ position: 'absolute', bottom: 40, left: '2%', background: 'rgba(16,24,40,0.9)', color: '#fff', borderRadius: 16, padding: '14px 20px', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--gradient-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={20} />
            </div>
            <div>
              <strong style={{ fontSize: 14 }}>30 min delivery</strong>
              <p style={{ fontSize: 12, color: '#C9D1D9' }}>Free over ₹300</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const CuisineStrip = ({ onSelect }) => {
  const cuisines = [
    { name: 'Indian', icon: '🍛', color: '#FFC857' },
    { name: 'Pizza', icon: '🍕', color: '#FF6B35' },
    { name: 'Burgers', icon: '🍔', color: '#22C55E' },
    { name: 'Biryani', icon: '🍚', color: '#FF6B35' },
    { name: 'Chinese', icon: '🥡', color: '#FFC857' },
    { name: 'Desserts', icon: '🍰', color: '#FF9A9E' },
    { name: 'Healthy', icon: '🥗', color: '#22C55E' },
  ]
  return (
    <section className="section-padding" style={{ paddingBottom: 40 }}>
      <div className="container">
        <h2 className="section-title">Popular Cuisines</h2>
        <p className="section-subtitle">Craving something specific? Find the perfect cuisine.</p>
        <div className="cuisine-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16 }}>
          {cuisines.map((c, i) => (
            <button
              key={c.name}
              onClick={() => onSelect(c.name)}
              className="cuisine-card"
              aria-label={`Browse ${c.name} cuisine`}
              style={{ padding: '24px 16px', borderRadius: 20, background: '#fff', boxShadow: 'var(--shadow-sm)', borderBottom: `4px solid ${c.color}`, transition: 'all 0.3s ease', animationDelay: `${i * 0.05}s` }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>{c.icon}</div>
              <strong style={{ fontSize: 15, color: 'var(--navy)' }}>{c.name}</strong>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

const TrendingSection = () => {
  const { restaurants, foods } = useData()
  const trending = foods.filter((f) => f.bestseller).slice(0, 8)
  return (
    <section className="section-padding" style={{ paddingTop: 40 }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 className="section-title" style={{ textAlign: 'left', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>Trending Now</h2>
            <p style={{ color: 'var(--text-gray)' }}>What everyone is craving this week</p>
          </div>
          <Link to="/restaurants" style={{ color: 'var(--coral)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            View all <ArrowRight size={18} />
          </Link>
        </div>
        <div className="food-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
          {trending.map((food) => {
            const rest = restaurants.find((r) => r.id === food.restaurantId)
            return <FoodCard key={food.id} food={food} restaurantName={rest?.name} />
          })}
        </div>
      </div>
    </section>
  )
}

const TopRestaurants = () => {
  const { restaurants } = useData()
  const top = [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 8)
  return (
    <section className="section-padding" style={{ paddingTop: 60, background: 'var(--gray-bg)' }}>
      <div className="container">
        <h2 className="section-title">Top Rated Restaurants</h2>
        <p className="section-subtitle">Handpicked by food lovers across the city</p>
        <div className="restaurant-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 24 }}>
          {top.map((rest) => <RestaurantCard key={rest.id} restaurant={rest} />)}
        </div>
      </div>
    </section>
  )
}

const OffersSection = () => {
  const offers = [
    { title: '50% OFF', desc: 'On your first order with code WELCOME50', icon: '🎉', color: 'var(--gradient-coral)' },
    { title: '20% OFF', desc: 'On all burgers with code FOOD20', icon: '🍔', color: 'var(--gradient-gold)' },
    { title: 'FREE DELIVERY', desc: 'On orders above ₹300 every day', icon: '🚚', color: 'var(--gradient-green)' },
  ]
  return (
    <section className="section-padding">
      <div className="container">
        <h2 className="section-title">Best Offers For You</h2>
        <p className="section-subtitle">Save more on every order</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {offers.map((offer, i) => (
            <div key={i} className="offer-card animate-fade-up" style={{ background: offer.color, borderRadius: 24, padding: 28, color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', display: 'flex', flexDirection: 'column', gap: 10, transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)`, marginBottom: 8 }}>
              <div style={{ position: 'absolute', right: -20, bottom: -20, fontSize: 90, opacity: 0.15 }}>{offer.icon}</div>
              <span style={{ fontSize: 40 }}>{offer.icon}</span>
              <h3 style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>{offer.title}</h3>
              <p style={{ fontSize: 14, opacity: 0.9 }}>{offer.desc}</p>
              <Link to="/restaurants" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, marginTop: 'auto', background: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', padding: '10px 18px', borderRadius: 999, fontSize: 14 }}>
                Order Now <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const RecommendedSection = () => {
  const { restaurants, foods } = useData()
  const rec = foods.filter((f) => f.rating >= 4.5).slice(0, 8)
  return (
    <section className="section-padding" style={{ paddingTop: 60, background: 'var(--gray-bg)' }}>
      <div className="container">
        <h2 className="section-title">Recommended For You</h2>
        <p className="section-subtitle">Personalized picks based on your taste</p>
        <div className="food-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
          {rec.map((food) => {
            const rest = restaurants.find((r) => r.id === food.restaurantId)
            return <FoodCard key={food.id} food={food} restaurantName={rest?.name} />
          })}
        </div>
      </div>
    </section>
  )
}

const HowItWorks = () => {
  const steps = [
    { icon: Search, title: 'Browse & Discover', desc: 'Explore hundreds of restaurants and cuisines near you.' },
    { icon: Bell, title: 'Place Your Order', desc: 'Customize your meal and check out in seconds.' },
    { icon: Truck, title: 'Fast Delivery', desc: 'Track your order in real-time until it reaches your door.' },
  ]
  return (
    <section className="section-padding">
      <div className="container">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Get delicious food in 3 simple steps</p>
        <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={i} className="how-card" style={{ textAlign: 'center', padding: '32px 24px', borderRadius: 24, background: '#fff', boxShadow: 'var(--shadow-md)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 16, right: 20, fontSize: 42, fontWeight: 800, color: '#FFF0E8', fontStyle: 'italic' }}>0{i + 1}</div>
                <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'var(--gradient-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: 'var(--shadow-coral)' }}>
                  <Icon size={34} color="#fff" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--navy)' }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-gray)' }}>{step.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const Testimonials = () => {
  const reviews = [
    { name: 'Priya Sharma', rating: 5, text: 'The food arrived hot and fresh, exactly as promised. Delishful is my go-to for every craving!', avatar: 'https://i.pravatar.cc/100?img=5' },
    { name: 'Rahul Verma', rating: 5, text: 'Ordered butter chicken from Spice Route and it was divine. Delivery was surprisingly fast.', avatar: 'https://i.pravatar.cc/100?img=12' },
    { name: 'Ananya Iyer', rating: 4, text: 'Loved the seamless checkout and real-time tracking. The UI is beautiful and so easy to use.', avatar: 'https://i.pravatar.cc/100?img=32' },
  ]
  return (
    <section className="section-padding" style={{ background: 'var(--navy)', color: '#fff' }}>
      <div className="container">
        <h2 className="section-title" style={{ color: '#fff' }}>What Our Customers Say</h2>
        <p className="section-subtitle" style={{ color: '#9CA3AF' }}>Loved by thousands of foodies across the city</p>
        <div className="testimonial-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {reviews.map((review, i) => (
            <div key={i} className="testimonial" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(6px)', borderRadius: 20, padding: 28, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 14 }} aria-label={`${review.rating} out of 5 stars`}>
                {[...Array(5)].map((_, s) => (
                  <span key={s} style={{ color: s < review.rating ? 'var(--gold)' : '#4B5563' }}>★</span>
                ))}
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 20, color: '#E5E7EB', fontStyle: 'italic' }}>"{review.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={review.avatar} alt={review.name} style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover' }} loading="lazy" />
                <div>
                  <strong style={{ fontSize: 15, color: '#fff' }}>{review.name}</strong>
                  <p style={{ fontSize: 13, color: '#9CA3AF' }}>Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const DownloadApp = () => {
  return (
    <section className="section-padding">
      <div className="container">
        <div style={{ background: 'var(--gradient-dark)', borderRadius: 32, padding: '48px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -40, top: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,107,53,0.2)', filter: 'blur(40px)' }} />
          <div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#fff', marginBottom: 12 }}>Get the App</h2>
            <p style={{ color: '#9CA3AF', marginBottom: 24, maxWidth: 400, fontSize: 15 }}>
              Order faster with exclusive app-only deals. Available on iOS and Android.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 10 }} aria-label="Download on App Store">
                <Smartphone size={20} /> App Store
              </button>
              <button className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff', display: 'flex', alignItems: 'center', gap: 10 }} aria-label="Get it on Google Play">
                <Package size={20} /> Google Play
              </button>
            </div>
          </div>
          <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&auto=format&fit=crop" alt="Delishful mobile app" loading="lazy" style={{ width: 200, borderRadius: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.4)', position: 'relative', zIndex: 1, display: 'none' }} />
        </div>
      </div>
    </section>
  )
}

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  return (
    <section className="section-padding" style={{ paddingTop: 0 }}>
      <div className="container">
        <div style={{ textAlign: 'center', background: 'var(--gradient-brand)', borderRadius: 28, padding: '40px 32px', boxShadow: 'var(--shadow-lg)', backgroundSize: '200% 200%', animation: 'gradientShift 6s ease infinite' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#fff', marginBottom: 8 }}>Get Exclusive Deals</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: 24 }}>Subscribe for the latest offers and discounts on your favorite meals.</p>
          {subscribed ? (
            <div style={{ background: '#fff', borderRadius: 14, padding: 16, display: 'inline-block', color: 'var(--green)', fontWeight: 700 }}>🎉 Subscribed! Check your inbox.</div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) setSubscribed(true) }} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 440, margin: '0 auto', background: '#fff', padding: 8, borderRadius: 16 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address"
                style={{ flex: '1 1 160px', minWidth: 0, border: 'none', outline: 'none', padding: '12px', fontSize: 14, color: 'var(--navy)', background: 'transparent' }}
              />
              <button type="submit" className="btn btn-secondary" style={{ borderRadius: 10, whiteSpace: 'nowrap' }}>Subscribe</button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

const Home = () => {
  const navigate = useNavigate()
  const handleCuisineSelect = (cuisine) => navigate(`/restaurants?cuisine=${cuisine}`)

  return (
    <main className="page-enter">
      <HeroSection />
      <CuisineStrip onSelect={handleCuisineSelect} />
      <TrendingSection />
      <TopRestaurants />
      <OffersSection />
      <RecommendedSection />
      <HowItWorks />
      <Testimonials />
      <DownloadApp />
      <Newsletter />
    </main>
  )
}

export default Home
