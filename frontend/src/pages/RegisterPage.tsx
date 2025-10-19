import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/auth.service';
import { useUserStore } from '@/stores/userStore';
import { LanguageLevel, SupportedLanguage } from '@shared/types';
import logoFull from '@/components/icons/CalligraphMELogoFull-removebg.png';
import './AuthPages.css';

export function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    nativeLanguage: 'en' as SupportedLanguage,
    targetLanguage: 'es' as SupportedLanguage,
    level: LanguageLevel.BEGINNER,
    age: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.username) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    setError(null);
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { profile } = await AuthService.signUp({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        nativeLanguage: formData.nativeLanguage,
        targetLanguage: formData.targetLanguage,
        level: formData.level,
        age: formData.age ? parseInt(formData.age) : undefined,
      });

      setUser(profile);
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <img src={logoFull} alt="CaligraphME Logo" className="auth-logo" />
          <h1>Create Account</h1>
          <p>Start your language learning journey today!</p>
          
          <div className="step-indicator">
            <span className={step >= 1 ? 'active' : ''}>1</span>
            <span className={step >= 2 ? 'active' : ''}>2</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="step-content">
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  autoFocus
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="age">Age (optional)</label>
                <input
                  id="age"
                  type="number"
                  placeholder="Your age"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  min="5"
                  max="100"
                  className="input-field"
                />
              </div>

              <button 
                type="button" 
                className="btn-primary auth-button"
                onClick={handleNext}
              >
                Next →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h2>🌍 Language Preferences</h2>
              
              <div className="form-group">
                <label htmlFor="nativeLanguage">I speak:</label>
                <select
                  id="nativeLanguage"
                  value={formData.nativeLanguage}
                  onChange={(e) => setFormData({ ...formData, nativeLanguage: e.target.value as SupportedLanguage })}
                  className="select-field"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="targetLanguage">I want to learn:</label>
                <select
                  id="targetLanguage"
                  value={formData.targetLanguage}
                  onChange={(e) => setFormData({ ...formData, targetLanguage: e.target.value as SupportedLanguage })}
                  className="select-field"
                >
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="ar">Arabic</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="form-group">
                <label>My level:</label>
                <div className="level-options">
                  <button
                    type="button"
                    className={`level-button ${formData.level === LanguageLevel.BEGINNER ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, level: LanguageLevel.BEGINNER })}
                  >
                    <span className="level-emoji">🌱</span>
                    <span className="level-title">Beginner</span>
                  </button>

                  <button
                    type="button"
                    className={`level-button ${formData.level === LanguageLevel.INTERMEDIATE ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, level: LanguageLevel.INTERMEDIATE })}
                  >
                    <span className="level-emoji">🌿</span>
                    <span className="level-title">Intermediate</span>
                  </button>

                  <button
                    type="button"
                    className={`level-button ${formData.level === LanguageLevel.ADVANCED ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, level: LanguageLevel.ADVANCED })}
                  >
                    <span className="level-emoji">🌳</span>
                    <span className="level-title">Advanced</span>
                  </button>
                </div>
              </div>

              <div className="auth-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
                
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account 🚀'}
                </button>
              </div>
            </div>
          )}

          <div className="auth-links">
            <p>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

