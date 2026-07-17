require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const logger = require('./src/utils/logger');
const { testConnection, getPool } = require('./src/config/database');
const { verifyTransporter } = require('./src/config/mail');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

async function startServer() {
  logger.info('Starting portfolio backend server...');

  // 1. Verify Database Connection
  const isDbConnected = await testConnection();
  if (!isDbConnected) {
    logger.error('❌ Server startup aborted: Database connection failure.');
    process.exit(1);
  }

  // 2. Verify Email Configuration
  await verifyTransporter();

  // 3. Start listening
  server.listen(PORT, () => {
    logger.info(`✔ Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

// Graceful Shutdown
function handleGracefulShutdown(signal) {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  // Stop receiving requests
  server.close(async () => {
    logger.info('HTTP server closed.');

    // Close MySQL connection pool
    try {
      const pool = getPool();
      await pool.end();
      logger.info('MySQL connection pool closed.');
      process.exit(0);
    } catch (err) {
      logger.error(`Error closing MySQL pool: ${err.message}`);
      process.exit(1);
    }
  });

  // Force shutdown after 10s if connections remain active
  setTimeout(() => {
    logger.warn('Forcing server shutdown after 10 seconds...');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}\nReason: ${reason.stack || reason}`);
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}\nStack: ${error.stack}`);
  // Give logger time to output before crashing
  setTimeout(() => process.exit(1), 1000);
});

startServer();
