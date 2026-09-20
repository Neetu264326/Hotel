import { createContext, useContext, useReducer, useEffect, useMemo, useState } from 'react'
import { calculateItemPrice } from '../utils/priceCalculator'
import { cartAPI } from '../api'
import { useAuth } from './AuthContext'
import { useData } from './DataContext'

const CartContext = createContext(null)

const CART_KEY = 'delishful_cart'
const COUPON_KEY = 'delishful_coupon'
const LEGACY_CART_KEY = 'foodly_cart'
const LEGACY_COUPON_KEY = 'foodly_coupon'

const getStoredCart = () => {
  try {
    const stored = localStorage.getItem(CART_KEY) || localStorage.getItem(LEGACY_CART_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const getStoredCoupon = () => {
  try {
    return localStorage.getItem(COUPON_KEY) || localStorage.getItem(LEGACY_COUPON_KEY) || null
  } catch {
    return null
  }
}

const normalizeCartItems = (items = []) =>
  items.map((item) => ({ ...item, key: item.key || item.id || item._id }))

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        items: action.payload.items || [],
        coupon: action.payload.coupon || null,
        restaurantId: action.payload.restaurantId || null,
      }
    case 'ADD_ITEM': {
      const qty = action.payload.quantity || 1
      const unitPrice = calculateItemPrice(action.payload.food, action.payload.size, action.payload.addOns)
      const existingIndex = state.items.findIndex(
        (item) =>
          item.foodId === action.payload.food.id &&
          item.size === action.payload.size &&
          JSON.stringify(item.addOns) === JSON.stringify(action.payload.addOns)
      )
      if (existingIndex >= 0) {
        const items = [...state.items]
        items[existingIndex] = {
          ...items[existingIndex],
          quantity: items[existingIndex].quantity + qty,
          lineTotal: unitPrice * (items[existingIndex].quantity + qty),
        }
        return { ...state, items }
      }
      const lineTotal = unitPrice * qty
      return {
        ...state,
        items: [
          ...state.items,
          {
            key: Date.now() + Math.random(),
            foodId: action.payload.food.id,
            food: action.payload.food,
            name: action.payload.food.name,
            restaurantId: action.payload.food.restaurantId,
            image: action.payload.food.image,
            price: unitPrice,
            size: action.payload.size || 0,
            sizeName: action.payload.sizeName,
            addOns: action.payload.addOns || [],
            quantity: qty,
            lineTotal,
            specialInstructions: action.payload.specialInstructions || '',
          },
        ],
      }
    }
    case 'UPDATE_QTY': {
      const items = state.items.map((item) => {
        if (item.key === action.payload.key) {
          const newQty = Math.max(1, action.payload.quantity)
          return { ...item, quantity: newQty, lineTotal: item.price * newQty }
        }
        return item
      })
      return { ...state, items }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((item) => item.key !== action.payload) }
    case 'CLEAR_CART':
      return { ...state, items: [], coupon: null }
    case 'APPLY_COUPON':
      return { ...state, coupon: action.payload }
    case 'CLEAR_COUPON':
      return { ...state, coupon: null }
    default:
      return state
  }
}

const getCouponDiscount = (coupon, subtotal) => {
  if (!coupon) return 0
  if (coupon.type === 'flat') return coupon.value
  const computed = Math.round(subtotal * (coupon.value / 100))
  return coupon.maxDiscount ? Math.min(computed, coupon.maxDiscount) : computed
}

