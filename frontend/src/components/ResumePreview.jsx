import { forwardRef } from 'react';

const templateAliases = {
  'overleaf-jake': 'jake',
  'overleaf-jake-anon': 'jake',
  'overleaf-deedy': 'deedy',
  'overleaf-modern-deedy': 'modern',
  'overleaf-single-column-deedy': 'minimal',
  'overleaf-moderncv': 'modern',
  'builder-novoresume-classic': 'classic',
  'builder-resumeio-modern': 'modern',
  'builder-zety-cascade': 'classic',
  'builder-kickresume-creative': 'deedy',
  'builder-canva-bold': 'modern',
  'student-grad-entry': 'student',
  'student-research-academic': 'student',
  'minimal-ats-clean': 'minimal',
  'minimal-mono-pro': 'minimal',
  'professional-executive-pro': 'classic',
  'professional-compact-lite': 'classic'
};

const getLayoutKey = (templateId = '') => {
  if (templateAliases[templateId]) return templateAliases[templateId];

  if (templateId.includes('student')) return 'student';
  if (templateId.includes('minimal')) return 'minimal';
  if (templateId.includes('creative')) return 'deedy';
  return 'classic';
};

const formatRange = (startDate, endDate, current) => {
  if (current) return `${startDate || ''} - Present`;
  if (!startDate && !endDate) return '';
  return `${startDate || ''} - ${endDate || ''}`.trim();
};

const SectionHeader = ({ title, accent = '#1e293b' }) => (
  <h2
    className="text-[13px] font-bold uppercase tracking-[0.18em] border-b pb-1 mb-2"
    style={{ color: accent, borderColor: accent }}
  >
    {title}
  </h2>
);

