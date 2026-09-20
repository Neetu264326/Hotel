import { Link } from 'react-router-dom'
import { Flame, Mail, MapPin, Phone, Globe, MessageCircle, Share2 } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="footer" style={{ background: 'var(--navy)', color: '#C9D1D9', marginTop: 'auto', paddingTop: 64 }}>
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div className="logo-mark" style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--gradient-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={22} color="#fff" />
              </div>
              <span style={{ fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                Delish<span style={{ color: 'var(--coral)' }}>ful</span>
              </span>
            </Link>
            <p style={{ maxWidth: 300, fontSize: 14, lineHeight: 1.7 }}>
              Discover delicious meals from your favorite restaurants and get them delivered to your doorstep, fast.
            </p>
            <div className="footer-socials" style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {[MessageCircle, Mail, Globe, Share2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social media link"
                  style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}
                >
                  <Icon size={18} color="#fff" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ color: '#fff', marginBottom: 16, fontSize: 16 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 10, fontSize: 14 }}>
              <li><Link to="/restaurants">Restaurants</Link></li>
              <li><Link to="/offers">Offers</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/cart">Your Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', marginBottom: 16, fontSize: 16 }}>Support</h4>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 10, fontSize: 14 }}>
              <li>Help Center</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
              <li>FAQs</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#fff', marginBottom: 16, fontSize: 16 }}>Contact</h4>
            <ul style={{ listStyle: 'none', display: 'grid', gap: 12, fontSize: 14 }}>
              <li style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <MapPin size={16} color="var(--coral)" style={{ marginTop: 3 }} />
                <span>12 Food Street, Bengaluru 560001</span>
              </li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Phone size={16} color="var(--coral)" />
                <span>+91 98765 43210</span>
              </li>
              <li style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Mail size={16} color="var(--coral)" />
                <span>hello@delishful.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, fontSize: 13 }}>
          <span>© {new Date().getFullYear()} Delishful. All rights reserved.</span>
          <span>Made with love for food lovers.</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
