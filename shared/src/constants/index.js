export const LANGUAGES = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
    ar: 'Arabic',
};
export const LANGUAGE_LEVELS = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
};
export const STORY_THEMES = {
    animals: 'Animals',
    nature: 'Nature',
    family: 'Family',
    adventure: 'Adventure',
    food: 'Food',
    sports: 'Sports',
    school: 'School',
    friendship: 'Friendship',
};
export const POINTS = {
    PERFECT_SENTENCE: 100,
    GOOD_SENTENCE: 75,
    NEEDS_IMPROVEMENT: 50,
    STORY_COMPLETED: 500,
    DAILY_BONUS: 50,
    STREAK_MULTIPLIER: 1.1,
    // Grading system points (max 110 per submission)
    MAX_HANDWRITING: 40,
    MAX_TRANSLATION: 60,
    PERFECT_BONUS: 10,
};
export const ACCURACY_THRESHOLDS = {
    EXCELLENT: 95,
    GOOD: 80,
    NEEDS_IMPROVEMENT: 60,
    TRY_AGAIN: 0,
};
// Level thresholds - points needed to reach each level
export const LEVEL_THRESHOLDS = {
    BEGINNER: 0,
    INTERMEDIATE: 1000,
    ADVANCED: 5000,
};
// Achievement milestones
export const ACHIEVEMENT_MILESTONES = {
    SENTENCES: [1, 10, 50, 100, 250],
    STORIES: [1, 5, 10, 25, 50],
    STREAK_DAYS: [3, 7, 14, 30, 60],
    TOTAL_POINTS: [500, 1000, 2500, 5000, 10000],
};
export const AGE_RANGES = [
    { min: 5, max: 7, label: '5-7 years' },
    { min: 8, max: 10, label: '8-10 years' },
    { min: 11, max: 13, label: '11-13 years' },
    { min: 14, max: 18, label: '14-18 years' },
];
//# sourceMappingURL=index.js.map