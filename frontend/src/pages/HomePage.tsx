import { Link } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';

export function HomePage() {
  const { user } = useUserStore();

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to CaligraphME! 🎨</h1>
        <p>Learn languages through interactive stories and handwriting practice</p>
        {user && (
          <div className="user-welcome">
            <h2>Hi {user.username}! 👋</h2>
            <p>Ready to continue your language learning journey?</p>
          </div>
        )}
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>📖 Interactive Stories</h3>
          <p>Read engaging stories in your target language</p>
        </div>
        <div className="feature-card">
          <h3>✍️ Handwriting Practice</h3>
          <p>Write sentences and get instant feedback</p>
        </div>
        <div className="feature-card">
          <h3>🏆 Earn Rewards</h3>
          <p>Track progress and compete with others</p>
        </div>
      </section>

      <section className="cta">
        <Link to="/stories" className="btn-primary">
          Start Learning
        </Link>
      </section>
    </div>
  );
}

