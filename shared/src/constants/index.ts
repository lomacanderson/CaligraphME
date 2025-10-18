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
} as const;

export const LANGUAGE_LEVELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
} as const;

export const STORY_THEMES = {
  animals: 'Animals',
  nature: 'Nature',
  family: 'Family',
  adventure: 'Adventure',
  food: 'Food',
  sports: 'Sports',
  school: 'School',
  friendship: 'Friendship',
} as const;

export const POINTS = {
  PERFECT_SENTENCE: 100,
  GOOD_SENTENCE: 75,
  NEEDS_IMPROVEMENT: 50,
  STORY_COMPLETED: 500,
  DAILY_BONUS: 50,
  STREAK_MULTIPLIER: 1.1,
} as const;

export const ACCURACY_THRESHOLDS = {
  EXCELLENT: 95,
  GOOD: 80,
  NEEDS_IMPROVEMENT: 60,
  TRY_AGAIN: 0,
} as const;

export const AGE_RANGES = [
  { min: 5, max: 7, label: '5-7 years' },
  { min: 8, max: 10, label: '8-10 years' },
  { min: 11, max: 13, label: '11-13 years' },
  { min: 14, max: 18, label: '14-18 years' },
] as const;

