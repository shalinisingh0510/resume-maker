import { forwardRef } from 'react';

const ResumePreview = forwardRef(({ resume, template = 'prof-1' }, ref) => {
  const p = resume.personalDetails || {};
  const edu = resume.education || [];
  const exp = resume.experience || [];
  const skills = resume.skills || [];
  const proj = resume.projects || [];

  // Determine category and variation
  const category = template.split('-')[0]; // prof, stud, creat, clean, min
  const variant = parseInt(template.split('-')[1]) || 1;

  // Dynamic Color Palettes
  const palettes = {
    prof: ['#1e293b', '#1e3a8a', '#334155', '#0f172a', '#1e40af'], // Slate, Blues
    stud: ['#2563eb', '#059669', '#7c3aed', '#db2777', '#2563eb'], // Brighter tones
    creat: ['#f43f5e', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899'], // Vibrant
    clean: ['#374151', '#4b5563', '#111827', '#1f2937', '#4b5563'], // Grays
    min: ['#000000', '#222222', '#333333', '#111111', '#000000'], // Black/Dark
  };

  const primaryColor = palettes[category]?.[(variant - 1) % 5] || '#1e293b';

  // Base Styles for categories
  const getBaseStyles = () => {
    switch (category) {
      case 'creat':
        return {
          container: 'flex gap-8',
          sidebar: 'w-1/3 bg-slate-50 p-6 -m-8 mr-0 min-h-[1122px]',
          main: 'w-2/3',
          name: 'text-3xl font-black uppercase tracking-tighter',
          sectionTitle: `text-sm font-black uppercase tracking-[0.2em] mb-4 mt-8 pb-1 border-b-2`,
        };
      case 'prof':
        return {
          container: 'block',
          header: `bg-slate-50 p-8 -mx-8 -mt-8 mb-8 border-b-4`,
          name: 'text-4xl font-serif font-bold tracking-tight',
          sectionTitle: `text-lg font-bold uppercase tracking-widest mb-4 mt-8 border-b-2 pb-1`,
        };
      case 'min':
        return {
          container: 'block max-w-[650px] mx-auto',
          header: 'mb-12 text-center',
          name: 'text-3xl font-light tracking-[0.3em] uppercase mb-2',
          sectionTitle: 'text-xs font-bold uppercase tracking-[0.4em] text-center mb-8 mt-12',
          itemTitle: 'font-bold uppercase tracking-wider text-sm',
        };
      case 'stud':
        return {
          container: 'block',
          header: 'flex justify-between items-center mb-8 border-l-8 pl-6',
          name: 'text-3xl font-bold tracking-tight',
          sectionTitle: 'text-lg font-bold mb-4 mt-6 flex items-center gap-3',
        };
      default: // Clean / Default
        return {
          container: 'block',
          header: 'text-center mb-8',
          name: 'text-3xl font-bold uppercase tracking-widest',
          sectionTitle: 'text-base font-bold uppercase tracking-widest text-center border-y py-1 my-6',
        };
    }
  };

  const styles = getBaseStyles();

  return (
    <div ref={ref} className="resume-preview p-8 bg-white shadow-lg mx-auto overflow-hidden" style={{ width: '100%', maxWidth: '800px', minHeight: '1122px', boxSizing: 'border-box', color: '#1f2937', fontFamily: category === 'prof' ? 'serif' : 'sans-serif' }}>
      
      {category === 'creat' ? (
        <div className={styles.container}>
          {/* CREATIVE SIDEBAR */}
          <div className={styles.sidebar}>
            <h1 className={styles.name} style={{ color: primaryColor }}>{p.fullName || 'YOUR NAME'}</h1>
            <p className="text-xs mt-4 text-slate-600 leading-relaxed italic">{p.summary}</p>
            
            <div className="mt-8 space-y-3">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Contact</h3>
              <p className="text-xs">{p.email}</p>
              <p className="text-xs">{p.phone}</p>
              <p className="text-xs">{p.location}</p>
              <p className="text-xs text-blue-600">{p.linkedin}</p>
            </div>

            {skills.length > 0 && (
              <div className="mt-8">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Expertise</h3>
                {skills.map((s, i) => (
                  <div key={i} className="mb-4">
                    <p className="text-[10px] font-bold uppercase mb-1">{s.category}</p>
                    <div className="flex flex-wrap gap-1">
                      {s.items.map((item, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px]">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CREATIVE MAIN */}
          <div className={styles.main}>
            {exp.length > 0 && (
              <section>
                <h2 className={styles.sectionTitle} style={{ color: primaryColor, borderColor: primaryColor }}>Experience</h2>
                {exp.map((item, idx) => (
                  <div key={idx} className="mb-6">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-sm">{item.position}</h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{item.startDate} - {item.endDate}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 mb-2">{item.company}</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {item.highlights.map((h, i) => <li key={i} className="text-[11px] text-slate-600">{h}</li>)}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            {edu.length > 0 && (
              <section>
                <h2 className={styles.sectionTitle} style={{ color: primaryColor, borderColor: primaryColor }}>Education</h2>
                {edu.map((item, idx) => (
                  <div key={idx} className="mb-4">
                    <h3 className="font-bold text-sm">{item.institution}</h3>
                    <p className="text-xs text-slate-600">{item.degree} in {item.fieldOfStudy} • {item.endDate}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      ) : (
        /* STANDARD COLUMN LAYOUTS (PROF, MIN, STUD, CLEAN) */
        <div className={styles.container}>
          <header className={styles.header} style={category === 'prof' ? { borderBottomColor: primaryColor } : {}}>
            <h1 className={styles.name} style={{ color: category !== 'min' ? primaryColor : '#000' }}>{p.fullName || 'YOUR NAME'}</h1>
            <div className={`flex flex-wrap gap-x-4 gap-y-1 text-xs mt-3 ${category === 'min' || category === 'clean' ? 'justify-center' : ''}`}>
              <span>{p.email}</span>
              <span>{p.phone}</span>
              <span>{p.location}</span>
              {p.linkedin && <span style={{ color: primaryColor }}>{p.linkedin}</span>}
            </div>
            {p.summary && (category !== 'min') && (
              <p className="text-xs mt-4 text-slate-600 leading-relaxed text-justify">{p.summary}</p>
            )}
          </header>

          <div className="space-y-8">
             {exp.length > 0 && (
               <section>
                 <h2 className={styles.sectionTitle} style={{ color: category !== 'min' ? primaryColor : '#000', borderColor: primaryColor }}>Experience</h2>
                 <div className="space-y-6">
                   {exp.map((item, idx) => (
                     <div key={idx}>
                       <div className="flex justify-between items-baseline">
                         <h3 className={styles.itemTitle || 'font-bold text-sm'}>{item.position}</h3>
                         <span className="text-[10px] font-bold text-slate-400 uppercase">{item.startDate} - {item.endDate}</span>
                       </div>
                       <p className="text-xs font-bold text-slate-500 mb-2">{item.company} {item.location && `• ${item.location}`}</p>
                       <ul className="list-disc pl-4 space-y-1">
                         {item.highlights.map((h, i) => <li key={i} className="text-[11px] text-slate-600">{h}</li>)}
                       </ul>
                     </div>
                   ))}
                 </div>
               </section>
             )}

             {edu.length > 0 && (
               <section>
                 <h2 className={styles.sectionTitle} style={{ color: category !== 'min' ? primaryColor : '#000', borderColor: primaryColor }}>Education</h2>
                 <div className="space-y-4">
                   {edu.map((item, idx) => (
                     <div key={idx} className="flex justify-between items-start">
                       <div>
                         <h3 className={styles.itemTitle || 'font-bold text-sm'}>{item.institution}</h3>
                         <p className="text-xs text-slate-600">{item.degree} in {item.fieldOfStudy}</p>
                       </div>
                       <span className="text-[10px] font-bold text-slate-400">{item.endDate}</span>
                     </div>
                   ))}
                 </div>
               </section>
             )}

             {skills.length > 0 && (
               <section>
                 <h2 className={styles.sectionTitle} style={{ color: category !== 'min' ? primaryColor : '#000', borderColor: primaryColor }}>Skills</h2>
                 <div className="grid grid-cols-2 gap-4">
                   {skills.map((s, i) => (
                     <div key={i}>
                       <h4 className="text-[10px] font-black uppercase text-slate-400 mb-1">{s.category}</h4>
                       <p className="text-xs text-slate-700">{s.items.join(', ')}</p>
                     </div>
                   ))}
                 </div>
               </section>
             )}
          </div>
        </div>
      )}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
