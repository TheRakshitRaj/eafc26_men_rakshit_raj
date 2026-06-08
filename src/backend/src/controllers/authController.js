import authService from '../services/authService.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return ApiResponse.success(res, result, 'User registered successfully', 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  return ApiResponse.success(res, result, 'User logged in successfully', 200);
});

export const getProfile = asyncHandler(async (req, res) => {
  // req.user is set by authMiddleware
  return ApiResponse.success(res, req.user, 'User profile fetched successfully', 200);
});

export const logout = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, {}, 'Logged out successfully. Clear your token on the client-side.', 200);
});
