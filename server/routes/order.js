const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, deleteOrder, getMyOrders, getOrderById, cancelOrder,failOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createOrder);
router.post('/verify', verifyPayment);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);
router.delete('/:id', protect, deleteOrder);
router.put('/:id/fail', failOrder);

module.exports = router;
