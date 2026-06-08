import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import { getProfile } from '../controllers/authController.js';
import Player from '../models/Player.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middlewares/asyncHandler.js';

const router = express.Router();

// GET /jwt/profile - Returns active user session profile
router.get('/profile', authMiddleware, getProfile);

// GET /jwt/dashboard - Returns analytical overview protected by session validation
router.get('/dashboard', authMiddleware, asyncHandler(async (req, res) => {
  const totalPlayers = await Player.countDocuments({ isDeleted: { $ne: true } });
  const distinctTeams = await Player.distinct('team', { isDeleted: { $ne: true } });
  const distinctLeagues = await Player.distinct('league', { isDeleted: { $ne: true } });

  const dashboardData = {
    user: {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role
    },
    systemMetrics: {
      totalPlayers,
      totalTeams: distinctTeams.length,
      totalLeagues: distinctLeagues.length
    },
    status: 'Operational'
  };

  return ApiResponse.success(res, dashboardData, 'Secure dashboard data retrieved successfully', 200);
}));

// GET /jwt/admin - Strict RBAC Admin authorization checkpoint
router.get('/admin', authMiddleware, adminMiddleware, asyncHandler(async (req, res) => {
  const adminCheckpoint = {
    message: 'Welcome to the Admin Dashboard Checkpoint',
    authorized: true,
    adminUser: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    },
    timestamp: new Date()
  };

  return ApiResponse.success(res, adminCheckpoint, 'Admin verification passed successfully', 200);
}));

export default router;
