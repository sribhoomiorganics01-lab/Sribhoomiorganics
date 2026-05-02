const express = require('express');
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getBestSellers,
  getProductBySlug,
  getRelatedProducts,
  addReview,
  createProduct,
  updateProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { deleteProduct } = require('../controllers/productController');

router.delete('/:id', deleteProduct);
router.get('/featured', getFeaturedProducts);
router.get('/best-sellers', getBestSellers);
router.get('/slug/:slug', getProductBySlug);
router.get('/related/:id', getRelatedProducts);
router.get('/', getProducts);
router.post('/:id/reviews', protect, addReview);
router.post('/', upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), updateProduct);

module.exports = router;
