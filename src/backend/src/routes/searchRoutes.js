import express from 'express';
import playerService from '../services/playerService.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';

const router = express.Router();

// GET /search/players?q=
router.get('/players', asyncHandler(async (req, res) => {
  const result = await playerService.getPlayers(req.query);
  return ApiResponse.success(res, result.players, 'Search query executed successfully', 200, result.pagination);
}));

export default router;
