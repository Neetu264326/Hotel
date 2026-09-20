import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ShieldCheck, ArrowLeft, Banknote, CheckCircle2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useOrder } from '../context/OrderContext'
import { useAuth } from '../context/AuthContext'
import PaymentMethod from '../components/PaymentMethod'
import OrderSummary from '../components/OrderSummary'
import { validateUPI, validateCardNumber, validateCardExpiry, validateCVV } from '../utils/validation'

const UPIPayment = ({ onSubmit }) => {
  const [upiId, setUpiId] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateUPI(upiId)) {
      setError('Enter a valid UPI ID (e.g. name@upi)')
      return
    }
    onSubmit({ method: 'UPI', upiId })
  }

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in" aria-label="UPI payment">
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow-sm)', padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--navy)' }}>Pay via UPI</h3>
        <p style={{ fontSize: 13, color: 'var(--text-gray)', marginBottom: 16 }}>Enter your UPI ID. A payment request will be sent to your app.</p>
        <label htmlFor="upiId" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--navy)' }}>UPI ID</label>
        <input
          id="upiId"
          type="text"
          value={upiId}
          onChange={(e) => { setUpiId(e.target.value); setError('') }}
          placeholder="yourname@upi"
          style={{ width: '100%', padding: '14px', borderRadius: 12, border: error ? '2px solid #EF4444' : '2px solid var(--border)', fontSize: 15, outline: 'none' }}
          aria-invalid={!!error}
        />
        {error && <p role="alert" style={{ color: '#EF4444', fontSize: 12, marginTop: 6 }}>{error}</p>}
        <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 18, borderRadius: 14 }}>
          <ShieldCheck size={18} /> Pay Securely
        </button>
      </div>
    </form>
  )
}

const CardPayment = ({ onSubmit }) => {
  const [form, setForm] = useState({ name: '', number: '', expiry: '', cvv: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    let val = value
    if (name === 'number') {
      val = value.replace(/[^\d]/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
    }
    if (name === 'expiry') {
      val = value.replace(/[^\d]/g, '').slice(0, 4).replace(/(\d{2})(?=\d)/, '$1/')
    }
    if (name === 'cvv') {
      val = value.replace(/[^\d]/g, '').slice(0, 4)
    }
    setForm({ ...form, [name]: val })
    setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    let errs = {}
    if (!form.name.trim()) errs.name = 'Enter cardholder name'
    if (!validateCardNumber(form.number)) errs.number = 'Enter a valid 16-digit card number'
    if (!validateCardExpiry(form.expiry)) errs.expiry = 'Invalid expiry (MM/YY)'
    if (!validateCVV(form.cvv)) errs.cvv = 'Invalid CVV'
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      onSubmit({ method: 'Card', last4: form.number.replace(/\s/g, '').slice(-4) })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in" aria-label="Card payment">
      <div style={{ background: '#fff', borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--navy)' }}>Credit / Debit Card</h3>
        <p style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 16 }}>
          🔒 This is a demo. Card details are never stored.
        </p>
        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <label htmlFor="cname" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--navy)' }}>Cardholder Name</label>
            <input id="cname" name="name" value={form.name} onChange={handleChange} placeholder="Name on card" style={{ width: '100%', padding: '14px', borderRadius: 12, border: errors.name ? '2px solid #EF4444' : '2px solid var(--border)', fontSize: 14, outline: 'none' }} aria-invalid={!!errors.name} />
            {errors.name && <p role="alert" style={{ color: '#EF4444', fontSize: 12, marginTop: 5 }}>{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="cnum" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--navy)' }}>Card Number</label>
            <input id="cnum" name="number" value={form.number} onChange={handleChange} placeholder="1234 5678 9012 3456" inputMode="numeric" style={{ width: '100%', padding: '14px', borderRadius: 12, border: errors.number ? '2px solid #EF4444' : '2px solid var(--border)', fontSize: 15, outline: 'none', letterSpacing: 1 }} aria-invalid={!!errors.number} />
            {errors.number && <p role="alert" style={{ color: '#EF4444', fontSize: 12, marginTop: 5 }}>{errors.number}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
            <div>
              <label htmlFor="cexp" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--navy)' }}>Expiry (MM/YY)</label>
              <input id="cexp" name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" style={{ width: '100%', padding: '14px', borderRadius: 12, border: errors.expiry ? '2px solid #EF4444' : '2px solid var(--border)', fontSize: 14, outline: 'none' }} aria-invalid={!!errors.expiry} />
              {errors.expiry && <p role="alert" style={{ color: '#EF4444', fontSize: 12, marginTop: 5 }}>{errors.expiry}</p>}
            </div>
            <div>
              <label htmlFor="ccvv" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--navy)' }}>CVV</label>
              <input id="ccvv" name="cvv" value={form.cvv} onChange={handleChange} placeholder="123" type="password" inputMode="numeric" style={{ width: '100%', padding: '14px', borderRadius: 12, border: errors.cvv ? '2px solid #EF4444' : '2px solid var(--border)', fontSize: 14, outline: 'none' }} aria-invalid={!!errors.cvv} />
              {errors.cvv && <p role="alert" style={{ color: '#EF4444', fontSize: 12, marginTop: 5 }}>{errors.cvv}</p>}
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 18, borderRadius: 14 }}>
          <ShieldCheck size={18} /> Pay Securely
        </button>
      </div>
    </form>
  )
}

