import { Router } from 'express';
import {
  getChatToken,
  startAIAgent,
  getAgentStatus,
  chatHealthCheck,
} from '../controllers/chat.controller.js';

const router = Router();

/**
 * POST /api/v1/chat/token
 * Generate a Stream Chat token for a user
 */
router.post('/token', getChatToken);

/**
 * POST /api/v1/chat/start-agent
 * Start AI agent in a channel
 */
router.post('/start-agent', startAIAgent);

/**
 * GET /api/v1/chat/status
 * Check if AI agent is connected to a channel
 */
router.get('/status', getAgentStatus);

/**
 * GET /api/v1/chat/health
 * Health check for chat service
 */
router.get('/health', chatHealthCheck);

export default router;
