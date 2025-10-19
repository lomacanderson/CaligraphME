import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { userApi } from '@/services/api/user.api';
import BeginnerBadge from '@/components/icons/Beginner Trophy Badge.png';
import IntermediateBadge from '@/components/icons/Intermediate Trophy Badge.png';
import MasterBadge from '@/components/icons/Master Trophy Badge.png';

export function ProfilePage() {
  const { user, setUser } = useUserStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  if (!user) {
    return (
      <div className="profile-page">
        <div className="empty-state">
          <h2>No user profile found</h2>
          <p>Please complete the setup to continue.</p>
        </div>
      </div>
    );
  }

  const getTrophyBadge = (level: string) => {
    const levelLower = level.toLowerCase();
    if (levelLower === 'beginner') return BeginnerBadge;
    if (levelLower === 'intermediate') return IntermediateBadge;
    if (levelLower === 'advanced' || levelLower === 'master') return MasterBadge;
    return BeginnerBadge;
  };

  const handleResetProfile = () => {
    if (showResetConfirm) {
      setUser(null);
      localStorage.removeItem('caligraph-user');
      window.location.reload();
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  const handleTestCreateUser = async () => {
    setIsCreatingUser(true);
    try {
      const timestamp = Date.now();
      const testUser = {
        email: `test${timestamp}@caligraphme.com`,
        username: `TestUser${timestamp}`,
        firstName: 'Test',
        lastName: 'User',
        age: 25,
        nativeLanguage: 'en',
        targetLanguage: 'es',
        level: 'beginner',
      };

      console.log('🧪 Testing user creation with:', testUser);
      const createdUser = await userApi.createUser(testUser);
      console.log('✅ User created successfully in database:', createdUser);
      
      alert(`Success! User created in database:\n\nID: ${createdUser.id}\nUsername: ${createdUser.username}\nEmail: ${createdUser.email}\nPoints: ${createdUser.totalPoints}\nLevel: ${createdUser.level}`);
    } catch (error: any) {
      console.error('❌ Error creating user:', error);
      alert(`Failed to create user: ${error.message || 'Unknown error'}`);
    } finally {
      setIsCreatingUser(false);
    }
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>

      <div className="profile-card">
        <div className="avatar-large">
          {user.username[0].toUpperCase()}
        </div>
        <h2>{user.username}</h2>
        {user.email && <p>{user.email}</p>}
        {user.age && <p className="age">Age: {user.age}</p>}
      </div>

      <div className="profile-details">
        <h3>Language Settings</h3>
        <div className="setting">
          <label>Native Language:</label>
          <span>{user.nativeLanguage.toUpperCase()}</span>
        </div>
        <div className="setting">
          <label>Learning:</label>
          <span>{user.targetLanguage.toUpperCase()}</span>
        </div>
        <div className="setting">
          <label>Level:</label>
          <span className="level-badge-container">
            <img src={getTrophyBadge(user.level)} alt={`${user.level} badge`} className="trophy-badge" />
            {user.level}
          </span>
        </div>
      </div>

      <div className="profile-stats">
        <h3>Total Points</h3>
        <p className="points-large">{user.totalPoints}</p>
      </div>

      <div className="profile-actions">
        <button 
          className="btn-primary"
          onClick={handleTestCreateUser}
          disabled={isCreatingUser}
        >
          {isCreatingUser ? "Creating..." : "🧪 Test Create User (Backend)"}
        </button>
        
        <button 
          className={showResetConfirm ? "btn-danger" : "btn-secondary"}
          onClick={handleResetProfile}
        >
          {showResetConfirm ? "Click again to confirm reset" : "Reset Profile"}
        </button>
      </div>
    </div>
  );
}

