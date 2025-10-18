import { GradingResponse } from '@shared/types';

interface FeedbackDisplayProps {
  feedback: GradingResponse;
}

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  return (
    <div className="feedback-display">
      {/* Overall Score Header */}
      <div className="feedback-header">
        <h2>{feedback.feedback.overallMessage}</h2>
        <div className="overall-score">
          <div className="score-circle">
            <span className="score-value">{feedback.overallScore}</span>
            <span className="score-label">/ 100</span>
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
          
          <div className="score-breakdown">
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

          <div className="feedback-section">
            <p className="feedback-message">{feedback.feedback.handwritingFeedback.message}</p>
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
        </div>

        {/* Translation Grade */}
        <div className="grade-card translation-card">
          <div className="card-header">
            <h3>🌍 Translation</h3>
            <span className="card-score">{feedback.translationGrade.overallScore}/100</span>
          </div>
          
          <div className="score-breakdown">
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

          <div className="feedback-section">
            <p className="feedback-message">{feedback.feedback.translationFeedback.message}</p>
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
        </div>
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

      {/* Points Breakdown */}
      <div className="points-earned">
        <div className="points-header">
          <h3>Points Earned</h3>
          <span className="total-points">+{feedback.pointsEarned}</span>
        </div>
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
      </div>
    </div>
  );
}

