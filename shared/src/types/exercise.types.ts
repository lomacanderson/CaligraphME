import { SupportedLanguage } from './user.types';

export interface Exercise {
  id: string;
  userId: string;
  storyId: string;
  sentenceId: string;
  status: ExerciseStatus;
  startedAt: Date;
  completedAt?: Date;
  submissions: Submission[];
}

export enum ExerciseStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
}

export interface Submission {
  id: string;
  exerciseId: string;
  canvasData: string; // SVG or base64 encoded
  extractedText?: string;
  isCorrect?: boolean;
  similarityScore?: number;
  feedback?: string;
  submittedAt: Date;
  processingTime?: number; // in milliseconds
}

export interface CanvasSubmissionRequest {
  exerciseId: string;
  canvasData: string;
  format: 'svg' | 'png' | 'base64';
}

export interface CanvasSubmissionResponse {
  submissionId: string;
  extractedText: string;
  confidence: number;
  needsReview: boolean;
}

