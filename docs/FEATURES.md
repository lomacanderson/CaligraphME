# Feature Documentation

## Core Features

### 1. Story Generator 📚

**Purpose**: Generate age-appropriate stories in the target language for children to practice.

**Implementation Status**: ⏳ Pending

**Components**:
- Backend: `StoryService`, `GeminiService`
- Frontend: `StoryListPage`, `StoryPage`
- API: `POST /api/stories/generate`

**User Flow**:
1. System/Admin generates story with parameters (language, level, theme)
2. Gemini API creates story content
3. Story is parsed into individual sentences
4. Each sentence is translated to native language
5. Story is saved to database
6. Students can browse and select stories

**Parameters**:
- Language (target language to learn)
- Level (beginner, intermediate, advanced)
- Theme (animals, nature, family, etc.)
- Age range (5-7, 8-10, 11-13, 14-18)
- Sentence count (3-20)

**Technical Details**:
- Uses Gemini API for generation
- Structured prompt engineering for consistent output
- Translations handled by AI
- Stories stored with metadata for filtering

---

### 2. Interactive Canvas ✍️

**Purpose**: Allow children to write sentences by hand on a digital canvas.

**Implementation Status**: ⏳ Pending

**Components**:
- Frontend: `DrawingCanvas` component
- Features: Drawing, clearing, saving

**User Flow**:
1. Student sees a sentence in their native language
2. Canvas appears for writing translation
3. Student writes with mouse/stylus
4. Student can clear and retry
5. Student submits when ready

**Technical Details**:
- HTML5 Canvas API
- Mouse/touch event handling
- Exports to SVG or PNG format
- Configurable pen size/color

---

### 3. Image-to-Text (OCR) 🔍

**Purpose**: Convert handwritten text on canvas to digital text for grading.

**Implementation Status**: ⏳ Pending

**Components**:
- Backend: `OCRService`, `RekognitionService`
- API: `POST /api/ocr/process`

**User Flow**:
1. Canvas data (image) sent to backend
2. Image uploaded to S3
3. AWS Rekognition processes image
4. Text extracted with confidence score
5. Extracted text returned for grading

**Technical Details**:
- AWS Rekognition DetectText API
- Supports handwriting recognition
- Returns confidence scores per word
- Handles multiple languages

**Challenges**:
- Children's handwriting can be messy
- Need confidence threshold for review
- May require multiple attempts

---

### 4. Grading System 📊

**Purpose**: Compare student's written text with expected translation and provide feedback.

**Implementation Status**: ⏳ Pending

**Components**:
- Backend: `GradingService`, `GeminiService`
- Frontend: `FeedbackDisplay` component
- API: `POST /api/grading/grade`

**User Flow**:
1. Extracted text + expected text sent to grader
2. AI compares translations semantically
3. System calculates accuracy metrics
4. Feedback generated based on performance
5. Points awarded based on accuracy
6. Results displayed to student

**Grading Criteria**:
- Overall similarity (0-100)
- Grammar accuracy
- Vocabulary correctness
- Spelling accuracy
- Semantic meaning match

**Feedback Levels**:
- **Excellent** (95-100%): "Amazing work! Perfect!"
- **Good** (80-94%): "Great job! Keep it up!"
- **Needs Improvement** (60-79%): "Good try! Practice more."
- **Try Again** (<60%): "Let's try again!"

**Technical Details**:
- Uses Gemini API for semantic comparison
- Considers context and meaning, not just exact match
- Provides constructive feedback
- Highlights specific errors

---

### 5. Reward System 🏆

**Purpose**: Motivate students with points, achievements, and leaderboards.

**Implementation Status**: ⏳ Pending

**Components**:
- Backend: `RewardService`
- Frontend: `ProgressPage`, `LeaderboardPage`
- API: `/api/rewards/*`

**Point System**:
- Perfect sentence: 100 points
- Good sentence: 75 points
- Needs improvement: 50 points
- Story completion: 500 points
- Daily login: 50 points
- Streak multiplier: 1.1x per day

**Achievements**:
- First Story Complete
- 10 Stories Complete
- 7-Day Streak
- Perfect Week
- Top 10 Leaderboard
- Language Master (100 perfect sentences)

