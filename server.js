require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'portfolio_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);
app.use(flash());

app.use(async (req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');

  let resumePath = '';
  try {
    const Admin = require('./models/Admin');
    const admin = await Admin.findOne();
    if (admin && admin.resumeUrl) {
      resumePath = admin.resumeUrl;
    }
  } catch (err) {
    console.error('Failed to load dynamic resumeUrl:', err);
  }

  res.locals.site = {
    name: 'SAMALA SAITEJA',
    role: 'Full Stack Developer',
    email: 'samalasaiteja1143@gmail.com',
    phone: '+91 98765 43210',
    location: 'India',
    linkedin: 'https://www.linkedin.com/in/saiteja6305103588/',
    github: 'https://github.com/samalasaiteja1',
    twitter: 'https://x.com/Saiteja630510',
    instagram: 'https://www.instagram.com/saiteja.samala?igsh=anJ6MW1vMWQ4bndo',
    resume: resumePath,
    profileImage: '/images/profile.jpg',
  };
  next();
});

app.use('/', require('./routes/publicRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/admin/skills', require('./routes/skillRoutes'));
app.use('/admin/projects', require('./routes/projectRoutes'));
app.use('/admin/certifications', require('./routes/certificationRoutes'));
app.use('/admin/education', require('./routes/educationRoutes'));

app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Page Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('pages/404', { title: 'Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
