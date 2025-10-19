import { useState, useEffect } from 'react';
import { StoryTheme, LanguageLevel, SupportedLanguage, StoryGenerationRequest } from '@shared/types';
import { voiceApi, Voice } from '@/services/api/voice.api';
import './StoryGenerationModal.css';

interface StoryGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (request: StoryGenerationRequest) => Promise<void>;
  userLanguage?: SupportedLanguage;
  userLevel?: LanguageLevel;
}

export function StoryGenerationModal({ 
  isOpen, 
  onClose, 
  onGenerate,
  userLanguage,
  userLevel 
}: StoryGenerationModalProps) {
  const [useCustomPrompt, setUseCustomPrompt] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [availableVoices, setAvailableVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [formData, setFormData] = useState<StoryGenerationRequest>({
    language: userLanguage || 'es',
    level: userLevel || LanguageLevel.BEGINNER,
    theme: StoryTheme.ADVENTURE,
    sentenceCount: 8,
    ageRange: { min: 6, max: 12 },
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load voices when modal opens
  useEffect(() => {
    if (isOpen) {
      loadVoices();
    }
  }, [isOpen, formData.level]);

  const loadVoices = async () => {
    try {
      const voices = await voiceApi.getAvailableVoices(formData.level);
      setAvailableVoices(voices);
      if (voices.length > 0 && !selectedVoice) {
        setSelectedVoice(voices[0].id); // Set first voice as default
      }
    } catch (error) {
      console.error('Failed to load voices:', error);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsGenerating(true);

    try {
      const request: StoryGenerationRequest = {
        ...formData,
        customPrompt: useCustomPrompt ? customPrompt : undefined,
        voiceId: selectedVoice,
      };
      
      await onGenerate(request);
      onClose();
      
      // Reset form
      setUseCustomPrompt(false);
      setCustomPrompt('');
      setFormData({
        language: userLanguage || 'es',
        level: userLevel || LanguageLevel.BEGINNER,
        theme: StoryTheme.ADVENTURE,
        sentenceCount: 8,
        ageRange: { min: 6, max: 12 },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to generate story');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: keyof StoryGenerationRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Generate a New Story</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="story-form">
          <div className="form-section">
            <label className="form-toggle">
              <input
                type="checkbox"
                checked={useCustomPrompt}
                onChange={(e) => setUseCustomPrompt(e.target.checked)}
              />
              <span>Use custom prompt</span>
            </label>
          </div>

          {useCustomPrompt ? (
            <div className="form-section">
              <label htmlFor="customPrompt">
                What story would you like to create?
              </label>
              <textarea
                id="customPrompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g., A story about a brave cat who goes on an adventure to find his family..."
                rows={4}
                required={useCustomPrompt}
                className="form-textarea"
              />
              <p className="form-hint">
                Describe the story you want in detail. The AI will generate it based on your description.
              </p>
            </div>
          ) : (
            <>
              <div className="form-section">
                <label htmlFor="theme">Theme</label>
                <select
                  id="theme"
                  value={formData.theme}
                  onChange={(e) => handleInputChange('theme', e.target.value as StoryTheme)}
                  className="form-select"
                >
                  <option value={StoryTheme.ADVENTURE}>Adventure</option>
                  <option value={StoryTheme.ANIMALS}>Animals</option>
                  <option value={StoryTheme.FAMILY}>Family</option>
                  <option value={StoryTheme.FRIENDSHIP}>Friendship</option>
                  <option value={StoryTheme.NATURE}>Nature</option>
                  <option value={StoryTheme.FOOD}>Food</option>
                  <option value={StoryTheme.SPORTS}>Sports</option>
                  <option value={StoryTheme.SCHOOL}>School</option>
                </select>
              </div>
            </>
          )}

          <div className="form-row">
            <div className="form-section">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value as SupportedLanguage)}
                className="form-select"
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
              </select>
            </div>

            <div className="form-section">
              <label htmlFor="level">Level</label>
              <select
                id="level"
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value as LanguageLevel)}
                className="form-select"
              >
                <option value={LanguageLevel.BEGINNER}>Beginner</option>
                <option value={LanguageLevel.INTERMEDIATE}>Intermediate</option>
                <option value={LanguageLevel.ADVANCED}>Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <label htmlFor="voice">Voice for Audio 🔊</label>
            <select
              id="voice"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="form-select"
              disabled={availableVoices.length === 0}
            >
              {availableVoices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name} - {voice.description} ({voice.gender})
                </option>
              ))}
            </select>
            <p className="form-hint">
              Choose the voice that will narrate your story. Recommended voices are shown first.
            </p>
          </div>

          <div className="form-row">
            <div className="form-section">
              <label htmlFor="sentenceCount">Number of Sentences</label>
              <input
                id="sentenceCount"
                type="number"
                min="5"
                max="15"
                value={formData.sentenceCount}
                onChange={(e) => handleInputChange('sentenceCount', parseInt(e.target.value))}
                className="form-input"
              />
            </div>

            <div className="form-section">
              <label htmlFor="ageMin">Age Range</label>
              <div className="age-range-inputs">
                <input
                  id="ageMin"
                  type="number"
                  min="4"
                  max="18"
                  value={formData.ageRange?.min}
                  onChange={(e) => handleInputChange('ageRange', { 
                    ...formData.ageRange, 
                    min: parseInt(e.target.value) 
                  })}
                  className="form-input age-input"
                  placeholder="Min"
                />
                <span>to</span>
                <input
                  id="ageMax"
                  type="number"
                  min="4"
                  max="18"
                  value={formData.ageRange?.max}
                  onChange={(e) => handleInputChange('ageRange', { 
                    ...formData.ageRange, 
                    max: parseInt(e.target.value) 
                  })}
                  className="form-input age-input"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isGenerating || (useCustomPrompt && !customPrompt.trim())}
            >
              {isGenerating ? 'Generating...' : 'Generate Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

