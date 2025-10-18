import { useUserStore } from '@/stores/userStore';

export function ProfilePage() {
  const { user } = useUserStore();

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div className="profile-page">
      <h1>Profile</h1>

      <div className="profile-card">
        <div className="avatar-large">
          {user.username[0].toUpperCase()}
        </div>
        <h2>{user.username}</h2>
        <p>{user.email}</p>
      </div>

      <div className="profile-details">
        <h3>Language Settings</h3>
        <div className="setting">
          <label>Native Language:</label>
          <span>{user.nativeLanguage}</span>
        </div>
        <div className="setting">
          <label>Learning:</label>
          <span>{user.targetLanguage}</span>
        </div>
        <div className="setting">
          <label>Level:</label>
          <span>{user.level}</span>
        </div>
      </div>

      <div className="profile-stats">
        <h3>Total Points</h3>
        <p className="points-large">{user.totalPoints}</p>
      </div>
    </div>
  );
}

