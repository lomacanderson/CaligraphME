// ElevenLabs Voice Configuration
export interface Voice {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female';
  language: string;
  age: 'young' | 'adult' | 'senior';
}

export const AVAILABLE_VOICES: Voice[] = [
  {
    id: 'JBFqnCBsd6RMkjVDRZzb',
    name: 'Bella',
    description: 'Friendly female voice, great for storytelling',
    gender: 'female',
    language: 'multilingual',
    age: 'young'
  },
  {
    id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Bella (Alternative)',
    description: 'Clear and articulate female voice',
    gender: 'female',
    language: 'multilingual',
    age: 'young'
  },
  {
    id: 'VR6AewLTigWG4xSOukaG',
    name: 'Arnold',
    description: 'Strong male voice, perfect for adventures',
    gender: 'male',
    language: 'multilingual',
    age: 'adult'
  },
  {
    id: 'AZnzlk1XvdvUeBnXmlld',
    name: 'Domi',
    description: 'Confident female voice with character',
    gender: 'female',
    language: 'multilingual',
    age: 'adult'
  },
  {
    id: 'ErXwobaYiN019PkySvjV',
    name: 'Antoni',
    description: 'Warm and engaging male voice',
    gender: 'male',
    language: 'multilingual',
    age: 'adult'
  },
  {
    id: 'MF3mGyEYCl7XYWbV9V6O',
    name: 'Elli',
    description: 'Cheerful female voice, great for children',
    gender: 'female',
    language: 'multilingual',
    age: 'young'
  },
  {
    id: 'TxGEqnHWrfWFTfGW9XjX',
    name: 'Josh',
    description: 'Friendly male voice, excellent for learning',
    gender: 'male',
    language: 'multilingual',
    age: 'young'
  },
  {
    id: 'VR6AewLTigWG4xSOukaG',
    name: 'Arnold',
    description: 'Deep male voice, great for dramatic stories',
    gender: 'male',
    language: 'multilingual',
    age: 'adult'
  },
  {
    id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    description: 'Clear and professional male voice',
    gender: 'male',
    language: 'multilingual',
    age: 'adult'
  },
  {
    id: 'yoZ06aMxZJJ28mfd3POQ',
    name: 'Sam',
    description: 'Friendly and approachable male voice',
    gender: 'male',
    language: 'multilingual',
    age: 'young'
  }
];

// Default voice for each language level
export const DEFAULT_VOICES_BY_LEVEL = {
  beginner: 'JBFqnCBsd6RMkjVDRZzb', // Bella - friendly and clear
  intermediate: 'ErXwobaYiN019PkySvjV', // Antoni - warm and engaging
  advanced: 'pNInz6obpgDQGcFmaJgB', // Adam - clear and professional
} as const;

// Get recommended voices for a specific language level
export function getRecommendedVoices(level: string): Voice[] {
  const defaultVoiceId = DEFAULT_VOICES_BY_LEVEL[level as keyof typeof DEFAULT_VOICES_BY_LEVEL] || DEFAULT_VOICES_BY_LEVEL.beginner;
  
  // Return voices with the default first
  const defaultVoice = AVAILABLE_VOICES.find(v => v.id === defaultVoiceId);
  const otherVoices = AVAILABLE_VOICES.filter(v => v.id !== defaultVoiceId);
  
  return defaultVoice ? [defaultVoice, ...otherVoices] : AVAILABLE_VOICES;
}

