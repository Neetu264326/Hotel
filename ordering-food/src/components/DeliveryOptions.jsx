import { Truck, Clock, Calendar, Check } from "lucide-react";

const deliveryOptions = [
  {
    id: "standard",
    name: "Standard Delivery",
    time: "30-40 minutes",
    fee: 30,
    icon: Truck,
    description: "Delivered with care",
  },
  {
    id: "priority",
    name: "Priority Delivery",
    time: "20-25 minutes",
    fee: 60,
    icon: Clock,
    description: "Get it faster!",
  },
  {
    id: "scheduled",
    name: "Schedule Delivery",
    time: "Choose date & time",
    fee: 20,
    icon: Calendar,
    description: "Plan ahead",
  },
];

export default function DeliveryOptions({ selected, onSelect }) {
  return (
    <>
      <div className="delivery-options">
        <h3 className="step-title">Delivery Option</h3>
        <div className="delivery-grid">
          {deliveryOptions.map((opt) => (
            <div
              key={opt.id}
              className={`delivery-option ${selected === opt.id ? "selected" : ""}`}
              onClick={() => onSelect(opt.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSelect(opt.id)}
            >
              <div className="delivery-option-icon">
                <opt.icon size={22} />
              </div>
              <div className="delivery-option-info">
                <span className="delivery-option-name">{opt.name}</span>
                <span className="delivery-option-time">{opt.time}</span>
                <span className="delivery-option-desc">{opt.description}</span>
              </div>
              <div className="delivery-option-right">
                <span className="delivery-option-fee">
                  {opt.fee === 0 ? "Free" : `₹${opt.fee}`}
                </span>
                {selected === opt.id && (
                  <div className="delivery-check">
                    <Check size={14} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .delivery-options {
          margin-bottom: 24px;
        }
        .step-title {
          font-size: 1.1rem;
          color: var(--navy);
          margin-bottom: 16px;
        }
        .delivery-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .delivery-option {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .delivery-option:hover {
          border-color: var(--gray-300);
        }
        .delivery-option.selected {
          border-color: var(--coral);
          background: rgba(255, 107, 53, 0.03);
        }
        .delivery-option-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background: var(--gray-100);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--coral);
          flex-shrink: 0;
        }
        .delivery-option.selected .delivery-option-icon {
          background: var(--coral);
          color: white;
        }
        .delivery-option-info {
          flex: 1;
        }
        .delivery-option-name {
          display: block;
          font-weight: 700;
          color: var(--navy);
          font-size: 0.95rem;
        }
        .delivery-option-time {
          display: block;
          font-size: 0.85rem;
          color: var(--gray-500);
        }
        .delivery-option-desc {
          display: block;
          font-size: 0.75rem;
          color: var(--gray-400);
        }
        .delivery-option-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .delivery-option-fee {
          font-weight: 700;
          color: var(--navy);
          font-size: 0.9rem;
        }
        .delivery-check {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: var(--coral);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
}
