import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import contentrouter from './routes/content.routes.js';
import aiRouter from './routes/ai.routes.js';
import streamChatRouter from '../streamchat/index.js';
import { Content } from './models/content.model.js';
import { Genre } from './models/genre.model.js';

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// Routes
app.use('/api/v1/content', contentrouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/chat', streamChatRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'ContentCrafter API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Debug endpoint to check database status
app.get('/api/v1/debug/db-status', async (req, res) => {
  try {
    const genres = await Genre.find();
    const content = await Content.find().populate('genre');
    res.json({
      success: true,
      genres_count: genres.length,
      content_count: content.length,
      content_summary: content.reduce((acc, c) => {
        const name = c.genre?.name || 'Unknown';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {})
    });
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API info endpoint
app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: 'ContentCrafter API v1',
    endpoints: {
      health: '/health',
      content: '/api/v1/content',
      ai: '/api/v1/ai',
      chat: '/api/v1/chat',
    },
  });
});

export { app };