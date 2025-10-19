import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';

interface SidebarProps {
  isOpen: boolean;
}

export function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUserStore();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
        
        <div className="sidebar-spacer"></div>
        
        <button 
          onClick={handleLogout}
          className="nav-item logout-button"
          title="Logout"
        >
          <span className="nav-icon">🚪</span>
          <span className="nav-text">Logout</span>
        </button>
      </nav>
    </aside>
  );
}

