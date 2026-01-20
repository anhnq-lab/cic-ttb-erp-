-- ============================================
-- Migration 118: Create Expenses and Enhanced Payments
-- Purpose: Quản lý Chi phí đầu vào (Expenses) và các bảng liên quan
-- ============================================

-- ========== 1. EXPENSES TABLE (Chi phí đầu vào) ==========
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_code TEXT UNIQUE, -- Mã chi phí (tự sinh hoặc nhập tay)
    
    -- Phân loại
    category TEXT NOT NULL, -- 'Salary', 'Equipment', 'Travel', 'Outsource', 'Office', 'Marketing', 'Other'
    sub_category TEXT, -- Phân loại con chi tiết hơn
    
    -- Thông tin cơ bản
    description TEXT NOT NULL,
    vendor_name TEXT, -- Nhà cung cấp/Người nhận
    
    -- Tài chính
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0, -- Số tiền chưa VAT
    vat_rate NUMERIC(5, 2) DEFAULT 0, -- % VAT (8%, 10%)
    vat_amount NUMERIC(15, 2) GENERATED ALWAYS AS (amount * vat_rate / 100) STORED,
    total_amount NUMERIC(15, 2) GENERATED ALWAYS AS (amount + (amount * vat_rate / 100)) STORED,
    
    -- Ngày tháng
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE, -- Ngày phát sinh
    payment_date DATE, -- Ngày thanh toán thực tế
    due_date DATE, -- Hạn thanh toán
    
    -- Trạng thái thanh toán
    payment_status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Paid', 'Partial', 'Cancelled', 'Overdue'
    payment_method TEXT, -- 'Cash', 'Transfer', 'Check', 'Card'
    
    -- Liên kết
    project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL, -- NULL nếu không liên quan dự án
    
    -- Chứng từ
    invoice_number TEXT, -- Số hóa đơn
    invoice_date DATE, -- Ngày hóa đơn
    invoice_file_url TEXT, -- Link file hóa đơn
    receipt_file_url TEXT, -- Link file chứng từ thanh toán
    
    -- Phê duyệt
    created_by TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    approved_by TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    approval_status TEXT DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    
    -- Ghi chú
    notes TEXT,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_project_id ON public.expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON public.expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_payment_status ON public.expenses(payment_status);
CREATE INDEX IF NOT EXISTS idx_expenses_vendor ON public.expenses(vendor_name);

-- ========== 2. CREATE payment_milestones (if not exists) ==========
CREATE TABLE IF NOT EXISTS public.payment_milestones (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    contract_id TEXT REFERENCES public.contracts(id) ON DELETE CASCADE,
    phase TEXT,
    condition TEXT,
    percentage DECIMAL(5, 2),
    amount BIGINT,
    due_date DATE,
    status TEXT DEFAULT 'Chưa thanh toán',
    invoice_date DATE,
    acceptance_product TEXT,
    expected_amount BIGINT,
    completion_progress NUMERIC(5, 2) DEFAULT 0,
    updated_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_milestones_contract ON public.payment_milestones(contract_id);

-- ========== 3. CREATE payment_transactions (if not exists) ==========
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    contract_id TEXT REFERENCES public.contracts(id) ON DELETE CASCADE,
    milestone_id TEXT REFERENCES public.payment_milestones(id) ON DELETE SET NULL,
    description TEXT,
    amount BIGINT NOT NULL,
    payment_date DATE,
    status TEXT DEFAULT 'Chưa thanh toán',
    invoice_number TEXT,
    payment_method TEXT,
    vat_rate DECIMAL(4, 2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_contract ON public.payment_transactions(contract_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_milestone ON public.payment_transactions(milestone_id);

-- ========== 4. UPDATE payment_milestones (nếu bảng tồn tại và chưa có đủ fields) ==========
-- Thêm các cột vào payment_milestones nếu bảng tồn tại và chưa có cột
DO $$ 
BEGIN
    -- Check if table exists first
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'payment_milestones'
    ) THEN
        -- Check và thêm completion_progress nếu chưa có
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'payment_milestones' 
            AND column_name = 'completion_progress'
        ) THEN
            ALTER TABLE public.payment_milestones 
            ADD COLUMN completion_progress NUMERIC(5, 2) DEFAULT 0;
        END IF;
        
        -- Check và thêm updated_by nếu chưa có
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'payment_milestones' 
            AND column_name = 'updated_by'
        ) THEN
            ALTER TABLE public.payment_milestones 
            ADD COLUMN updated_by TEXT;
        END IF;
        
        -- Check và thêm updated_at nếu chưa có
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'payment_milestones' 
            AND column_name = 'updated_at'
        ) THEN
            ALTER TABLE public.payment_milestones 
            ADD COLUMN updated_at TIMESTAMPTZ;
        END IF;
    END IF;
END $$;

-- ========== 5. VIEWS for Financial Summary ==========

