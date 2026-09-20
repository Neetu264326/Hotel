import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowRight, ChevronLeft } from "lucide-react";
import CartItem from "../components/CartItem";
import CouponBox from "../components/CouponBox";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Cart() {
  const { items, restaurantName, pricing, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="empty-state" style={{ paddingTop: 140 }}>
          <div className="empty-state-emoji">🛒</div>
          <h3>Your cart is feeling a little empty</h3>
          <p>Add some delicious items from our restaurants</p>
          <Link to="/restaurants" className="btn btn-primary">
            Explore Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="cart-page">
        <div className="container">
          <div className="cart-header">
            <Link to="/restaurants" className="back-link">
              <ChevronLeft size={20} /> Continue Shopping
            </Link>
            <h1>Your Cart</h1>
            <p>{itemCount} items from {restaurantName}</p>
          </div>

          <div className="cart-layout">
            <div className="cart-items-section">
              <div className="cart-items-header">
                <h3>Items ({itemCount})</h3>
                <button className="clear-cart-btn" onClick={clearCart}>
                  <Trash2 size={16} /> Clear Cart
                </button>
              </div>
              <div className="cart-items-list">
                {items.map((item) => (
                  <CartItem key={item.cartId} item={item} />
                ))}
              </div>
            </div>

            <div className="cart-sidebar">
              <CouponBox />

              <div className="cart-pricing">
                <h3>Bill Details</h3>
                <div className="pricing-row">
                  <span>Item Total</span>
                  <span>₹{pricing.itemTotal}</span>
                </div>
                <div className="pricing-row">
                  <span>Delivery Fee</span>
                  <span>₹{pricing.deliveryFee}</span>
                </div>
                <div className="pricing-row">
                  <span>Taxes</span>
                  <span>₹{pricing.taxes}</span>
                </div>
                {pricing.couponDiscount > 0 && (
                  <div className="pricing-row discount">
                    <span>Discount</span>
                    <span>-₹{pricing.couponDiscount}</span>
                  </div>
                )}
                <div className="pricing-row total">
                  <span>To Pay</span>
                  <span>₹{pricing.total}</span>
                </div>
              </div>

              <button
                className="btn btn-primary btn-block btn-lg checkout-btn"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile sticky checkout */}
        <div className="mobile-checkout-bar">
          <div className="mobile-checkout-info">
            <span className="mobile-checkout-total">₹{pricing.total}</span>
            <span className="mobile-checkout-items">{itemCount} items</span>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleProceedToCheckout}
          >
            Checkout <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .cart-page {
          padding-top: 100px;
          padding-bottom: 100px;
          min-height: 100vh;
        }
        .cart-header {
          margin-bottom: 32px;
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--coral);
          font-weight: 600;
          text-decoration: none;
          margin-bottom: 12px;
          font-size: 0.9rem;
        }
        .cart-header h1 {
          color: var(--navy);
          margin-bottom: 4px;
        }
        .cart-header p {
          color: var(--gray-500);
        }
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 32px;
          align-items: start;
        }
        .cart-items-section {
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: 20px;
          border: 1px solid var(--gray-100);
        }
        .cart-items-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--gray-100);
        }
        .cart-items-header h3 {
          color: var(--navy);
        }
        .clear-cart-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          color: var(--gray-400);
          font-size: 0.85rem;
          cursor: pointer;
          transition: color var(--transition-fast);
        }
        .clear-cart-btn:hover {
          color: var(--red);
        }
        .cart-sidebar {
          position: sticky;
          top: 100px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cart-pricing {
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: 20px;
          border: 1px solid var(--gray-100);
        }
        .cart-pricing h3 {
          font-size: 1rem;
          color: var(--navy);
          margin-bottom: 16px;
        }
        .pricing-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--gray-600);
          margin-bottom: 10px;
        }
        .pricing-row.discount {
          color: var(--green);
        }
        .pricing-row.total {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--navy);
          padding-top: 12px;
          border-top: 1px solid var(--gray-200);
          margin-top: 8px;
        }
        .checkout-btn {
          margin-top: 0;
        }
        .mobile-checkout-bar {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--white);
          padding: 14px 20px;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
          justify-content: space-between;
          align-items: center;
          z-index: 100;
        }
        .mobile-checkout-total {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--navy);
          display: block;
        }
        .mobile-checkout-items {
          font-size: 0.8rem;
          color: var(--gray-500);
        }
        @media (max-width: 900px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }
          .cart-sidebar {
            position: static;
          }
          .mobile-checkout-bar {
            display: flex;
          }
          .checkout-btn {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
