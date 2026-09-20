import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";
import FoodCard from "../components/FoodCard";
import RestaurantCard from "../components/RestaurantCard";
import { searchFoods } from "../data/foods";
import { searchRestaurants } from "../data/restaurants";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("foods");

  const results = useMemo(() => {
    if (!query.trim()) return { foods: [], restaurants: [] };
    return {
      foods: searchFoods(query),
      restaurants: searchRestaurants(query),
    };
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: query });
  };

  const totalResults = results.foods.length + results.restaurants.length;

  return (
    <div className="page-wrapper">
      <div className="search-page">
        <div className="container">
          <div className="search-header">
            <h1>Search</h1>
          </div>

          <form className="search-bar-large" onSubmit={handleSearch}>
            <SearchIcon size={20} />
            <input
              type="text"
              placeholder="Search for food, restaurants, cuisines..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button
                type="button"
                className="clear-btn"
                onClick={() => {
                  setQuery("");
                  setSearchParams({});
                }}
              >
                <X size={18} />
              </button>
            )}
          </form>

          {query && (
            <p className="search-results-count">
              {totalResults} result{totalResults !== 1 ? "s" : ""} for "{query}"
            </p>
          )}

          <div className="search-tabs">
            <button
              className={`search-tab ${activeTab === "foods" ? "active" : ""}`}
              onClick={() => setActiveTab("foods")}
            >
              Foods ({results.foods.length})
            </button>
            <button
              className={`search-tab ${activeTab === "restaurants" ? "active" : ""}`}
              onClick={() => setActiveTab("restaurants")}
            >
              Restaurants ({results.restaurants.length})
            </button>
          </div>

          {activeTab === "foods" && (
            <div className="search-results-grid">
              {results.foods.length > 0 ? (
                results.foods.map((food) => <FoodCard key={food.id} food={food} />)
              ) : (
                <div className="empty-state">
                  <div className="empty-state-emoji">🔍</div>
                  <h3>No foods found</h3>
                  <p>Try searching for something else</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "restaurants" && (
            <div className="search-results-grid">
              {results.restaurants.length > 0 ? (
                results.restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)
              ) : (
                <div className="empty-state">
                  <div className="empty-state-emoji">🏪</div>
                  <h3>No restaurants found</h3>
                  <p>Try searching for something else</p>
                </div>
              )}
            </div>
          )}

          {!query && (
            <div className="search-suggestions">
              <h3>Popular Searches</h3>
              <div className="suggestion-tags">
                {["Pizza", "Burger", "Biryani", "Chinese", "Desserts", "Healthy", "Indian", "Italian"].map((tag) => (
                  <button
                    key={tag}
                    className="suggestion-tag"
                    onClick={() => {
                      setQuery(tag);
                      setSearchParams({ q: tag });
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .search-page {
          padding-top: 100px;
          padding-bottom: 60px;
          min-height: 100vh;
        }
        .search-header {
          margin-bottom: 24px;
        }
        .search-header h1 {
          color: var(--navy);
        }
        .search-bar-large {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--white);
          padding: 16px 24px;
          border-radius: var(--radius-full);
          border: 2px solid var(--gray-200);
          margin-bottom: 24px;
          transition: border-color var(--transition-fast);
        }
        .search-bar-large:focus-within {
          border-color: var(--coral);
        }
        .search-bar-large svg {
          color: var(--gray-400);
          flex-shrink: 0;
        }
        .search-bar-large input {
          flex: 1;
          border: none;
          font-size: 1.05rem;
          background: transparent;
        }
        .clear-btn {
          background: none;
          color: var(--gray-400);
          cursor: pointer;
          padding: 4px;
        }
        .clear-btn:hover {
          color: var(--red);
        }
        .search-results-count {
          color: var(--gray-500);
          margin-bottom: 20px;
          font-size: 0.9rem;
        }
        .search-tabs {
          display: flex;
          gap: 4px;
          margin-bottom: 24px;
          border-bottom: 2px solid var(--gray-100);
        }
        .search-tab {
          padding: 12px 20px;
          border: none;
          background: none;
          color: var(--gray-500);
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          position: relative;
          transition: color var(--transition-fast);
        }
        .search-tab.active {
          color: var(--coral);
        }
        .search-tab.active::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--coral);
        }
        .search-results-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .search-suggestions {
          text-align: center;
          padding: 60px 20px;
        }
        .search-suggestions h3 {
          color: var(--navy);
          margin-bottom: 16px;
        }
        .suggestion-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }
        .suggestion-tag {
          padding: 10px 20px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-full);
          background: var(--white);
          color: var(--gray-600);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .suggestion-tag:hover {
          border-color: var(--coral);
          color: var(--coral);
        }
        @media (max-width: 768px) {
          .search-results-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
