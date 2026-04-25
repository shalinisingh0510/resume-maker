import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeAPI } from '../services/api';
import { HiPlus, HiDocumentText, HiLightningBolt, HiStar, HiTrash, HiPencilAlt } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await resumeAPI.getAll();
      setResumes(res.data || []);
    } catch (error) {
      toast.error('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;

    try {
      await resumeAPI.delete(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success('Resume deleted successfully');
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  const getDownloadCount = (resume) =>
    (resume.history || []).filter((entry) => entry.eventType === 'download').length;
  const getScoreCount = (resume) => (resume.scoreHistory || []).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container-app py-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-3">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-[var(--text-secondary)]">Manage your resumes, downloads, and AI optimizations.</p>
        </div>

        <Link to="/builder" className="btn btn-primary gap-2 h-12 px-6">
          <HiPlus className="w-5 h-5" /> Create New Resume
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card flex items-center gap-5 p-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <HiDocumentText className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Total Resumes</p>
            <p className="text-3xl font-extrabold">{resumes.length}</p>
          </div>
        </div>

        <div className="card flex items-center gap-5 p-6 border-l-4 border-l-amber-500">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <HiStar className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-1">Average Score</p>
            <p className="text-3xl font-extrabold">
              {resumes.length > 0 && resumes.some((r) => r.aiScore)
                ? Math.round(
                    resumes.reduce((acc, curr) => acc + (curr.aiScore || 0), 0) /
                      resumes.filter((r) => r.aiScore).length
                  )
                : '-'}
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-5 p-6 border-l-4 border-l-indigo-500">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <HiLightningBolt className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">AI Usage</p>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                  user?.subscriptionType === 'premium'
                    ? 'bg-indigo-500/20 text-indigo-400'
                    : 'bg-green-500/20 text-green-400'
                }`}
              >
                {user?.subscriptionType?.toUpperCase()}
              </span>
            </div>
            <p className="text-2xl font-extrabold">
              {user?.aiUsageCount}{' '}
              <span className="text-sm font-medium text-[var(--text-muted)]">
                / {user?.subscriptionType === 'premium' ? 'Unlimited' : '3'}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Resumes</h2>
      </div>

      {resumes.length === 0 ? (
        <div className="text-center py-20 card border-dashed bg-transparent flex flex-col items-center">
          <h3 className="text-2xl font-bold mb-2">No resumes found</h3>
          <p className="max-w-xs mx-auto text-[var(--text-secondary)] mb-8">
            Create your first professional resume using the builder.
          </p>
          <Link to="/builder" className="btn btn-primary px-8">
            Start Building
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <div key={resume._id} className="card p-0 overflow-hidden group hover:border-primary/50 transition-all">
              <div className="aspect-[4/3] bg-[var(--bg-secondary)] border-b border-[var(--border-color)] overflow-hidden">
                {resume.thumbnail ? (
                  <img
                    src={resume.thumbnail}
                    alt={resume.title || 'Resume thumbnail'}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-[var(--text-muted)]">
                    No thumbnail yet
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="px-2 py-1 rounded bg-[var(--bg-secondary)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    {resume.template}
                  </div>
                  {resume.aiScore ? (
                    <div
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        resume.aiScore >= 80
                          ? 'bg-green-500/10 text-green-500'
                          : resume.aiScore >= 60
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      Score: {resume.aiScore}
                    </div>
                  ) : null}
                </div>

                <Link to={`/builder/${resume._id}`} className="block mb-2 group-hover:text-primary transition-colors">
                  <h3 className="text-xl font-bold truncate">{resume.title || 'Untitled Resume'}</h3>
                </Link>

                <div className="flex flex-col gap-1 text-sm text-[var(--text-muted)] mb-6">
                  <span>
                    Last updated:{' '}
                    <span className="text-[var(--text-secondary)] font-medium">
                      {format(new Date(resume.updatedAt), 'MMM d, yyyy')}
                    </span>
                  </span>
                  <span>
                    Downloads:{' '}
                    <span className="text-[var(--text-secondary)] font-medium">{getDownloadCount(resume)}</span>
                  </span>
                  <span>
                    ATS Scores:{' '}
                    <span className="text-[var(--text-secondary)] font-medium">{getScoreCount(resume)}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                  <Link to={`/builder/${resume._id}`} className="flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
                    <HiPencilAlt className="w-4 h-4" /> Edit
                  </Link>
                  <button
                    onClick={() => deleteResume(resume._id)}
                    className="flex items-center gap-1.5 text-sm font-bold text-red-400 hover:text-red-500 transition-colors"
                  >
                    <HiTrash className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
