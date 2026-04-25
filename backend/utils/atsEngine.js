const JOB_KEYWORDS = {
  'General Professional': {
    mandatory: ['experience', 'education', 'skills', 'projects', 'communication', 'teamwork'],
    optional: ['leadership', 'management', 'problem solving', 'strategy', 'collaboration']
  },
  'SDE 1 (Software Development Engineer I)': {
    mandatory: ['data structures', 'algorithms', 'python', 'java', 'javascript', 'git', 'coding', 'debugging'],
    optional: ['problem solving', 'c++', 'sql', 'react', 'node.js', 'software development', 'internship', 'computer science']
  },
  'SDE 2 (Software Development Engineer II)': {
    mandatory: ['system design', 'scalability', 'distributed systems', 'microservices', 'mentoring', 'code review', 'java', 'python', 'aws'],
    optional: ['kubernetes', 'docker', 'cloud architecture', 'performance optimization', 'api design', 'high availability']
  },
  'Full Stack Developer': {
    mandatory: ['react', 'node.js', 'javascript', 'html', 'css', 'sql', 'rest api', 'frontend', 'backend'],
    optional: ['typescript', 'mongodb', 'express', 'next.js', 'aws', 'docker', 'graphql', 'tailwind']
  },
  'Gen AI Developer': {
    mandatory: ['llm', 'large language models', 'python', 'pytorch', 'tensorflow', 'prompt engineering', 'langchain', 'openai'],
    optional: ['rag', 'vector databases', 'fine-tuning', 'hugging face', 'transformers', 'mlops', 'nlp', 'embeddings']
  },
  'Data Scientist': {
    mandatory: ['python', 'statistics', 'machine learning', 'sql', 'pandas', 'numpy', 'data analysis', 'modeling'],
    optional: ['scikit-learn', 'deep learning', 'r', 'tableau', 'big data', 'hadoop', 'spark', 'visualization']
  },
  'Data Analyst': {
    mandatory: ['sql', 'excel', 'data visualization', 'tableau', 'power bi', 'data cleaning', 'reporting', 'statistics'],
    optional: ['python', 'pandas', 'google analytics', 'eda', 'dashboard', 'sql queries', 'metrics']
  },
  'Frontend Developer': {
    mandatory: ['javascript', 'react', 'html', 'css', 'typescript', 'responsive design', 'browser tools'],
    optional: ['redux', 'next.js', 'tailwind', 'vue', 'angular', 'webpack', 'figma', 'ui/ux']
  },
  'Backend Developer': {
    mandatory: ['node.js', 'python', 'java', 'sql', 'rest api', 'database', 'authentication', 'server'],
    optional: ['express', 'django', 'postgresql', 'mongodb', 'redis', 'microservices', 'c#', 'golang']
  },
  'DevOps Engineer': {
    mandatory: ['ci/cd', 'docker', 'kubernetes', 'aws', 'terraform', 'linux', 'bash', 'monitoring'],
    optional: ['ansible', 'jenkins', 'gcp', 'azure', 'git', 'networking', 'security', 'python']
  }
};

const calculateLocalATSScore = (text, role) => {
  const normalizedText = text.toLowerCase();
  const roleData = JOB_KEYWORDS[role] || JOB_KEYWORDS['General Professional'];
  
  const allKeywords = [...roleData.mandatory, ...roleData.optional];
  const matched = [];
  const missing = [];
  
  roleData.mandatory.forEach(kw => {
    if (normalizedText.includes(kw.toLowerCase())) matched.push(kw);
    else missing.push(kw);
  });
  
  roleData.optional.forEach(kw => {
    if (normalizedText.includes(kw.toLowerCase())) matched.push(kw);
    else missing.push(kw);
  });

  // Basic scoring logic:
  // Mandatory: 60% of score (normalized by count)
  // Optional: 40% of score (normalized by count)
  const mandatoryWeight = 60;
  const optionalWeight = 40;
  
  const mandatoryScore = roleData.mandatory.length > 0 
    ? (matched.filter(kw => roleData.mandatory.includes(kw)).length / roleData.mandatory.length) * mandatoryWeight 
    : mandatoryWeight;
    
  const optionalScore = roleData.optional.length > 0 
    ? (matched.filter(kw => roleData.optional.includes(kw)).length / roleData.optional.length) * optionalWeight 
    : optionalWeight;
    
  const keywordMatchScore = Math.round(mandatoryScore + optionalScore);

  // Structural score: check for standard sections
  const sections = ['experience', 'education', 'skills', 'projects', 'summary'];
  let sectionScore = 0;
  sections.forEach(s => { if (normalizedText.includes(s)) sectionScore += 20; });
  
  // Final weighted score: 70% keyword, 30% section
  const overallScore = Math.round((keywordMatchScore * 0.7) + (sectionScore * 0.3));

  return {
    overallScore: Math.min(overallScore, 100),
    matched,
    missing,
    keywordMatchScore,
    sectionScore
  };
};

module.exports = { calculateLocalATSScore, JOB_KEYWORDS };
