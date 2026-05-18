const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true, trim: true },
    fieldOfStudy: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Education', educationSchema);
