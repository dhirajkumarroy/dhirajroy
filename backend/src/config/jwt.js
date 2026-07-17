module.exports = {
  accessSecret: process.env.JWT_SECRET || 'portfolio-access-secret-key-12345',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'portfolio-refresh-secret-key-67890',
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRES || '15m',
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRES || '7d',
  cookieMaxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
};
