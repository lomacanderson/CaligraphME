import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Story } from '@shared/types';
import { storyApi } from '@/services/api/story.api';
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

  const startExercise = (sentenceId: string) => {
    // TODO: Create exercise and navigate
    navigate(`/exercise/${sentenceId}`);
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

  return (
    <div className="story-page">
      <div className="story-header">
        <h1>{story.title}</h1>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentSentenceIndex / story.sentences.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="sentence-display">
        <p className="sentence-translated">{currentSentence.textTranslated}</p>
        <button 
          className="btn-primary"
          onClick={() => startExercise(currentSentence.id)}
        >
          Write in {story.language}
        </button>
      </div>

      <div className="navigation">
        <button 
          disabled={currentSentenceIndex === 0}
          onClick={() => setCurrentSentenceIndex(currentSentenceIndex - 1)}
        >
          ← Previous
        </button>
        <span>{currentSentenceIndex + 1} / {story.sentences.length}</span>
        <button 
          disabled={currentSentenceIndex === story.sentences.length - 1}
          onClick={() => setCurrentSentenceIndex(currentSentenceIndex + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

