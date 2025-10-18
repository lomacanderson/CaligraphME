# Story Generation Feature

## Overview

The Story Generation feature uses Google's Gemini AI to automatically create age-appropriate, educational stories in multiple languages. Users can either generate stories based on predefined parameters or provide custom prompts for personalized content.

## Features

### 1. Automated Story Generation
- **AI-Powered**: Uses Google Gemini 2.5 Flash model for high-quality story generation
- **Multi-Language Support**: Generate stories in Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, and Arabic
- **Difficulty Levels**: Beginner, Intermediate, and Advanced
- **Themed Stories**: Choose from 8 different themes:
  - Adventure 🗺️
  - Animals 🐾
  - Family 👨‍👩‍👧‍👦
  - Friendship 🤝
  - Nature 🌿
  - Food 🍕
  - Sports ⚽
  - School 🏫

### 2. Custom Story Prompts
Users can describe exactly what story they want, and the AI will generate it while:
- Maintaining appropriate language level
- Using suitable vocabulary for learners
- Creating engaging, educational content

### 3. Configurable Parameters
- **Sentence Count**: 5-15 sentences per story
- **Age Range**: Target specific age groups (4-18 years)
- **Language Level**: Automatically adjusted vocabulary and grammar
- **Bilingual Content**: Each sentence includes both target language and English translation

## How It Works

### Backend Flow

1. **User Request**: User submits story generation request via the modal
2. **Validation**: Controller validates required fields (language, level)
3. **AI Generation**: 
   - GeminiService creates a structured prompt
   - Gemini API generates story content in JSON format
   - Response is parsed and validated
4. **Database Storage**:
   - Story metadata saved to `stories` table
   - Individual sentences saved to `story_sentences` table
   - Automatic duration calculation (1.5 min per sentence)
5. **Response**: Complete story with metadata returned to frontend

### Frontend Flow

1. **Modal Display**: User clicks "Generate New Story" button
2. **Form Input**: 
   - Toggle between standard parameters or custom prompt
   - Fill in required fields
   - Submit form
3. **Generation**: Loading state while AI generates story
4. **Update**: New story appears at top of story list
5. **Navigation**: User can click story to view details

## API Usage

### Generate Story Endpoint

```typescript
POST /api/stories/generate

// Request Body
{
  language: "es",                    // Required: Target language code
  level: "beginner",                 // Required: Language proficiency level
  theme: "adventure",                // Optional: Story theme
  sentenceCount: 8,                  // Optional: Number of sentences (default: 8)
  ageRange: {                        // Optional: Target age range
    min: 6,
    max: 12
  },
  customPrompt: "A story about..."   // Optional: Custom story description
}

// Response
{
  story: {
    id: "uuid",
    title: "Story Title",
    language: "es",
    level: "beginner",
    theme: "adventure",
    ageRange: { min: 6, max: 12 },
    estimatedDuration: 12,           // minutes
    createdAt: "2025-10-18T...",
    sentences: [
      {
        id: "uuid",
        storyId: "uuid",
        orderIndex: 0,
        textOriginal: "Había una vez...",
        textTranslated: "Once upon a time...",
        audioUrl: null,
        imageUrl: null
      },
      // ... more sentences
    ]
  },
  metadata: {
    generationTime: 3452,             // milliseconds
    modelUsed: "gemini-2.5-flash"
  }
}
```

### List Stories Endpoint

```typescript
GET /api/stories?language=es&level=beginner&theme=animals

// Response
[
  {
    id: "uuid",
    title: "Story Title",
    language: "es",
    level: "beginner",
    theme: "animals",
    ageRange: { min: 6, max: 12 },
    estimatedDuration: 12,
    createdAt: "2025-10-18T...",
    sentences: []  // Empty in list view for performance
  },
  // ... more stories
]
```

### Get Story by ID

```typescript
GET /api/stories/:id

// Response - Full story with sentences
{
  id: "uuid",
  title: "Story Title",
  // ... same as generation response
  sentences: [/* full sentence array */]
}
```

