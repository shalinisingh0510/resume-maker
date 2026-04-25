import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import { HiPlus, HiPencilAlt, HiTrash, HiDocumentText } from 'react-icons/hi';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container-app py-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-3">Resume History</h1>
          <p className="text-[var(--text-secondary)]">
            Every save and download snapshot is tracked so you can iterate with confidence.
          </p>
        </div>
        <Link to="/builder" className="btn btn-primary h-12 px-6 gap-2">
          <HiPlus className="w-5 h-5" /> New Resume
        </Link>
      </div>

      <div className="card p-0 overflow-hidden shadow-xl">
        {resumes.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-4xl mb-6 text-[var(--text-muted)]">
              <HiDocumentText />
            </div>
            <h3 className="text-2xl font-bold mb-2">No history found</h3>
            <p className="text-[var(--text-secondary)] mb-8 max-w-sm">
              You have not created any resumes yet. Start building to generate history snapshots.
            </p>
            <Link to="/builder" className="btn btn-primary px-8">
              Create First Resume
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Preview</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Resume Title</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Template</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">History Events</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Last Modified</th>
                  <th className="p-5 text-xs font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {resumes.map((resume) => {
                  const history = resume.history || [];
                  const downloads = history.filter((entry) => entry.eventType === 'download').length;
                  const scores = (resume.scoreHistory || []).length;
                  const lastEvent = history.length ? history[history.length - 1] : null;

                  return (
                    <tr key={resume._id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors group">
                      <td className="p-5">
                        <div className="w-20 h-14 rounded-md border border-[var(--border-color)] overflow-hidden bg-[var(--bg-secondary)]">
                          {resume.thumbnail ? (
                            <img src={resume.thumbnail} alt="Resume thumbnail" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-[var(--text-muted)]">N/A</div>
                          )}
                        </div>
                      </td>
                      <td className="p-5">
                        <span className="font-bold text-[var(--text-primary)]">{resume.title || 'Untitled Resume'}</span>
                      </td>
                      <td className="p-5">
                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                          {resume.template}
                        </span>
                      </td>
                      <td className="p-5 text-sm text-[var(--text-secondary)]">
                        <div>Total: {history.length}</div>
                        <div>Downloads: {downloads}</div>
                        <div>Scores: {scores}</div>
                        <div>Last: {lastEvent?.eventType || 'none'}</div>
                      </td>
                      <td className="p-5 text-sm text-[var(--text-secondary)] font-medium">
                        {format(new Date(resume.updatedAt), 'MMM d, yyyy')}
                      </td>
                      <td className="p-5">
                        <div className="flex justify-end gap-4">
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeHistory;
