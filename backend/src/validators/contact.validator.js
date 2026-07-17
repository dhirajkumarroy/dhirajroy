const { body } = require('express-validator');
const validate = require('../middleware/validation.middleware');

const contactValidationRules = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters.'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 8, max: 20 }).withMessage('Phone number must be between 8 and 20 digits if provided.'),

  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required.')
    .isLength({ min: 3, max: 200 }).withMessage('Subject must be between 3 and 200 characters.'),
  
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required.')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters.')
];

module.exports = {
  validateContact: [contactValidationRules, validate]
};
