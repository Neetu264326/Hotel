import { Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart()

  return (
    <div className="cart-item" style={{ display: 'flex', gap: 14, padding: 16, background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow-sm)', transition: 'transform 0.3s' }}>
      <img src={item.image} alt={item.name} loading="lazy" style={{ width: 84, height: 84, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)' }}>{item.name}</h3>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', whiteSpace: 'nowrap' }}>₹{item.lineTotal}</span>
        </div>
        {item.sizeName && (
          <p style={{ fontSize: 13, color: 'var(--text-gray)' }}>Size: {item.sizeName}</p>
        )}
        {item.addOns && item.addOns.length > 0 && (
          <p style={{ fontSize: 13, color: 'var(--coral)', fontWeight: 500 }}>
            + {item.addOns.map((a) => a.name).join(', ')}
          </p>
        )}
        {item.specialInstructions && (
          <p style={{ fontSize: 12, color: 'var(--text-light)', fontStyle: 'italic' }}>"{item.specialInstructions}"</p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1.5px solid var(--border)', borderRadius: 999, padding: '4px 10px' }}>
            <button onClick={() => updateQuantity(item.key, item.quantity - 1)} aria-label={`Decrease quantity of ${item.name}`} style={{ color: 'var(--coral)' }}>
              <Minus size={16} />
            </button>
            <span style={{ fontSize: 14, fontWeight: 700, minWidth: 18, textAlign: 'center' }}>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.key, item.quantity + 1)} aria-label={`Increase quantity of ${item.name}`} style={{ color: 'var(--coral)' }}>
              <Plus size={16} />
            </button>
          </div>
          <button onClick={() => removeItem(item.key)} aria-label={`Remove ${item.name} from cart`} className="cart-remove" style={{ color: '#EF4444', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 500 }}>
            <Trash2 size={16} /> Remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem
