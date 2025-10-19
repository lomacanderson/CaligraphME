import { ReactNode, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const showSidebar = location.pathname !== '/';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="layout">
      <div className="layout-container">
        {showSidebar && (
          <>
            <Sidebar isOpen={isSidebarOpen} />
            <button 
              className={`sidebar-toggle ${isSidebarOpen ? 'open' : 'closed'}`}
              onClick={toggleSidebar}
              aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {isSidebarOpen ? '◀' : '▶'}
            </button>
          </>
        )}
        <main className={`main-content ${!showSidebar ? 'full-width' : ''} ${showSidebar && !isSidebarOpen ? 'sidebar-closed' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

