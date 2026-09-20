import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema(
  {
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    name: { type: String, required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true },
    size: { type: Number, default: 0 },
    sizeName: { type: String, default: '' },
    addOns: [
      {
        name: { type: String },
        price: { type: Number },
      },
    ],
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true },
    specialInstructions: { type: String, default: '' },
  },
  { _id: true }
)

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    coupon: { type: String, default: null },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', default: null },
  },
  {
    timestamps: true,
  }
)

const Cart = mongoose.model('Cart', cartSchema)

export default Cart