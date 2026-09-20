import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingCart, MapPin, ChevronDown, Flame, LogOut, Check } from 'lucide-react'
import SearchBar from './SearchBar'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { locations, getLocation, setLocation, getCity } from '../utils/location'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/restaurants', label: 'Restaurants' },
  { to: '/offers', label: 'Offers' },
  { to: '/about', label: 'About' },
]

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [badgeBounce, setBadgeBounce] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [location, setLoc] = useState(getLocation)
  const [locPickerOpen, setLocPickerOpen] = useState(false)
  const { itemCount } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const prevCount = useRef(itemCount)
  const profileRef = useRef(null)
  const locRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
      if (locRef.current && !locRef.current.contains(e.target)) {
        setLocPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (itemCount > prevCount.current) {
      setBadgeBounce(true)
      const t = setTimeout(() => setBadgeBounce(false), 500)
      prevCount.current = itemCount
      return () => clearTimeout(t)
    }
    prevCount.current = itemCount
  }, [itemCount])

  const closeMenu = () => setOpen(false)

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    navigate('/')
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  return (
    <header
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(12px)',
        boxShadow: scrolled ? '0 4px 20px rgba(16,24,40,0.08)' : 'none',
        transition: 'all 0.3s ease',
        borderBottom: '1px solid rgba(229,231,235,0.5)',
      }}
    >
      <div className="container nav-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--header-height)' }}>
        <Link to="/" className="nav-logo" onClick={closeMenu} aria-label="Delishful home" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="logo-mark" style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--gradient-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-coral)' }}>
            <Flame size={22} color="#fff" />
          </div>
          <span style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--navy)', letterSpacing: '-0.5px' }}>
            Delish<span style={{ color: 'var(--coral)' }}>ful</span>
          </span>
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Primary navigation" style={{ gap: 28, alignItems: 'center' }}>
          {open && user && (
            <div style={{ width: '100%', padding: '12px 16px', borderBottom: '1px solid var(--border)', background: '#FFF8F0', borderRadius: 12, marginBottom: 8 }}>
              <strong style={{ fontSize: 14, color: 'var(--navy)', display: 'block' }}>{user.name}</strong>
              <span style={{ fontSize: 12, color: 'var(--text-gray)' }}>{user.email}</span>
            </div>
          )}
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              style={({ isActive }) => ({
                fontSize: 15,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--coral)' : 'var(--navy)',
                position: 'relative',
                transition: 'color 0.3s',
              })}
            >
              {item.label}
            </NavLink>
          ))}
          {user ? (
            <button
              onClick={() => { closeMenu(); handleLogout() }}
              className="nav-link"
              style={{ fontSize: 15, fontWeight: 500, color: 'var(--coral)', transition: 'color 0.3s' }}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={closeMenu}
              className="nav-link"
              style={{ fontSize: 15, fontWeight: 500, color: 'var(--coral)', transition: 'color 0.3s' }}
            >
              Login / Sign up
            </Link>
          )}
        </nav>

        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div ref={locRef} style={{ position: 'relative' }}>
            <button
              className="nav-action desktop-only"
              aria-label="Select location"
              aria-haspopup="listbox"
              aria-expanded={locPickerOpen}
              onClick={() => setLocPickerOpen((o) => !o)}
              style={{ color: 'var(--navy)', fontSize: 14, fontWeight: 500 }}
            >
              <MapPin size={20} color="var(--coral)" style={{ flexShrink: 0 }} />
              <span>{getCity()}</span>
              <ChevronDown size={16} />
            </button>
            {locPickerOpen && (
              <div
                role="listbox"
                aria-label="Select delivery location"
                className="animate-scale-in"
                style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow-lg)', minWidth: 230, padding: 8, zIndex: 70 }}
              >
                {locations.map((l) => {
                  const active = l.label === location
                  return (
                    <button
                      key={l.label}
                      role="option"
                      aria-selected={active}
                      onClick={() => { setLoc(l.label); setLocation(l.label); setLocPickerOpen(false) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, fontSize: 14, fontWeight: active ? 700 : 500, color: active ? 'var(--coral)' : 'var(--navy)', textAlign: 'left' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#FFF8F0' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <MapPin size={16} color={active ? 'var(--coral)' : 'var(--text-light)'} />
                      <span style={{ flex: 1 }}>{l.label}</span>
                      {active && <Check size={16} color="var(--coral)" />}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <Link
            to="/cart"
            className="nav-cart"
            aria-label={`Cart with ${itemCount} items`}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 12, background: '#FFF8F0', color: 'var(--navy)', transition: 'all 0.3s' }}
          >
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span
                className={badgeBounce ? 'badge-bounce' : ''}
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  background: 'var(--coral)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 700,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-coral)',
                }}
              >
                {itemCount}
              </span>
            )}
          </Link>

          <div ref={profileRef} style={{ position: 'relative' }}>
            {user ? (
              <>
                <button
                  className="nav-action"
                  onClick={() => setProfileOpen((p) => !p)}
                  aria-label="User profile"
                  aria-expanded={profileOpen}
                  style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--gradient-coral)', color: '#fff', fontWeight: 700, fontSize: 14 }}
                >
                  {initials}
                </button>
                {profileOpen && (
                  <div className="profile-menu" style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', background: '#fff', borderRadius: 16, boxShadow: 'var(--shadow-lg)', minWidth: 220, overflow: 'hidden', zIndex: 60, animation: 'slideDown 0.2s ease' }}>
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: '#FFF8F0' }}>
                      <strong style={{ fontSize: 14, color: 'var(--navy)', display: 'block' }}>{user.name}</strong>
                      <span style={{ fontSize: 12, color: 'var(--text-gray)' }}>{user.email}</span>
                    </div>
                    <button className="profile-menu-item" onClick={() => { setProfileOpen(false); navigate('/track-order') }} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>
                      Track my orders
                    </button>
                    <button className="profile-menu-item" onClick={handleLogout} style={{ width: '100%', textAlign: 'left', padding: '12px 16px', fontSize: 14, fontWeight: 600, color: '#EF4444', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary desktop-only"
                aria-label="Login or sign up"
                style={{ padding: '10px 20px', fontSize: 14, borderRadius: 12, whiteSpace: 'nowrap' }}
              >
                Login
              </Link>
            )}
          </div>

          <button
            className="hamburger"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            style={{ flexDirection: 'column', gap: 5, padding: 8 }}
          >
            {open ? <X size={26} color="var(--navy)" /> : <Menu size={26} color="var(--navy)" />}
          </button>
        </div>
      </div>

      <div style={{ padding: '10px 0 12px', borderTop: '1px solid rgba(229,231,235,0.5)', background: 'rgba(255,255,255,0.98)' }}>
        <div className="container">
          <SearchBar onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)} />
        </div>
      </div>
    </header>
  )
}

export default Navbar
