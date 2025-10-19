import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Story, GradingResponse } from '@shared/types';
import { storyApi } from '@/services/api/story.api';
import { exerciseApi } from '@/services/api/exercise.api';
import { gradingApi } from '@/services/api/grading.api';
import { DrawingCanvas } from '@/components/canvas/DrawingCanvas';
import { FeedbackDisplay } from '@/components/exercise/FeedbackDisplay';
import { LevelUpModal } from '@/components/rewards/LevelUpModal';
import { useUserStore } from '@/stores/userStore';
import './StoryPage.css';

export function StoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, updatePoints, setUser } = useUserStore();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [feedback, setFeedback] = useState<GradingResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ newLevel: string; totalPoints: number } | null>(null);
  const [completedSentences, setCompletedSentences] = useState<Map<number, string>>(new Map());
  const [currentSubmissionImage, setCurrentSubmissionImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadStory(id);
    }
  }, [id]);

  const loadStory = async (storyId: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('📖 Loading story with ID:', storyId);
      const data = await storyApi.getStoryById(storyId);
      console.log('✅ Story loaded successfully:', data.title);
      console.log('📝 Total sentences:', data.sentences.length);
      
      // Log audio availability
      const sentencesWithAudio = data.sentences.filter((s: any) => s.audioUrl);
      console.log(`🎵 Audio available for ${sentencesWithAudio.length}/${data.sentences.length} sentences`);
      
      data.sentences.forEach((sentence: any, index: number) => {
        console.log(`  Sentence ${index + 1}:`, {
          text: sentence.textOriginal,
          hasAudio: !!sentence.audioUrl,
          audioUrl: sentence.audioUrl || 'not generated yet'
        });
      });
      
      setStory(data);
    } catch (error: any) {
      console.error('❌ Failed to load story:', error);
      setError(error.message || 'Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (imageData: string, extractedText?: string, confidence?: number) => {
    if (!story || !user) {
      alert('Please complete user setup to submit your work.');
      return;
    }
    
    const currentSentence = story.sentences[currentSentenceIndex];
    setIsSubmitting(true);
    setFeedback(null);
    setCurrentSubmissionImage(imageData); // Store the image for this submission
    
    try {
      console.log('📝 Submitting drawing for sentence:', currentSentence.id);
      console.log('🔍 OCR extracted text:', extractedText || '(none)');
      console.log('📊 OCR confidence:', confidence || 'N/A');
      
      // Use real OCR text from DrawingCanvas (Tesseract/Handwriting API)
      const ocrText = extractedText || '';
      const ocrConfidence = confidence || 0.5;
      
      // Step 1: Submit canvas with REAL OCR text (no backend OCR needed!)
      const submissionResult = await exerciseApi.submitCanvas(currentSentence.id, {
        exerciseId: currentSentence.id,
        canvasData: imageData,
        format: 'png',
        expectedText: currentSentence.textOriginal,
        sourceLanguage: user.nativeLanguage,
        targetLanguage: user.targetLanguage,
        extractedText: ocrText,  // Real OCR from frontend!
        ocrConfidence: ocrConfidence,
      } as any);

      
      console.log('✅ Submission result:', submissionResult);
      
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
      
      // Check for level up
      if (gradingResult.leveledUp && gradingResult.newLevel) {
        setLevelUpData({
          newLevel: gradingResult.newLevel,
          totalPoints: gradingResult.user?.totalPoints || user.totalPoints + gradingResult.pointsEarned,
        });
        setShowLevelUp(true);
        
        // Update user with new level
        if (gradingResult.user) {
          setUser(gradingResult.user);
        }
      }
      
    } catch (error: any) {
      console.error('Failed to submit and grade:', error);
      alert('Failed to submit your work. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleNextSentence = () => {
    // Save the current sentence's image before moving to next
    if (currentSubmissionImage) {
      setCompletedSentences(prev => new Map(prev).set(currentSentenceIndex, currentSubmissionImage));
    }
    
    setFeedback(null);
    setCurrentSubmissionImage(null);
    
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

  const handleSentenceClick = (index: number) => {
    console.log('📍 Sentence clicked:', index);
    setCurrentSentenceIndex(index);
    
    // Play audio if available
    const sentence = story!.sentences[index];
    console.log('🎵 Sentence data:', {
      id: sentence.id,
      text: sentence.textOriginal,
      audioUrl: sentence.audioUrl,
      hasAudio: !!sentence.audioUrl
    });
    
    if (sentence.audioUrl) {
      const audioUrl = `http://localhost:3000${sentence.audioUrl}`;
      console.log('🔊 Playing audio from:', audioUrl);
      const audio = new Audio(audioUrl);
      
      audio.addEventListener('loadstart', () => {
        console.log('⏳ Audio loading started...');
      });
      
      audio.addEventListener('canplay', () => {
        console.log('✅ Audio loaded successfully, ready to play');
      });
      
      audio.addEventListener('playing', () => {
        console.log('▶️ Audio is now playing');
      });
      
      audio.addEventListener('ended', () => {
        console.log('⏹️ Audio playback finished');
      });
      
      audio.play()
        .then(() => {
          console.log('✅ Audio playback started successfully');
        })
        .catch(err => {
          console.error('❌ Error playing audio:', err);
          console.error('Audio URL that failed:', audioUrl);
        });
    } else {
      console.log('⚠️ No audio available for this sentence yet');
    }
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
            {story.sentences.map((sentence, index) => {
              const isCompleted = completedSentences.has(index);
              const imageData = completedSentences.get(index);
              
              return isCompleted && imageData ? (
                <span key={sentence.id} className="story-sentence-image-wrapper">
                  <img 
                    src={imageData} 
                    alt={`Your handwriting for: ${sentence.textTranslated}`}
                    className="story-sentence-image"
                    onClick={() => handleSentenceClick(index)}
                    title="Click to hear pronunciation 🔊"
                  />
                </span>
              ) : (
                <span
                  key={sentence.id}
                  className={`story-sentence ${index === currentSentenceIndex ? 'current-sentence' : ''} ${index < currentSentenceIndex ? 'completed-sentence' : ''} ${sentence.audioUrl ? 'has-audio' : ''}`}
                  onClick={() => handleSentenceClick(index)}
                  title={sentence.audioUrl ? 'Click to hear pronunciation 🔊' : undefined}
                >
                  {sentence.audioUrl && <span className="audio-icon">🔊 </span>}
                  {sentence.textTranslated}
                  {index < story.sentences.length - 1 ? ' ' : ''}
                </span>
              );
            })}
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
      
      {/* Level Up Modal */}
      {showLevelUp && levelUpData && (
        <LevelUpModal
          newLevel={levelUpData.newLevel}
          totalPoints={levelUpData.totalPoints}
          onClose={() => setShowLevelUp(false)}
        />
      )}
    </div>
  );
}

