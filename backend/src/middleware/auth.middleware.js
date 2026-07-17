const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const response = require('../utils/response');
const adminRepository = require('../repositories/admin.repository');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // 1. Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // 2. Check cookies
    else if (req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      return response.error(res, 'Authentication token missing. Please log in.', 401);
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, jwtConfig.accessSecret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return response.error(res, 'Access token has expired.', 401, { code: 'TOKEN_EXPIRED' });
      }
      return response.error(res, 'Invalid authentication token.', 401);
    }

    // Verify admin exists in database
    const admin = await adminRepository.findById(decoded.id);
    if (!admin) {
      return response.error(res, 'User account no longer exists.', 401);
    }

    // Attach admin details to request
    req.admin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    };

    next();
  } catch (error) {
    logger.error(`Authentication middleware error: ${error.message}`);
    return response.error(res, 'An error occurred during authentication.', 500);
  }
};

module.exports = {
  authenticate
};
