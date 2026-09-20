import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Store,
  Tag,
  Info,
  Search,
  MapPin,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  LogIn,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/restaurants", label: "Restaurants", icon: Store },
  { to: "/offers", label: "Offers", icon: Tag },
  { to: "/about", label: "About", icon: Info },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchFocused(false);
    }
  };

  return (
    <>
      <nav
        className={`navbar ${isScrolled ? "navbar-scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="navbar-inner container">
          <Link to="/" className="navbar-logo" aria-label="FoodDash Home">
            <div className="logo-icon">
              <span className="logo-letter">F</span>
            </div>
            <span className="logo-text">
              Food<span className="logo-highlight">Dash</span>
            </span>
          </Link>

          <div className={`navbar-links ${isMobileOpen ? "open" : ""}`}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${
                  location.pathname === link.to ? "active" : ""
                }`}
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <form
            className={`navbar-search ${isSearchFocused ? "focused" : ""}`}
            onSubmit={handleSearch}
          >
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search food or restaurants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              aria-label="Search food or restaurants"
            />
          </form>

          <div className="navbar-actions">
            <button className="nav-action-btn location-btn" aria-label="Select location">
              <MapPin size={18} />
              <span className="location-text">Bangalore</span>
              <ChevronDown size={14} />
            </button>

            <Link to="/cart" className="nav-action-btn cart-btn" aria-label={`Cart with ${itemCount} items`}>
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
              )}
            </Link>

            {user ? (
              <div className="user-menu-wrap">
                <button
                  className="nav-action-btn profile-btn"
                  aria-label="Profile"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <User size={20} />
                  <span className="user-name-text">{user.name.split(" ")[0]}</span>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <button
                      className="user-dropdown-item logout"
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        navigate("/");
                      }}
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-action-btn profile-btn login-btn">
                <LogIn size={18} />
                <span className="login-text">Login</span>
              </Link>
            )}

            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {isMobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 16px 0;
          transition: all var(--transition-base);
          background: rgba(255, 248, 240, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .navbar-scrolled {
          padding: 10px 0;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--coral), var(--golden));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-letter {
          color: white;
          font-weight: 900;
          font-size: 1.3rem;
        }
        .logo-text {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--navy);
        }
        .logo-highlight {
          color: var(--coral);
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--gray-600);
          transition: all var(--transition-fast);
          text-decoration: none;
        }
        .nav-link:hover {
          background: var(--gray-100);
          color: var(--navy);
        }
        .nav-link.active {
          background: var(--coral);
          color: white;
        }
        .navbar-search {
          position: relative;
          flex: 1;
          max-width: 320px;
        }
        .navbar-search input {
          width: 100%;
          padding: 10px 16px 10px 42px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          background: var(--white);
          transition: all var(--transition-fast);
        }
        .navbar-search input:focus {
          border-color: var(--coral);
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }
        .navbar-search .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-400);
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nav-action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: var(--radius-full);
          background: none;
          color: var(--gray-600);
          font-size: 0.9rem;
          font-weight: 500;
          transition: all var(--transition-fast);
          position: relative;
          cursor: pointer;
          text-decoration: none;
        }
        .nav-action-btn:hover {
          background: var(--gray-100);
          color: var(--navy);
        }
        .cart-badge {
          position: absolute;
          top: 2px;
          right: 4px;
          background: var(--coral);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: badge-pop 0.3s ease;
        }
        .mobile-menu-btn {
          display: none;
          background: none;
          color: var(--navy);
          padding: 8px;
        }
        .mobile-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }
        .location-text {
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        @media (max-width: 900px) {
          .navbar-links {
            position: fixed;
            top: 0;
            left: -280px;
            width: 280px;
            height: 100vh;
            background: var(--white);
            flex-direction: column;
            padding: 80px 24px 24px;
            gap: 8px;
            z-index: 1001;
            transition: left var(--transition-base);
            box-shadow: var(--shadow-2xl);
          }
          .navbar-links.open {
            left: 0;
          }
          .nav-link {
            width: 100%;
            padding: 12px 16px;
            border-radius: var(--radius-md);
            font-size: 1rem;
          }
          .mobile-overlay {
            display: block;
          }
          .mobile-menu-btn {
            display: block;
          }
          .navbar-search {
            display: none;
          }
          .location-btn .location-text {
            display: none;
          }
          .profile-btn {
            display: none;
          }
          .user-menu-wrap {
            position: relative;
          }
          .user-name-text {
            font-size: 0.85rem;
            max-width: 80px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .user-dropdown {
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            background: var(--white);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            border: 1px solid var(--gray-100);
            min-width: 220px;
            z-index: 1002;
            animation: fadeIn 0.2s ease;
            overflow: hidden;
          }
          .user-dropdown-header {
            padding: 14px 16px;
            border-bottom: 1px solid var(--gray-100);
            display: flex;
            flex-direction: column;
          }
          .user-dropdown-header strong {
            color: var(--navy);
            font-size: 0.95rem;
          }
          .user-dropdown-header span {
            color: var(--gray-500);
            font-size: 0.8rem;
          }
          .user-dropdown-item {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            padding: 12px 16px;
            background: none;
            border: none;
            font-size: 0.9rem;
            cursor: pointer;
            transition: background var(--transition-fast);
            color: var(--gray-600);
          }
          .user-dropdown-item:hover {
            background: var(--gray-50);
          }
          .user-dropdown-item.logout {
            color: var(--red);
          }
          .login-btn {
            text-decoration: none;
          }
          .login-text {
            font-size: 0.85rem;
            font-weight: 600;
          }
        }
        @media (max-width: 480px) {
          .location-btn {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
