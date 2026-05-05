const Order = require('../models/Order');
const Product = require('../models/Product');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingInfo, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items'
      });
    }

    const itemsPrice = orderItems.reduce(
     (acc, item) => acc + (item.variant?.price || 0) * item.quantity,
      0
    );
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice = 0;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const order = await Order.create({
      user: req.user.id,
      orderItems,
      shippingInfo,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    });

    // 🔥 REDUCE STOCK FOR COD
if (paymentMethod === 'cod') {
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);

    if (!product) continue;

    const variant = product.variants.find(
      v => v.quantity === item.variant?.quantity
    );

    console.log("COD MATCH:", item.variant?.quantity, variant);

    if (!variant) {
       console.log("VARIANT NOT FOUND:", item);
       continue; // prevent crash
     }
      if (variant.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`
        });
      }

      variant.stock -= item.quantity;
    

    await product.save();
  }
}

    if (paymentMethod === 'razorpay') {
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalPrice * 100),
        currency: 'INR',
        receipt: `order_${order._id}`,
        notes: {
          orderId: order._id.toString()
        }
      });

      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      return res.status(201).json({
        success: true,
        order,
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency
        }
      });
      
    }

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false });
    }

    // 🔥 RESTORE STOCK BEFORE DELETE
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);

      if (!product) continue;

      const variant = product.variants.find(
        v => v.quantity === item.variant?.quantity
      );

      if (variant) {
        variant.stock += item.quantity;
      }

      await product.save();
    }

    // 🗑️ DELETE ORDER
    await order.deleteOne();

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ success: false });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const crypto = require('crypto');
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.paymentResult = {
      id: razorpay_payment_id,
      status: 'completed',
      update_time: Date.now(),
      email_address: order.shippingInfo.email
    };
    order.orderStatus = 'processing';
    await order.save();

    for (const item of order.orderItems) {
  const product = await Product.findById(item.product);

  if (!product) continue;

  // 🔥 find correct variant
  const variant = product.variants.find(
    v => v.quantity === item.variant?.quantity
  );

  if (variant) {
    // ❗ check stock
    if (variant.stock < item.quantity) {
      return res.status(400).json({
        message: `Not enough stock for ${product.name}`
      });
    }

    // 🔻 reduce stock
    variant.stock -= item.quantity;
  }

  await product.save();
}

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.product', 'name image price')
      .sort('-createdAt');

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name image price description');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // ✅ allow admin also
    if (
      order.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // ✅ prevent double cancel
    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order already cancelled'
      });
    }

    if (order.orderStatus === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel delivered order'
      });
    }

    // 🔥 UPDATE STATUS
    order.orderStatus = 'cancelled';
    await order.save();

    // 🔥 RESTORE STOCK
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);

      if (!product) continue;

      const variant = product.variants.find(
        v => v.quantity === item.variant?.quantity
      );

      if (variant) {
        variant.stock += item.quantity;
      }

      await product.save();
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.failOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false });
    }

    order.orderStatus = 'failed'; // 🔥 KEY FIX
    await order.save();

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ success: false });
  }
};