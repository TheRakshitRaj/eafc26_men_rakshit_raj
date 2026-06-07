import ApiResponse from '../utils/ApiResponse.js';

const validationMiddleware = (validatorFn) => {
  return (req, res, next) => {
    const { error, value } = validatorFn(req.body);
    if (error) {
      return ApiResponse.error(
        res,
        { errorCode: 'VALIDATION_ERROR', details: error },
        'Request validation failed',
        400
      );
    }
    // Set sanitized and typed request body
    if (value) {
      req.body = value;
    }
    next();
  };
};

export default validationMiddleware;
