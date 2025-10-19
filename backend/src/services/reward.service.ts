import { SupabaseService } from './database/supabase.service.js';
import { UserService } from './user.service.js';

// Achievement definitions
const ACHIEVEMENTS = [
  {
    name: 'First Steps',
    description: 'Complete your first sentence',
    requirement_type: 'sentences_completed',
    requirement_threshold: 1,
    points: 50,
  },
  {
    name: 'Getting Started',
    description: 'Complete 10 sentences',
    requirement_type: 'sentences_completed',
    requirement_threshold: 10,
    points: 100,
  },
  {
    name: 'Dedicated Learner',
    description: 'Complete 50 sentences',
    requirement_type: 'sentences_completed',
    requirement_threshold: 50,
    points: 250,
  },
  {
    name: 'Story Master',
    description: 'Complete your first story',
    requirement_type: 'stories_completed',
    requirement_threshold: 1,
    points: 100,
  },
  {
    name: 'Bookworm',
    description: 'Complete 5 stories',
    requirement_type: 'stories_completed',
    requirement_threshold: 5,
    points: 300,
  },
  {
    name: 'Perfect Form',
    description: 'Get a perfect score (100%)',
    requirement_type: 'perfect_sentences',
    requirement_threshold: 1,
    points: 150,
  },
  {
    name: 'Streak Starter',
    description: 'Maintain a 3-day streak',
    requirement_type: 'streak_days',
    requirement_threshold: 3,
    points: 100,
  },
  {
    name: 'Consistency King',
    description: 'Maintain a 7-day streak',
    requirement_type: 'streak_days',
    requirement_threshold: 7,
    points: 250,
  },
  {
    name: 'Point Collector',
    description: 'Earn 500 total points',
    requirement_type: 'total_points',
    requirement_threshold: 500,
    points: 100,
  },
  {
    name: 'Rising Star',
    description: 'Earn 1000 total points',
    requirement_type: 'total_points',
    requirement_threshold: 1000,
    points: 200,
  },
];

export class RewardService {
  static async getUserRewards(userId: string, limit = 50) {
    const supabase = SupabaseService.getClient();
    
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error('Failed to get rewards');
    
    return data.map(reward => ({
      id: reward.id,
      userId: reward.user_id,
      type: reward.type,
      title: reward.title,
      description: reward.description,
      points: reward.points,
      earnedAt: new Date(reward.earned_at),
      metadata: reward.metadata,
    }));
  }

  static async awardReward(userId: string, type: string, title: string, description: string, points: number, metadata?: any) {
    const supabase = SupabaseService.getClient();
    
    // Create reward record
    const { data: reward, error } = await supabase
      .from('rewards')
      .insert({
        user_id: userId,
        type,
        title,
        description,
        points,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (error) throw new Error('Failed to award reward');

    // Update user points
    await UserService.addPoints(userId, points, `Reward: ${title}`);

    return {
      id: reward.id,
      userId: reward.user_id,
      type: reward.type,
      title: reward.title,
      description: reward.description,
      points: reward.points,
      earnedAt: new Date(reward.earned_at),
      metadata: reward.metadata,
    };
  }

  static async checkAndAwardAchievements(userId: string): Promise<any[]> {
    const supabase = SupabaseService.getClient();
    const newAchievements: any[] = [];

    // Get user data
    const user = await UserService.getUserById(userId);
    const progress = await UserService.getUserProgress(userId);

    // Get existing achievements for user
    const { data: existingAchievements } = await supabase
      .from('achievements')
      .select('id, name, requirement_type, requirement_threshold, points');

    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    const unlockedIds = new Set(userAchievements?.map(ua => ua.achievement_id) || []);

    // Check each achievement
    for (const achievement of existingAchievements || []) {
      if (unlockedIds.has(achievement.id)) continue;

      let shouldUnlock = false;
      
      switch (achievement.requirement_type) {
        case 'sentences_completed':
          shouldUnlock = progress.sentencesCompleted >= achievement.requirement_threshold;
          break;
        case 'stories_completed':
          shouldUnlock = progress.storiesCompleted >= achievement.requirement_threshold;
          break;
        case 'streak_days':
          shouldUnlock = progress.currentStreak >= achievement.requirement_threshold;
          break;
        case 'total_points':
          shouldUnlock = user.totalPoints >= achievement.requirement_threshold;
          break;
      }

      if (shouldUnlock) {
        // Award the achievement
        await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
          });

        // Award reward
        await this.awardReward(
          userId,
          'achievement',
          achievement.name,
          `Achievement unlocked: ${achievement.name}`,
          achievement.points,
          { achievementId: achievement.id }
        );

        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  static async getAchievements() {
    const supabase = SupabaseService.getClient();
    
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('requirement_threshold', { ascending: true });

    if (error) throw new Error('Failed to get achievements');
    return data;
  }

  static async getUserAchievements(userId: string) {
    const supabase = SupabaseService.getClient();
    
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        unlocked_at,
        achievements (*)
      `)
      .eq('user_id', userId);

    if (error) throw new Error('Failed to get user achievements');
    return data;
  }

  static async getLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'all_time' = 'all_time', limit = 20) {
    const supabase = SupabaseService.getClient();
    
    // For MVP, we'll just show all-time leaderboard
    // TODO: Implement time-based filtering with point_transactions
    const { data, error } = await supabase
      .from('users')
      .select('id, username, total_points')
      .order('total_points', { ascending: false })
      .limit(limit);

    if (error) throw new Error('Failed to get leaderboard');

    return {
      period,
      entries: data.map((user, index) => ({
        rank: index + 1,
        userId: user.id,
        username: user.username,
        points: user.total_points,
      })),
      lastUpdated: new Date(),
    };
  }

  static async getUserPointTransactions(userId: string, limit = 50) {
    const supabase = SupabaseService.getClient();
    
    const { data, error } = await supabase
      .from('point_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error('Failed to get point transactions');
    
    return data.map(tx => ({
      id: tx.id,
      userId: tx.user_id,
      amount: tx.amount,
      type: tx.type,
      reason: tx.reason,
      balanceAfter: tx.balance_after,
      timestamp: new Date(tx.created_at),
    }));
  }

  static async initializeAchievements() {
    const supabase = SupabaseService.getClient();
    
    // Insert default achievements if they don't exist
    for (const achievement of ACHIEVEMENTS) {
      const { data: existing } = await supabase
        .from('achievements')
        .select('id')
        .eq('name', achievement.name)
        .single();

      if (!existing) {
        await supabase
          .from('achievements')
          .insert(achievement);
      }
    }
  }
}

