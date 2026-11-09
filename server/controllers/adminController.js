import User from '../models/User.js'
import Restaurant from '../models/Restaurant.js'
import Food from '../models/Food.js'
import Order from '../models/Order.js'

const statuses = ['placed', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled']

export const getDashboard = async (req, res, next) => {
  try {
    const [totalOrders, totalCustomers, totalRestaurants, totalFoodItems, paidOrders, recentOrders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Restaurant.countDocuments(),
      Food.countDocuments(),
      Order.find({ status: { $ne: 'cancelled' } }).select('total'),
      Order.find().sort({ placedAt: -1 }).limit(8).populate('user', 'name email'),
    ])
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0)
    const statusCounts = await Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
    res.json({ totalOrders, totalCustomers, totalRestaurants, totalFoodItems, totalRevenue, statusCounts, recentOrders })
  } catch (error) { next(error) }
}

export const getOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query
    const filter = status && status !== 'all' ? { status } : {}
    if (search) filter.orderId = { $regex: search, $options: 'i' }
    const orders = await Order.find(filter).sort({ placedAt: -1 }).populate('user', 'name email phone')
    res.json(orders)
  } catch (error) { next(error) }
}

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body
    if (!statuses.includes(status)) return res.status(400).json({ message: 'Invalid order status' })
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (order.status !== status) {
      order.status = status
      order.statusHistory.push({ status, timestamp: new Date() })
      await order.save()
    }
    res.json(order)
  } catch (error) { next(error) }
}

export const getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('name email phone createdAt').sort({ createdAt: -1 })
    res.json(customers)
  } catch (error) { next(error) }
}

export const createRestaurant = async (req, res, next) => {
  try { res.status(201).json(await Restaurant.create(req.body)) } catch (error) { next(error) }
}
export const updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' })
    res.json(restaurant)
  } catch (error) { next(error) }
}
export const deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id)
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' })
    await Food.deleteMany({ restaurantId: restaurant._id })
    res.status(204).end()
  } catch (error) { next(error) }
}

export const createFood = async (req, res, next) => {
  try { res.status(201).json(await Food.create(req.body)) } catch (error) { next(error) }
}
export const updateFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!food) return res.status(404).json({ message: 'Food item not found' })
    res.json(food)
  } catch (error) { next(error) }
}
export const deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id)
    if (!food) return res.status(404).json({ message: 'Food item not found' })
    res.status(204).end()
  } catch (error) { next(error) }
}
