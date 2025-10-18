import { apiClient } from './api.client';
import { User, UserProgress, UserPreferences } from '@shared/types';

export const userApi = {
  async createUser(data: any): Promise<User> {
    return apiClient.post('/users', data);
  },

  async getUserById(id: string): Promise<User> {
    return apiClient.get(`/users/${id}`);
  },

  async updateUser(id: string, data: any): Promise<User> {
    return apiClient.patch(`/users/${id}`, data);
  },

  async getUserProgress(id: string): Promise<UserProgress> {
    return apiClient.get(`/users/${id}/progress`);
  },

  async getUserPreferences(id: string): Promise<UserPreferences> {
    return apiClient.get(`/users/${id}/preferences`);
  },

  async updateUserPreferences(id: string, data: any): Promise<UserPreferences> {
    return apiClient.patch(`/users/${id}/preferences`, data);
  },
};