const NetBankingPayment = ({ onSubmit }) => {
  const [bank, setBank] = useState('')
  const banks = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank']
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!bank) return
    onSubmit({ method: 'Net Banking', bank })
  }
  return (
    <form onSubmit={handleSubmit} className="animate-fade-in" aria-label="Net banking payment">
      <div style={{ background: '#fff', borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--navy)' }}>Net Banking</h3>
        <p style={{ fontSize: 13, color: 'var(--text-gray)', marginBottom: 16 }}>Select your bank</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
          {banks.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBank(b)}
              aria-pressed={bank === b}
              style={{
                padding: '14px',
                borderRadius: 12,
                border: bank === b ? '2px solid var(--coral)' : '2px solid var(--border)',
                background: bank === b ? '#FFF8F0' : '#fff',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--navy)',
                transition: 'all 0.2s',
              }}
            >
              {b}
            </button>
          ))}
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 18, borderRadius: 14 }}>
          <ShieldCheck size={18} /> Pay Securely
        </button>
      </div>
    </form>
  )
}

const WalletPayment = ({ onSubmit }) => {
  const win = onSubmit
  const [wallet, setWallet] = useState('')
  const wallets = ['Paytm', 'PhonePe', 'Google Pay', 'Amazon Pay']
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!wallet) return
    win({ method: 'Wallet', wallet })
  }
  return (
    <form onSubmit={handleSubmit} className="animate-fade-in" aria-label="Wallet payment">
      <div style={{ background: '#fff', borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--navy)' }}>Wallet</h3>
        <p style={{ fontSize: 13, color: 'var(--text-gray)', marginBottom: 16 }}>Select a wallet</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
          {wallets.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWallet(w)}
              aria-pressed={wallet === w}
              style={{
                padding: '14px',
                borderRadius: 12,
                border: wallet === w ? '2px solid var(--coral)' : '2px solid var(--border)',
                background: wallet === w ? '#FFF8F0' : '#fff',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--navy)',
                transition: 'all 0.2s',
              }}
            >
              {w}
            </button>
          ))}
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 18, borderRadius: 14 }}>
          <ShieldCheck size={18} /> Pay Securely
        </button>
      </div>
    </form>
  )
}

