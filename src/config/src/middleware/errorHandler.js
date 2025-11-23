// ============================================
// ERROR HANDLER MIDDLEWARE
// ============================================

/**
 * Express error handling middleware
 * Catches errors from all routes and responds with appropriate status codes
 */
const errorHandler = (err, req, res, next) => {
  // Log error
  console.error(`[ERROR] ${new Date().toISOString()}:`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    method: req.method,
    path: req.path,
  });

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  }

  if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  }

  if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Not Found';
  }

  // OAuth specific errors
  if (err.message && err.message.includes('OAuth')) {
    statusCode = 401;
    message = 'Authentication Failed';
  }

  // Send error response
  res.status(statusCode).json({
    error: {
      status: statusCode,
      message,
      ...(process.env.NODE_ENV === 'development' && { details: err.message }),
    },
  });
};

export default errorHandler;
