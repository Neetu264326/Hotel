import express from 'express'
import {
  getRestaurants,
  getRestaurantById,
  getRestaurantFoods,
  getCuisines,
  getFoods,
  getFoodById,
} from '../controllers/restaurantController.js'

const router = express.Router()

router.get('/cuisines', getCuisines)
router.get('/foods', getFoods)
router.get('/foods/:id', getFoodById)
router.get('/restaurants', getRestaurants)
router.get('/restaurants/:id', getRestaurantById)
router.get('/restaurants/:id/foods', getRestaurantFoods)

export default router