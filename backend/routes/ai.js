const express = require('express');
const Groq = require('groq-sdk');
const multer = require('multer');
const User = require('../models/User');
const Resume = require('../models/Resume');
const { protect, checkAILimit } = require('../middleware/auth');
const { calculateComprehensiveATSReport } = require('../utils/atsEngine');
const { extractTextFromPdf } = require('../utils/pdfExtractor');

const router = express.Router();

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Multer config - increased limits and better handling
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 15 * 1024 * 1024, // 15MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const lowerName = (file.originalname || '').toLowerCase();
    const isPdf = lowerName.endsWith('.pdf');
    const isTxt = lowerName.endsWith('.txt');
    const mime = file.mimetype || '';
    const allowedMime =
      mime === 'application/pdf' ||
      mime === 'text/plain' ||
      mime === 'application/octet-stream';

    if ((isPdf || isTxt) && allowedMime) {
      return cb(null, true);
    }

    cb(new Error('Only PDF or TXT files are supported for ATS scoring.'));
  }
});

const scoreUpload = (req, res, next) => {
  upload.single('resumeFile')(req, res, (err) => {
    if (!err) return next();
    return res.status(400).json({ message: err.message || 'Invalid resume upload.' });
  });
};

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

    const truncatedText = textToEnhance.substring(0, 4000);

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: `Expert resume consultant. Enhance content and provide JSON: {enhancedContent, improvements, keywords, tips}.` },
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

// POST /api/ai/score - Comprehensive Hybrid ATS scoring
router.post('/score', protect, checkAILimit, scoreUpload, async (req, res) => {
  try {
    const { resumeId, resumeText, jobTitle, companyName, companyType } = req.body;
    let fullText = '';

    // 1. Robust Text Extraction
    if (req.file) {
      console.log(`Processing file: ${req.file.originalname}, size: ${req.file.size} bytes`);
      
      const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf');
      
      if (isPdf) {
        try {
          // options to make it more robust
          const { text, errors } = await extractTextFromPdf(req.file.buffer);
          fullText = text;
          if (errors.length) {
            console.warn('PDF extraction warnings:', errors.join(' | '));
          }
          
          // If extracted text is suspiciously short, try raw string extraction as a last resort
          if (!fullText || fullText.trim().length < 100) {
             const raw = req.file.buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
             if (raw.length > fullText.length) fullText = raw;
          }
        } catch (pdfErr) {
          console.error('PDF Parse fail:', pdfErr);
          // Fallback to raw extraction if the library itself crashes
          fullText = req.file.buffer.toString('utf-8').replace(/[^\x20-\x7E\n\r\t]/g, ' ');
        }
      } else {
        fullText = req.file.buffer.toString('utf-8');
      }
    } 
    
    // If file failed or no file, try other inputs
    if (!fullText || fullText.trim().length < 50) {
      if (resumeText && resumeText !== 'undefined' && resumeText.trim().length > 0) {
        fullText = resumeText;
      } else if (resumeId && resumeId !== 'undefined') {
        const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
        if (resume) fullText = buildResumeText(resume);
      }
    }

    if (!fullText || fullText.trim().length < 50) {
      return res.status(400).json({ 
        message: 'Could not extract enough text from the resume. Please try pasting the text manually.' 
      });
    }

    const targetJob = jobTitle || 'SDE 1 (Software Development Engineer I)';
    const targetCompany = companyName || 'General Company';
    const cType = companyType || (targetCompany.toLowerCase().match(/google|meta|amazon|apple|netflix|microsoft|uber|airbnb|stripe/) ? 'MAANG' : 'STARTUP');

    // 2. Comprehensive Local Analysis
    const report = calculateComprehensiveATSReport(fullText, targetJob, cType);

    // 3. AI Final Scoring
    const resumeSnippet = fullText.substring(0, 3500);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Senior Recruitment Director for ${cType}. Final ATS scoring for ${targetJob} at ${targetCompany}.
Local Report Info:
- Skill Match: ${report.skillAnalysis.score}%
- Education Tier Match: ${report.education.foundTier1.length > 0 ? 'Yes' : 'No'}
- Summary Match: ${report.summary.score}/100

Provide a comprehensive, high-quality analysis in JSON: {overallScore, breakdown, summary, strengths, weaknesses, suggestions, recruiterVerdict}`
        },
        { role: 'user', content: `Resume Context:\n\n${resumeSnippet}` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });

    const aiFinal = cleanAIResponse(completion.choices[0].message.content);

    await User.findByIdAndUpdate(req.user._id, { $inc: { aiUsageCount: 1 } });
    if (resumeId && resumeId !== 'undefined') {
      await Resume.findByIdAndUpdate(resumeId, {
        aiScore: aiFinal.overallScore,
        aiSuggestions: aiFinal.suggestions
      });
    }

    res.json({
      success: true,
      data: { ...aiFinal, localReport: report },
      aiUsageCount: (req.user.aiUsageCount || 0) + 1
    });
  } catch (error) {
    console.error('AI Score Final Error:', error);
    res.status(500).json({ message: 'Internal server error during scoring', error: error.message });
  }
});

module.exports = router;
