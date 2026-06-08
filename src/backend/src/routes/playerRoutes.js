import express from 'express';
import {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getPlayersByTeam,
  getPlayersByLeague,
  getPlayersByNation,
  getPlayersByPosition,
  getTopRated,
  getTopPaced,
  getTopDribblers,
  getTopPassers,
  getTopDefenders,
  getTopYoungsters,
  getRecentPlayers,
  getRandomPlayer,
  getTrendingPlayers,
  getRecommendations,
  getDreamTeam,
  getTeamBuilder,
  calculateChemistry,
  getLiveSearch
} from '../controllers/playerController.js';
import { comparePlayers } from '../controllers/compareController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import validationMiddleware from '../middlewares/validationMiddleware.js';
import { createPlayerValidator, updatePlayerValidator } from '../validators/playerValidator.js';

const router = express.Router();

// --- Advanced Engine Calculations (Static Routes) ---
router.get('/random', getRandomPlayer);
router.get('/trending', getTrendingPlayers);
router.get('/recommendations', getRecommendations);
router.get('/dream-team', getDreamTeam);
router.get('/team-builder', getTeamBuilder);
router.get('/chemistry', calculateChemistry);
router.get('/live-search', getLiveSearch);

// --- Stat Rankings (Static Routes) ---
router.get('/top-rated', getTopRated);
router.get('/top-paced', getTopPaced);
router.get('/top-dribblers', getTopDribblers);
router.get('/top-passers', getTopPassers);
router.get('/top-defenders', getTopDefenders);
router.get('/top-youngsters', getTopYoungsters);
router.get('/recent', getRecentPlayers);

// --- Filtering & Attribute Lookups ---
router.get('/team/:team', getPlayersByTeam);
router.get('/league/:league', getPlayersByLeague);
router.get('/nation/:nation', getPlayersByNation);
router.get('/position/:position', getPlayersByPosition);

// --- Head-to-Head Comparison ---
router.get('/compare/:player1/:player2', comparePlayers);

// --- Standard CRUD Operations ---
router.get('/', getPlayers);
router.get('/:id', getPlayerById);

// Admin-only modification routes
router.post('/', authMiddleware, adminMiddleware, validationMiddleware(createPlayerValidator), createPlayer);
router.put('/:id', authMiddleware, adminMiddleware, validationMiddleware(updatePlayerValidator), updatePlayer);
router.patch('/:id', authMiddleware, adminMiddleware, validationMiddleware(updatePlayerValidator), updatePlayer);
router.delete('/:id', authMiddleware, adminMiddleware, deletePlayer);

export default router;
