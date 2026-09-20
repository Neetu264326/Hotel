import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Phone, MessageSquare, MapPin } from "lucide-react";
import OrderTracker from "../components/OrderTracker";
import { useOrder } from "../context/OrderContext";

export default function TrackOrder() {
  const { currentOrder, updateOrderStatus } = useOrder();
  const [order, setOrder] = useState(currentOrder);

  useEffect(() => {
    if (currentOrder) {
      setOrder(currentOrder);
    }
  }, [currentOrder]);

  const handleStatusUpdate = useCallback((status, steps) => {
    updateOrderStatus(status, steps);
  }, [updateOrderStatus]);

  if (!order) {
    return (
      <div className="page-wrapper">
        <div className="empty-state" style={{ paddingTop: 140 }}>
          <div className="empty-state-emoji">📦</div>
          <h3>No active order</h3>
          <p>Place an order to track it here</p>
          <Link to="/restaurants" className="btn btn-primary">Browse Restaurants</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="track-order-page">
        <div className="container">
          <div className="track-header">
            <h1>Track Order</h1>
            <span className="order-id-badge">#{order.orderId}</span>
          </div>

          <div className="track-layout">
            <div className="track-main">
              <div className="tracker-card">
                <h3>Delivery Status</h3>
                <OrderTracker
                  statusSteps={order.statusSteps}
                  onStatusUpdate={handleStatusUpdate}
                />
              </div>

              <div className="delivery-partner-card">
                <h3>Delivery Partner</h3>
                <div className="partner-info">
                  <div className="partner-avatar">
                    {order.deliveryPartner?.name?.charAt(0)}
                  </div>
                  <div className="partner-details">
                    <span className="partner-name">{order.deliveryPartner?.name}</span>
                    <span className="partner-rating">⭐ {order.deliveryPartner?.rating} • {order.deliveryPartner?.vehicle}</span>
                  </div>
                  <div className="partner-actions">
                    <button className="partner-action-btn" aria-label="Call delivery partner">
                      <Phone size={18} />
                    </button>
                    <button className="partner-action-btn" aria-label="Message delivery partner">
                      <MessageSquare size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="track-sidebar">
              <div className="order-info-card">
                <h3>Order Details</h3>

                <div className="info-row">
                  <span className="info-label">Order ID</span>
                  <span className="info-value">#{order.orderId}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Restaurant</span>
                  <span className="info-value">{order.restaurantName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Payment</span>
                  <span className="info-value">{order.paymentMethod}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Total</span>
                  <span className="info-value total">₹{order.pricing?.total}</span>
                </div>

                <div className="order-items-mini">
                  <h4>Items</h4>
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="mini-item">
                      <span>{item.quantity}x {item.name}</span>
                    </div>
                  ))}
                </div>

                {order.deliveryAddress && (
                  <div className="delivery-address-mini">
                    <h4>Delivery Address</h4>
                    <div className="address-mini-content">
                      <MapPin size={14} />
                      <span>{order.deliveryAddress.house}, {order.deliveryAddress.street}, {order.deliveryAddress.city}</span>
                    </div>
                  </div>
                )}

                <div className="eta-card">
                  <span className="eta-label">Estimated Delivery</span>
                  <span className="eta-time">{order.estimatedDelivery?.text || "30-40 minutes"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .track-order-page {
          padding-top: 100px;
          padding-bottom: 60px;
          min-height: 100vh;
        }
        .track-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }
        .track-header h1 {
          color: var(--navy);
        }
        .order-id-badge {
          background: var(--coral);
          color: white;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.85rem;
        }
        .track-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 32px;
          align-items: start;
        }
        .track-main {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .tracker-card, .delivery-partner-card, .order-info-card {
          background: var(--white);
          border: 1px solid var(--gray-100);
          border-radius: var(--radius-lg);
          padding: 24px;
        }
        .tracker-card h3, .delivery-partner-card h3, .order-info-card h3 {
          color: var(--navy);
          margin-bottom: 20px;
          font-size: 1.05rem;
        }
        .partner-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .partner-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--coral), var(--golden));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .partner-details {
          flex: 1;
        }
        .partner-name {
          display: block;
          font-weight: 700;
          color: var(--navy);
        }
        .partner-rating {
          font-size: 0.85rem;
          color: var(--gray-500);
        }
        .partner-actions {
          display: flex;
          gap: 8px;
        }
        .partner-action-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid var(--gray-200);
          background: var(--white);
          color: var(--coral);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .partner-action-btn:hover {
          background: var(--coral);
          color: white;
          border-color: var(--coral);
        }

        .track-sidebar {
          position: sticky;
          top: 100px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid var(--gray-100);
        }
        .info-label {
          color: var(--gray-500);
          font-size: 0.9rem;
        }
        .info-value {
          font-weight: 600;
          color: var(--navy);
          font-size: 0.9rem;
        }
        .info-value.total {
          color: var(--coral);
        }
        .order-items-mini {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--gray-100);
        }
        .order-items-mini h4 {
          font-size: 0.85rem;
          color: var(--gray-500);
          margin-bottom: 8px;
        }
        .mini-item {
          font-size: 0.85rem;
          color: var(--gray-600);
          padding: 4px 0;
        }
        .delivery-address-mini {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--gray-100);
        }
        .delivery-address-mini h4 {
          font-size: 0.85rem;
          color: var(--gray-500);
          margin-bottom: 8px;
        }
        .address-mini-content {
          display: flex;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--gray-600);
        }
        .address-mini-content svg {
          color: var(--coral);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .eta-card {
          margin-top: 16px;
          padding: 16px;
          background: rgba(255, 107, 53, 0.05);
          border-radius: var(--radius-md);
          text-align: center;
        }
        .eta-label {
          display: block;
          font-size: 0.8rem;
          color: var(--gray-500);
          margin-bottom: 4px;
        }
        .eta-time {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--coral);
        }
        @media (max-width: 900px) {
          .track-layout {
            grid-template-columns: 1fr;
          }
          .track-sidebar {
            position: static;
            order: -1;
          }
        }
      `}</style>
    </div>
  );
}
