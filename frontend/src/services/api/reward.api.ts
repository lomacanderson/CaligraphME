import { apiClient } from './api.client';
import { Reward, Achievement, Leaderboard, PointTransaction } from '@shared/types';

export const rewardApi = {
  // Get user rewards
  getUserRewards: async (userId: string, limit = 50): Promise<Reward[]> => {
    const response = await apiClient.get(`/rewards/user/${userId}?limit=${limit}`);
    return response.data;
  },

  // Get all achievements
  getAchievements: async (): Promise<Achievement[]> => {
    const response = await apiClient.get('/rewards/achievements');
    return response.data;
  },

  // Get user's unlocked achievements
  getUserAchievements: async (userId: string): Promise<any[]> => {
    const response = await apiClient.get(`/rewards/achievements/${userId}`);
    return response.data;
  },

  // Check for new achievements
  checkAchievements: async (userId: string): Promise<Achievement[]> => {
    const response = await apiClient.post(`/rewards/achievements/check/${userId}`);
    return response.data;
  },

  // Initialize default achievements (admin)
  initializeAchievements: async (): Promise<void> => {
    await apiClient.post('/rewards/achievements/initialize');
  },

  // Get leaderboard
  getLeaderboard: async (period: 'daily' | 'weekly' | 'monthly' | 'all_time' = 'all_time', limit = 20): Promise<Leaderboard> => {
    const response = await apiClient.get(`/rewards/leaderboard?period=${period}&limit=${limit}`);
    return response.data;
  },

  // Get user points
  getUserPoints: async (userId: string): Promise<{ totalPoints: number; level: string }> => {
    const response = await apiClient.get(`/rewards/points/${userId}`);
    return response.data;
  },

  // Get user point transactions
  getUserPointTransactions: async (userId: string, limit = 50): Promise<PointTransaction[]> => {
    const response = await apiClient.get(`/rewards/transactions/${userId}?limit=${limit}`);
    return response.data;
  },

  // Award reward (admin)
  awardReward: async (data: {
    userId: string;
    type: string;
    title: string;
    description: string;
    points: number;
    metadata?: any;
  }): Promise<Reward> => {
    const response = await apiClient.post('/rewards/award', data);
    return response.data;
  },
};
