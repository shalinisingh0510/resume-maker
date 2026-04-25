import { forwardRef } from 'react';

const templateAliases = {
  'overleaf-jake': 'jake',
  'overleaf-jake-anon': 'jake',
  'overleaf-deedy': 'deedy',
  'overleaf-modern-deedy': 'modern',
  'overleaf-single-column-deedy': 'minimal',
  'overleaf-moderncv': 'modern'
};

const defaultVisibility = {
  summary: true,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  customSections: true
};

const getLayoutKey = (templateId = '', providedLayoutKey = '') => {
  if (providedLayoutKey) return providedLayoutKey;
  if (templateAliases[templateId]) return templateAliases[templateId];
  if (templateId.includes('student')) return 'student';
  if (templateId.includes('minimal')) return 'minimal';
  if (templateId.includes('creative')) return 'deedy';
  if (templateId.includes('modern')) return 'modern';
  return 'classic';
};

const formatRange = (startDate, endDate, current) => {
  if (current) return `${startDate || ''} - Present`;
  if (!startDate && !endDate) return '';
  return `${startDate || ''} - ${endDate || ''}`.trim();
};

const SectionTitle = ({ title, accent = '#1e293b', compact = false }) => (
  <h2
    className={`${compact ? 'text-[10px]' : 'text-[13px]'} font-bold uppercase tracking-[0.16em] border-b pb-1 mb-2`}
    style={{ color: accent, borderColor: accent }}
  >
    {title}
  </h2>
);

