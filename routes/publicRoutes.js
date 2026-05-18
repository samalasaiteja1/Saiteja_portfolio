const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const skillController = require('../controllers/skillController');
const projectController = require('../controllers/projectController');
const certificationController = require('../controllers/certificationController');

router.get('/', publicController.getHome);
router.get('/about', publicController.getAbout);
router.get('/skills', skillController.getPublicSkills);
router.get('/projects', projectController.getPublicProjects);
router.get('/certifications', certificationController.getPublicCertifications);
router.get('/contact', publicController.getContact);
router.post('/contact', publicController.postContact);

// Resume download route
router.get('/resume/download', publicController.downloadResume);

module.exports = router;
