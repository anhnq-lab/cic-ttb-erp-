-- 007_comprehensive_seed_data.sql
-- Created by Antigravity
-- Purpose: Create missing tables and populate ALL tables with comprehensive sample data (Foreign Key consistent)

-- 1. CLEANUP (Reverse order of dependencies)
-- Note: 'CASCADE' handles dependencies, but explicit order is safer/cleaner logic.
DELETE FROM payment_transactions;
DELETE FROM payment_milestones;
DELETE FROM task_comments;
DELETE FROM subtasks;
DELETE FROM tasks;
DELETE FROM project_members;
DELETE FROM contract_personnel; -- If exists, or just clear contracts
DELETE FROM contracts;
DELETE FROM projects;
DELETE FROM crm_opportunities;
DELETE FROM crm_activities;
DELETE FROM crm_contacts;
DELETE FROM customers;
DELETE FROM employees;

-- 2. SCHEMA UPDATES (Create missing tables if they don't exist)

-- Enable UUID extension just in case
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2.1 Project Members
CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, employee_id)
);

-- 2.2 Payment Tables (for Contracts)
CREATE TABLE IF NOT EXISTS payment_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    phase TEXT NOT NULL,
    condition TEXT,
    percentage NUMERIC(5,2),
    amount NUMERIC(15,2),
    due_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'Pending', -- 'Pending', 'Paid', etc.
    expected_amount NUMERIC(15,2),
    completion_progress NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    description TEXT,
    amount NUMERIC(15,2),
    payment_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'Pending',
    payment_method TEXT,
    invoice_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.3 Task Extensions
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assignee_id UUID REFERENCES employees(id);

CREATE TABLE IF NOT EXISTS subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    assignee_id UUID REFERENCES employees(id), -- Optional
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES employees(id), -- ID of the commenter
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2.4 CRM Tables
CREATE TABLE IF NOT EXISTS crm_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    position TEXT,
    email TEXT,
    phone TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- Meeting, Call, Email...
    date TIMESTAMP WITH TIME ZONE,
    title TEXT,
    description TEXT,
    created_by TEXT, -- Or UUID ref
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    value NUMERIC(15,2),
    stage TEXT, -- New, Qualification...
    probability NUMERIC(5,2),
    expected_close_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. DATA SEEDING

-- 3.1 Employees (Using consistent UUIDs for referencing)
-- NV001 -> e0000001-...
-- NV002 -> e0000002-...
INSERT INTO employees (id, code, name, role, department, email, phone, avatar, status, join_date) VALUES
('e0000001-e000-0000-0000-000000000001', 'NV001', 'Đặng Đức Hà', 'Chủ tịch HĐQT', 'Ban Giám Đốc', 'dangducha@cic.com.vn', '', 'https://ui-avatars.com/api/?name=DangDucHa', 'Chính thức', '2010-01-01'),
('e0000002-e000-0000-0000-000000000002', 'NV002', 'Nguyễn Hoàng Hà', 'Tổng Giám đốc', 'Ban Giám Đốc', 'hoangha@cic.com.vn', '', 'Nhanvien_Images/TGĐ.Anh.121313.jpg', 'Chính thức', '2015-01-15'),
('e0000003-e000-0000-0000-000000000003', 'NV003', 'Lương Thanh Hưng', 'Phó tổng giám đốc', 'Ban Giám Đốc', 'hunglt83@gmail.com', '0886916666', 'Nhanvien_Images/NV001.Anh.041800.jpg', 'Chính thức', '2016-01-01'),
('e0000006-e000-0000-0000-000000000006', 'NV006', 'Trần Hữu Hải', 'Giám đốc TT BIM&Digital Twin', 'Ban Giám Đốc', 'haith@cic.com.vn', '0353582757', 'Nhanvien_Images/NV004.Anh.041830.jpg', 'Chính thức', '2017-01-01'),
('e0000005-e000-0000-0000-000000000005', 'NV005', 'Nguyễn Đức Thành', 'Trưởng bộ phận TQLCL', 'Kỹ thuật - BIM', 'ducthanh@cic.com.vn', '', 'Nhanvien_Images/NV003.Anh.041823.jpg', 'Chính thức', '2019-01-01'),
('e0000012-e000-0000-0000-000000000012', 'NV012', 'Nguyễn Bá Nhiệm', 'Phó giám đốc trung tâm', 'Kỹ thuật - MEP', 'banhiem@cic.com.vn', '', 'https://ui-avatars.com/api/?name=NguyenBaNhiem', 'Chính thức', '2015-01-01'),
('e0000019-e000-0000-0000-000000000019', 'NV019', 'Vũ Ngọc Thủy', 'Kiến trúc sư', 'Kỹ thuật - Kiến trúc', 'thuyvn@cic.com.vn', '', 'https://ui-avatars.com/api/?name=VuNgocThuy', 'Chính thức', '2020-01-01'),
('e0000007-e000-0000-0000-000000000007', 'NV007', 'Đông Quỳnh', 'Admin', 'Hành chính - Nhân sự', 'quynhdd@cic.com.vn', '', 'Nhanvien_Images/604ff785.Anh.041838.jpg', 'Chính thức', '2020-01-01')
-- Add others as needed, referencing constants.ts data
;

