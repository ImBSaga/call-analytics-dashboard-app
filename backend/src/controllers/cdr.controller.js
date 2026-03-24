const { validationResult, query, body } = require('express-validator');
const CDRService = require('../services/cdr.service');

// ─── Validation ──────────────────────────────────────────────────────────────
const listValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('startDate').optional().trim(),
  query('endDate').optional().trim(),
  query('caller').optional().isString().trim(),
  query('receiver').optional().isString().trim(),
  query('city').optional().isString().trim(),
  query('direction').optional().isIn(['inbound', 'outbound']),
  query('status').optional().isIn(['success', 'failed']),
];

const cdrCrudValidation = [
  body('callerName').notEmpty().trim(),
  body('callerNumber').notEmpty().trim(),
  body('receiverNumber').notEmpty().trim(),
  body('city').notEmpty().trim(),
  body('callDirection').isBoolean(),
  body('callStatus').isBoolean(),
  body('callDuration').isNumeric(),
  body('callCost').notEmpty().trim(),
  body('callStartTime').notEmpty().trim(),
  body('callEndTime').notEmpty().trim(),
];

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * GET /api/cdr
 */
async function listCDR(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

    const { page = 1, limit = 20, ...filters } = req.query;
    const result = await CDRService.getCDRRecords({ page, limit, ...filters });

    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/cdr/cities
 */
async function getCities(req, res, next) {
  try {
    const cities = await CDRService.getAvailableCities();
    return res.status(200).json({ success: true, data: cities });
  } catch (err) {
    next(err);
  }
}

// ─── ADMIN CRUD ─────────────────────────────────────────────────────────────

/**
 * POST /api/cdr
 */
async function createCDR(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });

    const cdr = await CDRService.createCDR(req.body);
    return res.status(201).json({ success: true, message: 'CDR created', data: cdr });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/cdr/:id
 */
async function updateCDR(req, res, next) {
  try {
    const cdr = await CDRService.updateCDR(req.params.id, req.body);
    if (!cdr) return res.status(404).json({ success: false, message: 'Not found' });
    return res.status(200).json({ success: true, message: 'CDR updated', data: cdr });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/cdr/:id
 */
async function deleteCDR(req, res, next) {
  try {
    const cdr = await CDRService.deleteCDR(req.params.id);
    if (!cdr) return res.status(404).json({ success: false, message: 'Not found' });
    return res.status(200).json({ success: true, message: 'CDR deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { 
  listCDR, 
  getCities, 
  listValidation, 
  createCDR, 
  updateCDR, 
  deleteCDR, 
  cdrCrudValidation 
};
