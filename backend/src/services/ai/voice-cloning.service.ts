import { ElevenLabsClient } from 'elevenlabs';
import * as dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  throw new Error('ELEVENLABS_API_KEY environment variable is required');
}

console.log('🔑 ElevenLabs API Key configured:', ELEVENLABS_API_KEY ? 'Yes' : 'No');
console.log('🔑 API Key length:', ELEVENLABS_API_KEY ? ELEVENLABS_API_KEY.length : 0);

const elevenLabsClient = new ElevenLabsClient({
  apiKey: ELEVENLABS_API_KEY,
});

export interface VoiceCloningRequest {
  name: string;
  description?: string;
  audioSamples: Buffer[];
  labels?: Record<string, string>;
}

export interface CustomVoice {
  voice_id: string;
  id: string;
  name: string;
  description?: string;
  category: string;
  settings: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
  sharing: {
    status: string;
    history_item_sample_id: string | null;
    original_voice_id: string | null;
    public_owner_id: string | null;
    liked_by_count: number;
    name: string;
    description: string;
    labels: Record<string, string>;
    created_at_unix: number;
    available_for_tiers: string[];
    permission_on_resource: string;
    rate_limit: number | null;
    notice_period: number | null;
    instagram_username: string | null;
    twitter_username: string | null;
    youtube_username: string | null;
    tiktok_username: string | null;
  };
  high_quality_base_model_ids: string[];
  safety_control: string | null;
  voice_verification: {
    requires_verification: boolean;
    is_verified: boolean;
    verification_failures: string[];
    verification_attempts: number;
  };
  permission_on_resource: string;
}

export class VoiceCloningService {
  /**
   * Clone a voice using audio samples
   */
  static async cloneVoice(request: VoiceCloningRequest): Promise<any> {
    try {
      console.log(`🎤 Starting voice cloning for: ${request.name}`);
      
      // Test ElevenLabs connection first
      console.log('🔍 Testing ElevenLabs connection...');
      try {
        const voices = await elevenLabsClient.voices.getAll();
        console.log(`✅ ElevenLabs connection successful. Found ${voices.voices.length} voices.`);
      } catch (testError) {
        console.error('❌ ElevenLabs connection test failed:', testError);
        throw new Error(`ElevenLabs API connection failed: ${testError.message}`);
      }
      
      // Convert audio samples to the format expected by ElevenLabs
      const audioFiles = request.audioSamples.map((buffer, index) => {
        const blob = new Blob([buffer], { type: 'audio/webm' });
        return new File([blob], `sample_${index}.webm`, { type: 'audio/webm' });
      });

      console.log(`📁 Prepared ${audioFiles.length} audio files for upload`);

      // Create the custom voice
      const customVoice = await elevenLabsClient.voices.add({
        name: request.name,
        description: request.description || `Custom voice: ${request.name}`,
        files: audioFiles,
        labels: request.labels ? JSON.stringify(request.labels) : undefined,
      });

      console.log(`✅ Voice cloned successfully: ${customVoice.voice_id}`);
      return customVoice;
    } catch (error) {
      console.error('❌ Voice cloning failed:', error);
      
      // Provide more detailed error information
      let errorMessage = 'Unknown error occurred';
      
      if (error.message) {
        if (error.message.includes('fetch failed')) {
          errorMessage = 'Network connection failed - unable to reach ElevenLabs API';
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          errorMessage = 'Invalid API key or unauthorized access';
        } else if (error.message.includes('429') || error.message.includes('rate limit')) {
          errorMessage = 'Rate limit exceeded - too many requests';
        } else if (error.message.includes('413') || error.message.includes('too large')) {
          errorMessage = 'Audio files too large for processing';
        } else {
          errorMessage = error.message;
        }
      }
      
      console.error('Detailed error:', errorMessage);
      throw new Error(`Failed to clone voice: ${errorMessage}`);
    }
  }

