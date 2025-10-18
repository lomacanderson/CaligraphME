import { Request, Response } from 'express';
import { ExerciseService } from '../services/exercise.service.js';

export class ExerciseController {
  static async createExercise(req: Request, res: Response) {
    try {
      // TODO: Implement create exercise
      const exercise = await ExerciseService.createExercise(req.body);
      res.status(201).json(exercise);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create exercise' });
    }
  }

  static async getExerciseById(req: Request, res: Response) {
    try {
      // TODO: Implement get exercise by ID
      const exercise = await ExerciseService.getExerciseById(req.params.id);
      res.json(exercise);
    } catch (error) {
      res.status(404).json({ error: 'Exercise not found' });
    }
  }

  static async getUserExercises(req: Request, res: Response) {
    try {
      // TODO: Implement get user exercises
      const exercises = await ExerciseService.getUserExercises(req.params.userId);
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch exercises' });
    }
  }

  static async submitCanvas(req: Request, res: Response) {
    try {
      // TODO: Implement canvas submission
      const result = await ExerciseService.submitCanvas(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to submit canvas' });
    }
  }

  static async updateExerciseStatus(req: Request, res: Response) {
    try {
      // TODO: Implement update exercise status
      const exercise = await ExerciseService.updateExerciseStatus(req.params.id, req.body.status);
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update exercise' });
    }
  }
}

