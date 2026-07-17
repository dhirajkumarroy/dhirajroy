const { AsyncLocalStorage } = require('async_hooks');

// Setup AsyncLocalStorage for request ID tracing
const asyncLocalStorage = new AsyncLocalStorage();

const formatLog = (level, message) => {
  const timestamp = new Date().toISOString();
  const store = asyncLocalStorage.getStore();
  const requestId = store && store.requestId ? ` [ReqID: ${store.requestId}]` : '';
  return `[${timestamp}] [${level}]${requestId}: ${message}`;
};

const logger = {
  info: (msg) => console.log(formatLog('INFO', msg)),
  warn: (msg) => console.warn(formatLog('WARN', msg)),
  error: (msg) => console.error(formatLog('ERROR', msg)),
  debug: (msg) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(formatLog('DEBUG', msg));
    }
  },
  asyncLocalStorage
};

module.exports = logger;
