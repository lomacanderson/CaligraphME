import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class SupabaseService {
  private static _client: SupabaseClient | null = null;

  static initialize() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials are not set');
    }

    this._client = createClient(supabaseUrl, supabaseKey);
  }

  static get client(): SupabaseClient {
    if (!this._client) {
      this.initialize();
    }
    return this._client!;
  }

  static getClient(): SupabaseClient {
    return this.client;
  }

  // Storage
  static async uploadFile(bucket: string, path: string, file: Buffer) {
    const supabase = this.getClient();
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        contentType: 'audio/mpeg',
        upsert: true, // Overwrite if exists
      });

    if (error) throw error;
    return data;
  }

  static async getFileUrl(bucket: string, path: string) {
    const supabase = this.getClient();
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  static async deleteFile(bucket: string, path: string) {
    const supabase = this.getClient();
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  }

  static async createBucket(bucketName: string) {
    const supabase = this.getClient();
    
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['audio/mpeg', 'audio/wav', 'audio/mp4'],
      fileSizeLimit: 10 * 1024 * 1024, // 10MB limit
    });

    if (error) throw error;
    return data;
  }
}

