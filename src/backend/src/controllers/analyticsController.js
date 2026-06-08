import analyticsService from '../services/analyticsService.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';

export const getTopRated = asyncHandler(async (req, res) => {
  const result = await analyticsService.getTopRated();
  return ApiResponse.success(res, result, 'Top rated players fetched successfully', 200);
});

export const getTopTeams = asyncHandler(async (req, res) => {
  const result = await analyticsService.getTopTeams();
  return ApiResponse.success(res, result, 'Top teams analytics stats fetched successfully', 200);
});

export const getTopLeagues = asyncHandler(async (req, res) => {
  const result = await analyticsService.getTopLeagues();
  return ApiResponse.success(res, result, 'Top leagues analytics stats fetched successfully', 200);
});

export const getTopNations = asyncHandler(async (req, res) => {
  const result = await analyticsService.getTopNations();
  return ApiResponse.success(res, result, 'Top nations analytics stats fetched successfully', 200);
});

export const getPositionDistribution = asyncHandler(async (req, res) => {
  const result = await analyticsService.getPositionDistribution();
  return ApiResponse.success(res, result, 'Position distribution analytical stats fetched successfully', 200);
});

export const getSkillDistribution = asyncHandler(async (req, res) => {
  const result = await analyticsService.getSkillDistribution();
  return ApiResponse.success(res, result, 'Skill moves and weak foot distribution analytics fetched successfully', 200);
});
