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
export declare enum ExerciseStatus {
    NOT_STARTED = "not_started",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    SKIPPED = "skipped"
}
export interface Submission {
    id: string;
    exerciseId: string;
    canvasData: string;
    extractedText?: string;
    isCorrect?: boolean;
    similarityScore?: number;
    feedback?: string;
    submittedAt: Date;
    processingTime?: number;
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
//# sourceMappingURL=exercise.types.d.ts.map