import { useState } from "react";
import { Ticket, Check, X, AlertCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { validateCoupon } from "../data/coupons";
import { coupons } from "../data/coupons";

export default function CouponBox() {
  const [code, setCode] = useState("");
  const [showList, setShowList] = useState(false);
  const { couponCode, couponDiscount, applyCoupon, removeCoupon, pricing } = useCart();
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  const handleApply = (couponCodeStr) => {
    const codeToApply = couponCodeStr || code;
    const result = validateCoupon(codeToApply, pricing.itemTotal);
    setMessage(result.message);
    setMessageType(result.valid ? "success" : "error");

    if (result.valid) {
      applyCoupon(result.coupon.code, result.discount);
      setCode("");
    }

    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <>
      <div className="coupon-box">
        <div className="coupon-box-header">
          <Ticket size={18} />
          <span>Coupons</span>
        </div>

        {couponCode ? (
          <div className="coupon-applied">
            <div className="coupon-applied-info">
              <Check size={16} className="coupon-check" />
              <span>
                <strong>{couponCode}</strong> applied! You save ₹{couponDiscount}
              </span>
            </div>
            <button className="coupon-remove" onClick={removeCoupon}>
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="coupon-input-group">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="coupon-input"
              />
              <button
                className="coupon-apply-btn"
                onClick={() => handleApply()}
                disabled={!code.trim()}
              >
                Apply
              </button>
            </div>

            {message && (
              <div className={`coupon-message ${messageType}`}>
                {messageType === "error" ? <AlertCircle size={14} /> : <Check size={14} />}
                {message}
              </div>
            )}

            <button
              className="coupon-show-list"
              onClick={() => setShowList(!showList)}
            >
              {showList ? "Hide coupons" : "View available coupons"}
            </button>

            {showList && (
              <div className="coupon-list">
                {coupons
                  .filter((c) => c.isActive)
                  .map((coupon) => (
                    <div
                      key={coupon.id}
                      className="coupon-list-item"
                      onClick={() => handleApply(coupon.code)}
                    >
                      <div className="coupon-list-info">
                        <span className="coupon-list-code">{coupon.code}</span>
                        <span className="coupon-list-desc">{coupon.description}</span>
                        <span className="coupon-list-min">
                          Min. order ₹{coupon.minOrder}
                        </span>
                      </div>
                      <button className="coupon-list-apply">APPLY</button>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .coupon-box {
          background: var(--white);
          border-radius: var(--radius-lg);
          padding: 20px;
          border: 1px solid var(--gray-100);
        }
        .coupon-box-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 16px;
        }
        .coupon-applied {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(34, 197, 94, 0.08);
          padding: 12px 16px;
          border-radius: var(--radius-md);
          border: 1px solid rgba(34, 197, 94, 0.2);
        }
        .coupon-applied-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--green-dark);
        }
        .coupon-check {
          color: var(--green);
        }
        .coupon-remove {
          background: none;
          color: var(--gray-400);
          cursor: pointer;
          padding: 4px;
        }
        .coupon-remove:hover {
          color: var(--red);
        }
        .coupon-input-group {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .coupon-input {
          flex: 1;
          padding: 10px 14px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .coupon-input:focus {
          border-color: var(--coral);
        }
        .coupon-apply-btn {
          padding: 10px 20px;
          background: var(--coral);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .coupon-apply-btn:hover:not(:disabled) {
          background: var(--coral-dark);
        }
        .coupon-apply-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .coupon-message {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 500;
          margin-bottom: 12px;
          animation: fadeIn 0.2s ease;
        }
        .coupon-message.success {
          background: rgba(34, 197, 94, 0.1);
          color: var(--green-dark);
        }
        .coupon-message.error {
          background: rgba(239, 68, 68, 0.1);
          color: var(--red);
        }
        .coupon-show-list {
          background: none;
          border: none;
          color: var(--coral);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          margin-bottom: 12px;
        }
        .coupon-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 200px;
          overflow-y: auto;
        }
        .coupon-list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          border: 1px dashed var(--gray-300);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .coupon-list-item:hover {
          border-color: var(--coral);
          background: rgba(255, 107, 53, 0.02);
        }
        .coupon-list-code {
          font-weight: 700;
          color: var(--coral);
          font-size: 0.85rem;
          display: block;
        }
        .coupon-list-desc {
          font-size: 0.8rem;
          color: var(--gray-600);
          display: block;
        }
        .coupon-list-min {
          font-size: 0.7rem;
          color: var(--gray-400);
          display: block;
        }
        .coupon-list-apply {
          background: var(--white);
          border: 1px solid var(--coral);
          color: var(--coral);
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .coupon-list-apply:hover {
          background: var(--coral);
          color: white;
        }
      `}</style>
    </>
  );
}
