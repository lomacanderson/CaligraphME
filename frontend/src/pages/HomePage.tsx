import { Link } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import logoFull from '@/components/icons/CalligraphMELogoFull-removebg.png';

export function HomePage() {
  const { user } = useUserStore();

  return (
    <div className="home-page">
      <section className="hero">
        <img src={logoFull} alt="CalligraphME Logo" className="home-logo" />
        {user && <h2 className="greeting">Hi {user.username}! 👋</h2>}
        <h1 className="big-title">Ready to learn and earn?</h1>
        <p className="subtitle">Practice languages while earning real money through our digital allowance system</p>
      </section>

      <section className="main-options">
        <Link to="/stories" className="home-button get-started-button">
          🚀 Get Started
        </Link>
      </section>
    </div>
  );
}

