-- ============================================
-- RESTORE FUNCTIONAL DATA
-- Based on constants.ts
-- Run this to restore all your mock data into Supabase
-- ============================================

-- Clear existing data
DELETE FROM public.contracts;
DELETE FROM public.projects;
DELETE FROM public.customers;
DELETE FROM public.employees;

-- 1. EMPLOYEES
INSERT INTO public.employees (id, code, name, email, role, department, status, skills) VALUES
    ('NV001', 'NV001', 'Đặng Đức Hà', 'dangducha@cic.com.vn', 'Chủ tịch HĐQT', 'Ban Giám Đốc', 'Chính thức', ARRAY['Quản lý', 'Chiến lược']),
    ('NV002', 'NV002', 'Nguyễn Hoàng Hà', 'hoangha@cic.com.vn', 'Tổng Giám đốc', 'Ban Giám Đốc', 'Chính thức', ARRAY['Quản lý', 'Chiến lược', 'BIM']),
    ('NV003', 'NV003', 'Lương Thanh Hưng', 'hunglt83@gmail.com', 'Phó tổng giám đốc', 'Ban Giám Đốc', 'Chính thức', ARRAY['Quản lý', 'BIM Manager']),
    ('NV004', 'NV004', 'Nguyễn Quốc Anh', 'anhnq@cic.com.vn', 'Trưởng bộ phận xúc tiến dự án (TXTDA)', 'Kinh doanh', 'Chính thức', ARRAY['Quản lý dự án', 'Kinh doanh']),
    ('NV006', 'NV006', 'Trần Hữu Hải', 'haith@cic.com.vn', 'Giám đốc TT BIM&Digital Twin', 'Ban Giám Đốc', 'Chính thức', ARRAY['BIM', 'Digital Twin', 'Quản lý DA']),
    ('NV005', 'NV005', 'Nguyễn Đức Thành', 'ducthanh@cic.com.vn', 'Trưởng bộ phận Quản lý chất lượng (TQLCL)', 'Kỹ thuật - BIM', 'Chính thức', ARRAY['QA/QC', 'BIM', 'Civil 3D']),
    ('NV007', 'NV007', 'Đông Quỳnh', 'quynhdd@cic.com.vn', 'Trưởng bộ phận Admin (TAM)', 'Hành chính - Nhân sự', 'Chính thức', ARRAY['Hành chính', 'Admin']);

-- 2. CUSTOMERS
INSERT INTO public.customers (id, code, name, short_name, type, category, tax_code, address, representative, phone, email, status, tier, total_project_value) VALUES
    ('CUST-001', 'VIG', 'Tập đoàn Vingroup - CTCP', 'VinGroup', 'Client', 'RealEstate', '0101234567', 'Hà Nội', 'Bà Phạm Thị Lan', '024 3974 9999', 'info@vingroup.net', 'Active', 'VIP', 15200000000),
    ('CUST-002', 'QLDA-DDCN', 'Ban QLDA ĐTXD Các công trình Dân dụng & CN', 'Ban DD&CN', 'Client', 'StateBudget', '315584775', 'TP Hồ Chí Minh', 'Ông Huỳnh Minh Hùng', '028 3835 6789', 'banqlda@tphcm.gov.vn', 'Active', 'Standard', 155000000),
    ('CUST-003', 'COTECCONS', 'Công ty Cổ phần Xây dựng Coteccons', 'Coteccons', 'Client', 'Construction', '0303443233', 'TP.HCM', 'Ông Bolat Duisenov', '028 3514 2255', 'contact@coteccons.vn', 'Active', 'Gold', 5400000000),
    ('CUST-004', 'HBC', 'Tập đoàn Xây dựng Hòa Bình', 'Hòa Bình Corp', 'Client', 'Construction', '0302495123', 'TP.HCM', 'Ông Lê Viết Hải', '028 3932 5030', 'info@hbcg.vn', 'Active', 'Gold', 3200000000);

