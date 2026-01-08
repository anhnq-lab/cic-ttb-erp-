-- ============================================
-- RESET AND RECREATE ALL TABLES
-- Run this to fix any schema issues
-- ============================================

-- Drop existing tables (in correct order due to foreign keys)
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS payment_milestones CASCADE;
DROP TABLE IF EXISTS crm_opportunities CASCADE;
DROP TABLE IF EXISTS crm_activities CASCADE;
DROP TABLE IF EXISTS crm_contacts CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS contracts CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROJECTS TABLE
-- ============================================
CREATE TABLE projects (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    client TEXT,
    location TEXT,
    manager TEXT,
    "projectGroup" TEXT,
    "constructionType" TEXT,
    "constructionLevel" TEXT,
    scale TEXT,
    "capitalSource" TEXT,
    status TEXT DEFAULT 'Lập kế hoạch',
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
CREATE TABLE employees (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT,
    department TEXT,
    email TEXT,
    phone TEXT,
    avatar TEXT,
    status TEXT DEFAULT 'Chính thức',
    "joinDate" DATE,
    skills TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. CUSTOMERS TABLE (CRM)
-- ============================================
CREATE TABLE customers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    "shortName" TEXT,
    type TEXT,
    category TEXT,
    "taxCode" TEXT,
    address TEXT,
    representative TEXT,
    "contactPerson" TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    "bankAccount" TEXT,
    "bankName" TEXT,
    status TEXT DEFAULT 'Active',
    tier TEXT DEFAULT 'Standard',
    "totalProjectValue" BIGINT DEFAULT 0,
    logo TEXT,
    rating INTEGER,
    evaluation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. CONTRACTS TABLE
-- ============================================
CREATE TABLE contracts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "projectId" TEXT REFERENCES projects(id) ON DELETE SET NULL,
    code TEXT UNIQUE NOT NULL,
    "signedDate" DATE,
    "packageName" TEXT,
    "projectName" TEXT,
    location TEXT,
    "contractType" TEXT,
    "lawApplied" TEXT,
    "sideAName" TEXT,
    "sideARep" TEXT,
    "sideAPosition" TEXT,
    "sideAMst" TEXT,
    "sideAStaff" TEXT,
    "sideBName" TEXT,
    "sideBRep" TEXT,
    "sideBPosition" TEXT,
    "sideBMst" TEXT,
    "sideBBank" TEXT,
    "totalValue" BIGINT DEFAULT 0,
    "vatIncluded" BOOLEAN DEFAULT TRUE,
    "advancePayment" BIGINT DEFAULT 0,
    duration TEXT,
    "startDate" DATE,
    "endDate" DATE,
    "warrantyPeriod" TEXT,
    "mainTasks" TEXT[],
    "fileFormats" TEXT,
    "deliveryMethod" TEXT,
    "acceptanceStandard" TEXT,
    personnel JSONB DEFAULT '[]'::jsonb,
    "penaltyRate" TEXT,
    "maxPenalty" TEXT,
    "disputeResolution" TEXT,
    "paidValue" BIGINT DEFAULT 0,
    "remainingValue" BIGINT DEFAULT 0,
    "wipValue" BIGINT DEFAULT 0,
    transactions JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'Nháp',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. TASKS TABLE
-- ============================================
CREATE TABLE tasks (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    "projectId" TEXT REFERENCES projects(id) ON DELETE CASCADE,
    assignee JSONB DEFAULT '{}'::jsonb,
    reviewer TEXT,
    status TEXT DEFAULT 'Mở',
    priority TEXT DEFAULT 'Trung bình',
    "startDate" DATE,
    "dueDate" DATE,
    progress INTEGER DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. CRM CONTACTS TABLE
-- ============================================
CREATE TABLE crm_contacts (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "customerId" TEXT REFERENCES customers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position TEXT,
    email TEXT,
    phone TEXT,
    "isPrimary" BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. CRM ACTIVITIES TABLE
-- ============================================
CREATE TABLE crm_activities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "customerId" TEXT REFERENCES customers(id) ON DELETE CASCADE,
    type TEXT,
    date DATE NOT NULL,
    title TEXT,
    description TEXT,
    "createdBy" TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. CRM OPPORTUNITIES TABLE
-- ============================================
CREATE TABLE crm_opportunities (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "customerId" TEXT REFERENCES customers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    value BIGINT DEFAULT 0,
    stage TEXT DEFAULT 'New',
    probability INTEGER,
    "expectedCloseDate" DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE contracts;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE employees;
ALTER PUBLICATION supabase_realtime ADD TABLE customers;

SELECT 'Schema created successfully!' as message;

-- ============================================
-- NOW INSERT SAMPLE DATA
-- ============================================

-- 1. EMPLOYEES
INSERT INTO employees (id, code, name, role, department, email, phone, avatar, status, "joinDate", skills) VALUES
('e1', 'CIC-001', 'Nguyễn Hoàng Hà', 'Giám đốc Trung tâm', 'Ban Giám Đốc', 'ha.nguyen@cic.com.vn', '0901.234.567', 'https://ui-avatars.com/api/?name=Nguyen+Ha&background=random&color=fff', 'Chính thức', '2015-01-15', ARRAY['Quản lý', 'Chiến lược', 'BIM']),
('e2', 'CIC-002', 'Nguyễn Bá Nhiệm', 'Phó GĐTT', 'Ban Giám Đốc', 'nhiem.nguyen@cic.com.vn', '0909.888.777', 'https://ui-avatars.com/api/?name=Ba+Nhiem&background=random&color=fff', 'Chính thức', '2016-03-20', ARRAY['MEP', 'Revit']),
('e3', 'CIC-005', 'Lương Thành Hưng', 'BIM Manager', 'Quản lý Dự án', 'hung.luong@cic.com.vn', '0912.345.678', 'https://ui-avatars.com/api/?name=Thanh+Hung&background=random&color=fff', 'Chính thức', '2018-06-01', ARRAY['Navisworks', 'CDE']),
('e4', 'CIC-008', 'Trần Hữu Hải', 'BIM Coordinator', 'Kỹ thuật - BIM', 'hai.tran@cic.com.vn', '0933.444.555', 'https://ui-avatars.com/api/?name=Huu+Hai&background=random&color=fff', 'Chính thức', '2019-09-10', ARRAY['Clash Detection', 'Dynamo']),
('e5', 'CIC-012', 'Vũ Ngọc Thủy', 'KTS Chủ trì', 'Kỹ thuật - Kiến trúc', 'thuy.vu@cic.com.vn', '0987.654.321', 'https://ui-avatars.com/api/?name=Ngoc+Thuy&background=random&color=fff', 'Chính thức', '2020-02-15', ARRAY['Kiến trúc', 'Enscape']),
('e6', 'CIC-015', 'Nguyễn Đức Thành', 'Kỹ sư Kết cấu', 'Kỹ thuật - Kết cấu', 'thanh.nguyen@cic.com.vn', '0369.852.147', 'https://ui-avatars.com/api/?name=Duc+Thanh&background=random&color=fff', 'Chính thức', '2021-05-20', ARRAY['Tekla', 'Revit']),
('e7', 'CIC-020', 'Đào Đông Quỳnh', 'Trưởng Admin', 'Hành chính', 'quynh.dao@cic.com.vn', '0905.123.456', 'https://ui-avatars.com/api/?name=Dong+Quynh&background=random&color=fff', 'Chính thức', '2022-01-05', ARRAY['Nhân sự', 'Kế toán']),
('e8', 'CIC-025', 'Phạm Văn Minh', 'Thực tập sinh', 'Kỹ thuật - BIM', 'minh.pham@cic.com.vn', '0333.999.888', 'https://ui-avatars.com/api/?name=Van+Minh&background=random&color=fff', 'Thử việc', '2024-03-01', ARRAY['AutoCAD']);

-- 2. CUSTOMERS
INSERT INTO customers (id, code, name, "shortName", type, category, "taxCode", address, representative, "contactPerson", email, phone, website, status, tier, "totalProjectValue", logo, rating, evaluation) VALUES
('CUST-001', 'VIG', 'Tập đoàn Vingroup - CTCP', 'VinGroup', 'Client', 'RealEstate', '0101234567', 'Hà Nội', 'Bà Phạm Thị Lan', 'Ông Lê Văn A', 'info@vingroup.net', '024 3974 9999', 'vingroup.net', 'Active', 'VIP', 15200000000, 'https://ui-avatars.com/api/?name=VinGroup&background=fff&color=333', 5, 'Thanh toán đúng hạn'),
('CUST-002', 'QLDA-DDCN', 'Ban QLDA Dân dụng CN', 'Ban DDCN', 'Client', 'StateBudget', '315584775', 'TP.HCM', 'Ông Huỳnh Minh Hùng', 'Ông Nguyễn Phương Đông', 'banqlda@tphcm.gov.vn', '028 3835 6789', NULL, 'Active', 'Standard', 155000000, 'https://ui-avatars.com/api/?name=Ban+QLDA&background=fff&color=333', 4, 'Uy tín'),
('CUST-003', 'COTECCONS', 'Coteccons', 'Coteccons', 'Client', 'Construction', '0303443233', 'TP.HCM', 'Ông Bolat', 'Bà Nguyễn B', 'contact@coteccons.vn', '028 3514 2255', 'coteccons.vn', 'Active', 'Gold', 5400000000, 'https://ui-avatars.com/api/?name=Coteccons&background=fff&color=333', 5, 'Đối tác chiến lược'),
('CUST-004', 'HBC', 'Hòa Bình Corp', 'Hòa Bình', 'Client', 'Construction', '0302495123', 'TP.HCM', 'Ông Lê Viết Hải', 'Ông Trần C', 'info@hbcg.vn', '028 3932 5030', 'hbcg.vn', 'Active', 'Gold', 3200000000, 'https://ui-avatars.com/api/?name=Hoa+Binh&background=fff&color=333', 4, 'Cần theo dõi');

-- 3. PROJECTS
INSERT INTO projects (id, code, name, client, location, manager, "projectGroup", "constructionType", "constructionLevel", scale, "capitalSource", status, progress, budget, spent, deadline, members, thumbnail) VALUES
('p1', '25099', 'TÒA NHÀ EIE TOWER', 'Công ty EIE', 'Hà Nội', 'Nguyễn Thúy Hằng', 'Nhóm B', 'Công trình dân dụng', 'Cấp II', '25 tầng', 'NonStateBudget', 'Lập kế hoạch', 5, 450000000000, 1200000000, '2026-12-31', 15, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500'),
('p2', '25010', 'BV NHI ĐỒNG 1 - 4B', 'Ban QLDA TP.HCM', 'TP.HCM', 'Nguyễn Quốc Anh', 'Nhóm B', 'Công trình dân dụng', 'Cấp I', '35.000 m2', 'StateBudget', 'Đang thực hiện', 15, 155000000, 0, '2025-04-26', 5, 'https://picsum.photos/id/122/400/300'),
('p3', '23001', 'SKYLINE VINGROUP', 'Vingroup', 'Hà Nội', 'Nguyễn Hoàng Hà', 'Nhóm A', 'Công trình dân dụng', 'Cấp đặc biệt', '5 tháp 40 tầng', 'NonStateBudget', 'Đang thực hiện', 65, 4200000000, 2100000000, '2024-12-20', 12, 'https://picsum.photos/id/48/200/200'),
('p4', '24005', 'GLORY HEIGHTS', 'Vingroup', 'TP.Thủ Đức', 'Nguyễn Bá Nhiệm', 'Nhóm A', 'Công trình dân dụng', 'Cấp I', '5 tòa 39 tầng', 'NonStateBudget', 'Hoàn thành', 100, 3500000000, 3100000000, '2024-10-15', 20, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500'),
('p5', '22099', 'METRO LINE 2', 'MAUR', 'TP.HCM', 'Trần Hữu Hải', 'Quan trọng quốc gia', 'Công trình giao thông', 'Cấp đặc biệt', '11km', 'StateBudget', 'Lập kế hoạch', 5, 47000000000, 500000000, '2030-12-31', 8, 'https://images.unsplash.com/photo-1510252833074-ce467a807d9d?w=500'),
('p6', '24012', 'LEGO FACTORY', 'LEGO Group', 'Bình Dương', 'Lương Thành Hưng', 'Nhóm A', 'Công trình công nghiệp', 'Cấp I', '44 ha', 'NonStateBudget', 'Tạm hoãn', 35, 25000000000, 8000000000, '2025-08-01', 15, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500');

-- 4. CONTRACTS
INSERT INTO contracts (id, "projectId", code, "signedDate", "packageName", "projectName", location, "contractType", "sideAName", "sideBName", "totalValue", "paidValue", "remainingValue", status) VALUES
('c1', 'p2', '30/2025/HD-DDCN', '2025-03-20', 'Tư vấn BIM', 'Bệnh viện Nhi đồng 1', 'TP.HCM', 'Trọn gói', 'Ban QLDA TP.HCM', 'CIC', 155000000, 0, 155000000, 'Hiệu lực'),
('c2', 'p3', '01/2024/VIG-CIC', '2024-01-15', 'Tư vấn BIM Level 2', 'Skyline VinGroup', 'Hà Nội', 'Đơn giá', 'Vingroup', 'CIC', 4200000000, 2100000000, 2100000000, 'Hiệu lực'),
('c3', 'p4', 'GH-2023/BIM', '2023-05-10', 'Tư vấn BIM Full', 'Glory Heights', 'TP.Thủ Đức', 'Trọn gói', 'Vingroup', 'CIC', 3500000000, 3500000000, 0, 'Hoàn thành');

-- 5. CRM CONTACTS
INSERT INTO crm_contacts (id, "customerId", name, position, email, phone, "isPrimary") VALUES
('ct1', 'CUST-001', 'Ông Lê Văn A', 'Giám đốc QLDA', 'a.le@vingroup.net', '0909111222', true),
('ct2', 'CUST-001', 'Bà Trần Thị B', 'Kế toán trưởng', 'b.tran@vingroup.net', '0909333444', false),
('ct3', 'CUST-002', 'Ông Nguyễn Đông', 'Chuyên viên', 'dong.np@tphcm.gov.vn', '0912345678', true);

-- 6. CRM ACTIVITIES
INSERT INTO crm_activities (id, "customerId", type, date, title, description, "createdBy") VALUES
('act1', 'CUST-001', 'Meeting', '2025-03-20', 'Họp giao ban tuần', 'Thống nhất phương án thiết kế', 'Nguyễn Bá Nhiệm'),
('act2', 'CUST-001', 'Email', '2025-03-18', 'Gửi hồ sơ năng lực', 'Đã gửi profile cập nhật', 'Nguyễn Quốc Anh'),
('act3', 'CUST-003', 'Meal', '2025-03-10', 'Ăn trưa thân mật', 'Gặp gỡ bàn dự án mới', 'Nguyễn Hoàng Hà');

-- 7. CRM OPPORTUNITIES
INSERT INTO crm_opportunities (id, "customerId", name, value, stage, probability, "expectedCloseDate") VALUES
('opp1', 'CUST-001', 'BIM cho Vinhomes Cổ Loa', 5500000000, 'Negotiation', 80, '2025-05-30'),
('opp2', 'CUST-003', 'Phối hợp MEP dự án Lego', 1200000000, 'Proposal', 40, '2025-06-15');

-- 8. TASKS
INSERT INTO tasks (id, code, name, "projectId", assignee, reviewer, status, priority, "startDate", "dueDate", progress, tags) VALUES
('t1', '40.10.15.01', 'Dựng mô hình Kiến trúc Tầng 1', 'p2', '{"name": "Vũ Ngọc Thủy", "role": "Modeler"}'::jsonb, 'Trần Hữu Hải', 'S4 Lãnh đạo duyệt', 'Cao', '2025-03-15', '2025-03-20', 100, ARRAY['ARC', 'LOD300']),
('t2', '40.10.15.02', 'Dựng mô hình Kiến trúc Tầng 2', 'p2', '{"name": "Vũ Ngọc Thủy", "role": "Modeler"}'::jsonb, 'Trần Hữu Hải', 'S0 Đang thực hiện', 'Trung bình', '2025-03-21', '2025-03-25', 45, ARRAY['ARC']),
('t3', '40.10.10.01', 'Dựng mô hình Kết cấu Móng', 'p2', '{"name": "Nguyễn Đức Thành", "role": "Modeler"}'::jsonb, 'Trần Hữu Hải', 'S6 Trình khách hàng', 'Cao', '2025-03-13', '2025-03-18', 100, ARRAY['STR']);

SELECT 'All sample data inserted successfully!' as message;
