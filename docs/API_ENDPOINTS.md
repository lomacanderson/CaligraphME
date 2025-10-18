# API Endpoints Documentation

Base URL: `http://localhost:3000/api`

## Stories

### Generate Story
```
POST /stories/generate
Content-Type: application/json

Request Body:
{
  "language": "es",
  "level": "beginner",
  "theme": "animals",
  "sentenceCount": 5,
  "ageRange": {
    "min": 5,
    "max": 7
  }
}

Response: 200 OK
{
  "story": { ... },
  "metadata": {
    "generationTime": 2500,
    "modelUsed": "gemini-pro"
  }
}
```

### Get Stories
```
GET /stories?language=es&level=beginner&theme=animals

Response: 200 OK
[
  {
    "id": "uuid",
    "title": "The Friendly Cat",
    "language": "es",
    "level": "beginner",
    ...
  }
]
```

### Get Story by ID
```
GET /stories/:id

Response: 200 OK
{
  "id": "uuid",
  "title": "The Friendly Cat",
  "sentences": [ ... ]
}
```

## Exercises

### Create Exercise
```
POST /exercises
Content-Type: application/json

Request Body:
{
  "userId": "uuid",
  "storyId": "uuid",
  "sentenceId": "uuid"
}

Response: 201 Created
{
  "id": "uuid",
  "userId": "uuid",
  "status": "in_progress",
  ...
}
```

### Submit Canvas
```
POST /exercises/:id/submit
Content-Type: application/json

Request Body:
{
  "exerciseId": "uuid",
  "canvasData": "data:image/png;base64,...",
  "format": "png"
}

Response: 200 OK
{
  "submissionId": "uuid",
  "extractedText": "El gato está durmiendo",
  "confidence": 0.95,
  "needsReview": false
}
```

## Grading

### Grade Submission
```
POST /grading/grade
Content-Type: application/json

Request Body:
{
  "submissionId": "uuid",
  "studentText": "El gato está durmiendo",
  "expectedText": "El gato duerme",
  "sourceLanguage": "en",
  "targetLanguage": "es"
}

Response: 200 OK
{
  "submissionId": "uuid",
  "isCorrect": true,
  "similarityScore": 92,
  "accuracyMetrics": {
    "overallAccuracy": 92,
    "grammarScore": 95,
    "vocabularyScore": 90,
    "spellingScore": 100,
    "errors": []
  },
  "feedback": {
    "message": "Great job!",
    "encouragement": "You're making excellent progress!",
    "level": "excellent"
  },
  "pointsEarned": 100
}
```

## Rewards

### Get User Rewards
```
GET /rewards/user/:userId

Response: 200 OK
[
  {
    "id": "uuid",
    "type": "story_completed",
    "title": "Story Master",
    "points": 500,
    "earnedAt": "2024-01-01T00:00:00Z"
  }
]
```

### Get Leaderboard
```
GET /rewards/leaderboard?period=weekly

Response: 200 OK
{
  "period": "weekly",
  "entries": [
    {
      "rank": 1,
      "userId": "uuid",
      "username": "john_doe",
      "points": 5000
    }
  ],
  "lastUpdated": "2024-01-01T00:00:00Z"
}
```

## Users

### Create User
```
POST /users
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "username": "john_doe",
  "nativeLanguage": "en",
  "targetLanguage": "es",
  "level": "beginner",
  "age": 8
}

Response: 201 Created
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "john_doe",
  ...
}
```

### Get User Progress
```
GET /users/:id/progress

Response: 200 OK
{
  "userId": "uuid",
  "storiesCompleted": 5,
  "sentencesCompleted": 25,
  "averageAccuracy": 87.5,
  "currentStreak": 7,
  "longestStreak": 14,
  "lastActivityDate": "2024-01-01"
}
```

## OCR

### Process Image
```
POST /ocr/process
Content-Type: application/json

Request Body:
{
  "imageData": "base64_encoded_image",
  "format": "png"
}

Response: 200 OK
{
  "text": "Extracted text from image",
  "confidence": 0.95,
  "processingTime": 1200
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": {
    "message": "Invalid request parameters"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "message": "Resource not found"
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "message": "Internal server error"
  }
}
```

