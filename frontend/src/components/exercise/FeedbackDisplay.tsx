import { useState } from 'react';
import { GradingResponse } from '@shared/types';

interface FeedbackDisplayProps {
  feedback: GradingResponse;
}

function StarRating({ score }: { score: number }) {
  const stars = [];
  const fullStars = Math.floor(score);
  const hasHalfStar = score % 1 >= 0.25 && score % 1 < 0.75;
  const hasThreeQuarterStar = score % 1 >= 0.75;
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full-${i}`} className="star star-full">★</span>);
  }
  
  // Add half or three-quarter star
  if (hasThreeQuarterStar && fullStars < 5) {
    stars.push(<span key="three-quarter" className="star star-three-quarter">★</span>);
  } else if (hasHalfStar && fullStars < 5) {
    stars.push(<span key="half" className="star star-half">★</span>);
  }
  
  // Add empty stars
  const emptyStars = 5 - Math.ceil(score);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`} className="star star-empty">☆</span>);
  }
  
  return <div className="star-rating">{stars}</div>;
}

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  const [showHandwritingDetails, setShowHandwritingDetails] = useState(false);
  const [showTranslationDetails, setShowTranslationDetails] = useState(false);
  const [showPointsBreakdown, setShowPointsBreakdown] = useState(false);

  return (
    <div className="feedback-display">
      {/* Overall Score Header */}
      <div className="feedback-header">
        <h2>{feedback.feedback.overallMessage}</h2>
        <div className="overall-score">
          <StarRating score={feedback.overallScore} />
          <div className="score-circle">
            <span className="score-value">{feedback.overallScore}</span>
            <span className="score-label">/ 5</span>
          </div>
        </div>
      </div>

      <p className="overall-encouragement">{feedback.feedback.encouragement}</p>

      {/* Two-Column Layout for Handwriting and Translation */}
      <div className="grades-container">
        {/* Handwriting Grade */}
        <div className="grade-card handwriting-card">
          <div className="card-header">
            <h3>✍️ Handwriting</h3>
            <span className="card-score">{feedback.handwritingGrade.overallScore}/100</span>
          </div>
          
          <div className="feedback-section">
            <p className="feedback-message">{feedback.feedback.handwritingFeedback.message}</p>
          </div>

          <button 
            className="toggle-details-btn"
            onClick={() => setShowHandwritingDetails(!showHandwritingDetails)}
          >
            {showHandwritingDetails ? '▼ Hide Details' : '▶ Show Details'}
          </button>

          {showHandwritingDetails && (
            <div className="details-content">
              <div className="score-breakdown">
                <h4>Score Breakdown</h4>
                <div className="score-item">
                  <span className="score-label">Legibility:</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${feedback.handwritingGrade.legibilityScore}%` }}
                    />
                  </div>
                  <span className="score-number">{feedback.handwritingGrade.legibilityScore}</span>
                </div>
                
                <div className="score-item">
                  <span className="score-label">Confidence:</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${feedback.handwritingGrade.confidenceScore}%` }}
                    />
                  </div>
                  <span className="score-number">{feedback.handwritingGrade.confidenceScore}</span>
                </div>
                
                <div className="score-item">
                  <span className="score-label">Penmanship:</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${feedback.handwritingGrade.penmanshipScore}%` }}
                    />
                  </div>
                  <span className="score-number">{feedback.handwritingGrade.penmanshipScore}</span>
                </div>
              </div>

              <p className="encouragement">{feedback.feedback.handwritingFeedback.encouragement}</p>
              
              {feedback.handwritingGrade.issues.length > 0 && (
                <div className="issues">
                  <h4>Areas to improve:</h4>
                  <ul>
                    {feedback.handwritingGrade.issues.map((issue, index) => (
                      <li key={index} className={`severity-${issue.severity}`}>
                        {issue.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.feedback.handwritingFeedback.tips && (
                <div className="tips">
                  <h4>💡 Tips:</h4>
                  <ul>
                    {feedback.feedback.handwritingFeedback.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Translation Grade */}
        <div className="grade-card translation-card">
          <div className="card-header">
            <h3>🌍 Translation</h3>
            <span className="card-score">{feedback.translationGrade.overallScore}/100</span>
          </div>
          
          <div className="feedback-section">
            <p className="feedback-message">{feedback.feedback.translationFeedback.message}</p>
          </div>

          <button 
            className="toggle-details-btn"
            onClick={() => setShowTranslationDetails(!showTranslationDetails)}
          >
            {showTranslationDetails ? '▼ Hide Details' : '▶ Show Details'}
          </button>

          {showTranslationDetails && (
            <div className="details-content">
              <div className="score-breakdown">
                <h4>Score Breakdown</h4>
                <div className="score-item">
                  <span className="score-label">Meaning:</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${feedback.translationGrade.semanticScore}%` }}
                    />
                  </div>
                  <span className="score-number">{feedback.translationGrade.semanticScore}</span>
                </div>
                
                <div className="score-item">
                  <span className="score-label">Grammar:</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${feedback.translationGrade.grammarScore}%` }}
                    />
                  </div>
                  <span className="score-number">{feedback.translationGrade.grammarScore}</span>
                </div>
                
                <div className="score-item">
                  <span className="score-label">Vocabulary:</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${feedback.translationGrade.vocabularyScore}%` }}
                    />
                  </div>
                  <span className="score-number">{feedback.translationGrade.vocabularyScore}</span>
                </div>
                
                <div className="score-item">
                  <span className="score-label">Spelling:</span>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${feedback.translationGrade.spellingScore}%` }}
                    />
                  </div>
                  <span className="score-number">{feedback.translationGrade.spellingScore}</span>
                </div>
              </div>

              <p className="encouragement">{feedback.feedback.translationFeedback.encouragement}</p>
              
              {feedback.translationGrade.errors.length > 0 && (
                <div className="errors">
                  <h4>Errors found:</h4>
                  <ul>
                    {feedback.translationGrade.errors.map((error, index) => (
                      <li key={index}>
                        <strong>{error.type}:</strong> {error.suggestion || error.expected}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.feedback.translationFeedback.tips && (
                <div className="tips">
                  <h4>💡 Tips:</h4>
                  <ul>
                    {feedback.feedback.translationFeedback.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Points Earned */}
      <div className="points-earned">
        <div className="points-header" onClick={() => setShowPointsBreakdown(!showPointsBreakdown)}>
          <h3>🎉 Points Earned: +{feedback.pointsEarned}</h3>
          <button className="toggle-details-btn inline">
            {showPointsBreakdown ? '▼' : '▶'}
          </button>
        </div>
        
        {showPointsBreakdown && (
          <div className="points-breakdown">
            <div className="points-item">
              <span>Handwriting:</span>
              <span>+{feedback.breakdown.handwritingPoints}</span>
            </div>
            <div className="points-item">
              <span>Translation:</span>
              <span>+{feedback.breakdown.translationPoints}</span>
            </div>
            {feedback.breakdown.bonusPoints > 0 && (
              <div className="points-item bonus">
                <span>🌟 Bonus (Both Excellent!):</span>
                <span>+{feedback.breakdown.bonusPoints}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Next Steps */}
      {feedback.feedback.nextSteps && feedback.feedback.nextSteps.length > 0 && (
        <div className="next-steps">
          <h3>📋 What to focus on next:</h3>
          <ul>
            {feedback.feedback.nextSteps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

