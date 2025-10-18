import { Request, Response } from 'express';
import { GradingService } from '../services/grading.service.js';

export class GradingController {
  static async gradeSubmission(req: Request, res: Response) {
    try {
      // TODO: Implement grading
      const result = await GradingService.gradeSubmission(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to grade submission' });
    }
  }

  static async compareTexts(req: Request, res: Response) {
    try {
      // TODO: Implement text comparison
      const result = await GradingService.compareTexts(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to compare texts' });
    }
  }

  static async getGradingResults(req: Request, res: Response) {
    try {
      // TODO: Implement get grading results
      const results = await GradingService.getGradingResults(req.params.id);
      res.json(results);
    } catch (error) {
      res.status(404).json({ error: 'Grading results not found' });
    }
  }
}

