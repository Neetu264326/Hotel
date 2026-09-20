import { Heart, Users, Award, Leaf } from "lucide-react";

export default function About() {
  return (
    <div className="page-wrapper">
      <div className="about-page">
        <div className="container">
          <div className="about-hero">
            <h1>About FoodDash</h1>
            <p className="about-hero-text">
              We're on a mission to bring delicious food from the best restaurants
              right to your doorstep. Fresh, fast, and with a smile.
            </p>
          </div>

          <div className="about-values">
            <div className="value-card">
              <div className="value-icon">
                <Heart size={28} />
              </div>
              <h3>Made with Love</h3>
              <p>Every dish we deliver is prepared with care and passion by our partner restaurants.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Users size={28} />
              </div>
              <h3>Community First</h3>
              <p>Supporting local restaurants and creating jobs in your neighborhood.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Award size={28} />
              </div>
              <h3>Quality Assured</h3>
              <p>We partner only with restaurants that meet our high standards for food quality.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Leaf size={28} />
              </div>
              <h3>Eco Friendly</h3>
              <p>Committed to sustainable packaging and carbon-neutral deliveries.</p>
            </div>
          </div>

          <div className="about-stats">
            <div className="stat-card">
              <span className="stat-number">500+</span>
              <span className="stat-label">Partner Restaurants</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">50,000+</span>
              <span className="stat-label">Orders Delivered</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">4.8</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>

          <div className="about-story">
            <h2>Our Story</h2>
            <p>
              FoodDash started with a simple idea: everyone deserves access to great food,
              delivered quickly and affordably. Founded in 2024 in Bangalore, we've grown
              from a small startup to one of the most loved food delivery platforms in the city.
            </p>
            <p>
              Our team of food enthusiasts works tirelessly to curate the best restaurants
              and ensure every delivery experience is exceptional. We believe food is not
              just sustenance — it's an experience, a memory, a celebration.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .about-page {
          padding-top: 100px;
          padding-bottom: 60px;
          min-height: 100vh;
        }
        .about-hero {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 60px;
        }
        .about-hero h1 {
          color: var(--navy);
          margin-bottom: 16px;
          font-size: 2.5rem;
        }
        .about-hero-text {
          color: var(--gray-500);
          font-size: 1.15rem;
          line-height: 1.7;
        }
        .about-values {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 60px;
        }
        .value-card {
          text-align: center;
          padding: 32px 20px;
          background: var(--white);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          transition: transform var(--transition-base);
        }
        .value-card:hover {
          transform: translateY(-4px);
        }
        .value-icon {
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
        .value-card h3 {
          color: var(--navy);
          margin-bottom: 8px;
        }
        .value-card p {
          font-size: 0.9rem;
          color: var(--gray-500);
          line-height: 1.6;
        }
        .about-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          margin-bottom: 60px;
        }
        .stat-card {
          text-align: center;
          padding: 32px;
          background: linear-gradient(135deg, var(--navy), var(--navy-light));
          border-radius: var(--radius-xl);
          color: white;
        }
        .stat-number {
          display: block;
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 8px;
          background: linear-gradient(135deg, var(--coral), var(--golden));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }
        .about-story {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
        }
        .about-story h2 {
          color: var(--navy);
          margin-bottom: 20px;
        }
        .about-story p {
          color: var(--gray-500);
          line-height: 1.8;
          margin-bottom: 16px;
          font-size: 1rem;
        }
        @media (max-width: 768px) {
          .about-values, .about-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .about-values, .about-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
