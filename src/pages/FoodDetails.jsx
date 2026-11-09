import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Flame, Clock, ShoppingBag, Minus, Plus, AlertTriangle, ChevronRight, Info } from 'lucide-react'
import FoodCard from '../components/FoodCard'
import { useData } from '../context/DataContext'
import { useCart } from '../context/CartContext'
import { addOns } from '../data/coupons'
import { calculateItemPrice } from '../utils/priceCalculator'
import { deriveAllergens, ratingBreakdown } from '../utils/foodInfo'

const sizeLabels = ['Regular', 'Large', 'Extra Large']

const Section = ({ title, children, note }) => (
  <div style={{ marginBottom: 24 }}>
    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', marginBottom: 10 }}>{title}</h3>
    {children}
    {note && (
      <p style={{ display: 'flex', gap: 6, alignItems: 'flex-start', fontSize: 12, color: 'var(--text-light)', marginTop: 8, lineHeight: 1.5 }}>
        <Info size={13} style={{ flexShrink: 0, marginTop: 2 }} /> {note}
      </p>
    )}
  </div>
)

const FoodDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { restaurants, foods, loading: dataLoading } = useData()
  const { addItem, clearCart } = useCart()

  const [loading, setLoading] = useState(true)
  const [size, setSize] = useState(0)
  const [selectedAddOns, setSelectedAddOns] = useState([])
  const [instructions, setInstructions] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setSize(0)
    setSelectedAddOns([])
    setInstructions('')
    setQuantity(1)
    setError('')
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [id])

  const food = foods.find((f) => String(f.id) === String(id))

  if (loading || dataLoading) {
    return (
      <main className="page-enter">
        <div className="container" style={{ padding: '32px 0 60px' }}>
          <div className="skeleton" style={{ height: 360, borderRadius: 24, marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 24, width: '40%', marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 16, width: '70%', marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 16, width: '55%' }} />
        </div>
      </main>
    )
  }

  if (!food) {
    return (
      <main className="page-enter">
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: 48 }}>😕</div>
          <h2 style={{ marginBottom: 12 }}>Food not found</h2>
          <p style={{ color: 'var(--text-gray)', marginBottom: 20 }}>This item may have been removed or the link is invalid.</p>
          <Link to="/restaurants" className="btn btn-primary">Browse Restaurants</Link>
        </div>
      </main>
    )
  }

  const restaurant = restaurants.find((r) => String(r.id) === String(food.restaurantId))
  const allergens = deriveAllergens(food.ingredients)
  const breakdown = ratingBreakdown(food.rating)
  const unitPrice = calculateItemPrice(food, size, selectedAddOns)
  const totalPrice = unitPrice * quantity
  const related = foods
    .filter((f) => String(f.id) !== String(food.id) && String(f.restaurantId) === String(food.restaurantId))
    .slice(0, 4)

  const toggleAddOn = (addOn) => {
    setSelectedAddOns((prev) =>
      prev.some((a) => a.name === addOn.name)
        ? prev.filter((a) => a.name !== addOn.name)
        : [...prev, addOn]
    )
  }

  const doAdd = async (replace = false) => {
    setAdding(true)
    setError('')
    try {
      if (replace) await clearCart()
      const result = await addItem(food, size, sizeLabels[size] || 'Regular', selectedAddOns, instructions, quantity, replace)
      if (result && result.success === false) {
        setError(
          result.status === 404
            ? 'This item is out of date — please refresh the page and try again.'
            : result.message
        )
        setAdding(false)
        return
      }
      setAdding(false)
      navigate('/cart')
    } catch (err) {
      setError(err?.message || 'Could not add item. Please try again.')
      setAdding(false)
    }
  }

  const ratingColor = food.rating >= 4.5 ? '#22C55E' : '#FFC857'

  return (
    <main className="page-enter">
      <div className="container" style={{ padding: '24px 0 60px' }}>
        <button
          onClick={() => window.history.back()}
          aria-label="Go back"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-gray)', fontSize: 14, fontWeight: 600, marginBottom: 16, cursor: 'pointer', padding: 0 }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div
          className="food-modal-grid"
          style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}
        >
          <div className="food-modal-image" style={{ minHeight: 360 }}>
            <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span
                className="badge"
                style={{ border: `2px solid ${food.veg ? '#22C55E' : '#EF4444'}`, background: '#fff', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: food.veg ? '#22C55E' : '#EF4444' }} />
                {food.veg ? 'Veg' : 'Non-veg'}
              </span>
              {food.bestseller && <span className="badge badge-bestseller"><Flame size={12} /> Bestseller</span>}
              {food.category && <span className="badge badge-offer">{food.category}</span>}
            </div>
          </div>

          <div style={{ padding: '28px 28px 24px', overflowY: 'auto', maxHeight: '85vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              <span style={{ background: ratingColor, color: '#fff', borderRadius: 8, padding: '4px 10px', fontWeight: 700, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Star size={14} fill="#fff" /> {Number(food.rating).toFixed(1)}
              </span>
              {food.calories > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--text-gray)', fontWeight: 600 }}>
                  <Clock size={14} /> {food.calories} kcal per serving
                </span>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--navy)', marginBottom: 6 }}>{food.name}</h1>
            <p style={{ fontSize: 14, color: 'var(--text-gray)', lineHeight: 1.6, marginBottom: 16 }}>{food.description}</p>

            {restaurant && (
              <Link
                to={`/restaurant/${restaurant.id}`}
                className="card"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, marginBottom: 20, textDecoration: 'none', cursor: 'pointer' }}
              >
                <img src={restaurant.logo || restaurant.image} alt={restaurant.name} style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{restaurant.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-gray)' }}>
                    {restaurant.cuisine} • {restaurant.priceRange} • {restaurant.deliveryTime}-{restaurant.deliveryTime + 10} min
                  </p>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: 'var(--coral)', whiteSpace: 'nowrap' }}>
                  <Star size={13} fill="var(--coral)" /> {restaurant.rating}
                  <ChevronRight size={16} />
                </span>
              </Link>
            )}

            <Section title="Ingredients">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(food.ingredients || []).length > 0 ? (
                  food.ingredients.map((ing, i) => (
                    <span key={i} style={{ background: '#FFF8F0', color: 'var(--coral)', padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
                      {ing}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: 13, color: 'var(--text-light)' }}>Not listed</span>
                )}
              </div>
            </Section>

            <Section
              title="Allergens"
              note="Allergen info is derived from the ingredient list. Please confirm with the restaurant if you have a severe allergy."
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {allergens.length > 0 ? (
                  allergens.map((a) => (
                    <span key={a} style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA', padding: '6px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
                      {a}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: 13, color: 'var(--text-light)' }}>No common allergens identified from ingredients</span>
                )}
              </div>
            </Section>

            {food.calories > 0 && (
              <Section title="Nutrition" note="Calorie values are per serving and may vary with size and add-ons.">
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                      <span style={{ color: 'var(--text-gray)' }}>Calories</span>
                      <span style={{ color: 'var(--navy)' }}>{food.calories} kcal</span>
                    </div>
                    <div style={{ height: 8, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.min(100, Math.round((food.calories / 2000) * 100))}%`,
                          background: 'linear-gradient(90deg, var(--coral), var(--gold))',
                          borderRadius: 999,
                        }}
                      />
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 4 }}>
                      {Math.round((food.calories / 2000) * 100)}% of a 2,000 kcal daily diet
                    </p>
                  </div>
                </div>
              </Section>
            )}

            <Section title="Ratings" note="Breakdown is estimated from the average rating. Written reviews are not available yet.">
              <div style={{ display: 'grid', gap: 6 }}>
                {breakdown.map(({ star, percent }) => (
                  <div key={star} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 40px', alignItems: 'center', gap: 10, fontSize: 13 }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-gray)' }}>{star} ★</span>
                    <div style={{ height: 8, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percent}%`, background: ratingColor, borderRadius: 999, transition: 'width 0.6s ease' }} />
                    </div>
                    <span style={{ color: 'var(--text-light)', textAlign: 'right' }}>{percent}%</span>
                  </div>
                ))}
              </div>
            </Section>

            {food.sizes && food.sizes.length > 0 && (
              <Section title="Choose Size">
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
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {sizeLabels[i] || `Size ${i + 1}`}
                      <br />
                      <span style={{ fontSize: 12, fontWeight: 700 }}>₹{price}</span>
                    </button>
                  ))}
                </div>
              </Section>
            )}

            <Section title="Add-ons (Optional)">
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
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span>{addon.name}</span>
                      <span style={{ fontWeight: 700, color: 'var(--coral)' }}>+₹{addon.price}</span>
                    </button>
                  )
                })}
              </div>
            </Section>

            <Section title="Special Instructions">
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder='e.g. "Less spicy", "No onions"'
                style={{ width: '100%', padding: '12px', borderRadius: 12, border: '2px solid var(--border)', fontSize: 14, resize: 'vertical', minHeight: 70, outline: 'none', fontFamily: 'inherit' }}
              />
            </Section>

            {error && (
              <div role="alert" className="animate-fade-in" style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 14, padding: '14px 16px', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <AlertTriangle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 13, color: '#B91C1C', fontWeight: 500 }}>{error}</p>
                </div>
                <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13, borderRadius: 10, alignSelf: 'flex-start' }} onClick={() => doAdd(true)} disabled={adding}>
                  {adding ? 'Adding...' : 'Clear cart & add this item'}
                </button>
              </div>
            )}

            <div
              style={{
                position: 'sticky',
                bottom: 0,
                background: '#fff',
                borderTop: '1px solid var(--border)',
                margin: '0 -28px -24px',
                padding: '16px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
                zIndex: 5,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '2px solid var(--border)', borderRadius: 999, padding: '6px 12px' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity" style={{ color: 'var(--coral)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  <Minus size={18} />
                </button>
                <span style={{ fontSize: 16, fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity" style={{ color: 'var(--coral)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  <Plus size={18} />
                </button>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <p style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 600 }}>{sizeLabels[size] || 'Regular'} • {food.name}</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--navy)' }}>₹{totalPrice}</p>
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => doAdd(false)} disabled={adding} style={{ borderRadius: 14, flexShrink: 0 }}>
                {adding ? 'Adding...' : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><ShoppingBag size={18} /> Add to Cart</span>}
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && restaurant && (
          <section style={{ marginTop: 48 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--navy)' }}>
                More from {restaurant.name}
              </h2>
              <Link to={`/restaurant/${restaurant.id}`} style={{ fontSize: 14, fontWeight: 700, color: 'var(--coral)' }}>
                View full menu →
              </Link>
            </div>
            <div className="food-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
              {related.map((f) => (
                <FoodCard key={f.id} food={f} restaurantName={restaurant.name} />
              ))}
            </div>
          </section>
        )}

        {related.length === 0 && (
          <section style={{ marginTop: 48, textAlign: 'center' }}>
            <Link to="/restaurants" className="btn btn-outline">Browse other restaurants</Link>
          </section>
        )}
      </div>
    </main>
  )
}

export default FoodDetails
