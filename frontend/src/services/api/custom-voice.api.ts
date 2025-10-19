import { apiClient } from './api.client';

export interface CustomVoice {
  id: string;
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
  audioFiles: File[];
}

export interface VoiceCloningResponse {
  customVoice: CustomVoice;
  elevenlabsVoiceId: string;
  trainingStatus: 'pending' | 'completed' | 'failed';
  estimatedCompletionTime?: number;
}

export interface VoiceStats {
  totalVoices: number;
  voicesByCategory: Record<string, number>;
  totalAudioGenerated: number;
}

export class CustomVoiceAPI {
  /**
   * Create a new custom voice
   */
  static async createCustomVoice(request: VoiceCloningRequest): Promise<VoiceCloningResponse> {
    const formData = new FormData();
    formData.append('name', request.name);
    formData.append('category', request.category);
    
    if (request.description) {
      formData.append('description', request.description);
    }

    // Add audio files
    request.audioFiles.forEach((file) => {
      formData.append('audioFiles', file);
    });

    return apiClient.post('/custom-voices', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get all custom voices for the current user
   */
  static async getCustomVoices(): Promise<CustomVoice[]> {
    return apiClient.get('/custom-voices');
  }

  /**
   * Get a specific custom voice
   */
  static async getCustomVoice(voiceId: string): Promise<CustomVoice> {
    return apiClient.get(`/custom-voices/${voiceId}`);
  }

  /**
   * Update custom voice settings
   */
  static async updateCustomVoice(
    voiceId: string,
    updates: {
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
  ): Promise<CustomVoice> {
    return apiClient.put(`/custom-voices/${voiceId}`, updates);
  }

  /**
   * Delete a custom voice
   */
  static async deleteCustomVoice(voiceId: string): Promise<void> {
    return apiClient.delete(`/custom-voices/${voiceId}`);
  }

  /**
   * Generate audio using a custom voice
   */
  static async generateAudioWithCustomVoice(
    voiceId: string,
    text: string
  ): Promise<Blob> {
    return apiClient.post(`/custom-voices/${voiceId}/generate`, { text }, {
      responseType: 'blob'
    });
  }

  /**
   * Get voice usage statistics
   */
  static async getVoiceStats(): Promise<VoiceStats> {
    return apiClient.get('/custom-voices/stats');
  }

  /**
   * Play audio from blob
   */
  static playAudio(blob: Blob): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const url = URL.createObjectURL(blob);
      
      audio.onloadeddata = () => {
        audio.play().then(resolve).catch(reject);
      };
      
      audio.onerror = reject;
      audio.src = url;
    });
  }

  /**
   * Download audio as file
   */
  static downloadAudio(blob: Blob, filename: string = 'audio.mp3'): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
