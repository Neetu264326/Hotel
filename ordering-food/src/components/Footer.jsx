import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <div className="logo-icon">
                  <span className="logo-letter">F</span>
                </div>
                <span className="logo-text">
                  Food<span className="logo-highlight">Dash</span>
                </span>
              </Link>
              <p className="footer-desc">
                Discover delicious meals from your favorite restaurants and get
                them delivered to your doorstep. Fresh, fast, and flavorful.
              </p>
              <div className="footer-social">
                <a href="#" aria-label="Facebook" className="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
                <a href="#" aria-label="Twitter" className="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              </div>
            </div>

            <div className="footer-links-group">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/restaurants">Restaurants</Link></li>
                <li><Link to="/offers">Offers</Link></li>
                <li><Link to="/about">About Us</Link></li>
              </ul>
            </div>

            <div className="footer-links-group">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Refund Policy</a></li>
              </ul>
            </div>

            <div className="footer-links-group">
              <h4>Contact</h4>
              <ul className="contact-list">
                <li><Phone size={16} /> +91 98765 43210</li>
                <li><Mail size={16} /> hello@fooddash.com</li>
                <li><MapPin size={16} /> Bangalore, India</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 FoodDash. All rights reserved.</p>
            <p className="made-with">
              Made with <Heart size={14} className="heart-icon" /> for food lovers
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        .footer {
          background: var(--navy);
          color: var(--gray-300);
          padding: 60px 0 24px;
          margin-top: auto;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          margin-bottom: 16px;
        }
        .footer-logo .logo-text {
          color: white;
          font-size: 1.3rem;
          font-weight: 800;
        }
        .footer-logo .logo-highlight {
          color: var(--coral);
        }
        .footer-desc {
          font-size: 0.9rem;
          line-height: 1.7;
          color: var(--gray-400);
          margin-bottom: 20px;
        }
        .footer-social {
          display: flex;
          gap: 12px;
        }
        .social-link {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gray-400);
          transition: all var(--transition-fast);
          text-decoration: none;
        }
        .social-link:hover {
          background: var(--coral);
          color: white;
        }
        .footer-links-group h4 {
          color: white;
          font-size: 1rem;
          margin-bottom: 16px;
        }
        .footer-links-group ul {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-links-group a {
          color: var(--gray-400);
          font-size: 0.9rem;
          transition: color var(--transition-fast);
          text-decoration: none;
        }
        .footer-links-group a:hover {
          color: var(--coral);
        }
        .contact-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--gray-400);
          font-size: 0.9rem;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: var(--gray-500);
        }
        .made-with {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .heart-icon {
          color: var(--coral);
          fill: var(--coral);
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
