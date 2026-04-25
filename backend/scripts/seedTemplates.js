const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Template = require('../models/Template');

// Robust env loading
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

const templates = [
  // ==================== OVERLEAF / ACADEMIC ====================
  {
    templateId: 'overleaf-jake',
    name: "Jake's Resume (Standard)",
    category: 'professional',
    isPremium: false,
    thumbnail: 'https://raw.githubusercontent.com/jakegut/resume/master/resume.png',
    description: 'The most popular LaTeX template on Overleaf. Clean, high-density, and ATS-optimized.'
  },
  {
    templateId: 'overleaf-deedy',
    name: 'Deedy CV (Two Column)',
    category: 'creative',
    isPremium: true,
    thumbnail: 'https://raw.githubusercontent.com/deedy/Deedy-Resume/master/preview.png',
    description: 'A famous two-column LaTeX template. Modern, technical, and compact.'
  },
  {
    templateId: 'overleaf-modern',
    name: 'Modern Academic',
    category: 'student',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Elegant academic layout for researchers and graduates.'
  }
];

// Add more generic ones to hit 50
const categories = ['professional', 'student', 'creative', 'minimal'];
for (let i = 1; i <= 47; i++) {
  const cat = categories[i % categories.length];
  templates.push({
    templateId: `${cat.slice(0, 4)}-${i + 5}`,
    name: `${cat.charAt(0).toUpperCase() + cat.slice(1)} Elite ${i}`,
    category: cat,
    isPremium: i % 3 === 0,
    thumbnail: `https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=200&h=280&auto=format&fit=crop&sig=${i}`,
    description: `A premium ${cat} template designed for high-impact roles.`
  });
}

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found in environment');

    console.log('Connecting to:', uri.split('@')[1] || 'Local DB');
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
