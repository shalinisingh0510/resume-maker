const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create user
    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      subscriptionType: user.subscriptionType,
      aiUsageCount: user.aiUsageCount,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      subscriptionType: user.subscriptionType,
      aiUsageCount: user.aiUsageCount,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// GET /api/auth/me - Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      subscriptionType: user.subscriptionType,
      aiUsageCount: user.aiUsageCount,
      resumeCount: user.resumes.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/upgrade - Upgrade to premium (mock Stripe)
router.post('/upgrade', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.subscriptionType === 'premium') {
      return res.status(400).json({ message: 'User is already on premium plan' });
    }

    // Mock Stripe payment processing
    // In production, integrate with Stripe Checkout here
    user.subscriptionType = 'premium';
    await user.save();

    res.json({
      message: 'Successfully upgraded to Premium!',
      subscriptionType: user.subscriptionType
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error processing upgrade' });
  }
});

module.exports = router;
