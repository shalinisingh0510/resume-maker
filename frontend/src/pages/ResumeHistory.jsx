import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ResumeHistory = () => {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Resume History</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Manage and export your previously created resumes.
          </p>
        </div>
        <Link to="/builder" className="btn btn-primary">
          + Create New Resume
        </Link>
      </div>

      <div className="card glass p-0 overflow-hidden">
        {resumes.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>No resumes found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Template</th>
                  <th className="p-4 font-semibold">AI Score</th>
                  <th className="p-4 font-semibold">Last Modified</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map(resume => (
                  <tr key={resume._id} style={{ borderBottom: '1px solid var(--color-border)' }} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-medium text-white">{resume.title || 'Untitled Resume'}</td>
                    <td className="p-4 capitalize">{resume.template}</td>
                    <td className="p-4">
                      {resume.aiScore ? (
                        <span className={`badge ${resume.aiScore >= 80 ? 'badge-success' : resume.aiScore >= 60 ? 'badge-warning' : 'badge-danger'}`}>
                          {resume.aiScore}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="p-4">{format(new Date(resume.updatedAt), 'MMM dd, yyyy')}</td>
                    <td className="p-4 text-right flex justify-end gap-3">
                      <Link to={`/builder/${resume._id}`} className="text-indigo-400 hover:text-indigo-300 font-medium">Edit</Link>
                      <button onClick={() => deleteResume(resume._id)} className="text-red-400 hover:text-red-300 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeHistory;
