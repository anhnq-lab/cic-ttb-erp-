-- ============================================
-- FIX: Allow Anonymous Read + UPSERT Seed Data
-- Run this to fix data issues
-- ============================================

-- Drop existing policies first (ignore errors if not exist)
DROP POLICY IF EXISTS "anon_read_projects" ON public.projects;
DROP POLICY IF EXISTS "anon_read_contracts" ON public.contracts;
DROP POLICY IF EXISTS "anon_read_employees" ON public.employees;
DROP POLICY IF EXISTS "anon_read_customers" ON public.customers;
DROP POLICY IF EXISTS "anon_read_tasks" ON public.tasks;
DROP POLICY IF EXISTS "anon_read_crm_contacts" ON public.crm_contacts;
DROP POLICY IF EXISTS "anon_read_crm_activities" ON public.crm_activities;
DROP POLICY IF EXISTS "anon_read_crm_opportunities" ON public.crm_opportunities;

-- Create anon read policies
CREATE POLICY "anon_read_projects" ON public.projects FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_contracts" ON public.contracts FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_employees" ON public.employees FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_customers" ON public.customers FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_tasks" ON public.tasks FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_crm_contacts" ON public.crm_contacts FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_crm_activities" ON public.crm_activities FOR SELECT TO anon USING (true);
CREATE POLICY "anon_read_crm_opportunities" ON public.crm_opportunities FOR SELECT TO anon USING (true);

-- ============================================
-- CLEAR AND RESEED DATA
-- ============================================

-- Clear existing data
DELETE FROM public.contracts;
DELETE FROM public.projects;
DELETE FROM public.customers;
DELETE FROM public.employees;

-- Employees
INSERT INTO public.employees (id, code, name, email, phone, role, department, status, skills) VALUES
    ('emp-001', 'NV001', 'Nguyễn Văn An', 'an@cic.vn', '0901234567', 'Giám đốc Trung tâm', 'Ban Giám đốc', 'Chính thức', ARRAY['BIM', 'Quản lý']),
    ('emp-002', 'NV002', 'Trần Thị Bình', 'binh@cic.vn', '0901234568', 'Trưởng phòng QLDA', 'Phòng QLDA', 'Chính thức', ARRAY['Revit', 'Navisworks']),
    ('emp-003', 'NV003', 'Lê Minh Châu', 'chau@cic.vn', '0901234569', 'BIM Manager', 'Phòng BIM', 'Chính thức', ARRAY['Revit', 'Dynamo', 'Python']),
    ('emp-004', 'NV004', 'Phạm Văn Dũng', 'dung@cic.vn', '0901234570', 'BIM Coordinator', 'Phòng BIM', 'Chính thức', ARRAY['Revit', 'AutoCAD']),
    ('emp-005', 'NV005', 'Hoàng Thị Em', 'em@cic.vn', '0901234571', 'Kỹ sư BIM', 'Phòng BIM', 'Thử việc', ARRAY['Revit']);

-- Customers
INSERT INTO public.customers (id, code, name, short_name, type, category, tax_code, address, status, tier, total_project_value) VALUES
    ('cus-001', 'KH001', 'Tập đoàn Vingroup', 'Vingroup', 'Client', 'RealEstate', '0100108108', 'Hà Nội', 'Active', 'VIP', 15000000000),
    ('cus-002', 'KH002', 'Tổng công ty HUD', 'HUD', 'Client', 'StateBudget', '0100100234', 'Hà Nội', 'Active', 'Gold', 8500000000),
    ('cus-003', 'KH003', 'Công ty CP Nam Long', 'Nam Long', 'Client', 'RealEstate', '0304367396', 'TP.HCM', 'Active', 'Gold', 5200000000);

-- Projects
INSERT INTO public.projects (id, code, name, client, location, manager, capital_source, status, progress, budget, spent, deadline, members_count, thumbnail) VALUES
    ('proj-001', '25001', 'BIM LOD400 - Tòa nhà VP Vincom Metropolis', 'Vingroup', 'Hà Nội', 'Trần Thị Bình', 'NonStateBudget', 'Đang thực hiện', 75, 2500000000, 1800000000, 'Q2/2025', 8, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'),
    ('proj-002', '25002', 'Digital Twin - Khu đô thị Ecopark', 'Ecopark', 'Hưng Yên', 'Lê Minh Châu', 'NonStateBudget', 'Đang thực hiện', 45, 3800000000, 1600000000, 'Q4/2025', 12, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'),
    ('proj-003', '25003', 'BIM Management - Bệnh viện ĐK Bắc Ninh', 'Sở Y tế Bắc Ninh', 'Bắc Ninh', 'Phạm Văn Dũng', 'StateBudget', 'Lập kế hoạch', 15, 1200000000, 150000000, 'Q1/2026', 5, 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc'),
    ('proj-004', '24015', 'BIM Coordination - Chung cư The Emerald', 'CT Group', 'TP.HCM', 'Trần Thị Bình', 'NonStateBudget', 'Hoàn thành', 100, 1800000000, 1800000000, 'Q4/2024', 6, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2'),
    ('proj-005', '25004', 'Scan to BIM - Nhà máy Samsung', 'Samsung', 'Thái Nguyên', 'Lê Minh Châu', 'NonStateBudget', 'Đang thực hiện', 30, 4500000000, 1200000000, 'Q3/2025', 10, 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c');

-- Contracts
INSERT INTO public.contracts (id, code, project_name, side_a_name, side_b_name, total_value, paid_value, remaining_value, status, signed_date, start_date, end_date) VALUES
    ('con-001', 'HD-25001-01', 'BIM LOD400 - Vincom Metropolis', 'Tập đoàn Vingroup', 'CIC TTB', 2500000000, 1500000000, 1000000000, 'Hiệu lực', '2024-12-01', '2024-12-15', '2025-06-30'),
    ('con-002', 'HD-25002-01', 'Digital Twin - Ecopark', 'Ecopark', 'CIC TTB', 3800000000, 1140000000, 2660000000, 'Hiệu lực', '2024-11-15', '2024-12-01', '2025-12-31'),
    ('con-003', 'HD-25003-01', 'BIM Management - BV Bắc Ninh', 'Sở Y tế Bắc Ninh', 'CIC TTB', 1200000000, 0, 1200000000, 'Nháp', '2025-01-10', '2025-02-01', '2026-03-31'),
    ('con-004', 'HD-24015-01', 'BIM Coordination - The Emerald', 'CT Group', 'CIC TTB', 1800000000, 1800000000, 0, 'Hoàn thành', '2024-06-01', '2024-06-15', '2024-12-31'),
    ('con-005', 'HD-25004-01', 'Scan to BIM - Samsung', 'Samsung', 'CIC TTB', 4500000000, 900000000, 3600000000, 'Hiệu lực', '2025-01-01', '2025-01-15', '2025-09-30');

SELECT 'Done! Refresh your app now.' as message;
