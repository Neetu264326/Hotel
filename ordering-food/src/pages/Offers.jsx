import { Link } from "react-router-dom";
import { Tag, Clock, Percent, Gift } from "lucide-react";
import { coupons } from "../data/coupons";

const offers = [
  {
    id: 1,
    title: "50% OFF on First Order",
    description: "Use code WELCOME50 and get flat ₹50 off on your first order. Minimum order ₹200.",
    code: "WELCOME50",
    color: "linear-gradient(135deg, #FF6B35, #FF8F5C)",
    icon: "🎉",
    validTill: "Dec 31, 2026",
  },
  {
    id: 2,
    title: "20% OFF up to ₹100",
    description: "Get 20% off on all orders. Maximum discount ₹100. Minimum order ₹300.",
    code: "FOOD20",
    color: "linear-gradient(135deg, #22C55E, #16A34A)",
    icon: "💚",
    validTill: "Dec 31, 2026",
  },
  {
    id: 3,
    title: "15% OFF on First Order",
    description: "First time ordering? Get 15% off up to ₹75. Minimum order ₹150.",
    code: "FIRSTORDER",
    color: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
    icon: "⭐",
    validTill: "Dec 31, 2026",
  },
  {
    id: 4,
    title: "₹100 OFF on Big Orders",
    description: "Planning a feast? Get ₹100 off on orders above ₹500.",
    code: "SAVE100",
    color: "linear-gradient(135deg, #FFC857, #F59E0B)",
    icon: "💰",
    validTill: "Dec 31, 2026",
  },
];

export default function Offers() {
  return (
    <div className="page-wrapper">
      <div className="offers-page">
        <div className="container">
          <div className="offers-header">
            <h1>Offers & Deals</h1>
            <p>Save big with our exclusive coupons and offers</p>
          </div>

          <div className="offers-grid-page">
            {offers.map((offer) => (
              <div key={offer.id} className="offer-card-page" style={{ background: offer.color }}>
                <div className="offer-card-content">
                  <span className="offer-icon">{offer.icon}</span>
                  <h2>{offer.title}</h2>
                  <p>{offer.description}</p>
                  <div className="offer-code-row">
                    <span className="offer-code">{offer.code}</span>
                    <span className="offer-validity">
                      <Clock size={14} /> Valid till {offer.validTill}
                    </span>
                  </div>
                  <Link to="/restaurants" className="btn btn-primary" style={{ background: "white", color: "var(--navy)" }}>
                    Order Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="more-coupons-section">
            <h2>Available Coupons</h2>
            <div className="coupons-grid">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="coupon-card">
                  <div className="coupon-card-left" style={{ borderColor: coupon.color }}>
                    <span className="coupon-card-code">{coupon.code}</span>
                    <span className="coupon-card-desc">{coupon.description}</span>
                  </div>
                  <div className="coupon-card-right">
                    <span className="coupon-card-min">Min. ₹{coupon.minOrder}</span>
                    <button className="coupon-copy-btn">COPY</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .offers-page {
          padding-top: 100px;
          padding-bottom: 60px;
          min-height: 100vh;
        }
        .offers-header {
          margin-bottom: 40px;
        }
        .offers-header h1 {
          color: var(--navy);
          margin-bottom: 8px;
        }
        .offers-header p {
          color: var(--gray-500);
          font-size: 1.05rem;
        }
        .offers-grid-page {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin-bottom: 60px;
        }
        .offer-card-page {
          border-radius: var(--radius-xl);
          padding: 36px;
          color: white;
          position: relative;
          overflow: hidden;
          transition: transform var(--transition-base);
        }
        .offer-card-page:hover {
          transform: translateY(-4px);
        }
        .offer-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 16px;
        }
        .offer-card-content h2 {
          font-size: 1.5rem;
          margin-bottom: 8px;
        }
        .offer-card-content p {
          opacity: 0.9;
          margin-bottom: 20px;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .offer-code-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .offer-code {
          background: rgba(255,255,255,0.25);
          padding: 6px 16px;
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-family: monospace;
          font-size: 1rem;
          letter-spacing: 1px;
        }
        .offer-validity {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          opacity: 0.9;
        }
        .more-coupons-section {
          margin-top: 20px;
        }
        .more-coupons-section h2 {
          color: var(--navy);
          margin-bottom: 24px;
        }
        .coupons-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .coupon-card {
          display: flex;
          background: var(--white);
          border-radius: var(--radius-md);
          border: 1px solid var(--gray-100);
          overflow: hidden;
        }
        .coupon-card-left {
          flex: 1;
          padding: 16px;
          border-left: 4px solid;
        }
        .coupon-card-code {
          display: block;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 4px;
          font-family: monospace;
          font-size: 0.95rem;
        }
        .coupon-card-desc {
          font-size: 0.8rem;
          color: var(--gray-500);
        }
        .coupon-card-right {
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-left: 1px dashed var(--gray-200);
        }
        .coupon-card-min {
          font-size: 0.75rem;
          color: var(--gray-400);
          white-space: nowrap;
        }
        .coupon-copy-btn {
          padding: 6px 14px;
          border: 1px solid var(--coral);
          color: var(--coral);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          background: none;
          transition: all var(--transition-fast);
        }
        .coupon-copy-btn:hover {
          background: var(--coral);
          color: white;
        }
        @media (max-width: 768px) {
          .offers-grid-page, .coupons-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
