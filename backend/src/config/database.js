const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'portfolio_db',
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
  queueLimit: 0
};

let pool;

function getPool() {
  if (!pool) {
    logger.info('Initializing MySQL connection pool...');
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Test database connection with retry logic
async function testConnection(retries = 5, delay = 5000) {
  const currentPool = getPool();
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await currentPool.getConnection();
      logger.info('✔ MySQL Database connected successfully.');
      connection.release();
      return true;
    } catch (err) {
      logger.error(`Database connection attempt ${i + 1} failed: ${err.message}`);
      if (i < retries - 1) {
        logger.info(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  logger.error('❌ Could not connect to the database after multiple attempts.');
  return false;
}

module.exports = {
  getPool,
  testConnection
};
