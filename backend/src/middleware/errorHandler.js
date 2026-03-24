/**
 * Global Express error handler.
 * Must be registered AFTER all routes (4 arguments).
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);

  // Validation errors from express-validator are handled in controllers.
  // This catches unexpected/runtime errors.
  const status = err.status || err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Internal server error'
      : err.message || 'Internal server error';

  res.status(status).json({ success: false, message });
}

module.exports = errorHandler;
