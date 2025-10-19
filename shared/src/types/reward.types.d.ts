export interface Reward {
    id: string;
    userId: string;
    type: RewardType;
    title: string;
    description: string;
    points: number;
    earnedAt: Date;
    metadata?: Record<string, any>;
}
export declare enum RewardType {
    STORY_COMPLETED = "story_completed",
    PERFECT_SENTENCE = "perfect_sentence",
    STREAK_MILESTONE = "streak_milestone",
    LEVEL_UP = "level_up",
    ACHIEVEMENT = "achievement",
    DAILY_CHALLENGE = "daily_challenge"
}
export interface Achievement {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    points: number;
    requirement: AchievementRequirement;
    unlockedBy: string[];
}
export interface AchievementRequirement {
    type: 'stories_completed' | 'perfect_sentences' | 'streak_days' | 'total_points';
    threshold: number;
}
export interface PointTransaction {
    id: string;
    userId: string;
    amount: number;
    type: 'earned' | 'spent' | 'bonus';
    reason: string;
    timestamp: Date;
    balanceAfter: number;
}
export interface Leaderboard {
    period: 'daily' | 'weekly' | 'monthly' | 'all_time';
    entries: LeaderboardEntry[];
    lastUpdated: Date;
}
export interface LeaderboardEntry {
    rank: number;
    userId: string;
    username: string;
    points: number;
    avatar?: string;
}
//# sourceMappingURL=reward.types.d.ts.map