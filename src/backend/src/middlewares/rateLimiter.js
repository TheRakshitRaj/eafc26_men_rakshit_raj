import rateLimit from 'express-rate-limit';
import ApiResponse from '../utils/ApiResponse.js';

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      { errorCode: 'TOO_MANY_REQUESTS' },
      'Too many requests from this IP, please try again after 15 minutes',
      429
    );
  },
});

export default rateLimiter;
