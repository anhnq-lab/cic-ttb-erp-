-- ============================================
-- Migration 120: Task Management Enhancements
-- Thêm soft delete, audit trail, và cải tiến task management
-- ============================================

-- ========== 1. ADD SOFT DELETE COLUMNS ==========
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS deleted_by TEXT REFERENCES employees(id) ON DELETE SET NULL;

COMMENT ON COLUMN tasks.deleted_at IS 'Timestamp khi task bị xóa (soft delete)';
COMMENT ON COLUMN tasks.deleted_by IS 'ID nhân viên thực hiện xóa';

-- ========== 2. ADD AUDIT COLUMNS ==========
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS last_modified_by TEXT REFERENCES employees(id) ON DELETE SET NULL;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

COMMENT ON COLUMN tasks.last_modified_by IS 'ID nhân viên thực hiện thay đổi gần nhất';
COMMENT ON COLUMN tasks.version IS 'Version number để track changes (optimistic locking)';

-- ========== 3. CREATE/UPDATE TASK_ATTACHMENTS TABLE ==========
CREATE TABLE IF NOT EXISTS task_attachments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    uploaded_by TEXT REFERENCES employees(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    deleted_by TEXT REFERENCES employees(id) ON DELETE SET NULL
);

COMMENT ON TABLE task_attachments IS 'File đính kèm của task (PDF, DOCX, hình ảnh...)';
COMMENT ON COLUMN task_attachments.file_size IS 'Kích thước file (bytes)';
COMMENT ON COLUMN task_attachments.deleted_at IS 'Soft delete timestamp';

