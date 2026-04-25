const templateCatalog = [
  {
    templateId: 'overleaf-jake',
    name: "Overleaf Jake",
    category: 'professional',
    subcategory: 'Engineering',
    isPremium: false,
    sortOrder: 1,
    description: 'Classic one-column technical resume inspired by the Jake template.',
    source: {
      provider: 'Overleaf',
      url: 'https://www.overleaf.com/latex/templates/jakes-resume/syzfjbzwjncs'
    },
    config: {
      layoutKey: 'jake',
      supportsLatex: true,
      tags: ['ats', 'engineering', 'one-page']
    }
  },
  {
    templateId: 'overleaf-jake-anon',
    name: 'Overleaf Jake Anonymous',
    category: 'professional',
    subcategory: 'Engineering',
    isPremium: false,
    sortOrder: 2,
    description: 'A clean anonymous variant with compact spacing for high information density.',
    source: {
      provider: 'Overleaf',
      url: 'https://www.overleaf.com/latex/templates/jakes-resume-anonymous/cstpnrbkhndn'
    },
    config: {
      layoutKey: 'jake',
      supportsLatex: true,
      tags: ['ats', 'compact']
    }
  },
  {
    templateId: 'overleaf-deedy',
    name: 'Overleaf Deedy',
    category: 'creative',
    subcategory: 'Two Column',
    isPremium: true,
    sortOrder: 3,
    description: 'Famous two-column resume style for technical profiles with strong project sections.',
    source: {
      provider: 'Overleaf',
      url: 'https://www.overleaf.com/latex/templates/deedy-cv/bjryvfsjdyxz'
    },
    config: {
      layoutKey: 'deedy',
      supportsLatex: true,
      tags: ['two-column', 'engineering']
    }
  },
  {
    templateId: 'overleaf-modern-deedy',
    name: 'Overleaf Modern Deedy',
    category: 'creative',
    subcategory: 'Two Column',
    isPremium: true,
    sortOrder: 4,
    description: 'A modernized single-column fork of Deedy with cleaner typography.',
    source: {
      provider: 'Overleaf',
      url: 'https://www.overleaf.com/latex/templates/modern-deedy/cxtjgrmpsrvh'
    },
    config: {
      layoutKey: 'modern',
      supportsLatex: true,
      tags: ['modern', 'technical']
    }
  },
  {
    templateId: 'overleaf-single-column-deedy',
    name: 'Overleaf Single Column Deedy',
    category: 'minimal',
    subcategory: 'One Column',
    isPremium: false,
    sortOrder: 5,
    description: 'One-column Deedy variant suited for ATS pipelines and dense content.',
    source: {
      provider: 'Overleaf',
      url: 'https://www.overleaf.com/latex/templates/single-column-deedy-cv-slash-resume-template/zwyxmkbrfgtz'
    },
    config: {
      layoutKey: 'minimal',
      supportsLatex: true,
      tags: ['ats', 'single-column']
    }
  },
  {
    templateId: 'overleaf-moderncv',
    name: 'Overleaf ModernCV',
    category: 'professional',
    subcategory: 'Executive',
    isPremium: true,
    sortOrder: 6,
    description: 'Elegant executive and consulting-oriented style inspired by ModernCV.',
    source: {
      provider: 'Overleaf',
      url: 'https://www.overleaf.com/articles/resume/qfhygkygpgbj'
    },
    config: {
      layoutKey: 'modern',
      supportsLatex: true,
      tags: ['executive', 'consulting']
    }
  },
  {
    templateId: 'builder-novoresume-classic',
    name: 'Novoresume Classic Inspired',
    category: 'professional',
    subcategory: 'Corporate',
    isPremium: false,
    sortOrder: 20,
    description: 'Corporate-friendly layout with strong readability and balanced sections.',
    source: {
      provider: 'Novoresume',
      url: 'https://novoresume.com/'
    },
    config: {
      layoutKey: 'classic',
      supportsLatex: false,
      tags: ['corporate', 'clean']
    }
  },
  {
    templateId: 'builder-resumeio-modern',
    name: 'Resume.io Modern Inspired',
    category: 'professional',
    subcategory: 'Modern',
    isPremium: false,
    sortOrder: 21,
    description: 'Modern polished structure for product, engineering, and business roles.',
    source: {
      provider: 'Resume.io',
      url: 'https://resume.io/'
    },
    config: {
      layoutKey: 'modern',
      supportsLatex: false,
      tags: ['modern', 'balanced']
    }
  },
  {
    templateId: 'builder-zety-cascade',
    name: 'Zety Cascade Inspired',
    category: 'professional',
    subcategory: 'Corporate',
    isPremium: true,
    sortOrder: 22,
    description: 'Structured layout with clear hierarchy and strong emphasis on achievements.',
    source: {
      provider: 'Zety',
      url: 'https://zety.com/'
    },
    config: {
      layoutKey: 'classic',
      supportsLatex: false,
      tags: ['corporate', 'achievement-first']
    }
  },
  {
    templateId: 'builder-kickresume-creative',
    name: 'Kickresume Creative Inspired',
    category: 'creative',
    subcategory: 'Designer',
    isPremium: true,
    sortOrder: 23,
    description: 'Creative-forward style for product design, branding, and visual roles.',
    source: {
      provider: 'Kickresume',
      url: 'https://www.kickresume.com/'
    },
    config: {
      layoutKey: 'deedy',
      supportsLatex: false,
      tags: ['creative', 'portfolio']
    }
  },
  {
    templateId: 'builder-canva-bold',
    name: 'Canva Bold Inspired',
    category: 'creative',
    subcategory: 'Portfolio',
    isPremium: true,
    sortOrder: 24,
    description: 'Bold visual structure with stronger section contrast for creative profiles.',
    source: {
      provider: 'Canva',
      url: 'https://www.canva.com/resumes/templates/'
    },
    config: {
      layoutKey: 'modern',
      supportsLatex: false,
      tags: ['creative', 'visual']
    }
  },
  {
    templateId: 'student-grad-entry',
    name: 'Student Grad Entry',
    category: 'student',
    subcategory: 'Entry Level',
    isPremium: false,
    sortOrder: 40,
    description: 'Student-first layout with projects and coursework highlighted above work history.',
    source: {
      provider: 'In-app',
      url: ''
    },
    config: {
      layoutKey: 'student',
      supportsLatex: false,
      tags: ['student', 'internship']
    }
  },
  {
    templateId: 'student-research-academic',
    name: 'Student Research Academic',
    category: 'student',
    subcategory: 'Academic',
    isPremium: false,
    sortOrder: 41,
    description: 'Academic-focused resume structure for higher studies and research applications.',
    source: {
      provider: 'In-app',
      url: ''
    },
    config: {
      layoutKey: 'student',
      supportsLatex: true,
      tags: ['student', 'research']
    }
  },
  {
    templateId: 'minimal-ats-clean',
    name: 'ATS Clean Minimal',
    category: 'minimal',
    subcategory: 'ATS',
    isPremium: false,
    sortOrder: 60,
    description: 'Simple ATS-first layout optimized for parsers and dense keyword matching.',
    source: {
      provider: 'In-app',
      url: ''
    },
    config: {
      layoutKey: 'minimal',
      supportsLatex: false,
      tags: ['ats', 'minimal']
    }
  },
  {
    templateId: 'minimal-mono-pro',
    name: 'Minimal Mono Pro',
    category: 'minimal',
    subcategory: 'Monospace',
    isPremium: true,
    sortOrder: 61,
    description: 'Minimal monospace style with strict alignment and concise sectioning.',
    source: {
      provider: 'In-app',
      url: ''
    },
    config: {
      layoutKey: 'minimal',
      supportsLatex: true,
      tags: ['minimal', 'compact']
    }
  },
  {
    templateId: 'professional-executive-pro',
    name: 'Professional Executive Pro',
    category: 'professional',
    subcategory: 'Executive',
    isPremium: true,
    sortOrder: 62,
    description: 'Executive resume emphasizing leadership, scale, and business outcomes.',
    source: {
      provider: 'In-app',
      url: ''
    },
    config: {
      layoutKey: 'classic',
      supportsLatex: false,
      tags: ['executive', 'leadership']
    }
  },
  {
    templateId: 'professional-compact-lite',
    name: 'Professional Compact Lite',
    category: 'professional',
    subcategory: 'Compact',
    isPremium: false,
    sortOrder: 63,
    description: 'Compact one-page professional layout for early and mid-career applicants.',
    source: {
      provider: 'In-app',
      url: ''
    },
    config: {
      layoutKey: 'classic',
      supportsLatex: false,
      tags: ['one-page', 'compact']
    }
  }
];

module.exports = { templateCatalog };
