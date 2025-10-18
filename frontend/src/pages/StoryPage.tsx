import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Story, StorySentence } from '@shared/types';

export function StoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  useEffect(() => {
    if (id) {
      loadStory(id);
    }
  }, [id]);

  const loadStory = async (storyId: string) => {
    try {
      // TODO: Implement API call
      // const data = await storyApi.getStoryById(storyId);
      // setStory(data);
    } catch (error) {
      console.error('Failed to load story:', error);
    }
  };

  const startExercise = (sentenceId: string) => {
    // TODO: Create exercise and navigate
    navigate(`/exercise/${sentenceId}`);
  };

  if (!story) {
    return <div>Loading...</div>;
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

