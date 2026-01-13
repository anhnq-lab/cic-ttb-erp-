-- ============================================
-- Migration 017: Production RLS Policies
-- Cập nhật policies cho môi trường production
-- Loại bỏ anonymous access, chỉ authenticated users
-- ============================================

-- ====== TASKS ======
-- Drop existing policies if any
DROP POLICY IF EXISTS "tasks_select" ON public.tasks;
DROP POLICY IF EXISTS "tasks_insert" ON public.tasks;
DROP POLICY IF EXISTS "tasks_update" ON public.tasks;
DROP POLICY IF EXISTS "tasks_delete" ON public.tasks;

-- SELECT: User can see tasks of projects they're member of, or tasks assigned to them
CREATE POLICY "tasks_select_production" ON public.tasks
FOR SELECT TO authenticated
USING (
    -- Tasks in projects user is member of
    project_id IN (
        SELECT project_id FROM public.project_members
        WHERE employee_id = auth.uid() AND is_active = TRUE
    )
    OR
    -- Tasks assigned to user
    assignee_id = auth.uid()
    OR
    -- Admin/Manager can see all
    EXISTS (
        SELECT 1 FROM public.employees
        WHERE id = auth.uid()
        AND role IN ('Admin', 'Giám đốc')
    )
);

-- INSERT: Project members or managers
CREATE POLICY "tasks_insert_production" ON public.tasks
FOR INSERT TO authenticated
WITH CHECK (
    -- Must be project member or admin
    project_id IN (
        SELECT project_id FROM public.project_members
        WHERE employee_id = auth.uid() AND is_active = TRUE
    )
    OR
    EXISTS (
        SELECT 1 FROM public.employees
        WHERE id = auth.uid()
        AND role IN ('Admin', 'Giám đốc', 'Trưởng phòng')
    )
);

-- UPDATE: Task assignee, project members with certain roles, or admins
CREATE POLICY "tasks_update_production" ON public.tasks
FOR UPDATE TO authenticated
USING (
    -- Own tasks
    assignee_id = auth.uid()
    OR
    -- Project leaders/coordinators
    project_id IN (
        SELECT project_id FROM public.project_members
        WHERE employee_id = auth.uid()
        AND is_active = TRUE
        AND role IN ('Leader', 'Coordinator')
    )
    OR
    -- Admins/Managers
    EXISTS (
        SELECT 1 FROM public.employees
        WHERE id = auth.uid()
        AND role IN ('Admin', 'Giám đốc', 'Trưởng phòng')
    )
);

-- DELETE: Admins and project managers only
CREATE POLICY "tasks_delete_production" ON public.tasks
FOR DELETE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.employees
        WHERE id = auth.uid()
        AND role IN ('Admin', 'Giám đốc', 'Trưởng phòng')
    )
);

-- ====== PROJECTS ======
-- Projects are generally viewable but modification restricted

DROP POLICY IF EXISTS "projects_select" ON public.projects;
DROP POLICY IF EXISTS "projects_insert" ON public.projects;
DROP POLICY IF EXISTS "projects_update" ON public.projects;
DROP POLICY IF EXISTS "projects_delete" ON public.projects;

CREATE POLICY "projects_select_production" ON public.projects
FOR SELECT TO authenticated
USING (true); -- All authenticated users can view projects

CREATE POLICY "projects_insert_production" ON public.projects
FOR INSERT TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.employees
        WHERE id = auth.uid()
        AND role IN ('Admin', 'Giám đốc', 'Trưởng phòng')
    )
);

CREATE POLICY "projects_update_production" ON public.projects
FOR UPDATE TO authenticated
USING (
    manager_id = auth.uid()
    OR
    EXISTS (
        SELECT 1 FROM public.employees
        WHERE id = auth.uid()
        AND role IN ('Admin', 'Giám đốc')
    )
);

CREATE POLICY "projects_delete_production" ON public.projects
FOR DELETE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.employees
        WHERE id = auth.uid()
        AND role = 'Admin'
    )
);

-- Comments
COMMENT ON POLICY "tasks_select_production" ON public.tasks IS 'Production: Users see tasks in their projects or assigned to them';
COMMENT ON POLICY "projects_select_production" ON public.projects IS 'Production: All authenticated users can view projects';
