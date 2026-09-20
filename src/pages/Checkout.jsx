import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Bike, Zap, CalendarClock, Check, ChevronRight, ChevronLeft, ArrowRight, Navigation, Loader2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import AddressForm from '../components/AddressForm'
import OrderSummary from '../components/OrderSummary'
import { isIndianMobile, normalizePhone } from '../utils/validation'

const reverseGeocode = async (lat, lon) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
    { headers: { 'Accept-Language': 'en' } }
  )
  if (!res.ok) throw new Error('Geocoding failed')
  const data = await res.json()
  const a = data.address || {}
  return {
    fullName: '',
    phone: '',
    house: [a.house_number, a.building, a.residential].filter(Boolean).join(' ') || '',
    street: [a.road, a.suburb, a.neighbourhood, a.quarter].filter(Boolean).join(', ') || '',
    city: a.city || a.town || a.village || a.county || '',
    state: a.state || '',
    pincode: a.postcode || '',
    landmark: [a.landmark, a.shop, a.amenity].filter(Boolean).join(', ') || '',
    lat,
    lon,
  }
}

const Checkout = () => {
  const { items, deliveryFee } = useCart()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [address, setAddress] = useState(null)
  const [savedAddresses, setSavedAddresses] = useState([])
  const [deliveryOption, setDeliveryOption] = useState('standard')
  const [scheduleDateTime, setScheduleDateTime] = useState('')
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState('')
  const navigate = useNavigate()

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }
    setLocating(true)
    setLocationError('')
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const addr = await reverseGeocode(position.coords.latitude, position.coords.longitude)
          if (addr.house || addr.street || addr.city) {
            const detected = {
              type: 'Home',
              ...addr,
              fullName: user?.name || addr.fullName || '',
              phone: user?.phone && !isIndianMobile(user.phone) ? normalizePhone(user.phone) : (user?.phone || addr.phone || ''),
            }
            setAddress(detected)
            setSavedAddresses((prev) => {
              const exists = prev.some((s) => s.house === detected.house && s.street === detected.street)
              return exists ? prev : [detected]
            })
          } else {
            setLocationError('Could not determine address from location. Please enter manually.')
          }
        } catch {
          setLocationError('Could not fetch address. Please enter manually.')
        } finally {
          setLocating(false)
        }
      },
      (err) => {
        setLocating(false)
        if (err.code === 1) {
          setLocationError('Location permission denied. Please enter your address manually.')
        } else {
          setLocationError('Unable to get your location. Please enter manually.')
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    )
  }

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 80, minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 56 }}>🛒</div>
        <h2 style={{ marginBottom: 12 }}>Nothing to checkout</h2>
        <Link to="/restaurants" className="btn btn-primary" style={{ alignSelf: 'center' }}>Browse Restaurants</Link>
      </div>
    )
  }

  const deliveryCharges = {
    standard: deliveryFee,
    priority: deliveryFee + 60,
    scheduled: deliveryFee,
  }

  const handleSaveAddress = (addr) => {
    setAddress(addr)
    const exists = savedAddresses.some(
      (s) => s.house === addr.house && s.street === addr.street && s.type === addr.type
    )
    if (!exists) setSavedAddresses((prev) => [...prev, { ...addr }])
  }

  const handleContinueToPayment = () => {
    if (!address || !address.fullName || !address.phone) {
      setStep(1)
      return
    }
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } })
      return
    }
    navigate('/payment', {
      state: {
        address,
        deliveryOption,
        scheduleDateTime,
        deliveryCharge: deliveryCharges[deliveryOption],
      },
    })
  }

  const steps = ['Address', 'Delivery', 'Review']

  return (
    <main className="page-enter" style={{ padding: '40px 0 80px', minHeight: '70vh' }}>
      <div className="container">
        <h1 className="mb-2" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--navy)' }}>Checkout</h1>

        {!user && (
          <div className="guest-banner animate-fade-in" role="status" style={{ background: '#FFF8F0', border: '1px solid #FFD9C4', borderRadius: 14, padding: '12px 18px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 20 }}>🔒</span>
            <p style={{ fontSize: 14, color: 'var(--navy)', flex: 1, minWidth: 200 }}>
              Login is required to place your order. Your cart is saved.
            </p>
            <button
              onClick={() => navigate('/login', { state: { from: { pathname: '/checkout' } } })}
              style={{ color: 'var(--coral)', fontWeight: 700, fontSize: 14 }}
            >
              Login to place order
            </button>
          </div>
        )}

        <div className="checkout-steps" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
          {steps.map((s, i) => {
            const stepNum = i + 1
            const isActive = step === stepNum
            const isDone = step > stepNum
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={() => stepNum < step && setStep(stepNum)}
                  disabled={stepNum >= step}
                  aria-current={isActive ? 'step' : undefined}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, background: isActive ? 'var(--gradient-coral)' : isDone ? 'var(--gradient-green)' : '#F3F4F6', color: isActive || isDone ? '#fff' : '#9CA3AF', padding: '10px 18px', borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: stepNum < step ? 'pointer' : 'default' }}
                >
                  {isDone ? <Check size={16} /> : <span style={{ width: 22, height: 22, borderRadius: '50%', border: isActive ? '2px solid #fff' : '2px solid currentColor', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{stepNum}</span>}
                  {s}
                </button>
                {i < steps.length - 1 && <ChevronRight size={18} color="#D1D5DB" />}
              </div>
            )
          })}
        </div>

        <div className="checkout-grid animate-fade-in" key={step}>
          <div>
            {step === 1 && (
              <div className="checkout-step-content">
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={22} color="var(--coral)" /> Delivery Address
                </h2>

                {!address && (
                  <button
                    onClick={detectLocation}
                    disabled={locating}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: 14,
                      border: '2px dashed var(--coral)',
                      background: '#FFF8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      marginBottom: 16,
                      cursor: locating ? 'wait' : 'pointer',
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--coral)',
                      transition: 'all 0.2s',
                    }}
                  >
                    {locating ? (
                      <><Loader2 size={20} className="spin" /> Detecting your location...</>
                    ) : (
                      <><Navigation size={20} /> Use My Current Location</>
                    )}
                  </button>
                )}

                {locationError && (
                  <p style={{ background: '#FEF2F2', color: '#EF4444', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
                    {locationError}
                  </p>
                )}

                {address && (
                  <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 14, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <MapPin size={18} color="#16A34A" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#16A34A' }}>Location detected</p>
                      <p style={{ fontSize: 13, color: 'var(--text-gray)' }}>
                        {address.house && `${address.house}, `}{address.street}{address.city && `, ${address.city}`}{address.pincode && ` - ${address.pincode}`}
                      </p>
                    </div>
                    <button
                      onClick={() => { setAddress(null); setSavedAddresses([]); setLocationError('') }}
                      style={{ fontSize: 12, color: 'var(--coral)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                    >
                      Change
                    </button>
                  </div>
                )}

                <AddressForm
                  onSave={handleSaveAddress}
                  savedAddresses={savedAddresses}
                  initialValues={address && (!address.fullName || !address.phone) ? address : null}
                />
                {address && address.fullName && address.phone && (
                  <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setStep(2)}>
                    Next: Delivery <ArrowRight size={18} />
                  </button>
                )}
                {address && (!address.fullName || !address.phone) && (
                  <p style={{ marginTop: 16, background: '#FFF8F0', border: '1px solid #FFD9C4', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#92400E' }}>
                    Please fill in your name and phone number above to continue.
                  </p>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="checkout-step-content">
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy)', marginBottom: 20 }}>Select Delivery Option</h2>
                <div style={{ display: 'grid', gap: 14 }}>
                  {[
                    { id: 'standard', icon: Bike, title: 'Standard Delivery', time: '30-40 minutes', charge: deliveryCharges.standard, desc: 'Reliable delivery at your convenience' },
                    { id: 'priority', icon: Zap, title: 'Priority Delivery', time: '20-25 minutes', charge: deliveryCharges.priority, desc: 'Skip ahead with priority dispatch', fast: true },
                    { id: 'scheduled', icon: CalendarClock, title: 'Schedule Delivery', time: 'Choose date & time', charge: deliveryCharges.scheduled, desc: 'Order now, deliver later' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setDeliveryOption(opt.id)}
                      aria-pressed={deliveryOption === opt.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '20px',
                        borderRadius: 18,
                        border: deliveryOption === opt.id ? '2px solid var(--coral)' : '2px solid var(--border)',
                        background: deliveryOption === opt.id ? '#FFF8F0' : '#fff',
                        transition: 'all 0.3s',
                        textAlign: 'left',
                        boxShadow: deliveryOption === opt.id ? 'var(--shadow-coral)' : 'none',
                      }}
                    >
                      <div style={{ width: 52, height: 52, borderRadius: 14, background: deliveryOption === opt.id ? 'var(--gradient-coral)' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: deliveryOption === opt.id ? '#fff' : 'var(--coral)', flexShrink: 0 }}>
                        <opt.icon size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: 16, color: 'var(--navy)' }}>{opt.title} {opt.fast && <span style={{ background: 'var(--green)', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 999, marginLeft: 6 }}>FASTEST</span>}</strong>
                        <p style={{ fontSize: 13, color: 'var(--text-gray)' }}>{opt.time}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-light)' }}>{opt.desc}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {opt.charge === 0 ? <span style={{ color: 'var(--green)', fontWeight: 700 }}>FREE</span> : <span style={{ fontWeight: 700, color: 'var(--navy)' }}>₹{opt.charge}</span>}
                      </div>
                    </button>
                  ))}
                </div>

                {deliveryOption === 'scheduled' && (
                  <div style={{ marginTop: 16, padding: 16, background: '#fff', borderRadius: 14, boxShadow: 'var(--shadow-sm)' }}>
                    <label htmlFor="sched" style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', display: 'block', marginBottom: 8 }}>Choose delivery date & time</label>
                    <input id="sched" type="datetime-local" value={scheduleDateTime} onChange={(e) => setScheduleDateTime(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: 12, border: '2px solid var(--border)', fontSize: 14, outline: 'none' }} />
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)} style={{ borderColor: 'var(--border)', color: 'var(--navy)' }}>
                    <ChevronLeft size={16} /> Back
                  </button>
                  {address && (
                    <button className="btn btn-primary" onClick={() => setStep(3)}>
                      Next: Review <ArrowRight size={18} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="checkout-step-content" style={{ display: 'grid', gap: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy)' }}>Review Your Order</h2>

                <div style={{ background: '#fff', borderRadius: 18, boxShadow: 'var(--shadow-sm)', padding: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={16} color="var(--coral)" /> Delivery Address
                  </h3>
                  <p style={{ fontSize: 14 }}>
                    <strong>{address?.fullName}</strong> • {address?.phone}<br />
                    {address?.house}, {address?.street}<br />
                    {address?.city}, {address?.state} - {address?.pincode}
                    {address?.landmark && <><br />Landmark: {address.landmark}</>}
                  </p>
                </div>

                <div style={{ background: '#fff', borderRadius: 18, boxShadow: 'var(--shadow-sm)', padding: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: 'var(--navy)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Bike size={16} color="var(--coral)" /> Delivery
                  </h3>
                  <p style={{ fontSize: 14 }}>
                    <strong style={{ textTransform: 'capitalize' }}>{deliveryOption} Delivery</strong>
                    {deliveryOption === 'standard' && ' (30-40 min)'}
                    {deliveryOption === 'priority' && ' (20-25 min)'}
                    {deliveryOption === 'scheduled' && scheduleDateTime && ` — ${new Date(scheduleDateTime).toLocaleString()}`}
                  </p>
                </div>

                <div style={{ background: '#fff', borderRadius: 18, boxShadow: 'var(--shadow-sm)', padding: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: 'var(--navy)' }}>Food Items</h3>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {items.map((item) => (
                      <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                        <span>{item.quantity}× {item.name}</span>
                        <span style={{ fontWeight: 600 }}>₹{item.lineTotal}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn btn-outline" onClick={() => setStep(2)} style={{ borderColor: 'var(--border)', color: 'var(--navy)' }}>
                    <ChevronLeft size={16} /> Back
                  </button>
                  <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleContinueToPayment}>
                    Continue to Payment <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside style={{ position: 'sticky', top: 'calc(var(--header-height) + 20px)' }}>
            <OrderSummary deliveryCharge={deliveryCharges[deliveryOption]} />
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Checkout
