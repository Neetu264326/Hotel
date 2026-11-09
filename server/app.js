import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import restaurantRoutes from './routes/restaurantRoutes.js'
import couponRoutes from './routes/couponRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/error.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

// Lazy singleton connection, reused across serverless invocations so a
// warm Vercel function does not reconnect on every request.
let connectionPromise = null
export const ensureConnected = () => {
  if (!connectionPromise) {
    connectionPromise = connectDB().catch((error) => {
      console.error('[db] MongoDB connection failed:', error.message)
      connectionPromise = null
    })
  }
  return connectionPromise
}

const DB_CONNECT_TIMEOUT_MS = 4000

// Gate every /api request on a live database. If Mongo is unreachable we
// respond quickly with a clean JSON error instead of hanging until the
// serverless function is killed with a timeout.
const requireDB = async (req, res, next) => {
  if (mongoose.connection.readyState === 1) return next()
  try {
    await Promise.race([
      ensureConnected(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('database connect timeout')), DB_CONNECT_TIMEOUT_MS)
      ),
    ])
    if (mongoose.connection.readyState === 1) return next()
    throw new Error('database not ready')
  } catch {
    return res.status(503).json({
      message:
        'The database is unreachable. Set MONGODB_URI (MongoDB Atlas) in the Vercel dashboard → Settings → Environment Variables, then redeploy.',
    })
  }
}

app.use('/api', requireDB)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Delishful API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api', restaurantRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/admin', adminRoutes)

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
