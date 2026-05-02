const express = require('express');
const router = express.Router();
const { forgotPassword, resetPassword } = require('../controllers/authController');

const { 
  register, 
  login, 
  googleLogin, 
  getProfile, 
  updateProfile, 
  updatePassword 
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);

module.exports = router;