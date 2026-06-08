import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Admin-only stats route
router.get('/dashboard', authMiddleware, adminMiddleware, getDashboardStats);

export default router;
