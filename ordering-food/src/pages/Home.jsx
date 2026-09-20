import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Clock, Star, ArrowRight, ChevronRight, Truck, Shield, Headphones, Zap } from "lucide-react";
import RestaurantCard from "../components/RestaurantCard";
import FoodCard from "../components/FoodCard";
import { restaurants } from "../data/restaurants";
import { getPopularFoods, getBestsellerFoods } from "../data/foods";

const cuisines = [
  { name: "Indian", icon: "🍛", color: "#FF6B35" },
  { name: "Italian", icon: "🍕", color: "#22C55E" },
  { name: "Chinese", icon: "🥡", color: "#FFC857" },
  { name: "Burgers", icon: "🍔", color: "#8B5CF6" },
  { name: "Biryani", icon: "🍚", color: "#3B82F6" },
  { name: "Desserts", icon: "🍰", color: "#EC4899" },
  { name: "Healthy", icon: "🥗", color: "#10B981" },
  { name: "Mexican", icon: "🌮", color: "#F59E0B" },
];

const testimonials = [
  {
    name: "Priya Sharma",
    avatar: "PS",
    rating: 5,
    text: "FoodDash has completely changed how I order food. The delivery is always on time and the food quality is amazing!",
    location: "Koramangala",
  },
  {
    name: "Rahul Verma",
    avatar: "RV",
    rating: 5,
    text: "Best food delivery app I've used. The UI is beautiful and the variety of restaurants is incredible.",
    location: "Indiranagar",
  },
  {
    name: "Anjali Patel",
    avatar: "AP",
    rating: 5,
    text: "Love the coupon system! I save so much every time I order. The tracking feature is also really cool.",
    location: "HSR Layout",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const popularFoods = getPopularFoods();
  const bestsellerFoods = getBestsellerFoods();
  const featuredRestaurants = restaurants.filter((r) => r.featured);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge">
              <Zap size={14} /> #1 Food Delivery in Bangalore
            </span>
            <h1 className="hero-title">
              Good Food.
              <br />
              <span className="hero-highlight">Delivered Fast.</span>
            </h1>
            <p className="hero-subtitle">
              Discover delicious meals from your favorite restaurants and get them
              delivered to your doorstep.
            </p>
            <form className="hero-search" onSubmit={handleSearch}>
              <div className="hero-search-inner">
                <Search size={20} className="hero-search-icon" />
                <input
                  type="text"
                  placeholder="Search for food, restaurants, cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </div>
            </form>
            <div className="hero-ctas">
              <Link to="/restaurants" className="btn btn-primary btn-lg">
                Explore Food <ArrowRight size={18} />
              </Link>
              <Link to="/offers" className="btn btn-secondary btn-lg">
                View Offers
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-num">500+</span>
                <span className="hero-stat-label">Restaurants</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">10K+</span>
                <span className="hero-stat-label">Happy Customers</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">30 min</span>
                <span className="hero-stat-label">Avg. Delivery</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card hero-card-1">
              <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop" alt="Delicious food" />
              <div className="hero-card-overlay">
                <span className="hero-card-tag">🔥 Trending</span>
              </div>
            </div>
            <div className="hero-card hero-card-2">
              <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=250&h=250&fit=crop" alt="Pizza" />
              <div className="hero-card-overlay">
                <div className="hero-card-info">
                  <Star size={14} fill="currentColor" />
                  <span>4.8</span>
                </div>
              </div>
            </div>
            <div className="hero-card hero-card-3">
              <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop" alt="Burger" />
            </div>
            <div className="hero-floating-badge">
              <Clock size={16} />
              <span>25 min delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cuisines */}
      <section className="page-section cuisines-section">
        <div className="container">
          <div className="section-title">
            <h2>Explore by Cuisine</h2>
            <p>Find your favorite cuisine from our curated collection</p>
          </div>
          <div className="cuisines-grid">
            {cuisines.map((c) => (
              <Link
                key={c.name}
                to={`/search?q=${c.name}`}
                className="cuisine-card"
              >
                <div className="cuisine-icon" style={{ background: `${c.color}15` }}>
                  <span>{c.icon}</span>
                </div>
                <span className="cuisine-name">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="page-section trending-section">
        <div className="container">
          <div className="section-title">
            <h2>Trending Dishes</h2>
            <p>Most ordered dishes in your area right now</p>
          </div>
          <div className="foods-grid">
            {popularFoods.slice(0, 4).map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Restaurants */}
      <section className="page-section restaurants-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Top Restaurants</h2>
              <p>Handpicked restaurants loved by our customers</p>
            </div>
            <Link to="/restaurants" className="view-all-link">
              View All <ChevronRight size={18} />
            </Link>
          </div>
          <div className="restaurants-grid">
            {featuredRestaurants.slice(0, 4).map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Offers */}
      <section className="page-section offers-section">
        <div className="container">
          <div className="section-title">
            <h2>Best Offers</h2>
            <p>Save more with our exclusive deals</p>
          </div>
          <div className="offers-grid">
            <div className="offer-card offer-card-1">
              <div className="offer-content">
                <span className="offer-badge">Limited Time</span>
                <h3>50% OFF</h3>
                <p>On your first order. Use code WELCOME50</p>
                <Link to="/restaurants" className="btn btn-primary">Order Now</Link>
              </div>
            </div>
            <div className="offer-card offer-card-2">
              <div className="offer-content">
                <span className="offer-badge">Free Delivery</span>
                <h3>₹0 Delivery</h3>
                <p>On orders above ₹300</p>
                <Link to="/restaurants" className="btn btn-primary">Explore</Link>
              </div>
            </div>
            <div className="offer-card offer-card-3">
              <div className="offer-content">
                <span className="offer-badge">Combo Deal</span>
                <h3>Buy 1 Get 1</h3>
                <p>On selected restaurants</p>
                <Link to="/restaurants" className="btn btn-primary">View</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="page-section">
        <div className="container">
          <div className="section-title">
            <h2>Bestsellers</h2>
            <p>Most loved dishes across all restaurants</p>
          </div>
          <div className="foods-grid">
            {bestsellerFoods.slice(0, 4).map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="page-section how-section">
        <div className="container">
          <div className="section-title">
            <h2>How It Works</h2>
            <p>Ordering food has never been easier</p>
          </div>
          <div className="how-grid">
            <div className="how-card">
              <div className="how-icon">
                <Search size={28} />
              </div>
              <h3>Browse</h3>
              <p>Explore restaurants and menus near you</p>
            </div>
            <div className="how-connector">→</div>
            <div className="how-card">
              <div className="how-icon">
                <Truck size={28} />
              </div>
              <h3>Order</h3>
              <p>Select your favorite dishes and customize</p>
            </div>
            <div className="how-connector">→</div>
            <div className="how-card">
              <div className="how-icon">
                <Shield size={28} />
              </div>
              <h3>Pay</h3>
              <p>Secure payment or cash on delivery</p>
            </div>
            <div className="how-connector">→</div>
            <div className="how-card">
              <div className="how-icon">
                <Headphones size={28} />
              </div>
              <h3>Enjoy</h3>
              <p>Track your order and enjoy your meal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="page-section testimonials-section">
        <div className="container">
          <div className="section-title">
            <h2>What Our Customers Say</h2>
            <p>Trusted by thousands of happy food lovers</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.avatar}</div>
                  <div>
                    <span className="testimonial-name">{t.name}</span>
                    <span className="testimonial-location">{t.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="page-section newsletter-section">
        <div className="container">
          <div className="newsletter-card">
            <h2>Get Exclusive Offers</h2>
            <p>Subscribe to our newsletter and never miss a deal</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: 80px;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--cream) 0%, #fff5eb 50%, #fff0e0 100%);
          z-index: 0;
        }
        .hero-content {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(255, 107, 53, 0.1);
          color: var(--coral);
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 20px;
          animation: fadeInDown 0.6s ease;
        }
        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          color: var(--navy);
          margin-bottom: 16px;
          line-height: 1.1;
          animation: fadeInUp 0.6s ease 0.1s both;
        }
        .hero-highlight {
          background: linear-gradient(135deg, var(--coral), var(--golden));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-subtitle {
          font-size: 1.15rem;
          color: var(--gray-500);
          margin-bottom: 32px;
          max-width: 480px;
          line-height: 1.7;
          animation: fadeInUp 0.6s ease 0.2s both;
        }
        .hero-search {
          margin-bottom: 24px;
          animation: fadeInUp 0.6s ease 0.3s both;
        }
        .hero-search-inner {
          display: flex;
          align-items: center;
          background: var(--white);
          border-radius: var(--radius-full);
          padding: 6px 6px 6px 20px;
          box-shadow: var(--shadow-lg);
          border: 2px solid var(--gray-100);
          transition: border-color var(--transition-fast);
        }
        .hero-search-inner:focus-within {
          border-color: var(--coral);
        }
        .hero-search-icon {
          color: var(--gray-400);
          flex-shrink: 0;
        }
        .hero-search input {
          flex: 1;
          border: none;
          padding: 12px 16px;
          font-size: 1rem;
          background: transparent;
          min-width: 0;
        }
        .hero-ctas {
          display: flex;
          gap: 12px;
          margin-bottom: 40px;
          animation: fadeInUp 0.6s ease 0.4s both;
        }
        .hero-stats {
          display: flex;
          gap: 40px;
          animation: fadeInUp 0.6s ease 0.5s both;
        }
        .hero-stat-num {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--navy);
        }
        .hero-stat-label {
          font-size: 0.85rem;
          color: var(--gray-500);
        }
        .hero-visual {
          position: relative;
          height: 450px;
          animation: fadeIn 0.8s ease 0.3s both;
        }
        .hero-card {
          position: absolute;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-2xl);
        }
        .hero-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hero-card-1 {
          width: 300px;
          height: 300px;
          top: 20px;
          left: 40px;
          animation: float 4s ease-in-out infinite;
        }
        .hero-card-2 {
          width: 200px;
          height: 200px;
          top: 60px;
          right: 40px;
          animation: float 4s ease-in-out infinite 1s;
        }
        .hero-card-3 {
          width: 160px;
          height: 160px;
          bottom: 40px;
          left: 80px;
          animation: float 4s ease-in-out infinite 2s;
        }
        .hero-card-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          padding: 16px;
          background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
        }
        .hero-card-tag {
          background: var(--white);
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
        }
        .hero-card-info {
          display: flex;
          align-items: center;
          gap: 4px;
          background: var(--white);
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 700;
        }
        .hero-card-info svg {
          color: var(--golden);
        }
        .hero-floating-badge {
          position: absolute;
          bottom: 80px;
          right: 20px;
          background: var(--white);
          padding: 10px 16px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: var(--shadow-lg);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--navy);
          animation: float 3s ease-in-out infinite 0.5s;
        }

        .cuisines-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 16px;
        }
        .cuisine-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 20px 12px;
          border-radius: var(--radius-lg);
          background: var(--white);
          transition: all var(--transition-base);
          text-decoration: none;
          color: inherit;
          box-shadow: var(--shadow-sm);
        }
        .cuisine-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        .cuisine-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
        }
        .cuisine-name {
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--navy);
        }

        .foods-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 32px;
        }
        .section-header h2 {
          color: var(--navy);
          margin-bottom: 4px;
        }
        .section-header p {
          color: var(--gray-500);
        }
        .view-all-link {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--coral);
          font-weight: 600;
          text-decoration: none;
          transition: gap var(--transition-fast);
        }
        .view-all-link:hover {
          gap: 8px;
        }

        .restaurants-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .offers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .offer-card {
          border-radius: var(--radius-xl);
          padding: 32px;
          min-height: 200px;
          display: flex;
          align-items: flex-end;
          position: relative;
          overflow: hidden;
          transition: transform var(--transition-base);
        }
        .offer-card:hover {
          transform: translateY(-4px);
        }
        .offer-card-1 {
          background: linear-gradient(135deg, #FF6B35, #FF8F5C);
          color: white;
        }
        .offer-card-2 {
          background: linear-gradient(135deg, #101828, #1a2a3e);
          color: white;
        }
        .offer-card-3 {
          background: linear-gradient(135deg, #22C55E, #16A34A);
          color: white;
        }
        .offer-content h3 {
          font-size: 2rem;
          margin-bottom: 8px;
        }
        .offer-content p {
          opacity: 0.9;
          margin-bottom: 16px;
        }
        .offer-badge {
          display: inline-block;
          padding: 4px 10px;
          background: rgba(255,255,255,0.2);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .how-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        .how-card {
          text-align: center;
          padding: 32px 24px;
          border-radius: var(--radius-xl);
          background: var(--white);
          box-shadow: var(--shadow-md);
          flex: 1;
          max-width: 220px;
          transition: transform var(--transition-base);
        }
        .how-card:hover {
          transform: translateY(-4px);
        }
        .how-icon {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          background: linear-gradient(135deg, var(--coral), var(--golden));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin: 0 auto 16px;
        }
        .how-card h3 {
          margin-bottom: 8px;
          color: var(--navy);
        }
        .how-card p {
          font-size: 0.85rem;
          color: var(--gray-500);
        }
        .how-connector {
          font-size: 1.5rem;
          color: var(--gray-300);
          flex-shrink: 0;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .testimonial-card {
          background: var(--white);
          border-radius: var(--radius-xl);
          padding: 28px;
          box-shadow: var(--shadow-md);
          transition: transform var(--transition-base);
        }
        .testimonial-card:hover {
          transform: translateY(-4px);
        }
        .testimonial-stars {
          display: flex;
          gap: 2px;
          color: var(--golden);
          margin-bottom: 16px;
        }
        .testimonial-text {
          font-size: 0.95rem;
          color: var(--gray-600);
          line-height: 1.7;
          margin-bottom: 20px;
        }
        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .testimonial-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--coral), var(--golden));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.85rem;
        }
        .testimonial-name {
          display: block;
          font-weight: 600;
          color: var(--navy);
          font-size: 0.9rem;
        }
        .testimonial-location {
          font-size: 0.8rem;
          color: var(--gray-400);
        }

        .newsletter-card {
          background: linear-gradient(135deg, var(--navy), var(--navy-light));
          border-radius: var(--radius-xl);
          padding: 60px;
          text-align: center;
          color: white;
        }
        .newsletter-card h2 {
          margin-bottom: 8px;
        }
        .newsletter-card p {
          color: var(--gray-400);
          margin-bottom: 24px;
        }
        .newsletter-form {
          display: flex;
          max-width: 440px;
          margin: 0 auto;
          gap: 8px;
        }
        .newsletter-form input {
          flex: 1;
          padding: 14px 20px;
          border: 2px solid rgba(255,255,255,0.15);
          border-radius: var(--radius-full);
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 0.95rem;
        }
        .newsletter-form input::placeholder {
          color: var(--gray-400);
        }
        .newsletter-form input:focus {
          border-color: var(--coral);
        }

        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-subtitle {
            margin: 0 auto 32px;
          }
          .hero-ctas {
            justify-content: center;
          }
          .hero-stats {
            justify-content: center;
          }
          .hero-visual {
            display: none;
          }
          .foods-grid, .restaurants-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .cuisines-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .how-grid {
            flex-wrap: wrap;
          }
          .how-connector {
            display: none;
          }
        }
        @media (max-width: 768px) {
          .foods-grid, .restaurants-grid {
            grid-template-columns: 1fr;
          }
          .offers-grid {
            grid-template-columns: 1fr;
          }
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
          .cuisines-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .hero-search-inner {
            flex-direction: column;
            border-radius: var(--radius-lg);
            padding: 12px;
          }
          .hero-search-inner input {
            width: 100%;
          }
          .hero-ctas {
            flex-direction: column;
          }
          .newsletter-card {
            padding: 40px 20px;
          }
          .newsletter-form {
            flex-direction: column;
          }
        }
        @media (max-width: 480px) {
          .cuisines-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
          }
          .cuisine-card {
            padding: 12px 8px;
          }
          .cuisine-icon {
            width: 44px;
            height: 44px;
            font-size: 1.4rem;
          }
          .how-grid {
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
