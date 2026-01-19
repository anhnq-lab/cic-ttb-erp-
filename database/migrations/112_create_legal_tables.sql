-- ============================================
-- Migration 112: Create Legal & Compliance Tables
-- Quản lý giấy phép, chứng nhận và kiểm tra tuân thủ
-- ============================================

-- ========== 1. PROJECT LEGAL DOCUMENTS ==========
CREATE TABLE IF NOT EXISTS public.project_legal_documents (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    
    -- Document Info
    document_type TEXT NOT NULL, -- 'license', 'permit', 'approval', 'certificate', 'contract'
    document_name TEXT NOT NULL,
    document_number TEXT,
    
    -- Issuing Authority
    issuing_authority TEXT,
    issued_by TEXT,
    issue_date DATE,
    expiry_date DATE,
    
    -- Status
    status TEXT DEFAULT 'valid', -- 'valid', 'expired', 'pending', 'rejected'
    
    -- Files & Notes
    file_url TEXT,
    file_path TEXT,
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT REFERENCES public.employees(id)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_legal_docs_project ON public.project_legal_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_legal_docs_type ON public.project_legal_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_legal_docs_status ON public.project_legal_documents(status);

-- ========== 2. PROJECT COMPLIANCE CHECKS ==========
CREATE TABLE IF NOT EXISTS public.project_compliance_checks (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    
    -- Check Info
    check_type TEXT NOT NULL, -- 'safety', 'environmental', 'quality', 'legal', 'financial'
    check_name TEXT NOT NULL,
    check_date DATE NOT NULL,
    
    -- Inspector
    inspector_id TEXT REFERENCES public.employees(id),
    inspector_name TEXT,
    inspector_organization TEXT,
    
    -- Results
    status TEXT DEFAULT 'pending', -- 'passed', 'failed', 'pending', 'conditional'
    score NUMERIC(5,2), -- 0-100
    
    -- Findings
    findings TEXT,
    violations TEXT[],
    recommendations TEXT[],
    actions_required TEXT,
    deadline DATE,
    
    -- Follow-up
    is_resolved BOOLEAN DEFAULT false,
    resolved_date DATE,
    resolved_by TEXT REFERENCES public.employees(id),
    
    -- Files
    report_url TEXT,
    photos TEXT[],
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_compliance_project ON public.project_compliance_checks(project_id);
CREATE INDEX IF NOT EXISTS idx_compliance_type ON public.project_compliance_checks(check_type);
CREATE INDEX IF NOT EXISTS idx_compliance_status ON public.project_compliance_checks(status);
CREATE INDEX IF NOT EXISTS idx_compliance_date ON public.project_compliance_checks(check_date);

-- ========== 3. RLS POLICIES ==========
ALTER TABLE public.project_legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_compliance_checks ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access
CREATE POLICY "authenticated_all_legal_docs" ON public.project_legal_documents 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_all_compliance" ON public.project_compliance_checks 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow anonymous read (for dev, restrict in production)
CREATE POLICY "anon_read_legal_docs" ON public.project_legal_documents 
    FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_compliance" ON public.project_compliance_checks 
    FOR SELECT TO anon USING (true);

-- Allow anonymous write (for dev, restrict in production)
CREATE POLICY "anon_write_legal_docs" ON public.project_legal_documents 
    FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_write_compliance" ON public.project_compliance_checks 
    FOR ALL TO anon USING (true) WITH CHECK (true);

-- ========== 4. COMMENTS ==========
COMMENT ON TABLE public.project_legal_documents IS 'Quản lý giấy phép, chứng nhận pháp lý của dự án';
COMMENT ON TABLE public.project_compliance_checks IS 'Kiểm tra tuân thủ an toàn, môi trường, chất lượng';

SELECT '✅ Legal & Compliance tables created successfully!' as message;
