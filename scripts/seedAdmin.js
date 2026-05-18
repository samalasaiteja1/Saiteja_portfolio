require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Skill = require('../models/Skill');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await Admin.findOne({
      email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
    });

    if (!existingAdmin) {
      await Admin.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
      });
      console.log('Admin user created');
    } else {
      console.log('Admin already exists');
    }

    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      await Skill.insertMany([
        { name: 'Node.js', category: 'Backend', icon: 'fab fa-node-js' },
        { name: 'Express.js', category: 'Backend', icon: 'fas fa-server' },
        { name: 'MongoDB', category: 'Database', icon: 'fas fa-database' },
        { name: 'Azure', category: 'Cloud', icon: 'fab fa-microsoft' },
        { name: 'Terraform', category: 'DevOps', icon: 'fas fa-cloud' },
        { name: 'Jenkins', category: 'DevOps', icon: 'fab fa-jenkins' },
        { name: 'PySpark', category: 'Data', icon: 'fab fa-python' },
        { name: 'Databricks', category: 'Data', icon: 'fas fa-chart-line' },
      ]);
      console.log('Sample skills seeded');
    }

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
