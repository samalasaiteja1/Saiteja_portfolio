const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const Admin = require('../models/Admin');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Certification = require('../models/Certification');
const Contact = require('../models/Contact');

const generateToken = (admin) =>
  jwt.sign(
    { id: admin._id, username: admin.username, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

exports.getLogin = (req, res) => {
  res.render('admin/login', { title: 'Admin Login' });
};

exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash('error_msg', 'Email and password are required');
      return res.redirect('/admin/login');
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin || !(await admin.comparePassword(password))) {
      req.flash('error_msg', 'Invalid email or password');
      return res.redirect('/admin/login');
    }

    const token = generateToken(admin);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    req.flash('success_msg', 'Welcome back!');
    res.redirect('/admin/dashboard');
  } catch (error) {
    req.flash('error_msg', 'Login failed. Please try again.');
    res.redirect('/admin/login');
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  req.flash('success_msg', 'Logged out successfully');
  res.redirect('/admin/login');
};

exports.getDashboard = async (req, res) => {
  try {
    const [skillsCount, projectsCount, certificationsCount, messagesCount] =
      await Promise.all([
        Skill.countDocuments(),
        Project.countDocuments(),
        Certification.countDocuments(),
        Contact.countDocuments(),
      ]);

    const recentMessages = await Contact.find().sort({ createdAt: -1 }).limit(5);
    const adminDoc = await Admin.findById(req.admin.id);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      admin: adminDoc,
      stats: { skillsCount, projectsCount, certificationsCount, messagesCount },
      recentMessages,
    });
  } catch (error) {
    req.flash('error_msg', 'Failed to load dashboard');
    res.redirect('/admin/login');
  }
};

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      req.flash('error_msg', 'Please select a PDF file to upload');
      return res.redirect('/admin/dashboard');
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      req.flash('error_msg', 'Admin profile not found');
      return res.redirect('/admin/dashboard');
    }

    // Clean up old resume if it exists
    if (admin.resumeUrl) {
      const oldPath = path.join(__dirname, '../public', admin.resumeUrl);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          /* ignore file unlink errors */
        }
      }
    }

    admin.resumeUrl = `/uploads/${req.file.filename}`;
    await admin.save();

    req.flash('success_msg', 'Resume uploaded successfully');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to upload resume');
  }
  res.redirect('/admin/dashboard');
};

exports.deleteResume = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin || !admin.resumeUrl) {
      req.flash('error_msg', 'No resume uploaded yet');
      return res.redirect('/admin/dashboard');
    }

    const filePath = path.join(__dirname, '../public', admin.resumeUrl);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        /* ignore file unlink errors */
      }
    }

    admin.resumeUrl = '';
    await admin.save();

    req.flash('success_msg', 'Resume deleted successfully');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to delete resume');
  }
  res.redirect('/admin/dashboard');
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    req.flash('success_msg', 'Message deleted successfully');
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Failed to delete message');
  }
  res.redirect('/admin/dashboard');
};
