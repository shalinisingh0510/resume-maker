const express = require('express');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { protect, checkResumeLimit } = require('../middleware/auth');

const router = express.Router();

const MAX_HISTORY_ENTRIES = 30;

const sanitizeResumePayload = (payload = {}) => ({
  title: payload.title,
  template: payload.template,
  personalDetails: payload.personalDetails,
  education: payload.education,
  experience: payload.experience,
  skills: payload.skills,
  projects: payload.projects,
  latexSource: payload.latexSource,
  isLatexResume: payload.isLatexResume,
  thumbnail: payload.thumbnail,
  aiScore: payload.aiScore,
  aiSuggestions: payload.aiSuggestions
});

const buildResumeSnapshot = (resumeLike = {}) => ({
  title: resumeLike.title || '',
  template: resumeLike.template || '',
  personalDetails: resumeLike.personalDetails || {},
  education: resumeLike.education || [],
  experience: resumeLike.experience || [],
  skills: resumeLike.skills || [],
  projects: resumeLike.projects || [],
  latexSource: resumeLike.latexSource || '',
  isLatexResume: Boolean(resumeLike.isLatexResume)
});

const appendHistoryEntry = (resumeDoc, eventType = 'save') => {
  const normalizedType = eventType === 'download' ? 'download' : 'save';
  const entry = {
    eventType: normalizedType,
    title: resumeDoc.title || '',
    template: resumeDoc.template || '',
    thumbnail: resumeDoc.thumbnail || '',
    latexSource: resumeDoc.latexSource || '',
    snapshot: buildResumeSnapshot(resumeDoc)
  };

  const history = Array.isArray(resumeDoc.history) ? resumeDoc.history : [];
  history.push(entry);
  if (history.length > MAX_HISTORY_ENTRIES) {
    resumeDoc.history = history.slice(history.length - MAX_HISTORY_ENTRIES);
  } else {
    resumeDoc.history = history;
  }
};

// POST /api/resume - Create a new resume
router.post('/', protect, checkResumeLimit, async (req, res) => {
  try {
    const { recordHistoryEvent } = req.body || {};
    const resumePayload = sanitizeResumePayload(req.body);

    const resume = new Resume({
      ...resumePayload,
      user: req.user._id
    });

    appendHistoryEntry(resume, recordHistoryEvent?.eventType || 'save');
    await resume.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { resumes: resume._id }
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error('Create Resume Error:', error);
    res.status(500).json({ message: 'Server error creating resume' });
  }
});

// GET /api/resumes - Get all resumes for current user
router.get('/', protect, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    console.error('Get Resumes Error:', error);
    res.status(500).json({ message: 'Server error fetching resumes' });
  }
});

// GET /api/resume/:id - Get single resume
router.get('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    console.error('Get Resume Error:', error);
    res.status(500).json({ message: 'Server error fetching resume' });
  }
});

// GET /api/resume/:id/history - Get history events for one resume
router.get('/:id/history', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne(
      { _id: req.params.id, user: req.user._id },
      { history: 1, title: 1, template: 1, updatedAt: 1 }
    );

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({
      resumeId: resume._id,
      title: resume.title,
      template: resume.template,
      updatedAt: resume.updatedAt,
      history: resume.history || []
    });
  } catch (error) {
    console.error('Get Resume History Error:', error);
    res.status(500).json({ message: 'Server error fetching resume history' });
  }
});

// POST /api/resume/:id/history-event - append save/download history event
router.post('/:id/history-event', protect, async (req, res) => {
  try {
    const { eventType = 'save', thumbnail } = req.body || {};
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    if (typeof thumbnail === 'string' && thumbnail.length > 0) {
      resume.thumbnail = thumbnail;
    }

    appendHistoryEntry(resume, eventType);
    await resume.save();

    res.json(resume);
  } catch (error) {
    console.error('Resume History Event Error:', error);
    res.status(500).json({ message: 'Server error creating history event' });
  }
});

// PUT /api/resume/:id - Update a resume
router.put('/:id', protect, async (req, res) => {
  try {
    const { recordHistoryEvent } = req.body || {};
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const sanitizedPayload = sanitizeResumePayload(req.body);
    Object.entries(sanitizedPayload).forEach(([key, value]) => {
      if (value !== undefined) {
        resume[key] = value;
      }
    });

    if (recordHistoryEvent?.eventType) {
      appendHistoryEntry(resume, recordHistoryEvent.eventType);
    }

    await resume.save();
    res.json(resume);
  } catch (error) {
    console.error('Update Resume Error:', error);
    res.status(500).json({ message: 'Server error updating resume' });
  }
});

// DELETE /api/resume/:id - Delete a resume
router.delete('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    await Resume.findByIdAndDelete(req.params.id);

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { resumes: req.params.id }
    });

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete Resume Error:', error);
    res.status(500).json({ message: 'Server error deleting resume' });
  }
});

module.exports = router;
