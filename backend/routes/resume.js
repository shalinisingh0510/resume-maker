const express = require('express');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { protect, checkResumeLimit } = require('../middleware/auth');

const router = express.Router();

// POST /api/resume - Create a new resume
router.post('/', protect, checkResumeLimit, async (req, res) => {
  try {
    const resumeData = {
      ...req.body,
      user: req.user._id
    };

    const resume = await Resume.create(resumeData);

    // Add resume reference to user
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
    const resumes = await Resume.find({ user: req.user._id })
      .sort({ updatedAt: -1 });
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

// PUT /api/resume/:id - Update a resume
router.put('/:id', protect, async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const updatedResume = await Resume.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedResume);
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

    // Remove resume reference from user
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
