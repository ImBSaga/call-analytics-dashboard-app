const { query, validationResult } = require('express-validator');
const { getCDRAnalytics } = require('../services/cdr.service');

// ─── Validation ──────────────────────────────────────────────────────────────
const analyticsValidation = [
  query('startDate').optional().isISO8601().withMessage('startDate must be ISO 8601 date'),
  query('endDate').optional().isISO8601().withMessage('endDate must be ISO 8601 date'),
  query('city').optional().isString().trim(),
  query('direction')
    .optional()
    .isIn(['inbound', 'outbound'])
    .withMessage("direction must be 'inbound' or 'outbound'"),
  query('status')
    .optional()
    .isIn(['success', 'failed'])
    .withMessage("status must be 'success' or 'failed'"),
];

// ─── Controller ──────────────────────────────────────────────────────────────

/**
 * GET /api/analytics
 * Returns computed analytics for the (optionally filtered) CDR dataset.
 */
async function getAnalytics(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { startDate, endDate, city, direction, status } = req.query;
    const analytics = await getCDRAnalytics({ startDate, endDate, city, direction, status });

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAnalytics, analyticsValidation };
