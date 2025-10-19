import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Story } from '@shared/types';
import { storyApi } from '@/services/api/story.api';
import { DrawingCanvas } from '@/components/canvas/DrawingCanvas';
import './StoryPage.css';

export function StoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  useEffect(() => {
    if (id) {
      loadStory(id);
    }
  }, [id]);

  const loadStory = async (storyId: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading story with ID:', storyId);
      const data = await storyApi.getStoryById(storyId);
      console.log('Story loaded:', data);
      setStory(data);
    } catch (error: any) {
      console.error('Failed to load story:', error);
      setError(error.message || 'Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (imageData: string) => {
    console.log('Submitting drawing for sentence:', currentSentence.id);
    // TODO: Send to grading API
    
    // Move to next sentence
    if (currentSentenceIndex < story!.sentences.length - 1) {
      setCurrentSentenceIndex(currentSentenceIndex + 1);
    } else {
      // Story completed
      alert('Great job! You completed the story! 🎉');
      navigate('/stories');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading story...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Story</h2>
        <p>{error}</p>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/stories')}
        >
          Back to Stories
        </button>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="error-container">
        <h2>Story Not Found</h2>
        <p>The story you're looking for doesn't exist.</p>
        <button 
          className="btn-primary" 
          onClick={() => navigate('/stories')}
        >
          Back to Stories
        </button>
      </div>
    );
  }

  const currentSentence = story.sentences[currentSentenceIndex];

  const handleSentenceClick = (index: number) => {
    setCurrentSentenceIndex(index);
  };

  return (
    <div className="story-page">
      <div className="story-header">
        <h1 className="story-title">{story.title}</h1>
      </div>

      <div className="story-content">
        <div className="story-book">
          <div className="story-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentSentenceIndex + 1) / story.sentences.length) * 100}%` }}
              />
            </div>
            <span className="progress-text">
              {currentSentenceIndex + 1}/{story.sentences.length}
            </span>
          </div>
          
          <div className="story-text">
            {story.sentences.map((sentence, index) => (
              <span
                key={sentence.id}
                className={`story-sentence ${index === currentSentenceIndex ? 'current-sentence' : ''} ${index < currentSentenceIndex ? 'completed-sentence' : ''}`}
                onClick={() => handleSentenceClick(index)}
              >
                {sentence.textTranslated}
                {index < story.sentences.length - 1 ? ' ' : ''}
              </span>
            ))}
          </div>
        </div>

        <div className="practice-section">
          <DrawingCanvas 
            onSubmit={handleSubmit}
            submitButtonText="Submit & Next →"
          />

          {currentSentenceIndex > 0 && (
            <button 
              className="btn-secondary previous-button"
              onClick={() => setCurrentSentenceIndex(currentSentenceIndex - 1)}
            >
              ← Previous Sentence
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

