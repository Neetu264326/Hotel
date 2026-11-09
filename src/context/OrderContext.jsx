import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { orderAPI } from '../api'
import { useAuth } from './AuthContext'
import { useCart } from './CartContext'
import { useData } from './DataContext'
import { generateOrderId, generateTransactionId } from '../utils/orderGenerator'
import { isIndianMobile, normalizePhone } from '../utils/validation'

const STORAGE_KEY = 'delishful_active_order'
const LEGACY_KEY = 'foodly_active_order'

const OrderContext = createContext(null)

const getStoredOrder = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const normalizeOrder = (order) => {
  if (!order) return null
  const { _id, statusHistory, ...rest } = order
  return {
    ...rest,
    id: _id || order.id,
    estimatedMinutes: order.restaurant?.deliveryTime || 30,
    statusHistory: statusHistory || [{ status: order.status, timestamp: order.placedAt }],
    items: (order.items || []).map((item) => ({ ...item, key: item.key || item.id || item._id })),
  }
}

// Fallback order built entirely on the client. No backend required.
const buildLocalOrder = ({ address, paymentMethod, deliveryOption, scheduleDateTime, cart, restaurants }) => {
  const { items, subtotal, deliveryFee, tax, discount, coupon } = cart
  if (!items || items.length === 0) {
    throw new Error('Your cart is empty')
  }
  if (!address) {
    throw new Error('Please provide a delivery address first')
  }

  const restaurantIds = [...new Set(items.map((i) => String(i.restaurantId)).filter(Boolean))]
  const involvedRestaurants = restaurants.filter((r) => restaurantIds.includes(String(r.id)))
  const singleRestaurant = involvedRestaurants.length === 1 ? involvedRestaurants[0] : null
  const restaurant = singleRestaurant
    ? { id: singleRestaurant.id, name: singleRestaurant.name, image: singleRestaurant.image, deliveryTime: singleRestaurant.deliveryTime }
    : {
        id: null,
        name: involvedRestaurants.length > 1 ? 'Multiple restaurants' : 'Delishful Kitchen',
        image: null,
        deliveryTime: involvedRestaurants.length > 0 ? Math.max(...involvedRestaurants.map((r) => r.deliveryTime || 30)) : 30,
      }
  const isOnline = paymentMethod && paymentMethod !== 'Cash on Delivery'
  const baseMinutes = restaurant.deliveryTime || 30
  const estimatedMinutes =
    deliveryOption === 'priority' ? Math.max(18, baseMinutes - 8)
    : deliveryOption === 'scheduled' ? baseMinutes + 5
    : baseMinutes + 5
  const deliveryTotal = deliveryOption === 'priority' ? deliveryFee + 60 : deliveryFee
  const orderTotal = Math.max(0, subtotal + deliveryTotal + tax - discount)
  const now = new Date().toISOString()

  return {
    orderId: generateOrderId(),
    transactionId: isOnline ? generateTransactionId() : null,
    restaurant,
    items: items.map((item) => ({ ...item })),
    subtotal,
    deliveryFee: deliveryTotal,
    tax,
    discount,
    total: orderTotal,
    coupon: coupon || null,
    address,
    paymentMethod,
    deliveryOption,
    scheduleDateTime: scheduleDateTime || null,
    status: 'Confirmed',
    statusHistory: [{ status: 'Confirmed', timestamp: now }],
    placedAt: now,
    estimatedMinutes,
    paymentStatus: isOnline ? 'Paid' : 'COD',
    source: 'local',
  }
}

const isNetworkError = (error) => {
  if (!error) return true
  // 4xx are real backend messages (validation/auth) — surface them.
  if (error.status > 0 && error.status < 500) return false
  // No status (network failure) or 5xx (DB down, gateway/function timeout
  // or crash on Vercel) means the backend is unreachable — use a local order.
  return true
}

export const OrderProvider = ({ children }) => {
  const { user } = useAuth()
  const cart = useCart()
  const { restaurants } = useData()
  const [activeOrder, setActiveOrder] = useState(getStoredOrder)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeOrder))
      try {
        localStorage.removeItem(LEGACY_KEY)
      } catch {
        // ignore
      }
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [activeOrder])

  const placeOrder = async (orderDetails) => {
    setSubmitting(true)
    try {
      const { address, paymentMethod, deliveryOption } = orderDetails

      const safeAddress = address
        ? {
            ...address,
            fullName: String(address.fullName || '').trim(),
            phone: address.phone ? normalizePhone(address.phone) : '',
          }
        : address

      if (!safeAddress)
        throw new Error('Please add a delivery address before placing your order')
      if (!safeAddress.fullName)
        throw new Error('Please enter your full name in the delivery address')
      if (!isIndianMobile(safeAddress.phone))
        throw new Error('Please enter a valid 10-digit phone number in the delivery address')

      if (!user) {
        throw new Error('Please login to place and confirm your order')
      }

      // Demo/guest accounts don't exist in the database and their token is
      // rejected by the API — complete their order locally instead.
      if (user.isDemo) {
        const localOrder = buildLocalOrder({
          address: safeAddress,
          paymentMethod,
          deliveryOption,
          scheduleDateTime: orderDetails.scheduleDateTime,
          cart,
          restaurants,
        })
        setActiveOrder(localOrder)
        return localOrder
      }

      try {
        const order = await orderAPI.create({ address: safeAddress, paymentMethod, deliveryOption })
        const normalized = normalizeOrder(order)
        setActiveOrder(normalized)
        return normalized
      } catch (error) {
        if (!isNetworkError(error)) throw error
        // Backend unavailable — gracefully fall back to a local demo order
      }

      const localOrder = buildLocalOrder({
        address: safeAddress,
        paymentMethod,
        deliveryOption,
        scheduleDateTime: orderDetails.scheduleDateTime,
        cart,
        restaurants,
      })
      setActiveOrder(localOrder)
      return localOrder
    } finally {
      setSubmitting(false)
    }
  }

  const clearOrder = () => setActiveOrder(null)

  const refreshOrder = useCallback(async (orderId) => {
    try {
      const order = await orderAPI.getByOrderId(orderId)
      const normalized = normalizeOrder(order)
      setActiveOrder(normalized)
      return normalized
    } catch {
      return null
    }
  }, [])

  return (
    <OrderContext.Provider value={{ activeOrder, placeOrder, clearOrder, refreshOrder, submitting }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider')
  }
  return context
}