const CustomSections = ({ customSections = [], accent = '#1e293b', compact = false }) => (
  <>
    {customSections
      .filter((section) => section?.title || section?.content || (section?.items || []).length)
      .map((section, idx) => (
        <section key={`${section.title || 'custom'}-${idx}`} className="mb-4">
          <SectionTitle title={section.title || `Custom Section ${idx + 1}`} accent={accent} compact={compact} />
          {section.content ? <p className={`${compact ? 'text-[9px]' : 'text-[10px]'} text-gray-700 mb-1`}>{section.content}</p> : null}
          {(section.items || []).length > 0 ? (
            <ul className="list-disc ml-5 space-y-0.5">
              {section.items.map((item, itemIdx) => (
                <li key={itemIdx} className={`${compact ? 'text-[9px]' : 'text-[10px]'} text-gray-700`}>
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
  </>
);

const ClassicLayout = ({ p, exp, edu, skills, proj, customSections, accent }) => (
  <div className="font-serif text-[#111827]">
    <header className="mb-6">
      <h1 className="text-[33px] font-bold leading-tight">{p.fullName || 'Your Name'}</h1>
      <p className="text-[11px] text-gray-700">{[p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(' | ')}</p>
      {p.summary ? <p className="text-[11px] text-gray-700 mt-2 leading-relaxed">{p.summary}</p> : null}
    </header>

    {exp.length > 0 ? (
      <section className="mb-4">
        <SectionTitle title="Experience" accent={accent} />
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
    ) : null}

    {edu.length > 0 ? (
      <section className="mb-4">
        <SectionTitle title="Education" accent={accent} />
        {edu.map((item, idx) => (
          <div key={idx} className="mb-2">
            <div className="flex justify-between text-[12px] font-bold">
              <span>{item.institution || 'University'}</span>
              <span>{formatRange(item.startDate, item.endDate)}</span>
            </div>
            <p className="text-[11px] text-gray-700">{[item.degree, item.fieldOfStudy].filter(Boolean).join(' in ')}</p>
          </div>
        ))}
      </section>
    ) : null}

    {proj.length > 0 ? (
      <section className="mb-4">
        <SectionTitle title="Projects" accent={accent} />
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
    ) : null}

    {skills.length > 0 ? (
      <section className="mb-4">
        <SectionTitle title="Skills" accent={accent} />
        {skills.map((s, idx) => (
          <p key={idx} className="text-[10px] text-gray-700 mb-1">
            <span className="font-bold">{s.category}:</span> {(s.items || []).join(', ')}
          </p>
        ))}
      </section>
    ) : null}

    <CustomSections customSections={customSections} accent={accent} />
  </div>
);

const JakeLayout = ({ p, exp, edu, skills, proj, customSections }) => (
  <div className="font-serif text-[11px] text-[#111827] leading-tight">
    <header className="text-center mb-5">
      <h1 className="text-[30px] uppercase font-bold mb-1">{p.fullName || 'Your Name'}</h1>
      <p className="text-[10px] text-gray-600">{[p.phone, p.email, p.location, p.linkedin, p.github].filter(Boolean).join(' | ')}</p>
      {p.summary ? <p className="text-[10px] text-gray-600 mt-1">{p.summary}</p> : null}
    </header>
    <ClassicLayout p={{ ...p, summary: '' }} exp={exp} edu={edu} skills={skills} proj={proj} customSections={customSections} accent="#111827" />
  </div>
);

const DeedyLayout = ({ p, exp, edu, skills, proj, customSections, accent }) => (
  <div className="flex gap-5 text-[#1f2937] font-sans">
    <div className="w-[31%] pr-1">
      <h1 className="text-[24px] font-light tracking-tight leading-none">{(p.fullName || 'First Last').split(' ')[0]}</h1>
      <h1 className="text-[24px] font-bold tracking-tight mb-4 leading-none">{(p.fullName || 'First Last').split(' ').slice(1).join(' ') || 'Last'}</h1>
      <p className="text-[9px] text-gray-500 mb-4">{[p.email, p.phone, p.location].filter(Boolean).join(' | ')}</p>
      {edu.length > 0 ? (
        <section className="mb-4">
          <SectionTitle title="Education" accent={accent} compact />
          {edu.map((item, idx) => (
            <div key={idx} className="mb-3">
              <p className="text-[10px] font-bold">{item.institution || 'University'}</p>
              <p className="text-[9px]">{[item.degree, item.fieldOfStudy].filter(Boolean).join(' in ')}</p>
              <p className="text-[9px] text-gray-500">{formatRange(item.startDate, item.endDate)}</p>
            </div>
          ))}
        </section>
      ) : null}
      {skills.length > 0 ? (
        <section>
          <SectionTitle title="Skills" accent={accent} compact />
          {skills.map((s, idx) => (
            <div key={idx} className="mb-2">
              <p className="text-[9px] font-bold uppercase text-gray-500">{s.category}</p>
              <p className="text-[9px]">{(s.items || []).join(' • ')}</p>
            </div>
          ))}
        </section>
      ) : null}
    </div>

    <div className="w-[69%] border-l border-gray-200 pl-4">
      {exp.length > 0 ? (
        <section className="mb-5">
          <SectionTitle title="Experience" accent={accent} compact />
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
      ) : null}
      {proj.length > 0 ? (
        <section className="mb-4">
          <SectionTitle title="Projects" accent={accent} compact />
          {proj.map((item, idx) => (
            <div key={idx} className="mb-3">
              <p className="text-[11px] font-bold uppercase">{item.name || 'Project Name'}</p>
              <p className="text-[9px] text-gray-700">{item.description}</p>
            </div>
          ))}
        </section>
      ) : null}
      <CustomSections customSections={customSections} accent={accent} compact />
    </div>
  </div>
);

const ModernLayout = ({ p, exp, edu, skills, proj, customSections, accent }) => (
  <div className="font-sans text-[#1f2937]">
    <header className="mb-7 text-center">
      <h1 className="text-[31px] font-extrabold uppercase tracking-[0.2em]" style={{ color: accent }}>
        {p.fullName || 'Your Name'}
      </h1>
      <p className="text-[10px] text-gray-500 mt-2">{[p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(' | ')}</p>
      {p.summary ? <p className="text-[11px] mt-3 text-gray-700 leading-relaxed">{p.summary}</p> : null}
    </header>
    <ClassicLayout p={{ ...p, summary: '' }} exp={exp} edu={edu} skills={skills} proj={proj} customSections={customSections} accent={accent} />
  </div>
);

const MinimalLayout = ({ p, exp, edu, skills, proj, customSections }) => (
  <div className="font-mono text-[#0f172a]">
    <header className="mb-5 border-b border-gray-900 pb-2">
      <h1 className="text-[26px] font-bold uppercase tracking-[0.15em]">{p.fullName || 'Your Name'}</h1>
      <p className="text-[10px] mt-1">{[p.email, p.phone, p.location, p.linkedin].filter(Boolean).join(' | ')}</p>
      {p.summary ? <p className="text-[9px] mt-1">{p.summary}</p> : null}
    </header>
    {exp.length > 0 ? (
      <section className="mb-4">
        <SectionTitle title="Experience" accent="#111827" compact />
        {exp.map((item, idx) => (
          <div key={idx} className="mb-2">
            <p className="text-[10px] font-bold">{item.position || 'Role'} @ {item.company || 'Company'}</p>
            <p className="text-[9px]">{formatRange(item.startDate, item.endDate, item.current)}</p>
            {(item.highlights || []).filter(Boolean).map((h, i) => (
              <p key={i} className="text-[9px]">- {h}</p>
            ))}
          </div>
        ))}
      </section>
    ) : null}
    {edu.length > 0 ? (
      <section className="mb-4">
        <SectionTitle title="Education" accent="#111827" compact />
        {edu.map((item, idx) => (
          <p key={idx} className="text-[9px] mb-1">
            {item.institution} | {[item.degree, item.fieldOfStudy].filter(Boolean).join(' in ')} | {formatRange(item.startDate, item.endDate)}
          </p>
        ))}
      </section>
    ) : null}
    {proj.length > 0 ? (
      <section className="mb-4">
        <SectionTitle title="Projects" accent="#111827" compact />
        {proj.map((item, idx) => (
          <p key={idx} className="text-[9px] mb-1">
            <span className="font-bold">{item.name}:</span> {item.description}
          </p>
        ))}
      </section>
    ) : null}
    {skills.length > 0 ? (
      <section className="mb-4">
        <SectionTitle title="Skills" accent="#111827" compact />
        {skills.map((s, idx) => (
          <p key={idx} className="text-[9px] mb-1">
            <span className="font-bold">{s.category}:</span> {(s.items || []).join(', ')}
          </p>
        ))}
      </section>
    ) : null}
    <CustomSections customSections={customSections} accent="#111827" compact />
  </div>
);

const StudentLayout = ({ p, exp, edu, skills, proj, customSections, accent }) => (
  <div className="font-sans text-[#0f172a]">
    <header className="mb-6 border-l-4 pl-4" style={{ borderColor: accent }}>
      <h1 className="text-[29px] font-bold" style={{ color: accent }}>{p.fullName || 'Your Name'}</h1>
      <p className="text-[10px] text-gray-600">{[p.email, p.phone, p.location].filter(Boolean).join(' | ')}</p>
      {p.summary ? <p className="text-[10px] mt-2 text-gray-700">{p.summary}</p> : null}
    </header>
    <ClassicLayout p={{ ...p, summary: '' }} exp={exp} edu={edu} skills={skills} proj={proj} customSections={customSections} accent={accent} />
  </div>
);

const ResumePreview = forwardRef(({ resume, template = 'overleaf-jake', templateLayout = '', className = '' }, ref) => {
  const visibility = { ...defaultVisibility, ...(resume?.sectionVisibility || {}) };
  const p = {
    ...(resume?.personalDetails || {}),
    summary: visibility.summary ? resume?.personalDetails?.summary || '' : ''
  };
  const exp = visibility.experience ? (Array.isArray(resume?.experience) ? resume.experience : []) : [];
  const edu = visibility.education ? (Array.isArray(resume?.education) ? resume.education : []) : [];
  const skills = visibility.skills ? (Array.isArray(resume?.skills) ? resume.skills : []) : [];
  const proj = visibility.projects ? (Array.isArray(resume?.projects) ? resume.projects : []) : [];
  const customSections =
    visibility.customSections && Array.isArray(resume?.customSections) ? resume.customSections : [];

  const layoutKey = getLayoutKey(template, templateLayout);
  const accentByLayout = {
    jake: '#111827',
    deedy: '#b91c1c',
    modern: '#2563eb',
    minimal: '#111827',
    student: '#2563eb',
    classic: '#1e293b'
  };
  const accent = accentByLayout[layoutKey] || '#1e293b';

  const layoutProps = { p, exp, edu, skills, proj, customSections, accent };

  const renderLayout = () => {
    if (layoutKey === 'jake') return <JakeLayout {...layoutProps} />;
    if (layoutKey === 'deedy') return <DeedyLayout {...layoutProps} />;
    if (layoutKey === 'modern') return <ModernLayout {...layoutProps} />;
    if (layoutKey === 'minimal') return <MinimalLayout {...layoutProps} />;
    if (layoutKey === 'student') return <StudentLayout {...layoutProps} />;
    return <ClassicLayout {...layoutProps} />;
  };

  return (
    <div
      ref={ref}
      className={`resume-preview p-8 bg-white shadow-xl mx-auto overflow-hidden text-black ${className}`.trim()}
      style={{ width: '100%', maxWidth: '800px', minHeight: '1122px', boxSizing: 'border-box' }}
    >
      {renderLayout()}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
