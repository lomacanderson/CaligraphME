import { TranslationGrade, ErrorDetail, ErrorType, Feedback, FeedbackLevel } from '@shared/types';
import { GeminiService } from './ai/gemini.service.js';

/**
 * Translation Grader Service
 * 
 * Grades the accuracy of translation based on:
 * - Semantic accuracy (meaning match)
 * - Grammar correctness
 * - Vocabulary appropriateness
 * - Spelling accuracy
 */
export class TranslationGraderService {
  static async gradeTranslation(data: {
    studentText: string;
    expectedText: string;
    sourceLanguage: string;
    targetLanguage: string;
  }): Promise<TranslationGrade> {
    // TODO: Implement translation grading logic
    
    try {
      // Clean and normalize texts
      const studentTextClean = this.normalizeText(data.studentText);
      const expectedTextClean = this.normalizeText(data.expectedText);
      
      // Calculate semantic similarity using AI
      const semanticScore = await this.calculateSemanticSimilarity(
        studentTextClean,
        expectedTextClean,
        data.targetLanguage
      );
      
      // Check grammar correctness
      const grammarScore = await this.checkGrammar(
        studentTextClean,
        data.targetLanguage
      );
      
      // Check vocabulary appropriateness
      const vocabularyScore = await this.checkVocabulary(
        studentTextClean,
        expectedTextClean,
        data.targetLanguage
      );
      
      // Check spelling
      const { spellingScore, spellingErrors } = await this.checkSpelling(
        studentTextClean,
        data.targetLanguage
      );
      
      // Identify all errors
      const errors = await this.identifyErrors(
        studentTextClean,
        expectedTextClean,
        spellingErrors
      );
      
      // Calculate overall translation score
      const overallScore = this.calculateOverallScore(
        semanticScore,
        grammarScore,
        vocabularyScore,
        spellingScore
      );
      
      // Determine if translation is correct
      const isCorrect = overallScore >= 80; // 80% threshold
      
      // Generate feedback
      const feedback = this.generateFeedback(
        overallScore,
        semanticScore,
        grammarScore,
        vocabularyScore,
        spellingScore,
        errors
      );
      
      return {
        overallScore,
        isCorrect,
        semanticScore,
        grammarScore,
        vocabularyScore,
        spellingScore,
        errors,
        feedback,
      };
    } catch (error) {
      console.error('Translation grading error:', error);
      throw new Error('Failed to grade translation');
    }
  }
  
  private static normalizeText(text: string): string {
    // Normalize whitespace and trim
    return text.trim().replace(/\s+/g, ' ').toLowerCase();
  }
  
  private static async calculateSemanticSimilarity(
    studentText: string,
    expectedText: string,
    language: string
  ): Promise<number> {
    // TODO: Use Gemini API to calculate semantic similarity
    // This compares meaning, not exact wording
    
    // For MVP, use simple word overlap as approximation
    const studentWords = new Set(studentText.split(' '));
    const expectedWords = new Set(expectedText.split(' '));
    
    let matchCount = 0;
    for (const word of studentWords) {
      if (expectedWords.has(word)) {
        matchCount++;
      }
    }
    
    const similarity = (matchCount / Math.max(studentWords.size, expectedWords.size)) * 100;
    
    // TODO: Replace with Gemini API call:
    // const result = await GeminiService.compareTranslations(
    //   studentText,
    //   expectedText,
    //   language
    // );
    
    return Math.round(similarity);
  }
  
  private static async checkGrammar(
    text: string,
    language: string
  ): Promise<number> {
    // TODO: Use Gemini API to check grammar
    // For MVP, return a default score
    
    // Check for basic issues:
    // - Missing punctuation
    // - Capitalization
    
    let score = 90; // Start optimistic
    
    if (!text.match(/[.!?]$/)) {
      score -= 10; // Missing end punctuation
    }
    
    if (text[0] !== text[0].toUpperCase()) {
      score -= 5; // Missing capitalization
    }
    
    return Math.max(0, score);
  }
  
