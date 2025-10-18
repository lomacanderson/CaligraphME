import { Router } from 'express';
import { StoryController } from '../controllers/story.controller.js';

export const router = Router();

// POST /api/stories/generate - Generate a new story
router.post('/generate', StoryController.generateStory);

// GET /api/stories - Get all stories (with filters)
router.get('/', StoryController.getStories);

// GET /api/stories/:id - Get a specific story
router.get('/:id', StoryController.getStoryById);

// GET /api/stories/:id/sentences - Get all sentences for a story
router.get('/:id/sentences', StoryController.getStorySentences);

// DELETE /api/stories/:id - Delete a story (admin)
router.delete('/:id', StoryController.deleteStory);

