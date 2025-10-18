import { apiClient } from './api.client';
import { Story, StoryGenerationRequest } from '@shared/types';

export const storyApi = {
  async generateStory(data: StoryGenerationRequest): Promise<Story> {
    return apiClient.post('/stories/generate', data);
  },

  async getStories(filters?: any): Promise<Story[]> {
    return apiClient.get('/stories', { params: filters });
  },

  async getStoryById(id: string): Promise<Story> {
    return apiClient.get(`/stories/${id}`);
  },

  async getStorySentences(id: string) {
    return apiClient.get(`/stories/${id}/sentences`);
  },

  async deleteStory(id: string): Promise<void> {
    return apiClient.delete(`/stories/${id}`);
  },
};

