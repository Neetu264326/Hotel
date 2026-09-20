import mongoose from 'mongoose'

const foodSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    veg: { type: Boolean, default: true },
    bestseller: { type: Boolean, default: false },
    image: { type: String, default: '' },
    calories: { type: Number, default: 0 },
    ingredients: [{ type: String }],
    category: { type: String, default: '' },
    sizes: [{ type: Number }],
  },
  {
    timestamps: true,
  }
)

foodSchema.index({ name: 'text', description: 'text', category: 'text' })

const Food = mongoose.model('Food', foodSchema)

export default Food