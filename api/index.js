import dotenv from 'dotenv'
import connectDB from '../server/config/db.js'
import app from '../server/app.js'

dotenv.config()

let connectionPromise = null

const ensureConnected = () => {
  if (!connectionPromise) {
    connectionPromise = connectDB().catch((error) => {
      console.error('[vercel] MongoDB connection failed:', error.message)
      connectionPromise = null
    })
  }
  return connectionPromise
}

ensureConnected()

export default app