-- ============================================
-- Migration 127: Create Checklist Tables
-- Purpose: Quản lý biểu mẫu kiểm tra (Checklists) và nhật ký thực hiện
-- ============================================

-- 1. CHECKLIST_TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS public.checklist_templates (
    id TEXT PRIMARY KEY DEFAULT ('CL-' || gen_random_uuid()::text),
    name TEXT NOT NULL,
    department_id TEXT, -- e.g., 'BIM', 'MEP'
    items JSONB NOT NULL, -- Array of {id, content, required}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CHECKLIST_LOGS TABLE
CREATE TABLE IF NOT EXISTS public.checklist_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id TEXT REFERENCES public.tasks(id) ON DELETE CASCADE,
    template_id TEXT REFERENCES public.checklist_templates(id) ON DELETE SET NULL,
    results JSONB NOT NULL, -- Array of {item_id, checked, note, attachment_url}
    completed_by TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'Completed', -- 'Draft', 'Completed'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_checklist_task ON public.checklist_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_checklist_template ON public.checklist_logs(template_id);

-- RLS
ALTER TABLE public.checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "authenticated_all_templates" ON public.checklist_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_checklist_logs" ON public.checklist_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_templates" ON public.checklist_templates FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_checklist_logs" ON public.checklist_logs FOR ALL TO anon USING (true) WITH CHECK (true);
