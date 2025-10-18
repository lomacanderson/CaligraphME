# Supabase Setup for MVP/Hackathon

## 🚀 Quick Setup (30 minutes max)

This is a **simplified setup** for hackathon/MVP purposes. Skip the complex stuff!

---

## Step 1: Create Supabase Project (5 min)

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - **Name**: CaligraphME
   - **Database Password**: (save this!)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait ~2 minutes for setup

---

## Step 2: Get Your Credentials (2 min)

1. In your project dashboard, click **Settings** (gear icon)
2. Click **API** in sidebar
3. Copy these values:

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbG...
service_role key: eyJhbG... (keep this secret!)
```

4. Add to your `.env` files:

**Backend** (`backend/.env`):
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbG... (service_role key)
```

**Frontend** (`frontend/.env`):
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG... (anon public key)
```

---

## Step 3: Create Database Tables (10 min)

### Simplified Schema for MVP

Go to **SQL Editor** in Supabase dashboard and run this:

```sql
-- 1. Users table (simplified)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  username TEXT UNIQUE NOT NULL,
  native_language TEXT DEFAULT 'en',
  target_language TEXT DEFAULT 'es',
  level TEXT DEFAULT 'beginner',
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Stories table (simplified)
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  language TEXT NOT NULL,
  level TEXT NOT NULL,
  theme TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Story sentences
CREATE TABLE story_sentences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  text_original TEXT NOT NULL,
  text_translated TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Exercises (simplified)
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  sentence_id UUID REFERENCES story_sentences(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Submissions (MVP version - stores all grading data)
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  
  -- Canvas data
  canvas_data TEXT NOT NULL,
  extracted_text TEXT,
  
  -- Simplified grading (just store the JSON)
  handwriting_grade JSONB,
  translation_grade JSONB,
  overall_score DECIMAL(5,2),
  feedback JSONB,
  total_points INTEGER DEFAULT 0,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create indexes for performance
CREATE INDEX idx_story_sentences_story_id ON story_sentences(story_id);
CREATE INDEX idx_exercises_user_id ON exercises(user_id);
CREATE INDEX idx_submissions_exercise_id ON submissions(exercise_id);

-- 7. Insert a test user (for demo)
INSERT INTO users (username, email) 
VALUES ('demo_user', 'demo@caligraphme.com');
```

**That's it for tables!** ✅

---

## Step 4: Create Storage Buckets (5 min)

### For storing canvas images

1. In Supabase dashboard, click **Storage**
2. Click **New bucket**
3. Create bucket:
   - **Name**: `canvas-images`
   - **Public**: ✅ Check this (for easy access in MVP)
4. Click **Create bucket**

**Optional** (if you want story images):
5. Repeat for `story-images` bucket

---

## Step 5: Set Up Storage Policies (5 min)

### Make buckets accessible

In Supabase dashboard:
1. Go to **Storage** → Click your bucket
2. Click **Policies** tab
3. Click **New Policy**
4. Select **"For full customization"**
5. Add these two policies:

**Policy 1: Allow public read**
```sql
-- Name: Public read access
-- Allowed operation: SELECT
-- Policy definition:
true
```

**Policy 2: Allow uploads** (for MVP, allow all)
```sql
-- Name: Allow uploads
-- Allowed operation: INSERT
-- Policy definition:
true
```

**Note**: For production, you'd restrict this to authenticated users only, but for MVP this is fine!

---

## Step 6: Disable RLS for MVP (OPTIONAL - Hackathon Only!)

For a **hackathon MVP**, you can disable Row Level Security to move faster:

```sql
-- Run in SQL Editor
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE story_sentences DISABLE ROW LEVEL SECURITY;
ALTER TABLE exercises DISABLE ROW LEVEL SECURITY;
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;
```

**⚠️ Warning**: This makes all data publicly accessible. **Only for MVP/demo!**
For production, enable RLS and add proper policies.

---

## Step 7: Test Connection (3 min)

### Quick test from backend

Create a test file: `backend/test-supabase.js`

```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Test query
const { data, error } = await supabase
  .from('users')
  .select('*')
  .limit(1);

if (error) {
  console.error('❌ Error:', error);
} else {
  console.log('✅ Connected! Users:', data);
}
```

Run:
```bash
node backend/test-supabase.js
```

Should see: `✅ Connected! Users: [...]`

---

## What You DON'T Need for MVP

**Skip these for hackathon** (can add later if time permits):

- ❌ Authentication (use demo user or skip auth)
- ❌ Row Level Security policies (disabled above)
- ❌ Complex foreign key constraints
- ❌ Triggers and functions
- ❌ Achievements table
- ❌ Leaderboard table
- ❌ User preferences table
- ❌ Point transactions table

**Just focus on**: Stories → Exercises → Submissions → Grading

---

## MVP Data Flow

```
1. Create a story (manually or via API)
   ↓
2. User selects story
   ↓
3. Create exercise for sentence
   ↓
4. User draws on canvas
   ↓
5. Submit → Create submission with grades
   ↓
6. Display feedback
```

---

## Seed Data for Demo (Optional)

Insert a sample story for testing:

```sql
-- Insert a demo story
INSERT INTO stories (title, language, level, theme)
VALUES ('The Sleeping Cat', 'es', 'beginner', 'animals')
RETURNING id;

-- Copy the returned ID and use it below (replace 'STORY_ID_HERE')

-- Insert sentences
INSERT INTO story_sentences (story_id, order_index, text_original, text_translated)
VALUES 
  ('STORY_ID_HERE', 1, 'El gato duerme.', 'The cat sleeps.'),
  ('STORY_ID_HERE', 2, 'El gato es negro.', 'The cat is black.'),
  ('STORY_ID_HERE', 3, 'El gato está feliz.', 'The cat is happy.');
```

---

## Environment Variables Checklist

Make sure you have:

✅ `backend/.env`:
```env
SUPABASE_URL=your_url
SUPABASE_SERVICE_KEY=your_service_key
```

✅ `frontend/.env`:
```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## Quick Reference: Supabase Client Usage

### Backend (with service key):
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Query
const { data } = await supabase
  .from('stories')
  .select('*');

// Insert
const { data } = await supabase
  .from('submissions')
  .insert({
    exercise_id: '...',
    canvas_data: '...',
    handwriting_grade: { ... },
    translation_grade: { ... }
  });
```

### Frontend (with anon key):
```typescript
import { supabase } from './services/supabase.client';

// Same API
const { data } = await supabase
  .from('stories')
  .select('*');
```

---

## Troubleshooting

### "No API key found"
→ Check `.env` files exist and have correct variable names

### "relation does not exist"
→ Run the SQL schema in SQL Editor again

### "row-level security policy"
→ Run the `ALTER TABLE ... DISABLE ROW LEVEL SECURITY` commands

### "storage bucket not found"
→ Create the bucket in Storage section

### Can't upload to storage
→ Check storage policies are set to allow public access

---

## That's It! 🎉

You're ready to build. For MVP focus on:

1. ✅ Basic tables created
2. ✅ Storage bucket for images
3. ✅ Environment variables set
4. ✅ Connection tested

**Total time: ~30 minutes**

Everything else can be added after the demo works!

---

## After Hackathon / For Production

If you continue development:
- [ ] Enable Row Level Security
- [ ] Add authentication
- [ ] Create proper policies
- [ ] Add remaining tables (achievements, leaderboard, etc.)
- [ ] Set up database backups
- [ ] Add proper error handling
- [ ] Secure storage buckets

