-- ============================================
-- Migration 126: Create Knowledge Tables
-- Purpose: Quản lý bài học kinh nghiệm và các quy chế, chính sách
-- ============================================

-- 1. LESSONS_LEARNED TABLE
CREATE TABLE IF NOT EXISTS public.lessons_learned (
    id TEXT PRIMARY KEY DEFAULT ('LL-' || LPAD(nextval('lessons_learned_seq')::TEXT, 3, '0')),
    project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
    project_name TEXT, -- Fallback if project_id is null
    category TEXT, -- 'Technical', 'Process', 'Communication', 'Financial'
    severity TEXT, -- 'Low', 'Medium', 'High'
    summary TEXT NOT NULL,
    detail TEXT,
    action TEXT,
    author_id TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    author_name TEXT,
    tags TEXT[],
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sequence for LL-xxx format
CREATE SEQUENCE IF NOT EXISTS lessons_learned_seq START 4; -- Start after mock data LL-001, 002, 003

-- 2. ORGANIZATION_POLICIES TABLE
CREATE TABLE IF NOT EXISTS public.organization_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id TEXT NOT NULL, -- e.g., '10', '20', 'raci'
    title TEXT NOT NULL,
    icon TEXT, -- Lucide icon name
    content JSONB NOT NULL, -- Array of PolicyItem
    version TEXT DEFAULT 'P03',
    effective_date DATE DEFAULT '2026-01-01',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lessons_project ON public.lessons_learned(project_id);
CREATE INDEX IF NOT EXISTS idx_lessons_category ON public.lessons_learned(category);
CREATE INDEX IF NOT EXISTS idx_policies_section ON public.organization_policies(section_id);

-- RLS
ALTER TABLE public.lessons_learned ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_policies ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "authenticated_all_lessons" ON public.lessons_learned FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_policies" ON public.organization_policies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_lessons" ON public.lessons_learned FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_policies" ON public.organization_policies FOR ALL TO anon USING (true) WITH CHECK (true);
