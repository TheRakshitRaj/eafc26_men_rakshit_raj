import adminService from '../services/adminService.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const result = await adminService.getDashboardStats();
  return ApiResponse.success(res, result, 'Administrative dashboard statistics fetched successfully', 200);
});
