const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Template = require('../models/Template');
const { templateCatalog } = require('../data/templateCatalog');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const seedTemplates = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing. Add it in backend/.env before seeding.');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const template of templateCatalog) {
      await Template.updateOne(
        { templateId: template.templateId },
        { $set: template },
        { upsert: true }
      );
    }

    const staleIds = templateCatalog.map((item) => item.templateId);
    await Template.deleteMany({ templateId: { $nin: staleIds } });

    console.log(`Seeded ${templateCatalog.length} templates successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Template seed failed:', error.message);
    process.exit(1);
  }
};

seedTemplates();
