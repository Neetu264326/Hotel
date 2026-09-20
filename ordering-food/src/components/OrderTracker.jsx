import { useState, useEffect, useCallback } from "react";
import { Check } from "lucide-react";

const steps = [
  { key: "confirmed", label: "Order Confirmed", description: "Your order has been received" },
  { key: "accepted", label: "Restaurant Accepted", description: "The restaurant confirmed your order" },
  { key: "preparing", label: "Preparing Your Food", description: "Your food is being prepared" },
  { key: "pickedUp", label: "Picked Up", description: "Delivery partner has picked up your order" },
  { key: "onTheWay", label: "On the Way", description: "Your order is on its way" },
  { key: "delivered", label: "Delivered", description: "Enjoy your meal!" },
];

export default function OrderTracker({ statusSteps, onStatusUpdate }) {
  const [currentSteps, setCurrentSteps] = useState(statusSteps);

  const advanceStatus = useCallback(() => {
    const stepOrder = ["confirmed", "accepted", "preparing", "pickedUp", "onTheWay", "delivered"];
    const currentIdx = stepOrder.findIndex((s) => !currentSteps[s]);
    if (currentIdx === -1 || currentIdx === 0 && currentSteps.confirmed) {
      const nextIdx = stepOrder.findIndex((s) => !currentSteps[s]);
      if (nextIdx > 0) {
        const nextStep = stepOrder[nextIdx];
        const newSteps = { ...currentSteps, [nextStep]: true };
        setCurrentSteps(newSteps);
        onStatusUpdate(stepOrder[nextIdx], newSteps);
      } else if (!currentSteps.confirmed) {
        const newSteps = { ...currentSteps, confirmed: true };
        setCurrentSteps(newSteps);
        onStatusUpdate("confirmed", newSteps);
      }
    }
  }, [currentSteps, onStatusUpdate]);

  useEffect(() => {
    const completedCount = Object.values(currentSteps).filter(Boolean).length;
    if (completedCount < steps.length) {
      const delay = 3000 + Math.random() * 2000;
      const timer = setTimeout(advanceStatus, delay);
      return () => clearTimeout(timer);
    }
  }, [currentSteps, advanceStatus]);

  const completedCount = Object.values(currentSteps).filter(Boolean).length;
  const progressPercent = ((completedCount - 1) / (steps.length - 1)) * 100;

  return (
    <>
      <div className="order-tracker">
        <div className="tracker-progress-bar">
          <div
            className="tracker-progress-fill"
            style={{ height: `${progressPercent}%` }}
          />
        </div>

        <div className="tracker-steps">
          {steps.map((step, idx) => (
            <div
              key={step.key}
              className={`tracker-step ${currentSteps[step.key] ? "completed" : ""} ${
                idx === completedCount ? "active" : ""
              }`}
            >
              <div className="step-indicator">
                {currentSteps[step.key] ? (
                  <Check size={14} />
                ) : (
                  <span className="step-dot" />
                )}
              </div>
              <div className="step-content">
                <span className="step-label">{step.label}</span>
                <span className="step-desc">{step.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .order-tracker {
          position: relative;
          padding: 0 0 0 20px;
        }
        .tracker-progress-bar {
          position: absolute;
          left: 31px;
          top: 20px;
          bottom: 20px;
          width: 3px;
          background: var(--gray-200);
          border-radius: 2px;
        }
        .tracker-progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(180deg, var(--coral), var(--green));
          border-radius: 2px;
          transition: height 0.8s ease;
        }
        .tracker-steps {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .tracker-step {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        .step-indicator {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: var(--white);
          border: 2px solid var(--gray-300);
          z-index: 1;
          transition: all 0.5s ease;
        }
        .tracker-step.completed .step-indicator {
          background: var(--green);
          border-color: var(--green);
          color: white;
        }
        .tracker-step.active .step-indicator {
          background: var(--coral);
          border-color: var(--coral);
          color: white;
          animation: pulse 1.5s ease infinite;
        }
        .step-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--gray-300);
        }
        .step-content {
          padding-top: 1px;
        }
        .step-label {
          display: block;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--gray-400);
          transition: color 0.3s ease;
        }
        .tracker-step.completed .step-label,
        .tracker-step.active .step-label {
          color: var(--navy);
        }
        .step-desc {
          display: block;
          font-size: 0.8rem;
          color: var(--gray-400);
          margin-top: 2px;
        }
        .tracker-step.completed .step-desc {
          color: var(--gray-500);
        }
      `}</style>
    </>
  );
}
