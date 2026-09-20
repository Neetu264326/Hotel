import { useState, useCallback } from 'react'
import { Plus, Minus, Star, Clock, Flame } from 'lucide-react'
import FoodModal from './FoodModal'
import ModalBoundary from './ModalBoundary'
import { useCart } from '../context/CartContext'

const VegIcon = ({ veg }) => (
  <span
    className={`badge ${veg ? 'badge-veg' : 'badge-nonveg'}`}
    style={{ border: `2px solid ${veg ? '#22C55E' : '#EF4444'}`, background: '#fff', width: 20, height: 20, borderRadius: 4, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
    title={veg ? 'Veg' : 'Non-veg'}
  >
    <span style={{ width: 10, height: 10, borderRadius: '50%', background: veg ? '#22C55E' : '#EF4444' }} />
  </span>
)

const FoodCard = ({ food, restaurantName }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const { addItem, items, removeItem, updateQuantity } = useCart()

  const [addedAnim, setAddedAnim] = useState(false)
  const [addError, setAddError] = useState('')

  const cartItem = items.find((i) => i.foodId === food.id)
  const inCartQty = cartItem ? cartItem.quantity : 0

  const handleDirectAdd = useCallback(
    (e) => {
      e.stopPropagation()
      setAddError('')
      setAddedAnim(true)

      addItem(food, 0, 'Regular', [], '', 1).then((result) => {
        if (result && result.success === false) {
          setAddError(result.message)
          setAddedAnim(false)
          setTimeout(() => setAddError(''), 3000)
          return
        }
        setTimeout(() => setAddedAnim(false), 500)
      })
    },
    [food, addItem],
  )

  const handleDirectIncrement = useCallback(
    (e) => {
      e.stopPropagation()
      addItem(food, 0, 'Regular', [], '', 1).then(() => {
        setAddedAnim(true)
        setTimeout(() => setAddedAnim(false), 400)
      })
    },
    [food, addItem],
  )

  return (
    <>
      <article
        className="food-card card"
        style={{ cursor: 'pointer', padding: 12, position: 'relative', overflow: 'hidden', minWidth: 0 }}
        onClick={() => setModalOpen(true)}
        aria-label={`View ${food.name}`}
      >
        <div className="food-image-wrap" style={{ position: 'relative', overflow: 'hidden', borderRadius: 16 }}>
          <img
            src={food.image}
            alt={food.name}
            loading="lazy"
            className="food-image"
            style={{ width: '100%', height: 170, objectFit: 'cover', transition: 'transform 0.4s ease' }}
          />
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6, alignItems: 'center', zIndex: 2 }}>
            <VegIcon veg={food.veg} />
            {food.bestseller && (
              <span className="badge badge-bestseller"><Flame size={12} /> Bestseller</span>
            )}
          </div>

          {inCartQty === 0 ? (
            <button
              className="add-btn"
              onClick={handleDirectAdd}
              aria-label={`Add ${food.name} to cart`}
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                background: addedAnim ? 'var(--coral)' : '#fff',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
                color: addedAnim ? '#fff' : 'var(--coral)',
                transition: 'all 0.25s ease',
                zIndex: 5,
              }}
            >
              <Plus size={22} />
            </button>
          ) : (
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                background: 'var(--coral)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 0,
                boxShadow: '0 2px 8px rgba(255,107,107,0.35)',
                zIndex: 5,
                overflow: 'hidden',
                transition: 'all 0.25s ease',
              }}
            >
              <button
                onClick={handleDirectIncrement}
                aria-label={`Add another ${food.name}`}
                style={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  background: 'transparent',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <Plus size={18} />
              </button>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, minWidth: 26, textAlign: 'center' }}>{inCartQty}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (!cartItem) return
                  if (inCartQty <= 1) {
                    removeItem(cartItem.key)
                  } else {
                    updateQuantity(cartItem.key, inCartQty - 1)
                  }
                }}
                aria-label="Remove one from cart"
                style={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  background: 'transparent',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <Minus size={18} />
              </button>
            </div>
          )}
        </div>

        {addError && (
          <div
            role="alert"
            className="animate-fade-in"
            style={{
              position: 'absolute',
              bottom: 130,
              left: 12,
              right: 12,
              background: '#FEF2F2',
              border: '1.5px solid #FECACA',
              borderRadius: 10,
              padding: '8px 12px',
              fontSize: 12,
              color: '#B91C1C',
              fontWeight: 600,
              zIndex: 10,
              textAlign: 'center',
            }}
          >
            {addError}
          </div>
        )}

        <div className="food-info" style={{ padding: '12px 10px', overflow: 'hidden', minWidth: 0 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: 'var(--navy)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{food.name}</h3>
          <p style={{ fontSize: 13, color: 'var(--text-gray)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.4 }}>
            {food.description}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)' }}>₹{food.sizes ? food.sizes[0] : food.price}</span>
            <span className="badge badge-rating" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
              <Star size={12} fill="#fff" /> {food.rating}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 12, color: 'var(--text-light)' }}>
            <Clock size={13} /> {food.calories} kcal
          </div>
        </div>
      </article>

      {modalOpen && (
        <ModalBoundary>
          <FoodModal food={food} restaurantName={restaurantName} onClose={() => setModalOpen(false)} />
        </ModalBoundary>
      )}
    </>
  )
}

export default FoodCard