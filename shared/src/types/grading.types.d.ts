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
    overallScore: number;
    feedback: CombinedFeedback;
    pointsEarned: number;
    breakdown: PointBreakdown;
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
export interface HandwritingGrade {
    overallScore: number;
    legibilityScore: number;
    confidenceScore: number;
    penmanshipScore: number;
    needsReview: boolean;
    extractedText: string;
    issues: HandwritingIssue[];
    feedback: Feedback;
}
export interface HandwritingIssue {
    type: 'illegible' | 'unclear' | 'spacing' | 'size' | 'slant';
    description: string;
    severity: 'low' | 'medium' | 'high';
}
export interface TranslationGrade {
    overallScore: number;
    isCorrect: boolean;
    semanticScore: number;
    grammarScore: number;
    vocabularyScore: number;
    spellingScore: number;
    errors: ErrorDetail[];
    feedback: Feedback;
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
export declare enum ErrorType {
    SPELLING = "spelling",
    GRAMMAR = "grammar",
    VOCABULARY = "vocabulary",
    PUNCTUATION = "punctuation",
    WORD_ORDER = "word_order"
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
export declare enum FeedbackLevel {
    EXCELLENT = "excellent",
    GOOD = "good",
    NEEDS_IMPROVEMENT = "needs_improvement",
    TRY_AGAIN = "try_again"
}
export interface ComparisonResult {
    similarity: number;
    matchedWords: string[];
    missingWords: string[];
    extraWords: string[];
    suggestions: string[];
}
//# sourceMappingURL=grading.types.d.ts.map