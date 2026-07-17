const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { validateContact } = require('../validators/contact.validator');
const { contactLimiter } = require('../config/rateLimit');
const { testConnection } = require('../config/database');
const { verifyTransporter } = require('../config/mail');
const response = require('../utils/response');

// Public Contact Form Submission
router.post('/contact', contactLimiter, validateContact, contactController.submitContact);

// Health Check API
router.get('/health', (req, res) => {
  return response.success(res, 'System is healthy.', {
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Database Health Check
router.get('/health/db', async (req, res) => {
  const isDbHealthy = await testConnection(1, 0); // 1 check, 0ms delay
  if (isDbHealthy) {
    return response.success(res, 'Database connection is healthy.');
  } else {
    return response.error(res, 'Database connection failed.', 503);
  }
});

// Email Service Health Check
router.get('/health/mail', async (req, res) => {
  const isMailHealthy = await verifyTransporter();
  if (isMailHealthy) {
    return response.success(res, 'Mail server connection is healthy.');
  } else {
    return response.error(res, 'Mail server connection failed.', 503);
  }
});

module.exports = router;
