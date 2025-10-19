import { z } from 'zod';
// User Schemas
export const UserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    username: z.string().min(3).max(30),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    age: z.number().min(5).max(18).optional(),
    nativeLanguage: z.string(),
    targetLanguage: z.string(),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    totalPoints: z.number().default(0),
    createdAt: z.date(),
    updatedAt: z.date(),
});
// Story Generation Schema
export const StoryGenerationRequestSchema = z.object({
    language: z.string(),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    theme: z.string().optional(),
    sentenceCount: z.number().min(3).max(20).optional().default(5),
    ageRange: z.object({
        min: z.number().min(5),
        max: z.number().max(18),
    }).optional(),
});
// Canvas Submission Schema
export const CanvasSubmissionSchema = z.object({
    exerciseId: z.string().uuid(),
    canvasData: z.string(),
    format: z.enum(['svg', 'png', 'base64']),
});
// Grading Request Schema
export const GradingRequestSchema = z.object({
    submissionId: z.string().uuid(),
    studentText: z.string(),
    expectedText: z.string(),
    sourceLanguage: z.string(),
    targetLanguage: z.string(),
});
//# sourceMappingURL=index.js.map