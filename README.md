# CaligraphME - Children's Language Development App

An interactive language learning application for children that uses AI to generate stories, process handwritten responses, and provide feedback on language learning progress.

## Overview

CaligraphME helps children learn new languages by:
1. Generating engaging stories in their target language
2. Presenting sentences in their comfortable language
3. Allowing them to write responses on a canvas
4. Using AI to analyze their handwriting and compare translations
5. Providing feedback and rewards for progress

## Architecture

```
CaligraphME/
├── frontend/          # React + Vite + TypeScript
├── backend/           # Node.js + TypeScript + Express
├── shared/            # Shared types and utilities
└── docs/              # Documentation
```

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Canvas API** - Handwriting input
- **SVG** - Image format for handwriting

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Supabase** - Database, authentication, and storage
- **Gemini API** - Story generation and translation
- **ElevenLabs** - Voice synthesization and narration

## Core Features

### 1. Story Generator
- Generates age-appropriate stories
- Organizes content into sentences
- Supports multiple languages
- Difficulty levels

### 2. Image-to-Text (OCR)
- Converts handwritten canvas to text
- Uses Amazon Rekognition
- Returns confidence scores

### 3. Dual Grading System 🎯
CaligraphME uses a unique **dual grading system** that evaluates two separate aspects:

**✍️ Handwriting Quality (40%)**
- Legibility - How readable is the writing?
- OCR Confidence - Text clarity
- Penmanship - Letter formation, spacing, consistency

**🌍 Translation Accuracy (60%)**
- Semantic Accuracy - Does the meaning match?
- Grammar - Correct sentence structure
- Vocabulary - Appropriate word choice
- Spelling - Correct spelling and accents

This separation provides:
- Specific, actionable feedback for each skill
- Fair evaluation (good translation, messy handwriting? We see both!)
- Targeted practice recommendations
- Independent progress tracking

Students receive detailed feedback for both areas and earn points based on performance in each category, with bonus points for excellence in both!

See [GRADING_SYSTEM.md](docs/GRADING_SYSTEM.md) for detailed information.

### 4. Reward System
- Tracks student points
- Achievement badges
- Progress visualization
- Separate tracking for handwriting and translation skills

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- AWS account (for Rekognition)
- Google Cloud account (for Gemini API)

### Installation

```bash
# Install dependencies for all packages
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Environment Setup

See `.env.example` files in frontend and backend directories.

### Development

```bash
# Run both frontend and backend concurrently
npm run dev

# Run frontend only
cd frontend
npm run dev

# Run backend only
cd backend
npm run dev
```

## Project Status

🚧 **Currently in skeleton/template phase** - Implementation in progress

## Extensions (Future)

- [ ] User accounts and authentication
- [ ] Progress tracking and curriculum
- [ ] Payment integration (Visa)
- [ ] Parent dashboard
- [ ] Multi-language support expansion
- [ ] Offline mode

## License

TBD

