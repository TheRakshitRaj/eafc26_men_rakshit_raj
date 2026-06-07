import ApiResponse from '../utils/ApiResponse.js';

const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for development environment
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Trace:', err);
  }

  // Mongoose bad ObjectId format (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    return ApiResponse.error(res, { errorCode: 'CAST_ERROR', field: err.path }, message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    const fields = Object.keys(err.keyValue || {});
    return ApiResponse.error(res, { errorCode: 'DUPLICATE_KEY_ERROR', fields }, message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    const errors = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
    return ApiResponse.error(res, { errorCode: 'VALIDATION_ERROR', details: errors }, message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, { errorCode: 'JWT_INVALID' }, 'Invalid authorization token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, { errorCode: 'JWT_EXPIRED' }, 'Authorization token has expired', 401);
  }

  // Fallback to internal server error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';

  return ApiResponse.error(
    res,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : {},
    message,
    statusCode
  );
};

export default errorMiddleware;
