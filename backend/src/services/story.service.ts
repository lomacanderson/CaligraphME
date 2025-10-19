import { GeminiService } from './ai/gemini.service.js';
import { SupabaseService } from './database/supabase.service.js';
import { textToAudio } from './ai/dictation.service.js';
import { DEFAULT_VOICES_BY_LEVEL } from '../config/voices.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { 
  Story, 
  StorySentence, 
  StoryGenerationRequest, 
  StoryGenerationResponse, 
  StoryTheme 
} from '@shared/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class StoryService {
  static async generateStory(params: StoryGenerationRequest & { customPrompt?: string; voiceId?: string }): Promise<StoryGenerationResponse> {
    const startTime = Date.now();
    
    try {
    // 1. Call Gemini API to generate story
      const generatedStory = await GeminiService.generateStory(params);
      
      // 2. Calculate estimated duration (1 minute per sentence as baseline)
      const sentenceCount = generatedStory.sentences.length;
      const estimatedDuration = Math.ceil(sentenceCount * 1.5); // 1.5 minutes per sentence
      
      // Database is now set up - enable persistence
      const USE_DATABASE = true;
      
      if (USE_DATABASE) {
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
        
        // 4.5. Generate audio for each sentence (blocking - wait for completion)
        console.log('🎵 Starting synchronous audio generation...');
        try {
          const selectedVoice = params.voiceId || DEFAULT_VOICES_BY_LEVEL[params.level] || DEFAULT_VOICES_BY_LEVEL.beginner;
          await this.generateAudioForSentences(sentencesData, storyData.id, selectedVoice);
          console.log('✅ Audio generation completed before response');
        } catch (err) {
          console.error('❌ Audio generation failed:', err);
          // Continue with story creation even if audio fails
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
      } else {
        // Return story without database persistence (temporary for testing)
        console.log('⚠️  Database disabled - story not persisted');
        const story: Story = {
          id: `temp-${Date.now()}`, // Temporary ID
          title: generatedStory.title,
          language: params.language,
          level: params.level,
          theme: params.theme || StoryTheme.ADVENTURE,
          ageRange: {
            min: params.ageRange?.min || 6,
            max: params.ageRange?.max || 12,
          },
          estimatedDuration: estimatedDuration,
          createdAt: new Date(),
          sentences: generatedStory.sentences.map((s, index) => ({
            id: `temp-sentence-${index}`,
            storyId: `temp-${Date.now()}`,
            orderIndex: index,
            textOriginal: s.textOriginal,
            textTranslated: s.textTranslated,
            audioUrl: undefined,
            imageUrl: undefined,
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
      }
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

  /**
   * Generate audio for all sentences in a story
   * This runs synchronously and blocks until all audio is generated
   */
  private static async generateAudioForSentences(sentencesData: any[], storyId: string, voiceId: string = 'JBFqnCBsd6RMkjVDRZzb'): Promise<void> {
    console.log(`🎵 Generating audio for ${sentencesData.length} sentences in story ${storyId}...`);
    
    // Check if this is a custom voice (UUID format) or ElevenLabs voice ID
    const isCustomVoice = voiceId.length > 20; // Custom voices are typically longer UUIDs
    
    // Ensure the audio bucket exists
    try {
      await SupabaseService.createBucket('audio-files');
      console.log('✅ Audio bucket ready');
    } catch (error) {
      console.log('📁 Audio bucket already exists or created');
    }
    
    for (const sentence of sentencesData) {
      try {
        // Generate unique filename for this sentence
        const audioFileName = `${sentence.id}.mp3`;
        const audioFilePath = path.join(__dirname, '..', '..', 'temp', audioFileName);
        
        // Ensure temp directory exists
        const tempDir = path.dirname(audioFilePath);
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        
        let audioBuffer: Buffer;
        
        if (isCustomVoice) {
          // This is a custom voice - try to use it, but fall back to standard voice if it fails
          try {
            console.log(`🎤 Attempting to use custom voice: ${voiceId}`);
            const { CustomVoiceService } = await import('./custom-voice.service.js');
            
            // Try to get the voice without user validation first
            // This is a temporary workaround - ideally we'd pass userId from the request
            const supabase = SupabaseService.getClient();
            const { data: customVoice, error } = await supabase
              .from('custom_voices')
              .select('*')
              .eq('id', voiceId)
              .eq('is_active', true)
              .single();
            
            if (error || !customVoice) {
              throw new Error('Custom voice not found or not active');
            }
            
            console.log(`✅ Found custom voice, generating audio with ElevenLabs voice ID: ${customVoice.elevenlabs_voice_id}`);
            // Use the ElevenLabs voice ID from the custom voice
            await textToAudio(sentence.text_original, audioFilePath, customVoice.elevenlabs_voice_id);
            audioBuffer = fs.readFileSync(audioFilePath);
          } catch (customVoiceError) {
            console.warn(`⚠️ Failed to use custom voice, falling back to default:`, customVoiceError);
            // Fall back to default voice
            const defaultVoice = DEFAULT_VOICES_BY_LEVEL.beginner;
            await textToAudio(sentence.text_original, audioFilePath, defaultVoice);
            audioBuffer = fs.readFileSync(audioFilePath);
          }
        } else {
          // This is a standard ElevenLabs voice
          console.log(`🔊 Using ElevenLabs voice: ${voiceId}`);
          await textToAudio(sentence.text_original, audioFilePath, voiceId);
          audioBuffer = fs.readFileSync(audioFilePath);
        }
        
        // Upload to Supabase Storage
        const storagePath = `stories/${storyId}/${audioFileName}`;
        await SupabaseService.uploadFile('audio-files', storagePath, audioBuffer);
        
        // Get the public URL from Supabase Storage
        const audioUrl = await SupabaseService.getFileUrl('audio-files', storagePath);
        
        // Update the sentence in the database with the audio URL
        const { error } = await SupabaseService.client
          .from('story_sentences')
          .update({ audio_url: audioUrl })
          .eq('id', sentence.id);
        
        if (error) {
          console.error(`Failed to update audio URL for sentence ${sentence.id}:`, error);
        } else {
          console.log(`✅ Generated and uploaded audio for sentence: "${sentence.text_original.substring(0, 30)}..."`);
          console.log(`🔗 Audio URL: ${audioUrl}`);
        }
        
        // Clean up temporary file
        try {
          fs.unlinkSync(audioFilePath);
        } catch (cleanupError) {
          console.warn(`Failed to cleanup temp file ${audioFilePath}:`, cleanupError);
        }
        
      } catch (error) {
        console.error(`Failed to generate audio for sentence ${sentence.id}:`, error);
        // Continue with other sentences even if one fails
      }
    }
    
    console.log(`🎉 Audio generation and upload completed for story ${storyId}`);
  }
}