-- 3.2 Customers
-- CUST-001 -> c0000001-...
INSERT INTO customers (id, code, name, short_name, type, category, tax_code, address, status, tier) VALUES
('c0000001-c000-0000-0000-000000000001', 'VIG', 'Tập đoàn Vingroup - CTCP', 'VinGroup', 'Client', 'RealEstate', '0101234567', 'Long Biên, Hà Nội', 'Active', 'VIP'),
('c0000002-c000-0000-0000-000000000002', 'QLDA-DDCN', 'Ban QLDA ĐTXD Các công trình DD&CN', 'Ban DD&CN', 'Client', 'StateBudget', '315584775', 'TP Hồ Chí Minh', 'Active', 'Standard'),
('c0000003-c000-0000-0000-000000000003', 'COTECCONS', 'Công ty Cổ phần Xây dựng Coteccons', 'Coteccons', 'Client', 'Construction', '0303443233', 'Bình Thạnh, TP.HCM', 'Active', 'Gold'),
('c0000005-c000-0000-0000-000000000005', 'SUN', 'Công ty Cổ phần Tập đoàn Mặt Trời', 'Sun Group', 'Client', 'RealEstate', '0401345678', 'Hà Nội', 'Inactive', 'VIP')
;

-- 3.3 Projects
-- P-007 -> p007p007-...
INSERT INTO projects (
    id, code, name, client, location, manager, 
    project_group, construction_type, construction_level, scale, 
    capital_source, status, progress, budget, spent, deadline, members_count, thumbnail
) VALUES
(
    'p007p007-p007-p007-p007-p007p007p007', '25016', 'CẦU THỦ THIÊM 4', 'Ban QLDA Giao thông TP.HCM', 'TP. Thủ Đức - Quận 7', 'Trần Hữu Hải',
    'Nhóm A', 'Công trình giao thông', 'Cấp đặc biệt', 'Cầu dây văng 2km',
    'StateBudget', 'Lập kế hoạch', 15, 8500000000, 450000000, '2028-04-30', 12, 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=500&auto=format&fit=crop&q=60'
),
(
    'p005p005-p005-p005-p005-p005p005p005', '24012', 'LEGO FACTORY VSIP III', 'LEGO Group', 'VSIP III, Bình Dương', 'Lương Thành Hưng',
    'Nhóm A', 'Công trình công nghiệp', 'Cấp I', '44 ha',
    'NonStateBudget', 'Đang thực hiện', 42, 25000000000, 8500000000, '2025-08-01', 25, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=60'
),
(
    'p003p003-p003-p003-p003-p003p003p003', '24005', 'GLORY HEIGHTS - VINHOMES GRAND PARK', 'Tập đoàn Vingroup - CTCP', 'TP. Thủ Đức, TP.HCM', 'Nguyễn Bá Nhiệm',
    'Nhóm A', 'Công trình dân dụng', 'Cấp I', '5 tòa tháp 39 tầng',
    'NonStateBudget', 'Hoàn thành', 100, 3500000000, 3100000000, '2024-10-15', 20, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&auto=format&fit=crop&q=60'
),
(
    'p000nd14-b000-0000-0000-00000000nd14b', '25010', 'BỆNH VIỆN NHI ĐỒNG 1 - KHỐI 4B', 'Ban QLDA Dân dụng & Công nghiệp TP.HCM', 'Quận 10, TP. Hồ Chí Minh', 'Nguyễn Quốc Anh',
    'Nhóm B', 'Công trình dân dụng', 'Cấp I', '35.000 m2 sàn',
    'StateBudget', 'Đang thực hiện', 65, 155000000, 85000000, '2025-04-26', 8, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&auto=format&fit=crop&q=60'
),
(
    'p004p004-p004-p004-p004-p004p004p004', '22099', 'METRO LINE 2 (BẾN THÀNH - THAM LƯƠNG)', 'Ban QL Đường sắt Đô thị (MAUR)', 'TP.HCM', 'Trần Hữu Hải',
    'Quan trọng quốc gia', 'Công trình giao thông', 'Cấp đặc biệt', '11km ngầm & trên cao',
    'StateBudget', 'Lập kế hoạch', 5, 47000000000, 500000000, '2030-12-31', 30, 'https://images.unsplash.com/photo-1510252833074-ce467a807d9d?w=500&auto=format&fit=crop&q=60'
);

