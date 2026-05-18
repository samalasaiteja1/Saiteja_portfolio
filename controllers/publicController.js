const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Certification = require('../models/Certification');
const Contact = require('../models/Contact');
const Education = require('../models/Education');
const nodemailer = require('nodemailer');

// Create reusable transporter (only when credentials are set)
function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendHiringEmail({ name, email, subject, message }) {
  const transporter = getTransporter();
  if (!transporter) return; // skip if not configured
  const notifyTo = process.env.NOTIFY_EMAIL || process.env.EMAIL_USER;
  await transporter.sendMail({
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: notifyTo,
    replyTo: email,
    subject: `[Hiring Inquiry] ${subject}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;background:#0c0f1a;color:#f8fafc;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);padding:28px 32px;">
          <h2 style="margin:0;color:#fff;font-size:1.4rem;">📬 New Hiring Inquiry</h2>
        </div>
        <div style="padding:28px 32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#a8b4cf;width:90px;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#a8b4cf;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#7c3aed;">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#a8b4cf;">Subject</td><td style="padding:8px 0;">${subject}</td></tr>
          </table>
          <hr style="border:1px solid rgba(255,255,255,0.08);margin:20px 0;">
          <p style="color:#a8b4cf;margin-bottom:8px;font-size:0.9rem;">Message</p>
          <p style="background:rgba(255,255,255,0.05);border-radius:10px;padding:16px;line-height:1.7;white-space:pre-wrap;">${message}</p>
          <a href="mailto:${email}?subject=Re: ${subject}" style="display:inline-block;margin-top:20px;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;padding:12px 24px;border-radius:50px;text-decoration:none;font-weight:600;">Reply to ${name}</a>
        </div>
      </div>`,
  });
}

exports.getHome = async (req, res) => {
  try {
    const [skills, projects, certifications, skillsCount, projectsCount, certificationsCount] =
      await Promise.all([
        Skill.find().limit(6),
        Project.find().sort({ createdAt: -1 }).limit(3),
        Certification.find().sort({ issueDate: -1 }).limit(3),
        Skill.countDocuments(),
        Project.countDocuments(),
        Certification.countDocuments(),
      ]);
    res.render('pages/home', {
      title: 'Home',
      skills,
      projects,
      certifications,
      stats: { skills: skillsCount, projects: projectsCount, certifications: certificationsCount },
    });
  } catch {
    res.render('pages/home', {
      title: 'Home',
      skills: [],
      projects: [],
      certifications: [],
      stats: { skills: 0, projects: 0, certifications: 0 },
    });
  }
};

exports.getAbout = async (req, res) => {
  try {
    const [skills, education] = await Promise.all([
      Skill.find().sort({ category: 1 }),
      Education.find().sort({ createdAt: -1 }),
    ]);
    res.render('pages/about', { title: 'About', skills, education });
  } catch {
    res.render('pages/about', { title: 'About', skills: [], education: [] });
  }
};

exports.getContact = (req, res) => {
  res.render('pages/contact', { title: 'Contact' });
};

exports.postContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      req.flash('error_msg', 'All fields are required');
      return res.redirect('/contact');
    }
    const data = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    };
    await Contact.create(data);
    // Send email notification (fire-and-forget, don't block response)
    sendHiringEmail(data).catch(err => console.error('Email error:', err));
    req.flash('success_msg', 'Message sent successfully! I will get back to you soon.');
  } catch {
    req.flash('error_msg', 'Failed to send message. Please try again.');
  }
  res.redirect('/contact');
};

exports.downloadResume = async (req, res) => {
  try {
    const Admin = require('../models/Admin');
    const admin = await Admin.findOne();
    if (!admin || !admin.resumeUrl) {
      req.flash('error_msg', 'Resume not uploaded yet');
      return res.redirect('/');
    }

    const resumeUrl = admin.resumeUrl;
    const path = require('path');
    const fs = require('fs');

    // If it's a remote URL (like Cloudinary)
    if (resumeUrl.startsWith('http://') || resumeUrl.startsWith('https://')) {
      const response = await fetch(resumeUrl);
      if (!response.ok) throw new Error('Failed to fetch remote resume file');
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="SAMALA_SAITEJA.pdf"');
      return res.send(buffer);
    }

    // Local file
    const filePath = path.join(__dirname, '../public', resumeUrl);
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="SAMALA_SAITEJA.pdf"');
      return res.send(fileBuffer);
    } else {
      console.error('Resume file does not exist at path:', filePath);
      return res.status(404).send('Resume file not found on the server');
    }
  } catch (error) {
    console.error('Error downloading resume:', error);
    return res.status(500).send('Failed to download resume');
  }
};

