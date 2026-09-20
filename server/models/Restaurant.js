import mongoose from 'mongoose'

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    cuisine: { type: String, required: true, trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    deliveryTime: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    priceRange: { type: String, default: '' },
    discount: { type: String, default: '' },
    vegetarian: { type: Boolean, default: false },
    image: { type: String, default: '' },
    logo: { type: String, default: '' },
    description: { type: String, default: '' },
    offers: [{ type: String }],
    categories: [{ type: String }],
  },
  {
    timestamps: true,
  }
)

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

export default Restaurant