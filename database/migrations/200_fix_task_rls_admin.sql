-- ============================================
-- Migration 200: Fix Task RLS for Admins
-- Cho phép Admin xem tất cả tasks mà không cần là assignee/member
-- ============================================

-- 1. Update SELECT Policy for TASKS
DROP POLICY IF EXISTS "tasks_select_policy" ON tasks;

CREATE POLICY "tasks_select_policy"
ON tasks FOR SELECT
USING (
    deleted_at IS NULL
    AND (
        -- Development mode: allow all if no user context
        current_user_employee_id() IS NULL
        
        OR
        
        -- User is assignee
        assignee_id = current_user_employee_id()
        
        OR
        
        -- User is project manager
        project_id IN (
            SELECT id FROM projects 
            WHERE manager_id = current_user_employee_id()
        )
        
        OR
        
        -- User is project member
        project_id IN (
            SELECT project_id FROM project_members 
            WHERE employee_id = current_user_employee_id() 
            AND is_active = TRUE
        )
        
        OR
        
        -- ADMIN BYPASS (New)
        current_user_employee_id() IN (
            SELECT id FROM employees WHERE role = 'Admin'
        )
    )
);

COMMENT ON POLICY "tasks_select_policy" ON tasks IS 'User có thể xem task nếu là assignee, PM, thành viên dự án, hoặc ADMIN';

-- 2. Update SELECT Policy for TASK_ATTACHMENTS (to be consistent)
DROP POLICY IF EXISTS "attachments_select_policy" ON task_attachments;

CREATE POLICY "attachments_select_policy"
ON task_attachments FOR SELECT
USING (
    deleted_at IS NULL
    AND task_id IN (
        SELECT id FROM tasks WHERE deleted_at IS NULL
    )
    AND (
        current_user_employee_id() IS NULL
        OR can_user_access_task(current_user_employee_id(), task_id)
        OR current_user_employee_id() IN (SELECT id FROM employees WHERE role = 'Admin') -- Admin Bypass
    )
);

-- 3. Update SELECT Policy for TASK_COMMENTS
DROP POLICY IF EXISTS "comments_select_policy" ON task_comments;

CREATE POLICY "comments_select_policy"
ON task_comments FOR SELECT
USING (
    deleted_at IS NULL
    AND (
        current_user_employee_id() IS NULL
        OR can_user_access_task(current_user_employee_id(), task_id)
        OR current_user_employee_id() IN (SELECT id FROM employees WHERE role = 'Admin') -- Admin Bypass
    )
);

-- 4. Update SELECT Policy for TASK_HISTORY
DROP POLICY IF EXISTS "history_select_policy" ON task_history;

CREATE POLICY "history_select_policy"
ON task_history FOR SELECT
USING (
    current_user_employee_id() IS NULL
    OR can_user_access_task(current_user_employee_id(), task_id)
    OR current_user_employee_id() IN (SELECT id FROM employees WHERE role = 'Admin') -- Admin Bypass
);

DO $$
BEGIN
    RAISE NOTICE '✅ Fixed RLS policies for Admin access on tasks and related tables.';
END $$;
