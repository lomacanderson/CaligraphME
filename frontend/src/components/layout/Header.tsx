import { Link } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';

export function Header() {
  const { user } = useUserStore();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>CaligraphME</h1>
        </Link>
        
        <nav className="nav">
          <Link to="/stories">Stories</Link>
          <Link to="/progress">Progress</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </nav>

        <div className="user-section">
          {user ? (
            <>
              <span className="points">{user.totalPoints} pts</span>
              <Link to="/profile" className="avatar">
                {user.username[0].toUpperCase()}
              </Link>
            </>
          ) : (
            <button className="login-btn">Login</button>
          )}
        </div>
      </div>
    </header>
  );
}

