export interface User {
    id: string;
    email: string;
    username: string;
    firstName?: string;
    lastName?: string;
    age?: number;
    nativeLanguage: string;
    targetLanguage: string;
    level: LanguageLevel;
    totalPoints: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum LanguageLevel {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced"
}
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ko' | 'ar';
export interface UserProgress {
    userId: string;
    storiesCompleted: number;
    sentencesCompleted: number;
    averageAccuracy: number;
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: Date;
}
export interface UserPreferences {
    userId: string;
    theme: 'light' | 'dark';
    soundEnabled: boolean;
    fontSize: 'small' | 'medium' | 'large';
    showHints: boolean;
}
//# sourceMappingURL=user.types.d.ts.map