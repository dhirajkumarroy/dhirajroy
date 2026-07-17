const logger = require('../utils/logger');
const response = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  logger.error(`Unhandled Error: ${err.message}\nStack: ${err.stack}`);

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'An internal server error occurred.' 
    : err.message;

  const details = process.env.NODE_ENV === 'production' 
    ? null 
    : { stack: err.stack };

  return response.error(res, message, statusCode, details);
};

// 404 Route Handler
const notFoundHandler = (req, res, next) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  return response.error(res, `Route '${req.originalUrl}' not found on this server.`, 404);
};

module.exports = {
  errorHandler,
  notFoundHandler
};
