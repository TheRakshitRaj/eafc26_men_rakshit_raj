import app from './app.js';
import connectDB from './src/config/db.js';
import dotenv from 'dotenv';

// Trap uncaught synchronous errors
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down process immediately...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Initialize environment variable config loader
dotenv.config();

// Initialize MongoDB Connection
connectDB();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`EA Sports FC 26 Backend running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Trap asynchronous promise rejections and shutdown gracefully
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED PROMISE REJECTION! Terminating server gracefully...');
  console.error(err.name, err.message);
  console.error(err.stack);
  server.close(() => {
    process.exit(1);
  });
});