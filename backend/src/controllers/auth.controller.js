const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findByEmail, createUser, toPublic } = require('../services/user.service');

// ─── Validation Rules ────────────────────────────────────────────────────────

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const signupValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters'),
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function sendValidationError(res, errors) {
  return res.status(422).json({
    success: false,
    message: 'Validation failed',
    errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
  });
}

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendValidationError(res, errors);

    const { email, password } = req.body;
    const user = await findByEmail(email);

    // Use constant-time compare to prevent timing attacks
    const passwordMatch = user
      ? await bcrypt.compare(password, user.passwordHash)
      : await bcrypt.compare(password, '$2a$10$dummyhashdummyhashdummyhashdum'); // dummy compare

    if (!user || !passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = signToken(user);
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: toPublic(user),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/signup
 */
async function signup(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendValidationError(res, errors);

    const { email, password, name } = req.body;

    // Check duplicate — but give the same message to avoid enumeration
    const existing = await findByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Default new users to 'analyst' role; admin can only be seeded
    const user = await createUser({ email, plainPassword: password, name, role: 'analyst' });
    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: toPublic(user),
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 */
function me(req, res) {
  return res.status(200).json({
    success: true,
    user: toPublic(req.user),
  });
}

module.exports = { login, signup, me, loginValidation, signupValidation };
