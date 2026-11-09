import express from 'express'
import protect, { authorize } from '../middleware/auth.js'
import {
  getDashboard, getOrders, updateOrderStatus, getCustomers,
  createRestaurant, updateRestaurant, deleteRestaurant,
  createFood, updateFood, deleteFood,
} from '../controllers/adminController.js'

const router = express.Router()
router.use(protect, authorize('admin'))
router.get('/dashboard', getDashboard)
router.get('/orders', getOrders)
router.put('/orders/:id/status', updateOrderStatus)
router.get('/customers', getCustomers)
router.post('/restaurants', createRestaurant)
router.put('/restaurants/:id', updateRestaurant)
router.delete('/restaurants/:id', deleteRestaurant)
router.post('/foods', createFood)
router.put('/foods/:id', updateFood)
router.delete('/foods/:id', deleteFood)
export default router
