const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    issueDate: { type: String, required: true },
    certificateImage: { type: String, default: '' },
    certificateLink: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certification', certificationSchema);
