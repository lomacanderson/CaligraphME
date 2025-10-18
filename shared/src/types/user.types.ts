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

export enum LanguageLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export type SupportedLanguage = 
  | 'en' // English
  | 'es' // Spanish
  | 'fr' // French
  | 'de' // German
  | 'it' // Italian
  | 'pt' // Portuguese
  | 'zh' // Chinese
  | 'ja' // Japanese
  | 'ko' // Korean
  | 'ar'; // Arabic

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

