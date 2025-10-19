import { apiClient } from './api.client';

export interface Voice {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female';
  language: string;
  age: 'young' | 'adult' | 'senior';
}

export const voiceApi = {
  async getAvailableVoices(level?: string): Promise<Voice[]> {
    const params = level ? { level } : {};
    return apiClient.get('/stories/voices', { params });
  },
};

