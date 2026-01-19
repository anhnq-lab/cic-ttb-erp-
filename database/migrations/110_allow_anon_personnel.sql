-- Migration 110: Allow anon access to employees and project_members
-- This enables data integration and seeding for development

-- Employees
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_employees" ON public.employees;
CREATE POLICY "anon_all_employees" ON public.employees FOR ALL TO anon USING (true) WITH CHECK (true);

-- Project Members
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_project_members" ON public.project_members;
CREATE POLICY "anon_all_project_members" ON public.project_members FOR ALL TO anon USING (true) WITH CHECK (true);

DO $$
BEGIN
    RAISE NOTICE '✅ RLS policies for employees and project_members updated to allow anon access.';
END $$;
