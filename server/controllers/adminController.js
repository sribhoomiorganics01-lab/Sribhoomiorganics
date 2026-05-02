const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Category = require('../models/Category');
const Settings = require('../models/settings');

// 🔍 GLOBAL SEARCH
exports.globalSearch = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json({ products: [], orders: [], users: [] });
    }

    const products = await Product.find({
      name: { $regex: q, $options: 'i' },
      isActive: true
    }).limit(5);

    const users = await User.find({
      name: { $regex: q, $options: 'i' }
    }).limit(5);

    const allOrders = await Order.find().sort({ createdAt: -1 }).limit(50);
    const orders = allOrders.filter(order =>
      order._id.toString().includes(q)
    );

    res.json({ products, users, orders });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Search failed' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalOrders,
      totalProducts,
      totalUsers,
      totalCategories,
      pendingOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Category.countDocuments(),
      Order.countDocuments({ orderStatus: 'pending' }),
    ]);
    // 🔥 LOW STOCK FIX (FINAL)
const allProducts = await Product.find();
console.log("ALL PRODUCTS:", allProducts);

let lowStock = 0;

allProducts.forEach(product => {
  if (!product.variants) return;

  const hasLowStock = product.variants.some(
    v => Number(v.stock) < 5
  );
  console.log("PRODUCT:", product.name);
console.log("VARIANTS:", product.variants);

  if (hasLowStock) {
    lowStock++;
  }
});

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalCategories,
        pendingOrders,
        lowStock
      }
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 📦 GET ALL ORDERS
exports.getAllOrders = async (req, res) => {
  try {
    // 1. Get orders from DB
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('orderItems.product', 'name image');

    // 2. Define custom status order
    const statusOrder = {
      pending: 1,
      processing: 2,
      shipped: 3,
      delivered: 4,
      cancelled: 5
    };

    // 3. Sort orders (status first, then latest date)
    orders.sort((a, b) => {
      if (statusOrder[a.orderStatus] !== statusOrder[b.orderStatus]) {
        return statusOrder[a.orderStatus] - statusOrder[b.orderStatus];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // 4. Send response
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


// 🔄 UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === 'delivered') {
      order.deliveredAt = Date.now();
    }

    await order.save();

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

// 📦 PRODUCTS
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category } = req.body;

    let variants = JSON.parse(req.body.variants);

    // 🔥 FIX STOCK TYPE
    variants.forEach(v => {
      v.stock = Number(v.stock) || 0;
    });

    const product = new Product({
      name,
      description,
      category,
      variants,
      image: req.file ? `/uploads/${req.file.filename}` : '',
      featured: req.body.featured,
      bestSeller: req.body.bestSeller,
      organic: req.body.organic
    });

    await product.save();

    res.json({ success: true, product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    let variants = JSON.parse(req.body.variants);

    // 🔥 FIX STOCK TYPE
    variants.forEach(v => {
      v.stock = Number(v.stock) || 0;
    });

    product.name = req.body.name;
    product.description = req.body.description;
    product.category = req.body.category;
    product.variants = variants;

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();

    res.json({ success: true, product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👥 USERS
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password');

    res.json({ success: true, users });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🏷️ CATEGORY CREATE
exports.createCategory = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }

    const category = await Category.create(data);

    res.status(201).json({ success: true, category });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🏷️ CATEGORY UPDATE
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.name = req.body.name;

    if (req.file) {
      category.image = `/uploads/${req.file.filename}`;
    }

    await category.save();

    res.json({ success: true, category });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑️ CATEGORY DELETE (FIXED)
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    // 🟢 STEP 3.1 — FIND CATEGORY TO DELETE
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        message: 'Category not found'
      });
    }

    // 🛑 STEP 3.2 — PREVENT DELETING GENERAL
    if (category.name === 'General') {
      return res.status(400).json({
        message: 'Cannot delete General category'
      });
    }

    // 🟢 STEP 3.3 — FIND GENERAL CATEGORY
    const generalCategory = await Category.findOne({ name: 'General' });

    if (!generalCategory) {
      return res.status(400).json({
        message: 'General category not found'
      });
    }

    // 🟢 STEP 3.4 — MOVE PRODUCTS TO GENERAL
    await Product.updateMany(
      { category: categoryId },
      { $set: { category: generalCategory._id } }
    );

    // 🟢 STEP 3.5 — DELETE CATEGORY
    await Category.findByIdAndDelete(categoryId);

    res.json({
      success: true,
      message: 'Category deleted and products moved to General'
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ⚙️ SETTINGS
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings();
    }

    if (req.body.marqueeText) {
      settings.marqueeText = req.body.marqueeText;
    }

    if (req.file) {
      settings.promoImage = `/uploads/${req.file.filename}`;
    }

    await settings.save();

    res.json(settings);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};