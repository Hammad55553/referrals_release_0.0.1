const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const auth = require('../middlewares/auth');

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get user profile
router.get('/profile', auth, getProfile);

module.exports = router;
