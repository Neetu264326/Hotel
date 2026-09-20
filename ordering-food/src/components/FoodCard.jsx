import { useState } from "react";
import { Star } from "lucide-react";
import FoodDetailModal from "./FoodDetailModal";

export default function FoodCard({ food }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="food-card"
        onClick={() => setShowModal(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setShowModal(true)}
        aria-label={`View ${food.name} details`}
      >
        <div className="food-card-image">
          <img src={food.image} alt={food.name} loading="lazy" />
          {food.isBestseller && (
            <span className="food-bestseller-badge">Bestseller</span>
          )}
        </div>

        <div className="food-card-body">
          <div className="food-card-info">
            <div className="food-card-type">
              {food.isVeg ? (
                <span className="veg-indicator" aria-label="Vegetarian" />
              ) : (
                <span className="non-veg-indicator" aria-label="Non-vegetarian" />
              )}
              <h4 className="food-card-name">{food.name}</h4>
            </div>
            <div className="food-card-rating">
              <Star size={12} fill="currentColor" />
              <span>{food.rating}</span>
            </div>
          </div>

          <p className="food-card-desc">{food.description}</p>

          <div className="food-card-footer">
            <div className="food-card-price">
              <span className="food-price">₹{food.price}</span>
              {food.originalPrice > food.price && (
                <span className="food-original-price">₹{food.originalPrice}</span>
              )}
            </div>
            <button
              className="food-add-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              aria-label={`Add ${food.name} to cart`}
            >
              ADD
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <FoodDetailModal food={food} onClose={() => setShowModal(false)} />
      )}

      <style>{`
        .food-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--gray-100);
          transition: all var(--transition-base);
          cursor: pointer;
        }
        .food-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }
        .food-card-image {
          position: relative;
          height: 160px;
          overflow: hidden;
        }
        .food-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }
        .food-card:hover .food-card-image img {
          transform: scale(1.05);
        }
        .food-bestseller-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: var(--golden);
          color: var(--navy);
          padding: 3px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.7rem;
          font-weight: 700;
        }
        .food-card-body {
          padding: 14px;
        }
        .food-card-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }
        .food-card-type {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .food-card-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--navy);
        }
        .food-card-rating {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--navy);
          background: var(--gray-50);
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          flex-shrink: 0;
        }
        .food-card-rating svg {
          color: var(--golden);
        }
        .food-card-desc {
          font-size: 0.8rem;
          color: var(--gray-500);
          line-height: 1.4;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .food-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .food-card-price {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .food-price {
          font-weight: 700;
          color: var(--navy);
          font-size: 1rem;
        }
        .food-original-price {
          font-size: 0.85rem;
          color: var(--gray-400);
          text-decoration: line-through;
        }
        .food-add-btn {
          padding: 6px 20px;
          border: 2px solid var(--green);
          color: var(--green);
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.8rem;
          background: var(--white);
          transition: all var(--transition-fast);
          cursor: pointer;
        }
        .food-add-btn:hover {
          background: var(--green);
          color: white;
        }
      `}</style>
    </>
  );
}
