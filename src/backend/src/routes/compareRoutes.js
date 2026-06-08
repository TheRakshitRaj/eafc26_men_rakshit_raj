import express from 'express';
import { comparePlayers } from '../controllers/compareController.js';

const router = express.Router();

router.get('/:player1/:player2', comparePlayers);

export default router;
