-- ============================================
-- Migration 100: DROP ALL TABLES (Clean Slate)
-- CẢNH BÁO: Script này sẽ XÓA TOÀN BỘ data!
-- Chỉ chạy khi anh đã backup hoặc chấp nhận mất data
-- ============================================

-- Disable triggers temporarily
SET session_replication_role = 'replica';

-- Drop tables in correct order (reverse of dependencies)
DROP TABLE IF EXISTS public.task_comments CASCADE;
DROP TABLE IF EXISTS public.payment_transactions CASCADE;
DROP TABLE IF EXISTS public.payment_milestones CASCADE;
DROP TABLE IF EXISTS public.subtasks CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.project_members CASCADE;
DROP TABLE IF EXISTS public.contracts CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.task_templates CASCADE;
DROP TABLE IF EXISTS public.employees CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.crm_activities CASCADE;
DROP TABLE IF EXISTS public.crm_contacts CASCADE;
DROP TABLE IF EXISTS public.crm_customers CASCADE;
DROP TABLE IF EXISTS public.crm_opportunities CASCADE;
DROP TABLE IF EXISTS public.task_history CASCADE;
DROP TABLE IF EXISTS public.task_attachments CASCADE;
DROP TABLE IF EXISTS public.project_milestones CASCADE;
DROP TABLE IF EXISTS public.timesheet_logs CASCADE;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Confirmation message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ All tables dropped successfully!';
    RAISE NOTICE '   Database is now clean.';
    RAISE NOTICE '   Ready for new schema.';
    RAISE NOTICE '========================================';
END $$;