export const CartProvider = ({ children }) => {
  const { user, logout } = useAuth()
  const { coupons } = useData()
  const [state, dispatch] = useReducer(
    cartReducer,
    { items: getStoredCart(), coupon: getStoredCoupon(), restaurantId: null }
  )
  const [syncing, setSyncing] = useState(false)

  const isAuthed = !!user

  useEffect(() => {
    if (!isAuthed) return
    let cancelled = false

    const mergeAndLoad = async () => {
      setSyncing(true)
      try {
        const guestItems = getStoredCart()
        const guestCoupon = getStoredCoupon()

        if (guestItems.length > 0) {
          for (const item of guestItems) {
            try {
              await cartAPI.add({
                foodId: item.foodId,
                size: item.size,
                sizeName: item.sizeName,
                addOns: item.addOns || [],
                quantity: item.quantity,
                specialInstructions: item.specialInstructions || '',
              })
            } catch {
              // skip items that fail to merge
            }
          }
          localStorage.removeItem(CART_KEY)
          localStorage.removeItem(LEGACY_CART_KEY)
          localStorage.removeItem(COUPON_KEY)
          localStorage.removeItem(LEGACY_COUPON_KEY)
        }

        if (cancelled) return
        const cart = await cartAPI.get()
        dispatch({
          type: 'LOAD_CART',
          payload: {
            items: normalizeCartItems(cart.items),
            coupon: cart.coupon || guestCoupon,
            restaurantId: cart.restaurantId || null,
          },
        })

        if (guestCoupon && !cart.coupon) {
          try {
            await cartAPI.applyCoupon(guestCoupon)
          } catch {
            // coupon might be invalid server-side, ignore
          }
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setSyncing(false)
      }
    }

    mergeAndLoad()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthed])

  useEffect(() => {
    if (isAuthed) return
    localStorage.setItem(CART_KEY, JSON.stringify(state.items))
    try {
      localStorage.removeItem(LEGACY_CART_KEY)
    } catch {
      // ignore
    }
  }, [state.items, isAuthed])

  useEffect(() => {
    if (isAuthed) return
    if (state.coupon) {
      localStorage.setItem(COUPON_KEY, state.coupon)
    } else {
      localStorage.removeItem(COUPON_KEY)
    }
    try {
      localStorage.removeItem(LEGACY_COUPON_KEY)
    } catch {
      // ignore
    }
  }, [state.coupon, isAuthed])

  const applyMutation = async (mutator) => {
    if (!isAuthed) return null
    setSyncing(true)
    try {
      const result = await mutator()
      const cart = result?.cart || result
      if (cart && Array.isArray(cart.items)) {
        dispatch({
          type: 'LOAD_CART',
          payload: { items: normalizeCartItems(cart.items), coupon: cart.coupon || null, restaurantId: cart.restaurantId || null },
        })
      }
      return { success: true }
    } catch (error) {
      if (error.status === 401) logout()
      return { success: false, message: error.message, status: error.status }
    } finally {
      setSyncing(false)
    }
  }

  const addItem = async (food, size, sizeName, addOns, specialInstructions, quantity = 1) => {
    if (isAuthed) {
      return applyMutation(() =>
        cartAPI.add({ foodId: food.id, size, sizeName, addOns: addOns || [], quantity, specialInstructions })
      )
    }
    dispatch({ type: 'ADD_ITEM', payload: { food, size, sizeName, addOns, specialInstructions, quantity } })
    return { success: true }
  }

  const updateQuantity = async (key, quantity) => {
    const nextQty = Math.max(1, quantity)
    if (isAuthed) {
      return applyMutation(() => cartAPI.updateItem(key, { quantity: nextQty }))
    }
    dispatch({ type: 'UPDATE_QTY', payload: { key, quantity: nextQty } })
    return { success: true }
  }

  const removeItem = async (key) => {
    if (isAuthed) {
      return applyMutation(() => cartAPI.removeItem(key))
    }
    dispatch({ type: 'REMOVE_ITEM', payload: key })
    return { success: true }
  }

  const clearCart = async () => {
    if (isAuthed) {
      const result = await applyMutation(() => cartAPI.clear())
      return result
    }
    dispatch({ type: 'CLEAR_CART' })
    return { success: true }
  }

  const clearCoupon = async () => {
    if (isAuthed) {
      return applyMutation(() => cartAPI.removeCoupon())
    }
    dispatch({ type: 'CLEAR_COUPON' })
    return { success: true }
  }

  const applyCoupon = async (code) => {
    const coupon = coupons.find((c) => c.code === code)
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code' }
    }
    if (subtotal < coupon.minOrder) {
      return { success: false, message: `Minimum order of ₹${coupon.minOrder} required` }
    }
    if (isAuthed) {
      const result = await applyMutation(() => cartAPI.applyCoupon(code))
      return result.success
        ? { success: true, message: 'Coupon applied successfully!' }
        : { success: false, message: result.message }
    }
    dispatch({ type: 'APPLY_COUPON', payload: code })
    return { success: true, message: 'Coupon applied successfully!' }
  }

  const subtotal = useMemo(() => state.items.reduce((sum, i) => sum + i.lineTotal, 0), [state.items])

  const deliveryFee = useMemo(() => {
    if (state.items.length === 0) return 0
    const byRestaurant = {}
    state.items.forEach((i) => {
      const key = String(i.restaurantId)
      byRestaurant[key] = (byRestaurant[key] || 0) + i.lineTotal
    })
    return Object.values(byRestaurant).reduce(
      (sum, restaurantSubtotal) => sum + (restaurantSubtotal >= 300 ? 0 : 40),
      0
    )
  }, [state.items])

  const tax = useMemo(() => Math.round(subtotal * 0.05), [subtotal])

  const couponData = useMemo(() => {
    if (!state.coupon) return null
    return coupons.find((c) => c.code === state.coupon) || null
  }, [state.coupon, coupons])

  const discount = useMemo(() => getCouponDiscount(couponData, subtotal), [couponData, subtotal])

  const total = Math.max(0, subtotal + deliveryFee + tax - discount)

  const itemCount = useMemo(() => state.items.reduce((sum, i) => sum + i.quantity, 0), [state.items])

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        dispatch,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        clearCoupon,
        coupon: state.coupon,
        restaurantId: state.restaurantId,
        subtotal,
        deliveryFee,
        tax,
        discount,
        total,
        itemCount,
        syncing,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}