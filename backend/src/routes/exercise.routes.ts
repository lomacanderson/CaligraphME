import { Router } from 'express';
import { ExerciseController } from '../controllers/exercise.controller.js';

export const router = Router();

// POST /api/exercises - Create a new exercise
router.post('/', ExerciseController.createExercise);

// GET /api/exercises/:id - Get exercise details
router.get('/:id', ExerciseController.getExerciseById);

// GET /api/exercises/user/:userId - Get exercises for a user
router.get('/user/:userId', ExerciseController.getUserExercises);

// POST /api/exercises/:id/submit - Submit a canvas drawing
router.post('/:id/submit', ExerciseController.submitCanvas);

// PATCH /api/exercises/:id/status - Update exercise status
router.patch('/:id/status', ExerciseController.updateExerciseStatus);

