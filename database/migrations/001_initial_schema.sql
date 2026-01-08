-- ============================================
-- CIC.TTB.ERP Database Schema (FIXED - TEXT IDs)
-- Supabase PostgreSQL
-- Version: 1.1.0
-- Run this COMPLETE script in Supabase SQL Editor
-- ============================================

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS public.subtasks CASCADE;
DROP TABLE IF EXISTS public.task_comments CASCADE;
DROP TABLE IF EXISTS public.contract_personnel CASCADE;
DROP TABLE IF EXISTS public.project_members CASCADE;
DROP TABLE IF EXISTS public.payment_transactions CASCADE;
DROP TABLE IF EXISTS public.payment_milestones CASCADE;
DROP TABLE IF EXISTS public.crm_opportunities CASCADE;
DROP TABLE IF EXISTS public.crm_activities CASCADE;
DROP TABLE IF EXISTS public.crm_contacts CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.contracts CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.employees CASCADE;

-- ============================================
-- 1. EMPLOYEES TABLE
-- ============================================
CREATE TABLE public.employees (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar TEXT,
    role TEXT,
    department TEXT,
    status TEXT DEFAULT 'Thử việc' CHECK (status IN ('Chính thức', 'Nghỉ phép', 'Thử việc')),
    join_date DATE,
    dob DATE,
    degree TEXT,
    certificates TEXT,
    graduation_year TEXT,
    skills TEXT[],
    profile_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. CUSTOMERS TABLE
-- ============================================
CREATE TABLE public.customers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    short_name TEXT,
    type TEXT DEFAULT 'Client',
    category TEXT DEFAULT 'Other',
    tax_code TEXT,
    address TEXT,
    representative TEXT,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    bank_account TEXT,
    bank_name TEXT,
    status TEXT DEFAULT 'Active',
    tier TEXT DEFAULT 'Standard',
    total_project_value BIGINT DEFAULT 0,
    logo TEXT,
    rating SMALLINT,
    evaluation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. PROJECTS TABLE
-- ============================================
CREATE TABLE public.projects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    client TEXT,
    customer_id TEXT REFERENCES public.customers(id) ON DELETE SET NULL,
    location TEXT,
    manager_id TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    manager TEXT,
    project_group TEXT,
    construction_type TEXT,
    construction_level TEXT,
    scale TEXT,
    capital_source TEXT DEFAULT 'NonStateBudget',
    status TEXT DEFAULT 'Lập kế hoạch',
    progress SMALLINT DEFAULT 0,
    budget BIGINT DEFAULT 0,
    spent BIGINT DEFAULT 0,
    deadline TEXT,
    members_count SMALLINT DEFAULT 0,
    thumbnail TEXT,
    service_type TEXT,
    area TEXT,
    unit_price TEXT,
    phase TEXT,
    scope TEXT,
    status_detail TEXT,
    failure_reason TEXT,
    folder_url TEXT,
    completed_at DATE,
    deliverables TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. CONTRACTS TABLE
-- ============================================
CREATE TABLE public.contracts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
    code TEXT UNIQUE NOT NULL,
    signed_date DATE,
    package_name TEXT,
    project_name TEXT,
    location TEXT,
    contract_type TEXT,
    law_applied TEXT,
    side_a_name TEXT,
    side_a_rep TEXT,
    side_a_position TEXT,
    side_a_mst TEXT,
    side_a_staff TEXT,
    side_b_name TEXT DEFAULT 'Công ty CP Tư vấn Xây dựng Chuyển đổi số',
    side_b_rep TEXT,
    side_b_position TEXT,
    side_b_mst TEXT,
    side_b_bank TEXT,
    total_value BIGINT DEFAULT 0,
    vat_included BOOLEAN DEFAULT TRUE,
    advance_payment BIGINT DEFAULT 0,
    paid_value BIGINT DEFAULT 0,
    remaining_value BIGINT DEFAULT 0,
    wip_value BIGINT DEFAULT 0,
    duration TEXT,
    start_date DATE,
    end_date DATE,
    warranty_period TEXT,
    main_tasks TEXT[],
    file_formats TEXT,
    delivery_method TEXT,
    acceptance_standard TEXT,
    penalty_rate TEXT,
    max_penalty TEXT,
    dispute_resolution TEXT,
    status TEXT DEFAULT 'Nháp',
    file_url TEXT,
    drive_link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. TASKS TABLE
-- ============================================
CREATE TABLE public.tasks (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    code TEXT,
    name TEXT NOT NULL,
    assignee_id TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    assignee_name TEXT,
    assignee_avatar TEXT,
    assignee_role TEXT,
    reviewer_id TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'Mở',
    priority TEXT DEFAULT 'Trung bình',
    start_date DATE,
    due_date DATE,
    progress SMALLINT DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. SUBTASKS
-- ============================================
CREATE TABLE public.subtasks (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    task_id TEXT REFERENCES public.tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    assignee_id TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. TASK COMMENTS
-- ============================================
CREATE TABLE public.task_comments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    task_id TEXT REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    user_name TEXT,
    user_avatar TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. PAYMENT MILESTONES
-- ============================================
CREATE TABLE public.payment_milestones (
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
    updated_by TEXT REFERENCES public.employees(id),
    expected_amount BIGINT,
    completion_progress SMALLINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. PAYMENT TRANSACTIONS
-- ============================================
CREATE TABLE public.payment_transactions (
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

-- ============================================
-- 10. CRM CONTACTS
-- ============================================
CREATE TABLE public.crm_contacts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_id TEXT REFERENCES public.customers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position TEXT,
    email TEXT,
    phone TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. CRM ACTIVITIES
-- ============================================
CREATE TABLE public.crm_activities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_id TEXT REFERENCES public.customers(id) ON DELETE CASCADE,
    type TEXT,
    date DATE,
    title TEXT,
    description TEXT,
    created_by TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. CRM OPPORTUNITIES
-- ============================================
CREATE TABLE public.crm_opportunities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_id TEXT REFERENCES public.customers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    value BIGINT DEFAULT 0,
    stage TEXT DEFAULT 'New',
    probability SMALLINT DEFAULT 0,
    expected_close_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. PROJECT MEMBERS (Many-to-Many)
-- ============================================
CREATE TABLE public.project_members (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
    employee_id TEXT REFERENCES public.employees(id) ON DELETE CASCADE,
    role TEXT,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, employee_id)
);

-- ============================================
-- 14. CONTRACT PERSONNEL
-- ============================================
CREATE TABLE public.contract_personnel (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    contract_id TEXT REFERENCES public.contracts(id) ON DELETE CASCADE,
    employee_id TEXT REFERENCES public.employees(id) ON DELETE SET NULL,
    role TEXT,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_manager ON public.projects(manager_id);
CREATE INDEX idx_projects_customer ON public.projects(customer_id);
CREATE INDEX idx_contracts_project ON public.contracts(project_id);
CREATE INDEX idx_contracts_status ON public.contracts(status);
CREATE INDEX idx_tasks_project ON public.tasks(project_id);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_subtasks_task ON public.subtasks(task_id);
CREATE INDEX idx_task_comments_task ON public.task_comments(task_id);
CREATE INDEX idx_employees_department ON public.employees(department);
CREATE INDEX idx_customers_type ON public.customers(type);
CREATE INDEX idx_crm_activities_customer ON public.crm_activities(customer_id);

-- ============================================
-- AUTO UPDATE TIMESTAMP TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_opportunities_updated_at BEFORE UPDATE ON public.crm_opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_personnel ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES (Allow authenticated users)
-- ============================================
-- Employees
CREATE POLICY "employees_select" ON public.employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "employees_insert" ON public.employees FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "employees_update" ON public.employees FOR UPDATE TO authenticated USING (true);

-- Customers
CREATE POLICY "customers_select" ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "customers_insert" ON public.customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "customers_update" ON public.customers FOR UPDATE TO authenticated USING (true);

-- Projects
CREATE POLICY "projects_select" ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "projects_insert" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "projects_update" ON public.projects FOR UPDATE TO authenticated USING (true);

-- Contracts
CREATE POLICY "contracts_select" ON public.contracts FOR SELECT TO authenticated USING (true);
CREATE POLICY "contracts_insert" ON public.contracts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "contracts_update" ON public.contracts FOR UPDATE TO authenticated USING (true);

-- Tasks
CREATE POLICY "tasks_select" ON public.tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "tasks_insert" ON public.tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "tasks_update" ON public.tasks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "tasks_delete" ON public.tasks FOR DELETE TO authenticated USING (true);

-- Subtasks
CREATE POLICY "subtasks_select" ON public.subtasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "subtasks_insert" ON public.subtasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "subtasks_update" ON public.subtasks FOR UPDATE TO authenticated USING (true);
CREATE POLICY "subtasks_delete" ON public.subtasks FOR DELETE TO authenticated USING (true);

-- Task Comments
CREATE POLICY "task_comments_select" ON public.task_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "task_comments_insert" ON public.task_comments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "task_comments_delete" ON public.task_comments FOR DELETE TO authenticated USING (true);

-- CRM Contacts
CREATE POLICY "crm_contacts_select" ON public.crm_contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "crm_contacts_insert" ON public.crm_contacts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "crm_contacts_update" ON public.crm_contacts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "crm_contacts_delete" ON public.crm_contacts FOR DELETE TO authenticated USING (true);

-- CRM Activities
CREATE POLICY "crm_activities_select" ON public.crm_activities FOR SELECT TO authenticated USING (true);
CREATE POLICY "crm_activities_insert" ON public.crm_activities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "crm_activities_delete" ON public.crm_activities FOR DELETE TO authenticated USING (true);

-- CRM Opportunities
CREATE POLICY "crm_opportunities_select" ON public.crm_opportunities FOR SELECT TO authenticated USING (true);
CREATE POLICY "crm_opportunities_insert" ON public.crm_opportunities FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "crm_opportunities_update" ON public.crm_opportunities FOR UPDATE TO authenticated USING (true);
CREATE POLICY "crm_opportunities_delete" ON public.crm_opportunities FOR DELETE TO authenticated USING (true);

-- Payment Milestones
CREATE POLICY "payment_milestones_select" ON public.payment_milestones FOR SELECT TO authenticated USING (true);
CREATE POLICY "payment_milestones_insert" ON public.payment_milestones FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "payment_milestones_update" ON public.payment_milestones FOR UPDATE TO authenticated USING (true);

-- Payment Transactions
CREATE POLICY "payment_transactions_select" ON public.payment_transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "payment_transactions_insert" ON public.payment_transactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "payment_transactions_update" ON public.payment_transactions FOR UPDATE TO authenticated USING (true);

-- Project Members
CREATE POLICY "project_members_select" ON public.project_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "project_members_insert" ON public.project_members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "project_members_delete" ON public.project_members FOR DELETE TO authenticated USING (true);

-- Contract Personnel
CREATE POLICY "contract_personnel_select" ON public.contract_personnel FOR SELECT TO authenticated USING (true);
CREATE POLICY "contract_personnel_insert" ON public.contract_personnel FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "contract_personnel_delete" ON public.contract_personnel FOR DELETE TO authenticated USING (true);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'Schema created successfully! 14 tables ready.' as message;
