import { Router } from 'express';
import { CustomVoiceController } from '../controllers/custom-voice.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const router = Router();

// Apply authentication middleware to all custom voice routes
router.use(authMiddleware);

// POST /api/custom-voices - Create a new custom voice
router.post('/', 
  CustomVoiceController.uploadAudioFiles,
  CustomVoiceController.createCustomVoice
);

// GET /api/custom-voices - Get all custom voices for user
router.get('/', CustomVoiceController.getUserCustomVoices);

// GET /api/custom-voices/stats - Get voice usage statistics
router.get('/stats', CustomVoiceController.getVoiceStats);

// GET /api/custom-voices/:voiceId - Get a specific custom voice
router.get('/:voiceId', CustomVoiceController.getCustomVoice);

// PUT /api/custom-voices/:voiceId - Update custom voice settings
router.put('/:voiceId', CustomVoiceController.updateCustomVoice);

// DELETE /api/custom-voices/:voiceId - Delete a custom voice
router.delete('/:voiceId', CustomVoiceController.deleteCustomVoice);

// POST /api/custom-voices/:voiceId/generate - Generate audio with custom voice
router.post('/:voiceId/generate', CustomVoiceController.generateAudioWithCustomVoice);
