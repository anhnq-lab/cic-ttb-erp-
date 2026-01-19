-- Migration 105: Fix tasks unique constraint
-- Task codes should be unique per project, not globally

ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_code_key;
ALTER TABLE public.tasks ADD CONSTRAINT tasks_project_code_unique UNIQUE (project_id, code);
