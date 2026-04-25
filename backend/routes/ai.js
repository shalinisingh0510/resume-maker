const express = require('express');
const Groq = require('groq-sdk');
const multer = require('multer');
const pdf = require('pdf-parse');
const User = require('../models/User');
const Resume = require('../models/Resume');
const { protect, checkAILimit } = require('../middleware/auth');
const { calculateLocalATSScore } = require('../utils/atsEngine');

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
      cb(null, false);
    }
  }
});

// Helper: Build resume text from structured data
const buildResumeText = (resume) => {
  let text = '';
  if (resume.personalDetails) {
    const p = resume.personalDetails;
    text += `Name: ${p.fullName}\nSummary: ${p.summary}\n`;
  }
  if (resume.experience && resume.experience.length > 0) {
    text += '\n--- EXPERIENCE ---\n';
    resume.experience.forEach(exp => {
      text += `${exp.position} at ${exp.company}\n${exp.description}\n`;
      if (exp.highlights) exp.highlights.forEach(h => { text += `• ${h}\n`; });
    });
  }
  if (resume.education && resume.education.length > 0) {
    text += '\n--- EDUCATION ---\n';
    resume.education.forEach(edu => {
      text += `${edu.degree} in ${edu.fieldOfStudy} - ${edu.institution}\n`;
    });
  }
  if (resume.skills && resume.skills.length > 0) {
    text += '\n--- SKILLS ---\n';
    resume.skills.forEach(skill => {
      text += `${skill.category}: ${skill.items.join(', ')}\n`;
    });
  }
  return text;
};

// Helper: Clean AI response JSON
const cleanAIResponse = (content) => {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    return JSON.parse(content);
  } catch (e) {
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

    // Limit text to avoid TPM issues
    const truncatedText = textToEnhance.substring(0, 5000);

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: `You are an expert resume consultant. Enhance content and provide JSON: {enhancedContent, improvements, keywords, tips}.` },
        { role: 'user', content: `Enhance this:\n\n${truncatedText}` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const aiResponse = cleanAIResponse(completion.choices[0].message.content);
    await User.findByIdAndUpdate(req.user._id, { $inc: { aiUsageCount: 1 } });
    res.json({ success: true, data: aiResponse, aiUsageCount: (req.user.aiUsageCount || 0) + 1 });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error processing AI enhancement' });
  }
});

// POST /api/ai/score - Hybrid AI + Local Keyword Scoring
router.post('/score', protect, checkAILimit, upload.single('resumeFile'), async (req, res) => {
  try {
    const { resumeId, resumeText, jobTitle } = req.body;
    let fullText = resumeText;

    // 1. Get Text from File, ID, or direct input
    if (req.file) {
      try {
        if (req.file.mimetype === 'application/pdf') {
          const data = await pdf(req.file.buffer);
          fullText = data.text;
        } else {
          fullText = req.file.buffer.toString('utf-8');
        }
      } catch (pdfErr) {
        fullText = req.file.buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, '');
      }
    } else if (resumeId && (!resumeText || resumeText === 'undefined')) {
      const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
      if (!resume) return res.status(404).json({ message: 'Resume not found' });
      fullText = buildResumeText(resume);
    }

    if (!fullText || fullText.trim().length < 20) {
      return res.status(400).json({ message: 'Resume content is missing or too short' });
    }

    const targetJob = jobTitle || 'General Professional';

    // 2. Local ATS Keyword Matching (Zero Token Usage)
    const localResult = calculateLocalATSScore(fullText, targetJob);

    // 3. AI Qualitative Analysis with Reduced Token Footprint
    // We only send keywords and a small snippet of the resume to Groq
    const resumeSnippet = fullText.substring(0, 3000); // Only first 3000 chars

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert career advisor. I have analyzed a resume for a ${targetJob} role using a keyword engine.
Results:
- Initial Score: ${localResult.overallScore}/100
- Keywords Found: ${localResult.matched.join(', ')}
- Keywords Missing: ${localResult.missing.join(', ')}

Your task: Provide a professional summary and actionable suggestions. 
Format as JSON: 
{
  "summary": "2-3 sentences about the match quality",
  "suggestions": ["list", "of", "4-6", "specific", "actionable", "items"],
  "strengths": ["3", "main", "strengths"],
  "weaknesses": ["3", "main", "weaknesses"]
}`
        },
        { role: 'user', content: `Here is a snippet of the resume for context:\n\n${resumeSnippet}` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 1000,
      response_format: { type: 'json_object' }
    });

    const aiQualitative = cleanAIResponse(completion.choices[0].message.content);

    // 4. Combine results
    const finalReport = {
      overallScore: localResult.overallScore,
      breakdown: {
        roleRelevance: { score: localResult.keywordMatchScore, maxScore: 70 },
        completeness: { score: localResult.sectionScore, maxScore: 30 }
      },
      strengths: aiQualitative.strengths || localResult.matched.slice(0, 3),
      weaknesses: aiQualitative.weaknesses || localResult.missing.slice(0, 3),
      suggestions: aiQualitative.suggestions || [],
      summary: aiQualitative.summary,
      localData: {
        matched: localResult.matched,
        missing: localResult.missing
      }
    };

    // Update DB
    await User.findByIdAndUpdate(req.user._id, { $inc: { aiUsageCount: 1 } });
    if (resumeId && resumeId !== 'undefined') {
      await Resume.findByIdAndUpdate(resumeId, {
        aiScore: finalReport.overallScore,
        aiSuggestions: finalReport.suggestions
      });
    }

    res.json({ success: true, data: finalReport, aiUsageCount: (req.user.aiUsageCount || 0) + 1 });
  } catch (error) {
    console.error('AI Score Hybrid Error:', error);
    res.status(500).json({ message: 'Error processing AI scoring', error: error.message });
  }
});

module.exports = router;
