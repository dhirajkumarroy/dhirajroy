/**
 * Standardized API Response Helper
 */

const success = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

const error = (res, message, statusCode = 500, errors = null) => {
  const responsePayload = {
    status: 'error',
    message
  };

  if (errors) {
    responsePayload.errors = errors;
  }

  return res.status(statusCode).json(responsePayload);
};

module.exports = {
  success,
  error
};
