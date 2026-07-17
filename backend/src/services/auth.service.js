const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtConfig = require('../config/jwt');
const adminRepository = require('../repositories/admin.repository');
const logger = require('../utils/logger');

class AuthService {
  generateAccessToken(admin) {
    return jwt.sign(
      { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
      jwtConfig.accessSecret,
      { expiresIn: jwtConfig.accessTokenExpiry }
    );
  }

  generateRefreshToken(admin) {
    return jwt.sign(
      { id: admin.id },
      jwtConfig.refreshSecret,
      { expiresIn: jwtConfig.refreshTokenExpiry }
    );
  }

  async login(email, password, ipAddress, userAgent) {
    try {
      const admin = await adminRepository.findByEmail(email);
      if (!admin) {
        logger.warn(`Failed login attempt for email: ${email} (User not found)`);
        return null;
      }

      const isMatch = await bcrypt.compare(password, admin.password_hash);
      if (!isMatch) {
        logger.warn(`Failed login attempt for email: ${email} (Incorrect password)`);
        await adminRepository.logActivity(admin.id, 'LOGIN_FAILED', 'Incorrect password attempt', ipAddress, userAgent);
        return null;
      }

      // Generate tokens
      const accessToken = this.generateAccessToken(admin);
      const refreshToken = this.generateRefreshToken(admin);

      // Log successful activity
      await adminRepository.logActivity(admin.id, 'LOGIN_SUCCESS', 'Admin logged in successfully', ipAddress, userAgent);

      logger.info(`Admin logged in successfully: ${email}`);

      return {
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        },
        accessToken,
        refreshToken
      };
    } catch (error) {
      logger.error(`AuthService.login error: ${error.message}`);
      throw error;
    }
  }

  async refresh(refreshToken) {
    try {
      if (!refreshToken) return null;

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);
      } catch (err) {
        logger.warn(`Invalid or expired refresh token: ${err.message}`);
        return null;
      }

      // Check admin account
      const admin = await adminRepository.findById(decoded.id);
      if (!admin) {
        logger.warn(`Refresh token used for non-existent admin ID: ${decoded.id}`);
        return null;
      }

      // Generate new access token
      const accessToken = this.generateAccessToken(admin);
      
      // Also generate a new refresh token (token rotation is safer)
      const newRefreshToken = this.generateRefreshToken(admin);

      return {
        accessToken,
        refreshToken: newRefreshToken,
        admin
      };
    } catch (error) {
      logger.error(`AuthService.refresh error: ${error.message}`);
      throw error;
    }
  }

  async logout(adminId, ipAddress, userAgent) {
    try {
      await adminRepository.logActivity(adminId, 'LOGOUT', 'Admin logged out', ipAddress, userAgent);
      logger.info(`Admin logged out. ID: ${adminId}`);
      return true;
    } catch (error) {
      logger.error(`AuthService.logout error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AuthService();
