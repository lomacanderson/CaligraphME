export interface CustomVoiceRecord {
  id: string;
  user_id: string;
  elevenlabs_voice_id: string;
  name: string;
  description?: string;
  category: 'personal' | 'family' | 'teacher' | 'character' | 'other';
  audio_samples: {
    filename: string;
    size: number;
    duration?: number;
    uploaded_at: string;
  }[];
  voice_settings: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VoiceCloningRequest {
  name: string;
  description?: string;
  category: 'personal' | 'family' | 'teacher' | 'character' | 'other';
  audioFiles: {
    filename: string;
    buffer: Buffer;
  }[];
}

export interface VoiceCloningResponse {
  customVoice: CustomVoiceRecord;
  elevenlabsVoiceId: string;
  trainingStatus: 'pending' | 'completed' | 'failed';
  estimatedCompletionTime?: number;
}