-- ========== 4. CREATE/UPDATE TASK_HISTORY TABLE ==========
CREATE TABLE IF NOT EXISTS task_history (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_by TEXT REFERENCES employees(id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

COMMENT ON TABLE task_history IS 'Lịch sử thay đổi task (audit trail)';
COMMENT ON COLUMN task_history.field_name IS 'Tên trường bị thay đổi (status, assignee_id, ...)';

-- ========== 5. CREATE TASK_COMMENTS TABLE ==========
CREATE TABLE IF NOT EXISTS task_comments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    task_id TEXT NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES employees(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ DEFAULT NULL
);

COMMENT ON TABLE task_comments IS 'Bình luận/thảo luận trong task';

-- ========== 6. CREATE INDEXES FOR PERFORMANCE ==========
CREATE INDEX IF NOT EXISTS idx_tasks_deleted_at ON tasks(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_status ON tasks(assignee_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_project_status ON tasks(project_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date) WHERE deleted_at IS NULL AND status != 'Hoàn thành';

CREATE INDEX IF NOT EXISTS idx_task_attachments_task ON task_attachments(task_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_task_history_task ON task_history(task_id);
CREATE INDEX IF NOT EXISTS idx_task_comments_task ON task_comments(task_id) WHERE deleted_at IS NULL;

-- ========== 7. CREATE TRIGGER FOR AUTO HISTORY LOGGING ==========
CREATE OR REPLACE FUNCTION log_task_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_field TEXT;
    v_old TEXT;
    v_new TEXT;
BEGIN
    -- Chỉ log khi UPDATE, không log INSERT/DELETE
    IF TG_OP = 'UPDATE' THEN
        -- Log status change
        IF OLD.status IS DISTINCT FROM NEW.status THEN
            INSERT INTO task_history (task_id, field_name, old_value, new_value, changed_by, changed_at)
            VALUES (NEW.id, 'status', OLD.status, NEW.status, NEW.last_modified_by, NOW());
        END IF;
        
        -- Log assignee change
        IF OLD.assignee_id IS DISTINCT FROM NEW.assignee_id THEN
            INSERT INTO task_history (task_id, field_name, old_value, new_value, changed_by, changed_at)
            VALUES (NEW.id, 'assignee_id', OLD.assignee_id, NEW.assignee_id, NEW.last_modified_by, NOW());
        END IF;
        
        -- Log priority change
        IF OLD.priority IS DISTINCT FROM NEW.priority THEN
            INSERT INTO task_history (task_id, field_name, old_value, new_value, changed_by, changed_at)
            VALUES (NEW.id, 'priority', OLD.priority, NEW.priority, NEW.last_modified_by, NOW());
        END IF;
        
        -- Log due_date change
        IF OLD.due_date IS DISTINCT FROM NEW.due_date THEN
            INSERT INTO task_history (task_id, field_name, old_value, new_value, changed_by, changed_at)
            VALUES (NEW.id, 'due_date', OLD.due_date::TEXT, NEW.due_date::TEXT, NEW.last_modified_by, NOW());
        END IF;
        
        -- Log phase change
        IF OLD.phase IS DISTINCT FROM NEW.phase THEN
            INSERT INTO task_history (task_id, field_name, old_value, new_value, changed_by, changed_at)
            VALUES (NEW.id, 'phase', OLD.phase, NEW.phase, NEW.last_modified_by, NOW());
        END IF;
        
        -- Increment version
        NEW.version = OLD.version + 1;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger nếu đã tồn tại
DROP TRIGGER IF EXISTS trg_log_task_changes ON tasks;

-- Tạo trigger
CREATE TRIGGER trg_log_task_changes
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION log_task_changes();

-- ========== 8. CREATE HELPER VIEW FOR TASK PERMISSIONS ==========
CREATE OR REPLACE VIEW task_permissions AS
SELECT 
    t.id as task_id,
    t.project_id,
    t.assignee_id,
    p.manager_id as project_manager_id,
    array_agg(DISTINCT pm.employee_id) FILTER (WHERE pm.employee_id IS NOT NULL) as project_member_ids
FROM tasks t
LEFT JOIN projects p ON t.project_id = p.id
LEFT JOIN project_members pm ON p.id = pm.project_id AND pm.is_active = TRUE
WHERE t.deleted_at IS NULL
GROUP BY t.id, t.project_id, t.assignee_id, p.manager_id;

COMMENT ON VIEW task_permissions IS 'Helper view để check quyền truy cập task';

-- ========== 9. CREATE FUNCTION TO CHECK TASK ACCESS ==========
CREATE OR REPLACE FUNCTION can_user_access_task(
    p_user_id TEXT,
    p_task_id TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_has_access BOOLEAN;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM task_permissions tp
        WHERE tp.task_id = p_task_id
        AND (
            tp.assignee_id = p_user_id OR
            tp.project_manager_id = p_user_id OR
            p_user_id = ANY(tp.project_member_ids)
        )
    ) INTO v_has_access;
    
    RETURN v_has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION can_user_access_task IS 'Check xem user có quyền truy cập task không';

-- ========== 10. CREATE FUNCTION TO SOFT DELETE TASK ==========
CREATE OR REPLACE FUNCTION soft_delete_task(
    p_task_id TEXT,
    p_deleted_by TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE tasks
    SET deleted_at = NOW(),
        deleted_by = p_deleted_by,
        updated_at = NOW()
    WHERE id = p_task_id;
    
    -- Log deletion
    INSERT INTO task_history (task_id, field_name, old_value, new_value, changed_by, changed_at, notes)
    VALUES (p_task_id, 'deleted', 'false', 'true', p_deleted_by, NOW(), 'Task soft deleted');
END;
$$ LANGUAGE plpgsql;

-- ========== 11. CREATE FUNCTION TO RESTORE TASK ==========
CREATE OR REPLACE FUNCTION restore_task(
    p_task_id TEXT,
    p_restored_by TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE tasks
    SET deleted_at = NULL,
        deleted_by = NULL,
        updated_at = NOW(),
        last_modified_by = p_restored_by
    WHERE id = p_task_id;
    
    -- Log restoration
    INSERT INTO task_history (task_id, field_name, old_value, new_value, changed_by, changed_at, notes)
    VALUES (p_task_id, 'deleted', 'true', 'false', p_restored_by, NOW(), 'Task restored');
END;
$$ LANGUAGE plpgsql;

-- ========== SUCCESS MESSAGE ==========
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Migration 120 completed successfully!';
    RAISE NOTICE '   - Added soft delete columns';
    RAISE NOTICE '   - Added audit trail columns';
    RAISE NOTICE '   - Created task_attachments table';
    RAISE NOTICE '   - Created task_history table';
    RAISE NOTICE '   - Created task_comments table';
    RAISE NOTICE '   - Created auto-logging trigger';
    RAISE NOTICE '   - Created helper functions';
    RAISE NOTICE '   - Created 8 performance indexes';
    RAISE NOTICE '========================================';
END $$;
