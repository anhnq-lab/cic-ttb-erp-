-- ============================================
-- Migration 204: Ensure Project Visibility
-- Makes projects visible to both anon and authenticated users
-- ============================================

-- 1. Ensure RLS is enabled (or disable it if we want it fully open, but better to have an open policy)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing restrictive policies
DROP POLICY IF EXISTS "projects_select_production" ON public.projects;
DROP POLICY IF EXISTS "projects_select" ON public.projects;

-- 3. Create wide open SELECT policy
CREATE POLICY "projects_read_all" 
ON public.projects FOR SELECT 
TO public 
USING (true);

COMMENT ON POLICY "projects_read_all" ON public.projects IS 'Allows everyone (including anon) to read projects';

-- 4. Do the same for employees (to allow joins)
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "employees_select" ON public.employees;

CREATE POLICY "employees_read_all" 
ON public.employees FOR SELECT 
TO public 
USING (true);

COMMENT ON POLICY "employees_read_all" ON public.employees IS 'Allows everyone to read employee basic info for joins';
