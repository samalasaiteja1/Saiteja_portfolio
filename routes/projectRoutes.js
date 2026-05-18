const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { projectUpload } = require('../config/cloudinary');

router.get('/', protect, projectController.getAdminProjects);
router.post('/', protect, projectUpload.single('image'), projectController.createProject);
router.put('/:id', protect, projectUpload.single('image'), projectController.updateProject);
router.delete('/:id', protect, projectController.deleteProject);

module.exports = router;
