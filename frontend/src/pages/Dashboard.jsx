import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeAPI } from '../services/api';
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
      setResumes(res.data);
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
      setResumes(resumes.filter(r => r._id !== id));
      toast.success('Resume deleted successfully');
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="spinner-lg"></div></div>;
  }

  return (
    <div className="container-app py-10 animate-fadeIn">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user?.name}</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Plan: <span className={`font-semibold ${user?.subscriptionType === 'premium' ? 'text-indigo-400' : 'text-green-400'}`}>
              {user?.subscriptionType?.toUpperCase()}
            </span> | 
            AI Uses: {user?.aiUsageCount} / {user?.subscriptionType === 'premium' ? '∞' : '2'}
          </p>
        </div>
        
        <Link to="/builder" className="btn btn-primary">
          + Create New Resume
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="card glass">
          <h3 className="text-sm uppercase font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>Total Resumes</h3>
          <div className="text-3xl font-extrabold text-white">{resumes.length}</div>
        </div>
        <div className="card glass relative overflow-hidden">
          <h3 className="text-sm uppercase font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>Average AI Score</h3>
          <div className="text-3xl font-extrabold text-white">
            {resumes.length > 0 && resumes.some(r => r.aiScore)
              ? Math.round(resumes.reduce((acc, curr) => acc + (curr.aiScore || 0), 0) / resumes.filter(r => r.aiScore).length)
              : 'N/A'
            }
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10 text-6xl">🤖</div>
        </div>
        <div className="card glass" style={user?.subscriptionType === 'premium' ? { border: '1px solid var(--color-primary)' } : {}}>
          <h3 className="text-sm uppercase font-bold mb-1" style={{ color: 'var(--color-text-muted)' }}>Subscription</h3>
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-white uppercase">{user?.subscriptionType}</div>
            {user?.subscriptionType === 'free' && (
              <Link to="/pricing" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Upgrade</Link>
            )}
          </div>
        </div>
      </div>

      {/* Recent Resumes List */}
      <h2 className="text-2xl font-bold mb-6 text-white">Recent Resumes</h2>
      
      {resumes.length === 0 ? (
        <div className="text-center py-16 card glass border-dashed">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-xl text-white mb-2">No resumes yet</h3>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>Create your first ATS-friendly resume to get started.</p>
          <Link to="/builder" className="btn btn-primary">Create Resume</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map(resume => (
            <div key={resume._id} className="card glass flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <Link to={`/builder/${resume._id}`} className="text-xl font-bold text-white hover:text-indigo-400 transition-colors line-clamp-1 no-underline">
                  {resume.title || 'Untitled Resume'}
                </Link>
                {resume.aiScore && (
                  <span className={`badge ${resume.aiScore >= 80 ? 'badge-success' : resume.aiScore >= 60 ? 'badge-warning' : 'badge-danger'}`}>
                    Score: {resume.aiScore}
                  </span>
                )}
              </div>
              
              <div className="text-sm mb-6 flex-1" style={{ color: 'var(--color-text-secondary)' }}>
                <p>Template: {resume.template}</p>
                <p>Last edited: {format(new Date(resume.updatedAt), 'MMM dd, yyyy')}</p>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <Link to={`/builder/${resume._id}`} className="btn btn-ghost btn-sm px-0">Edit</Link>
                <button onClick={() => deleteResume(resume._id)} className="text-red-400 hover:text-red-300 text-sm font-medium">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
