const express = require('express');
const Template = require('../models/Template');
const { protect } = require('../middleware/auth');

const router = express.Router();

const parseLatexError = (error) => {
  const errorString = error.toString();
  const errors = [];
  
  // Extract line numbers and error messages
  const lineRegex = /line\s+(\d+)/gi;
  const lines = errorString.split('\n');
  
  let currentError = {
    message: '',
    line: 0,
    type: 'error',
    step: 'compilation'
  };
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    if (trimmedLine.toLowerCase().includes('error') || 
        trimmedLine.toLowerCase().includes('undefined') ||
        trimmedLine.toLowerCase().includes('missing')) {
      
      const lineMatch = trimmedLine.match(/line\s+(\d+)/i);
      if (lineMatch) {
        if (currentError.message) {
          errors.push({ ...currentError });
        }
        currentError = {
          message: trimmedLine,
          line: parseInt(lineMatch[1]),
          type: 'error',
          step: 'compilation'
        };
      } else {
        currentError.message += (currentError.message ? ' ' : '') + trimmedLine;
      }
    } else if (trimmedLine.toLowerCase().includes('warning')) {
      const lineMatch = trimmedLine.match(/line\s+(\d+)/i);
      errors.push({
        message: trimmedLine,
        line: lineMatch ? parseInt(lineMatch[1]) : 0,
        type: 'warning',
        step: 'compilation'
      });
    }
  });
  
  if (currentError.message) {
    errors.push(currentError);
  }
  
  if (errors.length === 0) {
    errors.push({
      message: errorString,
      line: 0,
      type: 'error',
      step: 'compilation'
    });
  }
  
  return errors;
};