const CODConfirmation = ({ total, onConfirm }) => {
  const [checked, setChecked] = useState(false)
  return (
    <div className="animate-fade-in" style={{ background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow-sm)', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--gradient-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <Banknote size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>Cash on Delivery</h3>
          <p style={{ fontSize: 13, color: 'var(--text-gray)' }}>Pay when your order arrives</p>
        </div>
      </div>
      <p style={{ fontSize: 14, color: 'var(--text-gray)', marginBottom: 8 }}>COD is available for this order</p>
      <div style={{ background: '#F9FAFB', borderRadius: 12, padding: 14, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14 }}>Total payable on delivery</span>
        <strong style={{ fontSize: 18, color: 'var(--coral)' }}>₹{total}</strong>
      </div>
      <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'var(--text-gray)', cursor: 'pointer', marginBottom: 16 }}>
        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} style={{ marginTop: 3, width: 16, height: 16 }} />
        <span>I confirm I will pay ₹{total} in cash when my order arrives.</span>
      </label>
      <button className="btn btn-primary btn-block btn-lg" disabled={!checked} onClick={onConfirm} style={{ borderRadius: 14, opacity: checked ? 1 : 0.5, cursor: checked ? 'pointer' : 'not-allowed' }}>
        Place Order — ₹{total}
      </button>
    </div>
  )
}

