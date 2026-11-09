import { Link, useNavigate } from 'react-router-dom'
import { Star, Clock, Bike, Tag, Leaf, ChevronRight } from 'lucide-react'

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate()
  const ratingColor = restaurant.rating >= 4.5 ? '#22C55E' : restaurant.rating >= 4.0 ? '#FFC857' : '#FB923C'
  const openDetails = () => navigate(`/restaurant/${restaurant.id}`)

  return (
    <article
      className="restaurant-card card"
      aria-label={`View details for ${restaurant.name}`}
      onClick={openDetails}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openDetails()
        }
      }}
      role="link"
      tabIndex={0}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}
    >
      <div className="restaurant-image-wrap" style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={restaurant.image}
          alt={restaurant.name}
          loading="lazy"
          style={{ width: '100%', height: 200, objectFit: 'cover', transition: 'transform 0.4s ease' }}
        />
        <span
          className="restaurant-discount"
          style={{
            position: 'absolute',
            bottom: 12,
            left: 0,
            background: 'linear-gradient(90deg, rgba(16,24,40,0.85), transparent)',
            color: '#fff',
            padding: '6px 16px',
            fontSize: 14,
            fontWeight: 700,
            borderRadius: '0 8px 8px 0',
          }}
        >
          <Tag size={13} style={{ marginRight: 4 }} /> {restaurant.discount}
        </span>
        {restaurant.vegetarian && (
          <span className="badge badge-veg" style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 4, backdropFilter: 'blur(4px)' }}>
            <Leaf size={13} /> Vegetarian
          </span>
        )}
      </div>

      <div className="restaurant-info" style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)' }}>{restaurant.name}</h3>
          <span
            style={{
              background: ratingColor,
              color: '#fff',
              borderRadius: 8,
              padding: '3px 8px',
              fontSize: 13,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Star size={12} fill="#fff" /> {restaurant.rating}
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-gray)', marginBottom: 4 }}>{restaurant.cuisine}</p>
        <p style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 12 }}>{restaurant.reviews.toLocaleString()} ratings</p>

        <div className="restaurant-meta" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 13, color: 'var(--text-gray)', marginBottom: 14 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Clock size={14} color="var(--coral)" /> {restaurant.deliveryTime}-{restaurant.deliveryTime + 10} min
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Bike size={14} color="var(--coral)" /> ₹{restaurant.deliveryFee}
          </span>
          <span>{restaurant.priceRange}</span>
        </div>

        <Link
          to={`/restaurant/${restaurant.id}`}
          onClick={(event) => event.stopPropagation()}
          className="btn btn-primary btn-block"
          style={{ marginTop: 'auto', padding: '12px', fontSize: 14, borderRadius: 12 }}
          aria-label={`View menu of ${restaurant.name}`}
        >
          View Menu <ChevronRight size={16} />
        </Link>
      </div>
    </article>
  )
}

export default RestaurantCard
