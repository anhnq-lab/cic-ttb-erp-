-- ============================================
-- CONSOLIDATED MIGRATION SCRIPT
-- Tổng hợp tất cả migrations 014-016 để chạy 1 lần
-- Version: Simplified (No RLS)
-- ============================================

-- ========== PART 1: Enhance Tasks Table ==========
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

-- ========== PART 2: Add Performance Indexes ==========

-- Tasks indexes
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_parent_task_id ON public.tasks(parent_task_id);

-- Contracts indexes (removed customer_id - doesn't exist)
CREATE INDEX IF NOT EXISTS idx_contracts_project_id ON public.contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);

-- Payment milestones indexes
CREATE INDEX IF NOT EXISTS idx_payment_milestones_contract_id ON public.payment_milestones(contract_id);
CREATE INDEX IF NOT EXISTS idx_payment_milestones_status ON public.payment_milestones(status);

-- Payment transactions indexes
CREATE INDEX IF NOT EXISTS idx_payment_transactions_contract_id ON public.payment_transactions(contract_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_milestone_id ON public.payment_transactions(milestone_id);

-- Employees indexes
CREATE INDEX IF NOT EXISTS idx_employees_department ON public.employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_role ON public.employees(role);
CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(status);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_manager_id ON public.projects(manager_id);

-- ========== PART 3: Create Project Members Table ==========

CREATE TABLE IF NOT EXISTS public.project_members (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    employee_id TEXT NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    role TEXT,
    raci TEXT,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, employee_id)
);

-- Project members indexes
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON public.project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_employee_id ON public.project_members(employee_id);
CREATE INDEX IF NOT EXISTS idx_project_members_is_active ON public.project_members(is_active);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Migrations completed successfully!';
    RAISE NOTICE '   - Tasks table enhanced';
    RAISE NOTICE '   - Performance indexes created';
    RAISE NOTICE '   - Project members table created';
    RAISE NOTICE '========================================';
END $$;
