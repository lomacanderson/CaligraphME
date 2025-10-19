import { Router } from 'express';
import { router as storyRouter } from './story.routes.js';
import { router as exerciseRouter } from './exercise.routes.js';
import { router as gradingRouter } from './grading.routes.js';
import { router as rewardRouter } from './reward.routes.js';
import { router as userRouter } from './user.routes.js';
import { router as ocrRouter } from './ocr.routes.js';
import { router as customVoiceRouter } from './custom-voice.routes.js';
import paymentRouter from './payment.routes.js';

export const router = Router();

// Route modules
router.use('/stories', storyRouter);
router.use('/exercises', exerciseRouter);
router.use('/grading', gradingRouter);
router.use('/rewards', rewardRouter);
router.use('/users', userRouter);
router.use('/ocr', ocrRouter);
router.use('/custom-voices', customVoiceRouter);
router.use('/payment', paymentRouter);

// API info
router.get('/', (_req, res) => {
  res.json({
    name: 'CaligraphME API',
    version: '0.1.0',
    endpoints: {
      stories: '/api/stories',
      exercises: '/api/exercises',
      grading: '/api/grading',
      rewards: '/api/rewards',
      users: '/api/users',
      ocr: '/api/ocr',
      customVoices: '/api/custom-voices',
      payment: '/api/payment',
    },
  });
});