-- View: Tổng hợp doanh thu (từ contracts)
CREATE OR REPLACE VIEW public.v_revenue_summary AS
SELECT 
    EXTRACT(YEAR FROM c.signed_date) as year,
    EXTRACT(QUARTER FROM c.signed_date) as quarter,
    EXTRACT(MONTH FROM c.signed_date) as month,
    c.project_id,
    SUM(c.total_value) as total_revenue,
    SUM(c.paid_value) as collected_revenue,
    SUM(c.remaining_value) as receivables,
    COUNT(*) as contract_count
FROM public.contracts c
WHERE c.signed_date IS NOT NULL
GROUP BY 
    EXTRACT(YEAR FROM c.signed_date),
    EXTRACT(QUARTER FROM c.signed_date),
    EXTRACT(MONTH FROM c.signed_date),
    c.project_id;

-- View: Tổng hợp chi phí (từ expenses + project_costs)
CREATE OR REPLACE VIEW public.v_expense_summary AS
SELECT 
    EXTRACT(YEAR FROM e.expense_date) as year,
    EXTRACT(QUARTER FROM e.expense_date) as quarter,
    EXTRACT(MONTH FROM e.expense_date) as month,
    e.project_id,
    e.category,
    SUM(e.total_amount) as total_expense,
    SUM(CASE WHEN e.payment_status = 'Paid' THEN e.total_amount ELSE 0 END) as paid_expense,
    COUNT(*) as expense_count
FROM public.expenses e
WHERE e.expense_date IS NOT NULL
GROUP BY 
    EXTRACT(YEAR FROM e.expense_date),
    EXTRACT(QUARTER FROM e.expense_date),
    EXTRACT(MONTH FROM e.expense_date),
    e.project_id,
    e.category;

-- ========== 6. RLS POLICIES ==========
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "authenticated_all_expenses" ON public.expenses;
DROP POLICY IF EXISTS "anon_read_expenses" ON public.expenses;
DROP POLICY IF EXISTS "anon_all_expenses" ON public.expenses;

-- Expenses policies
-- Allow authenticated users full access
CREATE POLICY "authenticated_all_expenses" ON public.expenses 
    FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (true);

-- Allow anonymous read (for development)
CREATE POLICY "anon_read_expenses" ON public.expenses 
    FOR SELECT TO anon 
    USING (true);

-- Allow anonymous write (for development, remove in production)
CREATE POLICY "anon_all_expenses" ON public.expenses 
    FOR ALL TO anon 
    USING (true) 
    WITH CHECK (true);

-- Payment Milestones policies
DROP POLICY IF EXISTS "authenticated_all_payment_milestones" ON public.payment_milestones;
DROP POLICY IF EXISTS "anon_all_payment_milestones" ON public.payment_milestones;

CREATE POLICY "authenticated_all_payment_milestones" ON public.payment_milestones 
    FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "anon_all_payment_milestones" ON public.payment_milestones 
    FOR ALL TO anon 
    USING (true) 
    WITH CHECK (true);

-- Payment Transactions policies
DROP POLICY IF EXISTS "authenticated_all_payment_transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "anon_all_payment_transactions" ON public.payment_transactions;

CREATE POLICY "authenticated_all_payment_transactions" ON public.payment_transactions 
    FOR ALL TO authenticated 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "anon_all_payment_transactions" ON public.payment_transactions 
    FOR ALL TO anon 
    USING (true) 
    WITH CHECK (true);

-- ========== 7. TRIGGERS ==========

-- Auto-update expense_code if not provided
CREATE OR REPLACE FUNCTION generate_expense_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expense_code IS NULL THEN
        NEW.expense_code := 'EXP-' || TO_CHAR(NEW.created_at, 'YYYYMM') || '-' || LPAD(nextval('expense_code_seq')::TEXT, 4, '0');
    END IF;
    
    -- Auto-update updated_at
    NEW.updated_at := NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for expense code
CREATE SEQUENCE IF NOT EXISTS expense_code_seq START 1;

-- Attach trigger
DROP TRIGGER IF EXISTS trg_generate_expense_code ON public.expenses;
CREATE TRIGGER trg_generate_expense_code
    BEFORE INSERT OR UPDATE ON public.expenses
    FOR EACH ROW
    EXECUTE FUNCTION generate_expense_code();

-- ========== 8. SAMPLE DATA (Optional) ==========
-- Uncomment to insert sample expenses
/*
INSERT INTO public.expenses (category, description, vendor_name, amount, expense_date, payment_status, project_id)
VALUES 
    ('Office', 'Thuê văn phòng tháng 1/2025', 'Công ty ABC', 15000000, '2025-01-01', 'Paid', NULL),
    ('Equipment', 'Mua laptop Dell', 'FPT Shop', 25000000, '2025-01-15', 'Paid', NULL),
    ('Travel', 'Chi phí đi công tác Đà Nẵng', 'Vietnam Airlines', 5000000, '2025-01-20', 'Pending', NULL);
*/

SELECT '✅ Expenses schema and financial views created successfully!' as message;
