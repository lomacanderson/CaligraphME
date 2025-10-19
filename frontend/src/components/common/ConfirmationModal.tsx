import './ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}

export function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-icon">
          {isDangerous ? '⚠️' : '❓'}
        </div>
        
        <h2 className="confirmation-title">{title}</h2>
        <p className="confirmation-message">{message}</p>
        
        <div className="confirmation-actions">
          <button 
            className="btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={isDangerous ? 'btn-danger' : 'btn-primary'}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}


