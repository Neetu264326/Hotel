import Restaurant from '../models/Restaurant.js'
import Food from '../models/Food.js'

export const getRestaurants = async (req, res, next) => {
  try {
    const { cuisine, search } = req.query
    const filter = {}

    if (cuisine && cuisine !== 'All') {
      filter.cuisine = cuisine
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const restaurants = await Restaurant.find(filter).sort({ rating: -1 })
    res.json(restaurants)
  } catch (error) {
    next(error)
  }
}

export const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' })
    }
    res.json(restaurant)
  } catch (error) {
    next(error)
  }
}

export const getRestaurantFoods = async (req, res, next) => {
  try {
    const foods = await Food.find({ restaurantId: req.params.id })
    res.json(foods)
  } catch (error) {
    next(error)
  }
}

export const getCuisines = async (req, res, next) => {
  try {
    const cuisines = await Restaurant.distinct('cuisine')
    res.json(['All', ...cuisines])
  } catch (error) {
    next(error)
  }
}

export const getFoods = async (req, res, next) => {
  try {
    const { search, restaurantId, category, veg, bestseller } = req.query
    const filter = {}

    if (restaurantId) filter.restaurantId = restaurantId
    if (category) filter.category = category
    if (veg !== undefined) filter.veg = veg === 'true'
    if (bestseller !== undefined) filter.bestseller = bestseller === 'true'

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ]
    }

    const foods = await Food.find(filter).sort({ bestseller: -1, rating: -1 })
    res.json(foods)
  } catch (error) {
    next(error)
  }
}

export const getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id)
    if (!food) {
      return res.status(404).json({ message: 'Food not found' })
    }
    res.json(food)
  } catch (error) {
    next(error)
  }
}