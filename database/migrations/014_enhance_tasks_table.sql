-- ============================================
-- Migration 014: Enhance Tasks Table for Production
-- Bổ sung columns thiếu để support đầy đủ tính năng
-- ============================================

-- Add missing columns to tasks table
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS phase TEXT,
ADD COLUMN IF NOT EXISTS parent_task_id TEXT REFERENCES public.tasks(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS estimated_hours DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS actual_hours DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS comments JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS subtasks JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS checklist_logs JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS deliverables JSONB DEFAULT '[]'::jsonb;

-- Add comment
COMMENT ON COLUMN public.tasks.phase IS 'Project phase: Xúc tiến Dự án, Báo giá, Chuẩn bị Triển khai, etc.';
COMMENT ON COLUMN public.tasks.parent_task_id IS 'Parent task for subtasks (task hierarchy)';
COMMENT ON COLUMN public.tasks.estimated_hours IS 'Estimated hours for completion';
COMMENT ON COLUMN public.tasks.actual_hours IS 'Actual hours spent';
COMMENT ON COLUMN public.tasks.description IS 'Detailed task description';
COMMENT ON COLUMN public.tasks.comments IS 'Task comments stored as JSONB array';
COMMENT ON COLUMN public.tasks.attachments IS 'File attachments metadata';
COMMENT ON COLUMN public.tasks.subtasks IS 'Subtasks stored as JSONB array';
COMMENT ON COLUMN public.tasks.checklist_logs IS 'Quality checklist logs';
COMMENT ON COLUMN public.tasks.deliverables IS 'Task deliverables';
