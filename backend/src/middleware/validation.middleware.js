const { validationResult } = require('express-validator');
const response = require('../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format validation errors to be easily readable
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    return response.error(res, 'Validation failed.', 400, formattedErrors);
  }
  next();
};

module.exports = validate;
