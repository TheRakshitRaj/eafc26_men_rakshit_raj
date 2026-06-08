import compareService from '../services/compareService.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';

export const comparePlayers = asyncHandler(async (req, res) => {
  const { player1, player2 } = req.params;
  const result = await compareService.comparePlayers(player1, player2);
  return ApiResponse.success(res, result, 'Player comparison report generated successfully', 200);
});
