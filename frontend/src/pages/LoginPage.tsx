import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/auth.service';
import { useUserStore } from '@/stores/userStore';
import logoFull from '@/components/icons/CalligraphMELogoFull-removebg.png';
import './AuthPages.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { profile } = await AuthService.login(formData);
      setUser(profile);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <img src={logoFull} alt="CaligraphME Logo" className="auth-logo" />
          <h1>Welcome Back!</h1>
          <p>Log in to continue your learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoFocus
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="input-field"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <div className="auth-links">
            <p>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

