const authService = require('../services/auth.service');
const response = require('../utils/response');
const jwtConfig = require('../config/jwt');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'] || 'Unknown';

      const result = await authService.login(email, password, ipAddress, userAgent);
      
      if (!result) {
        return response.error(res, 'Invalid email or password.', 401);
      }

      // Set Refresh Token in HttpOnly cookie
      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: jwtConfig.cookieMaxAge,
        path: '/' // Make available for refresh path
      });

      return response.success(res, 'Login successful.', {
        admin: result.admin,
        accessToken: result.accessToken
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const adminId = req.admin.id;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'] || 'Unknown';

      await authService.logout(adminId, ipAddress, userAgent);

      // Clear cookies
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      });
      res.clearCookie('access_token'); // Just in case it was set

      return response.success(res, 'Logout successful.');
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
        return response.error(res, 'Refresh token missing. Please log in again.', 401);
      }

      const result = await authService.refresh(refreshToken);
      if (!result) {
        return response.error(res, 'Session expired. Please log in again.', 401);
      }

      // Rotate Refresh Token in cookie
      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: jwtConfig.cookieMaxAge,
        path: '/'
      });

      return response.success(res, 'Token refreshed successfully.', {
        accessToken: result.accessToken,
        admin: {
          id: result.admin.id,
          name: result.admin.name,
          email: result.admin.email,
          role: result.admin.role
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      return response.success(res, 'Profile retrieved successfully.', {
        admin: req.admin
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
