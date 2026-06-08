import express from 'express';
import {
  getTopRated,
  getTopTeams,
  getTopLeagues,
  getTopNations,
  getPositionDistribution,
  getSkillDistribution
} from '../controllers/analyticsController.js';

const router = express.Router();

// Supported both with and without the "/players" prefix
router.get('/top-rated', getTopRated);
router.get('/players/top-rated', getTopRated);

router.get('/top-teams', getTopTeams);
router.get('/players/top-teams', getTopTeams);

router.get('/top-leagues', getTopLeagues);
router.get('/players/top-leagues', getTopLeagues);

router.get('/top-nations', getTopNations);
router.get('/players/top-nations', getTopNations);

router.get('/position-distribution', getPositionDistribution);
router.get('/players/position-distribution', getPositionDistribution);

router.get('/skill-distribution', getSkillDistribution);
router.get('/players/skill-distribution', getSkillDistribution);

export default router;
