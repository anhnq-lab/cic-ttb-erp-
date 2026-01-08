-- ============================================
-- SUPABASE SCHEMA FOR CIC.TTB.ERP
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(500) NOT NULL,
    client VARCHAR(255),
    location VARCHAR(500),
    manager VARCHAR(255),
    
    -- Technical Fields (Law 58/2024/QH15 & Circular 06/2021/TT-BXD)
    "projectGroup" VARCHAR(100), -- Quan trọng quốc gia, Nhóm A, B, C
    "constructionType" VARCHAR(255), -- Dân dụng, Công nghiệp...
    "constructionLevel" VARCHAR(50), -- Đặc biệt, I, II, III, IV
    scale VARCHAR(255),
    
    "capitalSource" VARCHAR(50) CHECK ("capitalSource" IN ('StateBudget', 'NonStateBudget')),
    status VARCHAR(50) DEFAULT 'Lập kế hoạch',
    progress INTEGER DEFAULT 0,
    budget BIGINT DEFAULT 0,
    spent BIGINT DEFAULT 0,
    deadline DATE,
    members INTEGER DEFAULT 0,
    thumbnail TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. EMPLOYEES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    department VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    avatar TEXT,
    status VARCHAR(50) CHECK (status IN ('Chính thức', 'Nghỉ phép', 'Thử việc')) DEFAULT 'Chính thức',
    "joinDate" DATE,
    skills TEXT[], -- Array of skills
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. CUSTOMERS TABLE (CRM)
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(500) NOT NULL,
    "shortName" VARCHAR(255),
    type VARCHAR(50) CHECK (type IN ('Client', 'Partner', 'Subcontractor')),
    category VARCHAR(50) CHECK (category IN ('RealEstate', 'StateBudget', 'Consulting', 'Construction', 'Other')),
    "taxCode" VARCHAR(50),
    address TEXT,
    representative VARCHAR(255),
    "contactPerson" VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    "bankAccount" VARCHAR(100),
    "bankName" VARCHAR(255),
    status VARCHAR(50) CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
    tier VARCHAR(50) CHECK (tier IN ('VIP', 'Gold', 'Standard')) DEFAULT 'Standard',
    "totalProjectValue" BIGINT DEFAULT 0,
    logo TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    evaluation TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. CONTRACTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "projectId" UUID REFERENCES projects(id) ON DELETE SET NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    "signedDate" DATE,
    "packageName" VARCHAR(500),
    "projectName" VARCHAR(500),
    location VARCHAR(500),
    "contractType" VARCHAR(100),
    "lawApplied" VARCHAR(255),
    
    -- Side A (Client)
    "sideAName" VARCHAR(500),
    "sideARep" VARCHAR(255),
    "sideAPosition" VARCHAR(255),
    "sideAMst" VARCHAR(50),
    "sideAStaff" VARCHAR(255),
    
    -- Side B (CIC)
    "sideBName" VARCHAR(500),
    "sideBRep" VARCHAR(255),
    "sideBPosition" VARCHAR(255),
    "sideBMst" VARCHAR(50),
    "sideBBank" VARCHAR(255),
    
    -- Finance
    "totalValue" BIGINT DEFAULT 0,
    "vatIncluded" BOOLEAN DEFAULT TRUE,
    "advancePayment" BIGINT DEFAULT 0,
    
    -- Schedule
    duration VARCHAR(100),
    "startDate" DATE,
    "endDate" DATE,
    "warrantyPeriod" VARCHAR(100),
    
    -- Scope
    "mainTasks" TEXT[],
    "fileFormats" VARCHAR(255),
    "deliveryMethod" VARCHAR(255),
    "acceptanceStandard" VARCHAR(500),
    
    -- Personnel (stored as JSONB array)
    personnel JSONB DEFAULT '[]'::jsonb,
    
    -- Legal
    "penaltyRate" VARCHAR(50),
    "maxPenalty" VARCHAR(50),
    "disputeResolution" VARCHAR(255),
    
    -- Status tracking
    "paidValue" BIGINT DEFAULT 0,
    "remainingValue" BIGINT DEFAULT 0,
    "wipValue" BIGINT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Nháp',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(500) NOT NULL,
    "projectId" UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Assignee (stored as JSONB)
    assignee JSONB DEFAULT '{}'::jsonb,
    reviewer VARCHAR(255),
    
    status VARCHAR(50) DEFAULT 'Mở',
    priority VARCHAR(50) CHECK (priority IN ('Cao', 'Trung bình', 'Thấp')) DEFAULT 'Trung bình',
    "startDate" DATE,
    "dueDate" DATE,
    progress INTEGER DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    tags TEXT[],
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. PAYMENT MILESTONES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "contractId" UUID REFERENCES contracts(id) ON DELETE CASCADE,
    phase VARCHAR(100),
    condition TEXT,
    percentage DECIMAL(5,2),
    amount BIGINT,
    "dueDate" DATE,
    status VARCHAR(50) DEFAULT 'Chưa thanh toán',
    "invoiceDate" DATE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. PAYMENT TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "contractId" UUID REFERENCES contracts(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    amount BIGINT NOT NULL,
    description TEXT,
    method VARCHAR(50) CHECK (method IN ('Bank Transfer', 'Cash')),
    "invoiceNumber" VARCHAR(100),
    status VARCHAR(50) CHECK (status IN ('Completed', 'Pending')) DEFAULT 'Pending',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. CRM CONTACTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS crm_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "customerId" UUID REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    "isPrimary" BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. CRM ACTIVITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS crm_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "customerId" UUID REFERENCES customers(id) ON DELETE CASCADE,
    type VARCHAR(50) CHECK (type IN ('Meeting', 'Call', 'Email', 'Meal', 'Note')),
    date DATE NOT NULL,
    title VARCHAR(500),
    description TEXT,
    "createdBy" VARCHAR(255),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. CRM OPPORTUNITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS crm_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "customerId" UUID REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    value BIGINT DEFAULT 0,
    stage VARCHAR(50) CHECK (stage IN ('New', 'Qualification', 'Proposal', 'Negotiation', 'Won', 'Lost')) DEFAULT 'New',
    probability INTEGER CHECK (probability BETWEEN 0 AND 100),
    "expectedCloseDate" DATE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_code ON projects(code);
CREATE INDEX IF NOT EXISTS idx_contracts_project ON contracts("projectId");
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks("projectId");
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_customers_type ON customers(type);
CREATE INDEX IF NOT EXISTS idx_customers_tier ON customers(tier);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_customer ON crm_contacts("customerId");
CREATE INDEX IF NOT EXISTS idx_crm_activities_customer ON crm_activities("customerId");
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_customer ON crm_opportunities("customerId");
CREATE INDEX IF NOT EXISTS idx_payment_milestones_contract ON payment_milestones("contractId");
CREATE INDEX IF NOT EXISTS idx_payment_transactions_contract ON payment_transactions("contractId");

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_milestones_updated_at BEFORE UPDATE ON payment_milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_contacts_updated_at BEFORE UPDATE ON crm_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_crm_opportunities_updated_at BEFORE UPDATE ON crm_opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DISABLE RLS FOR PUBLIC ACCESS (DEV MODE)
-- Enable RLS and add policies for production
-- ============================================
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE contracts DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_milestones DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE crm_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE crm_opportunities DISABLE ROW LEVEL SECURITY;

-- ============================================
-- ENABLE REALTIME FOR TABLES
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE contracts;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE employees;
ALTER PUBLICATION supabase_realtime ADD TABLE customers;

-- Done! Run this script in Supabase SQL Editor
