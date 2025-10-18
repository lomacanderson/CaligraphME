import { apiClient } from './api.client';
import { Exercise, CanvasSubmissionRequest, CanvasSubmissionResponse } from '@shared/types';

export const exerciseApi = {
  async createExercise(data: any): Promise<Exercise> {
    return apiClient.post('/exercises', data);
  },

  async getExerciseById(id: string): Promise<Exercise> {
    return apiClient.get(`/exercises/${id}`);
  },

  async getUserExercises(userId: string): Promise<Exercise[]> {
    return apiClient.get(`/exercises/user/${userId}`);
  },

  async submitCanvas(
    exerciseId: string,
    data: CanvasSubmissionRequest
  ): Promise<CanvasSubmissionResponse> {
    return apiClient.post(`/exercises/${exerciseId}/submit`, data);
  },

  async updateExerciseStatus(id: string, status: string): Promise<Exercise> {
    return apiClient.patch(`/exercises/${id}/status`, { status });
  },
};

