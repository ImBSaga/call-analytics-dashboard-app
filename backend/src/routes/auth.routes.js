const { Router } = require('express');
const { login, signup, me, loginValidation, signupValidation } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = Router();

// POST /api/auth/login
router.post('/login', loginValidation, login);

// POST /api/auth/signup
router.post('/signup', signupValidation, signup);

// GET /api/auth/me  — protected
router.get('/me', authenticate, me);

module.exports = router;
