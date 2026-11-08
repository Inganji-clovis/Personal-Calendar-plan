-- ==============================================================================
-- INGANJI LIFE OS - Complete Production Database Schema & Security Updates
-- Safe, idempotent script. Does not drop, truncate or recreate existing tables.
-- Run this in your Supabase SQL Editor: Dashboard -> SQL Editor -> New Query
-- ==============================================================================

-- 1. Safely enhance existing core tables with session and helper columns
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS focus_area text DEFAULT 'General';
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS session_type text DEFAULT 'home';
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL;

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS focus_area text DEFAULT 'General';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS session_type text DEFAULT 'home';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS progress integer DEFAULT 0;

ALTER TABLE public.learning_records ADD COLUMN IF NOT EXISTS category text DEFAULT 'IT Roadmap';
ALTER TABLE public.learning_records ADD COLUMN IF NOT EXISTS lab_status text DEFAULT 'completed';

-- 2. Project Milestones
CREATE TABLE IF NOT EXISTS public.milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  title text NOT NULL,
  due_date date,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

-- 3. Habits & Daily Habit Tracking
CREATE TABLE IF NOT EXISTS public.habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Personal',
  frequency text NOT NULL DEFAULT 'daily',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.habit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  log_date date NOT NULL,
  completed boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, log_date)
);
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

-- 4. Goals (Short & Long term)
CREATE TABLE IF NOT EXISTS public.goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Personal',
  target_value numeric(12,2) DEFAULT 100,
  current_value numeric(12,2) DEFAULT 0,
  unit text DEFAULT '%',
  deadline date,
  status text NOT NULL DEFAULT 'in_progress',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- 5. Finance Budgets & Savings Goals
CREATE TABLE IF NOT EXISTS public.budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  category text NOT NULL,
  monthly_limit numeric(14,2) NOT NULL CHECK (monthly_limit > 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, category)
);
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.savings_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  title text NOT NULL,
  target_amount numeric(14,2) NOT NULL CHECK (target_amount > 0),
  current_amount numeric(14,2) DEFAULT 0 CHECK (current_amount >= 0),
  target_date date,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

-- 6. Calendar & Scheduling Events
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  title text NOT NULL,
  event_date date NOT NULL,
  start_time text,
  end_time text,
  category text NOT NULL DEFAULT 'General',
  location text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- 7. University of Kigali Academic Modules / Courses
CREATE TABLE IF NOT EXISTS public.academic_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  code text NOT NULL,
  name text NOT NULL,
  credits integer DEFAULT 3,
  semester text NOT NULL DEFAULT 'Current',
  lecturer text,
  target_grade text,
  current_grade text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.academic_modules ENABLE ROW LEVEL SECURITY;

-- 8. In-App Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'system',
  is_read boolean DEFAULT false,
  link text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 9. Smart Daily Planner & Session Time Blocks
CREATE TABLE IF NOT EXISTS public.sessions_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  session_type text NOT NULL CHECK (session_type IN ('home', 'studio', 'university')),
  title text NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  scheduled_date date NOT NULL,
  why_it_matters text,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'missed', 'rescheduled')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.sessions_schedule ENABLE ROW LEVEL SECURITY;

-- 10. Practical Laboratory Notebooks
CREATE TABLE IF NOT EXISTS public.practical_labs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  title text NOT NULL,
  discipline text NOT NULL,
  topic text NOT NULL,
  difficulty text NOT NULL DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  learning_objectives text,
  required_tools text,
  prerequisites text,
  step_by_step text,
  commands_snippets text,
  config_examples text,
  errors_encountered text,
  troubleshooting_steps text,
  solutions text,
  results text,
  lessons_learned text,
  personal_notes text,
  evidence_url text,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'needs_improvement')),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.practical_labs ENABLE ROW LEVEL SECURITY;

-- 11. Central Knowledge & Resource Library
CREATE TABLE IF NOT EXISTS public.resource_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL DEFAULT auth.uid(),
  title text NOT NULL,
  resource_type text NOT NULL CHECK (resource_type IN ('pdf', 'document', 'video_link', 'ebook', 'website', 'documentation', 'tutorial', 'snippet', 'tool', 'note')),
  url text,
  category text NOT NULL DEFAULT 'General',
  tags text,
  description text,
  related_discipline text,
  related_session text CHECK (related_session IN ('home', 'studio', 'university', 'general')),
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.resource_library ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 12. Secure Row Level Security Policies
-- Ensures each user can only view, insert, update and delete their own records.
-- ==============================================================================

DO $$
BEGIN
  -- Tasks
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'tasks' AND policyname = 'Users can manage their own tasks') THEN
    CREATE POLICY "Users can manage their own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Projects
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'projects' AND policyname = 'Users can manage their own projects') THEN
    CREATE POLICY "Users can manage their own projects" ON public.projects FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Learning records
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'learning_records' AND policyname = 'Users can manage their own learning records') THEN
    CREATE POLICY "Users can manage their own learning records" ON public.learning_records FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Transactions
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'transactions' AND policyname = 'Users can manage their own transactions') THEN
    CREATE POLICY "Users can manage their own transactions" ON public.transactions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Milestones
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'milestones' AND policyname = 'Users can manage their own milestones') THEN
    CREATE POLICY "Users can manage their own milestones" ON public.milestones FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Habits
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'habits' AND policyname = 'Users can manage their own habits') THEN
    CREATE POLICY "Users can manage their own habits" ON public.habits FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Habit logs
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'habit_logs' AND policyname = 'Users can manage their own habit logs') THEN
    CREATE POLICY "Users can manage their own habit logs" ON public.habit_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Goals
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'goals' AND policyname = 'Users can manage their own goals') THEN
    CREATE POLICY "Users can manage their own goals" ON public.goals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Budgets
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'budgets' AND policyname = 'Users can manage their own budgets') THEN
    CREATE POLICY "Users can manage their own budgets" ON public.budgets FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Savings goals
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'savings_goals' AND policyname = 'Users can manage their own savings goals') THEN
    CREATE POLICY "Users can manage their own savings goals" ON public.savings_goals FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Calendar events
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'calendar_events' AND policyname = 'Users can manage their own calendar events') THEN
    CREATE POLICY "Users can manage their own calendar events" ON public.calendar_events FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Academic modules
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'academic_modules' AND policyname = 'Users can manage their own academic modules') THEN
    CREATE POLICY "Users can manage their own academic modules" ON public.academic_modules FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Notifications
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can manage their own notifications') THEN
    CREATE POLICY "Users can manage their own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Sessions Schedule
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sessions_schedule' AND policyname = 'Users can manage their own sessions schedule') THEN
    CREATE POLICY "Users can manage their own sessions schedule" ON public.sessions_schedule FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Practical Labs
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'practical_labs' AND policyname = 'Users can manage their own practical labs') THEN
    CREATE POLICY "Users can manage their own practical labs" ON public.practical_labs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Resource Library
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resource_library' AND policyname = 'Users can manage their own resource library') THEN
    CREATE POLICY "Users can manage their own resource library" ON public.resource_library FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
