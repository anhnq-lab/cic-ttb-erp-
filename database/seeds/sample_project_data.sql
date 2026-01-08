-- =====================================================
-- SUPABASE SEED DATA - CIC.TTB.ERP
-- Bộ dữ liệu mẫu đầy đủ cho testing
-- =====================================================

-- 1. EMPLOYEES (Nhân viên)
-- Schema: id, user_id, code, name, email, phone, avatar, role, department, status, join_date, dob, degree, certificates, graduation_year, skills, profile_url
-- =====================================================
INSERT INTO employees (id, code, name, email, phone, department, avatar, status) VALUES
('e1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'NV001', 'Nguyễn Đức Thành', 'thanh.nguyen@cic.vn', '0901234567', 'Ký thuật BIM', 'https://i.pravatar.cc/150?img=1', 'Chính thức'),
('e2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'NV002', 'Trần Hữu Hải', 'hai.tran@cic.vn', '0912345678', 'Ban Giám Đốc', 'https://i.pravatar.cc/150?img=12', 'Chính thức'),
('e3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8', 'NV003', 'Vũ Văn Hòa', 'hoa.vu@cic.vn', '0923456789', 'Ký thuật BIM', 'https://i.pravatar.cc/150?img=33', 'Chính thức'),
('e4d5e6f7-a8b9-c0d1-e2f3-a4b5c6d7e8f9', 'NV004', 'Phạm Thị Lan', 'lan.pham@cic.vn', '0934567890', 'Hành chính', 'https://i.pravatar.cc/150?img=5', 'Chính thức'),
('e5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0', 'NV005', 'Lê Minh Tuấn', 'tuan.le@cic.vn', '0945678901', 'Ký thuật BIM', 'https://i.pravatar.cc/150?img=15', 'Chính thức'),
('e6f7a8b9-c0d1-e2f3-a4b5-c6d7e8f9a0b1', 'NV006', 'Nguyễn Quốc Anh', 'anh.nguyen@cic.vn', '0956789012', 'Ký thuật BIM', 'https://i.pravatar.cc/150?img=8', 'Thử việc'),
('e7a8b9c0-d1e2-f3a4-b5c6-d7e8f9a0b1c2', 'NV007', 'Hoàng Thị Mai', 'mai.hoang@cic.vn', '0967890123', 'Xúc tiến dự án', 'https://i.pravatar.cc/150?img=9', 'Chính thức');

-- 2. PROJECTS (Dự án)
-- =====================================================
INSERT INTO projects (id, code, name, client_name, capital_source, construction_type, construction_level, budget, actual_cost, status, progress, start_date, deadline, description) VALUES
('p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 
 'DA-2026-001', 
 'Trung tâm Văn hóa Nghệ thuật Hà Nội', 
 'Sở Văn hóa & Thể thao Hà Nội',
 'StateBudget',
 'New',
 'I',
 25000000000,
 12500000000,
 'InProgress',
 35,
 '2026-01-01',
 '2026-06-30',
 'Thiết kế BIM và hỗ trợ QLDA cho Trung tâm Văn hóa Nghệ thuật quy mô 15.000m² tại quận Hoàn Kiếm, Hà Nội');

-- 3. PROJECT_MEMBERS (Thành viên dự án)
-- =====================================================
INSERT INTO project_members (id, project_id, employee_id, role, joined_at) VALUES
('pm1a2b3c-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'e2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'GĐTT', '2026-01-01'),
('pm2b3c4d-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'e1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'QL BIM', '2026-01-01'),
('pm3c4d5e-f7a8-b9c0-d1e2-f3a4b5c6d7e8', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'e3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8', 'ĐPBM', '2026-01-01'),
('pm4d5e6f-a8b9-c0d1-e2f3-a4b5c6d7e8f9', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'e5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0', 'TNDH', '2026-01-01'),
('pm5e6f7a-b9c0-d1e2-f3a4-b5c6d7e8f9a0', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'e6f7a8b9-c0d1-e2f3-a4b5-c6d7e8f9a0b1', 'NDH', '2026-01-01'),
('pm6f7a8b-c0d1-e2f3-a4b5-c6d7e8f9a0b1', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'e7a8b9c0-d1e2-f3a4-b5c6-d7e8f9a0b1c2', 'TBP XTDA', '2026-01-01'),
('pm7a8b9c-d1e2-f3a4-b5c6-d7e8f9a0b1c2', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'e4d5e6f7-a8b9-c0d1-e2f3-a4b5c6d7e8f9', 'Admin', '2026-01-01');

-- 4. TASKS (Công việc với RACI roles đầy đủ I/A/C/R)
-- =====================================================
-- Phase 1: Xúc tiến & Chuẩn bị
INSERT INTO tasks (id, project_id, code, name, status, priority, tags, phase, raci_roles, assignee_id, progress, start_date, due_date) VALUES
('t001', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '1.1', 'Thuyết trình khách hàng', 'Completed', 'High', ARRAY['1. Xúc tiến & Chuẩn bị'], '1. Xúc tiến & Chuẩn bị', 
'{"GĐTT": "C", "PGĐTT": "C", "TBP ADMIN": "I", "TBP QA/QC": "I", "TBM": "I", "TVBM": "I", "TBP XTDA": "R", "TBP R&D": "C", "QLDA": "C", "QL BIM": "C", "ĐPBM": "R", "TNDH": "I", "NDH": "I"}'::jsonb,
'e7a8b9c0-d1e2-f3a4-b5c6-d7e8f9a0b1c2', 100, '2026-01-01', '2026-01-08'),

('t002', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '1.2', 'Liên hệ khách hàng nắm bắt thông tin định kỳ', 'Completed', 'Medium', ARRAY['1. Xúc tiến & Chuẩn bị'], '1. Xúc tiến & Chuẩn bị',
'{"GĐTT": "I", "PGĐTT": "I", "TBP XTDA": "R", "QLDA": "R"}'::jsonb,
'e7a8b9c0-d1e2-f3a4-b5c6-d7e8f9a0b1c2', 100, '2026-01-04', '2026-01-11'),

('t003', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '1.3', 'Cập nhật danh mục khách hàng', 'InProgress', 'Low', ARRAY['1. Xúc tiến & Chuẩn bị'], '1. Xúc tiến & Chuẩn bị',
'{"GĐTT": "I", "PGĐTT": "I", "TBM": "I", "TBP XTDA": "R"}'::jsonb,
'e7a8b9c0-d1e2-f3a4-b5c6-d7e8f9a0b1c2', 60, '2026-01-07', '2026-01-14'),

('t004', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '1.4', 'Thu thập dữ liệu đầu vào báo giá', 'InProgress', 'High', ARRAY['1. Xúc tiến & Chuẩn bị'], '1. Xúc tiến & Chuẩn bị',
'{"GĐTT": "I", "PGĐTT": "I", "TBM": "I", "TVBM": "I", "TBP XTDA": "R", "QLDA": "I", "QL BIM": "C"}'::jsonb,
'e7a8b9c0-d1e2-f3a4-b5c6-d7e8f9a0b1c2', 75, '2026-01-10', '2026-01-17');

-- Phase 2: Báo giá & Hợp đồng
INSERT INTO tasks (id, project_id, code, name, status, priority, tags, phase, raci_roles, assignee_id, progress, start_date, due_date) VALUES
('t005', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '2.1', 'Tạo thư mục Dự án tiềm năng', 'Completed', 'Medium', ARRAY['2. Báo giá & Hợp đồng'], '2. Báo giá & Hợp đồng',
'{"GĐTT": "A", "PGĐTT": "I", "TBM": "I", "TBP XTDA": "R"}'::jsonb,
'e7a8b9c0-d1e2-f3a4-b5c6-d7e8f9a0b1c2', 100, '2026-01-13', '2026-01-20'),

('t006', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '2.2', 'Chốt khối lượng báo giá', 'Completed', 'High', ARRAY['2. Báo giá & Hợp đồng'], '2. Báo giá & Hợp đồng',
'{"GĐTT": "A", "TBP XTDA": "R"}'::jsonb,
'e7a8b9c0-d1e2-f3a4-b5c6-d7e8f9a0b1c2', 100, '2026-01-16', '2026-01-23'),

('t007', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '2.3', 'Xem xét sự khả thi về kỹ thuật', 'InProgress', 'High', ARRAY['2. Báo giá & Hợp đồng'], '2. Báo giá & Hợp đồng',
'{"GĐTT": "R", "TBP XTDA": "C"}'::jsonb,
'e2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 80, '2026-01-19', '2026-01-26');

-- Phase 3: Chuẩn bị  
INSERT INTO tasks (id, project_id, code, name, status, priority, tags, phase, raci_roles, assignee_id, progress, start_date, due_date) VALUES
('t008', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '3.1', 'Bổ nhiệm QLDA/QLB cho Dự án', 'Completed', 'High', ARRAY['3. Chuẩn bị'], '3. Chuẩn bị',
'{"GĐTT": "A", "PGĐTT": "R", "TBP ADMIN": "I"}'::jsonb,
'e2b3c4d5-e6f7-a8b9-c0d1-e2f3a4b5c6d7', 100, '2026-01-22', '2026-01-29'),

('t009', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '3.2', 'Bổ nhiệm thành viên dự án', 'Completed', 'High', ARRAY['3. Chuẩn bị'], '3. Chuẩn bị',
'{"GĐTT": "A", "PGĐTT": "C", "TBP ADMIN": "I", "TBM": "R", "QLDA": "R", "QL BIM": "R"}'::jsonb,
'e1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 100, '2026-01-25', '2026-02-01'),

('t010', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '3.3', 'Tạo lập Folder Dự án', 'InProgress', 'Medium', ARRAY['3. Chuẩn bị'], '3. Chuẩn bị',
'{"GĐTT": "I", "QLDA": "R", "QL BIM": "C"}'::jsonb,
'e1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 90, '2026-01-28', '2026-02-04'),

('t011', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '3.4', 'Tạo lập Dự án trên Bimcollab', 'InProgress', 'Medium', ARRAY['3. Chuẩn bị'], '3. Chuẩn bị',
'{"GĐTT": "I", "QLDA": "R", "QL BIM": "C", "ĐPBM": "R"}'::jsonb,
'e3c4d5e6-f7a8-b9c0-d1e2-f3a4b5c6d7e8', 70, '2026-01-31', '2026-02-07'),

('t012', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '3.5', 'Thiết lập CDE dự án', 'Open', 'High', ARRAY['3. Chuẩn bị'], '3. Chuẩn bị',
'{"GĐTT": "I", "PGĐTT": "I", "QLDA": "A", "QL BIM": "R", "ĐPBM": "R"}'::jsonb,
'e1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 0, '2026-02-03', '2026-02-10');

-- Phase 4: Triển khai trình thẩm định
INSERT INTO tasks (id, project_id, code, name, status, priority, tags, phase, raci_roles, assignee_id, progress, start_date, due_date) VALUES
('t013', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '4.1', 'Dựng mô hình phục vụ trình thẩm định', 'Open', 'High', ARRAY['4. Triển khai trình thẩm định'], '4. Triển khai trình thẩm định',
'{"GĐTT": "I", "PGĐTT": "I", "TBP QA/QC": "C", "QLDA": "A", "QL BIM": "C", "ĐPBM": "C", "TNDH": "R", "NDH": "R"}'::jsonb,
'e5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0', 0, '2026-02-06', '2026-02-13'),

('t014', 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', '4.2', 'Xuất bản vẽ phục vụ thẩm định', 'Open', 'High', ARRAY['4. Triển khai trình thẩm định'], '4. Triển khai trình thẩm định',
'{"GĐTT": "I", "PGĐTT": "I", "TBP QA/QC": "C", "QLDA": "A", "QL BIM": "C", "ĐPBM": "C", "TNDH": "R", "NDH": "R"}'::jsonb,
'e5e6f7a8-b9c0-d1e2-f3a4-b5c6d7e8f9a0', 0, '2026-02-09', '2026-02-16');

-- 5. CONTRACTS (Hợp đồng)
-- =====================================================
INSERT INTO contracts (id, code, name, project_id, client_name, signing_date, start_date, end_date, total_value, paid_value, payment_status, contract_type, status, scope, payment_terms) VALUES
('c1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
 'HĐ-2026-001',
 'Hợp đồng Tư vấn BIM - Trung tâm Văn hóa Nghệ thuật Hà Nội',
 'p1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6',
 'Sở Văn hóa & Thể thao Hà Nội',
 '2025-12-20',
 '2026-01-01',
 '2026-06-30',
 25000000000,
 5000000000,
 'Partial',
 'Service',
 'Active',
 'Thiết kế BIM LOD 350, Xuất bản vẽ 2D, Hỗ trợ QLDA, Quản lý CDE',
 '20% ký HĐ, 30% hoàn thành thẩm định, 30% hoàn thành thi công, 20% nghiệm thu');

-- 6. SUMMARY
-- =====================================================
-- Tổng kết dữ liệu đã tạo:
SELECT 
  (SELECT COUNT(*) FROM employees) as employees_count,
  (SELECT COUNT(*) FROM projects) as projects_count,
  (SELECT COUNT(*) FROM project_members) as project_members_count,
  (SELECT COUNT(*) FROM tasks) as tasks_count,
  (SELECT COUNT(*) FROM contracts) as contracts_count;
