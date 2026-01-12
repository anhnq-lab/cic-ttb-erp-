-- ============================================
-- Task Management Enhancements Migration
-- Adds: estimated_hours, description, actual_completed_at
-- Creates: task_history, task_attachments tables
-- ============================================

-- Add new columns to tasks table
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS estimated_hours DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS actual_completed_at TIMESTAMPTZ;

-- ============================================
-- TASK HISTORY TABLE
-- Tracks all changes to tasks
-- ============================================
CREATE TABLE IF NOT EXISTS public.task_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    task_id TEXT NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_by TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_task_history_task ON public.task_history(task_id);
CREATE INDEX IF NOT EXISTS idx_task_history_changed_at ON public.task_history(changed_at DESC);

-- ============================================
-- TASK ATTACHMENTS TABLE
-- Stores file attachments for tasks
-- ============================================
CREATE TABLE IF NOT EXISTS public.task_attachments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    task_id TEXT NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    uploaded_by TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_attachments_task ON public.task_attachments(task_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.task_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;

-- Task History Policies
CREATE POLICY "task_history_select" ON public.task_history 
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "task_history_insert" ON public.task_history 
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow anonymous read for task history
CREATE POLICY "anon_read_task_history" ON public.task_history 
    FOR SELECT TO anon USING (true);

-- Task Attachments Policies
CREATE POLICY "task_attachments_select" ON public.task_attachments 
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "task_attachments_insert" ON public.task_attachments 
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "task_attachments_delete" ON public.task_attachments 
    FOR DELETE TO authenticated USING (true);

-- Allow anonymous read for attachments
CREATE POLICY "anon_read_task_attachments" ON public.task_attachments 
    FOR SELECT TO anon USING (true);

-- ============================================
-- HELPER FUNCTION: Log Task Changes
-- ============================================
CREATE OR REPLACE FUNCTION log_task_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only log if there are actual changes
    IF (TG_OP = 'UPDATE') THEN
        -- Log status changes
        IF (OLD.status IS DISTINCT FROM NEW.status) THEN
            INSERT INTO public.task_history (task_id, field_name, old_value, new_value)
            VALUES (NEW.id, 'status', OLD.status, NEW.status);
        END IF;
        
        -- Log progress changes
        IF (OLD.progress IS DISTINCT FROM NEW.progress) THEN
            INSERT INTO public.task_history (task_id, field_name, old_value, new_value)
            VALUES (NEW.id, 'progress', OLD.progress::text, NEW.progress::text);
        END IF;
        
        -- Log assignee changes
        IF (OLD.assignee_id IS DISTINCT FROM NEW.assignee_id) THEN
            INSERT INTO public.task_history (task_id, field_name, old_value, new_value)
            VALUES (NEW.id, 'assignee_id', OLD.assignee_id, NEW.assignee_id);
        END IF;
        
        -- Update actual_completed_at when status becomes 'Hoàn thành'
        IF (NEW.status = 'Hoàn thành' AND OLD.status != 'Hoàn thành') THEN
            NEW.actual_completed_at = NOW();
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic history logging
DROP TRIGGER IF EXISTS trigger_log_task_changes ON public.tasks;
CREATE TRIGGER trigger_log_task_changes
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION log_task_change();

-- ============================================
-- TIMESHEET LOGS TABLE (if not exists)
-- Links timesheet entries to tasks
-- ============================================
CREATE TABLE IF NOT EXISTS public.timesheet_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    employee_id TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    task_id TEXT REFERENCES public.tasks(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    hours DECIMAL(4,2) NOT NULL CHECK (hours > 0 AND hours <= 24),
    work_type TEXT,
    description TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timesheet_logs_project ON public.timesheet_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_logs_employee ON public.timesheet_logs(employee_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_logs_task ON public.timesheet_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_logs_date ON public.timesheet_logs(date DESC);

-- Timesheet Logs RLS
ALTER TABLE public.timesheet_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "timesheet_logs_select" ON public.timesheet_logs 
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "timesheet_logs_insert" ON public.timesheet_logs 
    FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "timesheet_logs_update" ON public.timesheet_logs 
    FOR UPDATE TO authenticated USING (true);
CREATE POLICY "timesheet_logs_delete" ON public.timesheet_logs 
    FOR DELETE TO authenticated USING (true);

-- Allow anonymous access
CREATE POLICY "anon_read_timesheet_logs" ON public.timesheet_logs 
    FOR SELECT TO anon USING (true);
CREATE POLICY "anon_write_timesheet_logs" ON public.timesheet_logs 
    FOR INSERT TO anon WITH CHECK (true);

-- Auto-update trigger for timesheet_logs
CREATE TRIGGER update_timesheet_logs_updated_at 
    BEFORE UPDATE ON public.timesheet_logs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'Task Management Enhancement Migration Completed! ✅' as message;
SELECT 'Created: task_history, task_attachments, timesheet_logs tables' as info;
SELECT 'Added: estimated_hours, description, actual_completed_at to tasks' as info2;
