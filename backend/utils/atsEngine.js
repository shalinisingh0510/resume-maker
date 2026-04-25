const JOB_KEYWORDS = {
  'SDE 1 (Software Development Engineer I)': {
    skills: ['data structures', 'algorithms', 'python', 'java', 'javascript', 'git', 'coding', 'debugging', 'c++', 'sql', 'unit testing'],
    maang_focus: ['big o notation', 'complexity analysis', 'problem solving', 'leetcoding'],
    startup_focus: ['mvp', 'rapid development', 'agile', 'product mindset', 'versatility']
  },
  'SDE 2 (Software Development Engineer II)': {
    skills: ['system design', 'scalability', 'distributed systems', 'microservices', 'mentoring', 'code review', 'java', 'python', 'aws', 'api design'],
    maang_focus: ['high availability', 'load balancing', 'sharding', 'design patterns', 'concurrency'],
    startup_focus: ['full-stack', 'deployment', 'ownership', 'infrastructure as code', 'user experience']
  },
  'Full Stack Developer': {
    skills: ['react', 'node.js', 'javascript', 'html', 'css', 'sql', 'rest api', 'typescript', 'mongodb', 'express', 'next.js', 'graphql'],
    maang_focus: ['performance optimization', 'security', 'accessibility', 'component architecture'],
    startup_focus: ['firebase', 'vercel', 'supabase', 'fast prototyping', 'analytics', 'growth']
  },
  'Gen AI Developer': {
    skills: ['llm', 'large language models', 'python', 'pytorch', 'tensorflow', 'prompt engineering', 'langchain', 'openai', 'rag', 'vector databases'],
    maang_focus: ['transformer architecture', 'model quantization', 'fine-tuning', 'distributed training'],
    startup_focus: ['api integration', 'mvp AI apps', 'user-centric AI', 'cost optimization']
  },
  'Data Scientist': {
    skills: ['python', 'statistics', 'machine learning', 'sql', 'pandas', 'numpy', 'data analysis', 'modeling', 'scikit-learn', 'deep learning'],
    maang_focus: ['large scale data', 'spark', 'hadoop', 'ab testing at scale', 'statistical significance'],
    startup_focus: ['business insights', 'predictive modeling', 'data cleaning', 'automated reporting']
  },
  'Data Analyst': {
    skills: ['sql', 'excel', 'data visualization', 'tableau', 'power bi', 'data cleaning', 'reporting', 'statistics', 'kpi'],
    maang_focus: ['data governance', 'sql optimization', 'complex joins', 'data pipelines'],
    startup_focus: ['dashboards', 'adhoc analysis', 'marketing analytics', 'product metrics']
  }
};

const COMPANY_TIERS = {
  MAANG: ['google', 'meta', 'amazon', 'apple', 'netflix', 'microsoft', 'uber', 'airbnb', 'stripe'],
  STARTUP: ['early stage', 'series a', 'series b', 'fast-paced', 'scaling']
};

const tokenize = (text) => {
  return text.toLowerCase().split(/[\s,.\-()\n]+/).filter(t => t.length > 2);
};

const analyzeEducation = (text) => {
  const normalized = text.toLowerCase();
  const tiers = {
    tier1: ['iit', 'nit', 'bits', 'stanford', 'mit', 'harvard', 'cmu', 'berkeley', 'iim', 'ivy league'],
    degrees: ['b.tech', 'm.tech', 'phd', 'bachelor', 'master', 'cs', 'computer science', 'engineering']
  };
  
  const foundTier1 = tiers.tier1.filter(univ => normalized.includes(univ));
  const foundDegrees = tiers.degrees.filter(deg => normalized.includes(deg));
  
  let score = 50; // Base education score
  if (foundTier1.length > 0) score += 40;
  if (foundDegrees.length > 0) score += 10;
  
  return { score, foundTier1, foundDegrees };
};

const analyzeSummary = (text) => {
  const length = text.split(/\s+/).length;
  const hasActionVerbs = ['developed', 'led', 'managed', 'created', 'optimized', 'scaled', 'built'].some(v => text.toLowerCase().includes(v));
  
  let score = 40;
  if (length > 20 && length < 100) score += 30;
  if (hasActionVerbs) score += 30;
  
  return { score, length, hasActionVerbs };
};

const calculateComprehensiveATSReport = (text, role, companyType = 'GENERAL') => {
  const tokens = tokenize(text);
  const normalizedText = text.toLowerCase();
  const roleData = JOB_KEYWORDS[role] || JOB_KEYWORDS['SDE 1 (Software Development Engineer I)'];
  
  // Keyword Analysis
  const matchedSkills = roleData.skills.filter(s => normalizedText.includes(s.toLowerCase()));
  const missingSkills = roleData.skills.filter(s => !normalizedText.includes(s.toLowerCase()));
  
  // Tier Specific Analysis
  const matchedMaang = roleData.maang_focus.filter(s => normalizedText.includes(s.toLowerCase()));
  const matchedStartup = roleData.startup_focus.filter(s => normalizedText.includes(s.toLowerCase()));
  
  // Analyzers
  const edu = analyzeEducation(text);
  const summaryAnalysis = analyzeSummary(text.substring(0, 500)); // Assume summary is at start

  // Calculate Sub-scores
  const skillScore = (matchedSkills.length / roleData.skills.length) * 100;
  const focusScore = companyType === 'MAANG' 
    ? (matchedMaang.length / roleData.maang_focus.length) * 100 
    : companyType === 'STARTUP' 
      ? (matchedStartup.length / roleData.startup_focus.length) * 100
      : ((matchedMaang.length + matchedStartup.length) / (roleData.maang_focus.length + roleData.startup_focus.length)) * 100;

  return {
    role,
    companyType,
    skillAnalysis: {
      score: Math.round(skillScore),
      matched: matchedSkills,
      missing: missingSkills
    },
    focusAnalysis: {
      type: companyType,
      matched: companyType === 'MAANG' ? matchedMaang : companyType === 'STARTUP' ? matchedStartup : [...matchedMaang, ...matchedStartup]
    },
    education: edu,
    summary: summaryAnalysis,
    resumeStats: {
      wordCount: text.split(/\s+/).length,
      tokenCount: tokens.length
    }
  };
};

module.exports = { calculateComprehensiveATSReport, JOB_KEYWORDS };