**Leaderboards**:
- Daily
- Weekly
- Monthly
- All-time

**User Flow**:
1. Student completes action (sentence, story)
2. Points calculated based on performance
3. Points added to user's total
4. Check for achievement unlocks
5. Update leaderboard rankings
6. Show celebration animation

---

### 6. Translation Comparison 🔄

**Purpose**: AI-powered comparison of student's translation with expected translation.

**Implementation Status**: ⏳ Pending

**Components**:
- Backend: `GradingService`, `GeminiService`

**Features**:
- Semantic similarity comparison
- Context-aware evaluation
- Multiple valid translations supported
- Considers regional variations
- Grammar checking
- Vocabulary assessment

**Technical Details**:
- Uses Gemini API for comparison
- Provides similarity percentage
- Identifies specific errors
- Suggests corrections
- Returns detailed metrics

---

## Extension Features (Future)

### 7. User Authentication & Accounts 👤

**Status**: ⏳ Planned

**Features**:
- Email/password registration
- Social login (Google, Apple)
- Parent accounts linked to children
- Multiple child profiles per parent
- Password reset
- Email verification

**Technology**: Supabase Auth

---

### 8. Progress Tracking 📈

**Status**: ⏳ Planned

**Features**:
- Stories completed
- Total sentences written
- Average accuracy over time
- Learning streak tracking
- Time spent learning
- Difficulty progression
- Weak areas identification
- Improvement suggestions

**Visualizations**:
- Line charts for accuracy over time
- Bar charts for stories by theme
- Heatmap for activity calendar
- Progress circles for goals

---

### 9. Curriculum & Learning Path 🎓

**Status**: ⏳ Planned

**Features**:
- Structured learning path
- Progressive difficulty
- Topic-based modules
- Prerequisites and unlocks
- Recommended next stories
- Personalized difficulty adjustment
- Review sessions for weak areas

---

### 10. Parent Dashboard 👨‍👩‍👧‍👦

**Status**: ⏳ Planned

**Features**:
- View child's progress
- Set learning goals
- Time limits and controls
- Weekly reports
- Achievement notifications
- Manage multiple children
- Educational insights

---

### 11. Payments & Subscriptions 💳

**Status**: ⏳ Planned

**Features**:
- Free tier (limited stories/day)
- Premium subscription
- Family plans
- Gift subscriptions
- Payment via Visa/credit card
- Billing management
- Refund handling

**Technology**: Stripe integration

---

### 12. Multi-Language Support 🌍

**Status**: ⏳ Planned

**Languages**:
- Spanish
- French
- German
- Italian
- Portuguese
- Chinese
- Japanese
- Korean
- Arabic

**Features**:
- UI translated to native language
- Story generation in any language
- Translation between any pair
- Cultural content customization

---

### 13. Audio Support 🔊

**Status**: ⏳ Planned

**Features**:
- Text-to-speech for sentences
- Pronunciation guidance
- Audio playback controls
- Native speaker recordings
- Adjustable speech speed

---

### 14. Hints & Help System 💡

**Status**: ⏳ Planned

**Features**:
- Configurable hint level
- Word-by-word translation
- Grammar tips
- Example sentences
- Progressive hints (reveal gradually)
- Penalty for using hints

---

### 15. Offline Mode 📴

**Status**: ⏳ Planned

**Features**:
- Download stories for offline use
- Practice without internet
- Sync when back online
- Cache recent content
- Local storage of progress

---

## Feature Priority

### Phase 1 (MVP)
1. ✅ Story Generator
2. ✅ Interactive Canvas
3. ✅ OCR (Image-to-Text)
4. ✅ Grading System
5. ✅ Basic Reward System

### Phase 2
1. User Authentication
2. Progress Tracking
3. Enhanced Rewards & Achievements
4. Leaderboards

### Phase 3
1. Curriculum & Learning Path
2. Parent Dashboard
3. Payments & Subscriptions

### Phase 4
1. Multi-Language Expansion
2. Audio Support
3. Mobile Apps
4. Offline Mode

