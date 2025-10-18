import { Request, Response } from 'express';
import { StoryService } from '../services/story.service.js';

export class StoryController {
  static async generateStory(req: Request, res: Response) {
    try {
      // TODO: Implement story generation
      const result = await StoryService.generateStory(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate story' });
    }
  }

  static async getStories(req: Request, res: Response) {
    try {
      // TODO: Implement get stories with filters
      const stories = await StoryService.getStories(req.query);
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stories' });
    }
  }

  static async getStoryById(req: Request, res: Response) {
    try {
      // TODO: Implement get story by ID
      const story = await StoryService.getStoryById(req.params.id);
      res.json(story);
    } catch (error) {
      res.status(404).json({ error: 'Story not found' });
    }
  }

  static async getStorySentences(req: Request, res: Response) {
    try {
      // TODO: Implement get story sentences
      const sentences = await StoryService.getStorySentences(req.params.id);
      res.json(sentences);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sentences' });
    }
  }

  static async deleteStory(req: Request, res: Response) {
    try {
      // TODO: Implement delete story
      await StoryService.deleteStory(req.params.id);
      res.json({ message: 'Story deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete story' });
    }
  }
}

