-- ============================================
-- Migration 113: Create Construction & Quality Tables
-- Quản lý nhật ký thi công và kiểm tra chất lượng
-- ============================================

-- ========== 1. CONSTRUCTION LOGS ==========
CREATE TABLE IF NOT EXISTS public.construction_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    
    -- Log Info
    log_date DATE NOT NULL,
    weather TEXT, -- 'Nắng', 'Mưa', 'Nhiều mây', etc.
    temperature NUMERIC(4,1), -- in Celsius
    
    -- Resources
    workers_count INT,
    equipment_used TEXT[], -- Array of strings e.g. ['Máy xúc', 'Cần cẩu']
    
    -- Progress
    work_completed TEXT, -- Description of work done
    issues TEXT, -- Any problems encountered
    
    -- Media
    photos TEXT[], -- Array of URLs
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    logged_by TEXT REFERENCES public.employees(id),
    logged_by_name TEXT -- Cached name for display
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_construction_logs_project ON public.construction_logs(project_id);
CREATE INDEX IF NOT EXISTS idx_construction_logs_date ON public.construction_logs(log_date);

-- ========== 2. QUALITY INSPECTIONS ==========
CREATE TABLE IF NOT EXISTS public.quality_inspections (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    
    -- Inspection Info
    inspection_date DATE NOT NULL,
    inspection_type TEXT, -- 'Vật liệu đầu vào', 'Nghiệm thu công việc', 'Nghiệm thu giai đoạn'
    location TEXT, -- e.g. 'Tầng 1', 'Móng cọc'
    
    -- Inspector
    inspector_id TEXT REFERENCES public.employees(id),
    inspector_name TEXT,
    
    -- Result
    result TEXT DEFAULT 'pending', -- 'passed', 'failed', 'conditional'
    
    -- Details
    findings TEXT, -- Defects found
    actions_required TEXT, -- Remedial actions
    deadline DATE,
    
    -- Follow-up
    is_resolved BOOLEAN DEFAULT false,
    resolved_date DATE,
    
    -- Media
    photos TEXT[],
    report_url TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_quality_inspections_project ON public.quality_inspections(project_id);
CREATE INDEX IF NOT EXISTS idx_quality_inspections_date ON public.quality_inspections(inspection_date);
CREATE INDEX IF NOT EXISTS idx_quality_inspections_result ON public.quality_inspections(result);

-- ========== 3. RLS POLICIES ==========
ALTER TABLE public.construction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quality_inspections ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access
CREATE POLICY "authenticated_all_construction_logs" ON public.construction_logs 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_all_quality_inspections" ON public.quality_inspections 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow anonymous read (for dev)
CREATE POLICY "anon_read_construction_logs" ON public.construction_logs 
    FOR SELECT TO anon USING (true);

CREATE POLICY "anon_read_quality_inspections" ON public.quality_inspections 
    FOR SELECT TO anon USING (true);

-- Allow anonymous write (for dev/seeding)
CREATE POLICY "anon_write_construction_logs" ON public.construction_logs 
    FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_write_quality_inspections" ON public.quality_inspections 
    FOR ALL TO anon USING (true) WITH CHECK (true);

-- ========== 4. COMMENTS ==========
COMMENT ON TABLE public.construction_logs IS 'Nhật ký thi công hàng ngày';
COMMENT ON TABLE public.quality_inspections IS 'Biên bản kiểm tra chất lượng và nghiệm thu';

SELECT '✅ Construction & Quality tables created successfully!' as message;
