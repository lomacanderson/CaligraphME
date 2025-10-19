import { SupabaseService } from './database/supabase.service.js';
import { VoiceCloningService } from './ai/voice-cloning.service.js';
import { CustomVoiceRecord, VoiceCloningRequest, VoiceCloningResponse } from '../types/custom-voice.types.js';

export class CustomVoiceService {
  /**
   * Create a new custom voice
   */
  static async createCustomVoice(
    userId: string, 
    request: VoiceCloningRequest
  ): Promise<VoiceCloningResponse> {
      console.log('green')
    const supabase = SupabaseService.getClient();
      console.log('greengreen')
    try {
      console.log(`🎤 Creating custom voice for user ${userId}: ${request.name}`);
      
      // Validate audio files
      for (const audioFile of request.audioFiles) {
        const validation = VoiceCloningService.validateAudioFile(audioFile.buffer, audioFile.filename);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
      }

      console.log('heebie')

      // Clone voice using ElevenLabs
      const elevenLabsVoice = await VoiceCloningService.cloneVoice({
        name: request.name,
        description: request.description,
        audioSamples: request.audioFiles.map(f => f.buffer),
        labels: {
          category: request.category,
          user_id: userId,
        },
      });

        console.log('jeebie')
      // Save to database
      const { data: customVoice, error } = await supabase
        .from('custom_voices')
        .insert({
          user_id: userId,
          elevenlabs_voice_id: elevenLabsVoice.voice_id,
          name: request.name,
          description: request.description,
          category: request.category,
          audio_samples: request.audioFiles.map(f => ({
            filename: f.filename,
            size: f.buffer.length,
            uploaded_at: new Date().toISOString(),
          })),
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      console.log(`✅ Custom voice created: ${customVoice.id}`);

      return {
        customVoice,
        elevenlabsVoiceId: elevenLabsVoice.voice_id,
        trainingStatus: 'completed',
      };

    } catch (error) {
      console.error('❌ Failed to create custom voice:', error);
      throw new Error(`Failed to create custom voice: ${(error as Error).message}`);
    }
  }

  /**
   * Get all custom voices for a user
   */
  static async getUserCustomVoices(userId: string): Promise<CustomVoiceRecord[]> {
    const supabase = SupabaseService.getClient();
    
    try {
      const { data, error } = await supabase
        .from('custom_voices')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('❌ Failed to fetch custom voices:', error);
      throw new Error(`Failed to fetch custom voices: ${(error as Error).message}`);
    }
  }

  /**
   * Get a specific custom voice
   */
  static async getCustomVoice(voiceId: string, userId: string): Promise<CustomVoiceRecord> {
    const supabase = SupabaseService.getClient();
    
    try {
      const { data, error } = await supabase
        .from('custom_voices')
        .select('*')
        .eq('id', voiceId)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;

    } catch (error) {
      console.error(`❌ Failed to fetch custom voice ${voiceId}:`, error);
      throw new Error(`Failed to fetch custom voice: ${(error as Error).message}`);
    }
  }

  /**
   * Update custom voice settings
   */
  static async updateVoiceSettings(
    voiceId: string,
    userId: string,
    settings: {
      name?: string;
      description?: string;
      category?: string;
      voice_settings?: {
        stability?: number;
        similarity_boost?: number;
        style?: number;
        use_speaker_boost?: boolean;
      };
    }
  ): Promise<CustomVoiceRecord> {
    const supabase = SupabaseService.getClient();
    
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (settings.name) updateData.name = settings.name;
      if (settings.description) updateData.description = settings.description;
      if (settings.category) updateData.category = settings.category;
      if (settings.voice_settings) {
        updateData.voice_settings = {
          ...settings.voice_settings,
        };
      }

      const { data, error } = await supabase
        .from('custom_voices')
        .update(updateData)
        .eq('id', voiceId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      // Update ElevenLabs voice settings if provided
      if (settings.voice_settings) {
        const customVoice = await this.getCustomVoice(voiceId, userId);
        await VoiceCloningService.updateVoiceSettings(
          customVoice.elevenlabs_voice_id,
          settings.voice_settings
        );
      }

      return data;

    } catch (error) {
      console.error(`❌ Failed to update voice settings ${voiceId}:`, error);
      throw new Error(`Failed to update voice settings: ${(error as Error).message}`);
    }
  }

  /**
   * Delete a custom voice
   */
  static async deleteCustomVoice(voiceId: string, userId: string): Promise<void> {
    const supabase = SupabaseService.getClient();
    
    try {
      // Get the voice to get ElevenLabs ID
      const customVoice = await this.getCustomVoice(voiceId, userId);

      // Delete from ElevenLabs
      await VoiceCloningService.deleteCustomVoice(customVoice.elevenlabs_voice_id);

      // Soft delete from database
      const { error } = await supabase
        .from('custom_voices')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', voiceId)
        .eq('user_id', userId);

      if (error) throw error;

      console.log(`✅ Custom voice deleted: ${voiceId}`);

    } catch (error) {
      console.error(`❌ Failed to delete custom voice ${voiceId}:`, error);
      throw new Error(`Failed to delete custom voice: ${(error as Error).message}`);
    }
  }

  /**
   * Generate audio using a custom voice
   */
  static async generateAudioWithCustomVoice(
    voiceId: string,
    userId: string,
    text: string
  ): Promise<Buffer> {
    try {
      // Get custom voice details
      const customVoice = await this.getCustomVoice(voiceId, userId);

      // Generate audio using ElevenLabs
      const audioStream = await VoiceCloningService.generateAudioWithCustomVoice(
        customVoice.elevenlabs_voice_id,
        text,
        customVoice.voice_settings
      );

      // Convert stream to buffer
      const chunks: Buffer[] = [];
      
      return new Promise<Buffer>((resolve, reject) => {
        audioStream.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });
        
        audioStream.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        });
        
        audioStream.on('error', (error: Error) => {
          reject(error);
        });
      });

    } catch (error) {
      console.error(`❌ Failed to generate audio with custom voice ${voiceId}:`, error);
      throw new Error(`Failed to generate audio: ${(error as Error).message}`);
    }
  }

  /**
   * Get voice usage statistics
   */
  static async getVoiceUsageStats(userId: string): Promise<{
    totalVoices: number;
    voicesByCategory: Record<string, number>;
    totalAudioGenerated: number;
  }> {
    const supabase = SupabaseService.getClient();
    
    try {
      const { data: voices, error } = await supabase
        .from('custom_voices')
        .select('category')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      const voicesByCategory = voices.reduce((acc, voice) => {
        acc[voice.category] = (acc[voice.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalVoices: voices.length,
        voicesByCategory,
        totalAudioGenerated: 0, // TODO: Implement usage tracking
      };

    } catch (error) {
      console.error('❌ Failed to fetch voice usage stats:', error);
      throw new Error(`Failed to fetch voice usage stats: ${(error as Error).message}`);
    }
  }
}

