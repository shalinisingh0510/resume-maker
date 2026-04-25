const express = require('express');
const Template = require('../models/Template');
const router = express.Router();

// @route   GET /api/templates
// @desc    Get all templates
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category && category !== 'all') {
      query.category = category;
    }
    
    const templates = await Template.find(query).sort({ isPremium: 1, name: 1 });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching templates', error: error.message });
  }
});

// @route   GET /api/templates/:templateId
// @desc    Get a single template by its string ID
// @access  Public
router.get('/:templateId', async (req, res) => {
  try {
    const template = await Template.findOne({ templateId: req.params.templateId });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(template);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching template', error: error.message });
  }
});

module.exports = router;
