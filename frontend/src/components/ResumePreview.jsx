import { forwardRef } from 'react';

/**
 * SOLID PRINCIPLE: Strategy Pattern for Template Rendering
 * Each layout strategy is responsible for its own specific DOM structure and styling.
 * This makes the system easily extensible—adding a new layout category only requires 
 * adding a new strategy to the LAYOUT_STRATEGIES object.
 */

const LAYOUT_STRATEGIES = {
  professional: (p, exp, edu, skills, proj, primaryColor) => (
    <div className="font-serif">
      <header className="bg-slate-50 p-8 -mx-8 -mt-8 mb-8 border-b-4" style={{ borderBottomColor: primaryColor }}>
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: primaryColor }}>{p.fullName || 'YOUR NAME'}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-3 text-slate-600">
          <span>{p.email}</span> • <span>{p.phone}</span> • <span>{p.location}</span>
          {p.linkedin && <span style={{ color: primaryColor }}>{p.linkedin}</span>}
        </div>
        {p.summary && <p className="text-xs mt-4 text-slate-700 leading-relaxed text-justify">{p.summary}</p>}
      </header>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b-2 pb-1" style={{ color: primaryColor, borderColor: primaryColor }}>Experience</h2>
          <div className="space-y-6">
            {exp.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm">{item.position}</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{item.startDate} - {item.endDate}</span>
                </div>
                <p className="text-xs font-bold text-slate-500 mb-2">{item.company} {item.location && `• ${item.location}`}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {item.highlights?.map((h, i) => <li key={i} className="text-[11px] text-slate-600">{h}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b-2 pb-1" style={{ color: primaryColor, borderColor: primaryColor }}>Education</h2>
          {edu.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-sm">{item.institution}</h3>
                <p className="text-xs text-slate-600">{item.degree} in {item.fieldOfStudy}</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400">{item.endDate}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  ),

  student: (p, exp, edu, skills, proj, primaryColor) => (
    <div className="font-sans">
      <header className="flex justify-between items-center mb-8 border-l-8 pl-6" style={{ borderLeftColor: primaryColor }}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: primaryColor }}>{p.fullName || 'YOUR NAME'}</h1>
          <div className="flex gap-4 text-xs mt-1 text-slate-500">
            <span>{p.email}</span> | <span>{p.phone}</span>
          </div>
        </div>
        <div className="text-right text-[10px] text-slate-400 uppercase font-bold">
          {p.location}
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-3" style={{ color: primaryColor }}>
          <span className="w-8 h-1" style={{ backgroundColor: primaryColor }}></span> Education
        </h2>
        {edu.map((item, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex justify-between">
              <h3 className="font-bold text-sm">{item.institution}</h3>
              <span className="text-[10px] font-bold text-slate-400">{item.startDate} - {item.endDate}</span>
            </div>
            <p className="text-xs text-slate-600 font-medium">{item.degree} • GPA: {item.gpa}</p>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-3" style={{ color: primaryColor }}>
          <span className="w-8 h-1" style={{ backgroundColor: primaryColor }}></span> Skills & Interests
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.flatMap(s => s.items).map((skill, i) => (
            <span key={i} className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600">{skill}</span>
          ))}
        </div>
      </section>
    </div>
  ),

  creative: (p, exp, edu, skills, proj, primaryColor) => (
    <div className="flex gap-8 h-full min-h-[1050px] -m-8">
      {/* Sidebar */}
      <aside className="w-1/3 bg-slate-900 text-white p-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter leading-none mb-6">{p.fullName || 'YOUR NAME'}</h1>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3">Contact</h3>
            <p className="text-[10px] opacity-80 mb-1">{p.email}</p>
            <p className="text-[10px] opacity-80 mb-1">{p.phone}</p>
            <p className="text-[10px] opacity-80">{p.location}</p>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3">Skills</h3>
            {skills.map((s, i) => (
              <div key={i} className="mb-3">
                <p className="text-[9px] font-bold uppercase text-slate-500 mb-1">{s.category}</p>
                <div className="flex flex-wrap gap-1">
                  {s.items.map((item, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 bg-slate-800 rounded text-[8px]">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-8 bg-white">
        {p.summary && <p className="text-xs italic text-slate-500 mb-8 leading-relaxed border-l-4 pl-4" style={{ borderLeftColor: primaryColor }}>{p.summary}</p>}
        
        <section className="mb-8">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-6 pb-1 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>Experience</h2>
          {exp.map((item, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="font-bold text-sm uppercase">{item.position}</h3>
              <p className="text-[10px] font-bold mb-2" style={{ color: primaryColor }}>{item.company} | {item.startDate} - {item.endDate}</p>
              <ul className="space-y-1">
                {item.highlights?.map((h, i) => <li key={i} className="text-[10px] text-slate-600 flex gap-2"><span>•</span> {h}</li>)}
              </ul>
            </div>
          ))}
        </section>
      </main>
    </div>
  ),

  minimal: (p, exp, edu, skills, proj, primaryColor) => (
    <div className="max-w-[600px] mx-auto text-center font-sans py-10">
      <header className="mb-12">
        <h1 className="text-3xl font-light tracking-[0.4em] uppercase mb-3">{p.fullName || 'YOUR NAME'}</h1>
        <div className="text-[9px] uppercase tracking-widest text-slate-400 space-x-4">
          <span>{p.email}</span>
          <span>{p.phone}</span>
          <span>{p.location}</span>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] mb-8 text-slate-300">Experience</h2>
        {exp.map((item, idx) => (
          <div key={idx} className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-1">{item.position}</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3">{item.company} • {item.startDate} - {item.endDate}</p>
            <p className="text-[11px] text-slate-600 leading-relaxed text-center italic">{item.highlights?.[0]}</p>
          </div>
        ))}
      </section>
    </div>
  ),

  clean: (p, exp, edu, skills, proj, primaryColor) => (
    <div className="font-sans">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>{p.fullName || 'YOUR NAME'}</h1>
        <div className="h-1 w-20 bg-slate-200 mx-auto mb-4"></div>
        <p className="text-xs text-slate-500 uppercase tracking-widest">{p.email} • {p.phone} • {p.location}</p>
      </header>

      <section className="mb-8">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-center border-y border-slate-100 py-2 mb-6" style={{ color: primaryColor }}>Experience</h2>
        <div className="space-y-6">
          {exp.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-sm">{item.position}</h3>
                <span className="text-[10px] text-slate-400">{item.startDate} - {item.endDate}</span>
              </div>
              <p className="text-xs font-medium text-slate-500 mb-2">{item.company}</p>
              <ul className="list-disc pl-5 space-y-1">
                {item.highlights?.map((h, i) => <li key={i} className="text-[10px] text-slate-600">{h}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
};

const ResumePreview = forwardRef(({ resume, template = 'prof-1' }, ref) => {
  const p = resume.personalDetails || {};
  const edu = resume.education || [];
  const exp = resume.experience || [];
  const skills = resume.skills || [];
  const proj = resume.projects || [];

  // Determine category and variation
  const category = template.split('-')[0]; // professional, student, etc. (normalized mapping)
  const categoryMap = { prof: 'professional', stud: 'student', creat: 'creative', min: 'minimal', clean: 'clean' };
  const strategyKey = categoryMap[category] || 'clean';
  const variant = parseInt(template.split('-')[1]) || 1;

  // Dynamic Color Palettes
  const palettes = {
    prof: ['#1e293b', '#1e3a8a', '#334155', '#0f172a', '#1e40af'],
    stud: ['#2563eb', '#059669', '#7c3aed', '#db2777', '#2563eb'],
    creat: ['#f43f5e', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899'],
    clean: ['#374151', '#4b5563', '#111827', '#1f2937', '#4b5563'],
    min: ['#000000', '#222222', '#333333', '#111111', '#000000'],
  };

  const primaryColor = palettes[category]?.[(variant - 1) % 5] || '#1e293b';
  const renderStrategy = LAYOUT_STRATEGIES[strategyKey] || LAYOUT_STRATEGIES.clean;

  return (
    <div 
      ref={ref} 
      className="resume-preview p-8 bg-white shadow-lg mx-auto overflow-hidden" 
      style={{ width: '100%', maxWidth: '800px', minHeight: '1122px', boxSizing: 'border-box' }}
    >
      {renderStrategy(p, exp, edu, skills, proj, primaryColor)}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
