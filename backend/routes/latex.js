const express = require('express');
const Template = require('../models/Template');
const { protect } = require('../middleware/auth');

const router = express.Router();

const compileLatexToHtml = async (latexSource) => {
  const { parse, HtmlGenerator } = require('latex.js');
  const { createHTMLWindow } = require('svgdom');

  const prevWindow = global.window;
  const prevDocument = global.document;
  const window = createHTMLWindow();
  global.window = window;
  global.document = window.document;

  try {
    const generator = new HtmlGenerator({ hyphenate: false });
    parse(latexSource, { generator });
    const doc = generator.htmlDocument('https://cdn.jsdelivr.net/npm/latex.js/dist/');
    return `<!doctype html>${doc.documentElement.outerHTML}`;
  } finally {
    global.window = prevWindow;
    global.document = prevDocument;
  }
};

router.post('/compile', protect, async (req, res) => {
  try {
    const latexSource = String(req.body?.latexSource || '').trim();
    if (!latexSource) {
      return res.status(400).json({ message: 'latexSource is required.' });
    }

    const html = await compileLatexToHtml(latexSource);
    return res.json({
      success: true,
      data: {
        html
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: `LaTeX compile error: ${error.message}`
    });
  }
});

router.get('/template-source/:templateId', protect, async (req, res) => {
  try {
    const template = await Template.findOne({ templateId: req.params.templateId });
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    return res.json({
      success: true,
      data: {
        templateId: template.templateId,
        name: template.name,
        latexSource: template.config?.defaultLatexSource || ''
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch template LaTeX source.' });
  }
});

module.exports = router;
