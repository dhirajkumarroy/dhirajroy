const { body } = require('express-validator');
const validate = require('../middleware/validation.middleware');

const loginValidationRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required.')
];

module.exports = {
  validateLogin: [loginValidationRules, validate]
};
