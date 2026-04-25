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
      cb(new Error('Only .pdf and .txt files are supported'), false);
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

// POST /api/ai/enhance - AI Resume Enhancement
router.post('/enhance', protect, checkAILimit, async (req, res) => {
  try {
    const { resumeId, resumeText } = req.body;

    let textToEnhance = resumeText;

    // If resumeId is provided, fetch resume from DB
    if (resumeId && !resumeText) {
      const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      textToEnhance = buildResumeText(resume);
    }

    if (!textToEnhance || textToEnhance.trim().length === 0) {
      return res.status(400).json({ message: 'No resume content provided for enhancement' });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert resume consultant and professional career coach. Your task is to enhance the given resume content. Provide:

1. **Enhanced Content**: Rewrite each section with stronger action verbs, quantified achievements, and professional language.
2. **Bullet Point Improvements**: Transform weak bullet points into impactful, results-oriented statements using the STAR method (Situation, Task, Action, Result).
3. **Grammar & Clarity Fixes**: Correct any grammar issues and improve sentence clarity.
4. **Professional Summary**: If missing or weak, suggest a compelling professional summary.
5. **Keywords**: Suggest relevant industry keywords to include for ATS optimization.

Format your response as a JSON object with these keys:
- "enhancedContent": the full enhanced resume text
- "improvements": array of specific improvements made (strings)
- "keywords": array of suggested keywords
- "tips": array of additional tips for the resume`
        },
        {
          role: 'user',
          content: `Please enhance this resume:\n\n${textToEnhance}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' }
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);

    // Increment AI usage count for the user
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { aiUsageCount: 1 }
    });

    res.json({
      success: true,
      data: aiResponse,
      aiUsageCount: req.user.aiUsageCount + 1
    });
  } catch (error) {
    console.error('AI Enhance Error:', error);
    res.status(500).json({ message: 'Error processing AI enhancement' });
  }
});

// POST /api/ai/score - AI Resume Scoring with Job Profile Support & File Upload
router.post('/score', protect, checkAILimit, upload.single('resumeFile'), async (req, res) => {
  try {
    const { resumeId, resumeText, jobTitle } = req.body;
    let textToScore = resumeText;

    // 1. Handle File Upload
    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        const data = await pdf(req.file.buffer);
        textToScore = data.text;
      } else {
        textToScore = req.file.buffer.toString('utf-8');
      }
    } 
    // 2. Handle Resume ID from DB
    else if (resumeId && !resumeText) {
      const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      textToScore = buildResumeText(resume);
    }

    if (!textToScore || textToScore.trim().length === 0) {
      return res.status(400).json({ message: 'No resume content provided for scoring' });
    }

    const targetJob = jobTitle || 'General Professional';

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert resume evaluator and ATS (Applicant Tracking System) specialist. 
Analyze the given resume specifically for the role of: ${targetJob}.

Score the resume on a scale of 0-100 based on these criteria relative to the ${targetJob} role:
- **Role Relevance (25 pts)**: How well the experience and skills match ${targetJob} requirements.
- **Content Quality (20 pts)**: Action verbs, quantified achievements.
- **ATS Compatibility (20 pts)**: Keywords for ${targetJob}, standard formatting.
- **Impact & Results (20 pts)**: Measurable outcomes.
- **Completeness (15 pts)**: All essential sections present.

Format your response as a JSON object with these keys:
- "overallScore": number 0-100
- "breakdown": object with scores for each criterion (roleRelevance, contentQuality, atsCompatibility, impact, completeness) each with "score" (number) and "maxScore" (number)
- "strengths": array of 3-5 strength points
- "weaknesses": array of 3-5 areas to improve
- "suggestions": array of 5-8 actionable improvement suggestions
- "summary": a 2-3 sentence overview of the resume quality for a ${targetJob} position.`
        },
        {
          role: 'user',
          content: `Please score and analyze this resume for a ${targetJob} position:\n\n${textToScore}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 2048,
      response_format: { type: 'json_object' }
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);

    // Increment AI usage count for the user
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { aiUsageCount: 1 }
    });

    // Optionally save score to resume if ID was provided
    if (resumeId) {
      await Resume.findByIdAndUpdate(resumeId, {
        aiScore: aiResponse.overallScore,
        aiSuggestions: aiResponse.suggestions || []
      });
    }

    res.json({
      success: true,
      data: aiResponse,
      aiUsageCount: req.user.aiUsageCount + 1
    });
  } catch (error) {
    console.error('AI Score Error:', error);
    res.status(500).json({ message: 'Error processing AI scoring' });
  }
});

module.exports = router;
