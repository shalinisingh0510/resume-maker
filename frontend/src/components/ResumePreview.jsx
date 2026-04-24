import { forwardRef } from 'react';

const ResumePreview = forwardRef(({ resume, template = 'clean' }, ref) => {
  const p = resume.personalDetails || {};
  const edu = resume.education || [];
  const exp = resume.experience || [];
  const skills = resume.skills || [];
  const proj = resume.projects || [];

  // Theme variants
  const themes = {
    clean: {
      header: 'text-center border-b border-gray-300 pb-4 mb-4',
      name: 'text-3xl font-serif font-bold text-gray-900 uppercase tracking-wider',
      contact: 'text-gray-600 text-sm mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1',
      sectionTitle: 'text-lg font-bold text-gray-800 uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 mt-6',
      itemTitle: 'font-bold text-gray-800',
      itemSubtitle: 'font-semibold text-gray-700 italic',
      date: 'text-gray-500 text-sm font-medium',
    },
    professional: {
      header: 'bg-slate-100 p-6 -mx-8 -mt-8 mb-6',
      name: 'text-4xl font-bold text-slate-800',
      contact: 'text-slate-600 text-sm mt-3 flex flex-wrap gap-4 font-medium',
      sectionTitle: 'text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4 mt-6 flex items-center',
      itemTitle: 'font-bold text-slate-800 text-lg',
      itemSubtitle: 'font-medium text-slate-600',
      date: 'text-slate-500 text-sm font-semibold bg-slate-100 px-2 py-0.5 rounded',
    },
    modern: {
      header: 'flex justify-between items-end border-b-4 border-indigo-500 pb-5 mb-6',
      name: 'text-4xl font-extrabold text-gray-900 tracking-tight',
      contact: 'text-gray-500 text-sm flex flex-col items-end gap-1 font-medium',
      sectionTitle: 'text-xl font-bold text-indigo-600 mb-4 mt-6 flex items-center gap-2',
      itemTitle: 'font-bold text-gray-900 text-lg',
      itemSubtitle: 'font-medium text-indigo-600',
      date: 'text-gray-500 text-sm font-medium',
    }
  };

  const css = themes[template] || themes.clean;

  return (
    <div ref={ref} className="resume-preview p-8 bg-white shadow-lg mx-auto" style={{ width: '100%', maxWidth: '800px', minHeight: '1122px', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <div className={css.header}>
        {template === 'modern' ? (
          <>
            <div>
              <h1 className={css.name}>{p.fullName || 'YOUR NAME'}</h1>
              {p.summary && <p className="text-gray-600 mt-2 max-w-lg text-sm">{p.summary}</p>}
            </div>
            <div className={css.contact}>
              {p.email && <span>{p.email}</span>}
              {p.phone && <span>{p.phone}</span>}
              {p.location && <span>{p.location}</span>}
              {p.linkedin && <span>{p.linkedin}</span>}
            </div>
          </>
        ) : (
          <>
            <h1 className={css.name}>{p.fullName || 'YOUR NAME'}</h1>
            <div className={css.contact}>
              {p.email && <span>{p.email}</span>}
              {p.phone && <span>{p.phone}</span>}
              {p.location && <span>{p.location}</span>}
              {p.linkedin && <span>{p.linkedin}</span>}
              {p.github && <span>{p.github}</span>}
              {p.website && <span>{p.website}</span>}
            </div>
            {p.summary && <p className="text-gray-700 mt-4 text-sm text-justify">{p.summary}</p>}
          </>
        )}
      </div>

      {/* Experience */}
      {exp.length > 0 && (
        <div>
          <h2 className={css.sectionTitle}>
            {template === 'modern' && <span className="w-4 h-4 bg-indigo-500 rounded-sm"></span>}
            Experience
          </h2>
          <div className="space-y-4">
            {exp.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={css.itemTitle}>{item.position}</h3>
                    <div className={css.itemSubtitle}>{item.company} {item.location && `• ${item.location}`}</div>
                  </div>
                  <div className={css.date}>
                    {item.startDate} - {item.current ? 'Present' : item.endDate}
                  </div>
                </div>
                {item.description && <p className="text-gray-700 text-sm mt-1">{item.description}</p>}
                {item.highlights && item.highlights.length > 0 && item.highlights[0] !== '' && (
                  <ul className="list-disc pl-5 mt-1 text-sm text-gray-700 space-y-0.5">
                    {item.highlights.map((h, i) => <li key={i}>{h}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {edu.length > 0 && (
        <div>
          <h2 className={css.sectionTitle}>
            {template === 'modern' && <span className="w-4 h-4 bg-indigo-500 rounded-sm"></span>}
            Education
          </h2>
          <div className="space-y-3">
            {edu.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <h3 className={css.itemTitle}>{item.institution}</h3>
                  <div className={css.itemSubtitle}>{item.degree} in {item.fieldOfStudy}</div>
                  {item.description && <p className="text-gray-600 text-sm mt-0.5">{item.description}</p>}
                </div>
                <div className="text-right">
                  <div className={css.date}>{item.startDate} - {item.endDate}</div>
                  {item.gpa && <div className="text-sm font-medium text-gray-600 mt-0.5">GPA: {item.gpa}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {proj.length > 0 && (
        <div>
          <h2 className={css.sectionTitle}>
            {template === 'modern' && <span className="w-4 h-4 bg-indigo-500 rounded-sm"></span>}
            Projects
          </h2>
          <div className="space-y-3">
            {proj.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className={css.itemTitle}>
                    {item.name} 
                    {item.link && <span className="text-sm font-normal text-indigo-600 ml-2">({item.link})</span>}
                  </h3>
                  <div className={css.date}>{item.startDate} - {item.endDate}</div>
                </div>
                {item.technologies && item.technologies.length > 0 && item.technologies[0] !== '' && (
                  <div className="text-sm text-gray-600 mb-1 font-medium">
                    Technologies: {item.technologies.join(', ')}
                  </div>
                )}
                {item.description && <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h2 className={css.sectionTitle}>
            {template === 'modern' && <span className="w-4 h-4 bg-indigo-500 rounded-sm"></span>}
            Skills
          </h2>
          <div className="space-y-1.5">
            {skills.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row text-sm">
                <div className="font-bold text-gray-800 w-[120px] shrink-0">{item.category}:</div>
                <div className="text-gray-700">{item.items.join(', ')}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
