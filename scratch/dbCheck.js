require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const admin = await Admin.findOne();
  console.log('ADMIN RECORD:', admin);
  mongoose.connection.close();
}

check().catch(console.error);
