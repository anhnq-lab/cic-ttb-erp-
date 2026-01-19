-- Clean SQL migration 107
CREATE TABLE IF NOT EXISTS public.project_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    salary_type TEXT,
    description TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Pending',
    spender TEXT,
    personnel_id TEXT REFERENCES public.project_members(id) ON DELETE SET NULL,
    man_hours NUMERIC(10, 2),
    hourly_rate NUMERIC(15, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_costs_project_id ON public.project_costs(project_id);

CREATE TABLE IF NOT EXISTS public.timesheet_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    employee_id TEXT REFERENCES public.employees(id) ON DELETE CASCADE,
    task_id TEXT REFERENCES public.tasks(id) ON DELETE SET NULL,
    sub_task_id UUID,
    date DATE NOT NULL,
    hours NUMERIC(5, 2) NOT NULL DEFAULT 0,
    work_type TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_timesheet_logs_project_id ON public.timesheet_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_timesheet_logs_date ON public.timesheet_logs(date);

ALTER TABLE public.project_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timesheet_logs ENABLE ROW LEVEL SECURITY;

-- Xóa policy cũ nếu có để tránh lỗi
DROP POLICY IF EXISTS "Allow anon read project_costs" ON public.project_costs;
DROP POLICY IF EXISTS "Allow anon write project_costs" ON public.project_costs;
CREATE POLICY "Allow anon read project_costs" ON public.project_costs FOR SELECT USING (true);
CREATE POLICY "Allow anon write project_costs" ON public.project_costs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon read timesheet_logs" ON public.timesheet_logs;
DROP POLICY IF EXISTS "Allow anon write timesheet_logs" ON public.timesheet_logs;
CREATE POLICY "Allow anon read timesheet_logs" ON public.timesheet_logs FOR SELECT USING (true);
CREATE POLICY "Allow anon write timesheet_logs" ON public.timesheet_logs FOR ALL USING (true) WITH CHECK (true);
