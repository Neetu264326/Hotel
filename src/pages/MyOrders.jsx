import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronRight } from 'lucide-react'
import { orderAPI } from '../api'
import { useAuth } from '../context/AuthContext'

const MyOrders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.isDemo) return
    orderAPI.getMyOrders().then(setOrders).catch((err) => setError(err.message))
  }, [user])

  return (
    <main className="container page-enter" style={{ minHeight: '70vh', padding: '48px 0 80px', maxWidth: 900 }}>
      <h1 style={{ color: 'var(--navy)', marginBottom: 8 }}>My Orders</h1>
      <p style={{ color: 'var(--text-gray)', marginBottom: 28 }}>Review orders and follow their live delivery status.</p>
      {error && <p role="alert" style={{ color: '#B91C1C', marginBottom: 16 }}>{error}</p>}
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 54, background: '#fff', borderRadius: 20, boxShadow: 'var(--shadow-sm)' }}>
          <Package size={42} color="var(--coral)" />
          <h2 style={{ margin: '14px 0 8px', fontSize: 21 }}>No orders yet</h2>
          <Link className="btn btn-primary" to="/restaurants">Browse restaurants</Link>
        </div>
      ) : orders.map((order) => (
        <Link key={order.id} to={`/track-order?orderId=${order.orderId}`} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 20, background: '#fff', borderRadius: 18, boxShadow: 'var(--shadow-sm)', marginBottom: 14, color: 'inherit' }}>
          <Package color="var(--coral)" />
          <div style={{ flex: 1 }}><strong>{order.restaurant?.name || 'Delishful order'}</strong><p style={{ fontSize: 13, color: 'var(--text-gray)' }}>#{order.orderId} · {order.status.replaceAll('-', ' ')}</p></div>
          <strong>₹{order.total}</strong><ChevronRight size={18} />
        </Link>
      ))}
    </main>
  )
}
export default MyOrders
