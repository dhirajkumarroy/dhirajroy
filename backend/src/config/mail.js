const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const mailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
};

let transporter;

function getTransporter() {
  if (!transporter) {
    logger.info('Initializing Nodemailer transporter...');
    transporter = nodemailer.createTransport(mailConfig);
  }
  return transporter;
}

async function verifyTransporter() {
  const currentTransporter = getTransporter();
  
  // Skip verify if SMTP user is not set (e.g. development mode without SMTP configured)
  if (!mailConfig.auth.user) {
    logger.warn('⚠️ SMTP user is not configured in .env. Email notifications will be skipped or fail.');
    return false;
  }

  try {
    await currentTransporter.verify();
    logger.info('✔ SMTP server connection verified successfully.');
    return true;
  } catch (error) {
    logger.error(`❌ SMTP connection verification failed: ${error.message}`);
    return false;
  }
}

module.exports = {
  getTransporter,
  verifyTransporter
};
