import { Request, Response } from 'express';
import { CustomVoiceService } from '../services/custom-voice.service.js';
import multer from 'multer';
import path from 'path';

// Configure multer for audio file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/flac', 'audio/webm', 'video/webm'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid audio format. Supported formats: WAV, MP3, M4A, FLAC, WebM'), false);
    }
  },
});

export class CustomVoiceController {
  // Middleware for handling file uploads
  static uploadAudioFiles = upload.array('audioFiles', 5); // Max 5 files

  /**
   * Create a new custom voice
   */
  static async createCustomVoice(req: Request, res: Response) {
        console.log('wowzabowza')
      try {
      const { name, description, category } = req.body;
      const userId = req.user?.id || '550e8400-e29b-41d4-a716-446655440000'; // Fallback for testing
      console.log('wow')
      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
        console.log('bow')
      if (!name || !category) {
        return res.status(400).json({ 
          error: 'Missing required fields: name and category are required' 
        });
      }

      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ 
          error: 'No audio files provided' 
        });
      }

      const audioFiles = (req.files as Express.Multer.File[]).map(file => ({
        filename: file.originalname,
        buffer: file.buffer,
      }));

      const result = await CustomVoiceService.createCustomVoice(userId, {
        name,
        description,
        category,
        audioFiles,
      });

      res.status(201).json(result);

    } catch (error: any) {
      console.error('Create custom voice error:', error);
      res.status(500).json({ 
        error: 'Failed to create custom voice',
        message: error.message 
      });
    }
  }

  /**
   * Get all custom voices for a user
   */
  static async getUserCustomVoices(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const voices = await CustomVoiceService.getUserCustomVoices(userId);
      res.json(voices);

    } catch (error: any) {
      console.error('Get custom voices error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch custom voices',
        message: error.message 
      });
    }
  }

  /**
   * Get a specific custom voice
   */
  static async getCustomVoice(req: Request, res: Response) {
    try {
      const { voiceId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const voice = await CustomVoiceService.getCustomVoice(voiceId, userId);
      res.json(voice);

    } catch (error: any) {
      console.error('Get custom voice error:', error);
      res.status(404).json({ 
        error: 'Custom voice not found',
        message: error.message 
      });
    }
  }

  /**
   * Update custom voice settings
   */
  static async updateCustomVoice(req: Request, res: Response) {
    try {
      const { voiceId } = req.params;
      const userId = req.user?.id;
      const updates = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const updatedVoice = await CustomVoiceService.updateVoiceSettings(
        voiceId, 
        userId, 
        updates
      );

      res.json(updatedVoice);

    } catch (error: any) {
      console.error('Update custom voice error:', error);
      res.status(500).json({ 
        error: 'Failed to update custom voice',
        message: error.message 
      });
    }
  }

  /**
   * Delete a custom voice
   */
  static async deleteCustomVoice(req: Request, res: Response) {
    try {
      const { voiceId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      await CustomVoiceService.deleteCustomVoice(voiceId, userId);
      res.json({ message: 'Custom voice deleted successfully' });

    } catch (error: any) {
      console.error('Delete custom voice error:', error);
      res.status(500).json({ 
        error: 'Failed to delete custom voice',
        message: error.message 
      });
    }
  }

  /**
   * Generate audio using a custom voice
   */
  static async generateAudioWithCustomVoice(req: Request, res: Response) {
    try {
      const { voiceId } = req.params;
      const { text } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      const audioBuffer = await CustomVoiceService.generateAudioWithCustomVoice(
        voiceId,
        userId,
        text
      );

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      });

      res.send(audioBuffer);

    } catch (error: any) {
      console.error('Generate audio with custom voice error:', error);
      res.status(500).json({ 
        error: 'Failed to generate audio',
        message: error.message 
      });
    }
  }

  /**
   * Get voice usage statistics
   */
  static async getVoiceStats(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }

      const stats = await CustomVoiceService.getVoiceUsageStats(userId);
      res.json(stats);

    } catch (error: any) {
      console.error('Get voice stats error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch voice statistics',
        message: error.message 
      });
    }
  }
}
