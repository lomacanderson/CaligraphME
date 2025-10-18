# TODO List

## High Priority (MVP)

### Backend
- [ ] Implement Story Generation
  - [ ] Integrate Gemini API
  - [ ] Create story generation prompt
  - [ ] Parse and structure AI response
  - [ ] Save stories to database
  
- [ ] Implement OCR Service
  - [ ] Set up AWS Rekognition
  - [ ] Handle image upload to S3
  - [ ] Extract text from images
  - [ ] Return confidence scores
  
- [ ] Implement Grading System
  - [ ] Semantic text comparison
  - [ ] Calculate accuracy metrics
  - [ ] Generate feedback
  - [ ] Award points based on performance
  
- [ ] Database Setup
  - [ ] Create all tables in Supabase
  - [ ] Set up storage buckets
  - [ ] Configure Row Level Security
  - [ ] Add triggers and functions

### Frontend
- [ ] Complete Drawing Canvas
  - [ ] Add touch support
  - [ ] Implement SVG export
  - [ ] Add drawing tools (pen size, color)
  - [ ] Improve canvas performance
  
- [ ] Implement Story Flow
  - [ ] Story browsing and filtering
  - [ ] Story detail view
  - [ ] Sentence-by-sentence navigation
  - [ ] Exercise creation flow
  
- [ ] Complete Exercise Page
  - [ ] Integrate canvas submission
  - [ ] Show processing state
  - [ ] Display grading results
  - [ ] Handle retry logic
  
- [ ] Implement Reward System
  - [ ] Points display
  - [ ] Achievement badges
  - [ ] Leaderboard display
  - [ ] Celebration animations

### Shared
- [ ] Finalize all type definitions
- [ ] Add validation schemas for all endpoints
- [ ] Document all types

## Medium Priority

### Features
- [ ] User Authentication
  - [ ] Email/password registration
  - [ ] Login/logout
  - [ ] Password reset
  - [ ] Social login (Google)
  
- [ ] Progress Tracking
  - [ ] Track completion stats
  - [ ] Calculate streaks
  - [ ] Store learning history
  - [ ] Generate progress reports
  
- [ ] Enhanced Canvas
  - [ ] Undo/redo functionality
  - [ ] Multiple colors
  - [ ] Eraser tool
  - [ ] Save drafts
  
- [ ] Story Improvements
  - [ ] Audio support
  - [ ] Images for stories
  - [ ] Difficulty adaptation
  - [ ] Story bookmarks

### Technical Improvements
- [ ] Error Handling
  - [ ] Better error messages
  - [ ] Error boundary components
  - [ ] Retry logic for failed requests
  - [ ] Graceful degradation
  
- [ ] Performance
  - [ ] API response caching
  - [ ] Image optimization
  - [ ] Code splitting
  - [ ] Lazy loading
  
- [ ] Testing
  - [ ] Unit tests for services
  - [ ] Component tests
  - [ ] API endpoint tests
  - [ ] E2E tests for critical flows

## Low Priority / Future

### Features
- [ ] Parent Dashboard
- [ ] Payment Integration
- [ ] Mobile Apps (React Native)
- [ ] Offline Mode
- [ ] Multi-language UI
- [ ] Voice Input
- [ ] AI Tutor Chat
- [ ] Collaborative Learning
- [ ] Custom Story Creation
- [ ] Printing Worksheets

### Technical
- [ ] Monitoring & Analytics
- [ ] CI/CD Pipeline
- [ ] Docker Containerization
- [ ] Kubernetes Deployment
- [ ] CDN Integration
- [ ] Redis Caching
- [ ] Message Queue (Bull)
- [ ] Microservices Architecture
- [ ] GraphQL API
- [ ] WebSocket for real-time features

## Documentation
- [x] README.md
- [x] SETUP.md
- [x] API_ENDPOINTS.md
- [x] DATABASE_SCHEMA.md
- [x] ARCHITECTURE.md
- [x] FEATURES.md
- [x] CONTRIBUTING.md
- [ ] DEPLOYMENT.md
- [ ] TESTING.md
- [ ] SECURITY.md

## Bugs / Issues

None reported yet (project in skeleton phase)

## Questions / Decisions Needed

1. Which OCR service to use? (AWS Rekognition vs Google Vision)
2. How to handle multiple valid translations?
3. What accuracy threshold for "correct" answers?
4. Should we support stylus/pen input differently?
5. Free tier limitations?
6. Age verification for children?
7. COPPA compliance requirements?

## Notes

- Keep TODO list updated as work progresses
- Move completed items to a "Done" section with dates
- Add new items as they come up
- Prioritize based on user needs and MVP requirements

