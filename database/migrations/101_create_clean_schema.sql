-- ============================================
-- Migration 101: Create Clean Schema
-- Tạo schema database mới, chuẩn chỉnh từ đầu
-- ============================================

-- ========== 1. EMPLOYEES TABLE ==========
CREATE TABLE public.employees (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'Staff',
    department TEXT,
    avatar TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.employees IS 'Nhân viên và thông tin cơ bản';
COMMENT ON COLUMN public.employees.user_id IS 'Link to Supabase Auth user';
COMMENT ON COLUMN public.employees.role IS 'Admin, Leader, Staff, etc.';
COMMENT ON COLUMN public.employees.status IS 'Active, Inactive, On Leave';

-- ========== 2. PROJECTS TABLE ==========
CREATE TABLE public.projects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    client TEXT,
    location TEXT,
    manager_id TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'Planning',
    budget BIGINT DEFAULT 0,
    spent BIGINT DEFAULT 0,
    progress SMALLINT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    start_date DATE,
    deadline DATE,
    thumbnail TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.projects IS 'Dự án BIM';
COMMENT ON COLUMN public.projects.status IS 'Planning, In Progress, Completed, On Hold';
COMMENT ON COLUMN public.projects.budget IS 'Ngân sách dự án (VND)';
COMMENT ON COLUMN public.projects.spent IS 'Đã chi (VND)';
COMMENT ON COLUMN public.projects.progress IS 'Tiến độ (0-100%)';

-- ========== 3. TASKS TABLE ==========
CREATE TABLE public.tasks (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    assignee_id TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    assignee_name TEXT,
    assignee_avatar TEXT,
    assignee_role TEXT,
    status TEXT DEFAULT 'Mở',
    priority TEXT DEFAULT 'Trung bình',
    start_date DATE,
    due_date DATE,
    progress SMALLINT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    phase TEXT,
    description TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.tasks IS 'Công việc trong dự án';
COMMENT ON COLUMN public.tasks.status IS 'Mở, S0-S6, Hoàn thành';
COMMENT ON COLUMN public.tasks.priority IS 'Cao, Trung bình, Thấp';
COMMENT ON COLUMN public.tasks.phase IS 'Xúc tiến, Báo giá, Triển khai, Bàn giao';

-- ========== 4. PROJECT MEMBERS TABLE ==========
CREATE TABLE public.project_members (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    employee_id TEXT NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    role TEXT,
    raci TEXT CHECK (raci IN ('R', 'A', 'C', 'I')),
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, employee_id)
);

COMMENT ON TABLE public.project_members IS 'Thành viên dự án';
COMMENT ON COLUMN public.project_members.role IS 'Leader, Modeler, Coordinator, Reviewer';
COMMENT ON COLUMN public.project_members.raci IS 'RACI matrix: R=Responsible, A=Accountable, C=Consulted, I=Informed';

-- ========== 5. TASK TEMPLATES TABLE ==========
CREATE TABLE public.task_templates (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    phase TEXT NOT NULL,
    task_name TEXT NOT NULL,
    order_index INT NOT NULL,
    default_duration_days INT DEFAULT 5,
    default_assignee_role TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.task_templates IS 'Mẫu công việc tự động cho dự án mới';
COMMENT ON COLUMN public.task_templates.phase IS 'Giai đoạn: Xúc tiến, Báo giá, Triển khai, Bàn giao';
COMMENT ON COLUMN public.task_templates.order_index IS 'Thứ tự tạo task';

-- ========== INDEXES ==========
CREATE INDEX idx_employees_email ON public.employees(email);
CREATE INDEX idx_employees_status ON public.employees(status);

CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_manager ON public.projects(manager_id);
CREATE INDEX idx_projects_code ON public.projects(code);

CREATE INDEX idx_tasks_project ON public.tasks(project_id);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_code ON public.tasks(code);

CREATE INDEX idx_project_members_project ON public.project_members(project_id);
CREATE INDEX idx_project_members_employee ON public.project_members(employee_id);
CREATE INDEX idx_project_members_active ON public.project_members(is_active);

CREATE INDEX idx_task_templates_phase ON public.task_templates(phase);
CREATE INDEX idx_task_templates_active ON public.task_templates(is_active);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Clean schema created successfully!';
    RAISE NOTICE '   Tables: employees, projects, tasks, project_members, task_templates';
    RAISE NOTICE '   Indexes: 14 performance indexes created';
    RAISE NOTICE '========================================';
END $$;
