import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';
import toast from 'react-hot-toast';
import ResumePreview from '../components/ResumePreview';
import html2pdf from 'html2pdf.js';

const initialResumeState = {
  title: 'Untitled Resume',
  template: 'clean',
  personalDetails: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '', summary: '' },
  education: [{ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '', description: '' }],
  experience: [{ company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '', highlights: [''] }],
  skills: [{ category: '', items: [] }],
  projects: [{ name: '', description: '', technologies: [], link: '', startDate: '', endDate: '' }],
  latexSource: '',
  isLatexResume: false
};

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(initialResumeState);
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal details');
  
  const previewRef = useRef(null);

  const tabs = ['personal details', 'experience', 'education', 'skills', 'projects', 'settings'];

  useEffect(() => {
    if (id) {
      fetchResume();
    }
  }, [id]);

  const fetchResume = async () => {
    try {
      const res = await resumeAPI.getOne(id);
      setResume({ ...initialResumeState, ...res.data });
    } catch (error) {
      toast.error('Failed to load resume');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (id) {
        await resumeAPI.update(id, resume);
        toast.success('Resume updated!');
      } else {
        const res = await resumeAPI.create(resume);
        toast.success('Resume created!');
        navigate(`/builder/${res.data._id}`);
      }
    } catch (error) {
      if (error.response?.data?.limitReached) {
        toast.error(error.response.data.message, { duration: 5000 });
        navigate('/pricing');
      } else {
        toast.error('Failed to save resume');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    const element = previewRef.current;
    const opt = {
      margin: [10, 10, 10, 10], // top, left, bottom, right
      filename: `${resume.personalDetails?.fullName || 'resume'}_resume.pdf`.replace(/\s+/g, '_'),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    toast.success('Generating PDF...');
    html2pdf().from(element).set(opt).save();
  };

  const handlePersonalDetailsChange = (e) => {
    setResume(prev => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, [e.target.name]: e.target.value }
    }));
  };

  // --- Array Field Handlers ---
  const handleArrayFieldChange = (collection, index, field, value) => {
    setResume(prev => {
      const newArray = [...prev[collection]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [collection]: newArray };
    });
  };

  const addArrayItem = (collection, emptyItem) => {
    setResume(prev => ({ ...prev, [collection]: [...prev[collection], emptyItem] }));
  };

  const removeArrayItem = (collection, index) => {
    setResume(prev => {
      const newArray = [...prev[collection]];
      newArray.splice(index, 1);
      return { ...prev, [collection]: newArray };
    });
  };

  // --- Skill/Array string mapping ---
  const handleSkillsChange = (index, value) => {
    const itemsArray = value.split(',').map(s => s.trim());
    handleArrayFieldChange('skills', index, 'items', itemsArray);
  };

  const handleHighlightsChange = (expIndex, value) => {
    const itemsArray = value.split('\n').filter(s => s.trim() !== '');
    handleArrayFieldChange('experience', expIndex, 'highlights', itemsArray);
  };

  const handleTechChange = (projIndex, value) => {
    const itemsArray = value.split(',').map(s => s.trim());
    handleArrayFieldChange('projects', projIndex, 'technologies', itemsArray);
  };


  if (loading) {
    return <div className="flex justify-center py-20"><div className="spinner-lg"></div></div>;
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      
      {/* LEFT PANEL: Builder Form */}
      <div className="w-full lg:w-1/2 flex flex-col border-r border-slate-700 bg-slate-900 overflow-hidden">
        
        {/* Editor Header */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <input
            type="text"
            className="input bg-slate-700 border-transparent text-lg font-bold w-1/2 focus:bg-slate-600 focus:border-indigo-500"
            value={resume.title}
            onChange={(e) => setResume({...resume, title: e.target.value})}
            placeholder="Resume Title"
          />
          <div className="flex gap-2">
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <span className="spinner"></span> : 'Save Resume'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-700 custom-scrollbar shrink-0">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap capitalize transition-colors ${
                activeTab === tab ? 'text-indigo-400 border-b-2 border-indigo-400 bg-slate-800/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Editor Content Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          
          {/* PERSONAL DETAILS TAB */}
          {activeTab === 'personal details' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">Full Name</label>
                  <input type="text" name="fullName" value={resume.personalDetails.fullName} onChange={handlePersonalDetailsChange} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">Email Option</label>
                  <input type="email" name="email" value={resume.personalDetails.email} onChange={handlePersonalDetailsChange} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">Phone</label>
                  <input type="text" name="phone" value={resume.personalDetails.phone} onChange={handlePersonalDetailsChange} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">Location</label>
                  <input type="text" name="location" value={resume.personalDetails.location} onChange={handlePersonalDetailsChange} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">LinkedIn</label>
                  <input type="text" name="linkedin" value={resume.personalDetails.linkedin} onChange={handlePersonalDetailsChange} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">GitHub</label>
                  <input type="text" name="github" value={resume.personalDetails.github} onChange={handlePersonalDetailsChange} className="input" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Professional Summary</label>
                <textarea name="summary" value={resume.personalDetails.summary} onChange={handlePersonalDetailsChange} className="input h-32" />
              </div>
            </div>
          )}

          {/* EXPERIENCE TAB */}
          {activeTab === 'experience' && (
            <div className="space-y-6 animate-fadeIn">
              {resume.experience.map((exp, index) => (
                <div key={index} className="card p-4 bg-slate-800 border-slate-700 relative">
                  <button 
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-400 transition-colors"
                    onClick={() => removeArrayItem('experience', index)}
                  >
                    × Remove
                  </button>
                  <h3 className="text-lg font-bold text-white mb-4">Experience #{index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-300">Company</label>
                      <input type="text" value={exp.company} onChange={(e) => handleArrayFieldChange('experience', index, 'company', e.target.value)} className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-300">Position</label>
                      <input type="text" value={exp.position} onChange={(e) => handleArrayFieldChange('experience', index, 'position', e.target.value)} className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-300">Start Date</label>
                      <input type="text" placeholder="MM/YYYY" value={exp.startDate} onChange={(e) => handleArrayFieldChange('experience', index, 'startDate', e.target.value)} className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-300 flex justify-between">
                        End Date
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" checked={exp.current} onChange={(e) => handleArrayFieldChange('experience', index, 'current', e.target.checked)} />
                          <span className="text-xs">Current</span>
                        </label>
                      </label>
                      <input type="text" placeholder="MM/YYYY" value={exp.endDate} onChange={(e) => handleArrayFieldChange('experience', index, 'endDate', e.target.value)} disabled={exp.current} className="input disabled:opacity-50" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-slate-300">Location</label>
                      <input type="text" value={exp.location} onChange={(e) => handleArrayFieldChange('experience', index, 'location', e.target.value)} className="input" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-slate-300">Bullet Points (One per line)</label>
                      <textarea 
                        value={exp.highlights.join('\n')} 
                        onChange={(e) => handleHighlightsChange(index, e.target.value)} 
                        className="input h-32" 
                        placeholder="• Implemented feature X resulting in Y% increase..."
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                className="btn btn-secondary w-full border-dashed"
                onClick={() => addArrayItem('experience', { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '', highlights: [''] })}
              >
                + Add Experience
              </button>
            </div>
          )}

          {/* EDUCATION TAB */}
          {activeTab === 'education' && (
            <div className="space-y-6 animate-fadeIn">
              {resume.education.map((edu, index) => (
                <div key={index} className="card p-4 bg-slate-800 border-slate-700 relative">
                  <button className="absolute top-4 right-4 text-slate-400 hover:text-red-400" onClick={() => removeArrayItem('education', index)}>× Remove</button>
                  <h3 className="text-lg font-bold text-white mb-4">Education #{index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-slate-300">Institution</label>
                      <input type="text" value={edu.institution} onChange={(e) => handleArrayFieldChange('education', index, 'institution', e.target.value)} className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-300">Degree</label>
                      <input type="text" value={edu.degree} onChange={(e) => handleArrayFieldChange('education', index, 'degree', e.target.value)} className="input placeholder:text-slate-500" placeholder="e.g. B.S." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-300">Field of Study</label>
                      <input type="text" value={edu.fieldOfStudy} onChange={(e) => handleArrayFieldChange('education', index, 'fieldOfStudy', e.target.value)} className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-300">Start Date</label>
                      <input type="text" value={edu.startDate} onChange={(e) => handleArrayFieldChange('education', index, 'startDate', e.target.value)} className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-300">End Date</label>
                      <input type="text" value={edu.endDate} onChange={(e) => handleArrayFieldChange('education', index, 'endDate', e.target.value)} className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-300">GPA (Optional)</label>
                      <input type="text" value={edu.gpa} onChange={(e) => handleArrayFieldChange('education', index, 'gpa', e.target.value)} className="input" />
                    </div>
                  </div>
                </div>
              ))}
              <button className="btn btn-secondary w-full border-dashed" onClick={() => addArrayItem('education', { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '', description: '' })}>
                + Add Education
              </button>
            </div>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="space-y-6 animate-fadeIn">
              {resume.skills.map((skill, index) => (
                <div key={index} className="card p-4 bg-slate-800 border-slate-700 relative flex flex-col gap-4">
                  <button className="absolute top-4 right-4 text-slate-400 hover:text-red-400" onClick={() => removeArrayItem('skills', index)}>× Remove</button>
                  <h3 className="text-lg font-bold text-white pr-10">Skill Category #{index + 1}</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">Category Name</label>
                    <input type="text" value={skill.category} onChange={(e) => handleArrayFieldChange('skills', index, 'category', e.target.value)} className="input" placeholder="e.g. Languages, Frontend, Tools" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">Skills (Comma-separated)</label>
                    <input type="text" value={skill.items.join(', ')} onChange={(e) => handleSkillsChange(index, e.target.value)} className="input" placeholder="JavaScript, React, Node.js..." />
                  </div>
                </div>
              ))}
              <button className="btn btn-secondary w-full border-dashed" onClick={() => addArrayItem('skills', { category: '', items: [] })}>
                + Add Skill Category
              </button>
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-fadeIn">
              {resume.projects.map((proj, index) => (
                <div key={index} className="card p-4 bg-slate-800 border-slate-700 relative">
                  <button className="absolute top-4 right-4 text-slate-400 hover:text-red-400" onClick={() => removeArrayItem('projects', index)}>× Remove</button>
                  <h3 className="text-lg font-bold text-white mb-4">Project #{index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-300">Project Name</label>
                      <input type="text" value={proj.name} onChange={(e) => handleArrayFieldChange('projects', index, 'name', e.target.value)} className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-300">Link URL (Optional)</label>
                      <input type="text" value={proj.link} onChange={(e) => handleArrayFieldChange('projects', index, 'link', e.target.value)} className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-300">Start Date</label>
                      <input type="text" value={proj.startDate} onChange={(e) => handleArrayFieldChange('projects', index, 'startDate', e.target.value)} className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-300">End Date</label>
                      <input type="text" value={proj.endDate} onChange={(e) => handleArrayFieldChange('projects', index, 'endDate', e.target.value)} className="input" />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-sm font-medium mb-1 text-slate-300">Technologies (Comma-separated)</label>
                      <input type="text" value={proj.technologies.join(', ')} onChange={(e) => handleTechChange(index, e.target.value)} className="input" placeholder="React, Node, MongoDB..." />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-slate-300">Description</label>
                      <textarea value={proj.description} onChange={(e) => handleArrayFieldChange('projects', index, 'description', e.target.value)} className="input h-24" />
                    </div>
                  </div>
                </div>
              ))}
              <button className="btn btn-secondary w-full border-dashed" onClick={() => addArrayItem('projects', { name: '', description: '', technologies: [], link: '', startDate: '', endDate: '' })}>
                + Add Project
              </button>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn max-w-lg">
              
              <div className="card bg-slate-800 border-slate-700">
                <h3 className="font-bold text-lg mb-4 text-white border-b border-slate-700 pb-2">Select Template</h3>
                <div className="space-y-3">
                  {['clean', 'professional', 'modern'].map(tpl => (
                    <label key={tpl} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${resume.template === tpl ? 'bg-indigo-500/10 border-indigo-500' : 'border-slate-700 hover:border-slate-500'}`}>
                      <input 
                        type="radio" 
                        name="template" 
                        value={tpl} 
                        checked={resume.template === tpl} 
                        onChange={(e) => setResume({...resume, template: e.target.value})} 
                        className="accent-indigo-500" 
                      />
                      <span className="capitalize font-medium text-white">{tpl}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* RIGHT PANEL: Live Preview */}
      <div className="w-full lg:w-1/2 flex flex-col bg-slate-800 relative z-10 overflow-hidden" style={{ boxShadow: '-5px 0 25px rgba(0,0,0,0.5)' }}>
        <div className="p-4 border-b border-slate-700 bg-slate-900 flex justify-between items-center shrink-0">
          <h2 className="font-bold text-white flex items-center gap-2">
            <span>👁️</span> Live Preview
          </h2>
          <button className="btn btn-primary btn-sm flex items-center gap-2" onClick={handleDownloadPDF}>
            <span>⬇️</span> Download PDF
          </button>
        </div>
        
        {/* PDF Viewport Area */}
        <div className="flex-1 overflow-auto bg-slate-600 p-8 flex justify-center custom-scrollbar">
          {/* Scaling wrapper to fit desktop view */}
          <div className="w-full max-w-[800px] mx-auto origin-top lg:scale-[0.8] xl:scale-[0.9] 2xl:scale-100 transition-transform">
            <ResumePreview ref={previewRef} resume={resume} template={resume.template} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default ResumeBuilder;
