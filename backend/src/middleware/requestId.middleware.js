const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const requestIdMiddleware = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuidv4();
  
  // Set response header for client-side correlation
  res.setHeader('x-request-id', requestId);
  req.id = requestId;

  // Run the request context in AsyncLocalStorage
  logger.asyncLocalStorage.run({ requestId }, () => {
    next();
  });
};

module.exports = requestIdMiddleware;
