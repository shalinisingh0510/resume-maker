const express = require('express');
const Resume = require('../models/Resume');
const User = require('../models/User');
const Groq = require('groq-sdk');
const multer = require('multer');
const { protect, checkResumeLimit } = require('../middleware/auth');
const { extractTextFromPdf } = require('../utils/pdfExtractor');

const router = express.Router();
const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

const MAX_HISTORY_ENTRIES = 30;

const sanitizeResumePayload = (payload = {}) => ({
  title: payload.title,
  template: payload.template,
  personalDetails: payload.personalDetails,
  education: payload.education,
  experience: payload.experience,
  skills: payload.skills,
  projects: payload.projects,
  customSections: payload.customSections,
  sectionVisibility: payload.sectionVisibility,
  latexSource: payload.latexSource,
  isLatexResume: payload.isLatexResume,
  thumbnail: payload.thumbnail,
  aiScore: payload.aiScore,
  aiSuggestions: payload.aiSuggestions,
  scoreHistory: payload.scoreHistory,
  enhancementHistory: payload.enhancementHistory
});

const buildResumeSnapshot = (resumeLike = {}) => ({
  title: resumeLike.title || '',
  template: resumeLike.template || '',
  personalDetails: resumeLike.personalDetails || {},
  education: resumeLike.education || [],
  experience: resumeLike.experience || [],
  skills: resumeLike.skills || [],
  projects: resumeLike.projects || [],
  customSections: resumeLike.customSections || [],
  sectionVisibility: resumeLike.sectionVisibility || {},
  latexSource: resumeLike.latexSource || '',
  isLatexResume: Boolean(resumeLike.isLatexResume)
});

const appendHistoryEntry = (resumeDoc, eventType = 'save') => {
  const allowedEvents = new Set(['save', 'download', 'score', 'enhance', 'import']);
  const normalizedType = allowedEvents.has(eventType) ? eventType : 'save';
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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const name = (file.originalname || '').toLowerCase();
    if (name.endsWith('.pdf') || name.endsWith('.txt')) return cb(null, true);
    return cb(new Error('Only PDF or TXT files are supported.'));
  }
});

const importUpload = (req, res, next) => {
  upload.single('resumeFile')(req, res, (err) => {
    if (!err) return next();
    return res.status(400).json({ message: err.message || 'Invalid resume upload.' });
  });
};

const normalizeImportedData = (data = {}, template = 'overleaf-jake') => {
  const safeArray = (value) => (Array.isArray(value) ? value : []);
  const safeString = (value) => (typeof value === 'string' ? value : '');

  return {
    title: safeString(data.title) || 'Imported Resume',
    template,
    personalDetails: {
      fullName: safeString(data?.personalDetails?.fullName),
      email: safeString(data?.personalDetails?.email),
      phone: safeString(data?.personalDetails?.phone),
      location: safeString(data?.personalDetails?.location),
      linkedin: safeString(data?.personalDetails?.linkedin),
      github: safeString(data?.personalDetails?.github),
      website: safeString(data?.personalDetails?.website),
      summary: safeString(data?.personalDetails?.summary)
    },
    education: safeArray(data.education).map((e) => ({
      institution: safeString(e?.institution),
      degree: safeString(e?.degree),
      fieldOfStudy: safeString(e?.fieldOfStudy),
      startDate: safeString(e?.startDate),
      endDate: safeString(e?.endDate),
      gpa: safeString(e?.gpa),
      description: safeString(e?.description)
    })),
    experience: safeArray(data.experience).map((e) => ({
      company: safeString(e?.company),
      position: safeString(e?.position),
      location: safeString(e?.location),
      startDate: safeString(e?.startDate),
      endDate: safeString(e?.endDate),
      current: Boolean(e?.current),
      description: safeString(e?.description),
      highlights: safeArray(e?.highlights).map((h) => safeString(h)).filter(Boolean)
    })),
    skills: safeArray(data.skills).map((s) => ({
      category: safeString(s?.category),
      items: safeArray(s?.items).map((i) => safeString(i)).filter(Boolean)
    })),
    projects: safeArray(data.projects).map((p) => ({
      name: safeString(p?.name),
      description: safeString(p?.description),
      technologies: safeArray(p?.technologies).map((t) => safeString(t)).filter(Boolean),
      link: safeString(p?.link),
      startDate: safeString(p?.startDate),
      endDate: safeString(p?.endDate)
    })),
    customSections: safeArray(data.customSections).map((s) => ({
      title: safeString(s?.title),
      content: safeString(s?.content),
      items: safeArray(s?.items).map((i) => safeString(i)).filter(Boolean)
    })),
    sectionVisibility: {
      summary: data?.sectionVisibility?.summary !== false,
      experience: data?.sectionVisibility?.experience !== false,
      education: data?.sectionVisibility?.education !== false,
      skills: data?.sectionVisibility?.skills !== false,
      projects: data?.sectionVisibility?.projects !== false,
      customSections: data?.sectionVisibility?.customSections !== false
    },
    latexSource: '',
    isLatexResume: false
  };
};

