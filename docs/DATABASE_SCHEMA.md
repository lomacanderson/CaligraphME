# Database Schema (Supabase)

## Tables

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  age INTEGER,
  native_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email lookups (remember to handle lowercase)
CREATE INDEX idx_users_email ON users(LOWER(email));
```

### stories
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

CREATE INDEX idx_stories_language ON stories(language);
CREATE INDEX idx_stories_level ON stories(level);
CREATE INDEX idx_stories_theme ON stories(theme);
```

### story_sentences
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

CREATE INDEX idx_story_sentences_story_id ON story_sentences(story_id);
```

### exercises
```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  sentence_id UUID NOT NULL REFERENCES story_sentences(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_exercises_user_id ON exercises(user_id);
CREATE INDEX idx_exercises_story_id ON exercises(story_id);
```

### submissions
```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  canvas_data TEXT NOT NULL,
  extracted_text TEXT,
  
  -- Handwriting Grading
  handwriting_overall_score DECIMAL(5,2),
  handwriting_legibility_score DECIMAL(5,2),
  handwriting_confidence_score DECIMAL(5,2),
  handwriting_penmanship_score DECIMAL(5,2),
  handwriting_needs_review BOOLEAN DEFAULT FALSE,
  handwriting_issues JSONB,
  
  -- Translation Grading
  translation_overall_score DECIMAL(5,2),
  translation_is_correct BOOLEAN,
  translation_semantic_score DECIMAL(5,2),
  translation_grammar_score DECIMAL(5,2),
  translation_vocabulary_score DECIMAL(5,2),
  translation_spelling_score DECIMAL(5,2),
  translation_errors JSONB,
  
  -- Overall Results
  overall_score DECIMAL(5,2),
  feedback JSONB, -- Stores combined feedback object
  
  -- Points
  handwriting_points INTEGER,
  translation_points INTEGER,
  bonus_points INTEGER DEFAULT 0,
  total_points INTEGER,
  
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processing_time INTEGER
);

CREATE INDEX idx_submissions_exercise_id ON submissions(exercise_id);
CREATE INDEX idx_submissions_overall_score ON submissions(overall_score DESC);
```

### rewards
```sql
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  points INTEGER NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX idx_rewards_user_id ON rewards(user_id);
CREATE INDEX idx_rewards_earned_at ON rewards(earned_at DESC);
```

### achievements
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  points INTEGER NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_threshold INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### user_achievements
```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
```

### user_progress
```sql
CREATE TABLE user_progress (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  stories_completed INTEGER DEFAULT 0,
  sentences_completed INTEGER DEFAULT 0,
  average_accuracy DECIMAL(5,2) DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### user_preferences
```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  sound_enabled BOOLEAN DEFAULT true,
  font_size TEXT DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large')),
  show_hints BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### point_transactions
```sql
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earned', 'spent', 'bonus')),
  reason TEXT NOT NULL,
  balance_after INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_point_transactions_user_id ON point_transactions(user_id);
CREATE INDEX idx_point_transactions_created_at ON point_transactions(created_at DESC);
```

## Storage Buckets

### canvas-images
- Stores canvas/drawing images submitted by users
- Public read access, authenticated write

### story-assets
- Stores images and audio files for stories
- Public read access, admin write

## Row Level Security (RLS)

Enable RLS on all tables and create appropriate policies:

```sql
-- Example: Users can only read/update their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

## Triggers

### Update timestamp trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Email lowercase trigger
```sql
CREATE OR REPLACE FUNCTION lowercase_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email = LOWER(NEW.email);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER lowercase_user_email BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION lowercase_email();
```

