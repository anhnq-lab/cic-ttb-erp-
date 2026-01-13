-- ============================================
-- Migration 016: Project Members Table
-- Quản lý thành viên tham gia dự án
-- ============================================

CREATE TABLE IF NOT EXISTS public.project_members (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    employee_id TEXT NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    role TEXT, -- 'Modeler', 'Leader', 'Coordinator', 'Reviewer'
    raci TEXT, -- 'R' (Responsible), 'A' (Accountable), 'C' (Consulted), 'I' (Informed)
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, employee_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON public.project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_employee_id ON public.project_members(employee_id);
CREATE INDEX IF NOT EXISTS idx_project_members_is_active ON public.project_members(is_active);

-- RLS Policies
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- SELECT: Anyone can see project members
CREATE POLICY "project_members_select" ON public.project_members
FOR SELECT TO authenticated
USING (true);

-- INSERT: Project manager or admin can add members
CREATE POLICY "project_members_insert" ON public.project_members
FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.employees
        WHERE id = auth.uid()
        AND role IN ('Admin', 'Giám đốc', 'Trưởng phòng')
    )
);

-- UPDATE: Project manager or admin
CREATE POLICY "project_members_update" ON public.project_members
FOR UPDATE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.employees
        WHERE id = auth.uid()
        AND role IN ('Admin', 'Giám đốc', 'Trưởng phòng')
    )
);

-- DELETE: Admin only
CREATE POLICY "project_members_delete" ON public.project_members
FOR DELETE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.employees
        WHERE id = auth.uid()
        AND role = 'Admin'
    )
);

-- Comments
COMMENT ON TABLE public.project_members IS 'Project team members and their roles';
COMMENT ON COLUMN public.project_members.role IS 'Member role in project: Modeler, Leader, Coordinator, Reviewer';
COMMENT ON COLUMN public.project_members.raci IS 'RACI matrix assignment: R, A, C, or I';
