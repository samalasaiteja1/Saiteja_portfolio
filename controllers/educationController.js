const Education = require('../models/Education');

exports.getAdminEducation = async (req, res) => {
  try {
    const education = await Education.find().sort({ createdAt: -1 });
    res.render('admin/education', {
      title: 'Manage Education',
      education,
      admin: req.admin,
    });
  } catch (error) {
    req.flash('error_msg', 'Failed to load education details');
    res.redirect('/admin/dashboard');
  }
};

exports.createEducation = async (req, res) => {
  try {
    const { degree, fieldOfStudy, duration, institution } = req.body;
    if (!degree?.trim() || !fieldOfStudy?.trim() || !duration?.trim() || !institution?.trim()) {
      req.flash('error_msg', 'All fields are required');
      return res.redirect('/admin/education');
    }
    await Education.create({
      degree: degree.trim(),
      fieldOfStudy: fieldOfStudy.trim(),
      duration: duration.trim(),
      institution: institution.trim(),
    });
    req.flash('success_msg', 'Education details added successfully');
  } catch (error) {
    req.flash('error_msg', 'Failed to add education details');
  }
  res.redirect('/admin/education');
};

exports.updateEducation = async (req, res) => {
  try {
    const { degree, fieldOfStudy, duration, institution } = req.body;
    const edu = await Education.findById(req.params.id);
    if (!edu) {
      req.flash('error_msg', 'Education detail not found');
      return res.redirect('/admin/education');
    }
    await Education.findByIdAndUpdate(req.params.id, {
      degree: degree?.trim(),
      fieldOfStudy: fieldOfStudy?.trim(),
      duration: duration?.trim(),
      institution: institution?.trim(),
    });
    req.flash('success_msg', 'Education details updated successfully');
  } catch (error) {
    req.flash('error_msg', 'Failed to update education details');
  }
  res.redirect('/admin/education');
};

exports.deleteEducation = async (req, res) => {
  try {
    const edu = await Education.findById(req.params.id);
    if (!edu) {
      req.flash('error_msg', 'Education detail not found');
      return res.redirect('/admin/education');
    }
    await Education.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Education details deleted successfully');
  } catch (error) {
    req.flash('error_msg', 'Failed to delete education details');
  }
  res.redirect('/admin/education');
};
