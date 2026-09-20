import { useState, useEffect, useRef } from 'react'
import { X, Minus, Plus, Star, Flame, ShoppingBag, AlertTriangle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { addOns } from '../data/coupons'
import { calculateItemPrice } from '../utils/priceCalculator'

const sizes = ['Regular', 'Large', 'Extra Large']

const FoodModal = ({ food, restaurantName, onClose }) => {
  const { addItem, clearCart } = useCart()
  const [size, setSize] = useState(0)
  const [selectedAddOns, setSelectedAddOns] = useState([])
  const [instructions, setInstructions] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const modalRef = useRef(null)

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const toggleAddOn = (addOn) => {
    setSelectedAddOns((prev) =>
      prev.some((a) => a.name === addOn.name)
        ? prev.filter((a) => a.name !== addOn.name)
        : [...prev, addOn]
    )
  }

  const unitPrice = calculateItemPrice(food, size, selectedAddOns)
  const totalPrice = unitPrice * quantity

  const doAdd = async (replace = false) => {
    setAdding(true)
    setError('')
    try {
      if (replace) {
        await clearCart()
      }
      const result = await addItem(food, size, sizes[size], selectedAddOns, instructions, quantity, replace)
      if (result && result.success === false) {
        setError(result.message)
        setAdding(false)
        return
      }
      setTimeout(onClose, 500)
    } catch (err) {
      setError(err?.message || 'Could not add item. Please try again.')
      setAdding(false)
    }
  }

  const handleAdd = () => {
    doAdd(false)
  }

  const handleReplaceCart = () => {
    doAdd(true)
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${food.name} customization`}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} ref={modalRef}>
        <div className="food-modal-grid">
          <div className="food-modal-image" style={{ position: 'relative', minHeight: 300 }}>
            <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Close"
              style={{ position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}
            >
              <X size={20} color="var(--navy)" />
            </button>
          </div>

          <div className="food-modal-details" style={{ padding: 28, overflowY: 'auto', maxHeight: '90vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span className="badge rating" style={{ background: 'var(--green)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
                <Star size={13} fill="#fff" /> {food.rating}
              </span>
              {food.bestseller && <span className="badge badge-bestseller"><Flame size={12} /> Bestseller</span>}
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--navy)', marginBottom: 6 }}>{food.name}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-gray)', marginBottom: 4 }}>
              {restaurantName} • {food.calories} kcal
            </p>
            <p style={{ fontSize: 14, color: 'var(--text-gray)', marginBottom: 16 }}>{food.description}</p>

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: 'var(--navy)' }}>Ingredients</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(food.ingredients || []).map((ing, i) => (
                  <span key={i} style={{ background: '#FFF8F0', color: 'var(--coral)', padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>{ing}</span>
                ))}
              </div>
            </div>

            {food.sizes && food.sizes.length > 0 ? (
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: 'var(--navy)' }}>Choose Size</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {food.sizes.map((price, i) => (
                    <button
                      key={i}
                      onClick={() => setSize(i)}
                      aria-pressed={size === i}
                      style={{
                        padding: '12px 8px',
                        borderRadius: 12,
                        border: size === i ? '2px solid var(--coral)' : '2px solid var(--border)',
                        background: size === i ? '#FFF8F0' : '#fff',
                        color: size === i ? 'var(--coral)' : 'var(--text-gray)',
                        fontSize: 13,
                        fontWeight: 600,
                        transition: 'all 0.2s',
                      }}
                    >
                      {sizes[i]}
                      <br />
                      <span style={{ fontSize: 12, fontWeight: 700 }}>₹{price}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: 'var(--navy)' }}>Add-ons (Optional)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {addOns.map((addon) => {
                  const isSelected = selectedAddOns.some((a) => a.name === addon.name)
                  return (
                    <button
                      key={addon.name}
                      onClick={() => toggleAddOn(addon)}
                      aria-pressed={isSelected}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px',
                        borderRadius: 12,
                        border: isSelected ? '2px solid var(--coral)' : '2px solid var(--border)',
                        background: isSelected ? '#FFF8F0' : '#fff',
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'var(--text-dark)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span>{addon.name}</span>
                      <span style={{ fontWeight: 700, color: 'var(--coral)' }}>+₹{addon.price}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label htmlFor="instructions" style={{ fontSize: 15, fontWeight: 700, display: 'block', marginBottom: 8, color: 'var(--navy)' }}>
                Special Instructions
              </label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder='e.g. "Less spicy", "No onions"'
                style={{ width: '100%', padding: '12px', borderRadius: 12, border: '2px solid var(--border)', fontSize: 14, resize: 'vertical', minHeight: 70, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '2px solid var(--border)', borderRadius: 999, padding: '6px 12px' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity" style={{ color: 'var(--coral)' }}><Minus size={18} /></button>
                <span style={{ fontSize: 16, fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity" style={{ color: 'var(--coral)' }}><Plus size={18} /></button>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy)', marginLeft: 'auto' }}>₹{totalPrice}</div>
            </div>

            {error && (
              <div role="alert" className="animate-fade-in" style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 14, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <AlertTriangle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: '#B91C1C', fontWeight: 500, marginBottom: 10 }}>{error}</p>
                  <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13, borderRadius: 10 }} onClick={handleReplaceCart} disabled={adding}>
                    {adding ? 'Adding...' : 'Clear cart & add this item'}
                  </button>
                </div>
              </div>
            )}

            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={handleAdd}
              style={{ borderRadius: 14 }}
              disabled={adding}
              aria-label={`Add to cart ₹${totalPrice}`}
            >
              {adding ? 'Adding...' : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><ShoppingBag size={18} /> Add to Cart — ₹{totalPrice}</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FoodModal
