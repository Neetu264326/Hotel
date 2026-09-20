import Coupon from '../models/Coupon.js'

export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ active: true })
    res.json(coupons)
  } catch (error) {
    next(error)
  }
}

export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' })
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true })
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' })
    }

    if (subtotal < coupon.minOrder) {
      return res.status(400).json({ success: false, message: `Minimum order of ₹${coupon.minOrder} required` })
    }

    let discount = 0
    if (coupon.type === 'flat') {
      discount = coupon.value
    } else {
      const computed = Math.round(subtotal * (coupon.value / 100))
      discount = coupon.maxDiscount ? Math.min(computed, coupon.maxDiscount) : computed
    }

    res.json({
      success: true,
      coupon,
      discount,
      message: 'Coupon applied successfully!',
    })
  } catch (error) {
    next(error)
  }
}