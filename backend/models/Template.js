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
  description: {
    type: String
  },
  thumbnail: {
    type: String,
    required: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Template', templateSchema);
