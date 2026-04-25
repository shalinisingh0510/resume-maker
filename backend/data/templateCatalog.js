const { buildLatexTemplate } = require('../utils/latexTemplates');

const makeTemplate = ({
  templateId,
  name,
  category,
  subcategory,
  isPremium = false,
  sortOrder,
  description,
  provider,
  url,
  layoutKey = 'classic',
  supportsLatex = false,
  accentHex = '2563eb',
  tags = []
}) => ({
  templateId,
  name,
  category,
  subcategory,
  isPremium,
  sortOrder,
  description,
  source: {
    provider,
    url
  },
  config: {
    layoutKey,
    supportsLatex,
    accentColor: `#${accentHex}`,
    defaultLatexSource: buildLatexTemplate({ title: name, accentHex }),
    tags
  }
});

const coreTemplates = [
  makeTemplate({
    templateId: 'overleaf-jake',
    name: 'Overleaf Jake',
    category: 'professional',
    subcategory: 'Engineering',
    sortOrder: 1,
    description: 'Classic single-column technical resume inspired by Overleaf Jake.',
    provider: 'Overleaf',
    url: 'https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs',
    layoutKey: 'jake',
    supportsLatex: true,
    accentHex: '111827',
    tags: ['ats', 'engineering', 'one-page']
  }),
  makeTemplate({
    templateId: 'overleaf-jake-anon',
    name: 'Overleaf Jake Anonymous',
    category: 'professional',
    subcategory: 'Engineering',
    sortOrder: 2,
    description: 'Compact anonymous variant with high information density.',
    provider: 'Overleaf',
    url: 'https://www.overleaf.com/latex/templates/jakes-resume-anonymous/cstpnrbkhndn',
    layoutKey: 'jake',
    supportsLatex: true,
    accentHex: '0f172a',
    tags: ['ats', 'compact']
  }),
  makeTemplate({
    templateId: 'overleaf-deedy',
    name: 'Overleaf Deedy',
    category: 'creative',
    subcategory: 'Two Column',
    isPremium: true,
    sortOrder: 3,
    description: 'Famous two-column style for strong project and skill storytelling.',
    provider: 'Overleaf',
    url: 'https://www.overleaf.com/latex/templates/deedy-cv/bjryvfsjdyxz',
    layoutKey: 'deedy',
    supportsLatex: true,
    accentHex: 'b91c1c',
    tags: ['two-column', 'engineering']
  }),
  makeTemplate({
    templateId: 'overleaf-modern-deedy',
    name: 'Overleaf Modern Deedy',
    category: 'creative',
    subcategory: 'Two Column',
    isPremium: true,
    sortOrder: 4,
    description: 'Modernized Deedy aesthetic with cleaner spacing.',
    provider: 'Overleaf',
    url: 'https://www.overleaf.com/latex/templates/modern-deedy/cxtjgrmpsrvh',
    layoutKey: 'modern',
    supportsLatex: true,
    accentHex: '2563eb',
    tags: ['modern', 'technical']
  }),
  makeTemplate({
    templateId: 'overleaf-single-column-deedy',
    name: 'Overleaf Single Column Deedy',
    category: 'minimal',
    subcategory: 'ATS',
    sortOrder: 5,
    description: 'One-column ATS-oriented Deedy variant for cleaner parsing.',
    provider: 'Overleaf',
    url: 'https://www.overleaf.com/latex/templates/single-column-deedy-cv-slash-resume-template/zwyxmkbrfgtz',
    layoutKey: 'minimal',
    supportsLatex: true,
    accentHex: '0f172a',
    tags: ['ats', 'single-column']
  }),
  makeTemplate({
    templateId: 'overleaf-moderncv',
    name: 'Overleaf ModernCV',
    category: 'professional',
    subcategory: 'Executive',
    isPremium: true,
    sortOrder: 6,
    description: 'Elegant executive/consulting layout based on ModernCV style.',
    provider: 'Overleaf',
    url: 'https://www.overleaf.com/articles/resume/qfhygkygpgbj',
    layoutKey: 'modern',
    supportsLatex: true,
    accentHex: '1d4ed8',
    tags: ['executive', 'consulting']
  })
];

