import { GeminiService } from './ai/gemini.service.js';
import { SupabaseService } from './database/supabase.service.js';
import { 
  Story, 
  StorySentence, 
  StoryGenerationRequest, 
  StoryGenerationResponse, 
  StoryTheme 
} from '@shared/types';

export class StoryService {
  static async generateStory(params: StoryGenerationRequest & { customPrompt?: string }): Promise<StoryGenerationResponse> {
    const startTime = Date.now();
    
    try {
    // 1. Call Gemini API to generate story
      const generatedStory = await GeminiService.generateStory(params);
      
      // 2. Calculate estimated duration (1 minute per sentence as baseline)
      const sentenceCount = generatedStory.sentences.length;
      const estimatedDuration = Math.ceil(sentenceCount * 1.5); // 1.5 minutes per sentence
      
      // 3. Save story to database
      const { data: storyData, error: storyError } = await SupabaseService.client
        .from('stories')
        .insert({
          title: generatedStory.title,
          language: params.language,
          level: params.level,
          theme: params.theme || StoryTheme.ADVENTURE,
          age_min: params.ageRange?.min,
          age_max: params.ageRange?.max,
          estimated_duration: estimatedDuration,
        })
        .select()
        .single();
      
      if (storyError || !storyData) {
        throw new Error(`Failed to save story: ${storyError?.message}`);
      }
      
      // 4. Save sentences to database
      const sentences = generatedStory.sentences.map((sentence, index) => ({
        story_id: storyData.id,
        order_index: index,
        text_original: sentence.textOriginal,
        text_translated: sentence.textTranslated,
      }));
      
      const { data: sentencesData, error: sentencesError } = await SupabaseService.client
        .from('story_sentences')
        .insert(sentences)
        .select();
      
      if (sentencesError || !sentencesData) {
        // Rollback: delete the story if sentences failed
        await SupabaseService.client
          .from('stories')
          .delete()
          .eq('id', storyData.id);
        
        throw new Error(`Failed to save sentences: ${sentencesError?.message}`);
      }
      
      // 5. Format and return the response
      const story: Story = {
        id: storyData.id,
        title: storyData.title,
        language: storyData.language,
        level: storyData.level,
        theme: storyData.theme,
        ageRange: {
          min: storyData.age_min || 6,
          max: storyData.age_max || 12,
        },
        estimatedDuration: storyData.estimated_duration,
        createdAt: new Date(storyData.created_at),
        sentences: sentencesData.map((s: any) => ({
          id: s.id,
          storyId: s.story_id,
          orderIndex: s.order_index,
          textOriginal: s.text_original,
          textTranslated: s.text_translated,
          audioUrl: s.audio_url,
          imageUrl: s.image_url,
        })),
      };
      
      const generationTime = Date.now() - startTime;
      
      return {
        story,
        metadata: {
          generationTime,
          modelUsed: 'gemini-2.5-flash',
        },
      };
    } catch (error) {
      console.error('Story generation error:', error);
      throw error;
    }
  }

  static async getStories(filters: {
    language?: string;
    level?: string;
    theme?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<Story[]> {
    try {
      let query = SupabaseService.client
        .from('stories')
        .select('*');
      
      // Apply filters
      if (filters.language && filters.language !== 'all') {
        query = query.eq('language', filters.language);
      }
      
      if (filters.level && filters.level !== 'all') {
        query = query.eq('level', filters.level);
      }
      
      if (filters.theme && filters.theme !== 'all') {
        query = query.eq('theme', filters.theme);
      }
      
      // Add pagination
      const limit = filters.limit || 20;
      const offset = filters.offset || 0;
      query = query.range(offset, offset + limit - 1);
      
      // Order by creation date (newest first)
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        throw new Error(`Failed to fetch stories: ${error.message}`);
      }
      
      // Map database records to Story type
      return (data || []).map((record: any) => ({
        id: record.id,
        title: record.title,
        language: record.language,
        level: record.level,
        theme: record.theme,
        ageRange: {
          min: record.age_min || 6,
          max: record.age_max || 12,
        },
        estimatedDuration: record.estimated_duration,
        createdAt: new Date(record.created_at),
        sentences: [], // Don't load sentences by default for list view
      }));
    } catch (error) {
      console.error('Get stories error:', error);
      throw error;
    }
  }

  static async getStoryById(id: string): Promise<Story> {
    try {
      // Get story
      const { data: storyData, error: storyError } = await SupabaseService.client
        .from('stories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (storyError || !storyData) {
        throw new Error(`Story not found: ${storyError?.message}`);
      }
      
      // Get sentences
      const sentences = await this.getStorySentences(id);
      
      return {
        id: storyData.id,
        title: storyData.title,
        language: storyData.language,
        level: storyData.level,
        theme: storyData.theme,
        ageRange: {
          min: storyData.age_min || 6,
          max: storyData.age_max || 12,
        },
        estimatedDuration: storyData.estimated_duration,
        createdAt: new Date(storyData.created_at),
        sentences,
      };
    } catch (error) {
      console.error('Get story by ID error:', error);
      throw error;
    }
  }

  static async getStorySentences(storyId: string): Promise<StorySentence[]> {
    try {
      const { data, error } = await SupabaseService.client
        .from('story_sentences')
        .select('*')
        .eq('story_id', storyId)
        .order('order_index', { ascending: true });
      
      if (error) {
        throw new Error(`Failed to fetch sentences: ${error.message}`);
      }
      
      return (data || []).map((record: any) => ({
        id: record.id,
        storyId: record.story_id,
        orderIndex: record.order_index,
        textOriginal: record.text_original,
        textTranslated: record.text_translated,
        audioUrl: record.audio_url,
        imageUrl: record.image_url,
      }));
    } catch (error) {
      console.error('Get story sentences error:', error);
      throw error;
    }
  }

  static async deleteStory(id: string): Promise<void> {
    try {
      // Due to CASCADE delete, this will also delete associated sentences
      const { error } = await SupabaseService.client
        .from('stories')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw new Error(`Failed to delete story: ${error.message}`);
      }
    } catch (error) {
      console.error('Delete story error:', error);
      throw error;
    }
  }
}

