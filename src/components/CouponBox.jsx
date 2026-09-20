import { useState } from 'react'
import { Ticket, X, Check, Sparkles } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useData } from '../context/DataContext'

const CouponBox = ({ onToast }) => {
  const { applyCoupon, coupon, clearCoupon } = useCart()
  const { coupons } = useData()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const handleApply = async (e) => {
    e.preventDefault()
    if (!code.trim()) {
      setError('Please enter a coupon code')
      return
    }
    const result = await applyCoupon(code.trim().toUpperCase())
    if (result.success) {
      setError('')
      setCode('')
      if (onToast) onToast(result.message)
    } else {
      setError(result.message)
    }
  }

  const handleSelect = async (c) => {
    const result = await applyCoupon(c.code)
    if (result.success) {
      setError('')
      if (onToast) onToast('Coupon applied: ' + c.code)
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="coupon-box" style={{ background: '#fff', borderRadius: 20, boxShadow: 'var(--shadow-md)', padding: 24 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Ticket size={20} color="var(--coral)" /> Apply Coupon
      </h3>

      {coupon ? (
        <div className="applied-coupon" style={{ background: '#DCFCE7', border: '1.5px solid #22C55E', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Check size={18} color="#22C55E" />
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: 14, color: '#15803D' }}>{coupon}</strong>
            <p style={{ fontSize: 12, color: '#15803D' }}>Coupon applied <Sparkles size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /></p>
          </div>
          <button onClick={clearCoupon} aria-label="Remove coupon" style={{ color: '#15803D', fontSize: 12, fontWeight: 600 }}><X size={16} /></button>
        </div>
      ) : (
        <>
          <form onSubmit={handleApply} style={{ display: 'flex', gap: 8, marginBottom: 8 }} aria-label="Apply coupon">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              aria-label="Coupon code"
              style={{ flex: 1, padding: '12px 14px', borderRadius: 12, border: '2px solid var(--border)', fontSize: 14, outline: 'none', fontWeight: 600, letterSpacing: 1 }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '12px 20px', fontSize: 14 }}>Apply</button>
          </form>
          {error && <p role="alert" style={{ color: '#EF4444', fontSize: 13, marginBottom: 12 }}>{error}</p>}
        </>
      )}

      <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 10, color: 'var(--navy)' }}>Available coupons</p>
      <div style={{ display: 'grid', gap: 8 }}>
        {coupons.map((c) => {
          const isActive = coupon === c.code
          return (
            <button
              key={c.code}
              onClick={() => handleSelect(c)}
              disabled={!!coupon}
              aria-label={`Apply coupon ${c.code}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 12,
                border: isActive ? '2px solid var(--coral)' : '1.5px dashed var(--border)',
                background: isActive ? '#FFF8F0' : '#fff',
                textAlign: 'left',
                transition: 'all 0.2s',
                cursor: coupon ? 'default' : 'pointer',
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--gradient-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Ticket size={18} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 13, color: 'var(--navy)' }}>{c.code}</strong>
                <p style={{ fontSize: 12, color: 'var(--text-gray)' }}>{c.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CouponBox
