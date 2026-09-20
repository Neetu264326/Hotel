import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Check, CreditCard, Banknote } from "lucide-react";
import AddressForm from "../components/AddressForm";
import DeliveryOptions from "../components/DeliveryOptions";
import OrderSummary from "../components/OrderSummary";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, pricing, couponCode, restaurantName, clearCart } = useCart();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState(null);

  const deliveryFee = deliveryOption === "priority" ? 60 : deliveryOption === "scheduled" ? 20 : 30;

  const orderData = {
    items,
    restaurantName,
    pricing: {
      ...pricing,
      deliveryFee,
      total: pricing.itemTotal + deliveryFee + pricing.taxes - pricing.couponDiscount,
    },
    deliveryAddress: selectedAddress,
    deliveryOption,
    couponCode,
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleDeliverySelect = (option) => {
    setDeliveryOption(option);
  };

  const handleContinueToPayment = () => {
    if (!selectedAddress) {
      addToast("Please select a delivery address", "error");
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
    if (method === "cod") {
      setStep(3);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="page-wrapper">
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-header">
            <h1>Checkout</h1>
            <div className="checkout-steps">
              <div className={`checkout-step ${step >= 1 ? "active" : ""}`}>
                <span className="step-number">{step > 1 ? <Check size={14} /> : "1"}</span>
                <span className="step-text">Address</span>
              </div>
              <div className="step-connector" />
              <div className={`checkout-step ${step >= 2 ? "active" : ""}`}>
                <span className="step-number">{step > 2 ? <Check size={14} /> : "2"}</span>
                <span className="step-text">Payment</span>
              </div>
              <div className="step-connector" />
              <div className={`checkout-step ${step >= 3 ? "active" : ""}`}>
                <span className="step-number">3</span>
                <span className="step-text">Review</span>
              </div>
            </div>
          </div>

          <div className="checkout-layout">
            <div className="checkout-main">
              {step === 1 && (
                <div className="checkout-step-content">
                  <AddressForm
                    onSelectAddress={handleAddressSelect}
                    selectedAddressId={selectedAddress?.id}
                  />
                  <DeliveryOptions
                    selected={deliveryOption}
                    onSelect={handleDeliverySelect}
                  />
                  <button
                    className="btn btn-primary btn-block btn-lg"
                    onClick={handleContinueToPayment}
                  >
                    Continue to Payment <ChevronRight size={18} />
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="checkout-step-content">
                  <h3 className="step-title">Payment Method</h3>

                  <div className="payment-methods">
                    <div
                      className={`payment-method-card ${paymentMethod === "cod" ? "selected" : ""}`}
                      onClick={() => handlePaymentSelect("cod")}
                    >
                      <div className="payment-method-icon cod-icon">
                        <Banknote size={28} />
                      </div>
                      <div className="payment-method-info">
                        <h4>Cash on Delivery</h4>
                        <p>Pay when your order arrives</p>
                      </div>
                      <div className="payment-method-check">
                        {paymentMethod === "cod" && <Check size={18} />}
                      </div>
                    </div>

                    <div
                      className={`payment-method-card ${paymentMethod === "online" ? "selected" : ""}`}
                      onClick={() => {
                        setPaymentMethod("online");
                        setStep(3);
                      }}
                    >
                      <div className="payment-method-icon online-icon">
                        <CreditCard size={28} />
                      </div>
                      <div className="payment-method-info">
                        <h4>Online Payment</h4>
                        <p>UPI, Cards, Net Banking, Wallets</p>
                      </div>
                      <div className="payment-method-check">
                        {paymentMethod === "online" && <Check size={18} />}
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-ghost"
                    onClick={() => setStep(1)}
                  >
                    ← Back to Address
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="checkout-step-content">
                  <h3 className="step-title">Review Order</h3>

                  <div className="review-section">
                    <div className="review-card">
                      <h4>Delivery Address</h4>
                      <p>{selectedAddress?.house}, {selectedAddress?.street}</p>
                      <p>{selectedAddress?.city} - {selectedAddress?.pincode}</p>
                      <p>{selectedAddress?.fullName} | {selectedAddress?.phone}</p>
                      <button className="review-edit" onClick={() => setStep(1)}>Edit</button>
                    </div>

                    <div className="review-card">
                      <h4>Delivery Option</h4>
                      <p>
                        {deliveryOption === "priority" && "Priority Delivery (20-25 min)"}
                        {deliveryOption === "standard" && "Standard Delivery (30-40 min)"}
                        {deliveryOption === "scheduled" && "Scheduled Delivery"}
                      </p>
                    </div>

                    <div className="review-card">
                      <h4>Payment Method</h4>
                      <p>
                        {paymentMethod === "cod" && "💵 Cash on Delivery"}
                        {paymentMethod === "online" && "💳 Online Payment"}
                      </p>
                    </div>
                  </div>

                  <div className="review-actions">
                    <button
                      className="btn btn-ghost"
                      onClick={() => setStep(2)}
                    >
                      ← Back
                    </button>
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={() => {
                        navigate("/payment", {
                          state: {
                            ...orderData,
                            paymentMethod,
                            pricing: orderData.pricing,
                          },
                        });
                      }}
                    >
                      Continue to Payment <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="checkout-sidebar">
              <OrderSummary
                order={{
                  ...orderData,
                  pricing: orderData.pricing,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .checkout-page {
          padding-top: 100px;
          padding-bottom: 60px;
          min-height: 100vh;
        }
        .checkout-header {
          margin-bottom: 32px;
        }
        .checkout-header h1 {
          color: var(--navy);
          margin-bottom: 20px;
        }
        .checkout-steps {
          display: flex;
          align-items: center;
          gap: 0;
        }
        .checkout-step {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid var(--gray-300);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--gray-400);
          transition: all var(--transition-fast);
        }
        .checkout-step.active .step-number {
          background: var(--coral);
          border-color: var(--coral);
          color: white;
        }
        .step-text {
          font-size: 0.9rem;
          color: var(--gray-400);
          font-weight: 500;
        }
        .checkout-step.active .step-text {
          color: var(--navy);
          font-weight: 600;
        }
        .step-connector {
          flex: 1;
          height: 2px;
          background: var(--gray-200);
          margin: 0 12px;
        }
        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 32px;
          align-items: start;
        }
        .checkout-main {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .checkout-step-content {
          animation: fadeIn 0.3s ease;
        }
        .step-title {
          font-size: 1.1rem;
          color: var(--navy);
          margin-bottom: 16px;
        }
        .payment-methods {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }
        .payment-method-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .payment-method-card:hover {
          border-color: var(--gray-300);
        }
        .payment-method-card.selected {
          border-color: var(--coral);
          background: rgba(255, 107, 53, 0.03);
        }
        .payment-method-icon {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .cod-icon {
          background: rgba(34, 197, 94, 0.1);
          color: var(--green);
        }
        .online-icon {
          background: rgba(59, 130, 246, 0.1);
          color: var(--blue);
        }
        .payment-method-info h4 {
          color: var(--navy);
          margin-bottom: 2px;
        }
        .payment-method-info p {
          color: var(--gray-500);
          font-size: 0.85rem;
        }
        .payment-method-check {
          margin-left: auto;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid var(--gray-300);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }
        .payment-method-card.selected .payment-method-check {
          background: var(--coral);
          border-color: var(--coral);
          color: white;
        }
        .checkout-sidebar {
          position: sticky;
          top: 100px;
        }
        .review-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }
        .review-card {
          background: var(--white);
          border: 1px solid var(--gray-100);
          border-radius: var(--radius-md);
          padding: 16px;
          position: relative;
        }
        .review-card h4 {
          font-size: 0.85rem;
          color: var(--gray-500);
          margin-bottom: 4px;
        }
        .review-card p {
          font-size: 0.9rem;
          color: var(--navy);
          font-weight: 500;
        }
        .review-edit {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          color: var(--coral);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }
        .review-actions {
          display: flex;
          justify-content: space-between;
        }
        @media (max-width: 900px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }
          .checkout-sidebar {
            position: static;
            order: -1;
          }
          .checkout-steps {
            overflow-x: auto;
          }
          .step-text {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
