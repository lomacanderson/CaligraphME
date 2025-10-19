import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Story, GradingResponse } from '@shared/types';
import { storyApi } from '@/services/api/story.api';
import { exerciseApi } from '@/services/api/exercise.api';
import { gradingApi } from '@/services/api/grading.api';
import { DrawingCanvas } from '@/components/canvas/DrawingCanvas';
import { FeedbackDisplay } from '@/components/exercise/FeedbackDisplay';
import { useUserStore } from '@/stores/userStore';
import './StoryPage.css';

export function StoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, updatePoints } = useUserStore();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [feedback, setFeedback] = useState<GradingResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (imageData: string) => {
    if (!story || !user) {
      alert('Please complete user setup to submit your work.');
      return;
    }
    
    const currentSentence = story.sentences[currentSentenceIndex];
    setIsSubmitting(true);
    setFeedback(null);
    
    try {
      // Step 1: Submit canvas and extract text (with placeholder OCR)
      console.log('Submitting drawing for sentence:', currentSentence.id);
      const submissionResult = await exerciseApi.submitCanvas(currentSentence.id, {
        exerciseId: currentSentence.id,
        canvasData: imageData,
        format: 'png',
        expectedText: currentSentence.textOriginal,
        sourceLanguage: user.nativeLanguage,
        targetLanguage: user.targetLanguage,
      } as any);

      
      console.log('OCR extraction result:', submissionResult);
      
      // Step 2: Grade the submission
      const gradingResult = await gradingApi.gradeSubmission({
        submissionId: submissionResult.submissionId,
        studentText: submissionResult.extractedText,
        extractedText: submissionResult.extractedText, // For handwriting grader
        expectedText: currentSentence.textOriginal,
        sourceLanguage: user.nativeLanguage,
        targetLanguage: user.targetLanguage,
        canvasImage: imageData,
        ocrConfidence: submissionResult.confidence,
      } as any);
      
      console.log('Grading result:', gradingResult);
      
      // Display feedback
      setFeedback(gradingResult);
      
      // Update user points
      if (gradingResult.pointsEarned > 0) {
        updatePoints(gradingResult.pointsEarned);
      }
      
    } catch (error: any) {
      console.error('Failed to submit and grade:', error);
      alert('Failed to submit your work. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleNextSentence = () => {
    setFeedback(null);
    
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
      <div className="story-content">
        <div className="story-book">
          <div className="story-progress">
            <h1 className="story-title">{story.title}</h1>
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
          {!feedback ? (
            <>
              <DrawingCanvas 
                onSubmit={handleSubmit}
                submitButtonText={isSubmitting ? "Grading..." : "Submit & Grade"}
              />

              {currentSentenceIndex > 0 && !isSubmitting && (
                <button 
                  className="btn-secondary previous-button"
                  onClick={() => {
                    setFeedback(null);
                    setCurrentSentenceIndex(currentSentenceIndex - 1);
                  }}
                >
                  ← Previous Sentence
                </button>
              )}
            </>
          ) : (
            <>
              <FeedbackDisplay feedback={feedback} />
              
              <div className="feedback-actions">
                <button 
                  className="btn-primary"
                  onClick={handleNextSentence}
                >
                  {currentSentenceIndex < story.sentences.length - 1 ? 'Next Sentence →' : 'Complete Story 🎉'}
                </button>
                
                <button 
                  className="btn-secondary"
                  onClick={() => setFeedback(null)}
                >
                  Try Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

