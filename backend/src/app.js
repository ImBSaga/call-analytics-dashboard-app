const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const connectDB = require('./lib/db');

const authRoutes = require('./routes/auth.routes');
const cdrRoutes = require('./routes/cdr.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const errorHandler = require('./middleware/errorHandler');

const { seedUsers } = require('./services/user.service');
const { seedFromCSV } = require('./services/cdr.service');

const app = express();

// ─── TRUST PROXY (For Vercel/Cloudfront) ─────────────────────────────────────
app.set('trust proxy', 1);

// ─── INIT DATABASE (Serverless-Aware) ─────────────────────────────────────────
(async () => {
  try {
    await connectDB();
    // Pre-seed if database is empty - only runs once
    await seedUsers().catch(e => console.error('Seed Users failed:', e.message));
    await seedFromCSV().catch(e => console.error('Seed CSV failed:', e.message));
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('⚠️  Database initial connection failed:', err.message);
    }
  }
})();

// ─── PARSERS (Top of stack) ──────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// ─── WELCOME / HEALTH CHECK ──────────────────────────────────────────────────
app.get(['/', '/api', '/api/v1', '/health'], (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'PineVox Telecom API is online',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ─── ROUTE ALIASING (Supports both /api and /api/v1) ─────────────────────────
const registerRoutes = (prefix) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/cdr`, cdrRoutes);
  app.use(`${prefix}/analytics`, analyticsRoutes);
};

registerRoutes('/api');
registerRoutes('/api/v1'); // For legacy frontend compatibility

// ─── 404 / ERROR HANDLER ─────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Path not found: ${req.originalUrl}`,
    suggestion: 'Ensure you are using the correct API prefix (/api or /api/v1)'
  });
});

app.use(errorHandler);

module.exports = app;
