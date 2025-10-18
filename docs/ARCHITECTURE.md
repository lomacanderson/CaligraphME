# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (React)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Pages   │  │Components│  │  Stores  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                     ↓                                    │
│              ┌──────────────┐                           │
│              │ API Services │                           │
│              └──────────────┘                           │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/REST
                      ↓
┌─────────────────────────────────────────────────────────┐
│                   Backend (Node.js)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │Controllers│→│ Services │→│  Models  │             │
│  └──────────┘  └──────────┘  └──────────┘             │
│                      ↓                                   │
│        ┌──────────────┬──────────────┐                  │
│        ↓              ↓              ↓                  │
│   ┌────────┐    ┌─────────┐   ┌──────────┐            │
│   │ Gemini │    │Rekognit.│   │ Supabase │            │
│   │  API   │    │   API   │   │    DB    │            │
│   └────────┘    └─────────┘   └──────────┘            │
└─────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Directory Structure
```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── layout/      # Layout components (Header, Sidebar)
│   │   ├── canvas/      # Canvas/drawing components
│   │   └── exercise/    # Exercise-related components
│   ├── pages/           # Page components (routes)
│   ├── services/        # API service layer
│   │   └── api/         # API client and endpoints
│   ├── stores/          # State management (Zustand)
│   ├── styles/          # Global styles
│   └── types/           # TypeScript type definitions
```

### Key Technologies
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool
- **React Router**: Routing
- **Zustand**: State management
- **Axios**: HTTP client

### Component Hierarchy
```
App
├── Layout
│   ├── Header
│   ├── Sidebar
│   └── Main Content
│       └── Page Components
│           ├── HomePage
│           ├── StoryListPage
│           ├── StoryPage
│           ├── ExercisePage
│           ├── ProgressPage
│           ├── LeaderboardPage
│           └── ProfilePage
```

## Backend Architecture

### Directory Structure
```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   │   ├── ai/         # AI service integrations
│   │   └── database/   # Database services
│   ├── routes/         # API route definitions
│   ├── middleware/     # Express middleware
│   └── types/          # TypeScript types
```

### Key Technologies
- **Node.js**: Runtime
- **Express**: Web framework
- **TypeScript**: Type safety
- **Supabase**: Database, auth, storage
- **AWS Rekognition**: OCR
- **Gemini API**: Story generation, translation

### Request Flow
```
HTTP Request
    ↓
Router
    ↓
Middleware (logging, auth, validation)
    ↓
Controller (request handling)
    ↓
Service Layer (business logic)
    ↓
External Services (DB, APIs)
    ↓
Response
```

## Shared Types

The `shared/` directory contains:
- TypeScript interfaces and types
- Zod validation schemas
- Constants and enums
- Utilities used by both frontend and backend

## Core Features Flow

### 1. Story Generation Flow
```
User Request
    ↓
Frontend: StoryListPage → storyApi.generateStory()
    ↓
Backend: POST /api/stories/generate
    ↓
StoryController → StoryService
    ↓
GeminiService: Generate story with AI
    ↓
SupabaseService: Save to database
    ↓
Response: Story object
    ↓
Frontend: Display story
```

### 2. Exercise Submission Flow
```
User writes on canvas
    ↓
Frontend: DrawingCanvas saves canvas data
    ↓
User clicks Submit
    ↓
Frontend: exerciseApi.submitCanvas()
    ↓
Backend: POST /api/exercises/:id/submit
    ↓
ExerciseController → ExerciseService
    ↓
OCRService: Convert canvas to text
    ↓
RekognitionService: Extract text from image
    ↓
GradingService: Compare with expected text
    ↓
RewardService: Award points
    ↓
Response: Grading results + feedback
    ↓
Frontend: Display feedback
```

### 3. Grading Flow
```
Student text + Expected text
    ↓
GradingService.gradeSubmission()
    ↓
GeminiService: Compare translations semantically
    ↓
Calculate metrics:
  - Similarity score
  - Grammar score
  - Vocabulary score
  - Spelling score
    ↓
Generate feedback
    ↓
Determine points earned
    ↓
Save results to database
    ↓
Return GradingResponse
```

## Data Flow

### User Session
```
1. User logs in → Supabase Auth
2. Frontend stores user in Zustand store
3. All API requests include auth token
4. Backend validates token for protected routes
```

### State Management
- **Local State**: Component-level (useState)
- **Global State**: Zustand stores (user, settings)
- **Server State**: API responses (cached in components)
- **Persistent State**: Supabase database

## Security Considerations

### Frontend
- Environment variables for API keys (VITE_*)
- No sensitive keys in client code
- CORS configuration

### Backend
- Environment variables for secrets
- Input validation with Zod schemas
- Error handling middleware
- Rate limiting (TODO)
- Authentication middleware (TODO)

### Database
- Row Level Security (RLS) policies
- Prepared statements (Supabase client)
- Email normalization (lowercase)

## Scalability Considerations

### Current Architecture
- Monolithic backend (single Express server)
- Client-side rendering (CSR)
- Direct API calls

### Future Improvements
- **Caching**: Redis for frequently accessed data
- **CDN**: For static assets and images
- **Queue System**: For async tasks (OCR, grading)
- **Microservices**: Separate AI services
- **Load Balancing**: Multiple backend instances
- **Server-Side Rendering**: For better SEO and performance

## Performance Optimization

### Frontend
- Code splitting (React.lazy)
- Image optimization
- Canvas performance (debouncing, throttling)
- Memoization (useMemo, useCallback)

### Backend
- Connection pooling (Supabase)
- Response compression
- API response caching
- Batch operations for database

## Error Handling

### Frontend
- Try-catch blocks in API calls
- Error boundaries for React components
- User-friendly error messages
- Retry logic for failed requests

### Backend
- Global error handler middleware
- Structured error responses
- Error logging
- Graceful degradation

## Testing Strategy (TODO)

### Frontend
- Unit tests: Components, utilities
- Integration tests: User flows
- E2E tests: Critical paths

### Backend
- Unit tests: Services, utilities
- Integration tests: API endpoints
- E2E tests: Complete workflows

## Monitoring & Logging (TODO)

- Request/response logging
- Error tracking (Sentry)
- Performance monitoring (APM)
- User analytics
- API usage metrics

