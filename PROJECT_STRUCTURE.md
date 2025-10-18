# CaligraphME - Project Structure

## Overview

This document provides a complete overview of the project structure and organization.

## Directory Tree

```
CaligraphME/
│
├── README.md                     # Project overview and getting started
├── package.json                  # Root package.json for monorepo
├── .gitignore                   # Git ignore rules
├── .eslintrc.json              # ESLint configuration
├── PROJECT_STRUCTURE.md        # This file
│
├── docs/                        # Documentation
│   ├── SETUP.md                # Setup and installation guide
│   ├── ARCHITECTURE.md         # System architecture documentation
│   ├── API_ENDPOINTS.md        # API endpoint documentation
│   ├── DATABASE_SCHEMA.md      # Database schema and SQL
│   ├── FEATURES.md             # Feature specifications
│   ├── CONTRIBUTING.md         # Contribution guidelines
│   └── TODO.md                 # Project TODO list
│
├── frontend/                    # React + Vite frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── layout/        # Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── canvas/        # Canvas/drawing components
│   │   │   │   └── DrawingCanvas.tsx
│   │   │   └── exercise/      # Exercise components
│   │   │       └── FeedbackDisplay.tsx
│   │   │
│   │   ├── pages/             # Page components (routes)
│   │   │   ├── HomePage.tsx
│   │   │   ├── StoryListPage.tsx
│   │   │   ├── StoryPage.tsx
│   │   │   ├── ExercisePage.tsx
│   │   │   ├── ProgressPage.tsx
│   │   │   ├── LeaderboardPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   │
│   │   ├── services/          # Service layer
│   │   │   ├── api/          # API clients
│   │   │   │   ├── api.client.ts
│   │   │   │   ├── story.api.ts
│   │   │   │   ├── exercise.api.ts
│   │   │   │   ├── grading.api.ts
│   │   │   │   ├── reward.api.ts
│   │   │   │   └── user.api.ts
│   │   │   └── supabase.client.ts
│   │   │
│   │   ├── stores/            # State management (Zustand)
│   │   │   └── userStore.ts
│   │   │
│   │   ├── styles/            # Global styles
│   │   │   └── index.css
│   │   │
│   │   ├── App.tsx           # Root component
│   │   ├── main.tsx          # Entry point
│   │   └── vite-env.d.ts     # Vite type definitions
│   │
│   ├── index.html             # HTML template
│   ├── package.json           # Frontend dependencies
│   ├── tsconfig.json          # TypeScript config
│   ├── tsconfig.node.json     # TypeScript config for Node
│   ├── vite.config.ts         # Vite configuration
│   └── .eslintrc.json         # ESLint config
│
├── backend/                    # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   │   ├── story.controller.ts
│   │   │   ├── exercise.controller.ts
│   │   │   ├── grading.controller.ts
│   │   │   ├── reward.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   └── ocr.controller.ts
│   │   │
│   │   ├── services/          # Business logic
│   │   │   ├── ai/           # AI service integrations
│   │   │   │   ├── gemini.service.ts
│   │   │   │   └── rekognition.service.ts
│   │   │   ├── database/     # Database services
│   │   │   │   └── supabase.service.ts
│   │   │   ├── story.service.ts
│   │   │   ├── exercise.service.ts
│   │   │   ├── grading.service.ts
│   │   │   ├── reward.service.ts
│   │   │   ├── user.service.ts
│   │   │   └── ocr.service.ts
│   │   │
│   │   ├── routes/            # API routes
│   │   │   ├── index.ts
│   │   │   ├── story.routes.ts
│   │   │   ├── exercise.routes.ts
│   │   │   ├── grading.routes.ts
│   │   │   ├── reward.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   └── ocr.routes.ts
│   │   │
│   │   ├── middleware/        # Express middleware
│   │   │   ├── errorHandler.ts
│   │   │   └── logger.ts
│   │   │
│   │   └── index.ts          # Server entry point
│   │
│   ├── package.json           # Backend dependencies
│   └── tsconfig.json          # TypeScript config
│
└── shared/                     # Shared code between frontend/backend
    ├── src/
    │   ├── types/             # TypeScript type definitions
    │   │   ├── index.ts
    │   │   ├── user.types.ts
    │   │   ├── story.types.ts
    │   │   ├── exercise.types.ts
    │   │   ├── grading.types.ts
    │   │   └── reward.types.ts
    │   │
    │   ├── schemas/           # Zod validation schemas
    │   │   └── index.ts
    │   │
    │   ├── constants/         # Shared constants
    │   │   └── index.ts
    │   │
    │   └── index.ts          # Main export
    │
    ├── package.json           # Shared dependencies
    └── tsconfig.json          # TypeScript config
```

## Module Responsibilities

### Frontend (`frontend/`)

**Purpose**: User interface and client-side logic

**Key Modules**:
- `components/`: Reusable React components
- `pages/`: Full page components mapped to routes
- `services/`: API communication and external services
- `stores/`: Global state management
- `styles/`: CSS and styling

### Backend (`backend/`)

**Purpose**: API server, business logic, and external service integration

**Key Modules**:
- `controllers/`: Handle HTTP requests and responses
- `services/`: Business logic and data processing
- `routes/`: API endpoint definitions
- `middleware/`: Express middleware (logging, error handling)

### Shared (`shared/`)

**Purpose**: Code shared between frontend and backend

**Key Modules**:
- `types/`: TypeScript interfaces and types
- `schemas/`: Zod validation schemas
- `constants/`: Shared constants and enums

## Key Files

### Configuration Files

- `package.json` - Root dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `.gitignore` - Files to ignore in git
- `.eslintrc.json` - Linting rules

### Frontend Config

- `vite.config.ts` - Vite build configuration
- `index.html` - HTML entry point
- `main.tsx` - React entry point

### Backend Config

- `index.ts` - Express server setup

### Documentation

- `README.md` - Project overview
- `docs/SETUP.md` - Installation guide
- `docs/ARCHITECTURE.md` - System architecture
- `docs/API_ENDPOINTS.md` - API documentation
- `docs/DATABASE_SCHEMA.md` - Database schema
- `docs/FEATURES.md` - Feature specifications

## Data Flow

```
User Interaction
    ↓
Frontend (React Components)
    ↓
Frontend Services (API Clients)
    ↓
HTTP Request
    ↓
Backend Routes
    ↓
Backend Controllers
    ↓
Backend Services
    ↓
External Services (Supabase, AWS, Gemini)
    ↓
Response
    ↓
Frontend (Update UI)
```

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Zustand (state management)
- Axios (HTTP client)

### Backend
- Node.js
- Express
- TypeScript
- Supabase (database, auth, storage)
- AWS Rekognition (OCR)
- Google Gemini (AI)

### Development Tools
- ESLint (linting)
- Git (version control)
- npm workspaces (monorepo)

## Getting Started

See `docs/SETUP.md` for detailed setup instructions.

Quick start:
```bash
npm install
npm run dev
```

## Contributing

See `docs/CONTRIBUTING.md` for contribution guidelines.

