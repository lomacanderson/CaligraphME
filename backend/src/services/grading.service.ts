import { HandwritingGraderService } from './handwriting-grader.service.js';
import { TranslationGraderService } from './translation-grader.service.js';
import { SupabaseService } from './database/supabase.service.js';
import { UserService } from './user.service.js';
import { RewardService } from './reward.service.js';

export class GradingService {
  static async gradeSubmission(data: any) {
    try {
      const startTime = Date.now();
      
      // Step 1: Grade handwriting (OCR confidence, legibility, penmanship)
      const handwritingGrade = await HandwritingGraderService.gradeHandwriting({
        canvasImage: data.canvasImage,
        extractedText: data.extractedText,
        ocrConfidence: data.ocrConfidence,
      });

      // Step 2: Grade translation (semantic accuracy, grammar, vocabulary)
      const translationGrade = await TranslationGraderService.gradeTranslation({
        studentText: data.studentText,
        expectedText: data.expectedText,
        sourceLanguage: data.sourceLanguage,
        targetLanguage: data.targetLanguage,
      });

      // Step 3: Calculate overall score (weighted average)
      const overallScore = this.calculateOverallScore(handwritingGrade, translationGrade);

      // Step 4: Generate combined feedback
      const feedback = this.generateCombinedFeedback(handwritingGrade, translationGrade);

      // Step 5: Calculate points earned
      const pointsBreakdown = this.calculatePoints(handwritingGrade, translationGrade);
      
      const processingTime = Date.now() - startTime;

      // Step 6: Save submission to database (if exerciseId and userId provided)
      let savedSubmission = null;
      if (data.exerciseId && data.userId) {
        savedSubmission = await this.saveSubmission({
          exerciseId: data.exerciseId,
          canvasData: data.canvasData,
          extractedText: data.extractedText,
          handwritingGrade,
          translationGrade,
          overallScore,
          feedback,
          pointsBreakdown,
          processingTime,
        });

        // Step 7: Update user points and progress
        const pointsResult = await UserService.addPoints(
          data.userId,
          pointsBreakdown.totalPoints,
          'Exercise submission'
        );

        // Step 8: Update user progress
        const progress = await UserService.getUserProgress(data.userId);
        await UserService.updateUserProgress(data.userId, {
          sentences_completed: progress.sentencesCompleted + 1,
          average_accuracy: this.calculateNewAverage(
            progress.averageAccuracy,
            progress.sentencesCompleted,
            overallScore
          ),
        });

        // Step 9: Check for achievements
        const newAchievements = await RewardService.checkAndAwardAchievements(data.userId);

        // Step 10: Build response with level-up info
        return {
          submissionId: savedSubmission.id,
          handwritingGrade,
          translationGrade,
          overallScore,
          feedback,
          pointsEarned: pointsBreakdown.totalPoints,
          breakdown: pointsBreakdown,
          leveledUp: pointsResult.leveledUp,
          newLevel: pointsResult.newLevel,
          newAchievements,
          user: pointsResult.user,
        };
      }

      // Step 6 (fallback): Build response without saving
      return {
        submissionId: data.submissionId,
        handwritingGrade,
        translationGrade,
        overallScore,
        feedback,
        pointsEarned: pointsBreakdown.totalPoints,
        breakdown: pointsBreakdown,
      };
    } catch (error) {
      console.error('Grading error:', error);
      throw new Error('Failed to grade submission');
    }
  }

