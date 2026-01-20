-- ============================================
-- Migration 131: FORCE DISABLE RLS (UPDATED)
-- Mục đích: TẮT HOÀN TOÀN tính năng bảo mật dòng (RLS)
-- Để đảm bảo mọi user (kể cả chưa login) đều xem được data
-- CHỈ DÙNG CHO DEBUG / DEV
-- ============================================

-- Tắt RLS cho các bảng chắc chắn tồn tại
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_logs DISABLE ROW LEVEL SECURITY;

-- CRM Tables (Commented out until they are created)
-- ALTER TABLE public.crm_contacts DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.crm_activities DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.crm_opportunities DISABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    RAISE NOTICE '✅ Đã TẮT RLS cho các bảng chính (Tasks, Projects, Employees...)!';
    RAISE NOTICE '   Hãy thử reload lại trang Quản lý công việc ngay.';
END $$;
