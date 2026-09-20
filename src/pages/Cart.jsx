import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useData } from '../context/DataContext'
import CartItem from '../components/CartItem'
import CouponBox from '../components/CouponBox'
import Toast from '../components/Toast'

const Cart = () => {
  const { items, subtotal, deliveryFee, tax, discount, total, clearCart, coupon } = useCart()
  const { restaurants } = useData()
  const [toasts, setToasts] = useState([])
  const navigate = useNavigate()

  const restName = (id) => restaurants.find((r) => String(r.id) === String(id))?.name || 'Restaurant'

  const grouped = items.reduce((groups, item) => {
    const key = String(item.restaurantId)
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
    return groups
  }, {})

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((t) => t.id !== id)), 3000)
  }

  const removeToast = (id) => setToasts((t) => t.filter((t) => t.id !== id))

  if (items.length === 0) {
    return (
      <main className="page-enter" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div className="empty-state" style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 24, boxShadow: 'var(--shadow-md)' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }} className="float-animation">🍔</div>
            <h1 style={{ fontSize: 26, color: 'var(--navy)', marginBottom: 8 }}>Your cart is feeling a little empty</h1>
            <p style={{ color: 'var(--text-gray)', marginBottom: 28 }}>Looks like you haven't added anything yet.</p>
            <Link to="/restaurants" className="btn btn-primary btn-lg">
              Explore Restaurants <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page-enter" style={{ padding: '40px 0 120px' }}>
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-gray)', marginBottom: 20, fontWeight: 500 }}>
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--navy)' }}>Your Cart</h1>

        <div className="cart-layout">
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderRadius: 16, padding: '16px 20px', boxShadow: 'var(--shadow-sm)' }}>
              <span style={{ fontWeight: 600, color: 'var(--navy)' }}>
                {items.length} item{items.length > 1 ? 's' : ''}
              </span>
              <button onClick={() => { clearCart(); addToast('Cart cleared', 'info') }} style={{ color: '#EF4444', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                <Trash2 size={16} /> Clear cart
              </button>
            </div>
            {Object.keys(grouped).map((restId) => (
              <div key={restId}>
                <Link
                  to={`/restaurant/${restId}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '6px 0 10px', fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}
                >
                  🏪 {restName(restId)}
                </Link>
                <div style={{ display: 'grid', gap: 14 }}>
                  {grouped[restId].map((item) => <CartItem key={item.key} item={item} />)}
                </div>
              </div>
            ))}
          </div>

          <aside style={{ position: 'sticky', top: 'calc(var(--header-height) + 20px)', display: 'grid', gap: 20 }}>
            <CouponBox onToast={(m) => addToast(m)} />
            <div className="price-breakdown" style={{ background: '#fff', borderRadius: 20, boxShadow: 'var(--shadow-md)', padding: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: 'var(--navy)' }}>Bill Details</h3>
              <div style={{ display: 'grid', gap: 10, fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-gray)' }}>Item Total</span>
                  <span style={{ fontWeight: 600 }}>₹{subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-gray)' }}>Delivery Fee</span>
                  <span style={{ fontWeight: 600 }}>{deliveryFee === 0 ? <span style={{ color: 'var(--green)' }}>FREE</span> : `₹${deliveryFee}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-gray)' }}>Taxes</span>
                  <span style={{ fontWeight: 600 }}>₹{tax}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--green)' }}>
                    <span>Discount {coupon ? `(${coupon})` : ''}</span>
                    <span style={{ fontWeight: 600 }}>-₹{discount}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px dashed var(--border)', marginTop: 8, paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>Total</span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--coral)' }}>₹{total}</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="btn btn-primary btn-block btn-lg"
                style={{ marginTop: 20, borderRadius: 14 }}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>
            </div>
          </aside>
        </div>
      </div>

      <div className="sticky-checkout" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', boxShadow: '0 -4px 20px rgba(16,24,40,0.1)', padding: '14px 16px', zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-gray)' }}>Total</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--coral)' }}>₹{total}</div>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn btn-primary">
            Checkout <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />
    </main>
  )
}

export default Cart
