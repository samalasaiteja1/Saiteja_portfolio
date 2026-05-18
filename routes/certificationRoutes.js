const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certificationController');
const { protect } = require('../middleware/authMiddleware');
const { certificationUpload } = require('../config/cloudinary');

router.get('/', protect, certificationController.getAdminCertifications);
router.post('/', protect, certificationUpload.single('certificateImage'), certificationController.createCertification);
router.put('/:id', protect, certificationUpload.single('certificateImage'), certificationController.updateCertification);
router.delete('/:id', protect, certificationController.deleteCertification);

module.exports = router;
