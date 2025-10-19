import { LanguageLevel, SupportedLanguage } from './user.types';
export interface Story {
    id: string;
    title: string;
    language: SupportedLanguage;
    level: LanguageLevel;
    sentences: StorySentence[];
    theme: StoryTheme;
    ageRange: AgeRange;
    estimatedDuration: number;
    createdAt: Date;
}
export interface StorySentence {
    id: string;
    storyId: string;
    orderIndex: number;
    textOriginal: string;
    textTranslated: string;
    audioUrl?: string;
    imageUrl?: string;
}
export declare enum StoryTheme {
    ANIMALS = "animals",
    NATURE = "nature",
    FAMILY = "family",
    ADVENTURE = "adventure",
    FOOD = "food",
    SPORTS = "sports",
    SCHOOL = "school",
    FRIENDSHIP = "friendship"
}
export interface AgeRange {
    min: number;
    max: number;
}
export interface StoryGenerationRequest {
    language: SupportedLanguage;
    level: LanguageLevel;
    theme?: StoryTheme;
    sentenceCount?: number;
    ageRange?: AgeRange;
    customPrompt?: string;
    voiceId?: string;
}
export interface StoryGenerationResponse {
    story: Story;
    metadata: {
        generationTime: number;
        modelUsed: string;
    };
}
//# sourceMappingURL=story.types.d.ts.map