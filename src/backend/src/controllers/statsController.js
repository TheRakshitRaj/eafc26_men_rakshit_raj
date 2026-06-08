import Player from '../models/Player.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';

export const getPlayerCount = asyncHandler(async (req, res) => {
  const count = await Player.countDocuments({ isDeleted: { $ne: true } });
  return ApiResponse.success(res, { count }, 'Total active players count retrieved successfully', 200);
});

export const getAverageRating = asyncHandler(async (req, res) => {
  const result = await Player.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: null,
        averageOverall: { $avg: '$overall' }
      }
    }
  ]);
  
  const avg = result.length > 0 ? Math.round(result[0].averageOverall * 10) / 10 : 0;
  return ApiResponse.success(res, { averageRating: avg }, 'Average player overall rating calculated successfully', 200);
});

export const getHighestRated = asyncHandler(async (req, res) => {
  const player = await Player.findOne({ isDeleted: { $ne: true } })
    .sort('-overall')
    .lean();
    
  return ApiResponse.success(res, player, 'Highest rated active player profile retrieved successfully', 200);
});

export const getTeamCount = asyncHandler(async (req, res) => {
  const teams = await Player.distinct('team', { isDeleted: { $ne: true } });
  return ApiResponse.success(res, { teamCount: teams.length }, 'Distinct team count retrieved successfully', 200);
});

export const getLeagueCount = asyncHandler(async (req, res) => {
  const leagues = await Player.distinct('league', { isDeleted: { $ne: true } });
  return ApiResponse.success(res, { leagueCount: leagues.length }, 'Distinct league count retrieved successfully', 200);
});