  private static async checkVocabulary(
    studentText: string,
    expectedText: string,
    language: string
  ): Promise<number> {
    // TODO: Check if appropriate vocabulary is used
    // Compare word choices, synonyms acceptable
    
    const studentWords = studentText.split(' ');
    const expectedWords = expectedText.split(' ');
    
    // Simple word overlap check
    let matchCount = 0;
    for (const word of studentWords) {
      if (expectedWords.includes(word)) {
        matchCount++;
      }
    }
    
    const score = (matchCount / expectedWords.length) * 100;
    return Math.round(Math.min(100, score));
  }
  
  private static async checkSpelling(
    text: string,
    language: string
  ): Promise<{ spellingScore: number; spellingErrors: string[] }> {
    // TODO: Use spell checker or Gemini API
    // For MVP, return optimistic results
    
    const spellingScore = 95; // Default
    const spellingErrors: string[] = [];
    
    return { spellingScore, spellingErrors };
  }
  
  private static async identifyErrors(
    studentText: string,
    expectedText: string,
    spellingErrors: string[]
  ): Promise<ErrorDetail[]> {
    // TODO: Implement detailed error identification
    const errors: ErrorDetail[] = [];
    
    // Add spelling errors
    for (const word of spellingErrors) {
      errors.push({
        type: ErrorType.SPELLING,
        position: { start: 0, end: 0 }, // TODO: Find actual position
        expected: '', // TODO: Suggest correction
        actual: word,
        suggestion: '', // TODO: Add suggestion
      });
    }
    
    return errors;
  }
  
  private static calculateOverallScore(
    semantic: number,
    grammar: number,
    vocabulary: number,
    spelling: number
  ): number {
    // Weighted average:
    // - Semantic: 40% (meaning is most important)
    // - Grammar: 25%
    // - Vocabulary: 20%
    // - Spelling: 15%
    
    return Math.round(
      semantic * 0.40 +
      grammar * 0.25 +
      vocabulary * 0.20 +
      spelling * 0.15
    );
  }
  
  private static generateFeedback(
    overallScore: number,
    semanticScore: number,
    grammarScore: number,
    vocabularyScore: number,
    spellingScore: number,
    errors: ErrorDetail[]
  ): Feedback {
    let level: FeedbackLevel;
    let message: string;
    let encouragement: string;
    const tips: string[] = [];
    
    // Determine feedback level
    if (overallScore >= 95) {
      level = FeedbackLevel.EXCELLENT;
      message = '🌟 Perfect translation!';
      encouragement = 'You got it exactly right!';
    } else if (overallScore >= 80) {
      level = FeedbackLevel.GOOD;
      message = '🎉 Great translation!';
      encouragement = 'Your translation captures the meaning well!';
    } else if (overallScore >= 60) {
      level = FeedbackLevel.NEEDS_IMPROVEMENT;
      message = '👍 Good attempt!';
      encouragement = 'You\'re on the right track, keep practicing!';
    } else {
      level = FeedbackLevel.TRY_AGAIN;
      message = '📚 Let\'s try again';
      encouragement = 'Review the sentence and give it another try!';
    }
    
    // Add specific tips based on weakest areas
    const scores = [
      { name: 'meaning', score: semanticScore, tip: 'Focus on the overall meaning of the sentence' },
      { name: 'grammar', score: grammarScore, tip: 'Check your grammar and sentence structure' },
      { name: 'vocabulary', score: vocabularyScore, tip: 'Use the correct vocabulary words' },
      { name: 'spelling', score: spellingScore, tip: 'Double-check your spelling' },
    ];
    
    // Sort by lowest score
    scores.sort((a, b) => a.score - b.score);
    
    // Add tips for the two weakest areas
    if (scores[0].score < 80) {
      tips.push(scores[0].tip);
    }
    if (scores[1].score < 80) {
      tips.push(scores[1].tip);
    }
    
    return {
      message,
      encouragement,
      tips: tips.length > 0 ? tips : undefined,
      level,
    };
  }
}

