import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import RestaurantCard from "../components/RestaurantCard";
import { restaurants } from "../data/restaurants";

const cuisineFilters = ["All", "Indian", "Italian", "Chinese", "American", "Hyderabadi", "Desserts", "Healthy"];
const sortOptions = ["Recommended", "Rating", "Fastest Delivery", "Price: Low to High", "Price: High to Low"];

export default function Restaurants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [sortBy, setSortBy] = useState("Recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    rating: 0,
    vegetarian: false,
    offers: false,
    priceRange: [1, 3],
  });

  const filteredRestaurants = useMemo(() => {
    let result = [...restaurants];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q) ||
          r.cuisineType.some((c) => c.toLowerCase().includes(q))
      );
    }

    if (selectedCuisine !== "All") {
      result = result.filter((r) =>
        r.cuisineType.some((c) => c.toLowerCase().includes(selectedCuisine.toLowerCase()))
      );
    }

    if (filters.rating > 0) {
      result = result.filter((r) => r.rating >= filters.rating);
    }

    if (filters.vegetarian) {
      result = result.filter((r) => r.isPureVeg);
    }

    if (filters.offers) {
      result = result.filter((r) => r.discount > 0);
    }

    switch (sortBy) {
      case "Rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "Fastest Delivery":
        result.sort((a, b) => a.deliveryTimeValue - b.deliveryTimeValue);
        break;
      case "Price: Low to High":
        result.sort((a, b) => a.priceRange - b.priceRange);
        break;
      case "Price: High to Low":
        result.sort((a, b) => b.priceRange - a.priceRange);
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [searchQuery, selectedCuisine, sortBy, filters]);

  return (
    <div className="page-wrapper">
      <div className="restaurants-page">
        <div className="container">
          <div className="restaurants-header">
            <div>
              <h1>Restaurants</h1>
              <p>{filteredRestaurants.length} restaurants near you</p>
            </div>
          </div>

          <div className="restaurants-search-bar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery("")}>
                <X size={16} />
              </button>
            )}
          </div>

          <div className="restaurants-filters-bar">
            <div className="cuisine-filters">
              {cuisineFilters.map((c) => (
                <button
                  key={c}
                  className={`cuisine-filter-btn ${selectedCuisine === c ? "active" : ""}`}
                  onClick={() => setSelectedCuisine(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="filter-actions">
              <button
                className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
              <div className="sort-dropdown">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  {sortOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="advanced-filters">
              <div className="filter-group">
                <label>Minimum Rating</label>
                <div className="rating-filter">
                  {[0, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      className={`rating-filter-btn ${filters.rating === r ? "active" : ""}`}
                      onClick={() => setFilters({ ...filters, rating: r })}
                    >
                      {r === 0 ? "Any" : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <label>
                  <input
                    type="checkbox"
                    checked={filters.vegetarian}
                    onChange={(e) => setFilters({ ...filters, vegetarian: e.target.checked })}
                  />
                  Pure Veg Only
                </label>
              </div>
              <div className="filter-group">
                <label>
                  <input
                    type="checkbox"
                    checked={filters.offers}
                    onChange={(e) => setFilters({ ...filters, offers: e.target.checked })}
                  />
                  With Offers Only
                </label>
              </div>
            </div>
          )}

          {filteredRestaurants.length > 0 ? (
            <div className="restaurants-grid-page">
              {filteredRestaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-emoji">🔍</div>
              <h3>No restaurants found</h3>
              <p>Try adjusting your filters or search query</p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCuisine("All");
                  setFilters({ rating: 0, vegetarian: false, offers: false, priceRange: [1, 3] });
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .restaurants-page {
          padding-top: 100px;
          padding-bottom: 60px;
          min-height: 100vh;
        }
        .restaurants-header {
          margin-bottom: 24px;
        }
        .restaurants-header h1 {
          color: var(--navy);
          margin-bottom: 4px;
        }
        .restaurants-header p {
          color: var(--gray-500);
        }
        .restaurants-search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--white);
          padding: 12px 20px;
          border-radius: var(--radius-full);
          border: 2px solid var(--gray-200);
          margin-bottom: 20px;
          transition: border-color var(--transition-fast);
        }
        .restaurants-search-bar:focus-within {
          border-color: var(--coral);
        }
        .restaurants-search-bar input {
          flex: 1;
          border: none;
          font-size: 1rem;
          background: transparent;
        }
        .clear-search {
          background: none;
          color: var(--gray-400);
          cursor: pointer;
        }
        .restaurants-filters-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .cuisine-filters {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
          flex: 1;
        }
        .cuisine-filter-btn {
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
        .cuisine-filter-btn:hover {
          border-color: var(--coral);
          color: var(--coral);
        }
        .cuisine-filter-btn.active {
          background: var(--coral);
          border-color: var(--coral);
          color: white;
        }
        .filter-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .filter-toggle-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-full);
          background: var(--white);
          color: var(--gray-600);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .filter-toggle-btn:hover, .filter-toggle-btn.active {
          border-color: var(--coral);
          color: var(--coral);
        }
        .sort-dropdown {
          position: relative;
        }
        .sort-dropdown select {
          appearance: none;
          padding: 8px 32px 8px 16px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-full);
          background: var(--white);
          color: var(--gray-600);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
        }
        .sort-dropdown select:focus {
          border-color: var(--coral);
        }
        .sort-dropdown svg {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--gray-400);
        }
        .advanced-filters {
          display: flex;
          gap: 24px;
          padding: 16px 20px;
          background: var(--white);
          border-radius: var(--radius-md);
          margin-bottom: 24px;
          animation: fadeIn 0.2s ease;
          flex-wrap: wrap;
        }
        .filter-group label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--gray-700);
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        .rating-filter {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        .rating-filter-btn {
          padding: 6px 14px;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-full);
          background: var(--white);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .rating-filter-btn.active {
          background: var(--coral);
          color: white;
          border-color: var(--coral);
        }
        .restaurants-grid-page {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .restaurants-grid-page {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .restaurants-grid-page {
            grid-template-columns: 1fr;
          }
          .filter-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
}
