const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/AuthUser'); // Assuming you have a User model
require('dotenv').config();

// JWT Secret Key
const jwtSecret = process.env.JWT_TOKEN;
console.log("JWT Token: ", jwtSecret);

// Register a new user
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ email, password });
    await user.save();

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login an existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, username: user.username, email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get authenticated user's profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
