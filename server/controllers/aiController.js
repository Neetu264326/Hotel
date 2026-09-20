import Restaurant from '../models/Restaurant.js'
import Food from '../models/Food.js'
import Coupon from '../models/Coupon.js'
import { askAssistant, buildContext, isAssistantConfigured } from '../ai/provider.js'
import { askLocal } from '../ai/local.js'

const runLocal = ({ message, restaurants, foods, coupons }) => {
  const result = askLocal({ message, restaurants, foods, coupons })
  return {
    ...result,
    note: isAssistantConfigured()
      ? 'AI provider unavailable — using offline assistant.'
      : 'Offline assistant — add AI_API_KEY in server/.env to enable full AI conversations.',
  }
}

export const chat = async (req, res, next) => {
  try {
    const { message, history } = req.body || {}

    if (!message || !String(message).trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a message' })
    }

    const [restaurants, foods, coupons] = await Promise.all([
      Restaurant.find().sort({ rating: -1 }).limit(40),
      Food.find().limit(300),
      Coupon.find({ active: true }),
    ])

    const context = buildContext({
      restaurants,
      foods,
      cuisines: [...new Set(restaurants.map((r) => r.cuisine))],
      coupons,
    })

    if (isAssistantConfigured()) {
      try {
        const result = await askAssistant({
          message,
          history,
          context,
        })
        return res.json({
          success: true,
          reply: result.reply,
          provider: result.provider,
          model: result.model,
        })
      } catch (error) {
        console.warn('[ai] provider failed, falling back to offline:', error.message)
        return res.json({ success: true, ...runLocal({ message, restaurants, foods, coupons }) })
      }
    }

    return res.json({ success: true, ...runLocal({ message, restaurants, foods, coupons }) })
  } catch (error) {
    next(error)
  }
}