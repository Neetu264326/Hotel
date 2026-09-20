import { Link } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  const itemPrice = item.basePrice || item.price;
  const addOnsTotal = item.selectedAddOns?.reduce((sum, a) => sum + a.price, 0) || 0;
  const totalItemPrice = (itemPrice + addOnsTotal) * item.quantity;

  return (
    <>
      <div className="cart-item">
        <div className="cart-item-image">
          <img src={item.image} alt={item.name} loading="lazy" />
        </div>

        <div className="cart-item-details">
          <div className="cart-item-header">
            <div className="cart-item-type-name">
              {item.isVeg ? (
                <span className="veg-indicator" />
              ) : (
                <span className="non-veg-indicator" />
              )}
              <h4>{item.name}</h4>
            </div>
            <button
              className="cart-item-remove"
              onClick={() => removeItem(item.cartId)}
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 size={16} />
            </button>
          </div>

          {item.selectedSize && (
            <span className="cart-item-size">{item.selectedSize}</span>
          )}

          {item.selectedAddOns?.length > 0 && (
            <div className="cart-item-addons">
              {item.selectedAddOns.map((a) => (
                <span key={a.name} className="addon-tag">{a.name}</span>
              ))}
            </div>
          )}

          {item.specialInstructions && (
            <p className="cart-item-instructions">{item.specialInstructions}</p>
          )}

          <div className="cart-item-footer">
            <div className="cart-item-quantity">
              <button
                onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="cart-item-price">₹{totalItemPrice}</span>
          </div>
        </div>
      </div>

      <style>{`
        .cart-item {
          display: flex;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid var(--gray-100);
        }
        .cart-item:last-child {
          border-bottom: none;
        }
        .cart-item-image {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-md);
          overflow: hidden;
          flex-shrink: 0;
        }
        .cart-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cart-item-details {
          flex: 1;
        }
        .cart-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
        }
        .cart-item-type-name {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .cart-item-type-name h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--navy);
        }
        .cart-item-remove {
          background: none;
          color: var(--gray-400);
          padding: 4px;
          cursor: pointer;
          transition: color var(--transition-fast);
        }
        .cart-item-remove:hover {
          color: var(--red);
        }
        .cart-item-size {
          font-size: 0.8rem;
          color: var(--gray-500);
          margin-bottom: 4px;
        }
        .cart-item-addons {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 4px;
        }
        .addon-tag {
          font-size: 0.7rem;
          background: var(--gray-100);
          color: var(--gray-600);
          padding: 2px 6px;
          border-radius: var(--radius-sm);
        }
        .cart-item-instructions {
          font-size: 0.75rem;
          color: var(--gray-400);
          font-style: italic;
          margin-bottom: 4px;
        }
        .cart-item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .cart-item-quantity {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-full);
          padding: 2px;
        }
        .cart-item-quantity button {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--gray-100);
          color: var(--navy);
          border: none;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .cart-item-quantity button:hover {
          background: var(--coral);
          color: white;
        }
        .cart-item-quantity span {
          font-weight: 700;
          font-size: 0.9rem;
          min-width: 20px;
          text-align: center;
        }
        .cart-item-price {
          font-weight: 700;
          color: var(--navy);
          font-size: 1rem;
        }
      `}</style>
    </>
  );
}
