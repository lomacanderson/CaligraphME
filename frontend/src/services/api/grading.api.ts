import { apiClient } from './api.client';
import { GradingRequest, GradingResponse } from '@shared/types';

export const gradingApi = {
  async gradeSubmission(data: GradingRequest): Promise<GradingResponse> {
    return apiClient.post('/grading/grade', data);
  },

  async compareTexts(data: any) {
    return apiClient.post('/grading/compare', data);
  },

  async getGradingResults(submissionId: string) {
    return apiClient.get(`/grading/submission/${submissionId}`);
  },
};

