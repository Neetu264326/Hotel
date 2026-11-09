import connectDB from './config/db.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Restaurant from './models/Restaurant.js'
import Food from './models/Food.js'
import Coupon from './models/Coupon.js'
import User from './models/User.js'
import Order from './models/Order.js'
import Cart from './models/Cart.js'
import { restaurants } from '../src/data/restaurants.js'
import { foods } from '../src/data/foods.js'
import { coupons } from '../src/data/coupons.js'

dotenv.config()

const seed = async () => {
  try {
    await connectDB()
    console.log('Clearing existing data...')
    await Promise.all([
      Restaurant.deleteMany({}),
      Food.deleteMany({}),
      Coupon.deleteMany({}),
      User.deleteMany({}),
      Order.deleteMany({}),
      Cart.deleteMany({}),
    ])

    console.log('Seeding restaurants...')
    const restaurantMap = new Map()
    const insertedRestaurants = []
    for (const r of restaurants) {
      const doc = await Restaurant.create({ ...r })
      restaurantMap.set(r.id, doc._id)
      insertedRestaurants.push({ legacyId: r.id, mongoId: doc._id })
    }
    console.log(`Seeded ${insertedRestaurants.length} restaurants`)

    console.log('Seeding foods...')
    const foodDocs = foods.map((f) => {
      const mongoRestaurantId = restaurantMap.get(f.restaurantId)
      if (!mongoRestaurantId) {
        throw new Error(`Restaurant ID ${f.restaurantId} not found in map for food ${f.name}`)
      }
      return {
        restaurantId: mongoRestaurantId,
        name: f.name,
        description: f.description,
        price: f.price,
        rating: f.rating,
        veg: f.veg,
        bestseller: f.bestseller,
        image: f.image,
        calories: f.calories,
        ingredients: f.ingredients,
        category: f.category,
        sizes: f.sizes,
      }
    })
    const result = await Food.insertMany(foodDocs)
    console.log(`Seeded ${result.length} foods`)

    console.log('Seeding coupons...')
    const couponDocs = coupons.map((c) => ({ ...c }))
    await Coupon.insertMany(couponDocs)
    console.log(`Seeded ${couponDocs.length} coupons`)

    // Optional, deliberate administrator bootstrap. Credentials only come
    // from environment variables and are hashed by the User model hook.
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Delishful Admin',
        email: process.env.ADMIN_EMAIL,
        phone: process.env.ADMIN_PHONE || '9000000000',
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
      })
      console.log(`Seeded admin account for ${process.env.ADMIN_EMAIL}`)
    } else {
      console.log('No admin seeded. Set ADMIN_EMAIL and ADMIN_PASSWORD to create one.')
    }

    console.log('Seed completed successfully!')
    console.log('\nRestaurant ID map (for reference):')
    for (const { legacyId, mongoId } of insertedRestaurants) {
      console.log(`  Legacy ${legacyId} -> ${mongoId}`)
    }
    console.log(`\nSample food IDs (for API testing):`)
    const sampleFoods = await Food.find().limit(3)
    for (const f of sampleFoods) {
      console.log(`  ${f.name}: /api/foods/${f._id}`)
    }
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    mongoose.connection.close()
    process.exit(0)
  }
}

seed()
