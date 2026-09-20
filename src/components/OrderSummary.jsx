import { useCart } from '../context/CartContext'

const OrderSummary = ({ title = 'Order Summary', deliveryCharge }) => {
  const { items, subtotal, deliveryFee, tax, discount, coupon } = useCart()

  return (
    <div className="order-summary" style={{ background: '#fff', borderRadius: 20, boxShadow: 'var(--shadow-md)', padding: 24 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: 'var(--navy)' }}>{title}</h3>

      <div className="summary-items" style={{ display: 'grid', gap: 12, marginBottom: 20, maxHeight: 240, overflowY: 'auto' }}>
        {items.map((item) => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: '#FFF8F0', color: 'var(--coral)', borderRadius: 8, padding: '3px 8px', fontSize: 12, fontWeight: 700 }}>{item.quantity}×</span>
            <span style={{ fontSize: 14, flex: 1 }}>{item.name}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>₹{item.lineTotal}</span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
          <span style={{ color: 'var(--text-gray)' }}>Item Total</span>
          <span style={{ fontWeight: 600 }}>₹{subtotal}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
          <span style={{ color: 'var(--text-gray)' }}>Delivery Fee</span>
          <span style={{ fontWeight: 600 }}>{deliveryCharge !== undefined ? `₹${deliveryCharge}` : deliveryFee === 0 ? <span style={{ color: 'var(--green)' }}>FREE</span> : `₹${deliveryFee}`}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
          <span style={{ color: 'var(--text-gray)' }}>Taxes (5%)</span>
          <span style={{ fontWeight: 600 }}>₹{tax}</span>
        </div>
        {discount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
            <span style={{ color: 'var(--text-gray)' }}>Discount {coupon ? `(${coupon})` : ''}</span>
            <span style={{ fontWeight: 600, color: 'var(--green)' }}>-₹{discount}</span>
          </div>
        )}
        <div style={{ borderTop: '1px dashed var(--border)', margin: '12px 0', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--navy)' }}>Total</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--coral)' }}>₹{subtotal + (deliveryCharge !== undefined ? deliveryCharge : deliveryFee) + tax - discount}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
