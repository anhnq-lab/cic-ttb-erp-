-- ============================================
-- Migration 103: Create Contract & Customer Schema
-- ============================================

-- ========== 1. CUSTOMERS TABLE ==========
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code TEXT UNIQUE,
    name TEXT NOT NULL,
    short_name TEXT,
    type TEXT, -- 'Client', 'Partner', 'Subcontractor'
    tax_code TEXT,
    address TEXT,
    representative TEXT,
    email TEXT,
    phone TEXT,
    status TEXT DEFAULT 'Active',
    tier TEXT DEFAULT 'Standard',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for lookup
CREATE INDEX IF NOT EXISTS idx_customers_code ON public.customers(code);
CREATE INDEX IF NOT EXISTS idx_customers_name ON public.customers(name);

-- ========== 2. CONTRACTS TABLE ==========
CREATE TABLE IF NOT EXISTS public.contracts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code TEXT UNIQUE NOT NULL, -- SoHopDong
    project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
    customer_id TEXT REFERENCES public.customers(id) ON DELETE SET NULL,
    
    -- Basic Info
    name TEXT, -- TenHopDong / Package Name
    type TEXT, -- LoaiHopDong
    status TEXT DEFAULT 'Nháp', -- TrangThai
    
    -- Dates
    signed_date DATE, -- NgayKy
    start_date DATE, -- NgayHieuLuc
    end_date DATE, -- NgayHetHan
    
    -- Financials
    total_value NUMERIC DEFAULT 0, -- GiaTriHopDong
    vat_included BOOLEAN DEFAULT true,
    advance_payment NUMERIC DEFAULT 0,
    paid_value NUMERIC DEFAULT 0, -- TongGiaTriThanhToan (accumulated)
    remaining_value NUMERIC GENERATED ALWAYS AS (total_value - paid_value) STORED,
    
    -- Parties
    side_a_rep TEXT, -- NguoiDaiDienBenA
    side_b_rep TEXT, -- NguoiDaiDienBenB
    
    -- Meta
    file_url TEXT,
    drive_link TEXT,
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contracts_project ON public.contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_customer ON public.contracts(customer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON public.contracts(status);

-- ========== 3. RLS POLICIES ==========
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated read/write
CREATE POLICY "authenticated_all_customers" ON public.customers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_contracts" ON public.contracts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow anonymous read (for dev ease if needed, limit strictly in prod)
CREATE POLICY "anon_read_customers" ON public.customers FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_contracts" ON public.contracts FOR SELECT TO anon USING (true);


SELECT '✅ Contracts and Customers schema created!' as message;
