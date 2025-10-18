import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';

export function ProgressPage() {
  const { user } = useUserStore();
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    try {
      // TODO: Implement API call
      // const data = await userApi.getUserProgress(user.id);
      // setProgress(data);
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  if (!user) {
    return <div>Please log in to view your progress</div>;
  }

  return (
    <div className="progress-page">
      <h1>Your Progress</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Stories Completed</h3>
          <p className="stat-value">{progress?.storiesCompleted || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Sentences Written</h3>
          <p className="stat-value">{progress?.sentencesCompleted || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Average Accuracy</h3>
          <p className="stat-value">{progress?.averageAccuracy || 0}%</p>
        </div>
        <div className="stat-card">
          <h3>Current Streak</h3>
          <p className="stat-value">{progress?.currentStreak || 0} days 🔥</p>
        </div>
      </div>

      <div className="achievements">
        <h2>Achievements</h2>
        {/* TODO: Display achievements */}
      </div>
    </div>
  );
}

