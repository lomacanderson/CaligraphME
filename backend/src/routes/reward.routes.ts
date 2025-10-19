import { Router } from 'express';
import { RewardController } from '../controllers/reward.controller.js';

export const router = Router();

// GET /api/rewards/user/:userId - Get user rewards
router.get('/user/:userId', RewardController.getUserRewards);

// POST /api/rewards/award - Award points/rewards to user
router.post('/award', RewardController.awardReward);

// GET /api/rewards/achievements - Get all achievements
router.get('/achievements', RewardController.getAchievements);

// GET /api/rewards/achievements/:userId - Get user's unlocked achievements
router.get('/achievements/:userId', RewardController.getUserAchievements);

// POST /api/rewards/achievements/check/:userId - Check and award new achievements
router.post('/achievements/check/:userId', RewardController.checkAchievements);

// POST /api/rewards/achievements/initialize - Initialize default achievements
router.post('/achievements/initialize', RewardController.initializeAchievements);

// GET /api/rewards/leaderboard - Get leaderboard
router.get('/leaderboard', RewardController.getLeaderboard);

// GET /api/rewards/points/:userId - Get user point balance
router.get('/points/:userId', RewardController.getUserPoints);

// GET /api/rewards/transactions/:userId - Get user point transactions
router.get('/transactions/:userId', RewardController.getUserPointTransactions);

