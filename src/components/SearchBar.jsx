import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useData } from '../context/DataContext'

const SearchBar = ({ large = false, onSearch, placeholder = 'Search for food or restaurants...' }) => {
  const { restaurants, foods } = useData()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [focused, setFocused] = useState(false)
  const navigate = useNavigate()
  const containerRef = useRef(null)

  const restById = useMemo(() => {
    const map = {}
    restaurants.forEach((r) => { map[r.id] = r })
    return map
  }, [restaurants])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }
    const q = query.toLowerCase()
    const foodResults = foods
      .filter((f) => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q) || f.category.toLowerCase().includes(q))
      .slice(0, 8)
      .map((f) => ({ type: 'food', ...f }))
    const restResults = restaurants
      .filter((r) => r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q))
      .slice(0, 3)
      .map((r) => ({ type: 'restaurant', ...r }))
    setSuggestions([...foodResults, ...restResults])
  }, [query])

  const handleSelect = (item) => {
    if (item.type === 'restaurant') {
      navigate(`/restaurant/${item.id}`)
    } else {
      navigate(`/restaurant/${item.restaurantId}`)
    }
    setQuery('')
    setSuggestions([])
    setFocused(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) onSearch(query)
    setFocused(false)
  }

  return (
    <div
      ref={containerRef}
      className={`search-bar-container ${large ? 'search-large' : ''}`}
      style={{ position: 'relative', width: '100%' }}
    >
      <form onSubmit={handleSubmit} className="search-form" aria-label="Search">
        <Search size={20} color="#6B7280" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          aria-label="Search food or restaurants"
          className="search-input"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: large ? 17 : 15,
            padding: large ? '18px 16px' : '12px 12px',
            color: '#1F2937',
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear search"
            style={{ color: '#9CA3AF', flexShrink: 0 }}
          >
            <X size={18} />
          </button>
        )}
        <button type="submit" className="btn btn-primary" aria-label="Submit search" style={{ padding: large ? '14px 24px' : '10px 18px', fontSize: 14 }}>
          Search
        </button>
      </form>
      {focused && suggestions.length > 0 && (
        <div
          className="search-suggestions"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#fff',
            borderRadius: 14,
            boxShadow: '0 12px 40px rgba(16,24,40,0.15)',
            zIndex: 50,
            marginTop: 8,
            overflow: 'hidden',
            animation: 'slideDown 0.25s ease',
            maxHeight: 360,
            overflowY: 'auto',
          }}
        >
          {suggestions.map((item, i) => {
            const restName = item.type === 'food' ? restById[item.restaurantId]?.name : null
            const sub = item.type === 'restaurant' ? item.cuisine : restName ? `${restName} • ${item.category}` : item.category
            return (
              <button
                key={`${item.type}-${item.id}-${i}`}
                onClick={() => handleSelect(item)}
                className="suggestion-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  width: '100%',
                  textAlign: 'left',
                  borderBottom: '1px solid #F3F4F6',
                  transition: 'background 0.2s',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#FFF8F0')}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    overflow: 'hidden',
                    background: '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={item.image}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </span>
                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                  <strong
                    style={{
                      fontSize: 14,
                      color: '#1F2937',
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.35,
                    }}
                  >
                    {item.name}
                  </strong>
                  <p
                    style={{
                      fontSize: 12,
                      color: '#6B7280',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {sub}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SearchBar
