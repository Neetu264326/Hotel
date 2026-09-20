import { Link } from 'react-router-dom'
import { Flame, Target, Eye, Heart, ArrowRight } from 'lucide-react'

const About = () => {
  return (
    <main className="page-enter" style={{ minHeight: '70vh', paddingBottom: 80 }}>
      <section style={{ background: 'var(--gradient-dark)', padding: '70px 0', textAlign: 'center' }}>
        <div className="container">
          <div className="logo-mark" style={{ width: 72, height: 72, borderRadius: 22, background: 'var(--gradient-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: 'var(--shadow-coral)' }}>
            <Flame size={40} color="#fff" />
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: 12 }}>Delivering Happiness, One Meal at a Time</h1>
          <p style={{ color: '#9CA3AF', fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
            We connect you with the best restaurants in your city and bring great food to your doorstep.
          </p>
        </div>
      </section>

      <section className="container section-padding">
        <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {[
            { icon: Target, title: 'Our Mission', desc: 'To make ordering great food effortless, fast, and enjoyable for everyone.' },
            { icon: Eye, title: 'Our Vision', desc: 'To be the most loved food delivery experience, connecting every craving with a solution.' },
            { icon: Heart, title: 'Our Promise', desc: 'Fresh food, fair prices, and on-time delivery. Every single time.' },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i} style={{ textAlign: 'center', padding: 36, borderRadius: 24, background: '#fff', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'var(--gradient-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icon size={32} color="#fff" />
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--navy)' }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-gray)' }}>{item.desc}</p>
              </div>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <h2 style={{ fontSize: 24, color: 'var(--navy)', marginBottom: 16 }}>Hungry yet?</h2>
          <Link to="/restaurants" className="btn btn-primary btn-lg">
            Explore Restaurants <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  )
}

export default About
