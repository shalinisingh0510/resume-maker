const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Template = require('../models/Template');

dotenv.config({ path: '../.env' });

const templates = [
  // ==================== PROFESSIONAL ====================
  {
    templateId: 'prof-1',
    name: 'Executive Onyx',
    category: 'professional',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'A classic, authoritative design for senior professionals.'
  },
  {
    templateId: 'prof-2',
    name: 'Corporate Blue',
    category: 'professional',
    isPremium: true,
    thumbnail: 'https://images.unsplash.com/photo-1626197031507-c17099753214?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Sharp lines and traditional layout favored by Fortune 500 companies.'
  },
  {
    templateId: 'prof-3',
    name: 'The Director',
    category: 'professional',
    isPremium: true,
    thumbnail: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?q=80&w=200&h=280&auto=format&fit=crop',
    description: 'Elegant serif typography for leadership roles.'
  }
];

// Dynamically generate the remaining to hit 50
for (let i = 4; i <= 15; i++) {
  templates.push({
    templateId: `prof-${i}`,
    name: `Enterprise ${i}`,
    category: 'professional',
    isPremium: i > 7,
    thumbnail: `https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=200&h=280&auto=format&fit=crop&sig=${i}`,
    description: 'A professional template optimized for large-scale enterprise roles.'
  });
}

for (let i = 1; i <= 15; i++) {
  templates.push({
    templateId: `stud-${i}`,
    name: `Academic Scholar ${i}`,
    category: 'student',
    isPremium: i > 5,
    thumbnail: `https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=200&h=280&auto=format&fit=crop&sig=${i}`,
    description: 'Clean academic layout focused on projects and skills.'
  });
}

for (let i = 1; i <= 10; i++) {
  templates.push({
    templateId: `creat-${i}`,
    name: `Creative Edge ${i}`,
    category: 'creative',
    isPremium: true,
    thumbnail: `https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=200&h=280&auto=format&fit=crop&sig=${i}`,
    description: 'Vibrant and modern design for high-impact visual roles.'
  });
}

for (let i = 1; i <= 10; i++) {
  templates.push({
    templateId: `min-${i}`,
    name: `Minimal ${i}`,
    category: 'minimal',
    isPremium: i > 4,
    thumbnail: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=200&h=280&auto=format&fit=crop&sig=${i}`,
    description: 'Ultra-clean minimalist layout.'
  });
}

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27012/resume-maker');
    console.log('Connected to DB for seeding...');
    
    // Clear existing
    await Template.deleteMany({});
    console.log('Cleared existing templates');
    
    // Insert new
    await Template.insertMany(templates);
    console.log(`Successfully seeded ${templates.length} templates!`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
