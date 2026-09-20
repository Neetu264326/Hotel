import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import Coupon from '../models/Coupon.js'
import Restaurant from '../models/Restaurant.js'

const generateOrderId = async () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let id = ''
  do {
    id = 'DLF-'
    for (let i = 0; i < 8; i++) {
      id += chars[Math.floor(Math.random() * chars.length)]
    }
  } while (await Order.findOne({ orderId: id }))
  return id
}

export const placeOrder = async (req, res, next) => {
  try {
    let { address, paymentMethod } = req.body

    if (address && address.phone) {
      let digits = String(address.phone).replace(/[^\d]/g, '')
      if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2)
      if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
      address = { ...address, phone: digits }
    }

    if (!address || !address.fullName || !String(address.fullName).trim()) {
      return res.status(400).json({ message: 'Please enter your full name in the delivery address' })
    }
    if (!address.phone || !/^[6-9]\d{9}$/.test(String(address.phone).trim())) {
      return res.status(400).json({ message: 'Please enter a valid 10-digit phone number in the delivery address' })
    }

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' })
    }

    const subtotal = cart.items.reduce((sum, i) => sum + i.lineTotal, 0)

    const deliveryFee = (() => {
      const byRestaurant = {}
      cart.items.forEach((i) => {
        const key = String(i.restaurantId)
        byRestaurant[key] = (byRestaurant[key] || 0) + i.lineTotal
      })
      return Object.values(byRestaurant).reduce(
        (sum, restaurantSubtotal) => sum + (restaurantSubtotal >= 300 ? 0 : 40),
        0
      )
    })()
    const tax = Math.round(subtotal * 0.05)

    let discount = 0
    if (cart.coupon) {
      const coupon = await Coupon.findOne({ code: cart.coupon })
      if (coupon) {
        if (coupon.type === 'flat') {
          discount = coupon.value
        } else {
          const computed = Math.round(subtotal * (coupon.value / 100))
          discount = coupon.maxDiscount ? Math.min(computed, coupon.maxDiscount) : computed
        }
      }
    }
    const total = Math.max(0, subtotal + deliveryFee + tax - discount)

    const orderId = await generateOrderId()

    const restaurantIds = [...new Set(cart.items.map((i) => String(i.restaurantId)).filter(Boolean))]
    const restaurants = await Restaurant.find({ _id: { $in: restaurantIds } })
    const restaurant = restaurants.length === 1
      ? restaurants[0]
      : null

    const order = await Order.create({
      user: req.user._id,
      orderId,
      items: cart.items,
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      coupon: cart.coupon,
      address,
      paymentMethod,
      restaurant: restaurant
        ? { id: restaurant._id, name: restaurant.name, deliveryTime: restaurant.deliveryTime }
        : {
            id: null,
            name: restaurants.length > 1 ? 'Multiple restaurants' : '',
            deliveryTime: restaurants.length > 0
              ? Math.max(...restaurants.map((r) => r.deliveryTime || 30))
              : 30,
          },
      status: 'placed',
      statusHistory: [{ status: 'placed', timestamp: Date.now() }],
      placedAt: Date.now(),
    })

    cart.items = []
    cart.coupon = null
    cart.restaurantId = null
    await cart.save()

    res.status(201).json(order)
  } catch (error) {
    next(error)
  }
}

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ placedAt: -1 })
    res.json(orders)
  } catch (error) {
    next(error)
  }
}

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.json(order)
  } catch (error) {
    next(error)
  }
}

export const getOrderByOrderId = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId, user: req.user._id })
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.json(order)
  } catch (error) {
    next(error)
  }
}

export const trackOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId, user: req.user._id })
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.json({
      orderId: order.orderId,
      status: order.status,
      statusHistory: order.statusHistory,
      placedAt: order.placedAt,
      estimatedDelivery: order.placedAt + order.restaurant.deliveryTime * 60 * 1000,
      total: order.total,
      restaurant: order.restaurant,
    })
  } catch (error) {
    next(error)
  }
}

export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    const placedMinutesAgo = (Date.now() - order.placedAt) / (1000 * 60)
    if (placedMinutesAgo > 10) {
      return res.status(400).json({ message: 'Order can only be cancelled within 10 minutes of placing' })
    }

    if (order.status === 'delivered' || order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' })
    }

    order.status = 'cancelled'
    order.statusHistory.push({ status: 'cancelled', timestamp: Date.now() })
    await order.save()

    res.json(order)
  } catch (error) {
    next(error)
  }
}