const renderClassic = ({ p, exp, edu, skills, proj, accent }) => (
  <div className="font-serif text-[#111827]">
    <header className="mb-6">
      <h1 className="text-[33px] font-bold leading-tight">{p.fullName || 'Your Name'}</h1>
      <p className="text-[11px] text-gray-700">
        {[p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(' | ')}
      </p>
      {p.summary && <p className="text-[11px] text-gray-700 mt-2 leading-relaxed">{p.summary}</p>}
    </header>

    <section className="mb-4">
      <SectionHeader title="Experience" accent={accent} />
      {exp.map((item, idx) => (
        <div key={idx} className="mb-3">
          <div className="flex justify-between text-[12px] font-bold">
            <span>{item.position || 'Role Title'}</span>
            <span>{formatRange(item.startDate, item.endDate, item.current)}</span>
          </div>
          <p className="text-[11px] italic text-gray-600">{item.company || 'Company'}</p>
          <ul className="list-disc ml-5 mt-1 space-y-0.5">
            {(item.highlights || []).filter(Boolean).map((h, i) => (
              <li key={i} className="text-[10px] leading-snug text-gray-700">
                {h}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>

    <section className="mb-4">
      <SectionHeader title="Education" accent={accent} />
      {edu.map((item, idx) => (
        <div key={idx} className="mb-2">
          <div className="flex justify-between text-[12px] font-bold">
            <span>{item.institution || 'University'}</span>
            <span>{formatRange(item.startDate, item.endDate)}</span>
          </div>
          <p className="text-[11px] text-gray-700">
            {[item.degree, item.fieldOfStudy].filter(Boolean).join(' in ')}
          </p>
        </div>
      ))}
    </section>

    <section className="mb-4">
      <SectionHeader title="Projects" accent={accent} />
      {proj.map((item, idx) => (
        <div key={idx} className="mb-2">
          <div className="flex justify-between text-[12px] font-bold">
            <span>{item.name || 'Project Name'}</span>
            <span>{formatRange(item.startDate, item.endDate)}</span>
          </div>
          <p className="text-[10px] text-gray-700">{item.description}</p>
        </div>
      ))}
    </section>

    <section>
      <SectionHeader title="Skills" accent={accent} />
      <div className="space-y-1">
        {skills.map((s, idx) => (
          <p key={idx} className="text-[10px] text-gray-700">
            <span className="font-bold">{s.category}:</span> {(s.items || []).join(', ')}
          </p>
        ))}
      </div>
    </section>
  </div>
);

const renderJake = ({ p, exp, edu, skills, proj }) => (
  <div className="font-serif text-[11px] text-[#111827] leading-tight">
    <header className="text-center mb-5">
      <h1 className="text-[30px] uppercase font-bold mb-1">{p.fullName || 'Your Name'}</h1>
      <p className="text-[10px] text-gray-600">
        {[p.phone, p.email, p.location, p.linkedin, p.github].filter(Boolean).join(' | ')}
      </p>
    </header>

    <section className="mb-4">
      <SectionHeader title="Education" accent="#111827" />
      {edu.map((item, idx) => (
        <div key={idx} className="mb-2">
          <div className="flex justify-between font-bold text-[11px]">
            <span>{item.institution || 'University Name'}</span>
            <span>{item.location || item.endDate || ''}</span>
          </div>
          <div className="flex justify-between italic text-[10px] text-gray-700">
            <span>{[item.degree, item.fieldOfStudy].filter(Boolean).join(' in ')}</span>
            <span>{formatRange(item.startDate, item.endDate)}</span>
          </div>
        </div>
      ))}
    </section>

    <section className="mb-4">
      <SectionHeader title="Experience" accent="#111827" />
      {exp.map((item, idx) => (
        <div key={idx} className="mb-3">
          <div className="flex justify-between font-bold text-[11px]">
            <span>{item.position || 'Role Title'}</span>
            <span>{formatRange(item.startDate, item.endDate, item.current)}</span>
          </div>
          <div className="flex justify-between italic text-[10px] text-gray-700 mb-1">
            <span>{item.company || 'Company Name'}</span>
            <span>{item.location || ''}</span>
          </div>
          <ul className="list-disc ml-5 space-y-0.5">
            {(item.highlights || []).filter(Boolean).map((h, i) => (
              <li key={i} className="text-[10px]">
                {h}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>

    <section className="mb-4">
      <SectionHeader title="Projects" accent="#111827" />
      {proj.map((item, idx) => (
        <div key={idx} className="mb-2">
          <div className="flex justify-between text-[11px]">
            <span className="font-bold">{item.name || 'Project'}</span>
            <span>{formatRange(item.startDate, item.endDate)}</span>
          </div>
          <p className="text-[10px]">{item.description}</p>
        </div>
      ))}
    </section>

    <section>
      <SectionHeader title="Technical Skills" accent="#111827" />
      <div className="space-y-1">
        {skills.map((s, idx) => (
          <p key={idx} className="text-[10px]">
            <span className="font-bold">{s.category}:</span> {(s.items || []).join(', ')}
          </p>
        ))}
      </div>
    </section>
  </div>
);

const renderDeedy = ({ p, exp, edu, skills, proj, accent }) => (
  <div className="flex gap-5 text-[#1f2937] font-sans">
    <div className="w-[31%] pr-1">
      <h1 className="text-[24px] font-light tracking-tight leading-none">{(p.fullName || 'First Last').split(' ')[0]}</h1>
      <h1 className="text-[24px] font-bold tracking-tight mb-4 leading-none">{(p.fullName || 'First Last').split(' ').slice(1).join(' ') || 'Last'}</h1>
      <p className="text-[9px] text-gray-500 mb-4">{[p.email, p.phone, p.location].filter(Boolean).join(' | ')}</p>

      <section className="mb-4">
        <SectionHeader title="Education" accent={accent} />
        {edu.map((item, idx) => (
          <div key={idx} className="mb-3">
            <p className="text-[10px] font-bold">{item.institution || 'University'}</p>
            <p className="text-[9px]">{[item.degree, item.fieldOfStudy].filter(Boolean).join(' in ')}</p>
            <p className="text-[9px] text-gray-500">{formatRange(item.startDate, item.endDate)}</p>
          </div>
        ))}
      </section>

      <section>
        <SectionHeader title="Skills" accent={accent} />
        {skills.map((s, idx) => (
          <div key={idx} className="mb-2">
            <p className="text-[9px] font-bold uppercase text-gray-500">{s.category}</p>
            <p className="text-[9px]">{(s.items || []).join(' • ')}</p>
          </div>
        ))}
      </section>
    </div>

    <div className="w-[69%] border-l border-gray-200 pl-4">
      <section className="mb-5">
        <SectionHeader title="Experience" accent={accent} />
        {exp.map((item, idx) => (
          <div key={idx} className="mb-4">
            <p className="text-[11px] font-bold uppercase">{item.position || 'Role Title'}</p>
            <div className="flex justify-between text-[9px] font-bold text-gray-500 mb-1">
              <span>{item.company || 'Company'}</span>
              <span>{formatRange(item.startDate, item.endDate, item.current)}</span>
            </div>
            <ul className="list-disc ml-4 space-y-0.5">
              {(item.highlights || []).filter(Boolean).map((h, i) => (
                <li key={i} className="text-[9px] text-gray-700 leading-snug">
                  {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <SectionHeader title="Projects" accent={accent} />
        {proj.map((item, idx) => (
          <div key={idx} className="mb-3">
            <p className="text-[11px] font-bold uppercase">{item.name || 'Project Name'}</p>
            <p className="text-[9px] text-gray-700">{item.description}</p>
          </div>
        ))}
      </section>
    </div>
  </div>
);

const renderModern = ({ p, exp, edu, skills, proj, accent }) => (
  <div className="font-sans text-[#1f2937]">
    <header className="mb-7 text-center">
      <h1 className="text-[31px] font-extrabold uppercase tracking-[0.2em]" style={{ color: accent }}>
        {p.fullName || 'Your Name'}
      </h1>
      <p className="text-[10px] text-gray-500 mt-2">{[p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(' | ')}</p>
      {p.summary && <p className="text-[11px] mt-3 text-gray-700 leading-relaxed">{p.summary}</p>}
    </header>

    <section className="mb-5">
      <SectionHeader title="Experience" accent={accent} />
      {exp.map((item, idx) => (
        <div key={idx} className="mb-3">
          <div className="flex justify-between items-baseline mb-0.5">
            <p className="font-bold text-[12px]">{item.position || 'Role Title'}</p>
            <span className="text-[9px] font-bold text-gray-500">{formatRange(item.startDate, item.endDate, item.current)}</span>
          </div>
          <p className="text-[10px] font-semibold mb-1" style={{ color: accent }}>
            {item.company || 'Company Name'}
          </p>
          <ul className="list-disc ml-5 space-y-0.5">
            {(item.highlights || []).filter(Boolean).map((h, i) => (
              <li key={i} className="text-[10px] leading-relaxed">
                {h}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>

    <section className="mb-5">
      <SectionHeader title="Projects" accent={accent} />
      {proj.map((item, idx) => (
        <div key={idx} className="mb-2">
          <div className="flex justify-between">
            <p className="text-[12px] font-bold">{item.name || 'Project Name'}</p>
            <span className="text-[9px] text-gray-500">{formatRange(item.startDate, item.endDate)}</span>
          </div>
          <p className="text-[10px]">{item.description}</p>
        </div>
      ))}
    </section>

    <section className="mb-5">
      <SectionHeader title="Education" accent={accent} />
      {edu.map((item, idx) => (
        <div key={idx} className="mb-2">
          <div className="flex justify-between font-bold text-[12px]">
            <span>{item.institution || 'University Name'}</span>
            <span className="text-gray-500">{formatRange(item.startDate, item.endDate)}</span>
          </div>
          <p className="text-[10px] italic">{[item.degree, item.fieldOfStudy].filter(Boolean).join(' in ')}</p>
        </div>
      ))}
    </section>

    <section>
      <SectionHeader title="Skills" accent={accent} />
      {skills.map((s, idx) => (
        <p key={idx} className="text-[10px] mb-1">
          <span className="font-bold">{s.category}:</span> {(s.items || []).join(', ')}
        </p>
      ))}
    </section>
  </div>
);

const renderMinimal = ({ p, exp, edu, skills, proj }) => (
  <div className="font-mono text-[#0f172a]">
    <header className="mb-5 border-b border-gray-900 pb-2">
      <h1 className="text-[26px] font-bold uppercase tracking-[0.15em]">{p.fullName || 'Your Name'}</h1>
      <p className="text-[10px] mt-1">{[p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(' | ')}</p>
    </header>

    <section className="mb-4">
      <h2 className="text-[11px] font-bold uppercase mb-2">Experience</h2>
      {exp.map((item, idx) => (
        <div key={idx} className="mb-2">
          <p className="text-[10px] font-bold">
            {item.position || 'Role'} @ {item.company || 'Company'}
          </p>
          <p className="text-[9px]">{formatRange(item.startDate, item.endDate, item.current)}</p>
          {(item.highlights || []).filter(Boolean).map((h, i) => (
            <p key={i} className="text-[9px]">
              - {h}
            </p>
          ))}
        </div>
      ))}
    </section>

    <section className="mb-4">
      <h2 className="text-[11px] font-bold uppercase mb-2">Education</h2>
      {edu.map((item, idx) => (
        <p key={idx} className="text-[9px] mb-1">
          {item.institution} | {[item.degree, item.fieldOfStudy].filter(Boolean).join(' in ')} | {formatRange(item.startDate, item.endDate)}
        </p>
      ))}
    </section>

    <section className="mb-4">
      <h2 className="text-[11px] font-bold uppercase mb-2">Projects</h2>
      {proj.map((item, idx) => (
        <p key={idx} className="text-[9px] mb-1">
          <span className="font-bold">{item.name}:</span> {item.description}
        </p>
      ))}
    </section>

    <section>
      <h2 className="text-[11px] font-bold uppercase mb-2">Skills</h2>
      {skills.map((s, idx) => (
        <p key={idx} className="text-[9px] mb-1">
          <span className="font-bold">{s.category}:</span> {(s.items || []).join(', ')}
        </p>
      ))}
    </section>
  </div>
);

const renderStudent = ({ p, exp, edu, skills, proj, accent }) => (
  <div className="font-sans text-[#0f172a]">
    <header className="mb-6 border-l-4 pl-4" style={{ borderColor: accent }}>
      <h1 className="text-[29px] font-bold" style={{ color: accent }}>
        {p.fullName || 'Your Name'}
      </h1>
      <p className="text-[10px] text-gray-600">{[p.email, p.phone, p.location].filter(Boolean).join(' | ')}</p>
      {p.summary && <p className="text-[10px] mt-2 text-gray-700">{p.summary}</p>}
    </header>

    <section className="mb-4">
      <SectionHeader title="Education" accent={accent} />
      {edu.map((item, idx) => (
        <div key={idx} className="mb-2">
          <div className="flex justify-between text-[11px] font-bold">
            <span>{item.institution || 'University'}</span>
            <span>{formatRange(item.startDate, item.endDate)}</span>
          </div>
          <p className="text-[10px]">{[item.degree, item.fieldOfStudy].filter(Boolean).join(' in ')}</p>
        </div>
      ))}
    </section>

    <section className="mb-4">
      <SectionHeader title="Projects" accent={accent} />
      {proj.map((item, idx) => (
        <div key={idx} className="mb-2">
          <p className="text-[11px] font-bold">{item.name || 'Project Name'}</p>
          <p className="text-[10px]">{item.description}</p>
        </div>
      ))}
    </section>

    <section className="mb-4">
      <SectionHeader title="Experience" accent={accent} />
      {exp.map((item, idx) => (
        <div key={idx} className="mb-2">
          <p className="text-[11px] font-bold">{item.position || 'Role'} - {item.company || 'Company'}</p>
          <p className="text-[9px] text-gray-600">{formatRange(item.startDate, item.endDate, item.current)}</p>
          <ul className="list-disc ml-5">
            {(item.highlights || []).filter(Boolean).map((h, i) => (
              <li key={i} className="text-[9px]">{h}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>

    <section>
      <SectionHeader title="Skills" accent={accent} />
      {skills.map((s, idx) => (
        <p key={idx} className="text-[10px]">
          <span className="font-bold">{s.category}:</span> {(s.items || []).join(', ')}
        </p>
      ))}
    </section>
  </div>
);

const renderByTemplate = ({ layoutKey, props }) => {
  switch (layoutKey) {
    case 'jake':
      return renderJake(props);
    case 'deedy':
      return renderDeedy(props);
    case 'modern':
      return renderModern(props);
    case 'minimal':
      return renderMinimal(props);
    case 'student':
      return renderStudent(props);
    case 'classic':
    default:
      return renderClassic(props);
  }
};

const ResumePreview = forwardRef(({ resume, template = 'overleaf-jake', className = '' }, ref) => {
  const p = resume?.personalDetails || {};
  const edu = Array.isArray(resume?.education) ? resume.education : [];
  const exp = Array.isArray(resume?.experience) ? resume.experience : [];
  const skills = Array.isArray(resume?.skills) ? resume.skills : [];
  const proj = Array.isArray(resume?.projects) ? resume.projects : [];

  const layoutKey = getLayoutKey(template);
  const accentByLayout = {
    jake: '#111827',
    deedy: '#b91c1c',
    modern: '#2563eb',
    minimal: '#111827',
    student: '#2563eb',
    classic: '#1e293b'
  };

  const accent = accentByLayout[layoutKey] || '#1e293b';

  return (
    <div
      ref={ref}
      className={`resume-preview p-8 bg-white shadow-xl mx-auto overflow-hidden text-black ${className}`.trim()}
      style={{ width: '100%', maxWidth: '800px', minHeight: '1122px', boxSizing: 'border-box' }}
    >
      {renderByTemplate({
        layoutKey,
        props: { p, exp, edu, skills, proj, accent }
      })}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
