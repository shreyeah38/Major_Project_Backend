const express = require('express');
const {
  studentSignup,
  adminSignup,
  studentLogin,
  adminLogin,
  getStudentProfile,
  getStudentProfileByEnrollment,
  logout
} = require('../controllers/authController');
const { authMiddleware, adminAuthMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Student signup and login routes (restricted to admins)
router.post('/student/signup', authMiddleware, adminAuthMiddleware, studentSignup);
router.post('/student/login', studentLogin);

// Admin signup (restricted to admins)
router.post('/admin/signup', authMiddleware, adminAuthMiddleware, adminSignup);
router.post('/admin/login', adminLogin);

// Protected route for student profile
router.get('/student/profile', authMiddleware, getStudentProfile);

// Admin-only route to get student profile by enrollment
router.get('/admin/student/:enrollment', authMiddleware, adminAuthMiddleware, getStudentProfileByEnrollment);

router.post('/logout', authMiddleware, logout); // Protected route to log out

module.exports = router;
