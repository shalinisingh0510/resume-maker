import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeAPI, latexAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import LatexEditor from '../components/LatexEditor';
import {
  HiArrowLeft,
  HiSave,
  HiDownload,
  HiEye,
  HiDocumentText,
  HiSparkles
} from 'react-icons/hi';
import html2pdf from 'html2pdf.js';

const LatexEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [resume, setResume] = useState(null);
  const [latexSource, setLatexSource] = useState('');
  const [compiledHtml, setCompiledHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [previewMode, setPreviewMode] = useState('compiled'); // 'compiled' or 'raw'

  useEffect(() => {
    if (id && id !== 'new') {
      loadResume(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadResume = async (resumeId) => {
    try {
      const response = await resumeAPI.getOne(resumeId);
      if (response.data.success) {
        const resumeData = response.data.data;
        setResume(resumeData);
        setLatexSource(resumeData.latexSource || '');
        
        // If it's a LaTeX resume, try to get compiled HTML
        if (resumeData.isLatexResume && resumeData.latexSource) {
          try {
            const compileResponse = await latexAPI.compile({ 
              latexSource: resumeData.latexSource 
            });
            if (compileResponse.data.success) {
              setCompiledHtml(compileResponse.data.data.html);
            }
          } catch (error) {
            console.log('Auto-compilation failed:', error);
          }
        }
      }
    } catch (error) {
      toast.error('Failed to load resume');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLatexChange = (newLatexSource) => {
    setLatexSource(newLatexSource);
  };

  const handleSave = async () => {
    if (!latexSource.trim()) {
      toast.error('Please write some LaTeX content before saving');
      return;
    }

    setSaving(true);
    try {
      const resumeData = {
        title: resume?.title || 'LaTeX Resume',
        template: resume?.template || 'latex-custom',
        latexSource,
        isLatexResume: true,
        personalDetails: resume?.personalDetails || {},
        education: resume?.education || [],
        experience: resume?.experience || [],
        skills: resume?.skills || [],
        projects: resume?.projects || [],
        sectionVisibility: resume?.sectionVisibility || {
          summary: true,
          experience: true,
          education: true,
          skills: true,
          projects: true,
          customSections: true
        }
      };

      let response;
      if (resume && id && id !== 'new') {
        response = await resumeAPI.update(id, resumeData);
      } else {
        response = await resumeAPI.create(resumeData);
      }

      if (response.data.success) {
        const savedResume = response.data.data;
        setResume(savedResume);
        
        // Update URL if this was a new resume
        if (!id || id === 'new') {
          navigate(`/latex-editor/${savedResume._id}`, { replace: true });
        }
        
        toast.success('Resume saved successfully!');
      }
    } catch (error) {
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!compiledHtml) {
      toast.error('Please compile the LaTeX first');
      return;
    }

    setDownloading(true);
    try {
      // Create a temporary element for PDF generation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = compiledHtml;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      const opt = {
        margin: 0,
        filename: `${resume?.title || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(tempDiv).save();
      document.body.removeChild(tempDiv);
      
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadLatex = () => {
    const blob = new Blob([latexSource], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume?.title || 'resume'}.tex`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('LaTeX file downloaded!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-ghost btn-sm flex items-center gap-2"
              >
                <HiArrowLeft />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {resume?.title || 'New LaTeX Resume'}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary btn-sm flex items-center gap-2"
              >
                <HiSave />
                {saving ? 'Saving...' : 'Save'}
              </button>
              
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              
              <button
                onClick={handleDownloadPDF}
                disabled={downloading || !compiledHtml}
                className="btn btn-secondary btn-sm flex items-center gap-2"
              >
                <HiDownload />
                {downloading ? 'Generating PDF...' : 'Download PDF'}
              </button>
              
              <button
                onClick={handleDownloadLatex}
                className="btn btn-secondary btn-sm flex items-center gap-2"
              >
                <HiDocumentText />
                Download .tex
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-[calc(100vh-4rem)]">
        <LatexEditor
          initialLatexSource={latexSource}
          onLatexChange={handleLatexChange}
          onCompiledHtmlChange={setCompiledHtml}
        />
      </div>

      {/* Status Bar */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>
              {latexSource.length} characters
            </span>
            <span>
              {latexSource.split('\n').length} lines
            </span>
            {compiledHtml && (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <HiEye />
                Compiled successfully
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {user?.subscriptionType === 'free' && (
              <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                Free Plan
              </span>
            )}
            {user?.subscriptionType === 'premium' && (
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                Premium
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatexEditorPage;