const fallbackStructureFromText = (text = '', template = 'overleaf-jake') => {
  const lines = String(text)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const emailLine = lines.find((line) => /@/.test(line)) || '';
  const phoneLine = lines.find((line) => /\+?\d[\d\s\-()]{7,}/.test(line)) || '';
  const nameLine = lines[0] || 'Imported Candidate';
  const summary = lines.slice(0, 4).join(' ').slice(0, 400);

  return normalizeImportedData(
    {
      title: `${nameLine} Resume`,
      personalDetails: {
        fullName: nameLine,
        email: emailLine,
        phone: phoneLine,
        summary
      },
      experience: [{ company: '', position: '', highlights: [summary].filter(Boolean) }],
      education: [{ institution: '', degree: '', fieldOfStudy: '' }],
      skills: [{ category: 'General', items: [] }],
      projects: []
    },
    template
  );
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

// POST /api/resume/import - Parse uploaded resume into editable structured format
router.post('/import', protect, importUpload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume file.' });
    }

    const template = req.body?.template || 'overleaf-jake';
    const mime = req.file.mimetype || '';
    const isPdf = mime === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf');
    let extractedText = '';

    if (isPdf) {
      const extracted = await extractTextFromPdf(req.file.buffer);
      extractedText = extracted.text || '';
    } else {
      extractedText = req.file.buffer.toString('utf8');
    }

    extractedText = String(extractedText || '').trim();
    if (extractedText.length < 40) {
      return res.status(400).json({
        message: 'Could not extract enough text from this resume. Try another PDF or upload as TXT.'
      });
    }

    let structuredResume = null;

    if (groq) {
      try {
        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          temperature: 0.2,
          max_tokens: 2500,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'You are a resume parser. Convert plain resume text into strict JSON object with this shape: {title, personalDetails:{fullName,email,phone,location,linkedin,github,website,summary}, education:[{institution,degree,fieldOfStudy,startDate,endDate,gpa,description}], experience:[{company,position,location,startDate,endDate,current,description,highlights}], skills:[{category,items}], projects:[{name,description,technologies,link,startDate,endDate}], customSections:[{title,content,items}], sectionVisibility:{summary,experience,education,skills,projects,customSections}}. Do not return markdown.'
            },
            {
              role: 'user',
              content: `Template selected: ${template}\n\nResume text:\n${extractedText.slice(0, 12000)}`
            }
          ]
        });

        const content = completion?.choices?.[0]?.message?.content || '{}';
        structuredResume = JSON.parse(content);
      } catch (error) {
        structuredResume = null;
      }
    }

    const normalized = structuredResume
      ? normalizeImportedData(structuredResume, template)
      : fallbackStructureFromText(extractedText, template);

    return res.json({
      success: true,
      data: normalized
    });
  } catch (error) {
    console.error('Resume Import Error:', error);
    return res.status(500).json({ message: 'Failed to import resume file.' });
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
