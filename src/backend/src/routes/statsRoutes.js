import express from 'express';
import {
  getPlayerCount,
  getAverageRating,
  getHighestRated,
  getTeamCount,
  getLeagueCount
} from '../controllers/statsController.js';

const router = express.Router();

router.get('/players/count', getPlayerCount);
router.get('/players/average-rating', getAverageRating);
router.get('/players/highest-rated', getHighestRated);
router.get('/players/team-count', getTeamCount);
router.get('/players/league-count', getLeagueCount);

export default router;
