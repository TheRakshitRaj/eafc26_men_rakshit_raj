import express from 'express';
import { register, login, getProfile, logout } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validationMiddleware from '../middlewares/validationMiddleware.js';
import { registerValidator, loginValidator } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', validationMiddleware(registerValidator), register);
router.post('/login', validationMiddleware(loginValidator), login);
router.get('/profile', authMiddleware, getProfile);
router.post('/logout', authMiddleware, logout);

export default router;
