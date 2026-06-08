import express from 'express';
import cors from 'cors';

// Import Middlewares
import loggerMiddleware from './src/middlewares/loggerMiddleware.js';
import rateLimiter from './src/middlewares/rateLimiter.js';
import errorMiddleware from './src/middlewares/errorMiddleware.js';

// Import Routers
import authRoutes from './src/routes/authRoutes.js';
import playerRoutes from './src/routes/playerRoutes.js';
import analyticsRoutes from './src/routes/analyticsRoutes.js';
import compareRoutes from './src/routes/compareRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import healthRoutes from './src/routes/healthRoutes.js';
import searchRoutes from './src/routes/searchRoutes.js';
import statsRoutes from './src/routes/statsRoutes.js';
import jwtRoutes from './src/routes/jwtRoutes.js';

const app = express();

// Standard express body parsers & limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Setup CORS with wide support
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply custom logging middleware
app.use(loggerMiddleware);

// Apply rate limiting middleware to protect endpoints
app.use('/api', rateLimiter);

// Bind API Routes under BOTH v1 namespace and root namespace for ultimate compatibility
const registerRoutes = (prefix) => {
  app.use(`${prefix}/health`, healthRoutes);
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/players`, playerRoutes);
  app.use(`${prefix}/analytics`, analyticsRoutes);
  app.use(`${prefix}/compare`, compareRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
  app.use(`${prefix}/search`, searchRoutes);
  app.use(`${prefix}/stats`, statsRoutes);
  app.use(`${prefix}/jwt`, jwtRoutes);
};

// Register namespaces
registerRoutes('/api/v1');
registerRoutes(''); // Also register directly at root `/` e.g. `/players`, `/auth/login`

// Fallback matching for invalid/undefined routes (404)
app.use((req, res, next) => {
  const error = new Error(`Cannot find endpoint ${req.originalUrl} on this server`);
  error.statusCode = 404;
  next(error);
});

// Connect global error handling middleware (must be last in pipeline)
app.use(errorMiddleware);

export default app;