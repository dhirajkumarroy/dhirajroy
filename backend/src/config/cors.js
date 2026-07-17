const cors = require('cors');

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
  'https://www.dhirajroy.com',
  'https://admin.dhirajroy.com',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5500' // Live Server default
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
