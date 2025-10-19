import { Request, Response } from 'express';
import { StoryService } from '../services/story.service.js';
import { AVAILABLE_VOICES, getRecommendedVoices } from '../config/voices.js';

export class StoryController {
  static async getAvailableVoices(req: Request, res: Response) {
    try {
      const { level } = req.query;
      
      if (level) {
        const recommendedVoices = getRecommendedVoices(level as string);
        res.json(recommendedVoices);
      } else {
        res.json(AVAILABLE_VOICES);
      }
    } catch (error: any) {
      console.error('Get voices controller error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch voices',
        message: error.message 
      });
    }
  }

  static async generateStory(req: Request, res: Response) {
    try {
      const { language, level, theme, sentenceCount, ageRange, customPrompt, voiceId } = req.body;
      
      // Validate required fields
      if (!language || !level) {
        return res.status(400).json({ 
          error: 'Missing required fields: language and level are required' 
        });
      }
      
      const result = await StoryService.generateStory({
        language,
        level,
        theme,
        sentenceCount,
        ageRange,
        customPrompt,
        voiceId,
      });
      
      res.json(result);
    } catch (error: any) {
      console.error('Generate story controller error:', error);
      res.status(500).json({ 
        error: 'Failed to generate story',
        message: error.message 
      });
    }
  }

  static async getStories(req: Request, res: Response) {
    try {
      const { language, level, theme, limit, offset } = req.query;
      
      const stories = await StoryService.getStories({
        language: language as string,
        level: level as string,
        theme: theme as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      
      res.json(stories);
    } catch (error: any) {
      console.error('Get stories controller error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch stories',
        message: error.message 
      });
    }
  }

  static async getStoryById(req: Request, res: Response) {
    try {
      const story = await StoryService.getStoryById(req.params.id);
      res.json(story);
    } catch (error: any) {
      console.error('Get story by ID controller error:', error);
      res.status(404).json({ 
        error: 'Story not found',
        message: error.message 
      });
    }
  }

  static async getStorySentences(req: Request, res: Response) {
    try {
      const sentences = await StoryService.getStorySentences(req.params.id);
      res.json(sentences);
    } catch (error: any) {
      console.error('Get story sentences controller error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch sentences',
        message: error.message 
      });
    }
  }

  static async deleteStory(req: Request, res: Response) {
    try {
      await StoryService.deleteStory(req.params.id);
      res.json({ message: 'Story deleted successfully' });
    } catch (error: any) {
      console.error('Delete story controller error:', error);
      res.status(500).json({ 
        error: 'Failed to delete story',
        message: error.message 
      });
    }
  }
}

