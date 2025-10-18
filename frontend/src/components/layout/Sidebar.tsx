import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="sidebar">
      <nav>
        <Link 
          to="/" 
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
        >
          🏠 Home
        </Link>
        <Link 
          to="/writing" 
          className={`nav-item ${isActive('/writing') ? 'active' : ''}`}
        >
          ✍️ Writing
        </Link>
        <Link 
          to="/stories" 
          className={`nav-item ${isActive('/stories') ? 'active' : ''}`}
        >
          📚 Stories
        </Link>
        <Link 
          to="/progress" 
          className={`nav-item ${isActive('/progress') ? 'active' : ''}`}
        >
          📊 Progress
        </Link>
        <Link 
          to="/leaderboard" 
          className={`nav-item ${isActive('/leaderboard') ? 'active' : ''}`}
        >
          🏆 Leaderboard
        </Link>
      </nav>
    </aside>
  );
}

