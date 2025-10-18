# Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Supabase account
- AWS account (for Rekognition)
- Google Cloud account (for Gemini API)

## Installation Steps

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd CaligraphME

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install shared dependencies
cd ../shared
npm install
```

### 2. Supabase Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Run the SQL schema from `docs/DATABASE_SCHEMA.md`
3. Create storage buckets:
   - `canvas-images` (public read, authenticated write)
   - `story-assets` (public read, admin write)
4. Copy your project URL and keys

### 3. AWS Setup

1. Create an AWS account
2. Enable AWS Rekognition service
3. Create an S3 bucket for image storage
4. Create IAM user with permissions:
   - `AmazonRekognitionFullAccess`
   - `AmazonS3FullAccess`
5. Copy access key ID and secret access key

### 4. Google Cloud Setup

1. Create a Google Cloud project
2. Enable the Gemini API
3. Create an API key
4. Copy the API key

### 5. Environment Configuration

#### Backend Environment
```bash
cd backend
cp .env.example .env
```

Edit `.env` with your credentials:
```env
NODE_ENV=development
PORT=3000

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REKOGNITION_BUCKET=your_s3_bucket_name

GEMINI_API_KEY=your_gemini_api_key

CORS_ORIGIN=http://localhost:5173
```

#### Frontend Environment
```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000/api
```

### 6. Run the Application

#### Development Mode

From the root directory:
```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run dev:frontend  # Frontend on http://localhost:5173
npm run dev:backend   # Backend on http://localhost:3000
```

#### Production Build

```bash
# Build everything
npm run build

# Start backend
cd backend
npm start
```

## Verification

1. Open http://localhost:5173 in your browser
2. You should see the CaligraphME homepage
3. Check the backend API at http://localhost:3000/api

## Troubleshooting

### Supabase Connection Issues
- Verify your Supabase URL and keys
- Check if Row Level Security policies are configured
- Ensure database tables are created

### AWS Rekognition Issues
- Verify AWS credentials
- Check IAM permissions
- Ensure S3 bucket is accessible

### Gemini API Issues
- Verify API key is correct
- Check API quota limits
- Ensure billing is enabled on Google Cloud

### Port Already in Use
```bash
# Change port in backend/.env
PORT=3001

# Change proxy in frontend/vite.config.ts if needed
```

## Next Steps

1. Review the database schema in `docs/DATABASE_SCHEMA.md`
2. Check API endpoints in `docs/API_ENDPOINTS.md`
3. Start implementing the core features
4. Add authentication
5. Implement AI services (Gemini, Rekognition)
6. Build out the grading system
7. Add reward mechanics

## Development Tips

- Use TypeScript strict mode for better type safety
- Follow the established folder structure
- Keep shared types in the `shared/` directory
- Write API services before implementing UI
- Test API endpoints with Postman or similar tool
- Use React DevTools for debugging frontend
- Check browser console for errors

