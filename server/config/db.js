import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const LOCAL_URI = 'mongodb://127.0.0.1:27017/delishful'

const connectDB = async () => {
  // Vercel does not have a local MongoDB. Failing fast here (instead of
  // trying 127.0.0.1 and hanging) lets the API return a clean 503 message
  // instead of being killed with a serverless function timeout.
  if (process.env.VERCEL && !process.env.MONGODB_URI) {
    throw new Error(
      'MONGODB_URI is not set. Add it in Vercel → Settings → Environment Variables and redeploy.'
    )
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || LOCAL_URI, {
      serverSelectionTimeoutMS: 4000,
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`)
    throw error
  }
}

export default connectDB