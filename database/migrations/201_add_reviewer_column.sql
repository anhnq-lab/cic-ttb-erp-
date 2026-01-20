-- ============================================
-- Migration 201: Add Reviewer Column to Tasks
-- Fix error: PGRST200 (Could not find a relationship between 'tasks' and 'employees' using 'reviewer_id')
-- ============================================

-- 1. Add column if not exists
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS reviewer_id TEXT REFERENCES public.employees(id) ON DELETE SET NULL;

-- 2. Add index for performance
CREATE INDEX IF NOT EXISTS idx_tasks_reviewer ON public.tasks(reviewer_id);

-- 3. Success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Added reviewer_id column to tasks table!';
    RAISE NOTICE '   This fixes the frontend error when fetching tasks.';
    RAISE NOTICE '========================================';
END $$;
