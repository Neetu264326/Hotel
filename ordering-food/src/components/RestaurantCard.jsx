import { Link } from "react-router-dom";
import { Star, Clock, Truck } from "lucide-react";

export default function RestaurantCard({ restaurant }) {
  return (
    <>
      <Link
        to={`/restaurant/${restaurant.id}`}
        className="restaurant-card"
        aria-label={`View ${restaurant.name} menu`}
      >
        <div className="restaurant-card-image">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            loading="lazy"
          />
          <div className="restaurant-card-overlay" />
          {restaurant.discount > 0 && (
            <span className="restaurant-discount-badge">
              {restaurant.discountText || `${restaurant.discount}% OFF`}
            </span>
          )}
          {restaurant.isPureVeg && (
            <span className="veg-badge-small">PURE VEG</span>
          )}
          <div className="restaurant-card-rating">
            <Star size={14} fill="currentColor" />
            <span>{restaurant.rating}</span>
          </div>
        </div>

        <div className="restaurant-card-body">
          <div className="restaurant-card-header">
            <h3 className="restaurant-card-name">{restaurant.name}</h3>
            <p className="restaurant-card-cuisine">{restaurant.cuisine}</p>
          </div>

          <div className="restaurant-card-meta">
            <span className="meta-item">
              <Clock size={14} />
              {restaurant.deliveryTime}
            </span>
            <span className="meta-item">
              <Truck size={14} />
              ₹{restaurant.deliveryFee}
            </span>
            <span className="meta-price">
              {"₹".repeat(restaurant.priceRange)}
            </span>
          </div>

          <p className="restaurant-card-reviews">
            {restaurant.reviews.toLocaleString()}+ ratings
          </p>
        </div>
      </Link>

      <style>{`
        .restaurant-card {
          display: block;
          background: var(--white);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: all var(--transition-base);
          text-decoration: none;
          color: inherit;
        }
        .restaurant-card:hover {
          box-shadow: var(--shadow-xl);
          transform: translateY(-4px);
        }
        .restaurant-card-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        .restaurant-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }
        .restaurant-card:hover .restaurant-card-image img {
          transform: scale(1.05);
        }
        .restaurant-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%);
        }
        .restaurant-discount-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: var(--green);
          color: white;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 700;
        }
        .veg-badge-small {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(34,197,94,0.9);
          color: white;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .restaurant-card-rating {
          position: absolute;
          bottom: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--white);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--navy);
        }
        .restaurant-card-rating svg {
          color: var(--golden);
        }
        .restaurant-card-body {
          padding: 16px;
        }
        .restaurant-card-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--navy);
          margin-bottom: 2px;
        }
        .restaurant-card-cuisine {
          font-size: 0.85rem;
          color: var(--gray-500);
          margin-bottom: 12px;
        }
        .restaurant-card-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: var(--gray-600);
        }
        .meta-price {
          color: var(--green);
          font-weight: 700;
          font-size: 0.85rem;
        }
        .restaurant-card-reviews {
          font-size: 0.8rem;
          color: var(--gray-400);
        }
      `}</style>
    </>
  );
}
