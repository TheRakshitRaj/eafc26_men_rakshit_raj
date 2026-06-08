import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import User from '../models/User.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from './asyncHandler.js';

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return ApiResponse.error(res, { errorCode: 'NOT_AUTHORIZED' }, 'Not authorized to access this resource, authorization header token missing', 401);
  }

  // Verify token (errors caught by global error middleware)
  const decoded = jwt.verify(token, jwtConfig.secret);

  // Find user in DB (excluding password hash)
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    return ApiResponse.error(res, { errorCode: 'USER_NOT_FOUND' }, 'The user belonging to this authorization token no longer exists', 401);
  }

  // Assign user profile to request object
  req.user = user;
  next();
});

export default authMiddleware;
