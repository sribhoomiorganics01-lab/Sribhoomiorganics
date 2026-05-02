const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const { protect, admin } = require('../middleware/auth');

const {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  createCategory,
  updateCategory,
  deleteCategory,
  updateSettings,
  globalSearch
} = require('../controllers/adminController');

// 🔐 PROTECT ALL ADMIN ROUTES
router.use(protect);
router.use(admin);

// 🔍 SEARCH
router.get('/search', globalSearch);

// 📊 DASHBOARD
router.get('/stats', getDashboardStats);

// 📦 ORDERS
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// 🛒 PRODUCTS
router.post('/products', upload.single('image'), createProduct);
router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);

// 👥 USERS
router.get('/users', getAllUsers);

// 🏷️ CATEGORIES
router.post('/categories', upload.single('image'), createCategory);
router.put('/categories/:id', upload.single('image'), updateCategory);
router.delete('/categories/:id', deleteCategory);

// ⚙️ SETTINGS
router.put('/settings', upload.single('image'), updateSettings);

module.exports = router;