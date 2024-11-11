const express = require('express');
const multer = require('multer');
const { createNotification } = require('../controllers/notificationController');
const { authMiddleware, adminAuthMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temp storage location for files

// Admin route to create notification
router.post('/notifications', authMiddleware, adminAuthMiddleware, upload.single('document'), createNotification);

module.exports = router;
