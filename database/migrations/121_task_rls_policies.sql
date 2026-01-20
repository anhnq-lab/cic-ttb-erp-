-- ============================================
-- Migration 121: Task RLS (Row Level Security) Policies
-- Phân quyền truy cập task dựa trên vai trò
-- ============================================

-- ========== 1. ENABLE RLS ON TASKS TABLE ==========
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE tasks IS 'Tasks table với RLS enabled - phân quyền theo assignee, project manager, project members';

-- ========== 2. DROP EXISTING POLICIES (IF ANY) ==========
DROP POLICY IF EXISTS "tasks_select_policy" ON tasks;
DROP POLICY IF EXISTS "tasks_insert_policy" ON tasks;
DROP POLICY IF EXISTS "tasks_update_policy" ON tasks;
DROP POLICY IF EXISTS "tasks_delete_policy" ON tasks;

-- ========== 3. HELPER FUNCTION: GET CURRENT USER ID ==========
-- Tạm thời dùng function đơn giản, sẽ integrate với Supabase Auth sau
CREATE OR REPLACE FUNCTION current_user_employee_id()
RETURNS TEXT AS $$
BEGIN
    -- TODO: Replace with actual Supabase auth.uid() mapping
    -- For now, return NULL to allow all access (development mode)
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION current_user_employee_id IS 'Lấy employee_id của user hiện tại từ Supabase Auth';

-- ========== 4. SELECT POLICY: View Tasks ==========
-- User có thể XEM task nếu:
-- 1. Là assignee của task
-- 2. Là quản lý dự án
-- 3. Là thành viên dự án
-- 4. Task chưa bị soft delete (deleted_at IS NULL)
CREATE POLICY "tasks_select_policy"
ON tasks FOR SELECT
USING (
    deleted_at IS NULL -- Chỉ hiển thị task chưa xóa
    AND (
        -- Development mode: allow all if no user context
        current_user_employee_id() IS NULL
        
        OR
        
        -- Production mode: check permissions
        (
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
        )
    )
);

COMMENT ON POLICY "tasks_select_policy" ON tasks IS 'User có thể xem task nếu là assignee, PM, hoặc thành viên dự án';

-- ========== 5. INSERT POLICY: Create Tasks ==========
-- User có thể TẠO task nếu:
-- 1. Là quản lý dự án
-- 2. Là thành viên có role Leader/Coordinator
CREATE POLICY "tasks_insert_policy"
ON tasks FOR INSERT
WITH CHECK (
    deleted_at IS NULL -- Không cho insert task đã xóa
    AND (
        -- Development mode: allow all
        current_user_employee_id() IS NULL
        
        OR
        
        -- Production mode: only PM và leaders can create
        project_id IN (
            SELECT id FROM projects 
            WHERE manager_id = current_user_employee_id()
        )
        
        OR
        
        project_id IN (
            SELECT pm.project_id FROM project_members pm
            JOIN employees e ON pm.employee_id = e.id
            WHERE pm.employee_id = current_user_employee_id()
            AND pm.is_active = TRUE
            AND (e.role IN ('Leader', 'Manager', 'Coordinator') OR pm.role IN ('Leader', 'Coordinator'))
        )
    )
);

COMMENT ON POLICY "tasks_insert_policy" ON tasks IS 'Chỉ PM và leaders có thể tạo task mới';

-- ========== 6. UPDATE POLICY: Edit Tasks ==========
-- User có thể SỬA task nếu:
-- 1. Là assignee (có thể update status, progress, comments...)
-- 2. Là quản lý dự án (có thể update tất cả)
-- 3. Là leader/coordinator của dự án
CREATE POLICY "tasks_update_policy"
ON tasks FOR UPDATE
USING (
    deleted_at IS NULL -- Không cho update task đã xóa
    AND (
        -- Development mode: allow all
        current_user_employee_id() IS NULL
        
        OR
        
        -- Assignee can update their own tasks
        assignee_id = current_user_employee_id()
        
        OR
        
        -- Project manager can update all tasks
        project_id IN (
            SELECT id FROM projects 
            WHERE manager_id = current_user_employee_id()
        )
        
        OR
        
        -- Leaders can update tasks in their projects
        project_id IN (
            SELECT pm.project_id FROM project_members pm
            JOIN employees e ON pm.employee_id = e.id
            WHERE pm.employee_id = current_user_employee_id()
            AND pm.is_active = TRUE
            AND (e.role IN ('Leader', 'Manager') OR pm.role = 'Leader')
        )
    )
)
WITH CHECK (
    deleted_at IS NULL -- Không cho set deleted_at từ UPDATE (phải dùng function soft_delete_task)
);

