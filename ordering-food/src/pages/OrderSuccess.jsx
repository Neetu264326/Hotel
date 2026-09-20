import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Check, MapPin, CreditCard, Clock, ChevronRight } from "lucide-react";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      color: ["#FF6B35", "#FFC857", "#22C55E", "#8B5CF6", "#3B82F6"][Math.floor(Math.random() * 5)],
      size: 6 + Math.random() * 8,
    }));
    setConfetti(pieces);
  }, []);

  const order = location.state?.order;

  if (!order) {
    return (
      <div className="page-wrapper">
        <div className="empty-state" style={{ paddingTop: 140 }}>
          <div className="empty-state-emoji">📋</div>
          <h3>No order found</h3>
          <p>Start ordering some delicious food!</p>
          <Link to="/restaurants" className="btn btn-primary">Browse Restaurants</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="order-success-page">
        <div className="confetti-container">
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className="confetti-piece"
              style={{
                left: `${piece.x}%`,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                background: piece.color,
                width: piece.size,
                height: piece.size,
              }}
            />
          ))}
        </div>

        <div className="container">
          <div className="success-content">
            <div className="success-checkmark">
              <div className="checkmark-circle">
                <Check size={48} />
              </div>
            </div>

            <h1 className="success-title">Order Confirmed!</h1>
            <p className="success-subtitle">
              Your order <strong>#{order.orderId}</strong> has been successfully placed
            </p>

            <div className="success-eta">
              <Clock size={20} />
              <span>Estimated delivery: <strong>{order.estimatedDelivery?.text || "30-40 minutes"}</strong></span>
            </div>

            <div className="success-details">
              <div className="success-detail-card">
                <h4>Restaurant</h4>
                <p>{order.restaurantName}</p>
              </div>
              <div className="success-detail-card">
                <h4>Items</h4>
                <p>{order.items?.length} items ordered</p>
              </div>
              <div className="success-detail-card">
                <h4>Payment</h4>
                <p>{order.paymentMethod}</p>
              </div>
              <div className="success-detail-card">
                <h4>Total</h4>
                <p className="total-amount">₹{order.pricing?.total}</p>
              </div>
            </div>

            {order.deliveryAddress && (
              <div className="success-address">
                <MapPin size={18} />
                <div>
                  <span className="address-label">Delivering to</span>
                  <p>{order.deliveryAddress.house}, {order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
                </div>
              </div>
            )}

            <div className="success-actions">
              <Link to="/track-order" className="btn btn-primary btn-lg">
                Track Order <ChevronRight size={18} />
              </Link>
              <Link to="/restaurants" className="btn btn-secondary btn-lg">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .order-success-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
        }
        .confetti-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .confetti-piece {
          position: absolute;
          top: -20px;
          border-radius: 2px;
          animation: confetti-fall linear infinite;
        }
        .success-content {
          text-align: center;
          position: relative;
          z-index: 1;
          max-width: 600px;
          width: 100%;
          animation: scaleIn 0.5s ease;
        }
        .success-checkmark {
          margin-bottom: 24px;
        }
        .checkmark-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--green), #16a34a);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 8px 30px rgba(34, 197, 94, 0.4);
          animation: badge-pop 0.5s ease 0.3s both;
        }
        .success-title {
          font-size: 2rem;
          color: var(--navy);
          margin-bottom: 8px;
        }
        .success-subtitle {
          color: var(--gray-500);
          margin-bottom: 20px;
          font-size: 1rem;
        }
        .success-eta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 107, 53, 0.1);
          color: var(--coral);
          padding: 10px 20px;
          border-radius: var(--radius-full);
          font-size: 0.95rem;
          margin-bottom: 32px;
        }
        .success-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        .success-detail-card {
          background: var(--white);
          border: 1px solid var(--gray-100);
          border-radius: var(--radius-md);
          padding: 16px;
          text-align: left;
        }
        .success-detail-card h4 {
          font-size: 0.75rem;
          color: var(--gray-400);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .success-detail-card p {
          font-weight: 600;
          color: var(--navy);
          font-size: 0.9rem;
        }
        .total-amount {
          color: var(--coral) !important;
          font-size: 1.1rem !important;
        }
        .success-address {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: var(--white);
          border: 1px solid var(--gray-100);
          border-radius: var(--radius-md);
          padding: 16px;
          text-align: left;
          margin-bottom: 32px;
        }
        .success-address svg {
          color: var(--coral);
          margin-top: 2px;
          flex-shrink: 0;
        }
        .address-label {
          font-size: 0.75rem;
          color: var(--gray-400);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .success-address p {
          font-size: 0.9rem;
          color: var(--navy);
          font-weight: 500;
        }
        .success-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }
        @media (max-width: 480px) {
          .success-details {
            grid-template-columns: 1fr;
          }
          .success-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
