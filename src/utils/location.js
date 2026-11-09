const KEY = 'delishful_location'
const CHANGE_EVENT = 'delishful-location-change'

export const defaultLocation = 'Bengaluru 560001'

export const locations = [
  { label: 'Bengaluru 560001', city: 'Bengaluru' },
  { label: 'Mumbai 400001', city: 'Mumbai' },
  { label: 'New Delhi 110001', city: 'New Delhi' },
  { label: 'Hyderabad 500001', city: 'Hyderabad' },
  { label: 'Pune 411001', city: 'Pune' },
  { label: 'Chennai 600001', city: 'Chennai' },
]

export const getLocation = () => {
  try {
    return localStorage.getItem(KEY) || defaultLocation
  } catch {
    return defaultLocation
  }
}

export const getCity = () => {
  const current = getLocation()
  const match = locations.find((l) => l.label === current)
  if (match) return match.city
  // Detected labels look like "Hyderabad 500001" — drop the pincode,
  // keeping multi-word city names ("New Delhi") intact.
  return current.replace(/\s+\d{4,8}$/, '').trim()
}

export const setLocation = (label) => {
  try {
    localStorage.setItem(KEY, label)
  } catch {
    // ignore
  }
  try {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: label }))
  } catch {
    // ignore
  }
}

// Keep every consumer (Navbar, Home hero, ...) in sync within the same tab.
export const subscribeLocation = (callback) => {
  const handler = (event) => callback(event.detail)
  window.addEventListener(CHANGE_EVENT, handler)
  return () => window.removeEventListener(CHANGE_EVENT, handler)
}

export const reverseGeocode = async (lat, lon) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=19&addressdetails=1&accept-language=en`,
    { headers: { 'Accept-Language': 'en' } }
  )
  if (!res.ok) throw new Error('Geocoding failed')
  const data = await res.json()
  const a = data.address || {}
  return {
    fullName: '',
    phone: '',
    house: [a.house_number, a.building, a.residential].filter(Boolean).join(' ') || '',
    street: [a.road, a.footway, a.street].filter(Boolean).join(', ') || [a.suburb, a.neighbourhood, a.quarter].filter(Boolean).join(', '),
    city: a.city || a.town || a.village || a.suburb || a.city_district || a.municipality || a.county || '',
    state: a.state || '',
    pincode: a.postcode || '',
    landmark: [a.landmark, a.shop, a.amenity].filter(Boolean).join(', ') || '',
    lat,
    lon,
  }
}

// Fetch the device's GPS position and turn it into a "City PIN" label.
export const detectCurrentLocation = async () => {
  if (!('geolocation' in navigator)) {
    const err = new Error('Location is not supported by this browser.')
    err.code = 'UNSUPPORTED'
    throw err
  }

  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0, // never reuse a cached fix — it may be stale/wrong
    })
  })

  const lat = position.coords.latitude
  const lon = position.coords.longitude
  const accuracy = position.coords.accuracy

  let addr = null
  try {
    addr = await reverseGeocode(lat, lon)
  } catch {
    addr = null
  }

  const city = addr?.city || ''
  const pin = addr?.pincode || ''
  if (!city && !pin) {
    const err = new Error('Could not find your area name. Please choose a city manually.')
    err.code = 'GEOCODE'
    throw err
  }

  const label = [city, pin].filter(Boolean).join(' ')
  return { label, city: city || pin, lat, lon, accuracy }
}

export const geolocationErrorMessage = (err) => {
  if (!err) return 'Could not get your location.'
  if (err.code === 1) return 'Location permission denied. Please allow access or pick a city.'
  if (err.code === 2) return 'Your location is unavailable right now. Please try again.'
  if (err.code === 3) return 'Timed out getting your location. Please try again.'
  return err.message || 'Could not get your location.'
}
