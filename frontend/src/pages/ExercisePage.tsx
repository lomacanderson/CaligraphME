import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DrawingCanvas from '@/components/canvas/DrawingCanvas';
import { FeedbackDisplay } from '@/components/exercise/FeedbackDisplay';

export function ExercisePage() {
  const { id } = useParams<{ id: string }>();
  const [canvasData, setCanvasData] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // TODO: Implement submission
      // 1. Get canvas data
      // 2. Submit to API
      // 3. Process OCR
      // 4. Grade
      // 5. Show feedback
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="exercise-page">
      <h1>Write the sentence</h1>
      <p className="instruction">Write: "The cat is sleeping"</p>

      <DrawingCanvas/>

      <div className="actions">
        <button className="btn-secondary">Clear</button>
        <button 
          className="btn-primary" 
          onClick={handleSubmit}
          disabled={isSubmitting || !canvasData}
        >
          {isSubmitting ? 'Processing...' : 'Submit'}
        </button>
      </div>

      {feedback && <FeedbackDisplay feedback={feedback} />}
    </div>
  );
}

