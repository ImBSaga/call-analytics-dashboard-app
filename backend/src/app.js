const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./lib/db');

const authRoutes = require('./routes/auth.routes');
const cdrRoutes = require('./routes/cdr.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const errorHandler = require('./middleware/errorHandler');

const { seedUsers } = require('./services/user.service');
const { seedFromCSV } = require('./services/cdr.service');

const app = express();

// ─── INIT DATABASE (Serverless-Aware) ─────────────────────────────────────────
(async () => {
  try {
    await connectDB();
    // Pre-seed if database is empty - only runs once
    await seedUsers().catch(e => console.error('Seed Users failed:', e.message));
    await seedFromCSV().catch(e => console.error('Seed CSV failed:', e.message));
  } catch (err) {
    console.error('⚠️  Database initial connection failed. Some features may not work.');
  }
})();

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: '*', // For demo — should be restricted in production
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── GLOBAL RATE LIMITING ────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ─── PARSERS ─────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'CDR API is running',
    timestamp: new Date().toISOString(),
    database: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/cdr', cdrRoutes);
app.use('/api/analytics', analyticsRoutes);

// ─── 404 / ERROR HANDLER ─────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use(errorHandler);

module.exports = app;
