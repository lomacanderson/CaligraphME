import { Request, Response } from 'express';
import { RewardService } from '../services/reward.service.js';

export class RewardController {
  static async getUserRewards(req: Request, res: Response) {
    try {
      // TODO: Implement get user rewards
      const rewards = await RewardService.getUserRewards(req.params.userId);
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch rewards' });
    }
  }

  static async awardReward(req: Request, res: Response) {
    try {
      // TODO: Implement award reward
      const reward = await RewardService.awardReward(req.body);
      res.status(201).json(reward);
    } catch (error) {
      res.status(500).json({ error: 'Failed to award reward' });
    }
  }

  static async getAchievements(req: Request, res: Response) {
    try {
      // TODO: Implement get achievements
      const achievements = await RewardService.getAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch achievements' });
    }
  }

  static async getLeaderboard(req: Request, res: Response) {
    try {
      // TODO: Implement get leaderboard
      const leaderboard = await RewardService.getLeaderboard(req.query);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  }

  static async getUserPoints(req: Request, res: Response) {
    try {
      // TODO: Implement get user points
      const points = await RewardService.getUserPoints(req.params.userId);
      res.json(points);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch points' });
    }
  }
}

