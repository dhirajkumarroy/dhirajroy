const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const contactController = require('../controllers/contact.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Protect all admin routes with JWT check
router.use(authenticate);

// Admin Dashboard stats
router.get('/dashboard', dashboardController.getDashboardData);

// Messages Management
router.get('/messages', contactController.getMessages);
router.get('/messages/:id', contactController.getMessageDetails);

// Status updates
router.patch('/messages/:id/read', (req, res, next) => {
  req.body.status = 'READ';
  contactController.updateMessageStatus(req, res, next);
});

router.patch('/messages/:id/archive', (req, res, next) => {
  req.body.status = 'ARCHIVED';
  contactController.updateMessageStatus(req, res, next);
});

// Reply and Delete
router.patch('/messages/:id/reply', contactController.replyToMessage);
router.delete('/messages/:id', contactController.softDeleteMessage);

module.exports = router;
