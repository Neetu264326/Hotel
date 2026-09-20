export default function OrderSummary({ order }) {
  if (!order) return null;

  return (
    <>
      <div className="order-summary">
        <h3 className="summary-title">Order Summary</h3>

        <div className="summary-restaurant">
          <span className="summary-label">Restaurant</span>
          <span className="summary-value">{order.restaurantName}</span>
        </div>

        <div className="summary-items">
          {order.items.map((item, idx) => (
            <div key={idx} className="summary-item">
              <div className="summary-item-info">
                <span className="summary-item-qty">{item.quantity}x</span>
                <span className="summary-item-name">{item.name}</span>
              </div>
              <span className="summary-item-price">
                ₹{(item.basePrice || item.price) * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {order.deliveryAddress && (
          <div className="summary-address">
            <span className="summary-label">Delivery Address</span>
            <p className="summary-address-text">
              {order.deliveryAddress.house}, {order.deliveryAddress.street},
              <br />
              {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
            </p>
          </div>
        )}

        <div className="summary-divider" />

        <div className="summary-pricing">
          <div className="pricing-row">
            <span>Item Total</span>
            <span>₹{order.pricing?.itemTotal || 0}</span>
          </div>
          <div className="pricing-row">
            <span>Delivery Fee</span>
            <span>₹{order.pricing?.deliveryFee || 0}</span>
          </div>
          <div className="pricing-row">
            <span>Taxes</span>
            <span>₹{order.pricing?.taxes || 0}</span>
          </div>
          {order.pricing?.couponDiscount > 0 && (
            <div className="pricing-row discount">
              <span>Discount</span>
              <span>-₹{order.pricing.couponDiscount}</span>
            </div>
          )}
          <div className="pricing-row total">
            <span>Total</span>
            <span>₹{order.pricing?.total || 0}</span>
          </div>
        </div>
      </div>

      <style>{`
        .order-summary {
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: 20px;
          border: 1px solid var(--gray-100);
        }
        .summary-title {
          font-size: 1.1rem;
          color: var(--navy);
          margin-bottom: 16px;
        }
        .summary-restaurant {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .summary-label {
          font-size: 0.85rem;
          color: var(--gray-500);
        }
        .summary-value {
          font-weight: 700;
          color: var(--navy);
          font-size: 0.9rem;
        }
        .summary-items {
          margin-bottom: 16px;
        }
        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
        }
        .summary-item-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .summary-item-qty {
          font-size: 0.8rem;
          color: var(--gray-400);
          font-weight: 600;
        }
        .summary-item-name {
          font-size: 0.9rem;
          color: var(--gray-700);
        }
        .summary-item-price {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--navy);
        }
        .summary-address {
          margin-bottom: 16px;
        }
        .summary-address-text {
          font-size: 0.85rem;
          color: var(--gray-600);
          margin-top: 4px;
        }
        .summary-divider {
          border-top: 1px dashed var(--gray-200);
          margin: 12px 0;
        }
        .pricing-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--gray-600);
          margin-bottom: 8px;
        }
        .pricing-row.discount {
          color: var(--green);
        }
        .pricing-row.total {
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--navy);
          padding-top: 8px;
          border-top: 1px solid var(--gray-200);
          margin-top: 8px;
        }
      `}</style>
    </>
  );
}
