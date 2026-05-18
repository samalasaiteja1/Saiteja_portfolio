const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, skillController.getAdminSkills);
router.post('/', protect, skillController.createSkill);
router.put('/:id', protect, skillController.updateSkill);
router.delete('/:id', protect, skillController.deleteSkill);

module.exports = router;