  private static async saveSubmission(data: any) {
    const supabase = SupabaseService.getClient();

    const { data: submission, error } = await supabase
      .from('submissions')
      .insert({
        exercise_id: data.exerciseId,
        canvas_data: data.canvasData,
        extracted_text: data.extractedText,
        
        // Handwriting scores
        handwriting_overall_score: data.handwritingGrade.overallScore,
        handwriting_legibility_score: data.handwritingGrade.legibilityScore,
        handwriting_confidence_score: data.handwritingGrade.confidenceScore,
        handwriting_penmanship_score: data.handwritingGrade.penmanshipScore,
        handwriting_needs_review: data.handwritingGrade.needsReview,
        handwriting_issues: data.handwritingGrade.issues,
        
        // Translation scores
        translation_overall_score: data.translationGrade.overallScore,
        translation_is_correct: data.translationGrade.isCorrect,
        translation_semantic_score: data.translationGrade.semanticScore,
        translation_grammar_score: data.translationGrade.grammarScore,
        translation_vocabulary_score: data.translationGrade.vocabularyScore,
        translation_spelling_score: data.translationGrade.spellingScore,
        translation_errors: data.translationGrade.errors,
        
        // Overall
        overall_score: data.overallScore,
        feedback: data.feedback,
        
        // Points
        handwriting_points: data.pointsBreakdown.handwritingPoints,
        translation_points: data.pointsBreakdown.translationPoints,
        bonus_points: data.pointsBreakdown.bonusPoints,
        total_points: data.pointsBreakdown.totalPoints,
        
        processing_time: data.processingTime,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving submission:', error);
      throw new Error('Failed to save submission');
    }

    return submission;
  }

  private static calculateNewAverage(currentAvg: number, count: number, newScore: number): number {
    return ((currentAvg * count) + newScore) / (count + 1);
  }

  private static calculateOverallScore(handwriting: any, translation: any): number {
    // Weighted average: 40% handwriting, 60% translation
    // Translation is more important for language learning
    const handwritingWeight = 0.4;
    const translationWeight = 0.6;
    
    return Math.round(
      handwriting.overallScore * handwritingWeight +
      translation.overallScore * translationWeight
    );
  }

  private static generateCombinedFeedback(handwriting: any, translation: any): any {
    // TODO: Implement combined feedback generation
    return {
      handwritingFeedback: handwriting.feedback,
      translationFeedback: translation.feedback,
      overallMessage: this.getOverallMessage(handwriting, translation),
      encouragement: this.getEncouragement(handwriting, translation),
      nextSteps: this.getNextSteps(handwriting, translation),
    };
  }

  private static calculatePoints(handwriting: any, translation: any): any {
    // Points breakdown:
    // - Handwriting: 0-40 points based on score
    // - Translation: 0-60 points based on score
    // - Bonus: +10 points if both are excellent (>90)
    
    const handwritingPoints = Math.round((handwriting.overallScore / 100) * 40);
    const translationPoints = Math.round((translation.overallScore / 100) * 60);
    
    let bonusPoints = 0;
    if (handwriting.overallScore >= 90 && translation.overallScore >= 90) {
      bonusPoints = 10;
    }
    
    return {
      handwritingPoints,
      translationPoints,
      bonusPoints,
      totalPoints: handwritingPoints + translationPoints + bonusPoints,
    };
  }

  private static getOverallMessage(handwriting: any, translation: any): string {
    const overall = this.calculateOverallScore(handwriting, translation);
    
    if (overall >= 90) return '🌟 Outstanding work! You\'re doing amazing!';
    if (overall >= 80) return '🎉 Great job! Keep up the excellent work!';
    if (overall >= 70) return '👍 Good effort! You\'re making progress!';
    if (overall >= 60) return '📝 Nice try! Keep practicing!';
    return '💪 Don\'t give up! Practice makes perfect!';
  }

  private static getEncouragement(handwriting: any, translation: any): string {
    // Personalized encouragement based on which area is stronger
    if (handwriting.overallScore > translation.overallScore + 10) {
      return 'Your handwriting is great! Now let\'s focus on translation accuracy.';
    } else if (translation.overallScore > handwriting.overallScore + 10) {
      return 'Excellent translation! Try to write more clearly next time.';
    } else {
      return 'You\'re improving in both areas! Keep it up!';
    }
  }

  private static getNextSteps(handwriting: any, translation: any): string[] {
    const steps: string[] = [];
    
    if (handwriting.overallScore < 70) {
      steps.push('💡 Try writing more slowly and carefully');
      steps.push('✍️ Make sure letters are clearly formed');
    }
    
    if (translation.overallScore < 70) {
      steps.push('📚 Review the vocabulary for this lesson');
      steps.push('🔄 Practice similar sentences');
    }
    
    return steps;
  }

  static async compareTexts(_data: any) {
    // TODO: Implement text comparison
    // Use AI to compare semantic similarity
    // Return comparison metrics
    throw new Error('Not implemented');
  }

  static async getGradingResults(_submissionId: string) {
    // TODO: Implement get grading results
    throw new Error('Not implemented');
  }
}

