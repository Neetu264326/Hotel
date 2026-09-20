import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, Check, Loader, Lock, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";
import { useToast } from "../context/ToastContext";
import { generateTransactionId } from "../utils/orderGenerator";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state;
  const { placeOrder } = useOrder();
  const { clearCart } = useCart();
  const { addToast } = useToast();

  const [paymentType, setPaymentType] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [errors, setErrors] = useState({});
  const [cardData, setCardData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState(null);
  const [selectedWallet, setSelectedWallet] = useState(null);

  useEffect(() => {
    if (!orderData) {
      navigate("/cart");
    }
  }, [orderData, navigate]);

  const banks = ["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB"];
  const wallets = ["Paytm", "PhonePe", "Amazon Pay", "Mobikwik"];

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    if (name === "cardNumber") {
      setCardData({ ...cardData, cardNumber: formatCardNumber(value) });
    } else if (name === "expiry") {
      let v = value.replace(/\D/g, "");
      if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2, 4);
      setCardData({ ...cardData, expiry: v });
    } else if (name === "cvv") {
      setCardData({ ...cardData, cvv: value.slice(0, 3) });
    } else {
      setCardData({ ...cardData, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateCard = () => {
    const errs = {};
    if (!cardData.cardName.trim()) errs.cardName = "Name is required";
    if (cardData.cardNumber.replace(/\s/g, "").length < 16) errs.cardNumber = "Enter valid card number";
    if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) errs.expiry = "Enter valid expiry (MM/YY)";
    if (cardData.cvv.length < 3) errs.cvv = "Enter valid CVV";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateUPI = () => {
    if (!upiId.trim() || !/^[\w.-]+@[\w]+$/.test(upiId)) {
      setErrors({ upiId: "Enter a valid UPI ID (e.g., name@upi)" });
      return false;
    }
    setErrors({});
    return true;
  };

  const processPayment = async () => {
    if (paymentType === "card" && !validateCard()) return;
    if (paymentType === "upi" && !validateUPI()) return;

    setIsProcessing(true);

    await new Promise((r) => setTimeout(r, 2500));

    setIsProcessing(false);
    setPaymentDone(true);

    const order = placeOrder({
      ...orderData,
      paymentMethod: paymentType === "cod" ? "Cash on Delivery" : `Online - ${paymentType.toUpperCase()}`,
      transactionId: generateTransactionId(),
    });

    clearCart();

    setTimeout(() => {
      navigate("/order-success", { state: { order } });
    }, 1500);
  };

  const handleCODConfirm = () => {
    processPayment();
  };

  if (!orderData) return null;

  if (paymentDone) {
    return (
      <div className="payment-success-overlay">
        <div className="payment-success-content">
          <div className="success-checkmark">
            <Check size={48} />
          </div>
          <h2>Payment Successful!</h2>
          <p>Redirecting to confirmation...</p>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="payment-processing-overlay">
        <div className="payment-processing-content">
          <div className="processing-spinner" />
          <h2>Processing Payment</h2>
          <p>Securing your payment...</p>
          <div className="processing-steps">
            <div className="process-step active">✓ Validating details</div>
            <div className="process-step active">✓ Connecting to bank</div>
            <div className="process-step">⏳ Confirming payment</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="payment-page">
        <div className="container">
          <div className="payment-header">
            <button className="back-link" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} /> Back
            </button>
            <h1>Payment</h1>
            <div className="payment-secure">
              <Lock size={14} />
              <span>Secure Payment</span>
            </div>
          </div>

          <div className="payment-layout">
            <div className="payment-main">
              {orderData.paymentMethod === "cod" || (!orderData.paymentMethod && !paymentType) ? (
                <div className="cod-section">
                  <div className="cod-card">
                    <div className="cod-icon">💵</div>
                    <h2>Cash on Delivery</h2>
                    <p>Pay when your order arrives</p>
                    <div className="cod-details">
                      <div className="cod-row">
                        <span>Order Amount</span>
                        <span className="cod-amount">₹{orderData.pricing?.total}</span>
                      </div>
                    </div>
                    <label className="cod-confirm-label">
                      <input
                        type="checkbox"
                        id="codConfirm"
                        onChange={(e) => {
                          if (e.target.checked) handleCODConfirm();
                        }}
                      />
                      <span>I confirm this order and will pay ₹{orderData.pricing?.total} on delivery</span>
                    </label>
                  </div>
                </div>
              ) : (
                <>
                  <div className="online-payment-section">
                    <h3>Choose Payment Method</h3>
                    <div className="online-methods">
                      {["card", "upi", "netbanking", "wallet"].map((m) => (
                        <button
                          key={m}
                          className={`online-method-btn ${paymentType === m ? "active" : ""}`}
                          onClick={() => setPaymentType(m)}
                        >
                          <span className="method-icon">
                            {m === "card" && <CreditCard size={18} />}
                            {m === "upi" && "📱"}
                            {m === "netbanking" && "🏦"}
                            {m === "wallet" && "💰"}
                          </span>
                          <span>{m === "card" ? "Card" : m === "upi" ? "UPI" : m === "netbanking" ? "Net Banking" : "Wallet"}</span>
                        </button>
                      ))}
                    </div>

                    {paymentType === "card" && (
                      <div className="payment-form">
                        <div className="form-group">
                          <label className="form-label">Cardholder Name</label>
                          <input
                            name="cardName"
                            className={`form-input ${errors.cardName ? "error" : ""}`}
                            placeholder="John Doe"
                            value={cardData.cardName}
                            onChange={handleCardChange}
                          />
                          {errors.cardName && <span className="form-error">{errors.cardName}</span>}
                        </div>
                        <div className="form-group">
                          <label className="form-label">Card Number</label>
                          <input
                            name="cardNumber"
                            className={`form-input ${errors.cardNumber ? "error" : ""}`}
                            placeholder="4242 4242 4242 4242"
                            value={cardData.cardNumber}
                            onChange={handleCardChange}
                            maxLength={19}
                          />
                          {errors.cardNumber && <span className="form-error">{errors.cardNumber}</span>}
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Expiry</label>
                            <input
                              name="expiry"
                              className={`form-input ${errors.expiry ? "error" : ""}`}
                              placeholder="MM/YY"
                              value={cardData.expiry}
                              onChange={handleCardChange}
                              maxLength={5}
                            />
                            {errors.expiry && <span className="form-error">{errors.expiry}</span>}
                          </div>
                          <div className="form-group">
                            <label className="form-label">CVV</label>
                            <input
                              name="cvv"
                              type="password"
                              className={`form-input ${errors.cvv ? "error" : ""}`}
                              placeholder="•••"
                              value={cardData.cvv}
                              onChange={handleCardChange}
                              maxLength={3}
                            />
                            {errors.cvv && <span className="form-error">{errors.cvv}</span>}
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentType === "upi" && (
                      <div className="payment-form">
                        <div className="form-group">
                          <label className="form-label">UPI ID</label>
                          <input
                            className={`form-input ${errors.upiId ? "error" : ""}`}
                            placeholder="yourname@upi"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              if (errors.upiId) setErrors({});
                            }}
                          />
                          {errors.upiId && <span className="form-error">{errors.upiId}</span>}
                        </div>
                      </div>
                    )}

                    {paymentType === "netbanking" && (
                      <div className="bank-grid">
                        {banks.map((bank) => (
                          <button
                            key={bank}
                            className={`bank-option ${selectedBank === bank ? "active" : ""}`}
                            onClick={() => setSelectedBank(bank)}
                          >
                            {bank}
                          </button>
                        ))}
                      </div>
                    )}

                    {paymentType === "wallet" && (
                      <div className="wallet-grid">
                        {wallets.map((wallet) => (
                          <button
                            key={wallet}
                            className={`wallet-option ${selectedWallet === wallet ? "active" : ""}`}
                            onClick={() => setSelectedWallet(wallet)}
                          >
                            {wallet}
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      className="btn btn-primary btn-block btn-lg"
                      onClick={processPayment}
                    >
                      Pay Securely ₹{orderData.pricing?.total}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="payment-sidebar">
              <div className="payment-summary">
                <h3>Order Summary</h3>
                <div className="summary-restaurant-name">{orderData.restaurantName}</div>
                <div className="summary-items-list">
                  {orderData.items?.map((item, idx) => (
                    <div key={idx} className="summary-item-row">
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{(item.basePrice || item.price) * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="summary-divider" />
                <div className="summary-total-row">
                  <span>Total</span>
                  <span>₹{orderData.pricing?.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .payment-page {
          padding-top: 100px;
          padding-bottom: 60px;
          min-height: 100vh;
        }
        .payment-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          gap: 16px;
        }
        .payment-header h1 {
          color: var(--navy);
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--coral);
          font-weight: 600;
          text-decoration: none;
          background: none;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .payment-secure {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--green);
          font-size: 0.85rem;
          font-weight: 600;
        }
        .payment-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 32px;
          align-items: start;
        }
        .payment-main {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .online-payment-section h3 {
          color: var(--navy);
          margin-bottom: 16px;
        }
        .online-methods {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 24px;
        }
        .online-method-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 16px 12px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-md);
          background: var(--white);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-size: 0.85rem;
          font-weight: 500;
        }
        .online-method-btn:hover {
          border-color: var(--coral);
        }
        .online-method-btn.active {
          border-color: var(--coral);
          background: rgba(255, 107, 53, 0.05);
          color: var(--coral);
        }
        .method-icon {
          font-size: 1.5rem;
        }
        .payment-form {
          background: var(--white);
          border: 1px solid var(--gray-100);
          border-radius: var(--radius-lg);
          padding: 20px;
          margin-bottom: 20px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .bank-grid, .wallet-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }
        .bank-option, .wallet-option {
          padding: 14px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-md);
          background: var(--white);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-weight: 500;
          text-align: center;
        }
        .bank-option:hover, .wallet-option:hover {
          border-color: var(--coral);
        }
        .bank-option.active, .wallet-option.active {
          border-color: var(--coral);
          background: rgba(255, 107, 53, 0.05);
          color: var(--coral);
        }

        .cod-section {
          animation: fadeIn 0.3s ease;
        }
        .cod-card {
          background: var(--white);
          border: 1px solid var(--gray-100);
          border-radius: var(--radius-xl);
          padding: 40px;
          text-align: center;
        }
        .cod-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }
        .cod-card h2 {
          color: var(--navy);
          margin-bottom: 8px;
        }
        .cod-card > p {
          color: var(--gray-500);
          margin-bottom: 24px;
        }
        .cod-details {
          background: var(--gray-50);
          padding: 16px;
          border-radius: var(--radius-md);
          margin-bottom: 24px;
        }
        .cod-row {
          display: flex;
          justify-content: space-between;
          font-weight: 600;
        }
        .cod-amount {
          color: var(--coral);
          font-size: 1.2rem;
        }
        .cod-confirm-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          text-align: left;
          cursor: pointer;
          font-size: 0.9rem;
          color: var(--gray-600);
        }
        .cod-confirm-label input {
          margin-top: 4px;
          accent-color: var(--coral);
        }

        .payment-sidebar {
          position: sticky;
          top: 100px;
        }
        .payment-summary {
          background: var(--white);
          border: 1px solid var(--gray-100);
          border-radius: var(--radius-lg);
          padding: 20px;
        }
        .payment-summary h3 {
          color: var(--navy);
          margin-bottom: 12px;
        }
        .summary-restaurant-name {
          font-weight: 600;
          color: var(--navy);
          margin-bottom: 12px;
        }
        .summary-items-list {
          margin-bottom: 12px;
        }
        .summary-item-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--gray-600);
          margin-bottom: 6px;
        }
        .summary-divider {
          border-top: 1px dashed var(--gray-200);
          margin: 12px 0;
        }
        .summary-total-row {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--navy);
        }

        .payment-success-overlay, .payment-processing-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3000;
        }
        .payment-success-content, .payment-processing-content {
          text-align: center;
          color: white;
          animation: scaleIn 0.5s ease;
        }
        .success-checkmark {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: var(--green);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          animation: badge-pop 0.5s ease;
        }
        .payment-success-content h2 {
          margin-bottom: 8px;
        }
        .payment-processing-content h2 {
          margin-bottom: 8px;
        }
        .processing-spinner {
          width: 80px;
          height: 80px;
          border: 4px solid rgba(255,255,255,0.2);
          border-top-color: var(--coral);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 24px;
        }
        .processing-steps {
          margin-top: 24px;
          text-align: left;
          max-width: 200px;
          margin-left: auto;
          margin-right: auto;
        }
        .process-step {
          padding: 6px 0;
          font-size: 0.9rem;
          opacity: 0.5;
        }
        .process-step.active {
          opacity: 1;
        }

        @media (max-width: 900px) {
          .payment-layout {
            grid-template-columns: 1fr;
          }
          .payment-sidebar {
            position: static;
            order: -1;
          }
          .online-methods {
            grid-template-columns: repeat(2, 1fr);
          }
          .bank-grid, .wallet-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
