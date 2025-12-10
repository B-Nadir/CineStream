// backend/src/index.js
const path = require('path');

// Load env from backend/.env
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { initMySQL } = require('./db/mysql');
const { initRedis } = require('./db/redis');

const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const debugRoutes = require('./routes/debug');

const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

/**
 * Middleware (order matters)
 * - CORS and JSON body parser must be registered BEFORE route handlers
 */
app.use(cors({ origin: 'http://localhost:3000' })); // adjust origin for production
app.use(express.json()); // parse application/json
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/**
 * Routes: mount after middlewares so req.body and CORS work
 */
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/health', healthRoutes);

/**
 * Error handler (must come after routes)
 */
app.use(errorHandler);

/**
 * Start function: initialize DBs then start server
 */
async function start() {
  try {
    await initMySQL();
    await initRedis(); // will connect to Redis (Docker or configured host)
    app.listen(PORT, () => {
      console.log(`✔ Backend running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

/**
 * Safety: log unhandled errors to help debugging in dev
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // In production you may want to exit and restart process manager
});

start();

module.exports = app; // exported so tests or future tools can import the app if needed
