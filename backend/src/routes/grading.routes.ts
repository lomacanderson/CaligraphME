import { Router } from 'express';
import { GradingController } from '../controllers/grading.controller.js';

export const router = Router();

// POST /api/grading/grade - Grade a submission
router.post('/grade', GradingController.gradeSubmission);

// POST /api/grading/compare - Compare two texts
router.post('/compare', GradingController.compareTexts);

// GET /api/grading/submission/:id - Get grading results for a submission
router.get('/submission/:id', GradingController.getGradingResults);

