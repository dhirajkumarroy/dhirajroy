const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');

const corsOptions = require('./config/cors');
const cors = require('cors');
const { globalLimiter } = require('./config/rateLimit');
const requestIdMiddleware = require('./middleware/requestId.middleware');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

const contactRoutes = require('./routes/contact.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// 1. Trust proxy for rate limiters behind Nginx
app.set('trust proxy', 1);

// 2. Request Correlation Tracing
app.use(requestIdMiddleware);

// 3. Security Headers
app.use(helmet({
  contentSecurityPolicy: false // Disable CSP for easier integration with third party CDNs/fonts
}));

// 4. CORS Setup
app.use(cors(corsOptions));

// 5. Compression
app.use(compression());

// 6. Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 7. Request Logging (Morgan custom token for Request ID)
morgan.token('req-id', (req) => req.id || '-');
const logFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" [ReqID: :req-id]';
app.use(morgan(logFormat));

// 8. Global Rate Limiter
app.use(globalLimiter);

// 9. API Routes
app.use('/api/v1', contactRoutes);
app.use('/api/v1/admin', authRoutes);
app.use('/api/v1/admin', adminRoutes);

// Optional: Serve Admin Frontend files statically (useful for dev and fallback)
app.use('/admin', express.static(path.join(__dirname, '../../admin')));

// 10. Fallback and Central Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