-- 3. PROJECTS
INSERT INTO public.projects (
    id, code, name, client, location, manager,
    project_group, construction_type, construction_level, scale, capital_source,
    status, progress, budget, spent, deadline, members_count, thumbnail
) VALUES
    ('3a90ec11-3278-4989-be46-9ef2bb5a969f', '25099', 'TÒA NHÀ VĂN PHÒNG EIE TOWER', 'Công ty Cổ phần Công nghệ EIE', 'Cầu Giấy, Hà Nội', 'Nguyễn Thúy Hằng', 'Nhóm B', 'Công trình dân dụng', 'Cấp II', '25 tầng nổi, 3 tầng hầm', 'NonStateBudget', 'Lập kế hoạch', 5, 450000000000, 1200000000, '2026-12-31', 15, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'),
    ('ND1-4B', '25010', '25010-NHIDONG1_4B_BIM', 'Ban QLDA Dân dụng & Công nghiệp TP.HCM', 'TP. Hồ Chí Minh', 'Nguyễn Quốc Anh', 'Nhóm B', 'Công trình dân dụng', 'Cấp I', '35.000 m2 sàn', 'StateBudget', 'Đang thực hiện', 15, 155000000, 0, '2025-04-26', 5, 'https://picsum.photos/id/122/400/300'),
    ('1', '23001', '23001-SKYLINE_VIN_INT', 'Tập đoàn Vingroup - CTCP', 'Hà Nội', 'Nguyễn Hoàng Hà', 'Nhóm A', 'Công trình dân dụng', 'Cấp đặc biệt', '5 tháp 40 tầng', 'NonStateBudget', 'Đang thực hiện', 65, 4200000000, 2100000000, '2024-12-20', 12, 'https://picsum.photos/id/48/200/200'),
    ('P-003', '24005', 'GLORY-HEIGHTS-VINHOME', 'Tập đoàn Vingroup - CTCP', 'TP. Thủ Đức, TP.HCM', 'Nguyễn Bá Nhiệm', 'Nhóm A', 'Công trình dân dụng', 'Cấp I', '5 tòa tháp 39 tầng', 'NonStateBudget', 'Hoàn thành', 100, 3500000000, 3100000000, '2024-10-15', 20, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'),
    ('P-004', '22099', 'METRO-LINE-2-BEN-THANH', 'Ban QL Đường sắt Đô thị (MAUR)', 'TP.HCM', 'Trần Hữu Hải', 'Quan trọng quốc gia', 'Công trình giao thông', 'Cấp đặc biệt', '11km ngầm & trên cao', 'StateBudget', 'Lập kế hoạch', 5, 47000000000, 500000000, '2030-12-31', 8, 'https://images.unsplash.com/photo-1510252833074-ce467a807d9d'),
    ('P-005', '24012', 'LEGO-FACTORY-VSIP', 'LEGO Group', 'Bình Dương', 'Lương Thành Hưng', 'Nhóm A', 'Công trình công nghiệp', 'Cấp I', '44 ha', 'NonStateBudget', 'Tạm dừng', 35, 25000000000, 8000000000, '2025-08-01', 15, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'),
    ('P-006', '25015', 'TÒA NHÀ HỖN HỢP DIAMOND PLAZA', 'Tập đoàn Diamond', 'TP.HCM', 'Nguyễn Hoàng Hà', 'Nhóm A', 'Công trình dân dụng', 'Cấp I', '2 tháp 45 tầng', 'NonStateBudget', 'Lập kế hoạch', 10, 5000000000, 0, '2027-01-01', 10, 'https://images.unsplash.com/photo-1487958449943-2429e8be8625'),
    ('P-007', '25016', 'CẦU THỦ THIÊM 4', 'Ban QLDA Giao thông TP.HCM', 'TP. Thủ Đức - Quận 7', 'Trần Hữu Hải', 'Nhóm A', 'Công trình giao thông', 'Cấp đặc biệt', 'Cầu dây văng 2km', 'StateBudget', 'Lập kế hoạch', 2, 8500000000, 0, '2028-04-30', 12, 'https://images.unsplash.com/photo-1545558014-8692077e9b5c');

-- 4. CONTRACTS
INSERT INTO public.contracts (
    id, code, signed_date, package_name, project_name, location,
    contract_type, law_applied, side_a_name, side_b_name,
    total_value, vat_included, paid_value, remaining_value, wip_value,
    status, start_date, end_date
) VALUES
    ('C-01', '01/PPXD-CICHĐ2023', '2023-01-31', 'Tư vấn BIM - Thiết kế bản vẽ thi công', 'Tây Hồ Tây Lô K8CT1', 'Tây Hồ Tây Lô K8CT1', 'Tư vấn BIM', 'Luật Việt Nam', 'DAEWOO E&C', 'CIC Corp', 4730000000, true, 3440000000, 1290000000, 3440000000, 'Hiệu lực', '2023-01-31', '2023-01-31'),
    ('C-02', '02/PPXD-CICHĐ2023', '2023-01-31', 'Tư vấn BIM - Thiết kế bản vẽ thi công', 'Tây Hồ Tây Lô K8HH1', 'Tây Hồ Tây Lô K8HH1', 'Tư vấn BIM', 'Luật Việt Nam', 'DAEWOO E&C', 'CIC Corp', 4180000000, true, 4119200000, 60800000, 4119200000, 'Hiệu lực', '2023-01-31', '2023-01-31'),
    ('C-03', '44/PPXD-CICHĐ2023', '2023-06-13', 'Tư vấn BIM - Thiết kế bản vẽ thi công', 'Global Bussiness Center (GBC)', 'TP.HCM', 'Tư vấn BIM', 'Luật Việt Nam', 'STS VIỆT NAM', 'CIC Corp', 6264000000, true, 1879200000, 4384800000, 1879200000, 'Hiệu lực', '2023-06-13', '2023-06-13'),
    ('C-73', '73/PPXD-CICHĐ2023', '2023-08-08', 'Tư vấn BIM - Thi công', 'Kè suối Nặm La, Sơn La', 'Sơn La', 'Tư vấn BIM', 'Luật Việt Nam', 'Ban QLDA Sơn La', 'CIC Corp', 972981000, true, 972981000, 0, 972981000, 'Hoàn thành', '2023-08-08', '2023-12-20'),
    ('C-74', '74/PPXD-CICHĐ2023', '2023-08-15', 'Tư vấn BIM - Thiết kế bản vẽ thi công', 'Tây Hồ Tây Lô K2CT1', 'Hà Nội', 'Tư vấn BIM', 'Luật Việt Nam', 'DAEWOO E&C', 'CIC Corp', 4860000000, true, 2430000000, 2430000000, 2430000000, 'Hiệu lực', '2023-08-15', '2023-08-15'),
    ('C-01-2024-L2.2', '01/BIM-CICHĐ2024 LÔ 2.2', '2024-02-19', 'Tư vấn BIM - Thiết kế', 'Eco Smart City Plot 2-2', 'TP.HCM', 'Tư vấn BIM', 'Luật Việt Nam', 'LOTTE PROPERTIES', 'CIC Corp', 2035168000, true, 104404118, 1930763882, 104404118, 'Hiệu lực', '2024-02-19', '2024-02-19'),
    ('C-09-2024', '09/BIM-CICHĐ2024', '2024-12-17', 'Tư vấn BIM - Thi công', 'Khu công nghiệp Thuận Thành I', 'Bắc Ninh', 'Tư vấn BIM', 'Luật Việt Nam', 'VIGLACERA', 'CIC Corp', 3440000000, true, 103200000, 240800000, 103200000, 'Hiệu lực', '2024-12-17', '2025-06-15');

SELECT 'Data restored successfully! Refresh your app.' as message;
