import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authAPI } from '../api'
import { getToken, setToken } from '../api/client'

const AuthContext = createContext(null)

const USER_KEY = 'delishful_user'

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

const isNetworkError = (error) => {
  if (!error) return true
  if (error.status && error.status < 500) return false
  const msg = (error.message || '').toLowerCase()
  return /failed to fetch|network|load failed/i.test(msg) || !error.status
}

const nameFromEmail = (email = '') => {
  const base = email.split('@')[0]
  return (
    base
      .replace(/[._\-+]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(' ') || 'Guest User'
  )
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser)
  const [loading] = useState(false)

  const persistSession = (data) => {
    const { token, ...profile } = data
    if (token) setToken(token)
    localStorage.setItem(USER_KEY, JSON.stringify(profile))
    setUser(profile)
    return data
  }

  // Create a local (demo) session when the backend is unreachable so the
  // app remains fully usable offline. No real credentials are stored.
  const createDemoSession = (profile) => {
    const demo = {
      ...profile,
      id: profile.id || `usr_${Date.now().toString(36)}`,
      name: profile.name || nameFromEmail(profile.email),
      isDemo: true,
    }
    setToken(`demo_${Date.now().toString(36)}`)
    localStorage.setItem(USER_KEY, JSON.stringify(demo))
    setUser(demo)
    return demo
  }

  const register = useCallback(async (userData) => {
    try {
      const data = await authAPI.register(userData)
      return persistSession(data)
    } catch (error) {
      if (!isNetworkError(error)) throw error
      return createDemoSession({ name: userData.name, email: userData.email })
    }
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const data = await authAPI.login({ email, password })
      return persistSession(data)
    } catch (error) {
      if (!isNetworkError(error)) throw error
      return createDemoSession({ email })
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (profileData) => {
    try {
      const data = await authAPI.updateProfile(profileData)
      setUser(data)
      localStorage.setItem(USER_KEY, JSON.stringify(data))
      return data
    } catch (error) {
      if (!isNetworkError(error)) throw error
      const profile = { ...user, ...profileData }
      localStorage.setItem(USER_KEY, JSON.stringify(profile))
      setUser(profile)
      return profile
    }
  }, [user])

  useEffect(() => {
    if (user && getToken()) return
    setToken(null)
  }, [user])

  // Validate the stored session on first load so that stale/invalid tokens
  // (e.g. from a reseeded database) silently drop back to guest mode instead
  // of leaving the app stuck in a broken "logged in" state.
  useEffect(() => {
    const token = getToken()
    if (!token) return
    let cancelled = false
    authAPI
      .getProfile()
      .then((profile) => {
        if (cancelled) return
        const stored = getStoredUser()
        const next = { ...profile, isDemo: stored?.isDemo }
        localStorage.setItem(USER_KEY, JSON.stringify(next))
        setUser(next)
      })
      .catch((error) => {
        if (cancelled) return
        if (error.status === 401 && getToken() === token) {
          logout()
        }
      })
    return () => {
      cancelled = true
    }
  }, [logout])

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}