import { SupabaseService } from './database/supabase.service.js';

// Level thresholds (points needed to reach each level)
const LEVEL_THRESHOLDS = {
  beginner: 0,
  intermediate: 1000,
  advanced: 5000,
};

export class UserService {
  static async createUser(data: any) {
    const supabase = SupabaseService.getClient();
    
    try {
      // Create user in database with Supabase auth ID if provided
      const insertData: any = {
        email: data.email,
        username: data.username,
        first_name: data.firstName,
        last_name: data.lastName,
        age: data.age,
        native_language: data.nativeLanguage,
        target_language: data.targetLanguage,
        level: data.level || 'beginner',
        total_points: 0,
      };

      // If an ID is provided (from Supabase auth), use it
      if (data.id) {
        insertData.id = data.id;
      }

      const { data: user, error } = await supabase
        .from('users')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      // Initialize user progress
      await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          stories_completed: 0,
          sentences_completed: 0,
          average_accuracy: 0,
          current_streak: 0,
          longest_streak: 0,
        });

      // Initialize user preferences
      await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          theme: 'light',
          sound_enabled: true,
          font_size: 'medium',
          show_hints: true,
        });

      return this.formatUser(user);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  static async getUserById(id: string) {
    const supabase = SupabaseService.getClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error('User not found');
    return this.formatUser(data);
  }

  static async getUserByEmail(email: string) {
    const supabase = SupabaseService.getClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error) return null;
    return this.formatUser(data);
  }

  static async updateUser(id: string, data: any) {
    const supabase = SupabaseService.getClient();
    
    const { data: updated, error } = await supabase
      .from('users')
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        age: data.age,
        native_language: data.nativeLanguage,
        target_language: data.targetLanguage,
        level: data.level,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error('Failed to update user');
    return this.formatUser(updated);
  }

  static async addPoints(userId: string, points: number, reason: string): Promise<{ user: any; leveledUp: boolean; newLevel?: string }> {
    const supabase = SupabaseService.getClient();
    
    // Get current user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw new Error('User not found');

    const oldLevel = user.level;
    const newPoints = user.total_points + points;
    const newLevel = this.calculateLevel(newPoints);
    const leveledUp = newLevel !== oldLevel;

    // Update user points and level
    const { data: updated, error: updateError } = await supabase
      .from('users')
      .update({
        total_points: newPoints,
        level: newLevel,
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) throw new Error('Failed to update points');

    // Create point transaction record
    await supabase
      .from('point_transactions')
      .insert({
        user_id: userId,
        amount: points,
        type: 'earned',
        reason,
        balance_after: newPoints,
      });

    return {
      user: this.formatUser(updated),
      leveledUp,
      newLevel: leveledUp ? newLevel : undefined,
    };
  }

  static calculateLevel(totalPoints: number): string {
    if (totalPoints >= LEVEL_THRESHOLDS.advanced) return 'advanced';
    if (totalPoints >= LEVEL_THRESHOLDS.intermediate) return 'intermediate';
    return 'beginner';
  }

  static async getUserProgress(id: string) {
    const supabase = SupabaseService.getClient();
    
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error) throw new Error('User progress not found');
    return this.formatUserProgress(data);
  }

  static async updateUserProgress(userId: string, updates: any) {
    const supabase = SupabaseService.getClient();
    
    const { data, error } = await supabase
      .from('user_progress')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error('Failed to update progress');
    return this.formatUserProgress(data);
  }

  static async getUserPreferences(id: string) {
    const supabase = SupabaseService.getClient();
    
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', id)
      .single();

    if (error) throw new Error('User preferences not found');
    return data;
  }

  static async updateUserPreferences(id: string, preferences: any) {
    const supabase = SupabaseService.getClient();
    
    const { data, error } = await supabase
      .from('user_preferences')
      .update(preferences)
      .eq('user_id', id)
      .select()
      .single();

    if (error) throw new Error('Failed to update preferences');
    return data;
  }

  // Helper methods
  private static formatUser(data: any) {
    return {
      id: data.id,
      email: data.email,
      username: data.username,
      firstName: data.first_name,
      lastName: data.last_name,
      age: data.age,
      nativeLanguage: data.native_language,
      targetLanguage: data.target_language,
      level: data.level,
      totalPoints: data.total_points,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  private static formatUserProgress(data: any) {
    return {
      userId: data.user_id,
      storiesCompleted: data.stories_completed,
      sentencesCompleted: data.sentences_completed,
      averageAccuracy: parseFloat(data.average_accuracy),
      currentStreak: data.current_streak,
      longestStreak: data.longest_streak,
      lastActivityDate: data.last_activity_date ? new Date(data.last_activity_date) : null,
    };
  }
}

