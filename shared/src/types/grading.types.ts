import { SupportedLanguage } from './user.types';

export interface GradingRequest {
  submissionId: string;
  studentText: string;
  expectedText: string;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
}

export interface GradingResponse {
  submissionId: string;
  handwritingGrade: HandwritingGrade;
  translationGrade: TranslationGrade;
  overallScore: number; // 0-100 (weighted average)
  feedback: CombinedFeedback;
  pointsEarned: number;
  breakdown: PointBreakdown;
  // Level-up and achievements (optional, only if backend returns them)
  leveledUp?: boolean;
  newLevel?: string;
  newAchievements?: any[];
  user?: any;
}

export interface PointBreakdown {
  handwritingPoints: number;
  translationPoints: number;
  bonusPoints: number;
  totalPoints: number;
}

// Handwriting Quality Grading
export interface HandwritingGrade {
  overallScore: number; // 0-100
  legibilityScore: number; // 0-100 - How readable is it?
  confidenceScore: number; // 0-100 - OCR confidence
  penmanshipScore: number; // 0-100 - Letter formation, spacing
  needsReview: boolean; // True if confidence is too low
  extractedText: string; // What the OCR read
  issues: HandwritingIssue[];
  feedback: Feedback; // Handwriting-specific feedback
}

export interface HandwritingIssue {
  type: 'illegible' | 'unclear' | 'spacing' | 'size' | 'slant';
  description: string;
  severity: 'low' | 'medium' | 'high';
}

// Translation Quality Grading
export interface TranslationGrade {
  overallScore: number; // 0-100
  isCorrect: boolean; // True if score >= threshold
  semanticScore: number; // 0-100 - Meaning match
  grammarScore: number; // 0-100 - Grammar correctness
  vocabularyScore: number; // 0-100 - Word choice
  spellingScore: number; // 0-100 - Spelling accuracy
  errors: ErrorDetail[];
  feedback: Feedback; // Translation-specific feedback
}

export interface ErrorDetail {
  type: ErrorType;
  position: {
    start: number;
    end: number;
  };
  expected: string;
  actual: string;
  suggestion?: string;
}

export enum ErrorType {
  SPELLING = 'spelling',
  GRAMMAR = 'grammar',
  VOCABULARY = 'vocabulary',
  PUNCTUATION = 'punctuation',
  WORD_ORDER = 'word_order',
}

export interface Feedback {
  message: string;
  encouragement: string;
  tips?: string[];
  level: FeedbackLevel;
}

export interface CombinedFeedback {
  handwritingFeedback: Feedback;
  translationFeedback: Feedback;
  overallMessage: string;
  encouragement: string;
  nextSteps?: string[];
}

export enum FeedbackLevel {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  NEEDS_IMPROVEMENT = 'needs_improvement',
  TRY_AGAIN = 'try_again',
}

export interface ComparisonResult {
  similarity: number;
  matchedWords: string[];
  missingWords: string[];
  extraWords: string[];
  suggestions: string[];
}

