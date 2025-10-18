import { GoogleGenerativeAI } from '@google/generative-ai';
import { StoryGenerationRequest } from '@shared/types';

interface GeneratedStory {
  title: string;
  sentences: Array<{
    textOriginal: string;
    textTranslated: string;
  }>;
}

export class GeminiService {
  private static genAI: GoogleGenerativeAI | null = null;

  static initialize() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private static ensureInitialized() {
    if (!this.genAI) {
      this.initialize();
    }
  }

  static async generateStory(params: StoryGenerationRequest & { customPrompt?: string }): Promise<GeneratedStory> {
    this.ensureInitialized();
    const model = this.genAI!.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const { language, level, theme, sentenceCount = 8, ageRange, customPrompt } = params;
    
    // Map language codes to full names
    const languageNames: Record<string, string> = {
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German',
      'it': 'Italian',
      'pt': 'Portuguese',
      'zh': 'Chinese',
      'ja': 'Japanese',
      'ko': 'Korean',
      'ar': 'Arabic',
      'en': 'English',
    };

    const targetLanguageName = languageNames[language] || language;
    
    // Build the prompt based on whether custom prompt is provided
    let prompt: string;
    
    if (customPrompt) {
      prompt = `Generate an educational story for language learning based on the following request:

User's Request: "${customPrompt}"

Requirements:
- Language: ${targetLanguageName} (${level} level)
- Number of sentences: ${sentenceCount}
${ageRange ? `- Age range: ${ageRange.min}-${ageRange.max} years old` : ''}
- Make it age-appropriate and engaging
- Use vocabulary suitable for ${level} learners
- Each sentence should be educational yet fun

Generate the story in JSON format with this structure:
{
  "title": "Story Title in English",
  "sentences": [
    {
      "textOriginal": "Sentence in ${targetLanguageName}",
      "textTranslated": "English translation"
    }
  ]
}

The story should have exactly ${sentenceCount} sentences. Make sure the JSON is valid and properly formatted.`;
    } else {
      prompt = `Generate an educational story for children learning ${targetLanguageName}.

Parameters:
- Target language: ${targetLanguageName}
- Proficiency level: ${level}
- Theme: ${theme || 'general'}
- Number of sentences: ${sentenceCount}
${ageRange ? `- Age range: ${ageRange.min}-${ageRange.max} years old` : ''}

Requirements:
1. Create an engaging, age-appropriate story
2. Use vocabulary suitable for ${level} level learners
3. Each sentence should be simple enough to practice handwriting
4. The story should have a clear beginning, middle, and end
5. Include common words and phrases used in everyday conversation
6. Make it fun and memorable for children

Generate the story in JSON format with this structure:
{
  "title": "Story Title in English",
  "sentences": [
    {
      "textOriginal": "Sentence in ${targetLanguageName}",
      "textTranslated": "English translation"
    }
  ]
}

The story should have exactly ${sentenceCount} sentences. Make sure the JSON is valid and properly formatted.`;
    }

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Extract JSON from the response (sometimes it's wrapped in markdown code blocks)
      let jsonText = text.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '').replace(/```\n?$/g, '');
      }
      
      const generatedStory = JSON.parse(jsonText) as GeneratedStory;
      
      // Validate the response
      if (!generatedStory.title || !Array.isArray(generatedStory.sentences)) {
        throw new Error('Invalid story format from AI');
      }
      
      if (generatedStory.sentences.length !== sentenceCount) {
        console.warn(`Expected ${sentenceCount} sentences but got ${generatedStory.sentences.length}`);
      }
      
      return generatedStory;
    } catch (error) {
      console.error('Failed to generate story:', error);
      throw new Error('Failed to generate story with AI');
    }
  }

  static async translateText(text: string, targetLanguage: string) {
    // TODO: Implement translation
    throw new Error('Not implemented');
  }

  static async compareTranslations(text1: string, text2: string, language: string) {
    // TODO: Implement translation comparison
    // Use AI to semantically compare two translations
    throw new Error('Not implemented');
  }

  static async generateFeedback(studentText: string, correctText: string, accuracy: number) {
    // TODO: Generate personalized feedback using AI
    throw new Error('Not implemented');
  }
}

