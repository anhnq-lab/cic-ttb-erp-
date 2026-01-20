-- ============================================
-- Migration 125: Create CRM Tables
-- Purpose: Quản lý khách hàng, liên hệ, hoạt động và cơ hội kinh doanh
-- ============================================

-- 1. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    short_name TEXT,
    type TEXT NOT NULL DEFAULT 'Client', -- 'Client', 'Partner', 'Lead'
    category TEXT, -- 'StateBudget', 'RealEstate', 'Construction', 'Consulting'
    status TEXT DEFAULT 'Active', -- 'Active', 'Inactive', 'Potential'
    representative TEXT,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    tax_code TEXT,
    tier TEXT DEFAULT 'Standard', -- 'Standard', 'Gold', 'VIP'
    total_project_value BIGINT DEFAULT 0,
    logo TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CRM_CONTACTS TABLE
CREATE TABLE IF NOT EXISTS public.crm_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT REFERENCES public.customers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position TEXT,
    phone TEXT,
    email TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    avatar TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CRM_ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS public.crm_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT REFERENCES public.customers(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'Call', 'Meeting', 'Email', 'Presentation'
    subject TEXT NOT NULL,
    activity_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description TEXT,
    result TEXT,
    created_by TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CRM_OPPORTUNITIES TABLE
CREATE TABLE IF NOT EXISTS public.crm_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT REFERENCES public.customers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    value BIGINT DEFAULT 0,
    stage TEXT NOT NULL DEFAULT 'Prospecting', -- 'Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'
    probability INT DEFAULT 0,
    expected_close_date DATE,
    assigned_to TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_code ON public.customers(code);
CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers(status);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_customer ON public.crm_contacts(customer_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_customer ON public.crm_activities(customer_id);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_customer ON public.crm_opportunities(customer_id);

-- RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_opportunities ENABLE ROW LEVEL SECURITY;

-- Temporary Dev Policies (Allow all authenticated)
CREATE POLICY "authenticated_all_customers" ON public.customers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_crm_contacts" ON public.crm_contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_crm_activities" ON public.crm_activities FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_crm_opportunities" ON public.crm_opportunities FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Also allow anon for now as per project pattern in migration 106
CREATE POLICY "anon_all_customers" ON public.customers FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_crm_contacts" ON public.crm_contacts FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_crm_activities" ON public.crm_activities FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_crm_opportunities" ON public.crm_opportunities FOR ALL TO anon USING (true) WITH CHECK (true);
