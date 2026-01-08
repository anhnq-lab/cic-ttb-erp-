-- ============================================
-- COMPREHENSIVE SEED DATA FOR CIC.TTB.ERP
-- Includes Schema Updates for Tasks
-- ============================================

-- 0. SCHEMA UPDATES (Ensure tasks table has new columns)
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS "phase" text;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS "raci_role" text;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS "order_index" integer DEFAULT 0;

-- CLEANUP (Optional: Remove if you want to keep existing data)
TRUNCATE TABLE public.task_comments, public.subtasks, public.tasks, public.payment_transactions, public.payment_milestones, public.contract_personnel, public.project_members, public.contracts, public.projects, public.crm_opportunities, public.crm_activities, public.crm_contacts, public.customers, public.employees RESTART IDENTITY CASCADE;

-- 1. EMPLOYEES
INSERT INTO employees (id, code, name, role, department, email, phone, avatar, status, join_date, skills) VALUES
('e1', 'CIC-001', 'Nguyễn Hoàng Hà', 'Giám đốc Trung tâm', 'Ban Giám Đốc', 'ha.nguyen@cic.com.vn', '0901.234.567', 'https://ui-avatars.com/api/?name=Nguyễn+Hoàng+Hà&background=0D8ABC&color=fff', 'Chính thức', '2015-01-15', ARRAY['Quản lý', 'BIM Strategy']),
('e2', 'CIC-002', 'Nguyễn Bá Nhiệm', 'Phó GĐTT', 'Ban Giám Đốc', 'nhiem.nguyen@cic.com.vn', '0909.888.777', 'https://ui-avatars.com/api/?name=Nguyễn+Bá+Nhiệm&background=0D8ABC&color=fff', 'Chính thức', '2016-03-20', ARRAY['MEP', 'Quản lý dự án']),
('e3', 'CIC-003', 'Lương Thành Hưng', 'BIM Manager', 'Kỹ thuật - BIM', 'hung.luong@cic.com.vn', '0912.345.678', 'https://ui-avatars.com/api/?name=Lương+Thành+Hưng&background=random&color=fff', 'Chính thức', '2018-06-01', ARRAY['BIM Coordination', 'Navisworks']),
('e4', 'CIC-004', 'Trần Hữu Hải', 'BIM Coordinator', 'Kỹ thuật - BIM', 'hai.tran@cic.com.vn', '0933.444.555', 'https://ui-avatars.com/api/?name=Trần+Hữu+Hải&background=random&color=fff', 'Chính thức', '2019-09-10', ARRAY['Revit API', 'Dynamo']),
('e5', 'CIC-005', 'Vũ Ngọc Thủy', 'KTS Chủ trì', 'Kỹ thuật - Kiến trúc', 'thuy.vu@cic.com.vn', '0987.654.321', 'https://ui-avatars.com/api/?name=Vũ+Ngọc+Thủy&background=random&color=fff', 'Chính thức', '2020-02-15', ARRAY['Architecture', 'Enscape']),
('e6', 'CIC-006', 'Nguyễn Đức Thành', 'Kỹ sư Kết cấu', 'Kỹ thuật - Kết cấu', 'thanh.nguyen@cic.com.vn', '0369.852.147', 'https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random&color=fff', 'Chính thức', '2021-05-20', ARRAY['Tekla', 'Robot']),
('e7', 'CIC-007', 'Đào Đông Quỳnh', 'Admin', 'Hành chính', 'quynh.dao@cic.com.vn', '0905.111.222', 'https://ui-avatars.com/api/?name=Đào+Đông+Quỳnh&background=random&color=fff', 'Chính thức', '2022-01-05', ARRAY['HR', 'Admin']),
('e8', 'CIC-008', 'Lê Thị Mai', 'Kế toán', 'Tài chính', 'mai.le@cic.com.vn', '0905.333.444', 'https://ui-avatars.com/api/?name=Lê+Thị+Mai&background=random&color=fff', 'Chính thức', '2019-08-01', ARRAY['Accounting', 'Tax']);

