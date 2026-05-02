const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    image: String,
    quantity: Number,

    // 🔥 ADD THIS
    variant: {
      quantity: String,
      price: Number
    }
  }
],
  shippingInfo: {
    fullName: {
      type: String,
      required: [true, 'Full name is required']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    email: String,
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required']
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cod'],
    default: 'razorpay'
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  itemsPrice: {
    type: Number,
    required: true,
    min: 0
  },
  shippingPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  taxPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  razorpayOrderId: String,
  deliveredAt: Date,
  notes: String
}, {
  timestamps: true
});

orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
