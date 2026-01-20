-- ============================================
-- Migration 128: Consolidated RLS Hardening
-- Purpose: Thắt chặt bảo mật RLS, loại bỏ quyền truy cập ẩn danh (anon)
-- và phân quyền dựa trên vai trò Admin/Staff.
-- ============================================

-- 1. CLEANUP PREVIOUS TEMPORARY POLICIES
-- CRM
DROP POLICY IF EXISTS "anon_all_customers" ON public.customers;
DROP POLICY IF EXISTS "anon_all_crm_contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "anon_all_crm_activities" ON public.crm_activities;
DROP POLICY IF EXISTS "anon_all_crm_opportunities" ON public.crm_opportunities;

-- Knowledge
DROP POLICY IF EXISTS "anon_all_policies" ON public.organization_policies;
DROP POLICY IF EXISTS "anon_all_lessons" ON public.lessons_learned;

-- Checklists
DROP POLICY IF EXISTS "anon_all_templates" ON public.checklist_templates;
DROP POLICY IF EXISTS "anon_all_checklist_logs" ON public.checklist_logs;

-- 2. HARDEN CRM POLICIES (Authenticated Only)
-- Redefine authenticated policies to be more specific if needed, 
-- but for CRM, usually most authenticated staff can view.
-- (No changes needed if already 'TO authenticated USING (true)')

-- 3. HARDEN KNOWLEDGE POLICIES
-- Policies table: Read for all, Write for Admin only
DROP POLICY IF EXISTS "authenticated_all_policies" ON public.organization_policies;

CREATE POLICY "authenticated_read_policies" ON public.organization_policies
FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin_manage_policies" ON public.organization_policies
FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.employees 
        WHERE user_id = auth.uid() AND role = 'Admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.employees 
        WHERE user_id = auth.uid() AND role = 'Admin'
    )
);

-- 4. HARDEN CHECKLIST TEMPLATES
-- Read for all, Write for Admin only
DROP POLICY IF EXISTS "authenticated_all_templates" ON public.checklist_templates;

CREATE POLICY "authenticated_read_templates" ON public.checklist_templates
FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin_manage_templates" ON public.checklist_templates
FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.employees 
        WHERE user_id = auth.uid() AND role = 'Admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.employees 
        WHERE user_id = auth.uid() AND role = 'Admin'
    )
);

-- 5. ENSURE RLS FOR CHECKLIST LOGS
-- Anyone authenticated can create/update logs (for projects they are in, ideally, 
-- but for MVP, global access is ok as long as authenticated)
DROP POLICY IF EXISTS "authenticated_all_checklist_logs" ON public.checklist_logs;

CREATE POLICY "authenticated_manage_checklist_logs" ON public.checklist_logs
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. ENSURE RLS FOR LESSONS LEARNED
DROP POLICY IF EXISTS "authenticated_all_lessons" ON public.lessons_learned;

CREATE POLICY "authenticated_manage_lessons" ON public.lessons_learned
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. CLEANUP ANY OTHER LOOSE ANON POLICIES
-- (Add more here if discovered during audit)
