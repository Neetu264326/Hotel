import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Bike, MapPin, Phone, PartyPopper } from 'lucide-react'
import { useOrder } from '../context/OrderContext'
import OrderTracker from '../components/OrderTracker'

const TRACK_KEY = 'delishful_tracking'
const STEP_TIMES = [0, 3, 8, 13, 18, 22]

const readTracking = () => {
  try {
    const raw = localStorage.getItem(TRACK_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const writeTracking = (orderId, startedAt) => {
  try {
    localStorage.setItem(TRACK_KEY, JSON.stringify({ orderId, startedAt }))
  } catch {
    // ignore
  }
}

const stepAtElapsed = (elapsedSec) => {
  let step = 0
  for (let i = 0; i < STEP_TIMES.length; i++) {
    if (elapsedSec >= STEP_TIMES[i]) step = i
  }
  return Math.min(step, STEP_TIMES.length - 1)
}

const TrackOrder = () => {
  const { activeOrder } = useOrder()
  const navigate = useNavigate()
  const [now, setNow] = useState(Date.now())
  const startedAtRef = useRef(Date.now())

  const order = activeOrder

  useEffect(() => {
    if (!order) return undefined
    const stored = readTracking()
    const started = stored && (stored.orderId === order.orderId || stored.orderId === order.id)
      ? stored.startedAt
      : Date.now()

    // Never restart a progress clock that already exists for this order.
    if (stored && stored.orderId === order.orderId) {
      startedAtRef.current = stored.startedAt
    } else {
      startedAtRef.current = started
      writeTracking(order.orderId || order.id, started)
    }

    const tick = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(tick)
  }, [order?.orderId, order?.id])

  useEffect(() => {
    if (!order) return undefined
    const t = setTimeout(() => setNow(Date.now()), 50)
    return () => clearTimeout(t)
  }, [order?.orderId, order?.id])

  if (!order || !order.items || order.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 80, minHeight: '60vh' }}>
        <div style={{ fontSize: 56 }}>📦</div>
        <h2 style={{ marginBottom: 12 }}>No active order</h2>
        <p style={{ color: 'var(--text-gray)', marginBottom: 24 }}>Place an order to track it here.</p>
        <button className="btn btn-primary" onClick={() => navigate('/restaurants')}>Browse Restaurants</button>
      </div>
    )
  }

  const elapsedSec = Math.floor((now - startedAtRef.current) / 1000)
  const currentStep = stepAtElapsed(elapsedSec)
  const totalMinutes = order.estimatedMinutes || 35
  const remaining = Math.max(totalMinutes - Math.floor(elapsedSec / 60), 0)
  const isDelivered = currentStep >= STEP_TIMES.length - 1

  const restaurant = order.restaurant
  const total = order.total

  return (
    <main className="page-enter" style={{ padding: '40px 0 80px', minHeight: '70vh' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--navy)' }}>Track Your Order</h1>

        <OrderTracker currentStep={currentStep} estimatedMinutes={Math.max(remaining, 1)} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 20, marginTop: 30 }}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: 'var(--shadow-sm)', padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bike size={20} color="var(--coral)" /> Delivery Partner
            </h3>
            {isDelivered ? (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--gradient-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <PartyPopper size={26} />
                </div>
                <div>
                  <strong style={{ fontSize: 15, color: 'var(--navy)' }}>Delivered</strong>
                  <p style={{ fontSize: 13, color: 'var(--text-gray)' }}>Enjoy your meal! 🎉</p>
                </div>
              </div>
            ) : currentStep >= 3 ? (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <img src="https://i.pravatar.cc/80?img=68" alt="Delivery partner" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <strong style={{ fontSize: 15, color: 'var(--navy)' }}>Raj Kumar</strong>
                  <p style={{ fontSize: 13, color: 'var(--text-gray)' }}>Your food is on the way</p>
                  <p style={{ fontSize: 13, color: 'var(--coral)', fontWeight: 600 }}>★★★★★ 4.9</p>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 14, color: 'var(--text-gray)' }}>Assigning your delivery partner...</p>
            )}
          </div>

          <div style={{ background: '#fff', borderRadius: 18, boxShadow: 'var(--shadow-sm)', padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={20} color="var(--coral)" /> Order Details
            </h3>
            <p style={{ fontSize: 14 }}>Order #{order.orderId || order.id}</p>
            <p style={{ fontSize: 14, color: 'var(--text-gray)' }}>{restaurant?.name}</p>
            <div style={{ display: 'grid', gap: 4, marginTop: 8, fontSize: 13 }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.quantity}× {item.name}</span>
                  <span>₹{item.lineTotal}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
              <strong>Total</strong>
              <strong style={{ color: 'var(--coral)' }}>₹{total}</strong>
            </div>
          </div>
        </div>

        {order.address && (
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: 'var(--shadow-sm)', padding: 24, marginTop: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <MapPin size={20} color="var(--coral)" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong style={{ fontSize: 15, color: 'var(--navy)' }}>Delivering to</strong>
              <p style={{ fontSize: 14, color: 'var(--text-gray)' }}>
                {order.address.house}, {order.address.street}, {order.address.city} - {order.address.pincode}
              </p>
            </div>
          </div>
        )}

        {!isDelivered && (
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Phone size={18} /> Call Support
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

export default TrackOrder