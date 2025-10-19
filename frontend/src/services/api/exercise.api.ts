import { apiClient } from './api.client';
import { CanvasSubmissionRequest, CanvasSubmissionResponse } from '@shared/types';

export const exerciseApi = {
  async submitCanvas(exerciseId: string, data: CanvasSubmissionRequest): Promise<CanvasSubmissionResponse> {
    return apiClient.post(`/exercises/${exerciseId}/submit`, data);
  },

  async createExercise(data: any) {
    return apiClient.post('/exercises', data);
  },

  async getExerciseById(id: string) {
    return apiClient.get(`/exercises/${id}`);
  },

  async getUserExercises(userId: string) {
    return apiClient.get(`/exercises/user/${userId}`);
  },
};
