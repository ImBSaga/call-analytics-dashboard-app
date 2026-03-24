const { Router } = require('express');
const { getAnalytics, analyticsValidation } = require('../controllers/analytics.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = Router();

// All analytics routes require authentication
router.use(authenticate);

// GET /api/analytics
router.get('/', analyticsValidation, getAnalytics);

module.exports = router;
