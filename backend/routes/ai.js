const express = require('express');
const Groq = require('groq-sdk');
const multer = require('multer');
const pdf = require('pdf-parse');
const User = require('../models/User');
const Resume = require('../models/Resume');
const { protect, checkAILimit } = require('../middleware/auth');

const router = express.Router();

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Multer config for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(null, false); // Reject silently or handle specifically
    }
  }
});

// Helper: Build resume text from structured data
const buildResumeText = (resume) => {
  let text = '';
  if (resume.personalDetails) {
    const p = resume.personalDetails;
    text += `Name: ${p.fullName}\nEmail: ${p.email}\nPhone: ${p.phone}\nLocation: ${p.location}\n`;
    if (p.summary) text += `Summary: ${p.summary}\n`;
  }
  if (resume.experience && resume.experience.length > 0) {
    text += '\n--- EXPERIENCE ---\n';
    resume.experience.forEach(exp => {
      text += `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})\n`;
      if (exp.description) text += `${exp.description}\n`;
      if (exp.highlights && exp.highlights.length > 0) {
        exp.highlights.forEach(h => { text += `• ${h}\n`; });
      }
    });
  }
  if (resume.education && resume.education.length > 0) {
    text += '\n--- EDUCATION ---\n';
    resume.education.forEach(edu => {
      text += `${edu.degree} in ${edu.fieldOfStudy} - ${edu.institution} (${edu.startDate} - ${edu.endDate})\n`;
      if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
    });
  }
  if (resume.skills && resume.skills.length > 0) {
    text += '\n--- SKILLS ---\n';
    resume.skills.forEach(skill => {
      text += `${skill.category}: ${skill.items.join(', ')}\n`;
    });
  }
  if (resume.projects && resume.projects.length > 0) {
    text += '\n--- PROJECTS ---\n';
    resume.projects.forEach(proj => {
      text += `${proj.name}: ${proj.description}\n`;
      if (proj.technologies && proj.technologies.length > 0) {
        text += `Technologies: ${proj.technologies.join(', ')}\n`;
      }
    });
  }
  return text;
};

// Helper: Clean AI response JSON
const cleanAIResponse = (content) => {
  try {
    // Remove potential markdown code blocks
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(content);
  } catch (e) {
    console.error('JSON Parse Error:', content);
    throw new Error('AI returned an invalid response format');
  }
};

// POST /api/ai/enhance - AI Resume Enhancement
router.post('/enhance', protect, checkAILimit, async (req, res) => {
  try {
    const { resumeId, resumeText } = req.body;
    let textToEnhance = resumeText;

    if (resumeId && !resumeText) {
      const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
      if (!resume) return res.status(404).json({ message: 'Resume not found' });
      textToEnhance = buildResumeText(resume);
    }

    if (!textToEnhance || textToEnhance.trim().length === 0) {
      return res.status(400).json({ message: 'No resume content provided' });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert resume consultant. Enhance the given resume content. Provide a JSON object with: "enhancedContent", "improvements" (array), "keywords" (array), "tips" (array).`
        },
        { role: 'user', content: `Enhance this:\n\n${textToEnhance}` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    const aiResponse = cleanAIResponse(completion.choices[0].message.content);

    await User.findByIdAndUpdate(req.user._id, { $inc: { aiUsageCount: 1 } });

    res.json({
      success: true,
      data: aiResponse,
      aiUsageCount: (req.user.aiUsageCount || 0) + 1
    });
  } catch (error) {
    console.error('AI Enhance Error:', error);
    res.status(500).json({ message: error.message || 'Error processing AI enhancement' });
  }
});

// POST /api/ai/score - AI Resume Scoring
router.post('/score', protect, checkAILimit, upload.single('resumeFile'), async (req, res) => {
  try {
    const { resumeId, resumeText, jobTitle } = req.body;
    let textToScore = resumeText;

    if (req.file) {
      try {
        if (req.file.mimetype === 'application/pdf') {
          const data = await pdf(req.file.buffer);
          textToScore = data.text;
        } else {
          textToScore = req.file.buffer.toString('utf-8');
        }
      } catch (err) {
        console.error('PDF Parse error:', err);
        return res.status(400).json({ message: 'Failed to read PDF file content' });
      }
    } else if (resumeId && (!resumeText || resumeText === 'undefined')) {
      const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
      if (!resume) return res.status(404).json({ message: 'Resume not found' });
      textToScore = buildResumeText(resume);
    }

    if (!textToScore || textToScore.trim().length < 20) {
      return res.status(400).json({ message: 'Resume content too short or missing' });
    }

    const targetJob = jobTitle || 'General Professional';

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert ATS specialist. Analyze resume for: ${targetJob}.
Format as JSON object with: "overallScore" (0-100), "breakdown" (object with roleRelevance, contentQuality, atsCompatibility, impact, completeness scores/maxScores), "strengths" (array), "weaknesses" (array), "suggestions" (array), "summary" (string).`
        },
        { role: 'user', content: `Score this resume for ${targetJob}:\n\n${textToScore}` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const aiResponse = cleanAIResponse(completion.choices[0].message.content);

    await User.findByIdAndUpdate(req.user._id, { $inc: { aiUsageCount: 1 } });

    if (resumeId && resumeId !== 'undefined') {
      await Resume.findByIdAndUpdate(resumeId, {
        aiScore: aiResponse.overallScore,
        aiSuggestions: aiResponse.suggestions || []
      });
    }

    res.json({
      success: true,
      data: aiResponse,
      aiUsageCount: (req.user.aiUsageCount || 0) + 1
    });
  } catch (error) {
    console.error('AI Score Error:', error);
    res.status(500).json({ 
      message: 'Error processing AI scoring',
      error: error.message
    });
  }
});

module.exports = router;