  /**
   * Get all custom voices for a user
   */
  static async getCustomVoices(): Promise<CustomVoice[]> {
    try {
      const voices = await elevenLabsClient.voices.getAll();
      return voices.voices;
    } catch (error) {
      console.error('❌ Failed to fetch custom voices:', error);
      throw new Error(`Failed to fetch custom voices: ${error.message}`);
    }
  }

  /**
   * Get a specific custom voice by ID
   */
  static async getCustomVoice(voiceId: string): Promise<CustomVoice> {
    try {
      const voice = await elevenLabsClient.voices.get(voiceId);
      return voice;
    } catch (error) {
      console.error(`❌ Failed to fetch custom voice ${voiceId}:`, error);
      throw new Error(`Failed to fetch custom voice: ${error.message}`);
    }
  }

  /**
   * Delete a custom voice
   */
  static async deleteCustomVoice(voiceId: string): Promise<void> {
    try {
      await elevenLabsClient.voices.delete(voiceId);
      console.log(`✅ Custom voice deleted: ${voiceId}`);
    } catch (error) {
      console.error(`❌ Failed to delete custom voice ${voiceId}:`, error);
      throw new Error(`Failed to delete custom voice: ${error.message}`);
    }
  }

  /**
   * Update custom voice settings
   */
  static async updateVoiceSettings(
    voiceId: string, 
    settings: {
      stability?: number;
      similarity_boost?: number;
      style?: number;
      use_speaker_boost?: boolean;
    }
  ): Promise<CustomVoice> {
    try {
      const updatedVoice = await elevenLabsClient.voices.edit(voiceId, {
        name: undefined, // Don't change name
        description: undefined, // Don't change description
        labels: undefined, // Don't change labels
        files: undefined, // Don't change files
        ...settings,
      });
      
      console.log(`✅ Voice settings updated: ${voiceId}`);
      return updatedVoice;
    } catch (error) {
      console.error(`❌ Failed to update voice settings ${voiceId}:`, error);
      throw new Error(`Failed to update voice settings: ${error.message}`);
    }
  }

  /**
   * Generate audio using a custom voice
   */
  static async generateAudioWithCustomVoice(
    voiceId: string,
    text: string,
    settings?: {
      stability?: number;
      similarity_boost?: number;
      style?: number;
      use_speaker_boost?: boolean;
    }
  ): Promise<ReadableStream> {
    try {
      console.log(`🎵 Generating audio with custom voice: ${voiceId}`);
      
      const audioStream = await elevenLabsClient.textToSpeech.convertAsStream(voiceId, {
        model_id: 'eleven_multilingual_v2',
        text,
        output_format: 'mp3_44100_128',
        voice_settings: {
          stability: settings?.stability || 0.5,
          similarity_boost: settings?.similarity_boost || 0.75,
          style: settings?.style || 0.0,
          use_speaker_boost: settings?.use_speaker_boost || true,
        },
      });

      return audioStream;
    } catch (error) {
      console.error(`❌ Failed to generate audio with custom voice ${voiceId}:`, error);
      throw new Error(`Failed to generate audio: ${error.message}`);
    }
  }

  /**
   * Validate audio file for voice cloning
   */
  static validateAudioFile(buffer: Buffer, filename: string): { valid: boolean; error?: string } {
    // Check file size (max 10MB)
    if (buffer.length > 10 * 1024 * 1024) {
      return { valid: false, error: 'Audio file too large. Maximum size is 10MB.' };
    }

    // Check minimum size (at least 100KB for quality)
    if (buffer.length < 100 * 1024) {
      return { valid: false, error: 'Audio file too small. Minimum size is 100KB for quality.' };
    }

    // Check file extension
    const validExtensions = ['.wav', '.mp3', '.m4a', '.flac', '.webm'];
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    
    if (!validExtensions.includes(extension)) {
      return { valid: false, error: 'Invalid audio format. Supported formats: WAV, MP3, M4A, FLAC, WebM' };
    }

    return { valid: true };
  }
}
