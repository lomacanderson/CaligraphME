import { Request, Response } from 'express';
import { RewardService } from '../services/reward.service.js';
import { UserService } from '../services/user.service.js';

export class RewardController {
  static async getUserRewards(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const rewards = await RewardService.getUserRewards(userId, limit);
      res.json(rewards);
    } catch (error) {
      console.error('Error getting rewards:', error);
      res.status(500).json({ error: 'Failed to fetch rewards' });
    }
  }

  static async awardReward(req: Request, res: Response) {
    try {
      const { userId, type, title, description, points, metadata } = req.body;
      const reward = await RewardService.awardReward(userId, type, title, description, points, metadata);
      res.status(201).json(reward);
    } catch (error) {
      console.error('Error awarding reward:', error);
      res.status(500).json({ error: 'Failed to award reward' });
    }
  }

  static async getAchievements(req: Request, res: Response) {
    try {
      const achievements = await RewardService.getAchievements();
      res.json(achievements);
    } catch (error) {
      console.error('Error getting achievements:', error);
      res.status(500).json({ error: 'Failed to fetch achievements' });
    }
  }

  static async getUserAchievements(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const achievements = await RewardService.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error('Error getting user achievements:', error);
      res.status(500).json({ error: 'Failed to fetch user achievements' });
    }
  }

  static async getLeaderboard(req: Request, res: Response) {
    try {
      const period = (req.query.period as any) || 'all_time';
      const limit = parseInt(req.query.limit as string) || 20;
      const leaderboard = await RewardService.getLeaderboard(period, limit);
      res.json(leaderboard);
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  }

  static async getUserPoints(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await UserService.getUserById(userId);
      res.json({ totalPoints: user.totalPoints, level: user.level });
    } catch (error) {
      console.error('Error getting user points:', error);
      res.status(500).json({ error: 'Failed to fetch points' });
    }
  }

  static async getUserPointTransactions(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;
      const transactions = await RewardService.getUserPointTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      console.error('Error getting point transactions:', error);
      res.status(500).json({ error: 'Failed to fetch point transactions' });
    }
  }

  static async checkAchievements(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const newAchievements = await RewardService.checkAndAwardAchievements(userId);
      res.json(newAchievements);
    } catch (error) {
      console.error('Error checking achievements:', error);
      res.status(500).json({ error: 'Failed to check achievements' });
    }
  }

  static async initializeAchievements(req: Request, res: Response) {
    try {
      await RewardService.initializeAchievements();
      res.json({ message: 'Achievements initialized successfully' });
    } catch (error) {
      console.error('Error initializing achievements:', error);
      res.status(500).json({ error: 'Failed to initialize achievements' });
    }
  }
}