-- 2. CUSTOMERS
INSERT INTO customers (id, code, name, short_name, type, category, address, tax_code, representative, contact_person, email, phone, status, tier, total_project_value) VALUES
('cust1', 'VIG', 'Tập đoàn Vingroup - CTCP', 'VinGroup', 'Client', 'RealEstate', 'Long Biên, Hà Nội', '0101234567', 'Bà Phạm Thị Lan', 'Ông Lê Văn A', 'info@vingroup.net', '024 3974 9999', 'Active', 'VIP', 15000000000),
('cust2', 'SUN', 'Công ty CP Tập đoàn Mặt Trời', 'Sun Group', 'Client', 'RealEstate', 'Hai Bà Trưng, Hà Nội', '0102345678', 'Ông Đặng Minh Trường', 'Bà Lê Thị D', 'contact@sungroup.com.vn', '024 3938 6666', 'Active', 'VIP', 8000000000),
('cust3', 'COT', 'Coteccons Construction JSC', 'Coteccons', 'Partner', 'Construction', 'Bình Thạnh, TP.HCM', '0303443233', 'Ông Bolat Duisenov', 'Ông Nguyễn Văn B', 'contact@coteccons.vn', '028 3514 2255', 'Active', 'Gold', 5000000000),
('cust4', 'MAUR', 'Ban QL Đường sắt Đô thị TP.HCM', 'MAUR', 'Client', 'StateBudget', 'Quận 1, TP.HCM', '0301112223', 'Ông Bùi Xuân Cường', 'Ông Trần Văn C', 'maur@tphcm.gov.vn', '028 3829 9999', 'Active', 'Standard', 200000000);

