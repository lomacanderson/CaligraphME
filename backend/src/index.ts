import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as apiRouter } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { SupabaseService } from './services/database/supabase.service.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdir } from 'fs/promises';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure temp directory exists for audio generation
const tempDir = path.join(__dirname, '..', 'temp');
mkdir(tempDir, { recursive: true }).catch(console.error);

// Setup Supabase Storage for audio files
async function setupAudioStorage() {
  try {
    SupabaseService.initialize();
    await SupabaseService.createBucket('audio-files');
    console.log('✅ Audio storage bucket ready');
  } catch (error) {
    if ((error as Error).message?.includes('already exists')) {
      console.log('📁 Audio storage bucket already exists');
    } else {
      console.error('⚠️ Audio storage setup failed:', (error as Error).message);
      console.log('💡 Audio generation may not work properly');
    }
  }
}

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// Note: Audio files are now served from Supabase Storage, not local files

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api', apiRouter);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  
  // Setup audio storage after server starts
  console.log('🎵 Setting up audio storage...');
  await setupAudioStorage();
});

