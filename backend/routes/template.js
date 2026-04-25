const express = require('express');
const Template = require('../models/Template');
const router = express.Router();

// @route   GET /api/templates
// @desc    Get all templates
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, q } = req.query;
    const query = {};
    if (category === 'premium') {
      query.isPremium = true;
    } else if (category && category !== 'all') {
      query.category = category;
    }

    if (q && String(q).trim()) {
      const pattern = new RegExp(String(q).trim(), 'i');
      query.$or = [{ name: pattern }, { description: pattern }, { subcategory: pattern }];
    }
    
    const templates = await Template.find(query).sort({ sortOrder: 1, isPremium: 1, name: 1 });
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
