-- =====================================================
-- DISABLE RLS FOR TASK MANAGEMENT TABLES
-- This allows anonymous (frontend) access to task data
-- =====================================================

-- Disable RLS on tasks table
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;

-- Disable RLS on task_history table
ALTER TABLE task_history DISABLE ROW LEVEL SECURITY;

-- Disable RLS on timesheet_logs table
ALTER TABLE timesheet_logs DISABLE ROW LEVEL SECURITY;

-- Disable RLS on projects table (for task joins)
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Disable RLS on employees table (for assignee joins)
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- VERIFICATION: Check RLS status
-- =====================================================
SELECT 
    tablename,
    rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('tasks', 'task_history', 'timesheet_logs', 'projects', 'employees')
ORDER BY tablename;

-- Expected result: All should show "RLS Enabled" = false
-- =====================================================
-- SUCCESS! Frontend can now read data without authentication
-- =====================================================
