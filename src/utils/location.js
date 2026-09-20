const KEY = 'delishful_location'

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
  return match ? match.city : current.split(' ')[0]
}

export const setLocation = (label) => {
  try {
    localStorage.setItem(KEY, label)
  } catch {
    // ignore
  }
}