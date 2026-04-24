import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { aiAPI, resumeAPI } from '../services/api';
import toast from 'react-hot-toast';

const AITools = () => {
  const { user, updateUser } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [textInput, setTextInput] = useState('');
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
    if (!selectedResumeId && !textInput.trim()) {
      toast.error('Please select a resume or paste text');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const payload = {
        resumeId: selectedResumeId || undefined,
        resumeText: !selectedResumeId ? textInput : undefined
      };

      if (mode === 'score') {
        const res = await aiAPI.score(payload);
        setResult({ type: 'score', data: res.data.data });
      } else {
        const res = await aiAPI.enhance(payload);
        setResult({ type: 'enhance', data: res.data.data });
        if (res.data.aiUsageCount) {
          updateUser({ aiUsageCount: res.data.aiUsageCount });
        }
      }
      toast.success(`AI ${mode === 'score' ? 'Scoring' : 'Enhancement'} complete!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'AI processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app py-10 animate-fadeIn">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">AI Career Assistant</h1>
        <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Let our advanced AI analyze and perfect your resume.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Input Section */}
        <div className="card glass">
          <div className="flex gap-2 mb-6 p-1 bg-slate-800/50 rounded-lg w-fit">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'score' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setMode('score')}
            >
              Get ATS Score
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${mode === 'enhance' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setMode('enhance')}
            >
              Enhance Content
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Select Existing Resume</label>
              <select
                value={selectedResumeId}
                onChange={(e) => {
                  setSelectedResumeId(e.target.value);
                  if (e.target.value) setTextInput('');
                }}
                className="input"
              >
                <option value="">-- Choose a resume (or paste text below) --</option>
                {resumes.map(r => (
                  <option key={r._id} value={r._id}>{r.title || 'Untitled Resume'}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <hr className="flex-1 border-slate-700" />
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">OR</span>
              <hr className="flex-1 border-slate-700" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Paste Resume Text</label>
              <textarea
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value);
                  if (e.target.value) setSelectedResumeId('');
                }}
                className="input min-h-[200px]"
                placeholder="Paste your raw resume text here for analysis..."
                disabled={!!selectedResumeId}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full py-3 text-lg mt-2"
              disabled={loading || (!selectedResumeId && !textInput.trim())}
            >
              {loading ? (
                <span className="flex items-center gap-2"><span className="spinner"></span> Processing...</span>
              ) : mode === 'score' ? 'Analyze & Score Resume' : 'Enhance Resume via AI'}
            </button>
            
            {mode === 'enhance' && user?.subscriptionType === 'free' && (
              <p className="text-xs text-center mt-2 text-slate-400">
                You have used {user.aiUsageCount} of 2 free enhancements. 
                <Link to="/pricing" className="text-indigo-400 ml-1">Upgrade here.</Link>
              </p>
            )}
          </form>
        </div>

        {/* Results Section */}
        <div className="card glass min-h-[500px]">
          <h2 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-4">AI Analysis Results</h2>
          
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center h-[300px] text-center opacity-50">
              <div className="text-6xl mb-4">✨</div>
              <p>Submit your resume to see the magic happen.</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-[300px]">
              <div className="spinner-lg border-indigo-500 mb-4"></div>
              <p className="animate-pulse text-indigo-400">Analyzing your career profile...</p>
            </div>
          )}

          {result?.type === 'score' && (
            <div className="animate-fadeIn space-y-6">
              <div className="flex items-center gap-6 bg-slate-800/40 p-6 rounded-xl border border-slate-700 w-fit">
                <div className="score-circle">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-slate-700"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="currentColor" strokeWidth="3"
                    />
                    <path
                      className={result.data.overallScore >= 80 ? 'text-emerald-500' : result.data.overallScore >= 60 ? 'text-amber-500' : 'text-red-500'}
                      strokeDasharray={`${result.data.overallScore}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="currentColor" strokeWidth="3"
                    />
                  </svg>
                  <div className="score-text">
                    <span className="text-3xl font-bold">{result.data.overallScore}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-tight">Score</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">ATS Compatibility Score</h3>
                  <p className="text-sm text-slate-400 max-w-xs">{result.data.summary}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2"><span className="text-emerald-500">↑</span> Top Strengths</h4>
                <ul className="space-y-2">
                  {result.data.strengths?.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm bg-emerald-500/10 text-emerald-100 p-2 rounded border border-emerald-500/20">
                      <span>✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2"><span className="text-amber-500">⚡</span> Areas for Improvement</h4>
                <ul className="space-y-2">
                  {result.data.suggestions?.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm bg-amber-500/10 text-amber-100 p-2 rounded border border-amber-500/20">
                      <span>•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {result?.type === 'enhance' && (
            <div className="animate-fadeIn space-y-6">
              
              <div>
                <h4 className="font-bold text-lg mb-3 text-indigo-400">Suggested Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {result.data.keywords?.map((k, i) => (
                    <span key={i} className="badge bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 px-3 py-1">{k}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-3">Key Improvements Made</h4>
                <ul className="space-y-2 list-disc pl-5">
                  {result.data.improvements?.map((imp, i) => (
                    <li key={i} className="text-sm text-slate-300">{imp}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-end mb-3">
                  <h4 className="font-bold text-lg">Enhanced Content Output</h4>
                  <button 
                    className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(result.data.enhancedContent);
                      toast.success('Copied to clipboard');
                    }}
                  >
                    Copy All
                  </button>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-sm font-mono text-slate-300 whitespace-pre-wrap max-h-[400px] overflow-y-auto custom-scrollbar">
                  {result.data.enhancedContent}
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
