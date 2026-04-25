import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { aiAPI, resumeAPI } from '../services/api';
import { HiSparkles, HiShieldCheck, HiOutlineClipboardCopy, HiRefresh, HiUpload, HiCheckCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const JOB_PROFILES = [
  'General Professional',
  'SDE 1 (Software Development Engineer I)',
  'SDE 2 (Software Development Engineer II)',
  'Full Stack Developer',
  'Gen AI Developer',
  'Data Scientist',
  'Data Analyst',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'Product Manager',
  'UI/UX Designer'
];

const AITools = () => {
  const { user, updateUser } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [textInput, setTextInput] = useState('');
  const [jobTitle, setJobTitle] = useState(JOB_PROFILES[0]);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState('score'); // 'score' or 'enhance'

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await resumeAPI.getAll();
      setResumes(res.data);
    } catch (error) {
      toast.error('Failed to fetch resumes');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === 'enhance' && !selectedResumeId) {
      toast.error('Select one of your saved resumes to use AI enhancement');
      return;
    }

    if (mode === 'score' && !selectedResumeId && !textInput.trim() && !resumeFile) {
      toast.error('Please select a resume, paste text, or upload a file');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let response;
      
      if (mode === 'score') {
        // Use FormData for scoring to support file upload
        const formData = new FormData();
        if (resumeFile) {
          formData.append('resumeFile', resumeFile);
        } else if (selectedResumeId) {
          formData.append('resumeId', selectedResumeId);
        } else {
          formData.append('resumeText', textInput);
        }
        formData.append('jobTitle', jobTitle);
        
        response = await aiAPI.score(formData);
      } else {
        const payload = {
          resumeId: selectedResumeId,
          jobTitle
        };
        response = await aiAPI.enhance(payload);
      }

      setResult({ type: mode, data: response.data.data });
      
      if (response.data.aiUsageCount !== undefined) {
        updateUser({ aiUsageCount: response.data.aiUsageCount });
      }
      
      toast.success(`AI ${mode === 'score' ? 'Scoring' : 'Enhancement'} complete!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'AI processing failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const name = (file.name || '').toLowerCase();
      const isPdf = name.endsWith('.pdf');
      const isTxt = name.endsWith('.txt');
      if (!isPdf && !isTxt) {
        toast.error('Please upload a PDF or TXT file');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        toast.error('File is too large. Maximum size is 15MB.');
        return;
      }
      setResumeFile(file);
      setTextInput('');
      setSelectedResumeId('');
    }
  };

  return (
    <div className="container-app py-12 animate-fadeIn">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold mb-4">AI Career Assistant</h1>
        <p className="text-lg text-[var(--text-secondary)]">
          Let our advanced AI analyze, score, and perfect your resume content for specific job roles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto items-start">
        {/* Input Section */}
        <div className="card shadow-xl p-8">
          <div className="flex p-1 bg-[var(--bg-secondary)] rounded-xl mb-8 w-fit border border-[var(--border-color)]">
            <button
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'score' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              onClick={() => setMode('score')}
            >
              Role-Based Score
            </button>
            <button
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'enhance' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              onClick={() => setMode('enhance')}
            >
              Enhance Content
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Target Role Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-muted)]">Target Job Role</label>
              <select
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="input cursor-pointer"
              >
                {JOB_PROFILES.map(profile => (
                  <option key={profile} value={profile}>{profile}</option>
                ))}
              </select>
            </div>

            {/* Input Options */}
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-muted)]">
                  {mode === 'enhance' ? 'Select Saved Resume (Required)' : 'Option 1: Select Saved Resume'}
                </label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => {
                    setSelectedResumeId(e.target.value);
                    if (e.target.value) {
                      setTextInput('');
                      setResumeFile(null);
                    }
                  }}
                  className="input cursor-pointer"
                >
                  <option value="">— Choose an existing resume —</option>
                  {resumes.map(r => (
                    <option key={r._id} value={r._id}>{r.title || 'Untitled Resume'}</option>
                  ))}
                </select>
              </div>

              {mode === 'score' ? (
                <>
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[var(--border-color)]"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                      <span className="bg-[var(--bg-card)] px-3 text-[var(--text-muted)]">OR</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-muted)]">Option 2: Upload Resume File (PDF/TXT)</label>
                    <div className="relative">
                      <input
                        type="file"
                        id="resume-upload"
                        accept=".pdf,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="resume-upload"
                        className={`flex items-center justify-center gap-3 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all ${resumeFile ? 'border-primary bg-primary/5' : 'border-[var(--border-color)] hover:border-primary/50'}`}
                      >
                        <HiUpload className={resumeFile ? 'text-primary' : 'text-[var(--text-muted)]'} size={24} />
                        <div className="text-left">
                          <p className="text-sm font-bold">{resumeFile ? resumeFile.name : 'Click to upload resume'}</p>
                          <p className="text-[10px] text-[var(--text-muted)]">PDF or TXT, max 15MB</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[var(--border-color)]"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                      <span className="bg-[var(--bg-card)] px-3 text-[var(--text-muted)]">OR</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-muted)]">Option 3: Paste Resume Text</label>
                    <textarea
                      value={textInput}
                      onChange={(e) => {
                        setTextInput(e.target.value);
                        if (e.target.value) {
                          setSelectedResumeId('');
                          setResumeFile(null);
                        }
                      }}
                      className="input min-h-[150px] text-sm font-medium"
                      placeholder="Paste your professional summary or experience bullet points here..."
                      disabled={!!selectedResumeId || !!resumeFile}
                    />
                  </div>
                </>
              ) : (
                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-xs text-primary">
                  Enhancement currently works only for resumes built in this website (saved resumes).
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full h-14 text-lg gap-3"
              disabled={
                loading ||
                (mode === 'enhance'
                  ? !selectedResumeId
                  : (!selectedResumeId && !textInput.trim() && !resumeFile))
              }
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                  AI is analyzing for {jobTitle}...
                </>
              ) : (
                <>
                  {mode === 'score' ? <HiShieldCheck size={24} /> : <HiSparkles size={24} />}
                  {mode === 'score' ? 'Generate Role Score' : 'Rewrite Content'}
                </>
              )}
            </button>
            
            {user?.subscriptionType === 'free' && (
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-center">
                <p className="text-xs font-bold text-amber-500">
                  Used {user.aiUsageCount} of 3 free AI interactions. 
                  <Link to="/pricing" className="ml-2 underline">Upgrade for unlimited access</Link>
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Results Section */}
        <div className="card shadow-2xl p-8 min-h-[600px] border-t-4 border-t-primary">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            AI Insight Report
          </h2>
          
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-5xl mb-6 grayscale">✨</div>
              <h3 className="text-xl font-bold mb-2">Ready to Analyze</h3>
              <p className="text-[var(--text-secondary)] max-w-xs">Fill in the details and submit to generate your AI-powered career insights for <strong>{jobTitle}</strong>.</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <div className="relative mb-8">
                 <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                 <HiSparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
              </div>
              <h3 className="text-xl font-bold mb-2">Analyzing Profile...</h3>
              <p className="text-[var(--text-secondary)] max-w-xs animate-pulse font-medium italic">Evaluating your skills against {jobTitle} requirements...</p>
            </div>
          )}

          {result?.type === 'score' && (
            <div className="animate-fadeIn space-y-10">
              <div className="flex flex-col md:flex-row items-center gap-8 bg-[var(--bg-secondary)] p-8 rounded-3xl border border-[var(--border-color)]">
                <div className="relative w-32 h-32 flex items-center justify-center">
                   <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-[var(--border-color)]" strokeWidth="3" />
                    <circle cx="18" cy="18" r="16" fill="none" 
                      className={result.data.overallScore >= 80 ? 'stroke-green-500' : result.data.overallScore >= 60 ? 'stroke-amber-500' : 'stroke-red-500'}
                      strokeWidth="3"
                      strokeDasharray={`${result.data.overallScore}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black">{result.data.overallScore}</span>
                    <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-tighter">ATS Match</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{jobTitle} Match</h3>
                  <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">{result.data.summary}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-green-500">Key Strengths</h4>
                  <ul className="space-y-3">
                    {result.data.strengths?.map((s, i) => (
                      <li key={i} className="text-sm font-semibold flex gap-2">
                        <HiCheckCircle className="text-green-500 w-5 h-5 shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-amber-500">Actionable Suggestions</h4>
                  <ul className="space-y-3">
                    {result.data.suggestions?.map((s, i) => (
                      <li key={i} className="text-sm font-semibold flex gap-2">
                        <HiRefresh className="text-amber-500 w-5 h-5 shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {result?.type === 'enhance' && (
            <div className="animate-fadeIn space-y-8">
              
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4">Recommended Keywords for {jobTitle}</h4>
                <div className="flex flex-wrap gap-2">
                  {result.data.keywords?.map((k, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary border border-primary/20">{k}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">AI Improvements</h4>
                <ul className="space-y-2">
                  {result.data.improvements?.map((imp, i) => (
                    <li key={i} className="text-sm font-medium flex gap-2">
                      <span className="text-primary">•</span> {imp}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Perfected Content</h4>
                  <button 
                    className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    onClick={() => {
                      navigator.clipboard.writeText(result.data.enhancedContent);
                      toast.success('Copied to clipboard');
                    }}
                  >
                    <HiOutlineClipboardCopy className="w-4 h-4" /> Copy
                  </button>
                </div>
                <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] text-sm font-medium text-[var(--text-primary)] whitespace-pre-wrap max-h-[350px] overflow-y-auto custom-scrollbar italic leading-relaxed">
                  "{result.data.enhancedContent}"
                </div>
              </div>
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITools;
