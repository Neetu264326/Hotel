import { useState, useEffect } from "react";
import { X, Star, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";

export default function FoodDetailModal({ food, onClose }) {
  const [selectedSize, setSelectedSize] = useState(food.sizes?.[0]?.name || "Regular");
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const { addItem } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const toggleAddOn = (addOn) => {
    setSelectedAddOns((prev) =>
      prev.find((a) => a.name === addOn.name)
        ? prev.filter((a) => a.name !== addOn.name)
        : [...prev, addOn]
    );
  };

  const getBasePrice = () => {
    return food.sizes?.find((s) => s.name === selectedSize)?.price || food.price;
  };

  const getAddOnsTotal = () => {
    return selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  };

  const getTotalPrice = () => {
    return (getBasePrice() + getAddOnsTotal()) * quantity;
  };

  const handleAddToCart = () => {
    addItem(
      {
        ...food,
        selectedSize,
        selectedAddOns,
        specialInstructions,
        quantity,
        basePrice: getBasePrice(),
      },
      food.restaurantId,
      food.restaurantName || "Restaurant"
    );
    addToast(`${food.name} added to cart!`, "success");
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        className="food-modal"
        role="dialog"
        aria-label={`${food.name} details`}
        aria-modal="true"
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="modal-image">
          <img src={food.image} alt={food.name} />
          {food.isBestseller && (
            <span className="food-bestseller-badge">Bestseller</span>
          )}
        </div>

        <div className="modal-content">
          <div className="modal-header">
            <div>
              <div className="modal-food-type">
                {food.isVeg ? (
                  <span className="veg-indicator" />
                ) : (
                  <span className="non-veg-indicator" />
                )}
                <h2>{food.name}</h2>
              </div>
              <div className="modal-rating">
                <Star size={14} fill="currentColor" />
                <span>{food.rating}</span>
                <span className="review-count">({food.reviews} reviews)</span>
              </div>
            </div>
          </div>

          <p className="modal-description">{food.description}</p>

          <div className="modal-meta">
            <span>🔥 {food.calories} cal</span>
            <span>⏱ {food.prepTime}</span>
            <span>🌶️ {food.spicyLevel === 0 ? "Mild" : food.spicyLevel === 1 ? "Medium" : food.spicyLevel === 2 ? "Spicy" : "Very Spicy"}</span>
          </div>

          {food.sizes?.length > 0 && (
            <div className="modal-section">
              <h3>Choose Size</h3>
              <div className="size-options">
                {food.sizes.map((size) => (
                  <button
                    key={size.name}
                    className={`size-option ${selectedSize === size.name ? "active" : ""}`}
                    onClick={() => setSelectedSize(size.name)}
                  >
                    <span className="size-name">{size.name}</span>
                    <span className="size-price">₹{size.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {food.addOns?.length > 0 && (
            <div className="modal-section">
              <h3>Add-ons</h3>
              <div className="addons-grid">
                {food.addOns.map((addOn) => (
                  <button
                    key={addOn.name}
                    className={`addon-option ${selectedAddOns.find((a) => a.name === addOn.name) ? "active" : ""}`}
                    onClick={() => toggleAddOn(addOn)}
                  >
                    <span className="addon-name">{addOn.name}</span>
                    <span className="addon-price">+₹{addOn.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="modal-section">
            <h3>Special Instructions</h3>
            <textarea
              className="special-instructions"
              placeholder="e.g., Less spicy, No onions, Extra sauce..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={2}
            />
          </div>

          <div className="modal-footer">
            <div className="quantity-selector">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity">
                <Plus size={16} />
              </button>
            </div>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart — ₹{getTotalPrice()}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 2000;
          animation: fadeIn 0.2s ease;
        }
        .food-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 560px;
          max-height: 90vh;
          background: var(--white);
          border-radius: var(--radius-xl);
          z-index: 2001;
          overflow-y: auto;
          animation: scaleIn 0.3s ease;
        }
        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          cursor: pointer;
          transition: all var(--transition-fast);
          border: none;
        }
        .modal-close:hover {
          background: rgba(0, 0, 0, 0.7);
        }
        .modal-image {
          position: relative;
          height: 240px;
          overflow: hidden;
        }
        .modal-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .modal-content {
          padding: 24px;
        }
        .modal-header {
          margin-bottom: 12px;
        }
        .modal-food-type {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }
        .modal-food-type h2 {
          font-size: 1.4rem;
          color: var(--navy);
        }
        .modal-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .modal-rating svg {
          color: var(--golden);
        }
        .review-count {
          color: var(--gray-400);
          font-weight: 400;
        }
        .modal-description {
          color: var(--gray-500);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .modal-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
          font-size: 0.85rem;
          color: var(--gray-600);
        }
        .modal-section {
          margin-bottom: 20px;
        }
        .modal-section h3 {
          font-size: 0.95rem;
          color: var(--navy);
          margin-bottom: 12px;
        }
        .size-options {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .size-option {
          padding: 10px 16px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-md);
          background: var(--white);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          min-width: 100px;
        }
        .size-option:hover {
          border-color: var(--coral);
        }
        .size-option.active {
          border-color: var(--coral);
          background: rgba(255, 107, 53, 0.05);
        }
        .size-name {
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--navy);
        }
        .size-price {
          font-size: 0.8rem;
          color: var(--gray-500);
        }
        .addons-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }
        .addon-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-md);
          background: var(--white);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .addon-option:hover {
          border-color: var(--coral);
        }
        .addon-option.active {
          border-color: var(--coral);
          background: rgba(255, 107, 53, 0.05);
        }
        .addon-name {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--navy);
        }
        .addon-price {
          font-size: 0.8rem;
          color: var(--green);
          font-weight: 600;
        }
        .special-instructions {
          width: 100%;
          padding: 12px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          resize: none;
          transition: border-color var(--transition-fast);
        }
        .special-instructions:focus {
          border-color: var(--coral);
        }
        .modal-footer {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--gray-100);
        }
        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-full);
          padding: 4px;
        }
        .quantity-selector button {
          width: 32px;
          height: 32px;
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
        .quantity-selector button:hover:not(:disabled) {
          background: var(--coral);
          color: white;
        }
        .quantity-selector button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .quantity-selector span {
          font-weight: 700;
          font-size: 1rem;
          min-width: 20px;
          text-align: center;
        }
        .add-to-cart-btn {
          flex: 1;
          padding: 14px 24px;
          background: linear-gradient(135deg, var(--green), var(--green-dark));
          color: white;
          border: none;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .add-to-cart-btn:hover {
          box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
          transform: translateY(-1px);
        }
        @media (max-width: 480px) {
          .food-modal {
            width: 100%;
            height: 100%;
            max-height: 100vh;
            border-radius: 0;
            top: 0;
            left: 0;
            transform: none;
          }
          .addons-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
