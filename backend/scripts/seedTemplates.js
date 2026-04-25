const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Template = require('../models/Template');

// Robust env loading
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const templates = [
  // ==================== OVERLEAF / PREMIUM ====================
  {
    templateId: 'overleaf-jake',
    name: "Jake's Resume (Standard)",
    category: 'professional',
    isPremium: false,
    thumbnail: 'https://i.ibb.co/Lz0x2W2/jakes-resume-preview.png',
    description: 'The most popular LaTeX template on Overleaf. Clean, high-density, and ATS-optimized.'
  },
  {
    templateId: 'overleaf-deedy',
    name: 'Deedy CV (Two Column)',
    category: 'creative',
    isPremium: true,
    thumbnail: 'https://i.ibb.co/yq45NqX/deedy-cv-preview.png',
    description: 'A famous two-column LaTeX template. Modern, technical, and compact.'
  },
  {
    templateId: 'overleaf-modern',
    name: 'Modern Academic',
    category: 'student',
    isPremium: false,
    thumbnail: 'https://i.ibb.co/M9K4V1C/modern-academic-preview.png',
    description: 'Elegant academic layout for researchers and graduates.'
  }
];

// Add more generic ones but with real-looking thumbnails
const categories = ['professional', 'student', 'creative', 'minimal'];
const thumbPool = [
  'https://i.ibb.co/Lz0x2W2/jakes-resume-preview.png',
  'https://i.ibb.co/yq45NqX/deedy-cv-preview.png',
  'https://i.ibb.co/M9K4V1C/modern-academic-preview.png',
  'https://i.ibb.co/Lz0x2W2/jakes-resume-preview.png'
];

for (let i = 1; i <= 47; i++) {
  const cat = categories[i % categories.length];
  templates.push({
    templateId: `${cat.slice(0, 4)}-${i + 5}`,
    name: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Elite ${i}`,
    category: cat,
    isPremium: i % 3 === 0,
    thumbnail: thumbPool[i % thumbPool.length],
    description: `A premium ${cat} template designed for high-impact roles.`
  });
}

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found in environment');

    console.log('Connecting to Atlas...');
    await mongoose.connect(uri);
    
    await Template.deleteMany({});
    console.log('Cleared existing templates');
    
    await Template.insertMany(templates);
    console.log(`Successfully seeded ${templates.length} templates!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