## Frontend Components

### StoryGenerationModal
Location: `frontend/src/components/story/StoryGenerationModal.tsx`

**Props:**
- `isOpen`: boolean - Modal visibility state
- `onClose`: () => void - Close handler
- `onGenerate`: (request: StoryGenerationRequest) => Promise<void> - Generation handler
- `userLanguage`: SupportedLanguage - Pre-fill user's target language
- `userLevel`: LanguageLevel - Pre-fill user's proficiency level

**Features:**
- Form validation
- Toggle between standard and custom prompt modes
- Loading states during generation
- Error handling and display
- Auto-reset form after successful generation

### StoryListPage
Location: `frontend/src/pages/StoryListPage.tsx`

**Features:**
- Story grid display with cards
- Filter by language, level, and theme
- Generate new story button
- Empty state with call-to-action
- Loading spinner
- Error messages
- Responsive design

## Database Schema

### stories Table
```sql
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  language TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  theme TEXT NOT NULL,
  age_min INTEGER,
  age_max INTEGER,
  estimated_duration INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### story_sentences Table
```sql
CREATE TABLE story_sentences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  text_original TEXT NOT NULL,
  text_translated TEXT NOT NULL,
  audio_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(story_id, order_index)
);
```

## Environment Variables

Required in backend `.env`:

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

## Usage Examples

### Example 1: Standard Story Generation

```typescript
const request: StoryGenerationRequest = {
  language: 'es',
  level: LanguageLevel.BEGINNER,
  theme: StoryTheme.ANIMALS,
  sentenceCount: 8,
  ageRange: { min: 6, max: 10 }
};

const response = await storyApi.generateStory(request);
```

### Example 2: Custom Prompt Story

```typescript
const request: StoryGenerationRequest = {
  language: 'fr',
  level: LanguageLevel.INTERMEDIATE,
  sentenceCount: 10,
  ageRange: { min: 8, max: 12 },
  customPrompt: 'A story about a young chef who discovers a magical recipe book that makes food come to life'
};

const response = await storyApi.generateStory(request);
```

## Best Practices

### For Developers

1. **Error Handling**: Always wrap story generation in try-catch blocks
2. **Loading States**: Show clear feedback during generation (takes 3-10 seconds)
3. **Validation**: Validate user input before sending to API
4. **Caching**: Consider caching generated stories to reduce API costs
5. **Rate Limiting**: Implement rate limits to prevent abuse

### For Content

1. **Age-Appropriate**: Always specify age range for better content
2. **Sentence Count**: Keep stories between 6-10 sentences for optimal learning
3. **Custom Prompts**: Be specific and descriptive for best results
4. **Level Matching**: Ensure story level matches user's proficiency

## Troubleshooting

### Generation Fails

**Problem**: Story generation returns error

**Solutions**:
1. Check Gemini API key is set correctly
2. Verify API quota/billing is active
3. Check network connectivity
4. Review error logs for specific issues

### Invalid JSON Response

**Problem**: AI returns malformed JSON

**Solutions**:
1. GeminiService includes JSON extraction logic for markdown code blocks
2. If persists, adjust prompt to emphasize JSON format
3. Add additional validation/sanitization

### Stories Not Displaying

**Problem**: Generated stories don't show in list

**Solutions**:
1. Check database connection
2. Verify story was saved to database
3. Check frontend API client configuration
4. Review browser console for errors

## Future Enhancements

- [ ] Text-to-speech for story sentences
- [ ] AI-generated illustrations for stories
- [ ] Story difficulty scoring
- [ ] User story ratings and favorites
- [ ] Story recommendations based on user progress
- [ ] Multi-user story sharing
- [ ] Story export (PDF, print)
- [ ] Vocabulary highlighting
- [ ] Interactive story mode with choices

## Related Documentation

- [API Endpoints](./API_ENDPOINTS.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Setup Guide](./SETUP.md)
- [Features Overview](./FEATURES.md)

