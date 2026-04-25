const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  templateId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['professional', 'student', 'creative', 'clean', 'minimal'],
    index: true
  },
  subcategory: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 1000,
    index: true
  },
  source: {
    provider: { type: String, default: '' },
    url: { type: String, default: '' }
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Template', templateSchema);
