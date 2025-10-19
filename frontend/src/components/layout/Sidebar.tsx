import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <nav>
        <Link 
          to="/" 
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
          title="Home"
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-text">Home</span>
        </Link>
        <Link 
          to="/writing" 
          className={`nav-item ${isActive('/writing') ? 'active' : ''}`}
          title="Writing"
        >
          <span className="nav-icon">✍️</span>
          <span className="nav-text">Writing</span>
        </Link>
        <Link 
          to="/stories" 
          className={`nav-item ${isActive('/stories') ? 'active' : ''}`}
          title="Stories"
        >
          <span className="nav-icon">📚</span>
          <span className="nav-text">Stories</span>
        </Link>
        <Link 
          to="/rewards" 
          className={`nav-item ${isActive('/rewards') ? 'active' : ''}`}
          title="Rewards"
        >
          <span className="nav-icon">🏆</span>
          <span className="nav-text">Rewards</span>
        </Link>
      </nav>
    </aside>
  );
}

