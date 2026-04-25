export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All Templates' },
  { id: 'professional', name: 'Professional' },
  { id: 'student', name: 'Student / Entry Level' },
  { id: 'creative', name: 'Creative / Modern' },
  { id: 'clean', name: 'Clean & Simple' },
  { id: 'minimal', name: 'Minimalist' },
  { id: 'premium', name: 'Premium (PRO)' }
];

export const RESUME_TEMPLATES = [
  // ==================== PROFESSIONAL ====================
  {
    id: 'prof-1',
    name: 'Executive Onyx',
    category: 'professional',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'A classic, authoritative design for senior professionals.'
  },
  {
    id: 'prof-2',
    name: 'Corporate Blue',
    category: 'professional',
    isPremium: true,
    thumbnail: 'https://images.unsplash.com/photo-1626197031507-c17099753214?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Sharp lines and traditional layout favored by Fortune 500 companies.'
  },
  {
    id: 'prof-3',
    name: 'The Director',
    category: 'professional',
    isPremium: true,
    thumbnail: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Elegant serif typography for leadership roles.'
  },
  {
    id: 'prof-4',
    name: 'Global Talent',
    category: 'professional',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1506784919141-9350338951b1?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Clean header with focused skills section.'
  },
  {
    id: 'prof-5',
    name: 'Apex Management',
    category: 'professional',
    isPremium: true,
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Sophisticated grid layout for complex career paths.'
  },

  // ==================== STUDENT ====================
  {
    id: 'stud-1',
    name: 'First Step',
    category: 'student',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Highlights education and coursework for recent grads.'
  },
  {
    id: 'stud-2',
    name: 'Academic Pro',
    category: 'student',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Perfect for researchers and graduate students.'
  },
  {
    id: 'stud-3',
    name: 'Internship Ready',
    category: 'student',
    isPremium: true,
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Modern student layout with a focus on project work.'
  },
  {
    id: 'stud-4',
    name: 'Campus Legend',
    category: 'student',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Compact and clear for high-impact achievements.'
  },

  // ==================== CREATIVE ====================
  {
    id: 'creat-1',
    name: 'Design Pulse',
    category: 'creative',
    isPremium: true,
    thumbnail: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Vibrant sidebar and modern icons for designers.'
  },
  {
    id: 'creat-2',
    name: 'Neon Tech',
    category: 'creative',
    isPremium: true,
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Futuristic look for Gen AI and Tech developers.'
  },
  {
    id: 'creat-3',
    name: 'Portfolio Plus',
    category: 'creative',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Visual-first layout with social media badges.'
  },
  {
    id: 'creat-4',
    name: 'The Artisan',
    category: 'creative',
    isPremium: true,
    thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Unique asymmetrical design for artistic roles.'
  },

  // ==================== CLEAN ====================
  {
    id: 'clean-1',
    name: 'Pure White',
    category: 'clean',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Uncluttered and extremely readable.'
  },
  {
    id: 'clean-2',
    name: 'Skyline',
    category: 'clean',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Light blue accents with thin dividing lines.'
  },
  {
    id: 'clean-3',
    name: 'Eco Green',
    category: 'clean',
    isPremium: true,
    thumbnail: 'https://images.unsplash.com/photo-1501854140801-50d01674aa3e?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Fresh design with natural color accents.'
  },

  // ==================== MINIMAL ====================
  {
    id: 'min-1',
    name: 'Simple Silver',
    category: 'minimal',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'No-nonsense minimalist design.'
  },
  {
    id: 'min-2',
    name: 'The Ghost',
    category: 'minimal',
    isPremium: true,
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Ultra-thin fonts and maximum white space.'
  }
];

// Add more dynamically to reach 40-50
for (let i = 6; i <= 15; i++) {
  RESUME_TEMPLATES.push({
    id: `prof-${i}`,
    name: `Enterprise ${i}`,
    category: 'professional',
    isPremium: i > 8,
    thumbnail: `https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=200&h=280&auto=format&fit=crop&sig=${i}`,
    description: 'A professional template optimized for large-scale enterprise roles.'
  });
}

for (let i = 5; i <= 12; i++) {
  RESUME_TEMPLATES.push({
    id: `stud-${i}`,
    name: `Graduate ${i}`,
    category: 'student',
    isPremium: i > 7,
    thumbnail: `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200&h=280&auto=format&fit=crop&sig=${i}`,
    description: 'Clean academic layout focused on projects and skills.'
  });
}

for (let i = 5; i <= 10; i++) {
  RESUME_TEMPLATES.push({
    id: `creat-${i}`,
    name: `Visionary ${i}`,
    category: 'creative',
    isPremium: true,
    thumbnail: `https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=200&h=280&auto=format&fit=crop&sig=${i}`,
    description: 'Premium creative design for high-impact visual roles.'
  });
}

for (let i = 4; i <= 10; i++) {
  RESUME_TEMPLATES.push({
    id: `min-${i}`,
    name: `Essential ${i}`,
    category: 'minimal',
    isPremium: i > 6,
    thumbnail: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=200&h=280&auto=format&fit=crop&sig=${i}`,
    description: 'Minimalist layout focusing on pure content.'
  });
}
