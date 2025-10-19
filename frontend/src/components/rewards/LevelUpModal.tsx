import './LevelUpModal.css';

interface LevelUpModalProps {
  newLevel: string;
  totalPoints: number;
  onClose: () => void;
}

export function LevelUpModal({ newLevel, totalPoints, onClose }: LevelUpModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="level-up-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confetti">🎉</div>
        <h1>Level Up!</h1>
        <div className="level-badge">{newLevel.toUpperCase()}</div>
        <p className="congrats-message">
          Congratulations! You've reached {newLevel} level with {totalPoints} points!
        </p>
        <p className="motivational-text">
          Keep up the great work! Your dedication to learning is paying off!
        </p>
        <button className="btn-primary" onClick={onClose}>
          Continue Learning
        </button>
      </div>
    </div>
  );
}