COMMENT ON POLICY "tasks_update_policy" ON tasks IS 'Assignee, PM, và leaders có thể update task';

-- ========== 7. DELETE POLICY: Soft Delete Tasks ==========
-- User có thể XÓA (soft delete) task nếu:
-- 1. Là quản lý dự án
-- 2. Hoặc là admin
-- NOTE: Thực tế nên dùng function soft_delete_task() thay vì DELETE trực tiếp
CREATE POLICY "tasks_delete_policy"
ON tasks FOR DELETE
USING (
    -- Development mode: allow all
    current_user_employee_id() IS NULL
    
    OR
    
    -- Only project managers can delete
    project_id IN (
        SELECT id FROM projects 
        WHERE manager_id = current_user_employee_id()
    )
    
    OR
    
    -- Or admin users
    current_user_employee_id() IN (
        SELECT id FROM employees WHERE role = 'Admin'
    )
);

COMMENT ON POLICY "tasks_delete_policy" ON tasks IS 'Chỉ PM và Admin có thể xóa task';

-- ========== 8. RLS FOR TASK_ATTACHMENTS ==========
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;

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
    )
);

CREATE POLICY "attachments_insert_policy"
ON task_attachments FOR INSERT
WITH CHECK (
    deleted_at IS NULL
    AND (
        current_user_employee_id() IS NULL
        OR can_user_access_task(current_user_employee_id(), task_id)
    )
);

CREATE POLICY "attachments_delete_policy"
ON task_attachments FOR DELETE
USING (
    current_user_employee_id() IS NULL
    OR uploaded_by = current_user_employee_id()
    OR task_id IN (SELECT id FROM tasks WHERE project_id IN (SELECT id FROM projects WHERE manager_id = current_user_employee_id()))
);

-- ========== 9. RLS FOR TASK_COMMENTS ==========
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_select_policy"
ON task_comments FOR SELECT
USING (
    deleted_at IS NULL
    AND (
        current_user_employee_id() IS NULL
        OR can_user_access_task(current_user_employee_id(), task_id)
    )
);

CREATE POLICY "comments_insert_policy"
ON task_comments FOR INSERT
WITH CHECK (
    deleted_at IS NULL
    AND (
        current_user_employee_id() IS NULL
        OR can_user_access_task(current_user_employee_id(), task_id)
    )
);

CREATE POLICY "comments_update_policy"
ON task_comments FOR UPDATE
USING (
    deleted_at IS NULL
    AND user_id = current_user_employee_id()
);

CREATE POLICY "comments_delete_policy"
ON task_comments FOR DELETE
USING (
    current_user_employee_id() IS NULL
    OR user_id = current_user_employee_id()
);

-- ========== 10. RLS FOR TASK_HISTORY (READ ONLY) ==========
ALTER TABLE task_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "history_select_policy"
ON task_history FOR SELECT
USING (
    current_user_employee_id() IS NULL
    OR can_user_access_task(current_user_employee_id(), task_id)
);

-- Không cho INSERT/UPDATE/DELETE trực tiếp vào task_history
-- Chỉ trigger mới được insert

-- ========== SUCCESS MESSAGE ==========
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Migration 121 completed successfully!';
    RAISE NOTICE '   - Enabled RLS on tasks table';
    RAISE NOTICE '   - Created SELECT policy (assignee + PM + members)';
    RAISE NOTICE '   - Created INSERT policy (PM + leaders)';
    RAISE NOTICE '   - Created UPDATE policy (assignee + PM + leaders)';
    RAISE NOTICE '   - Created DELETE policy (PM + admin)';
    RAISE NOTICE '   - Enabled RLS on task_attachments';
    RAISE NOTICE '   - Enabled RLS on task_comments';
    RAISE NOTICE '   - Enabled RLS on task_history';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  NOTE: Development mode enabled (allows all access)';
    RAISE NOTICE '   Update current_user_employee_id() for production!';
    RAISE NOTICE '========================================';
END $$;
