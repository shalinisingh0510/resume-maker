const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

// Check resume limit for free users
const checkResumeLimit = async (req, res, next) => {
  try {
    if (req.user.subscriptionType === 'premium') return next();

    const Resume = require('../models/Resume');
    const resumeCount = await Resume.countDocuments({ user: req.user._id });

    if (resumeCount >= 2) {
      return res.status(403).json({
        message: 'Free plan limit reached. Maximum 2 resumes allowed. Upgrade to Premium for unlimited resumes.',
        limitReached: true
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error checking limits' });
  }
};

// Check AI usage limit for free users
const checkAILimit = async (req, res, next) => {
  try {
    if (req.user.subscriptionType === 'premium') return next();

    if (req.user.aiUsageCount >= 3) {
      return res.status(403).json({
        message: 'Free plan AI usage limit reached. Maximum 3 analyses/enhancements allowed. Upgrade to Premium for unlimited AI usage.',
        limitReached: true
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error checking AI limits' });
  }
};

module.exports = { protect, checkResumeLimit, checkAILimit };
