import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import restaurantRoutes from './routes/restaurantRoutes.js'
import couponRoutes from './routes/couponRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import { notFound, errorHandler } from './middleware/error.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Delishful API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api', restaurantRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/ai', aiRoutes)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.join(__dirname, '..', 'dist')

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'))
  })
}

app.use(notFound)
app.use(errorHandler)

export default app