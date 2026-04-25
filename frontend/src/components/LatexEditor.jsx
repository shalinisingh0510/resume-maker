import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import SplitPane from 'react-split-pane';
import { latexAPI, aiAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  HiPlay,
  HiDownload,
  HiUpload,
  HiSparkles,
  HiExclamationTriangle,
  HiCheckCircle,
  HiRefresh,
  HiEye,
  HiCode,
  HiDocumentText,
  HiCog,
  HiFolderOpen
} from 'react-icons/hi';

const LatexEditor = ({ initialLatexSource, onLatexChange, templateId }) => {
  const [latexSource, setLatexSource] = useState(initialLatexSource || '');
  const [compiledHtml, setCompiledHtml] = useState('');
  const [compiling, setCompiling] = useState(false);
  const [compilationErrors, setCompilationErrors] = useState([]);
  const [compilationWarnings, setCompilationWarnings] = useState([]);
  const [autoCompile, setAutoCompile] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);
  const [theme, setTheme] = useState('vs-dark');
  const [activeView, setActiveView] = useState('split'); // 'editor', 'preview', 'split'
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [splitPosition, setSplitPosition] = useState('50%');
  const [templates, setTemplates] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  const editorRef = useRef(null);
  const compilationTimeoutRef = useRef(null);
  const previewRef = useRef(null);

  const latexTemplates = [
    {
      id: 'modern-resume',
      name: 'Modern Resume',
      description: 'Clean and modern resume template',
      source: `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{enumitem}

\\titleformat{\\section}{\\Large\\bfseries\\scshape}{\\thesection}{1em}{}
\\titleformat{\\subsection}{\\large\\bfseries}{\\thesubsection}{1em}{}

\\begin{document}

\\begin{center}
    \\textbf{\\Large Your Name} \\\\
    \\href{mailto:your.email@example.com}{your.email@example.com} $|$ 
    \\href{https://linkedin.com/in/yourprofile}{LinkedIn} $|$ 
    \\href{https://github.com/yourprofile}{GitHub} $|$ 
    +1 234 567 8900
\\end{center}

\\section{Summary}
Your professional summary goes here. Highlight your key achievements and skills.

\\section{Experience}
\\textbf{Senior Software Engineer} $|$ Company Name $|$ Jan 2020 -- Present
\\begin{itemize}[leftmargin=*, labelsep=5pt]
    \\item Led development of microservices architecture serving 1M+ users
    \\item Improved system performance by 40\\% through optimization
    \\item Mentored team of 5 junior developers
\\end{itemize}

\\textbf{Software Engineer} $|$ Previous Company $|$ Jun 2018 -- Dec 2019
\\begin{itemize}[leftmargin=*, labelsep=5pt]
    \\item Developed RESTful APIs for web applications
    \\item Implemented automated testing reducing bugs by 60\\%
\\end{itemize}

\\section{Education}
\\textbf{Bachelor of Science in Computer Science} $|$ University Name $|$ 2014 -- 2018
\\begin{itemize}[leftmargin=*, labelsep=5pt]
    \\item GPA: 3.8/4.0
    \\item Dean's List: 6 semesters
\\end{itemize}

\\section{Skills}
\\textbf{Programming:} JavaScript, Python, Java, C++ \\\\
\\textbf{Technologies:} React, Node.js, AWS, Docker, Kubernetes \\\\
\\textbf{Tools:} Git, Jenkins, JIRA, VS Code

\\end{document}`
    },
    {
      id: 'classic-resume',
      name: 'Classic Resume',
      description: 'Traditional professional resume template',
      source: `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=0.75in]{geometry}
\\usepackage{hyperref}
\\usepackage{times}

\\begin{document}

\\begin{center}
    \\textbf{\\Large Your Name} \\\\[0.2cm]
    123 Street Address, City, State 12345 \\\\
    (123) 456-7890 $|$ your.email@example.com \\\\
    \\href{https://linkedin.com/in/yourprofile}{linkedin.com/in/yourprofile}
\\end{center}

\\section*{Objective}
Dedicated professional with X years of experience seeking to leverage skills in...

\\section*{Professional Experience}
\\textbf{Job Title} -- Company Name, City, State \\\\
\\textit{Month Year -- Present}
\\begin{itemize}
    \\item Responsibility and achievement 1
    \\item Responsibility and achievement 2
    \\item Responsibility and achievement 3
\\end{itemize}

\\textbf{Previous Job Title} -- Company Name, City, State \\\\
\\textit{Month Year -- Month Year}
\\begin{itemize}
    \\item Previous responsibility 1
    \\item Previous responsibility 2
\\end{itemize}

\\section*{Education}
\\textbf{Degree Name} -- University Name, City, State \\\\
\\textit{Graduation Month Year}
\\begin{itemize}
    \\item Academic achievement 1
    \\item Academic achievement 2
\\end{itemize}

\\section*{Skills}
\\begin{itemize}
    \\item Skill Category: Skill 1, Skill 2, Skill 3
    \\item Technical Skills: Technology 1, Technology 2
    \\item Languages: Language 1, Language 2
\\end{itemize}

\\end{document}`
    },
    {
      id: 'academic-cv',
      name: 'Academic CV',
      description: 'Comprehensive academic curriculum vitae',
      source: `\\documentclass[11pt,a4paper]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{hyperref}
\\usepackage{times}
\\usepackage{hangcaps}

\\begin{document}

\\begin{center}
    \\textbf{\\Large Your Name, Ph.D.} \\\\[0.3cm]
    Department of Example \\\\
    University Name \\\\
    Address, City, State, ZIP \\\\[0.2cm]
    \\href{mailto:your.email@university.edu}{your.email@university.edu} $|$ 
    (123) 456-7890 \\\\
    \\href{https://yourwebsite.com}{yourwebsite.com}
\\end{center}

\\section*{Education}
\\textbf{Ph.D. in Your Field} -- University Name, Year \\\\
Dissertation: "Your Dissertation Title" \\\\
Advisor: Dr. Advisor Name

\\textbf{M.S. in Related Field} -- University Name, Year

\\textbf{B.S. in Your Field} -- University Name, Year

\\section*{Research Interests}
Research Interest 1, Research Interest 2, Research Interest 3

\\section*{Publications}
\\hangpara{\\textbf{1.}} Your Name, Co-author Name, Co-author Name (Year). 
"Title of Your Paper." \\textit{Journal Name}, Volume(Issue), pages. DOI

\\hangpara{\\textbf{2.}} Your Name, Co-author Name (Year). 
"Another Paper Title." \\textit{Conference Proceedings}, pages.

\\section*{Teaching Experience}
\\textbf{Instructor} -- Course Name (University), Semester \\\\
\\textit{Course Description}

\\textbf{Teaching Assistant} -- Course Name (University), Semester

\\section*{Awards and Honors}
\\begin{itemize}
    \\item Award Name, Year
    \\item Scholarship Name, Year
    \\item Grant Name, Amount, Year
\\end{itemize}

\\section*{Professional Service}
\\begin{itemize}
    \\item Reviewer for Journal Name, Years
    \\item Committee Member, Organization, Years
\\end{itemize}

\\end{document}`
    }
  ];

  useEffect(() => {
    if (initialLatexSource && !latexSource) {
      setLatexSource(initialLatexSource);
    }
  }, [initialLatexSource]);

  useEffect(() => {
    if (onLatexChange) {
      onLatexChange(latexSource);
    }
  }, [latexSource, onLatexChange]);

  const compileLatex = useCallback(async (source = latexSource) => {
    if (!source.trim()) {
      setCompilationErrors([{ message: 'LaTeX source is empty', line: 0, type: 'error' }]);
      setCompiledHtml('');
      return;
    }

    setCompiling(true);
    setCompilationErrors([]);
    setCompilationWarnings([]);

    try {
      const response = await latexAPI.compile({ latexSource: source });
      
      if (response.data.success) {
        setCompiledHtml(response.data.data.html);
        toast.success('LaTeX compiled successfully!');
      } else {
        setCompilationErrors([{ 
          message: response.data.message || 'Compilation failed', 
          line: 0, 
          type: 'error' 
        }]);
        setCompiledHtml('');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Compilation failed';
      const errors = parseLatexErrors(errorMessage);
      setCompilationErrors(errors);
      setCompiledHtml('');
      toast.error('LaTeX compilation failed');
    } finally {
      setCompiling(false);
    }
  }, [latexSource]);

  const parseLatexErrors = (errorMessage) => {
    const errors = [];
    const lines = errorMessage.split('\n');
    
    lines.forEach((line, index) => {
      if (line.includes('line') || line.includes('error') || line.includes('warning')) {
        const lineMatch = line.match(/line\s+(\d+)/i);
        const lineNumber = lineMatch ? parseInt(lineMatch[1]) : 0;
        
        errors.push({
          message: line.trim(),
          line: lineNumber,
          type: line.toLowerCase().includes('warning') ? 'warning' : 'error'
        });
      }
    });
    
    if (errors.length === 0) {
      errors.push({
        message: errorMessage,
        line: 0,
        type: 'error'
      });
    }
    
    return errors;
  };

  const handleEditorChange = (value) => {
    setLatexSource(value || '');
    
    if (autoCompile) {
      if (compilationTimeoutRef.current) {
        clearTimeout(compilationTimeoutRef.current);
      }
      
      compilationTimeoutRef.current = setTimeout(() => {
        compileLatex(value);
      }, 1000);
    }
  };

  const handleAiEnhance = async () => {
    if (!latexSource.trim()) {
      toast.error('Please write some LaTeX code first');
      return;
    }

    setAiEnhancing(true);
    try {
      const response = await aiAPI.enhance({
        type: 'latex',
        content: latexSource,
        prompt: 'Improve this LaTeX resume code for better formatting, clarity, and professional appearance. Fix any syntax errors and suggest improvements.'
      });
      
      if (response.data.success) {
        setLatexSource(response.data.data.enhanced);
        toast.success('LaTeX code enhanced with AI!');
      }
    } catch (error) {
      toast.error('AI enhancement failed');
    } finally {
      setAiEnhancing(false);
    }
  };

  const loadTemplate = (template) => {
    setLatexSource(template.source);
    setShowTemplateModal(false);
    toast.success(`Loaded ${template.name} template`);
  };

  const downloadLatex = () => {
    const blob = new Blob([latexSource], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.tex';
    a.click();
    URL.revokeObjectURL(url);
  };

  const uploadLatex = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLatexSource(e.target.result);
        toast.success('LaTeX file uploaded successfully');
      };
      reader.readAsText(file);
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure LaTeX language support
    monaco.languages.register({ id: 'latex' });
    
    monaco.languages.setMonarchTokensProvider('latex', {
      tokenizer: {
        root: [
          [/\\\\[a-zA-Z]+/, 'keyword'],
          [/[{}]/, 'delimiter.bracket'],
          [/\$.*?\$/, 'string'],
          [/\\begin\{.*?\}|\\end\{.*?\}/, 'keyword'],
          [/%.*$/, 'comment'],
        ],
      },
    });
    
    monaco.editor.setTheme(theme);
  };

  const renderErrorPanel = () => {
    if (compilationErrors.length === 0 && compilationWarnings.length === 0) {
      return null;
    }

    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center gap-2">
          <HiExclamationTriangle />
          Compilation Issues
        </h4>
        <div className="space-y-2">
          {[...compilationErrors, ...compilationWarnings].map((error, index) => (
            <div
              key={index}
              className={`text-sm p-2 rounded ${
                error.type === 'error' 
                  ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200' 
                  : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200'
              }`}
            >
              <div className="flex items-start gap-2">
                {error.type === 'error' ? (
                  <HiExclamationTriangle className="mt-0.5 flex-shrink-0" />
                ) : (
                  <HiExclamationTriangle className="mt-0.5 flex-shrink-0" />
                )}
                <div>
                  {error.line > 0 && (
                    <span className="font-mono text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded">
                      Line {error.line}
                    </span>
                  )}
                  <p className="mt-1">{error.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => compileLatex()}
              disabled={compiling}
              className="btn btn-primary btn-sm flex items-center gap-2"
            >
              <HiPlay />
              {compiling ? 'Compiling...' : 'Compile'}
            </button>
            
            <button
              onClick={handleAiEnhance}
              disabled={aiEnhancing}
              className="btn btn-secondary btn-sm flex items-center gap-2"
            >
              <HiSparkles />
              {aiEnhancing ? 'Enhancing...' : 'AI Enhance'}
            </button>

            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />

            <button
              onClick={() => setShowTemplateModal(true)}
              className="btn btn-secondary btn-sm flex items-center gap-2"
            >
              <HiFolderOpen />
              Templates
            </button>

            <label className="btn btn-secondary btn-sm flex items-center gap-2 cursor-pointer">
              <HiUpload />
              Upload
              <input
                type="file"
                accept=".tex,.latex"
                onChange={uploadLatex}
                className="hidden"
              />
            </label>

            <button
              onClick={downloadLatex}
              className="btn btn-secondary btn-sm flex items-center gap-2"
            >
              <HiDownload />
              Download
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="auto-compile"
                checked={autoCompile}
                onChange={(e) => setAutoCompile(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="auto-compile" className="text-sm">
                Auto Compile
              </label>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setActiveView('editor')}
                className={`p-1.5 rounded ${activeView === 'editor' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
                title="Editor Only"
              >
                <HiCode />
              </button>
              <button
                onClick={() => setActiveView('split')}
                className={`p-1.5 rounded ${activeView === 'split' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
                title="Split View"
              >
                <HiDocumentText />
              </button>
              <button
                onClick={() => setActiveView('preview')}
                className={`p-1.5 rounded ${activeView === 'preview' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
                title="Preview Only"
              >
                <HiEye />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor and Preview */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'editor' && (
          <div className="h-full">
            <Editor
              height="100%"
              language="latex"
              value={latexSource}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme={theme}
              options={{
                minimap: { enabled: false },
                fontSize,
                wordWrap: wordWrap ? 'on' : 'off',
                lineNumbers: showLineNumbers ? 'on' : 'off',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        )}

        {activeView === 'preview' && (
          <div className="h-full overflow-auto">
            {compiledHtml ? (
              <iframe
                ref={previewRef}
                srcDoc={compiledHtml}
                className="w-full h-full border-0"
                title="LaTeX Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <HiDocumentText className="mx-auto h-12 w-12 mb-4" />
                  <p>Compile your LaTeX code to see the preview</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'split' && (
          <SplitPane
            split="vertical"
            minSize={300}
            defaultSize="50%"
            onChange={(size) => setSplitPosition(size)}
          >
            <div className="h-full border-r border-gray-200 dark:border-gray-700">
              <Editor
                height="100%"
                language="latex"
                value={latexSource}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                theme={theme}
                options={{
                  minimap: { enabled: false },
                  fontSize,
                  wordWrap: wordWrap ? 'on' : 'off',
                  lineNumbers: showLineNumbers ? 'on' : 'off',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
            <div className="h-full overflow-auto">
              {compiledHtml ? (
                <iframe
                  ref={previewRef}
                  srcDoc={compiledHtml}
                  className="w-full h-full border-0"
                  title="LaTeX Preview"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <HiDocumentText className="mx-auto h-12 w-12 mb-4" />
                    <p>Compile your LaTeX code to see the preview</p>
                  </div>
                </div>
              )}
            </div>
          </SplitPane>
        )}
      </div>

      {/* Error Panel */}
      {renderErrorPanel()}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Choose a Template</h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
            
            <div className="grid gap-4">
              {latexTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
                  onClick={() => loadTemplate(template)}
                >
                  <h4 className="font-semibold">{template.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {template.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LatexEditor;
