import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Clock, Truck, ChevronLeft, Info } from "lucide-react";
import FoodCard from "../components/FoodCard";
import { getRestaurantById } from "../data/restaurants";
import { getFoodsByRestaurant, getFoodCategories } from "../data/foods";

export default function RestaurantDetails() {
  const { id } = useParams();
  const restaurant = getRestaurantById(id);
  const foods = getFoodsByRestaurant(id);
  const categories = getFoodCategories(id);
  const [activeCategory, setActiveCategory] = useState(categories[0] || "Recommended");

  if (!restaurant) {
    return (
      <div className="page-wrapper">
        <div className="empty-state" style={{ paddingTop: 120 }}>
          <div className="empty-state-emoji">🍔</div>
          <h3>Restaurant not found</h3>
          <p>The restaurant you're looking for doesn't exist.</p>
          <Link to="/restaurants" className="btn btn-primary">Browse Restaurants</Link>
        </div>
      </div>
    );
  }

  const filteredFoods = useMemo(() => {
    if (activeCategory === "Recommended") {
      return foods.filter((f) => f.isBestseller || f.isPopular);
    }
    return foods.filter((f) => f.category === activeCategory);
  }, [activeCategory, foods]);

  return (
    <div className="page-wrapper">
      <div className="restaurant-details-page">
        <div className="restaurant-cover">
          <img src={restaurant.image} alt={restaurant.name} />
          <div className="restaurant-cover-overlay" />
          <Link to="/restaurants" className="back-btn">
            <ChevronLeft size={20} />
          </Link>
        </div>

        <div className="container">
          <div className="restaurant-info-card">
            <div className="restaurant-info-main">
              <div className="restaurant-info-left">
                <div className="restaurant-logo">
                  <img src={restaurant.logo} alt={restaurant.name} />
                </div>
                <div>
                  <h1>{restaurant.name}</h1>
                  <p className="restaurant-cuisine">{restaurant.cuisineType.join(" • ")}</p>
                </div>
              </div>
              <div className="restaurant-info-right">
                <div className="restaurant-rating-large">
                  <Star size={20} fill="currentColor" />
                  <span>{restaurant.rating}</span>
                  <span className="review-count">({restaurant.reviews.toLocaleString()} ratings)</span>
                </div>
              </div>
            </div>

            <div className="restaurant-meta-row">
              <span className="meta-pill">
                <Clock size={16} />
                {restaurant.deliveryTime}
              </span>
              <span className="meta-pill">
                <Truck size={16} />
                ₹{restaurant.deliveryFee} delivery
              </span>
              <span className="meta-pill">
                ₹{restaurant.minOrder} minimum
              </span>
              {restaurant.discount > 0 && (
                <span className="meta-pill offer-pill">
                  <Info size={16} />
                  {restaurant.discountText}
                </span>
              )}
            </div>

            <p className="restaurant-description">{restaurant.description}</p>
          </div>

          <div className="menu-section">
            <div className="category-nav">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-nav-btn ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h2 className="menu-title">{activeCategory}</h2>

            <div className="menu-grid">
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food) => (
                  <FoodCard key={food.id} food={{ ...food, restaurantName: restaurant.name }} />
                ))
              ) : (
                <div className="empty-state">
                  <p>No items in this category</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .restaurant-details-page {
          padding-bottom: 60px;
        }
        .restaurant-cover {
          position: relative;
          height: 300px;
          margin-top: 70px;
          overflow: hidden;
        }
        .restaurant-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .restaurant-cover-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
        }
        .back-btn {
          position: absolute;
          top: 16px;
          left: 16px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(0,0,0,0.4);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          backdrop-filter: blur(10px);
          transition: background var(--transition-fast);
        }
        .back-btn:hover {
          background: rgba(0,0,0,0.6);
        }
        .restaurant-info-card {
          background: var(--white);
          border-radius: var(--radius-xl);
          padding: 24px;
          margin-top: -40px;
          position: relative;
          z-index: 1;
          box-shadow: var(--shadow-lg);
        }
        .restaurant-info-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .restaurant-info-left {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .restaurant-logo {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-md);
          overflow: hidden;
          flex-shrink: 0;
        }
        .restaurant-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .restaurant-info-left h1 {
          font-size: 1.5rem;
          color: var(--navy);
          margin-bottom: 4px;
        }
        .restaurant-cuisine {
          color: var(--gray-500);
          font-size: 0.9rem;
        }
        .restaurant-rating-large {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--green);
          color: white;
          padding: 6px 12px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 1rem;
        }
        .restaurant-rating-large svg {
          color: white;
        }
        .review-count {
          font-weight: 400;
          font-size: 0.8rem;
          opacity: 0.9;
        }
        .restaurant-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 16px;
        }
        .meta-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--gray-100);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          color: var(--gray-600);
        }
        .offer-pill {
          background: rgba(255, 107, 53, 0.1);
          color: var(--coral);
        }
        .restaurant-description {
          color: var(--gray-500);
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .menu-section {
          margin-top: 32px;
        }
        .category-nav {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 8px;
          margin-bottom: 24px;
          position: sticky;
          top: 70px;
          background: var(--cream);
          padding-top: 12px;
          z-index: 10;
        }
        .category-nav-btn {
          padding: 8px 18px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-full);
          background: var(--white);
          color: var(--gray-600);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }
        .category-nav-btn:hover {
          border-color: var(--coral);
          color: var(--coral);
        }
        .category-nav-btn.active {
          background: var(--coral);
          border-color: var(--coral);
          color: white;
        }
        .menu-title {
          font-size: 1.3rem;
          color: var(--navy);
          margin-bottom: 20px;
        }
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (max-width: 768px) {
          .restaurant-cover {
            height: 200px;
          }
          .restaurant-info-main {
            flex-direction: column;
            gap: 12px;
          }
          .restaurant-info-left h1 {
            font-size: 1.2rem;
          }
          .menu-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
