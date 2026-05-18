const Certification = require('../models/Certification');
const { cloudinary } = require('../config/cloudinary');

const deleteCloudinaryImage = async (imageUrl) => {
  if (!imageUrl?.includes('cloudinary')) return;
  try {
    const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
    await cloudinary.uploader.destroy(
      `portfolio/certifications/${publicId.split('/').pop()}`
    );
  } catch {
    /* ignore cleanup errors */
  }
};

exports.getPublicCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ issueDate: -1 });
    res.render('pages/certifications', { title: 'Certifications', certifications });
  } catch {
    res.render('pages/certifications', { title: 'Certifications', certifications: [] });
  }
};

exports.getAdminCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ createdAt: -1 });
    res.render('admin/certifications', {
      title: 'Manage Certifications',
      certifications,
      admin: req.admin,
    });
  } catch {
    req.flash('error_msg', 'Failed to load certifications');
    res.redirect('/admin/dashboard');
  }
};

exports.createCertification = async (req, res) => {
  try {
    const { title, organization, issueDate, certificateLink } = req.body;
    if (!title?.trim() || !organization?.trim() || !issueDate?.trim()) {
      req.flash('error_msg', 'Title, organization, and issue date are required');
      return res.redirect('/admin/certifications');
    }
    await Certification.create({
      title: title.trim(),
      organization: organization.trim(),
      issueDate: issueDate.trim(),
      certificateLink: certificateLink?.trim() || '',
      certificateImage: req.file?.path || '',
    });
    req.flash('success_msg', 'Certification added successfully');
  } catch {
    req.flash('error_msg', 'Failed to add certification');
  }
  res.redirect('/admin/certifications');
};

exports.updateCertification = async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (!cert) {
      req.flash('error_msg', 'Certification not found');
      return res.redirect('/admin/certifications');
    }

    const { title, organization, issueDate, certificateLink } = req.body;
    const updateData = {
      title: title?.trim(),
      organization: organization?.trim(),
      issueDate: issueDate?.trim(),
      certificateLink: certificateLink?.trim() || '',
    };

    if (req.file?.path) {
      await deleteCloudinaryImage(cert.certificateImage);
      updateData.certificateImage = req.file.path;
    }

    await Certification.findByIdAndUpdate(req.params.id, updateData);
    req.flash('success_msg', 'Certification updated successfully');
  } catch {
    req.flash('error_msg', 'Failed to update certification');
  }
  res.redirect('/admin/certifications');
};

exports.deleteCertification = async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (cert?.certificateImage) await deleteCloudinaryImage(cert.certificateImage);
    await Certification.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Certification deleted successfully');
  } catch {
    req.flash('error_msg', 'Failed to delete certification');
  }
  res.redirect('/admin/certifications');
};
