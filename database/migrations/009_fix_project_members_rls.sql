-- Enable RLS on project_members
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

-- Create broad policy for development (Select, Insert, Update, Delete)
CREATE POLICY "Enable all access for all users" ON public.project_members
    FOR ALL USING (true) WITH CHECK (true);

-- Ensure tasks table also has correct policies if not already
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all access for all users" ON public.tasks
    FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions to anon and authenticated roles
GRANT ALL ON public.project_members TO anon, authenticated, service_role;
GRANT ALL ON public.tasks TO anon, authenticated, service_role;
GRANT ALL ON public.task_templates TO anon, authenticated, service_role;
