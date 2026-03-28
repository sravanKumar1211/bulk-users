import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import healthRoutes from './routes/healthRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Set up 10mb limit properly defending against server crash on very large payloads
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api', healthRoutes);
app.use('/api/users', userRoutes);

// Global Error Handler Middleware setup at the end of the pipeline
app.use(errorHandler);

export default app;
