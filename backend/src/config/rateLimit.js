const rateLimit = require('express-rate-limit');
const response = require('../utils/response');

const createLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next) => {
      response.error(res, message, 429);
    }
  });
};

// Global rate limiter (100 requests per 15 minutes)
const globalLimiter = createLimiter(
  15 * 60 * 1000, 
  100, 
  'Too many requests from this IP, please try again after 15 minutes.'
);

// Contact form limiter (5 requests per 15 minutes)
const contactLimiter = createLimiter(
  15 * 60 * 1000, 
  5, 
  'Too many contact submissions from this IP. Please try again after 15 minutes.'
);

// Auth login limiter (10 attempts per 15 minutes)
const loginLimiter = createLimiter(
  15 * 60 * 1000, 
  10, 
  'Too many login attempts. Please try again after 15 minutes.'
);

module.exports = {
  globalLimiter,
  contactLimiter,
  loginLimiter
};
