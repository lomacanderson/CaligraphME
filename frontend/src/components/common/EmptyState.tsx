import logo from '@/components/icons/Logo-removebg.png';
import './EmptyState.css';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  showLogo?: boolean;
}

export function EmptyState({ 
  icon, 
  title, 
  message, 
  action, 
  showLogo = true 
}: EmptyStateProps) {
  return (
    <div className="empty-state-container">
      {showLogo && (
        <div className="empty-state-logo">
          <img src={logo} alt="CaligraphME" />
        </div>
      )}
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h2 className="empty-state-title">{title}</h2>
      {message && <p className="empty-state-message">{message}</p>}
      {action && (
        <button className="btn-primary empty-state-action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}

