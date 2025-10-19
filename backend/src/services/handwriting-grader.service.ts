import { HandwritingGrade, HandwritingIssue, Feedback, FeedbackLevel } from '@shared/types';

/**
 * Handwriting Grader Service
 * 
 * Grades the quality of handwriting based on:
 * - Legibility (how easy to read)
 * - OCR Confidence (how confident the OCR was)
 * - Penmanship (letter formation, spacing, consistency)
 */
export class HandwritingGraderService {
  static async gradeHandwriting(data: {
    canvasImage: Buffer | string;
    extractedText: string;
    ocrConfidence: number; // 0-1 from AWS Rekognition
  }): Promise<HandwritingGrade> {
    // TODO: Implement handwriting grading logic
    
    try {
      // Calculate confidence score (OCR confidence converted to 0-100)
      const confidenceScore = Math.round(data.ocrConfidence * 100);
      
      // Calculate legibility score based on OCR confidence and text clarity
      const legibilityScore = await this.calculateLegibility(
        data.extractedText,
        data.ocrConfidence
      );
      
      // Calculate penmanship score (letter formation, spacing, etc.)
      const penmanshipScore = await this.analyzePenmanship(
        data.canvasImage,
        data.extractedText
      );
      
      // Overall handwriting score (weighted average)
      const overallScore = this.calculateOverallScore(
        legibilityScore,
        confidenceScore,
        penmanshipScore
      );
      
      // Identify any handwriting issues
      const issues = this.identifyIssues(
        legibilityScore,
        confidenceScore,
        penmanshipScore
      );
      
      // Determine if manual review is needed
      const needsReview = confidenceScore < 60 || legibilityScore < 50;
      
      // Generate feedback
      const feedback = this.generateFeedback(overallScore, issues);
      
      return {
        overallScore,
        legibilityScore,
        confidenceScore,
        penmanshipScore,
        needsReview,
        extractedText: data.extractedText,
        issues,
        feedback,
      };
    } catch (error) {
      console.error('Handwriting grading error:', error);
      throw new Error('Failed to grade handwriting');
    }
  }
  
  private static async calculateLegibility(
    extractedText: string,
    ocrConfidence: number
  ): Promise<number> {
    // TODO: Implement legibility calculation
    // Factors:
    // - OCR confidence
    // - Text clarity
    // - Character recognition rate
    
    // For now, heavily weight OCR confidence
    let score = ocrConfidence * 100;
    
    // Check for garbled text or unusual characters
    const hasGarbledText = /[^\w\s\-',.:;!?áéíóúñü]/i.test(extractedText);
    if (hasGarbledText) {
      score -= 20;
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }
  
  private static async analyzePenmanship(
    _canvasImage: Buffer | string,
    extractedText: string
  ): Promise<number> {
    // TODO: Implement advanced penmanship analysis
    // Could use computer vision to analyze:
    // - Letter formation consistency
    // - Spacing between letters/words
    // - Line straightness
    // - Letter size consistency
    // - Slant consistency
    
    // For MVP, base it on extracted text length vs expected complexity
    // More sophisticated analysis would use CV algorithms
    
    let score = 75; // Default "acceptable" score
    
    // Simple heuristic: longer text with high confidence = better penmanship
    if (extractedText.length > 20) {
      score += 10;
    }
    
    return Math.min(100, score);
  }
  
  private static calculateOverallScore(
    legibility: number,
    confidence: number,
    penmanship: number
  ): number {
    // Weighted average:
    // - Legibility: 40% (most important - can we read it?)
    // - Confidence: 35% (OCR accuracy)
    // - Penmanship: 25% (aesthetic quality)
    
    return Math.round(
      legibility * 0.4 +
      confidence * 0.35 +
      penmanship * 0.25
    );
  }
  
  private static identifyIssues(
    legibility: number,
    confidence: number,
    penmanship: number
  ): HandwritingIssue[] {
    const issues: HandwritingIssue[] = [];
    
    if (confidence < 60) {
      issues.push({
        type: 'illegible',
        description: 'Some letters are hard to read',
        severity: 'high',
      });
    } else if (confidence < 80) {
      issues.push({
        type: 'unclear',
        description: 'Some letters could be clearer',
        severity: 'medium',
      });
    }
    
    if (penmanship < 60) {
      issues.push({
        type: 'spacing',
        description: 'Try to keep consistent spacing between letters',
        severity: 'medium',
      });
    }
    
    if (legibility < 60) {
      issues.push({
        type: 'size',
        description: 'Letters are too small or inconsistent in size',
        severity: 'medium',
      });
    }
    
    return issues;
  }
  
  private static generateFeedback(
    overallScore: number,
    issues: HandwritingIssue[]
  ): Feedback {
    let level: FeedbackLevel;
    let message: string;
    let encouragement: string;
    const tips: string[] = [];
    
    // Determine feedback level
    if (overallScore >= 90) {
      level = FeedbackLevel.EXCELLENT;
      message = '✨ Beautiful handwriting!';
      encouragement = 'Your writing is very clear and neat!';
    } else if (overallScore >= 75) {
      level = FeedbackLevel.GOOD;
      message = '👍 Good handwriting!';
      encouragement = 'Your writing is easy to read!';
    } else if (overallScore >= 60) {
      level = FeedbackLevel.NEEDS_IMPROVEMENT;
      message = '📝 Your handwriting is readable';
      encouragement = 'Keep practicing to make it even clearer!';
    } else {
      level = FeedbackLevel.TRY_AGAIN;
      message = '✍️ Let\'s work on making your writing clearer';
      encouragement = 'Take your time and write carefully!';
    }
    
    // Add tips based on issues
    if (issues.some(i => i.type === 'illegible' || i.type === 'unclear')) {
      tips.push('Write slowly and form each letter carefully');
      tips.push('Make sure letters are clearly separated');
    }
    
    if (issues.some(i => i.type === 'spacing')) {
      tips.push('Keep even spacing between letters and words');
    }
    
    if (issues.some(i => i.type === 'size')) {
      tips.push('Try to make all your letters about the same size');
    }
    
    return {
      message,
      encouragement,
      tips: tips.length > 0 ? tips : undefined,
      level,
    };
  }
}