const validateLatexSyntax = (latexSource) => {
  const errors = [];
  const lines = latexSource.split('\n');
  
  // Basic syntax validation
  let braceCount = 0;
  let bracketCount = 0;
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // Count braces and brackets
    for (let char of line) {
      if (char === '{') braceCount++;
      else if (char === '}') braceCount--;
      else if (char === '[') bracketCount++;
      else if (char === ']') bracketCount--;
    }
    
    // Check for common LaTeX syntax issues
    if (line.includes('\\begin{') && !line.includes('\\end{')) {
      const envMatch = line.match(/\\begin\{([^}]+)\}/);
      if (envMatch) {
        const envName = envMatch[1];
        const endPattern = new RegExp(`\\\\end\\{${envName}\\}`);
        if (!latexSource.match(endPattern)) {
          errors.push({
            message: `Missing \\end{${envName}} for environment started at line ${lineNumber}`,
            line: lineNumber,
            type: 'error',
            step: 'syntax'
          });
        }
      }
    }
    
    // Check for undefined commands (basic check)
    const commandMatches = line.match(/\\([a-zA-Z]+)/g);
    if (commandMatches) {
      commandMatches.forEach(cmd => {
        const commandName = cmd.substring(1);
        // Common LaTeX commands that should be available
        const commonCommands = [
          'documentclass', 'usepackage', 'begin', 'end', 'title', 'author',
          'date', 'maketitle', 'section', 'subsection', 'subsubsection',
          'paragraph', 'subparagraph', 'textbf', 'textit', 'underline',
          'item', 'itemize', 'enumerate', 'description', 'label', 'ref',
          'cite', 'bibliography', 'bibliographystyle', 'includegraphics',
          'caption', 'footnote', 'marginnote', 'newpage', 'clearpage',
          'tableofcontents', 'listoffigures', 'listoftables', 'appendix',
          'abstract', 'href', 'url', 'email', 'today', 'newline', 'linebreak',
          'pagebreak', 'nopagebreak', 'vspace', 'hspace', 'quad', 'qquad',
          'ldots', 'vdots', 'ddots', 'dots', 'frac', 'sqrt', 'sum', 'prod',
          'int', 'lim', 'sin', 'cos', 'tan', 'log', 'ln', 'exp', 'infty'
        ];
        
        if (!commonCommands.includes(commandName) && 
            !commandName.includes('def') && 
            !commandName.includes('new') &&
            !commandName.includes('renew')) {
          // This might be an undefined command, but we'll be lenient
          // as many packages define additional commands
        }
      });
    }
  });
  
  // Check for unmatched braces
  if (braceCount !== 0) {
    errors.push({
      message: `Unmatched braces: ${braceCount > 0 ? braceCount + ' opening braces unclosed' : Math.abs(braceCount) + ' closing braces without opening'}`,
      line: 0,
      type: 'error',
      step: 'syntax'
    });
  }
  
  if (bracketCount !== 0) {
    errors.push({
      message: `Unmatched brackets: ${bracketCount > 0 ? bracketCount + ' opening brackets unclosed' : Math.abs(bracketCount) + ' closing brackets without opening'}`,
      line: 0,
      type: 'error',
      step: 'syntax'
    });
  }
  
  return errors;
};

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
      return res.status(400).json({ 
        success: false,
        message: 'LaTeX source is required.',
        errors: [{ message: 'LaTeX source is empty', line: 0, type: 'error', step: 'validation' }]
      });
    }

    const allErrors = [];
    const compilationSteps = [];

    // Step 1: Syntax validation
    compilationSteps.push({ step: 'syntax_validation', status: 'processing', message: 'Validating LaTeX syntax...' });
    const syntaxErrors = validateLatexSyntax(latexSource);
    allErrors.push(...syntaxErrors);
    compilationSteps[compilationSteps.length - 1].status = syntaxErrors.length > 0 ? 'warning' : 'completed';

    // Step 2: Pre-compilation checks
    compilationSteps.push({ step: 'pre_compilation', status: 'processing', message: 'Preparing compilation environment...' });
    
    // Check for required document structure
    if (!latexSource.includes('\\documentclass')) {
      allErrors.push({
        message: 'Missing \\documentclass declaration',
        line: 0,
        type: 'error',
        step: 'pre_compilation'
      });
    }
    
    if (!latexSource.includes('\\begin{document}') || !latexSource.includes('\\end{document}')) {
      allErrors.push({
        message: 'Missing \\begin{document} or \\end{document}',
        line: 0,
        type: 'error',
        step: 'pre_compilation'
      });
    }
    
    compilationSteps[compilationSteps.length - 1].status = 'completed';

    // Step 3: Compilation
    compilationSteps.push({ step: 'compilation', status: 'processing', message: 'Compiling LaTeX to HTML...' });
    
    let html = '';
    try {
      html = await compileLatexToHtml(latexSource);
      compilationSteps[compilationSteps.length - 1].status = 'completed';
    } catch (error) {
      compilationSteps[compilationSteps.length - 1].status = 'error';
      compilationSteps[compilationSteps.length - 1].message = `Compilation failed: ${error.message}`;
      const compilationErrors = parseLatexError(error);
      allErrors.push(...compilationErrors);
    }

    // Step 4: Post-processing
    compilationSteps.push({ step: 'post_processing', status: 'processing', message: 'Post-processing compiled output...' });
    
    // Add some basic styling if needed
    if (html && !html.includes('<style>')) {
      const defaultStyles = `
        <style>
          body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 1in; }
          .document { max-width: 100%; }
          h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
          p { margin-bottom: 0.5em; }
          ul, ol { margin-bottom: 0.5em; padding-left: 2em; }
          li { margin-bottom: 0.2em; }
        </style>
      `;
      html = html.replace('<head>', `<head>${defaultStyles}`);
    }
    
    compilationSteps[compilationSteps.length - 1].status = 'completed';

    const criticalErrors = allErrors.filter(err => err.type === 'error');
    
    return res.json({
      success: criticalErrors.length === 0,
      data: {
        html: html || '',
        errors: allErrors,
        compilationSteps,
        warnings: allErrors.filter(err => err.type === 'warning')
      },
      message: criticalErrors.length > 0 ? 
        `Compilation completed with ${criticalErrors.length} error(s)` : 
        'Compilation successful'
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error during LaTeX compilation: ${error.message}`,
      errors: [{
        message: `Internal error: ${error.message}`,
        line: 0,
        type: 'error',
        step: 'system'
      }]
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
