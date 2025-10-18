import { useState, useEffect } from 'react';
import { Leaderboard } from '@shared/types';

export function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all_time'>('weekly');

  useEffect(() => {
    loadLeaderboard();
  }, [period]);

  const loadLeaderboard = async () => {
    try {
      // TODO: Implement API call
      // const data = await rewardApi.getLeaderboard({ period });
      // setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  };

  return (
    <div className="leaderboard-page">
      <h1>🏆 Leaderboard</h1>

      <div className="period-selector">
        {(['daily', 'weekly', 'monthly', 'all_time'] as const).map((p) => (
          <button
            key={p}
            className={period === p ? 'active' : ''}
            onClick={() => setPeriod(p)}
          >
            {p.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="leaderboard-list">
        {leaderboard?.entries.map((entry) => (
          <div key={entry.userId} className="leaderboard-entry">
            <span className="rank">#{entry.rank}</span>
            <span className="username">{entry.username}</span>
            <span className="points">{entry.points} pts</span>
          </div>
        ))}
      </div>
    </div>
  );
}

