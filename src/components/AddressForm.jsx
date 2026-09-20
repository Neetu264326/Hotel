import { useState, useEffect } from 'react'
import { Home, Briefcase, MapPin, Plus, X } from 'lucide-react'
import { validateAddress, normalizePhone } from '../utils/validation'

const AddressForm = ({ onSave, savedAddresses, initialValues }) => {
  const [addingNew, setAddingNew] = useState(false)
  const [type, setType] = useState('Home')
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    house: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!initialValues) return
    setForm({
      fullName: initialValues.fullName || '',
      phone: initialValues.phone || '',
      house: initialValues.house || '',
      street: initialValues.street || '',
      city: initialValues.city || '',
      state: initialValues.state || '',
      pincode: initialValues.pincode || '',
      landmark: initialValues.landmark || '',
    })
    setType(initialValues.type || 'Home')
    setAddingNew(true)
    setErrors({})
  }, [initialValues])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validateAddress(form)
    setErrors(errs)
    if (Object.keys(errs).length === 0) {
      onSave({ ...form, type, phone: normalizePhone(form.phone) })
      setAddingNew(false)
      setForm({
        fullName: '',
        phone: '',
        house: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
      })
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {savedAddresses && savedAddresses.map((address, i) => (
          <button
            key={i}
            onClick={() => onSave(address)}
            className="saved-address"
            aria-label={`Select ${address.type} address`}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', border: '2px solid var(--border)', borderRadius: 14, background: '#fff', fontSize: 14, fontWeight: 500 }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--coral)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            {address.type === 'Work' ? <Briefcase size={18} color="var(--coral)" /> : address.type === 'Other' ? <MapPin size={18} color="var(--coral)" /> : <Home size={18} color="var(--coral)" />}
            <span>{address.type}</span>
            <span style={{ color: 'var(--text-light)', fontWeight: 400, maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {address.house}, {address.street}, {address.city}
            </span>
          </button>
        ))}
      </div>

      {!addingNew ? (
        <button className="btn btn-outline" onClick={() => setAddingNew(true)} aria-label="Add new address" style={{ width: '100%', padding: '14px' }}>
          <Plus size={18} /> Add New Address
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="address-form" aria-label="Add new address" style={{ background: '#fff', borderRadius: 20, boxShadow: 'var(--shadow-md)', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)' }}>Add New Address</h3>
            <button onClick={() => setAddingNew(false)} aria-label="Cancel" style={{ color: 'var(--text-gray)' }}><X size={20} /></button>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {['Home', 'Work', 'Other'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                aria-pressed={type === t}
                className={`type-tab ${type === t ? 'active' : ''}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: 999,
                  border: type === t ? '2px solid var(--coral)' : '2px solid var(--border)',
                  background: type === t ? '#FFF8F0' : '#fff',
                  color: type === t ? 'var(--coral)' : 'var(--text-gray)',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="address-grid">
            <div>
              <label htmlFor="fullName">Full Name</label>
              <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter your name" />
              {errors.fullName && <p className="field-error" role="alert">{errors.fullName}</p>}
            </div>
            <div>
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile" type="tel" />
              {errors.phone && <p className="field-error" role="alert">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="house">House / Flat / Building</label>
              <input id="house" name="house" value={form.house} onChange={handleChange} placeholder="e.g. 42, Sunrise Apartments" />
              {errors.house && <p className="field-error" role="alert">{errors.house}</p>}
            </div>
            <div>
              <label htmlFor="street">Street / Area / Locality</label>
              <input id="street" name="street" value={form.street} onChange={handleChange} placeholder="e.g. MG Road" />
              {errors.street && <p className="field-error" role="alert">{errors.street}</p>}
            </div>
            <div>
              <label htmlFor="city">City</label>
              <input id="city" name="city" value={form.city} onChange={handleChange} placeholder="e.g. Bengaluru" />
              {errors.city && <p className="field-error" role="alert">{errors.city}</p>}
            </div>
            <div>
              <label htmlFor="state">State</label>
              <input id="state" name="state" value={form.state} onChange={handleChange} placeholder="e.g. Karnataka" />
              {errors.state && <p className="field-error" role="alert">{errors.state}</p>}
            </div>
            <div>
              <label htmlFor="pincode">Pincode</label>
              <input id="pincode" name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" type="tel" />
              {errors.pincode && <p className="field-error" role="alert">{errors.pincode}</p>}
            </div>
            <div>
              <label htmlFor="landmark">Landmark (optional)</label>
              <input id="landmark" name="landmark" value={form.landmark} onChange={handleChange} placeholder="e.g. Near city mall" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: 20, padding: '14px', borderRadius: 14 }}>
            Save Address
          </button>
        </form>
      )}

      <style>{`
        .address-form label { display: block; font-size: 13px; font-weight: 600; color: var(--navy); margin-bottom: 6px; }
        .address-form input { width: 100%; padding: 12px 14px; border: 2px solid var(--border); border-radius: 12px; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .address-form input:focus { border-color: var(--coral); }
        .field-error { color: #EF4444; font-size: 12px; margin-top: 5px; }
      `}</style>
    </div>
  )
}

export default AddressForm
