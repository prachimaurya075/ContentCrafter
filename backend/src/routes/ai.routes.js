import { Router } from 'express';
import multer from 'multer';
import { generateChatContent, generateContentWithContext, summarizeFile } from '../controllers/ai.controller.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
});

// Basic content generation
router.post('/generate/chat', generateChatContent);

// Content generation with conversation context
router.post('/generate/context', generateContentWithContext);

// File summarization
router.post('/summarize/file', upload.single('file'), summarizeFile);

// Health check for AI service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: "AI service is running",
    timestamp: new Date().toISOString()
  });
});

export default router;