-- 3.4 Contracts
-- Link via project_id
INSERT INTO contracts (
    id, project_id, code, package_name, signed_date, 
    total_value, status
) VALUES
(
    'c007c007-c007-c007-c007-c007c007c007', 'p007p007-p007-p007-p007-p007p007p007', '07/2025/HĐ-TV', 
    'Tư vấn lập Báo cáo nghiên cứu khả thi & Thiết kế cơ sở', '2025-01-15',
    8500000000, 'Hiệu lực'
),
(
    'c005c005-c005-c005-c005-c005c005c005', 'p005p005-p005-p005-p005-p005p005p005', 'LG-CIC-2024-001',
    'BIM Consultancy Services for MEP & Construction Simulation', '2024-03-10',
    25000000000, 'Hiệu lực'
),
(
    'c003c003-c003-c003-c003-c003c003c003', 'p003p003-p003-p003-p003-p003p003p003', 'VGP-GH-CIC-089',
    'Tư vấn QLDA & Giám sát thi công', '2023-01-15',
    3500000000, 'Hoàn thành'
);

-- 3.5 Payment Milestones & Transactions (For Cầu Thủ Thiêm 4)
INSERT INTO payment_milestones (contract_id, phase, percentage, amount, due_date, status) VALUES
('c007c007-c007-c007-c007-c007c007c007', 'Tạm ứng', 20, 1500000000, '2025-02-01', 'Đã thanh toán'),
('c007c007-c007-c007-c007-c007c007c007', 'Báo cáo giữa kỳ', 30, 2550000000, '2025-06-01', 'Chưa thanh toán');

INSERT INTO payment_transactions (contract_id, description, amount, payment_date, status) VALUES
('c007c007-c007-c007-c007-c007c007c007', 'Tạm ứng đợt 1', 1500000000, '2025-02-05', 'Đã thanh toán');

-- 3.6 Tasks (Including Subtasks & Comments via CTE or separate inserts)

