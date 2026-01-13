-- ============================================
-- Migration 015: Add Performance Indexes
-- Tối ưu query performance cho production
-- ============================================

-- Tasks table indexes
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_parent_task_id ON public.tasks(parent_task_id);

-- Contracts table indexes
CREATE INDEX IF NOT EXISTS idx_contracts_project_id ON public.contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_customer_id ON public.contracts(customer_id);
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

-- Comments
COMMENT ON INDEX idx_tasks_project_id IS 'Speed up task lookups by project';
COMMENT ON INDEX idx_tasks_assignee_id IS 'Speed up task lookups by assignee';
COMMENT ON INDEX idx_tasks_status IS 'Enable efficient status-based filtering';
