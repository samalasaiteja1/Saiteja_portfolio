const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, redirectIfAuthenticated } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer disk storage for local PDF resume upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `resume-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

router.get('/login', redirectIfAuthenticated, adminController.getLogin);
router.post('/login', redirectIfAuthenticated, adminController.postLogin);
router.get('/logout', adminController.logout);
router.get('/dashboard', protect, adminController.getDashboard);

// Resume routes
router.post('/resume/upload', protect, upload.single('resume'), adminController.uploadResume);
router.post('/resume/delete', protect, adminController.deleteResume);

// Messages routes
router.post('/messages/delete/:id', protect, adminController.deleteMessage);

module.exports = router;