-- Task P-007-001
INSERT INTO tasks (id, project_id, code, name, status, priority, progress, start_date, due_date, assignee_id) VALUES
('t0070001-t007-0000-0000-000000000001', 'p007p007-p007-p007-p007-p007p007p007', 'P7.01.01', 'Khảo sát địa chất bổ sung', 'Hoàn thành', 'Cao', 100, '2025-01-20', '2025-02-10', 'e0000003-e000-0000-0000-000000000003');

INSERT INTO subtasks (task_id, title, completed) VALUES
('t0070001-t007-0000-0000-000000000001', 'Khoan 3 hố khoan tại trụ T1', true),
('t0070001-t007-0000-0000-000000000001', 'Thí nghiệm mẫu đất', true);

-- Task P-007-002
INSERT INTO tasks (id, project_id, code, name, status, priority, progress, start_date, due_date, assignee_id) VALUES
('t0070002-t007-0000-0000-000000000002', 'p007p007-p007-p007-p007-p007p007p007', 'P7.02.05', 'Lập mô hình cầu dẫn phía Quận 7', 'S0 Đang thực hiện', 'Cao', 60, '2025-02-15', '2025-03-30', 'e0000006-e000-0000-0000-000000000006');

INSERT INTO subtasks (task_id, title, completed) VALUES
('t0070002-t007-0000-0000-000000000002', 'Mô hình cọc khoan nhồi', true),
('t0070002-t007-0000-0000-000000000002', 'Mô hình dầm Super T', false);

INSERT INTO task_comments (task_id, user_id, content) VALUES
('t0070002-t007-0000-0000-000000000002', 'e0000006-e000-0000-0000-000000000006', 'Chú ý chiều cao tĩnh không theo TCVN.');

-- Task ND1-001
INSERT INTO tasks (id, project_id, code, name, status, priority, progress, start_date, due_date, assignee_id) VALUES
('tnd10001-tnd1-0000-0000-000000000001', 'p000nd14-b000-0000-0000-00000000nd14b', '40.10.15.01', 'Dựng mô hình Kiến trúc Tầng 1', 'S4 Lãnh đạo duyệt', 'Cao', 100, '2025-03-15', '2025-03-20', 'e0000019-e000-0000-0000-000000000019');

INSERT INTO subtasks (task_id, title, completed) VALUES
('tnd10001-tnd1-0000-0000-000000000001', 'Dựng tường bao che', true),
('tnd10001-tnd1-0000-0000-000000000001', 'Đặt cửa đi và cửa sổ', true);

INSERT INTO task_comments (task_id, user_id, content) VALUES
('tnd10001-tnd1-0000-0000-000000000001', 'e0000006-e000-0000-0000-000000000006', 'Lưu ý kiểm tra cao độ trần giả tại khu vực sảnh.');

-- 3.7 CRM Data
INSERT INTO crm_contacts (id, customer_id, name, position, email, is_primary) VALUES
(uuid_generate_v4(), 'c0000001-c000-0000-0000-000000000001', 'Ông Lê Văn A', 'Giám đốc Ban QLDA', 'a.le@vingroup.net', true);

INSERT INTO crm_opportunities (id, customer_id, name, value, stage, probability) VALUES
(uuid_generate_v4(), 'c0000001-c000-0000-0000-000000000001', 'BIM cho Vinhomes Cổ Loa', 5500000000, 'Negotiation', 80);

-- 3.8 Project Members (Roles)
INSERT INTO project_members (project_id, employee_id, role) VALUES
('p007p007-p007-p007-p007-p007p007p007', 'e0000006-e000-0000-0000-000000000006', 'Giám đốc Dự án'),
('p007p007-p007-p007-p007-p007p007p007', 'e0000003-e000-0000-0000-000000000003', 'BIM Manager'),
('p000nd14-b000-0000-0000-00000000nd14b', 'e0000019-e000-0000-0000-000000000019', 'BIM Modeler (ARC)'),
('p005p005-p005-p005-p005-p005p005p005', 'e0000012-e000-0000-0000-000000000012', 'MEP Lead');
