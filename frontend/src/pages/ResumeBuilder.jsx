import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { resumeAPI, templateAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ResumePreview from '../components/ResumePreview';
import TemplateGallery from '../components/TemplateGallery';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import {
  HiSave,
  HiDownload,
  HiArrowLeft,
  HiUser,
  HiBriefcase,
  HiAcademicCap,
  HiLightningBolt,
  HiCode,
  HiCog,
  HiTrash,
  HiPlus,
  HiViewGrid,
  HiSparkles,
  HiLockClosed
} from 'react-icons/hi';

const initialResumeState = {
  title: 'Untitled Resume',
  template: 'overleaf-jake',
  personalDetails: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    summary: ''
  },
  education: [
    {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    }
  ],
  experience: [
    {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      highlights: ['']
    }
  ],
  skills: [{ category: '', items: [] }],
  projects: [{ name: '', description: '', technologies: [], link: '', startDate: '', endDate: '' }],
  latexSource: '',
  isLatexResume: false,
  thumbnail: ''
};

const ResumeBuilder = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resume, setResume] = useState(initialResumeState);
  const [resumeId, setResumeId] = useState(id && id !== 'new' ? id : null);
  const [templates, setTemplates] = useState([]);

  const [loading, setLoading] = useState(id && id !== 'new');
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const previewRef = useRef(null);

  const tabs = [
    { id: 'templates', label: 'Templates', icon: <HiViewGrid /> },
    { id: 'personal', label: 'Personal', icon: <HiUser /> },
    { id: 'experience', label: 'Experience', icon: <HiBriefcase /> },
    { id: 'education', label: 'Education', icon: <HiAcademicCap /> },
    { id: 'skills', label: 'Skills', icon: <HiCode /> },
    { id: 'projects', label: 'Projects', icon: <HiLightningBolt /> },
    { id: 'ai', label: 'AI Score', icon: <HiSparkles /> },
    { id: 'settings', label: 'Settings', icon: <HiCog /> }
  ];

  const selectedTemplateMeta = useMemo(
    () => templates.find((tpl) => tpl.templateId === resume.template),
    [templates, resume.template]
  );

  const isTemplateLocked = Boolean(
    selectedTemplateMeta?.isPremium && user?.subscriptionType !== 'premium'
  );

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (id && id !== 'new') {
      setResumeId(id);
      setLoading(true);
      fetchResume(id);
      return;
    }

    const preSelectedTemplate = searchParams.get('template');
    if (preSelectedTemplate) {
      setResume((prev) => ({ ...prev, template: preSelectedTemplate }));
    } else {
      setResume((prev) => ({ ...initialResumeState, template: prev.template || initialResumeState.template }));
    }

    setResumeId(null);
    setLoading(false);
  }, [id, searchParams]);

  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    try {
      const res = await templateAPI.getAll('all');
      setTemplates(res.data || []);
    } catch (error) {
      toast.error('Unable to load template catalog');
    } finally {
      setLoadingTemplates(false);
    }
  };

  const fetchResume = async (targetId) => {
    try {
      const res = await resumeAPI.getOne(targetId);
      setResume({ ...initialResumeState, ...res.data });
    } catch (error) {
      toast.error('Failed to load resume');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const captureResumeThumbnail = async () => {
    if (!previewRef.current) return resume.thumbnail || '';
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 0.35,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      return canvas.toDataURL('image/jpeg', 0.72);
    } catch (error) {
      console.error('Thumbnail capture failed:', error);
      return resume.thumbnail || '';
    }
  };

  const persistResume = async (eventType = 'save') => {
    const thumbnail = await captureResumeThumbnail();
    const payload = {
      ...resume,
      thumbnail,
      recordHistoryEvent: { eventType }
    };

    if (resumeId) {
      const res = await resumeAPI.update(resumeId, payload);
      setResume({ ...initialResumeState, ...res.data });
      return res.data;
    }

    const res = await resumeAPI.create(payload);
    const created = res.data;
    setResumeId(created._id);
    setResume({ ...initialResumeState, ...created });
    navigate(`/builder/${created._id}`, { replace: true });
    return created;
  };

  const handleSave = async () => {
    if (isTemplateLocked) {
      toast.error('Upgrade to PRO to save with this template.');
      navigate('/pricing');
      return;
    }

    setSaving(true);
    try {
      await persistResume('save');
      toast.success('Resume saved with snapshot history.');
    } catch (error) {
      if (error.response?.data?.limitReached) {
        toast.error(error.response.data.message);
        navigate('/pricing');
      } else {
        toast.error('Failed to save resume');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (isTemplateLocked) {
      toast.error('Upgrade to PRO to download this premium template.');
      navigate('/pricing');
      return;
    }

    setDownloading(true);
    try {
      await persistResume('download');
      toast.success('Saved to history. Generating PDF...');
    } catch (error) {
      toast.error('Could not save download snapshot. Continuing with PDF export.');
    }

    try {
      const element = previewRef.current;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `${resume.personalDetails?.fullName || 'resume'}_resume.pdf`.replace(/\s+/g, '_'),
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().from(element).set(opt).save();
      toast.success('PDF downloaded.');
    } catch (error) {
      toast.error('Failed to generate PDF');
    } finally {
      setDownloading(false);
    }
  };

  const handlePersonalDetailsChange = (e) => {
    const { name, value } = e.target;
    setResume((prev) => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, [name]: value }
    }));
  };

  const handleArrayFieldChange = (collection, index, field, value) => {
    setResume((prev) => {
      const newArray = [...prev[collection]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [collection]: newArray };
    });
  };

  const addArrayItem = (collection, emptyItem) => {
    setResume((prev) => ({ ...prev, [collection]: [...prev[collection], emptyItem] }));
  };

  const removeArrayItem = (collection, index) => {
    setResume((prev) => {
      if (!prev[collection] || prev[collection].length <= 1) return prev;
      const newArray = [...prev[collection]];
      newArray.splice(index, 1);
      return { ...prev, [collection]: newArray };
    });
  };

  const handleSkillsChange = (index, value) => {
    const itemsArray = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    handleArrayFieldChange('skills', index, 'items', itemsArray);
  };

  const handleHighlightsChange = (expIndex, value) => {
    const itemsArray = value
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    handleArrayFieldChange('experience', expIndex, 'highlights', itemsArray);
  };

  const handleTechChange = (projIndex, value) => {
    const itemsArray = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    handleArrayFieldChange('projects', projIndex, 'technologies', itemsArray);
  };

  if (loading || loadingTemplates) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden bg-[var(--bg-primary)]">
      <div className="w-full lg:w-[45%] flex flex-col border-r border-[var(--border-color)] bg-[var(--bg-primary)] shadow-2xl relative z-20">
        <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-secondary)] shrink-0">
          <div className="flex items-center gap-3 w-1/2">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-[var(--bg-primary)] rounded-lg text-[var(--text-secondary)] transition-colors"
            >
              <HiArrowLeft size={20} />
            </button>
            <input
              type="text"
              className="bg-transparent border-none text-lg font-bold w-full focus:ring-0 text-[var(--text-primary)]"
              value={resume.title}
              onChange={(e) => setResume((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Resume Title"
            />
          </div>
          <button className="btn btn-primary gap-2 h-10 px-4 text-xs" onClick={handleSave} disabled={saving || isTemplateLocked}>
            {saving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <HiSave className="w-4 h-4" />}
            Save
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-16 border-r border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col items-center py-4 gap-4 shrink-0 overflow-y-auto custom-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                title={tab.label}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[var(--bg-primary)]">
            <h2 className="text-xl font-bold mb-6 capitalize flex items-center gap-2">
              {tabs.find((t) => t.id === activeTab)?.icon}
              {activeTab} {activeTab === 'ai' ? 'Analysis' : 'Details'}
            </h2>

            {activeTab === 'templates' && (
              <TemplateGallery
                selectedTemplate={resume.template}
                onSelect={(templateId) => setResume((prev) => ({ ...prev, template: templateId }))}
              />
            )}

            {activeTab === 'personal' && (
              <div className="space-y-5 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Full Name</label>
                    <input type="text" name="fullName" value={resume.personalDetails.fullName} onChange={handlePersonalDetailsChange} className="input" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Email</label>
                    <input type="email" name="email" value={resume.personalDetails.email} onChange={handlePersonalDetailsChange} className="input" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Phone</label>
                    <input type="text" name="phone" value={resume.personalDetails.phone} onChange={handlePersonalDetailsChange} className="input" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Location</label>
                    <input type="text" name="location" value={resume.personalDetails.location} onChange={handlePersonalDetailsChange} className="input" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">LinkedIn</label>
                    <input type="text" name="linkedin" value={resume.personalDetails.linkedin} onChange={handlePersonalDetailsChange} className="input" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">GitHub</label>
                    <input type="text" name="github" value={resume.personalDetails.github} onChange={handlePersonalDetailsChange} className="input" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Professional Summary</label>
                  <textarea name="summary" value={resume.personalDetails.summary} onChange={handlePersonalDetailsChange} className="input h-32" />
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-6 animate-fadeIn">
                {resume.experience.map((exp, index) => (
                  <div key={index} className="card relative group">
                    <button
                      className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      onClick={() => removeArrayItem('experience', index)}
                    >
                      <HiTrash />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Company</label>
                        <input type="text" value={exp.company} onChange={(e) => handleArrayFieldChange('experience', index, 'company', e.target.value)} className="input" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Position</label>
                        <input type="text" value={exp.position} onChange={(e) => handleArrayFieldChange('experience', index, 'position', e.target.value)} className="input" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Location</label>
                        <input type="text" value={exp.location} onChange={(e) => handleArrayFieldChange('experience', index, 'location', e.target.value)} className="input" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Start Date</label>
                        <input type="text" value={exp.startDate} onChange={(e) => handleArrayFieldChange('experience', index, 'startDate', e.target.value)} className="input" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">End Date</label>
                        <input type="text" value={exp.endDate} onChange={(e) => handleArrayFieldChange('experience', index, 'endDate', e.target.value)} className="input" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Bullet Points (one per line)</label>
                        <textarea value={(exp.highlights || []).join('\n')} onChange={(e) => handleHighlightsChange(index, e.target.value)} className="input h-32 text-sm" />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  className="btn btn-secondary w-full border-dashed py-4 gap-2"
                  onClick={() =>
                    addArrayItem('experience', {
                      company: '',
                      position: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      current: false,
                      description: '',
                      highlights: ['']
                    })
                  }
                >
                  <HiPlus /> Add Experience
                </button>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-6 animate-fadeIn">
                {resume.education.map((edu, index) => (
                  <div key={index} className="card relative group">
                    <button
                      className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      onClick={() => removeArrayItem('education', index)}
                    >
                      <HiTrash />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Institution</label>
                        <input type="text" value={edu.institution} onChange={(e) => handleArrayFieldChange('education', index, 'institution', e.target.value)} className="input" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Degree</label>
                        <input type="text" value={edu.degree} onChange={(e) => handleArrayFieldChange('education', index, 'degree', e.target.value)} className="input" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Field of Study</label>
                        <input type="text" value={edu.fieldOfStudy} onChange={(e) => handleArrayFieldChange('education', index, 'fieldOfStudy', e.target.value)} className="input" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Start Date</label>
                        <input type="text" value={edu.startDate} onChange={(e) => handleArrayFieldChange('education', index, 'startDate', e.target.value)} className="input" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">End Date</label>
                        <input type="text" value={edu.endDate} onChange={(e) => handleArrayFieldChange('education', index, 'endDate', e.target.value)} className="input" />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  className="btn btn-secondary w-full border-dashed py-4 gap-2"
                  onClick={() =>
                    addArrayItem('education', {
                      institution: '',
                      degree: '',
                      fieldOfStudy: '',
                      startDate: '',
                      endDate: '',
                      gpa: '',
                      description: ''
                    })
                  }
                >
                  <HiPlus /> Add Education
                </button>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-6 animate-fadeIn">
                {resume.skills.map((skill, index) => (
                  <div key={index} className="card relative group">
                    <button
                      className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      onClick={() => removeArrayItem('skills', index)}
                    >
                      <HiTrash />
                    </button>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Category</label>
                        <input type="text" value={skill.category} onChange={(e) => handleArrayFieldChange('skills', index, 'category', e.target.value)} className="input" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Items (comma separated)</label>
                        <input type="text" value={(skill.items || []).join(', ')} onChange={(e) => handleSkillsChange(index, e.target.value)} className="input" />
                      </div>
                    </div>
                  </div>
                ))}
                <button className="btn btn-secondary w-full border-dashed py-4 gap-2" onClick={() => addArrayItem('skills', { category: '', items: [] })}>
                  <HiPlus /> Add Skill Category
                </button>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6 animate-fadeIn">
                {resume.projects.map((proj, index) => (
                  <div key={index} className="card relative group">
                    <button
                      className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      onClick={() => removeArrayItem('projects', index)}
                    >
                      <HiTrash />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Project Name</label>
                        <input type="text" value={proj.name} onChange={(e) => handleArrayFieldChange('projects', index, 'name', e.target.value)} className="input" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Description</label>
                        <textarea value={proj.description} onChange={(e) => handleArrayFieldChange('projects', index, 'description', e.target.value)} className="input h-20" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-[var(--text-muted)]">Technologies (comma separated)</label>
                        <input type="text" value={(proj.technologies || []).join(', ')} onChange={(e) => handleTechChange(index, e.target.value)} className="input" />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  className="btn btn-secondary w-full border-dashed py-4 gap-2"
                  onClick={() => addArrayItem('projects', { name: '', description: '', technologies: [], link: '', startDate: '', endDate: '' })}
                >
                  <HiPlus /> Add Project
                </button>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="card text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <HiSparkles className="text-primary text-3xl" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">AI Optimization</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-6 max-w-xs mx-auto">
                    Get an ATS score and rewrite suggestions for your selected resume role.
                  </p>
                  <button className="btn btn-primary w-full" onClick={() => navigate('/ai-tools')}>
                    Analyze with AI Tools
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="card">
                  <h3 className="font-bold mb-2">Export</h3>
                  <p className="text-xs text-[var(--text-muted)] mb-4">
                    Download creates a history snapshot so you can continue improving this version later.
                  </p>
                  <button className="btn btn-secondary w-full gap-2" onClick={handleDownloadPDF} disabled={downloading || isTemplateLocked}>
                    <HiDownload /> {downloading ? 'Preparing...' : 'Download PDF'}
                  </button>
                </div>
                <div className="card">
                  <h3 className="font-bold mb-2">Future LaTeX Workflow</h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    This resume now stores `latexSource`, `isLatexResume`, and snapshot history, so a LaTeX editor/compiler feature can be added without changing your saved data model.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[var(--bg-secondary)] relative overflow-hidden">
        <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)] flex justify-between items-center shrink-0">
          <h2 className="font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Preview
          </h2>
          <button className="btn btn-primary btn-sm gap-2" onClick={handleDownloadPDF} disabled={downloading || isTemplateLocked}>
            <HiDownload className="w-4 h-4" /> {downloading ? 'Preparing...' : 'Download PDF'}
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-12 flex justify-center custom-scrollbar bg-[var(--bg-secondary)] relative">
          {isTemplateLocked && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg-secondary)]/80 backdrop-blur-sm">
              <div className="card text-center p-8 max-w-sm">
                <HiLockClosed className="text-4xl text-primary mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Premium Template</h3>
                <p className="text-sm text-[var(--text-muted)] mb-4">
                  {selectedTemplateMeta?.name || 'This template'} is available in PRO. Upgrade to edit, save, and download with this layout.
                </p>
                <button className="btn btn-primary w-full" onClick={() => navigate('/pricing')}>
                  Upgrade Now
                </button>
              </div>
            </div>
          )}
          <div className="w-full max-w-[800px] shadow-2xl origin-top transition-transform">
            <ResumePreview ref={previewRef} resume={resume} template={resume.template} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
