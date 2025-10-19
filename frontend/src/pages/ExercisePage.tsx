import { useState } from 'react';
import { DrawingCanvas } from '@/components/canvas/DrawingCanvas';
import { FeedbackDisplay } from '@/components/exercise/FeedbackDisplay';

export function ExercisePage() {
  const [, setCanvasData] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback] = useState<any>(null);

  const handleSubmit = async (imageData: string, extractedText?: string, confidence?: number) => {
    try {
      setIsSubmitting(true);
      setCanvasData(imageData);
      console.log('📝 Canvas submitted');
      console.log('🔍 OCR extracted:', extractedText || '(none)');
      console.log('📊 Confidence:', confidence || 'N/A');
      // TODO: Implement submission
      // 1. Submit canvas to API with real OCR text
      // 2. Grade using the extracted text
      // 3. Show feedback
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

      <DrawingCanvas 
        onSubmit={handleSubmit}
        submitButtonText={isSubmitting ? 'Processing...' : 'Submit'}
      />

      {feedback && <FeedbackDisplay feedback={feedback} />}
    </div>
  );
}

