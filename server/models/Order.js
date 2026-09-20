import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
  {
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    name: { type: String, required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true },
    size: { type: Number, default: 0 },
    addOns: [
      {
        name: { type: String },
        price: { type: Number },
      },
    ],
    quantity: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
    specialInstructions: { type: String, default: '' },
  },
  { _id: true }
)

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: String, required: true, unique: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    coupon: { type: String, default: null },
    address: {
      type: { type: String },
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      house: { type: String },
      street: { type: String },
      address: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: { type: String },
    },
    paymentMethod: { type: String, required: true },
    restaurant: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
      name: { type: String },
      deliveryTime: { type: Number },
    },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
      default: 'placed',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    placedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.model('Order', orderSchema)

export default Order