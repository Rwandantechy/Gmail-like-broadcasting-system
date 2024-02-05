// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/verifyOtp', authController.verifyOtp);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;