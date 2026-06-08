import ApiResponse from '../utils/ApiResponse.js';

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return ApiResponse.error(
      res,
      { errorCode: 'FORBIDDEN' },
      'Forbidden: Administrative role required to access this resource',
      403
    );
  }
};

export default adminMiddleware;
