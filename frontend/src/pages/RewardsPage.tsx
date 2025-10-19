import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { rewardApi } from '@/services/api/reward.api';
import { LEVEL_THRESHOLDS } from '@shared/constants';
import './RewardsPage.css';

export function RewardsPage() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<'rewards' | 'achievements' | 'leaderboard'>('rewards');
  const [rewards, setRewards] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [userAchievements, setUserAchievements] = useState<Set<string>>(new Set());
  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Load rewards
      const rewardsData = await rewardApi.getUserRewards(user.id);
      setRewards(rewardsData);

      // Load achievements
      const achievementsData = await rewardApi.getAchievements();
      setAchievements(achievementsData);

      // Load user's unlocked achievements
      const userAchievementsData = await rewardApi.getUserAchievements(user.id);
      const unlockedIds = new Set(userAchievementsData.map((ua: any) => ua.achievements.id));
      setUserAchievements(unlockedIds);

      // Load leaderboard
      const leaderboardData = await rewardApi.getLeaderboard('all_time', 20);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading rewards data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelProgress = () => {
    if (!user) return { current: 0, next: 0, percentage: 0, nextLevel: 'intermediate' };
    
    const points = user.totalPoints;
    
    if (points >= LEVEL_THRESHOLDS.ADVANCED) {
      return { current: points, next: LEVEL_THRESHOLDS.ADVANCED, percentage: 100, nextLevel: 'master' };
    } else if (points >= LEVEL_THRESHOLDS.INTERMEDIATE) {
      const current = points - LEVEL_THRESHOLDS.INTERMEDIATE;
      const needed = LEVEL_THRESHOLDS.ADVANCED - LEVEL_THRESHOLDS.INTERMEDIATE;
      return { 
        current: points, 
        next: LEVEL_THRESHOLDS.ADVANCED, 
        percentage: (current / needed) * 100,
        nextLevel: 'advanced'
      };
    } else {
      const needed = LEVEL_THRESHOLDS.INTERMEDIATE;
      return { 
        current: points, 
        next: LEVEL_THRESHOLDS.INTERMEDIATE, 
        percentage: (points / needed) * 100,
        nextLevel: 'intermediate'
      };
    }
  };

  if (!user) {
    return (
      <div className="rewards-page">
        <div className="empty-state">
          <h2>No user profile found</h2>
          <p>Please complete the setup to continue.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rewards-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading rewards...</p>
        </div>
      </div>
    );
  }

  const progress = getLevelProgress();

  return (
    <div className="rewards-page">
      <h1>Rewards & Achievements</h1>

      {/* Level Progress Card */}
      <div className="level-progress-card">
        <div className="level-header">
          <div>
            <h2>{user.level.toUpperCase()}</h2>
            <p className="level-subtitle">Level Progress</p>
          </div>
          <div className="points-display">
            <span className="points-value">{user.totalPoints}</span>
            <span className="points-label">Total Points</span>
          </div>
        </div>
        
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(progress.percentage, 100)}%` }}
            />
          </div>
          <div className="progress-labels">
            <span>{progress.current} pts</span>
            {progress.nextLevel !== 'master' && (
              <span>Next: {progress.nextLevel} ({progress.next} pts)</span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={activeTab === 'rewards' ? 'active' : ''} 
          onClick={() => setActiveTab('rewards')}
        >
          Recent Rewards
        </button>
        <button 
          className={activeTab === 'achievements' ? 'active' : ''} 
          onClick={() => setActiveTab('achievements')}
        >
          Achievements
        </button>
        <button 
          className={activeTab === 'leaderboard' ? 'active' : ''} 
          onClick={() => setActiveTab('leaderboard')}
        >
          Leaderboard
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'rewards' && (
          <div className="rewards-list">
            {rewards.length === 0 ? (
              <p className="empty-message">No rewards yet. Keep practicing to earn rewards!</p>
            ) : (
              rewards.map((reward) => (
                <div key={reward.id} className="reward-card">
                  <div className="reward-icon">🎉</div>
                  <div className="reward-info">
                    <h3>{reward.title}</h3>
                    <p>{reward.description}</p>
                    <span className="reward-date">
                      {new Date(reward.earnedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="reward-points">+{reward.points} pts</div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-grid">
            {achievements.map((achievement) => {
              const isUnlocked = userAchievements.has(achievement.id);
              return (
                <div 
                  key={achievement.id} 
                  className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                >
                  <div className="achievement-icon">
                    {isUnlocked ? '🏆' : '🔒'}
                  </div>
                  <h3>{achievement.name}</h3>
                  <p>{achievement.description}</p>
                  <div className="achievement-points">
                    {achievement.points} points
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'leaderboard' && leaderboard && (
          <div className="leaderboard-list">
            {leaderboard.entries.map((entry: any) => (
              <div 
                key={entry.userId} 
                className={`leaderboard-entry ${entry.userId === user.id ? 'current-user' : ''}`}
              >
                <div className="rank">#{entry.rank}</div>
                <div className="username">{entry.username}</div>
                <div className="points">{entry.points} pts</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

