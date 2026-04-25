import { forwardRef } from 'react';

/**
 * SOLID PRINCIPLE: Strategy Pattern for Template Rendering
 */

const LAYOUT_STRATEGIES = {
  // --- JAKE'S RESUME (Traditional LaTeX / Overleaf style) ---
  'overleaf-jake': (p, exp, edu, skills, proj) => (
    <div className="font-serif text-[11pt] text-[#000] leading-tight">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold uppercase mb-1">{p.fullName || 'YOUR NAME'}</h1>
        <div className="text-[10pt] flex justify-center gap-2 text-gray-700">
          <span>{p.phone}</span> | <span>{p.email}</span> | <span>{p.location}</span>
          {p.linkedin && <span> | {p.linkedin}</span>}
        </div>
      </div>

      <div className="space-y-4">
        {/* Education */}
        <section>
          <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2">Education</h2>
          {edu.map((item, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between font-bold">
                <span>{item.institution}</span>
                <span>{item.location || 'Remote'}</span>
              </div>
              <div className="flex justify-between italic">
                <span>{item.degree} in {item.fieldOfStudy}</span>
                <span>{item.startDate} – {item.endDate}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2">Experience</h2>
          {exp.map((item, idx) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between font-bold">
                <span>{item.position}</span>
                <span>{item.startDate} – {item.endDate}</span>
              </div>
              <div className="flex justify-between italic mb-1">
                <span>{item.company}</span>
                <span>{item.location || ''}</span>
              </div>
              <ul className="list-disc ml-5 space-y-0.5 text-[10pt]">
                {item.highlights?.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
          ))}
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2">Projects</h2>
          {proj.map((item, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between">
                <span className="font-bold">{item.name}</span>
                <span className="italic">{item.startDate} – {item.endDate}</span>
              </div>
              <p className="text-[10pt]">{item.description}</p>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-[12pt] font-bold uppercase border-b border-black mb-2">Technical Skills</h2>
          <div className="space-y-1 text-[10pt]">
            {skills.map((s, idx) => (
              <div key={idx}>
                <span className="font-bold">{s.category}:</span> {s.items.join(', ')}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  ),

  // --- DEEDY CV (Famous Two-Column LaTeX style) ---
  'overleaf-deedy': (p, exp, edu, skills, proj) => (
    <div className="flex gap-6 font-sans text-[#333]">
      {/* Column 1 (Education, Links, Skills) */}
      <div className="w-1/3">
        <h1 className="text-4xl font-light tracking-tighter mb-1 text-black">{p.fullName?.split(' ')[0] || 'FIRST'}</h1>
        <h1 className="text-4xl font-bold tracking-tighter mb-6 text-black">{p.fullName?.split(' ')[1] || 'LAST'}</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 mb-3 text-red-700">Education</h2>
            {edu.map((item, idx) => (
              <div key={idx} className="mb-4">
                <h3 className="font-bold text-sm">{item.institution}</h3>
                <p className="text-xs">{item.degree}</p>
                <p className="text-xs text-gray-500">Graduated {item.endDate}</p>
                {item.gpa && <p className="text-xs">GPA: {item.gpa}</p>}
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 mb-3 text-red-700">Skills</h2>
            {skills.map((s, idx) => (
              <div key={idx} className="mb-3">
                <h3 className="font-bold text-[10px] uppercase text-gray-500">{s.category}</h3>
                <p className="text-xs leading-relaxed">{s.items.join(' \u2022 ')}</p>
              </div>
            ))}
          </section>
        </div>
      </div>

      {/* Column 2 (Experience, Projects) */}
      <div className="w-2/3 border-l border-gray-200 pl-6">
        <div className="text-right text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-8">
          {p.email} | {p.phone} | {p.location}
        </div>

        <section className="mb-8">
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 mb-4 text-red-700">Experience</h2>
          {exp.map((item, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="font-bold text-sm uppercase">{item.position}</h3>
              <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                <span>{item.company}</span>
                <span>{item.startDate} – {item.endDate}</span>
              </div>
              <ul className="list-disc ml-5 space-y-1">
                {item.highlights?.map((h, i) => <li key={i} className="text-[11px] text-gray-600 leading-snug">{h}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-lg font-bold uppercase tracking-widest border-b border-gray-300 mb-4 text-red-700">Projects</h2>
          {proj.map((item, idx) => (
            <div key={idx} className="mb-4">
              <h3 className="font-bold text-sm uppercase">{item.name}</h3>
              <p className="text-[11px] text-gray-600 leading-snug mt-1">{item.description}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  ),

  'overleaf-modern': (p, exp, edu, skills, proj, primaryColor) => (
    <div className="font-sans text-[#444] leading-relaxed">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>{p.fullName || 'YOUR NAME'}</h1>
        <div className="flex justify-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-wider">
          <span>{p.email}</span> | <span>{p.phone}</span> | <span>{p.location}</span>
        </div>
      </header>

      <section className="mb-10">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-4 pb-2 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>Experience</h2>
        <div className="space-y-8">
          {exp.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-base text-gray-800">{item.position}</h3>
                <span className="text-xs font-bold text-gray-400">{item.startDate} – {item.endDate}</span>
              </div>
              <p className="text-sm font-bold mb-3" style={{ color: primaryColor }}>{item.company}</p>
              <ul className="list-disc ml-5 space-y-1.5">
                {item.highlights?.map((h, i) => <li key={i} className="text-[11px] leading-relaxed">{h}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-4 pb-2 border-b-2" style={{ color: primaryColor, borderColor: primaryColor }}>Education</h2>
        {edu.map((item, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex justify-between font-bold text-sm">
              <span>{item.institution}</span>
              <span className="text-gray-400">{item.endDate}</span>
            </div>
            <p className="text-xs italic">{item.degree} in {item.fieldOfStudy}</p>
          </div>
        ))}
      </section>
    </div>
  ),

  // Fallback / Professional
  professional: (p, exp, edu, skills, proj, primaryColor) => (
    <div className="font-serif">
      <header className="bg-slate-50 p-8 -mx-8 -mt-8 mb-8 border-b-4" style={{ borderBottomColor: primaryColor }}>
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: primaryColor }}>{p.fullName || 'YOUR NAME'}</h1>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mt-3 text-slate-600">
          <span>{p.email}</span> • <span>{p.phone}</span> • <span>{p.location}</span>
        </div>
        {p.summary && <p className="text-xs mt-4 text-slate-700 leading-relaxed">{p.summary}</p>}
      </header>
      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-bold uppercase tracking-widest mb-4 border-b-2 pb-1" style={{ color: primaryColor, borderColor: primaryColor }}>Experience</h2>
          {exp.map((item, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between font-bold text-sm">
                <span>{item.position}</span>
                <span>{item.startDate} - {item.endDate}</span>
              </div>
              <p className="text-xs italic text-slate-500">{item.company}</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                {item.highlights?.map((h, i) => <li key={i} className="text-[11px] text-slate-600">{h}</li>)}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  ),

  student: (p, exp, edu, skills, proj, primaryColor) => (
    <div className="font-sans">
      <header className="mb-8 border-l-8 pl-6" style={{ borderLeftColor: primaryColor }}>
        <h1 className="text-3xl font-bold" style={{ color: primaryColor }}>{p.fullName || 'YOUR NAME'}</h1>
        <p className="text-xs text-slate-500">{p.email} | {p.phone} | {p.location}</p>
      </header>
      <section>
        <h2 className="text-lg font-bold mb-4 border-b pb-1" style={{ color: primaryColor, borderColor: primaryColor }}>Education</h2>
        {edu.map((item, idx) => (
          <div key={idx} className="mb-3">
            <h3 className="font-bold text-sm">{item.institution}</h3>
            <p className="text-xs">{item.degree} • {item.endDate}</p>
          </div>
        ))}
      </section>
    </div>
  )
};

const ResumePreview = forwardRef(({ resume, template = 'overleaf-jake' }, ref) => {
  const p = resume.personalDetails || {};
  const edu = resume.education || [];
  const exp = resume.experience || [];
  const skills = resume.skills || [];
  const proj = resume.projects || [];

  // Determine which strategy to use
  // We check if we have a direct match for the templateId
  let renderStrategy = LAYOUT_STRATEGIES[template];
  let primaryColor = '#1e293b';

  // Fallback if direct ID doesn't exist (handle generic categories)
  if (!renderStrategy) {
    const category = template.split('-')[0]; // prof, stud, creat, min
    const categoryMap = { prof: 'professional', stud: 'student', creat: 'creative', min: 'minimal' };
    const strategyKey = categoryMap[category] || 'professional';
    renderStrategy = LAYOUT_STRATEGIES[strategyKey];

    // Color palettes for generic templates
    const palettes = {
      prof: ['#1e293b', '#1e3a8a', '#334155'],
      stud: ['#2563eb', '#059669', '#7c3aed'],
      creat: ['#f43f5e', '#8b5cf6', '#06b6d4'],
    };
    const variant = parseInt(template.split('-')[1]) || 1;
    primaryColor = palettes[category]?.[(variant - 1) % 3] || '#1e293b';
  }

  return (
    <div 
      ref={ref} 
      className="resume-preview p-8 bg-white shadow-xl mx-auto overflow-hidden text-black" 
      style={{ width: '100%', maxWidth: '800px', minHeight: '1122px', boxSizing: 'border-box' }}
    >
      {renderStrategy(p, exp, edu, skills, proj, primaryColor)}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
