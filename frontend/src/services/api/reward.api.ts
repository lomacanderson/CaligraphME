import { apiClient } from './api.client';
import { Reward, Achievement, Leaderboard } from '@shared/types';

export const rewardApi = {
  async getUserRewards(userId: string): Promise<Reward[]> {
    return apiClient.get(`/rewards/user/${userId}`);
  },

  async awardReward(data: any): Promise<Reward> {
    return apiClient.post('/rewards/award', data);
  },

  async getAchievements(): Promise<Achievement[]> {
    return apiClient.get('/rewards/achievements');
  },

  async getLeaderboard(params?: any): Promise<Leaderboard> {
    return apiClient.get('/rewards/leaderboard', { params });
  },

  async getUserPoints(userId: string): Promise<{ totalPoints: number }> {
    return apiClient.get(`/rewards/points/${userId}`);
  },
};

