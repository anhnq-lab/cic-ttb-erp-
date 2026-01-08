-- ============================================
-- EDT CORE SCHEMA EXTENSION
-- Description: Adds tables for Templates, Deliverables, SOPs, and Knowledge Base
-- ============================================

-- ============================================
-- 11. PROJECT TEMPLATES (Kho Biểu mẫu số)
-- ============================================
CREATE TABLE IF NOT EXISTS project_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100), -- Dân dụng, Cầu đường, Nhà xưởng
    phases JSONB DEFAULT '[]'::jsonb, -- Array of phases and default tasks
    description TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. QUALITY CHECKLISTS (SOP Checklists)
-- ============================================
CREATE TABLE IF NOT EXISTS quality_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100), -- Cột, Dầm, Sàn, MEP...
    items JSONB DEFAULT '[]'::jsonb, -- Array of {id, text, isMandatory}
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 13. DELIVERABLES (Sản phẩm bàn giao)
-- ============================================
CREATE TABLE IF NOT EXISTS deliverables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "taskId" UUID REFERENCES tasks(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('File', 'Drawing', 'Model', 'Report', 'Other')),
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Submitted, Approved, Rejected
    url TEXT,
    "driveId" VARCHAR(255),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 14. SOP STEPS (Quy trình chuẩn)
-- ============================================
CREATE TABLE IF NOT EXISTS sop_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    steps JSONB DEFAULT '[]'::jsonb, -- Array of {step, description, role}
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 15. CHECKLIST LOGS (Nhật ký kiểm tra)
-- ============================================
CREATE TABLE IF NOT EXISTS checklist_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "taskId" UUID REFERENCES tasks(id) ON DELETE CASCADE,
    "checklistId" UUID REFERENCES quality_checklists(id),
    "itemId" VARCHAR(50) NOT NULL,
    status BOOLEAN DEFAULT FALSE,
    "checkedBy" UUID REFERENCES employees(id), -- Or just store name/id string if strict FK not needed
    "checkedAt" TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 16. LESSONS LEARNED (Kho tri thức)
-- ============================================
CREATE TABLE IF NOT EXISTS lessons_learned (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "projectId" UUID REFERENCES projects(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    category VARCHAR(100), -- Lỗi dựng hình, Phối hợp, Quy trình...
    tags TEXT[],
    content TEXT,
    solution TEXT,
    author UUID REFERENCES employees(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE TRIGGER update_project_templates_updated_at BEFORE UPDATE ON project_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quality_checklists_updated_at BEFORE UPDATE ON quality_checklists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deliverables_updated_at BEFORE UPDATE ON deliverables FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sop_steps_updated_at BEFORE UPDATE ON sop_steps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_learned_updated_at BEFORE UPDATE ON lessons_learned FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ENABLE REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE project_templates;
ALTER PUBLICATION supabase_realtime ADD TABLE quality_checklists;
ALTER PUBLICATION supabase_realtime ADD TABLE deliverables;
ALTER PUBLICATION supabase_realtime ADD TABLE checklist_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE lessons_learned;

-- ============================================
-- DISABLE RLS (DEV MODE)
-- ============================================
ALTER TABLE project_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE quality_checklists DISABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables DISABLE ROW LEVEL SECURITY;
ALTER TABLE sop_steps DISABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE lessons_learned DISABLE ROW LEVEL SECURITY;
