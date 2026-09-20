import Cart from '../models/Cart.js'
import Food from '../models/Food.js'
import Coupon from '../models/Coupon.js'

const calculateItemPrice = (food, size, addOns) => {
  const sizeIndex = food.sizes ? Math.max(0, size) : 0
  const base = food.sizes ? food.sizes[sizeIndex] : food.price
  const addOnTotal = (addOns || []).reduce((sum, a) => sum + a.price, 0)
  return base + addOnTotal
}

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      cart = { items: [], coupon: null, restaurantId: null }
    }
    res.json(cart)
  } catch (error) {
    next(error)
  }
}

export const addToCart = async (req, res, next) => {
  try {
    const { foodId, size, sizeName, addOns, quantity, specialInstructions } = req.body

    const food = await Food.findById(foodId)
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' })
    }

    const qty = quantity || 1
    const unitPrice = calculateItemPrice(food, size || 0, addOns)

    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [], coupon: null, restaurantId: null })
    }

    if (cart.items.length === 0) {
      cart.restaurantId = food.restaurantId
    }

    const existingIndex = cart.items.findIndex(
      (item) =>
        item.foodId.toString() === foodId &&
        item.size === (size || 0) &&
        JSON.stringify(item.addOns) === JSON.stringify(addOns || [])
    )

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += qty
      cart.items[existingIndex].lineTotal = cart.items[existingIndex].price * cart.items[existingIndex].quantity
    } else {
      cart.items.push({
        foodId: food._id,
        name: food.name,
        restaurantId: food.restaurantId,
        image: food.image,
        price: unitPrice,
        size: size || 0,
        sizeName: sizeName || '',
        addOns: addOns || [],
        quantity: qty,
        lineTotal: unitPrice * qty,
        specialInstructions: specialInstructions || '',
      })
    }

    await cart.save()
    res.status(201).json(cart)
  } catch (error) {
    next(error)
  }
}

export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity, specialInstructions } = req.body
    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    const item = cart.items.id(req.params.itemId)
    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' })
    }

    if (quantity !== undefined) {
      item.quantity = Math.max(1, quantity)
      item.lineTotal = item.price * item.quantity
    }
    if (specialInstructions !== undefined) {
      item.specialInstructions = specialInstructions
    }

    await cart.save()
    res.json(cart)
  } catch (error) {
    next(error)
  }
}

export const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    cart.items.pull(req.params.itemId)
    if (cart.items.length === 0) {
      cart.coupon = null
      cart.restaurantId = null
    }
    await cart.save()
    res.json(cart)
  } catch (error) {
    next(error)
  }
}

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.json({ items: [], coupon: null, restaurantId: null })
    }
    cart.items = []
    cart.coupon = null
    cart.restaurantId = null
    await cart.save()
    res.json(cart)
  } catch (error) {
    next(error)
  }
}

export const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body
    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' })
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true })
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' })
    }

    const subtotal = cart.items.reduce((sum, i) => sum + i.lineTotal, 0)
    if (subtotal < coupon.minOrder) {
      return res.status(400).json({ success: false, message: `Minimum order of ₹${coupon.minOrder} required` })
    }

    cart.coupon = coupon.code
    await cart.save()
    res.json({ success: true, cart, message: 'Coupon applied successfully!' })
  } catch (error) {
    next(error)
  }
}

export const removeCoupon = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }
    cart.coupon = null
    await cart.save()
    res.json(cart)
  } catch (error) {
    next(error)
  }
}