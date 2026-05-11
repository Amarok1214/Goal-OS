# Supabase Setup Instructions

## Prerequisites

- Node.js 18+ installed
- A GitHub account (for Supabase auth)

---

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project" 
3. Sign in with GitHub
4. Click "New project"
5. Fill in details:
   - **Name**: `goal-os` (or your preferred name)
   - **Database Password**: Create a strong password and save it!
   - **Region**: Select one closest to you (e.g., `US East (N. Virginia)`)

---

## Step 2: Get API Credentials

1. In your Supabase dashboard, go to **Settings** (cog icon) → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

---

## Step 3: Add Credentials to App

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual credentials.

---

## Step 4: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

---

## Step 5: Create Database Schema

In Supabase dashboard, go to **SQL Editor** and run:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Goals table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'someday')),
  category TEXT,
  deadline DATE,
  links JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subtasks table
CREATE TABLE subtasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pomodoro sessions table
CREATE TABLE pomodoro_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  task_title TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL,
  intention TEXT,
  completed_pomodoros INTEGER DEFAULT 1,
  type TEXT NOT NULL CHECK (type IN ('work', 'break'))
);

-- Schedule blocks table
CREATE TABLE schedule_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 25,
  goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Distraction logs table
CREATE TABLE distraction_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES pomodoro_sessions(id) ON DELETE SET NULL,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE distraction_logs ENABLE ROW LEVEL SECURITY;

-- Simple policy: Allow all operations (for MVP)
-- In production, you'd add proper auth policies
CREATE POLICY "Allow all on goals" ON goals FOR ALL USING (true);
CREATE POLICY "Allow all on tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all on subtasks" ON subtasks FOR ALL USING (true);
CREATE POLICY "Allow all on pomodoro_sessions" ON pomodoro_sessions FOR ALL USING (true);
CREATE POLICY "Allow all on schedule_blocks" ON schedule_blocks FOR ALL USING (true);
CREATE POLICY "Allow all on distraction_logs" ON distraction_logs FOR ALL USING (true);
```

Click **Run** to execute.

---

## Step 6: Verify Setup

Add a test file to verify connection:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection
supabase.from('goals').select('*').limit(1)
  .then(({ data, error }) => {
    if (error) console.error('Supabase connection failed:', error)
    else console.log('Supabase connected!')
  })
```

---

## What to Do Now

1. Create Supabase account at https://supabase.com
2. Create a new project
3. Run the SQL schema above in the SQL Editor
4. Add your credentials to `.env.local`
5. Let me know when done, and I'll create the migration plan to move from localStorage to Supabase

---

## Notes

- **Data Migration**: We'll need to export existing localStorage data and import it to Supabase
- **Auth** (Optional): Supabase has built-in auth if you want user accounts later
- **Free Tier**: 500MB database, 1GB file storage, auth included