-- 3. PROJECTS
INSERT INTO projects (id, code, name, client, customer_id, location, manager_id, manager, project_group, construction_type, construction_level, capital_source, status, progress, budget, spent, deadline, members_count, thumbnail) VALUES
('p1', '25010', '25010-NHIDONG1_4B_BIM', 'Ban QLDA Dân dụng & CN TP.HCM', 'cust4', 'TP. Hồ Chí Minh', 'e3', 'Lương Thành Hưng', 'Nhóm B', 'Công trình dân dụng', 'Cấp I', 'StateBudget', 'Đang thực hiện', 25, 155000000, 25000000, '2025-06-30', 5, 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=500'),
('p2', '24005', 'GLORY-HEIGHTS-VINHOME', 'Tập đoàn Vingroup', 'cust1', 'TP. Thủ Đức', 'e1', 'Nguyễn Hoàng Hà', 'Nhóm A', 'Công trình dân dụng', 'Cấp I', 'NonStateBudget', 'Hoàn thành', 100, 3500000000, 3100000000, '2024-12-15', 12, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=500'),
('p3', '25099', 'EIE-TOWER-OFFICE', 'EIE Technology JSC', NULL, 'Cầu Giấy, Hà Nội', 'e2', 'Nguyễn Bá Nhiệm', 'Nhóm B', 'Công trình văn phòng', 'Cấp II', 'NonStateBudget', 'Lập kế hoạch', 10, 450000000, 50000000, '2026-03-01', 8, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=500'),
('p4', '22099', 'METRO-LINE-2', 'MAUR', 'cust4', 'TP.HCM', 'e4', 'Trần Hữu Hải', 'Quan trọng quốc gia', 'Giao thông', 'Đặc biệt', 'StateBudget', 'Tạm hoãn', 40, 47000000000, 12000000000, '2030-12-31', 20, 'https://images.unsplash.com/photo-1510252833074-ce467a807d9d?auto=format&fit=crop&q=80&w=500');

-- 4. CONTRACTS
INSERT INTO contracts (id, project_id, code, signed_date, package_name, project_name, total_value, paid_value, remaining_value, status, duration, start_date, end_date) VALUES
('c1', 'p1', '30/2025/HĐ-DDCN', '2025-01-15', 'Tư vấn BIM', 'BV Nhi Đồng 1', 155000000, 46500000, 108500000, 'Hiệu lực', '180 ngày', '2025-01-20', '2025-07-20'),
('c2', 'p2', 'GH-2023/BIM', '2023-06-01', 'BIM Full Scope', 'Glory Heights', 3500000000, 3500000000, 0, 'Hoàn thành', '18 tháng', '2023-06-01', '2024-12-01'),
('c3', 'p3', '01/2025/EIE', '2025-02-01', 'Thiết kế Concept', 'EIE Tower', 450000000, 0, 450000000, 'Nháp', '90 ngày', '2025-03-01', '2025-06-01');

-- 5. PROJECT MEMBERS
INSERT INTO project_members (project_id, employee_id, role) VALUES
('p1', 'e3', 'BIM Manager'), ('p1', 'e4', 'Coordinator'), ('p1', 'e5', 'Modeler'),
('p2', 'e1', 'Director'), ('p2', 'e2', 'Manager'), ('p2', 'e4', 'Coordinator'),
('p3', 'e2', 'Manager'), ('p3', 'e6', 'Engineer');

-- 6. TASKS (Sample RACI integration)
INSERT INTO tasks (id, project_id, code, name, assignee_id, assignee_name, status, priority, due_date, progress, phase, raci_role) VALUES
-- Project 1 Checks
('t1', 'p1', '1.1.01', 'Thu thập dữ liệu đầu vào', 'e4', 'Trần Hữu Hải', 'S5 Đã duyệt', 'Cao', '2025-02-01', 100, '1. Xúc tiến & Chuẩn bị', 'R'),
('t2', 'p1', '3.1.01', 'Thiết lập CDE & Môi trường chung', 'e3', 'Lương Thành Hưng', 'S0 Đang thực hiện', 'Cao', '2025-02-15', 60, '3. Kế hoạch & Thiết lập', 'R'),
('t3', 'p1', '4.1.01', 'Dựng mô hình Kiến trúc Tầng 1', 'e5', 'Vũ Ngọc Thủy', 'Mở', 'Trung bình', '2025-03-10', 0, '4. Thực hiện & Phối hợp', 'R'),
-- Project 2 Checks
('t4', 'p2', '5.1.01', 'Bàn giao mô hình hoàn công', 'e4', 'Trần Hữu Hải', 'Hoàn thành', 'Thấp', '2024-12-01', 100, '5. Đóng dự án', 'R'),
-- Project 3 Checks
('t5', 'p3', '2.1.01', 'Lập báo giá sơ bộ', 'e2', 'Nguyễn Bá Nhiệm', 'S3 Duyệt nội bộ', 'Khẩn cấp', '2025-01-20', 80, '2. Báo giá & Hợp đồng', 'A');

-- 7. SUBTASKS
INSERT INTO subtasks (task_id, title, completed) VALUES
('t2', 'Cấu hình dự án trên ACC', true),
('t2', 'Mời thành viên tham gia', true),
('t2', 'Thiết lập permission folder', false);

-- 8. PAYMENT MILESTONES
INSERT INTO payment_milestones (contract_id, phase, percentage, amount, due_date, status) VALUES
('c1', 'Tạm ứng', 30, 46500000, '2025-01-25', 'Đã thanh toán'),
('c1', 'Giai đoạn 1', 40, 62000000, '2025-04-15', 'Chưa thanh toán'),
('c1', 'Nghiệm thu', 30, 46500000, '2025-07-20', 'Chưa thanh toán');

-- 9. PAYMENT TRANSACTIONS
INSERT INTO payment_transactions (contract_id, description, amount, payment_date, status) VALUES
('c1', 'Thanh toán tạm ứng 30%', 46500000, '2025-01-28', 'Đã thanh toán'),
('c2', 'Thanh toán đợt cuối', 500000000, '2024-12-10', 'Đã thanh toán');

-- 10. CRM
INSERT INTO crm_contacts (customer_id, name, position, email, is_primary) VALUES
('cust1', 'Lê Văn A', 'Trưởng ban QLDA', 'a.le@vingroup.net', true),
('cust4', 'Trần Văn C', 'Phó phòng Kỹ thuật', 'c.tran@maur.gov.vn', true);

INSERT INTO crm_activities (customer_id, type, date, title, description, created_by) VALUES
('cust1', 'Meeting', '2025-01-10', 'Họp kick-off dự án', 'Thống nhất quy trình phối hợp', 'e1'),
('cust4', 'Email', '2025-01-12', 'Gửi báo cáo tuần', 'Báo cáo tiến độ tuần 02/2025', 'e4');

INSERT INTO crm_opportunities (customer_id, name, value, stage, probability, expected_close_date) VALUES
('cust2', 'Digital Twin Sun World', 3000000000, 'Negotiation', 70, '2025-05-30'),
('cust3', 'Hỗ trợ BIM Coteccons', 1200000000, 'Proposal', 40, '2025-04-15');

SELECT 'Comprehensive seed data inserted successfully!' as message;