const Payment = () => {
  const location = useLocation()
  const navigate = useNavigate()
const { items, deliveryFee, total, clearCart } = useCart()
  const { placeOrder } = useOrder()
  const { user } = useAuth()
  const [method, setMethod] = useState('cod')
  const [processing, setProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState('')
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [error, setError] = useState('')
  const timeoutRef = useRef(null)

const checkoutData = location.state || {}
const deliveryCharge = checkoutData.deliveryCharge !== undefined ? checkoutData.deliveryCharge : deliveryFee
const address = checkoutData.address
const deliveryOption = checkoutData.deliveryOption || 'standard'

useEffect(() => {
  return () => timeoutRef.current && clearTimeout(timeoutRef.current)
}, [])

useEffect(() => {
  if (!success) return
  const t = setTimeout(() => navigate('/order-success', { replace: true }), 2200)
  return () => clearTimeout(t)
}, [success, navigate])

if (!address && items.length > 0 && !success && !processing) {
  return (
    <main className="page-enter" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="container">
        <div style={{ textAlign: 'center', background: '#fff', borderRadius: 32, boxShadow: 'var(--shadow-lg)', padding: 48, maxWidth: 460, margin: '0 auto' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📍</div>
          <h1 style={{ fontSize: 24, color: 'var(--navy)', marginBottom: 8 }}>Address required</h1>
          <p style={{ color: 'var(--text-gray)', marginBottom: 24 }}>Add a delivery address before choosing a payment method.</p>
          <button className="btn btn-primary" onClick={() => navigate('/checkout')}>Go to Checkout</button>
        </div>
      </div>
    </main>
  )
}

  if (!user) {
    return (
      <main className="page-enter" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div style={{ textAlign: 'center', background: '#fff', borderRadius: 32, boxShadow: 'var(--shadow-lg)', padding: 48, maxWidth: 460, margin: '0 auto' }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🔒</div>
            <h1 style={{ fontSize: 24, color: 'var(--navy)', marginBottom: 8 }}>Login required</h1>
            <p style={{ color: 'var(--text-gray)', marginBottom: 24 }}>Please login to your account to confirm and place your order.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => navigate('/login', { state: { from: { pathname: '/checkout' } } })}>Login to confirm order</button>
              <button className="btn btn-outline" style={{ borderColor: 'var(--border)', color: 'var(--navy)' }} onClick={() => navigate('/cart')}>Back to Cart</button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (items.length === 0 && !success) {
    return <div style={{ textAlign: 'center', padding: 80, minHeight: '60vh' }}>
      <div style={{ fontSize: 56 }}>💳</div>
      <h2 style={{ marginBottom: 12 }}>No items to pay for</h2>
      <button className="btn btn-primary" onClick={() => navigate('/restaurants')}>Browse Restaurants</button>
    </div>
  }

  const completeOrder = async (paymentMethod) => {
    try {
      const order = await placeOrder({ address, paymentMethod, deliveryOption })
      setOrderId(order.orderId)
      setProcessing(false)
      setSuccess(true)
      clearCart()
    } catch (err) {
      setProcessing(false)
      setError(err.message || 'Something went wrong placing your order')
    }
  }

  const processOnlinePayment = (paymentData) => {
    setProcessing(true)
    setError('')
    setProcessingStep('Securing your payment...')
    timeoutRef.current = setTimeout(() => {
      setProcessingStep('Contacting bank...')
      timeoutRef.current = setTimeout(() => {
        setProcessingStep('Verifying transaction...')
        timeoutRef.current = setTimeout(() => {
          completeOrder(paymentData.method)
        }, 800)
      }, 800)
    }, 1000)
  }

  const handleOnlinePay = (paymentData) => {
    processOnlinePayment(paymentData)
  }

  const handleCOD = () => {
    setProcessing(true)
    setError('')
    setProcessingStep('Confirming order...')
    timeoutRef.current = setTimeout(() => {
      completeOrder('Cash on Delivery')
    }, 1500)
  }

  if (success) {
    return (
      <main className="page-enter" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div style={{ textAlign: 'center', background: '#fff', borderRadius: 32, boxShadow: 'var(--shadow-lg)', padding: 60, maxWidth: 520, margin: '0 auto' }}>
            <div className="success-check" style={{ width: 90, height: 90, borderRadius: '50%', background: 'var(--gradient-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 10px 30px rgba(34,197,94,0.3)', animation: 'bounceIn 0.6s ease' }}>
              <CheckCircle2 size={48} color="#fff" />
            </div>
            <h1 style={{ fontSize: 26, color: 'var(--navy)', marginBottom: 8 }}>Payment Successful!</h1>
            <p style={{ color: 'var(--text-gray)', marginBottom: 20 }}>Your order has been placed successfully</p>
            <div style={{ background: '#F9FAFB', borderRadius: 14, padding: 16, marginBottom: 20 }}>
              <p style={{ fontSize: 14 }}>Order ID: <strong>{orderId}</strong></p>
            </div>
            <button className="btn btn-primary btn-lg btn-block" style={{ borderRadius: 14 }} onClick={() => navigate('/order-success')}>
              View Order Confirmation
            </button>
            <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 14 }}>Redirecting to your confirmation in a moment…</p>
          </div>
        </div>
      </main>
    )
  }

  if (processing) {
    return (
      <main className="page-enter" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 420, margin: '0 auto' }}>
            <div className="spinner" style={{ width: 64, height: 64, borderWidth: 5, margin: '0 auto 28px' }} />
            <h2 style={{ fontSize: 24, color: 'var(--navy)', marginBottom: 8 }}>Processing Payment</h2>
            <p style={{ color: 'var(--text-gray)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span className="typing" style={{ display: 'inline-flex', gap: 4 }}>
                <span style={{ animation: 'typingDot 1s infinite', animationDelay: '0s' }}>●</span>
                <span style={{ animation: 'typingDot 1s infinite', animationDelay: '0.2s' }}>●</span>
                <span style={{ animation: 'typingDot 1s infinite', animationDelay: '0.4s' }}>●</span>
              </span>
              {processingStep}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 20 }}>
              <ShieldCheck size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Secured with 256-bit encryption (demo)
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="page-enter" style={{ padding: '40px 0 80px', minHeight: '70vh' }}>
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-gray)', marginBottom: 20, fontWeight: 500 }}>
          <ArrowLeft size={18} /> Back to Review
        </button>
        <h1 className="mb-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--navy)' }}>Payment</h1>

        <div className="checkout-grid">
          <div>
            <PaymentMethod selected={method} onSelect={setMethod} />

            <div style={{ marginTop: 20 }}>
              {error && (
                <p role="alert" style={{ background: '#FEF2F2', color: '#EF4444', borderRadius: 12, padding: '12px 16px', fontSize: 14, fontWeight: 500, marginBottom: 16 }}>
                  {error}
                </p>
              )}
              {method === 'cod' && <CODConfirmation total={total} onConfirm={handleCOD} />}
              {method === 'upi' && <UPIPayment onSubmit={handleOnlinePay} />}
              {method === 'card' && <CardPayment onSubmit={handleOnlinePay} />}
              {method === 'netbanking' && <NetBankingPayment onSubmit={handleOnlinePay} />}
              {method === 'wallet' && <WalletPayment onSubmit={handleOnlinePay} />}
            </div>
          </div>

          <aside style={{ position: 'sticky', top: 'calc(var(--header-height) + 20px)' }}>
            <OrderSummary deliveryCharge={deliveryCharge} />
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Payment
