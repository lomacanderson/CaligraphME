import { z } from 'zod';
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    email: z.ZodString;
    username: z.ZodString;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    age: z.ZodOptional<z.ZodNumber>;
    nativeLanguage: z.ZodString;
    targetLanguage: z.ZodString;
    level: z.ZodEnum<["beginner", "intermediate", "advanced"]>;
    totalPoints: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    level: "beginner" | "intermediate" | "advanced";
    id: string;
    createdAt: Date;
    email: string;
    username: string;
    nativeLanguage: string;
    targetLanguage: string;
    totalPoints: number;
    updatedAt: Date;
    firstName?: string | undefined;
    lastName?: string | undefined;
    age?: number | undefined;
}, {
    level: "beginner" | "intermediate" | "advanced";
    id: string;
    createdAt: Date;
    email: string;
    username: string;
    nativeLanguage: string;
    targetLanguage: string;
    updatedAt: Date;
    firstName?: string | undefined;
    lastName?: string | undefined;
    age?: number | undefined;
    totalPoints?: number | undefined;
}>;
export declare const StoryGenerationRequestSchema: z.ZodObject<{
    language: z.ZodString;
    level: z.ZodEnum<["beginner", "intermediate", "advanced"]>;
    theme: z.ZodOptional<z.ZodString>;
    sentenceCount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    ageRange: z.ZodOptional<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        min: number;
        max: number;
    }, {
        min: number;
        max: number;
    }>>;
}, "strip", z.ZodTypeAny, {
    language: string;
    level: "beginner" | "intermediate" | "advanced";
    sentenceCount: number;
    theme?: string | undefined;
    ageRange?: {
        min: number;
        max: number;
    } | undefined;
}, {
    language: string;
    level: "beginner" | "intermediate" | "advanced";
    theme?: string | undefined;
    sentenceCount?: number | undefined;
    ageRange?: {
        min: number;
        max: number;
    } | undefined;
}>;
export declare const CanvasSubmissionSchema: z.ZodObject<{
    exerciseId: z.ZodString;
    canvasData: z.ZodString;
    format: z.ZodEnum<["svg", "png", "base64"]>;
}, "strip", z.ZodTypeAny, {
    exerciseId: string;
    canvasData: string;
    format: "svg" | "png" | "base64";
}, {
    exerciseId: string;
    canvasData: string;
    format: "svg" | "png" | "base64";
}>;
export declare const GradingRequestSchema: z.ZodObject<{
    submissionId: z.ZodString;
    studentText: z.ZodString;
    expectedText: z.ZodString;
    sourceLanguage: z.ZodString;
    targetLanguage: z.ZodString;
}, "strip", z.ZodTypeAny, {
    expectedText: string;
    targetLanguage: string;
    submissionId: string;
    studentText: string;
    sourceLanguage: string;
}, {
    expectedText: string;
    targetLanguage: string;
    submissionId: string;
    studentText: string;
    sourceLanguage: string;
}>;
export type UserSchemaType = z.infer<typeof UserSchema>;
export type StoryGenerationRequestSchemaType = z.infer<typeof StoryGenerationRequestSchema>;
export type CanvasSubmissionSchemaType = z.infer<typeof CanvasSubmissionSchema>;
export type GradingRequestSchemaType = z.infer<typeof GradingRequestSchema>;
//# sourceMappingURL=index.d.ts.map