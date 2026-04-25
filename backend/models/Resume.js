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
    default: 'overleaf-jake',
    index: true
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
  customSections: [{
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    items: [{ type: String }]
  }],
  sectionVisibility: {
    summary: { type: Boolean, default: true },
    experience: { type: Boolean, default: true },
    education: { type: Boolean, default: true },
    skills: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    customSections: { type: Boolean, default: true }
  },
  // LaTeX source code (optional)
  latexSource: {
    type: String,
    default: ''
  },
  thumbnail: {
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
  scoreHistory: [{
    jobTitle: { type: String, default: '' },
    companyName: { type: String, default: '' },
    companyType: { type: String, default: '' },
    overallScore: { type: Number, default: null },
    summary: { type: String, default: '' },
    suggestions: [{ type: String }],
    strengths: [{ type: String }],
    sourceType: { type: String, default: 'resume' },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  enhancementHistory: [{
    enhancedContent: { type: String, default: '' },
    improvements: [{ type: String }],
    keywords: [{ type: String }],
    tips: [{ type: String }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Track if resume was built from LaTeX
  isLatexResume: {
    type: Boolean,
    default: false
  },
  history: [{
    eventType: {
      type: String,
      enum: ['save', 'download', 'score', 'enhance', 'import'],
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    template: {
      type: String,
      default: ''
    },
    thumbnail: {
      type: String,
      default: ''
    },
    latexSource: {
      type: String,
      default: ''
    },
    snapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
