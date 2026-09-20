import express from 'express'
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getOrderByOrderId,
  trackOrder,
  cancelOrder,
} from '../controllers/orderController.js'
import protect from '../middleware/auth.js'

const router = express.Router()

router.use(protect)

router.post('/', placeOrder)
router.get('/', getMyOrders)
router.get('/track/:orderId', trackOrder)
router.get('/orderId/:orderId', getOrderByOrderId)
router.get('/:id', getOrderById)
router.delete('/:id', cancelOrder)

export default router