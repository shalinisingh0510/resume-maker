const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Resume',
    trim: true
  },
  template: {
    type: String,
    enum: ['clean', 'professional', 'modern'],
    default: 'clean'
  },
  personalDetails: {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    website: { type: String, default: '' },
    summary: { type: String, default: '' }
  },
  education: [{
    institution: { type: String, default: '' },
    degree: { type: String, default: '' },
    fieldOfStudy: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    gpa: { type: String, default: '' },
    description: { type: String, default: '' }
  }],
  experience: [{
    company: { type: String, default: '' },
    position: { type: String, default: '' },
    location: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    current: { type: Boolean, default: false },
    description: { type: String, default: '' },
    highlights: [{ type: String }]
  }],
  skills: [{
    category: { type: String, default: '' },
    items: [{ type: String }]
  }],
  projects: [{
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    technologies: [{ type: String }],
    link: { type: String, default: '' },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' }
  }],
  // LaTeX source code (optional)
  latexSource: {
    type: String,
    default: ''
  },
  // AI enhancement score
  aiScore: {
    type: Number,
    default: null
  },
  aiSuggestions: [{
    type: String
  }],
  // Track if resume was built from LaTeX
  isLatexResume: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