const providerFamilies = [
  {
    provider: 'Resume.io',
    url: 'https://resume.io',
    layoutKey: 'modern',
    category: 'professional',
    subcategory: 'Modern',
    accentHex: '2563eb',
    baseName: 'Resume.io',
    supportsLatex: false,
    tags: ['fast-build', 'modern']
  },
  {
    provider: 'Zety',
    url: 'https://zety.com',
    layoutKey: 'classic',
    category: 'professional',
    subcategory: 'Corporate',
    accentHex: '0f172a',
    baseName: 'Zety',
    supportsLatex: false,
    tags: ['guided', 'corporate']
  },
  {
    provider: 'Novoresume',
    url: 'https://novoresume.com',
    layoutKey: 'classic',
    category: 'professional',
    subcategory: 'Corporate',
    accentHex: '1e3a8a',
    baseName: 'Novoresume',
    supportsLatex: false,
    tags: ['balanced', 'corporate']
  },
  {
    provider: 'Kickresume',
    url: 'https://www.kickresume.com',
    layoutKey: 'deedy',
    category: 'creative',
    subcategory: 'Portfolio',
    accentHex: 'dc2626',
    baseName: 'Kickresume',
    supportsLatex: false,
    tags: ['creative', 'entry-level']
  },
  {
    provider: 'Enhancv',
    url: 'https://enhancv.com',
    layoutKey: 'modern',
    category: 'creative',
    subcategory: 'Designer',
    accentHex: '0ea5e9',
    baseName: 'Enhancv',
    supportsLatex: false,
    tags: ['customized', 'visual']
  },
  {
    provider: 'VisualCV',
    url: 'https://www.visualcv.com',
    layoutKey: 'modern',
    category: 'professional',
    subcategory: 'Executive',
    accentHex: '334155',
    baseName: 'VisualCV',
    supportsLatex: false,
    tags: ['executive', 'analytics']
  },
  {
    provider: 'Canva',
    url: 'https://www.canva.com/resumes/templates/',
    layoutKey: 'deedy',
    category: 'creative',
    subcategory: 'Visual',
    accentHex: '9333ea',
    baseName: 'Canva',
    supportsLatex: false,
    tags: ['visual', 'portfolio']
  },
  {
    provider: 'Rezi',
    url: 'https://www.rezi.ai',
    layoutKey: 'minimal',
    category: 'minimal',
    subcategory: 'ATS',
    accentHex: '111827',
    baseName: 'Rezi',
    supportsLatex: false,
    tags: ['ats', 'keyword-optimized']
  },
  {
    provider: 'Teal',
    url: 'https://www.tealhq.com',
    layoutKey: 'minimal',
    category: 'professional',
    subcategory: 'Job Targeted',
    accentHex: '0f766e',
    baseName: 'Teal',
    supportsLatex: false,
    tags: ['job-tracking', 'tailored']
  },
  {
    provider: 'Resume Genius',
    url: 'https://resumegenius.com',
    layoutKey: 'classic',
    category: 'professional',
    subcategory: 'Guided',
    accentHex: '1f2937',
    baseName: 'Resume Genius',
    supportsLatex: false,
    tags: ['guided', 'quick-start']
  },
  {
    provider: 'Jobscan',
    url: 'https://www.jobscan.co',
    layoutKey: 'minimal',
    category: 'minimal',
    subcategory: 'ATS',
    accentHex: '111827',
    baseName: 'Jobscan',
    supportsLatex: false,
    tags: ['ats', 'matching']
  },
  {
    provider: 'Hloom',
    url: 'https://www.hloom.com',
    layoutKey: 'classic',
    category: 'clean',
    subcategory: 'Traditional',
    accentHex: '1e293b',
    baseName: 'Hloom',
    supportsLatex: false,
    tags: ['traditional', 'simple']
  }
];

const familyVariants = [
  { slug: 'classic', label: 'Classic', premium: false },
  { slug: 'modern', label: 'Modern', premium: false },
  { slug: 'executive', label: 'Executive', premium: true },
  { slug: 'minimal', label: 'Minimal', premium: false }
];

let sortSeed = 100;
const generatedTemplates = providerFamilies.flatMap((family, providerIndex) =>
  familyVariants.map((variant, variantIndex) =>
    makeTemplate({
      templateId: `${family.baseName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${variant.slug}`,
      name: `${family.baseName} ${variant.label} Inspired`,
      category: family.category,
      subcategory: family.subcategory,
      isPremium: variant.premium,
      sortOrder: sortSeed + providerIndex * 10 + variantIndex,
      description: `${variant.label} resume style inspired by ${family.provider}.`,
      provider: family.provider,
      url: family.url,
      layoutKey:
        variant.slug === 'executive'
          ? 'classic'
          : variant.slug === 'minimal'
            ? 'minimal'
            : family.layoutKey,
      supportsLatex: family.supportsLatex,
      accentHex: family.accentHex,
      tags: [...family.tags, variant.slug]
    })
  )
);

