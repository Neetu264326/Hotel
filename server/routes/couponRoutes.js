import express from 'express'
import { getCoupons, validateCoupon } from '../controllers/couponController.js'

const router = express.Router()

router.get('/', getCoupons)
router.post('/validate', validateCoupon)

export default router