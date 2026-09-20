import { useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Bike, Clock, ChevronRight } from 'lucide-react'
import { useOrder } from '../context/OrderContext'

const Confetti = () => {
  const colors = ['#FF6B35', '#FFC857', '#22C55E', '#101828', '#FF8A5C']
  const pieces = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 3,
        color: colors[i % colors.length],
        size: 12 + Math.random() * 10,
        fall: 3 + Math.random() * 2,
      })),
    []
  )
  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {pieces.map((p, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            position: 'fixed',
            top: -20,
            left: `clamp(0%, ${p.left}%, calc(100% - ${p.size}px))`,
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
            animation: `confettiFall ${p.fall}s linear ${p.delay}s infinite`,
            zIndex: 0,
            borderRadius: 2,
            pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  )
}

const OrderSuccess = () => {
  const { activeOrder } = useOrder()
  const navigate = useNavigate()

  const order = activeOrder

  useEffect(() => {
    if (order) return undefined
    const t = setTimeout(() => navigate('/restaurants', { replace: true }), 4000)
    return () => clearTimeout(t)
  }, [order, navigate])

  if (!order || !order.orderId) {
    return (
      <main className="page-enter" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div style={{ textAlign: 'center', background: '#fff', borderRadius: 32, boxShadow: 'var(--shadow-lg)', padding: 60, maxWidth: 520, margin: '0 auto' }}>
            <div style={{ fontSize: 56 }}>🛒</div>
            <h1 style={{ fontSize: 26, color: 'var(--navy)', marginBottom: 8 }}>No recent order</h1>
            <p style={{ color: 'var(--text-gray)', marginBottom: 28 }}>
              You don't have a confirmed order right now. Explore restaurants and place your first order.
            </p>
            <div style={{ display: 'grid', gap: 12 }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/restaurants')}>
                Browse Restaurants
              </button>
              <button className="btn btn-outline btn-lg" style={{ borderColor: 'var(--coral)', color: 'var(--coral)' }} onClick={() => navigate('/')}>
                Go to Homepage
              </button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 16 }}>Redirecting to restaurants…</p>
          </div>
        </div>
      </main>
    )
  }

  const orderId = order.orderId
  const restaurantName = order?.restaurant?.name || 'Your Restaurant'
  const items = order?.items || []
  const total = order?.total || 0
  const paymentMethod = order?.paymentMethod || 'Cash on Delivery'
  const address = order?.address
  const estimated = order?.estimatedMinutes || 30

  return (
    <main className="page-enter" style={{ minHeight: '70vh', position: 'relative', padding: '60px 0' }}>
      <Confetti />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', borderRadius: 32, boxShadow: 'var(--shadow-lg)', padding: 60, maxWidth: 600, margin: '0 auto' }}>
          <div
            className="success-checkmark"
            style={{
              width: 110,
              height: 110,
              borderRadius: '50%',
              background: 'var(--gradient-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 28px',
              boxShadow: '0 12px 40px rgba(34,197,94,0.35)',
              animation: 'bounceIn 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            }}
          >
            <svg width="60" height="60" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="24" stroke="#fff" strokeWidth="3" fill="none" opacity="0.3" />
              <path d="M14 27 L22 35 L38 19" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray="100" strokeDashoffset="0" style={{ animation: 'drawCheck 0.8s ease 0.4s both' }} />
            </svg>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', color: 'var(--navy)', marginBottom: 8 }}>Order Confirmed!</h1>
          <p style={{ color: 'var(--text-gray)', fontSize: 18, marginBottom: 6 }}>Order #{orderId}</p>
          <p style={{ color: 'var(--coral)', fontWeight: 700, fontSize: 16, marginBottom: 28, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Clock size={18} /> Arriving in {estimated}-{estimated + 5} minutes
          </p>

          <div style={{ background: '#F9FAFB', borderRadius: 16, padding: 24, textAlign: 'left', marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <strong style={{ color: 'var(--navy)' }}>{restaurantName}</strong>
              <span style={{ fontSize: 14, color: 'var(--text-gray)' }}>{items.length} items</span>
            </div>
            <div style={{ display: 'grid', gap: 6, marginBottom: 16 }}>
              {items.slice(0, 4).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span>{item.quantity}× {item.name}</span>
                  <span style={{ fontWeight: 600 }}>₹{item.lineTotal}</span>
                </div>
              ))}
              {items.length > 4 && <p style={{ fontSize: 13, color: 'var(--text-gray)' }}>+{items.length - 4} more items</p>}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--navy)' }}>Total Amount</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--coral)' }}>₹{total}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 14, fontSize: 14, color: 'var(--text-gray)' }}>
              <Bike size={16} color="var(--coral)" /> {paymentMethod}
            </div>
          </div>

          {address && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'var(--text-gray)', marginBottom: 28, textAlign: 'left', background: '#FFF8F0', borderRadius: 12, padding: 16 }}>
              <MapPin size={18} color="var(--coral)" style={{ flexShrink: 0, marginTop: 2 }} />
              <span>
                <strong style={{ color: 'var(--navy)' }}>{address.fullName}</strong> • {address.phone}<br />
                {address.house}, {address.street}<br />
                {address.city}, {address.state} - {address.pincode}
              </span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button className="btn btn-primary" onClick={() => navigate('/track-order')}>
              Track Order <ChevronRight size={16} />
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/restaurants')}>
              Continue Shopping
            </button>
          </div>
          <Link to="/track-order" style={{ display: 'inline-block', marginTop: 16, color: 'var(--coral)', fontWeight: 600, fontSize: 14 }}>
            View Order Details
          </Link>
        </div>
      </div>
    </main>
  )
}

export default OrderSuccess