const additionalInAppTemplates = [
  makeTemplate({
    templateId: 'student-grad-entry',
    name: 'Student Grad Entry',
    category: 'student',
    subcategory: 'Entry Level',
    sortOrder: 400,
    description: 'Student-first structure with coursework and projects highlighted.',
    provider: 'In-app',
    url: '',
    layoutKey: 'student',
    supportsLatex: true,
    accentHex: '1d4ed8',
    tags: ['student', 'internship']
  }),
  makeTemplate({
    templateId: 'student-research-academic',
    name: 'Student Research Academic',
    category: 'student',
    subcategory: 'Academic',
    sortOrder: 401,
    description: 'Academic style for research applications and higher studies.',
    provider: 'In-app',
    url: '',
    layoutKey: 'student',
    supportsLatex: true,
    accentHex: '1e40af',
    tags: ['student', 'research']
  }),
  makeTemplate({
    templateId: 'student-internship-compact',
    name: 'Student Internship Compact',
    category: 'student',
    subcategory: 'Internship',
    sortOrder: 402,
    description: 'Compact internship-focused one-page student resume.',
    provider: 'In-app',
    url: '',
    layoutKey: 'student',
    supportsLatex: true,
    accentHex: '2563eb',
    tags: ['student', 'compact']
  }),
  makeTemplate({
    templateId: 'minimal-ats-clean',
    name: 'ATS Clean Minimal',
    category: 'minimal',
    subcategory: 'ATS',
    sortOrder: 410,
    description: 'Simple ATS-first layout optimized for parsing accuracy.',
    provider: 'In-app',
    url: '',
    layoutKey: 'minimal',
    supportsLatex: true,
    accentHex: '111827',
    tags: ['ats', 'minimal']
  }),
  makeTemplate({
    templateId: 'minimal-mono-pro',
    name: 'Minimal Mono Pro',
    category: 'minimal',
    subcategory: 'Monospace',
    isPremium: true,
    sortOrder: 411,
    description: 'Monospace variant with strict alignment and concise sections.',
    provider: 'In-app',
    url: '',
    layoutKey: 'minimal',
    supportsLatex: true,
    accentHex: '0f172a',
    tags: ['minimal', 'mono']
  }),
  makeTemplate({
    templateId: 'professional-executive-pro',
    name: 'Professional Executive Pro',
    category: 'professional',
    subcategory: 'Executive',
    isPremium: true,
    sortOrder: 420,
    description: 'Executive profile emphasizing leadership and business outcomes.',
    provider: 'In-app',
    url: '',
    layoutKey: 'classic',
    supportsLatex: true,
    accentHex: '1e293b',
    tags: ['executive', 'leadership']
  }),
  makeTemplate({
    templateId: 'professional-compact-lite',
    name: 'Professional Compact Lite',
    category: 'professional',
    subcategory: 'Compact',
    sortOrder: 421,
    description: 'Compact professional resume for early/mid-career applicants.',
    provider: 'In-app',
    url: '',
    layoutKey: 'classic',
    supportsLatex: true,
    accentHex: '334155',
    tags: ['one-page', 'compact']
  }),
  makeTemplate({
    templateId: 'clean-business-slate',
    name: 'Clean Business Slate',
    category: 'clean',
    subcategory: 'Business',
    sortOrder: 430,
    description: 'Clean business-friendly layout with restrained visual style.',
    provider: 'In-app',
    url: '',
    layoutKey: 'classic',
    supportsLatex: true,
    accentHex: '334155',
    tags: ['clean', 'business']
  }),
  makeTemplate({
    templateId: 'clean-onepage-neat',
    name: 'Clean Onepage Neat',
    category: 'clean',
    subcategory: 'ATS',
    sortOrder: 431,
    description: 'Neat one-page format for ATS screening and recruiter scans.',
    provider: 'In-app',
    url: '',
    layoutKey: 'minimal',
    supportsLatex: true,
    accentHex: '1f2937',
    tags: ['clean', 'ats']
  })
];

const templateCatalog = [...coreTemplates, ...generatedTemplates, ...additionalInAppTemplates];

module.exports = { templateCatalog };
