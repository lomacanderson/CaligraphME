import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';

export const router = Router();

// POST /api/users - Create a new user
router.post('/', UserController.createUser);

// GET /api/users/:id - Get user by ID
router.get('/:id', UserController.getUserById);

// PATCH /api/users/:id - Update user
router.patch('/:id', UserController.updateUser);

// GET /api/users/:id/progress - Get user progress
router.get('/:id/progress', UserController.getUserProgress);

// GET /api/users/:id/preferences - Get user preferences
router.get('/:id/preferences', UserController.getUserPreferences);

// PATCH /api/users/:id/preferences - Update user preferences
router.patch('/:id/preferences', UserController.updateUserPreferences);

