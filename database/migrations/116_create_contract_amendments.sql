-- ============================================
-- Migration 116: Create Contract Amendments Table
-- Quản lý phụ lục hợp đồng
-- ============================================

CREATE TABLE IF NOT EXISTS public.contract_amendments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    contract_id TEXT REFERENCES public.contracts(id) ON DELETE CASCADE,
    
    amendment_number INT NOT NULL,
    amendment_date DATE NOT NULL,
    description TEXT,
    
    value_change NUMERIC DEFAULT 0, -- Giá trị thay đổi (+/-)
    new_total_value NUMERIC, -- Giá trị hợp đồng sau điều chỉnh
    
    approved_by TEXT REFERENCES public.employees(id),
    file_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_contract_amendments_contract ON public.contract_amendments(contract_id);

-- RLS
ALTER TABLE public.contract_amendments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_all_contract_amendments" ON public.contract_amendments 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "anon_read_contract_amendments" ON public.contract_amendments 
    FOR SELECT TO anon USING (true);
    
-- Comment
COMMENT ON TABLE public.contract_amendments IS 'Phụ lục hợp đồng và điều chỉnh';

SELECT '✅ Created contract_amendments table' as message;
