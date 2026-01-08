-- ============================================
-- SEED DATA SCRIPT
-- Run sau khi chạy 001_initial_schema.sql
-- ============================================

-- ============================================
-- SEED: EMPLOYEES (Sample Data)
-- ============================================
INSERT INTO public.employees (id, code, name, email, phone, role, department, status, join_date, skills) VALUES
    (uuid_generate_v4(), 'NV001', 'Nguyễn Văn An', 'an.nv@cic.vn', '0901234567', 'Giám đốc Trung tâm', 'Ban Giám đốc', 'Chính thức', '2020-01-15', ARRAY['BIM', 'Quản lý dự án', 'Leadership']),
    (uuid_generate_v4(), 'NV002', 'Trần Thị Bình', 'binh.tt@cic.vn', '0901234568', 'Trưởng phòng QLDA', 'Phòng QLDA', 'Chính thức', '2020-03-01', ARRAY['Revit', 'Navisworks', 'PMP']),
    (uuid_generate_v4(), 'NV003', 'Lê Minh Châu', 'chau.lm@cic.vn', '0901234569', 'BIM Manager', 'Phòng BIM', 'Chính thức', '2020-06-15', ARRAY['Revit', 'Dynamo', 'Python']),
    (uuid_generate_v4(), 'NV004', 'Phạm Văn Dũng', 'dung.pv@cic.vn', '0901234570', 'BIM Coordinator', 'Phòng BIM', 'Chính thức', '2021-02-01', ARRAY['Revit', 'AutoCAD', 'Navisworks']),
    (uuid_generate_v4(), 'NV005', 'Hoàng Thị Em', 'em.ht@cic.vn', '0901234571', 'Kỹ sư BIM', 'Phòng BIM', 'Thử việc', '2024-11-01', ARRAY['Revit', 'AutoCAD']);

-- ============================================
-- SEED: CUSTOMERS (Sample Data)
-- ============================================
INSERT INTO public.customers (id, code, name, short_name, type, category, tax_code, address, representative, email, phone, status, tier, total_project_value) VALUES
    (uuid_generate_v4(), 'KH001', 'Tập đoàn Vingroup', 'Vingroup', 'Client', 'RealEstate', '0100108108', 'Số 7, Bằng Lăng 1, Vinhomes Riverside, Long Biên, Hà Nội', 'Phạm Nhật Vượng', 'contact@vingroup.net', '024.39747979', 'Active', 'VIP', 15000000000),
    (uuid_generate_v4(), 'KH002', 'Tổng công ty HUD', 'HUD', 'Client', 'StateBudget', '0100100234', '30 Phạm Văn Đồng, Cầu Giấy, Hà Nội', 'Nguyễn Văn Hùng', 'info@hud.com.vn', '024.35543636', 'Active', 'Gold', 8500000000),
    (uuid_generate_v4(), 'KH003', 'Công ty CP Đầu tư Nam Long', 'Nam Long', 'Client', 'RealEstate', '0304367396', 'Tầng 6, Tòa nhà Nam Long, 233 Điện Biên Phủ, Q3, TP.HCM', 'Nguyễn Xuân Quang', 'info@namlonggroup.com.vn', '028.38270999', 'Active', 'Gold', 5200000000);

-- ============================================
-- SEED: PROJECTS (Sample Data)  
-- ============================================
INSERT INTO public.projects (id, code, name, client, location, manager, capital_source, status, progress, budget, spent, deadline, members_count, thumbnail) VALUES
    (uuid_generate_v4(), '25001', 'BIM LOD400 - Tòa nhà VP Vincom Metropolis', 'Vingroup', 'Liễu Giai, Ba Đình, Hà Nội', 'Trần Thị Bình', 'NonStateBudget', 'Đang thực hiện', 75, 2500000000, 1800000000, 'Q2/2025', 8, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'),
    (uuid_generate_v4(), '25002', 'Digital Twin - Khu đô thị Ecopark', 'Ecopark', 'Văn Giang, Hưng Yên', 'Lê Minh Châu', 'NonStateBudget', 'Đang thực hiện', 45, 3800000000, 1600000000, 'Q4/2025', 12, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'),
    (uuid_generate_v4(), '25003', 'BIM Management - Bệnh viện Đa khoa tỉnh Bắc Ninh', 'Sở Y tế Bắc Ninh', 'TP Bắc Ninh, Bắc Ninh', 'Phạm Văn Dũng', 'StateBudget', 'Lập kế hoạch', 15, 1200000000, 150000000, 'Q1/2026', 5, 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc');

-- ============================================
-- SEED: CONTRACTS (Sample Data)
-- ============================================
INSERT INTO public.contracts (id, code, project_name, side_a_name, side_b_name, total_value, paid_value, remaining_value, status, signed_date, start_date, end_date) VALUES
    (uuid_generate_v4(), 'HĐ-25001-01', 'BIM LOD400 - Tòa nhà VP Vincom Metropolis', 'Tập đoàn Vingroup', 'Công ty CP Tư vấn Xây dựng Chuyển đổi số', 2500000000, 1500000000, 1000000000, 'Hiệu lực', '2024-12-01', '2024-12-15', '2025-06-30'),
    (uuid_generate_v4(), 'HĐ-25002-01', 'Digital Twin - Khu đô thị Ecopark', 'Ecopark', 'Công ty CP Tư vấn Xây dựng Chuyển đổi số', 3800000000, 1140000000, 2660000000, 'Hiệu lực', '2024-11-15', '2024-12-01', '2025-12-31'),
    (uuid_generate_v4(), 'HĐ-25003-01', 'BIM Management - Bệnh viện Đa khoa tỉnh Bắc Ninh', 'Sở Y tế Bắc Ninh', 'Công ty CP Tư vấn Xây dựng Chuyển đổi số', 1200000000, 0, 1200000000, 'Nháp', '2025-01-10', '2025-02-01', '2026-03-31');

-- ============================================
-- NOTE: Để chạy script này trong Supabase:
-- 1. Vào Supabase Dashboard > SQL Editor
-- 2. Paste toàn bộ nội dung này
-- 3. Click "Run"
-- ============================================
