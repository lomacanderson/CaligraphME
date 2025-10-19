import { useState } from 'react';
import { User, LanguageLevel, SupportedLanguage } from '@shared/types';
import { useUserStore } from '@/stores/userStore';
import './UserSetupModal.css';

interface UserSetupModalProps {
  onComplete: () => void;
}

export function UserSetupModal({ onComplete }: UserSetupModalProps) {
  const { setUser } = useUserStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    nativeLanguage: 'en' as SupportedLanguage,
    targetLanguage: 'es' as SupportedLanguage,
    level: LanguageLevel.BEGINNER,
    age: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create user object
    const newUser: User = {
      id: crypto.randomUUID(),
      username: formData.username || 'Student',
      email: formData.email || 'student@example.com',
      nativeLanguage: formData.nativeLanguage,
      targetLanguage: formData.targetLanguage,
      level: formData.level,
      totalPoints: 0,
      age: formData.age ? parseInt(formData.age) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to localStorage for persistence
    localStorage.setItem('caligraph-user', JSON.stringify(newUser));
    
    // Set in store
    setUser(newUser);
    
    // Complete setup
    onComplete();
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="modal-overlay">
      <div className="user-setup-modal">
        <div className="modal-header">
          <h1>Welcome to CaligraphME! 🎉</h1>
          <p>Let's set up your learning profile</p>
          <div className="step-indicator">
            <span className={step >= 1 ? 'active' : ''}>1</span>
            <span className={step >= 2 ? 'active' : ''}>2</span>
            <span className={step >= 3 ? 'active' : ''}>3</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="step-content">
              <h2>👋 What's your name?</h2>
              <input
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="input-field"
                autoFocus
              />
              
              <input
                type="email"
                placeholder="Email (optional)"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
              />

              <input
                type="number"
                placeholder="Age (optional)"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="input-field"
                min="5"
                max="100"
              />
            </div>
          )}

          {step === 2 && (
            <div className="step-content">
              <h2>🌍 Which languages?</h2>
              
              <div className="language-select">
                <label>I speak:</label>
                <select
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

              <div className="language-select">
                <label>I want to learn:</label>
                <select
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
            </div>
          )}

          {step === 3 && (
            <div className="step-content">
              <h2>📚 What's your level?</h2>
              
              <div className="level-options">
                <button
                  type="button"
                  className={`level-button ${formData.level === LanguageLevel.BEGINNER ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, level: LanguageLevel.BEGINNER })}
                >
                  <span className="level-emoji">🌱</span>
                  <span className="level-title">Beginner</span>
                  <span className="level-description">Just starting out</span>
                </button>

                <button
                  type="button"
                  className={`level-button ${formData.level === LanguageLevel.INTERMEDIATE ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, level: LanguageLevel.INTERMEDIATE })}
                >
                  <span className="level-emoji">🌿</span>
                  <span className="level-title">Intermediate</span>
                  <span className="level-description">Know the basics</span>
                </button>

                <button
                  type="button"
                  className={`level-button ${formData.level === LanguageLevel.ADVANCED ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, level: LanguageLevel.ADVANCED })}
                >
                  <span className="level-emoji">🌳</span>
                  <span className="level-title">Advanced</span>
                  <span className="level-description">Pretty fluent</span>
                </button>
              </div>
            </div>
          )}

          <div className="modal-actions">
            {step > 1 && (
              <button type="button" className="btn-secondary" onClick={prevStep}>
                ← Back
              </button>
            )}
            
            {step < 3 ? (
              <button type="button" className="btn-primary" onClick={nextStep}>
                Next →
              </button>
            ) : (
              <button type="submit" className="btn-primary">
                Start Learning! 🚀
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

