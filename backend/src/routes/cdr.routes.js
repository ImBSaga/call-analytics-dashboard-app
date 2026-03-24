const { Router } = require('express');
const { 
  listCDR, 
  getCities, 
  listValidation, 
  createCDR, 
  updateCDR, 
  deleteCDR, 
  cdrCrudValidation 
} = require('../controllers/cdr.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = Router();

// All CDR routes require authentication
router.use(authenticate);

// Public CDR routes (accessible to analysts and admins)
router.get('/', listValidation, listCDR);
router.get('/cities', getCities);

// Admin-only CDR routes
router.post('/', authorize('admin'), cdrCrudValidation, createCDR);
router.put('/:id', authorize('admin'), cdrCrudValidation, updateCDR);
router.delete('/:id', authorize('admin'), deleteCDR);

module.exports = router;
