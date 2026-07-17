const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateLogin } = require('../validators/login.validator');
const { authenticate } = require('../middleware/auth.middleware');
const { loginLimiter } = require('../config/rateLimit');

router.post('/login', loginLimiter, validateLogin, authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh', authController.refresh);
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
