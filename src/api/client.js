const API_BASE = import.meta.env.VITE_API_URL || '/api'

export const getToken = () => localStorage.getItem('delishful_token') || null

export const setToken = (token) => {
  if (token) localStorage.setItem('delishful_token', token)
  else localStorage.removeItem('delishful_token')
}

const normalizeDoc = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalizeDoc)
  }
  if (value && typeof value === 'object') {
    const out = { ...value }
    if (typeof out._id === 'string') {
      out.id = out._id
      delete out._id
    }
    for (const key of Object.keys(out)) {
      if (out[key] && typeof out[key] === 'object') {
        if (out[key] instanceof Date) continue
        out[key] = normalizeDoc(out[key])
      }
    }
    delete out.__v
    return out
  }
  return value
}

const fetchAPI = async (path, options = {}) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed (${response.status})`
    const error = new Error(message)
    error.status = response.status
    error.data = data
    throw error
  }

  return normalizeDoc(data)
}

const client = {
  get: (path) => fetchAPI(path, { method: 'GET' }),
  post: (path, body) => fetchAPI(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  put: (path, body) => fetchAPI(path, { method: 'PUT', body: JSON.stringify(body ?? {}) }),
  delete: (path) => fetchAPI(path, { method: 'DELETE' }),
}

export default client