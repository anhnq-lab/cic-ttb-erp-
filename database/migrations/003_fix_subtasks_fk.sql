-- ============================================
-- FIX: Subtasks and Task Comments FK Error
-- Run this AFTER the main schema if you get errors
-- ============================================

-- Drop problematic tables if they exist
DROP TABLE IF EXISTS public.subtasks CASCADE;
DROP TABLE IF EXISTS public.task_comments CASCADE;

-- Recreate with TEXT type to match tasks.id
CREATE TABLE IF NOT EXISTS public.subtasks (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    task_id TEXT REFERENCES public.tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    assignee_id TEXT,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.task_comments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    task_id TEXT REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id TEXT,
    user_name TEXT,
    user_avatar TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow authenticated read" ON public.subtasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON public.subtasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON public.subtasks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete" ON public.subtasks FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read" ON public.task_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert" ON public.task_comments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated delete" ON public.task_comments FOR DELETE TO authenticated USING (true);

-- INDEX
CREATE INDEX IF NOT EXISTS idx_subtasks_task ON public.subtasks(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_task ON public.task_comments(task_id);
