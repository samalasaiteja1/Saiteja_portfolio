const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, educationController.getAdminEducation);
router.post('/', protect, educationController.createEducation);
router.put('/:id', protect, educationController.updateEducation);
router.delete('/:id', protect, educationController.deleteEducation);

module.exports = router;
