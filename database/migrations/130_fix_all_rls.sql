-- ============================================
-- Migration 130: FIX ALL RLS (ALLOW ALL)
-- Mục đích: Mở quyền truy cập tất cả bảng để dev không bị chặn
-- ============================================

-- 1. Enable RLS (để policy có hiệu lực, nếu không enable thì mặc định là public HOẶC private tùy version)
-- Tốt nhất là Enable và gán Policy True
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_logs ENABLE ROW LEVEL SECURITY;

-- 2. Drop policies cũ (nếu có) để tránh conflict
DROP POLICY IF EXISTS "Enable all access for tasks" ON public.tasks;
DROP POLICY IF EXISTS "Enable all access for projects" ON public.projects;
DROP POLICY IF EXISTS "Enable all access for employees" ON public.employees;
DROP POLICY IF EXISTS "Enable all access for project_members" ON public.project_members;
DROP POLICY IF EXISTS "Enable all access for task_templates" ON public.task_templates;
DROP POLICY IF EXISTS "Enable all access for checklist_templates" ON public.checklist_templates;
DROP POLICY IF EXISTS "Enable all access for checklist_logs" ON public.checklist_logs;

-- Cũng drop các policy cũ khác nếu có tên khác (cleanup)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.employees;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.employees;
DROP POLICY IF EXISTS "Users can update own profile" ON public.employees;

-- 3. Tạo Policy "ALLOW ALL" (Cho phép tất cả: Select, Insert, Update, Delete)
CREATE POLICY "Enable all access for tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for employees" ON public.employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for project_members" ON public.project_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for task_templates" ON public.task_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for checklist_templates" ON public.checklist_templates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for checklist_logs" ON public.checklist_logs FOR ALL USING (true) WITH CHECK (true);

DO $$
BEGIN
    RAISE NOTICE '✅ Đã mở quyền truy cập (RLS Policies) cho tất cả các bảng chính!';
    RAISE NOTICE '   Giờ App có thể đọc/ghi dữ liệu thoải mái.';
END $$;
