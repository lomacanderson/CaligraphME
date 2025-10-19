import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { StoryGenerationModal } from '@/components/story/StoryGenerationModal';

export function HomePage() {
  const { user } = useUserStore();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="home-page">
      <section className="hero">
        {user && <h2 className="greeting">Hi {user.username}! 👋</h2>}
        <h1 className="big-title">What do you want to do today?</h1>
      </section>

      <section className="main-options">
        <div className="fun-option-card create-card" onClick={() => setShowModal(true)}>
          <div className="big-emoji">✨</div>
          <h2>Create New Story</h2>
          <div className="action-button">Let's Go!</div>
        </div>

        <Link to="/stories" className="fun-option-card browse-card">
          <div className="big-emoji">📚</div>
          <h2>Practice Stories</h2>
          <div className="action-button">Start Now!</div>
        </Link>
      </section>

      {showModal && (
        <StoryGenerationModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

