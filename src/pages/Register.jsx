import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Flame, Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import { validatePhone } from '../utils/validation'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'error') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((t) => t.id !== id)), 3000)
  }

  const removeToast = (id) => setToasts((t) => t.filter((t) => t.id !== id))

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.phone || !form.password) {
      addToast('Please fill in all fields')
      return
    }
    if (!validatePhone(form.phone)) {
      addToast('Enter a valid 10-digit phone number')
      return
    }
    if (form.password.length < 6) {
      addToast('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await register(form)
      navigate(from === '/login' || from === '/register' ? '/' : from, { replace: true })
    } catch (error) {
      addToast(error.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputIcon = { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' } 
  const inputStyle = { width: '100%', padding: '14px 14px 14px 44px', borderRadius: 12, border: '2px solid var(--border)', fontSize: 14, outline: 'none' }

  return (
    <main className="page-enter" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 460 }}>
        <div style={{ background: '#fff', borderRadius: 28, boxShadow: 'var(--shadow-lg)', padding: '40px 36px' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--gradient-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, boxShadow: 'var(--shadow-coral)' }}>
            <Flame size={28} color="#fff" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--navy)', marginBottom: 6 }}>Create account</h1>
          <p style={{ color: 'var(--text-gray)', marginBottom: 28, fontSize: 14 }}>
            Join Delishful and enjoy fast food delivery at your doorstep.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }} aria-label="Register form">
            <div>
              <label htmlFor="name" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--navy)' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#9CA3AF" style={inputIcon} />
                <input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" autoComplete="name" style={inputStyle} />
              </div>
            </div>

            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--navy)' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color="#9CA3AF" style={inputIcon} />
                <input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" autoComplete="email" style={inputStyle} />
              </div>
            </div>

            <div>
              <label htmlFor="phone" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--navy)' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} color="#9CA3AF" style={inputIcon} />
                <input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^\d]/g, '').slice(0, 10) })} placeholder="10-digit mobile number" autoComplete="tel" style={inputStyle} />
              </div>
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--navy)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#9CA3AF" style={inputIcon} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  style={{ width: '100%', padding: '14px 44px', borderRadius: 12, border: '2px solid var(--border)', fontSize: 14, outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading} style={{ borderRadius: 14, marginTop: 4 }}>
              {loading ? 'Creating account...' : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>Create Account <ArrowRight size={18} /></span>}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-gray)', marginTop: 24 }}>
            Already have an account?{' '}
            <Link to="/login" state={{ from }} style={{ color: 'var(--coral)', fontWeight: 700 }}>
              Login
            </Link>
          </p>
        </div>
      </div>

      <Toast toasts={toasts} removeToast={removeToast} />
    </main>
  )
}

export default Register