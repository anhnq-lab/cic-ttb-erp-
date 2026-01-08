-- ============================================
-- SEED DATA FOR CIC.TTB.ERP
-- Run this AFTER supabase_schema.sql
-- ============================================

-- ============================================
-- 1. EMPLOYEES (Nhân sự)
-- ============================================
INSERT INTO employees (id, code, name, role, department, email, phone, avatar, status, "joinDate", skills) VALUES
('e1', 'CIC-001', 'Nguyễn Hoàng Hà', 'Giám đốc Trung tâm', 'Ban Giám Đốc', 'ha.nguyen@cic.com.vn', '0901.234.567', 'https://ui-avatars.com/api/?name=Nguyễn+Hoàng+Hà&background=random&color=fff&size=150', 'Chính thức', '2015-01-15', ARRAY['Quản lý', 'Chiến lược', 'Chuyên gia BIM']),
('e2', 'CIC-002', 'Nguyễn Bá Nhiệm', 'Phó GĐTT / Trưởng MEP', 'Ban Giám Đốc', 'nhiem.nguyen@cic.com.vn', '0909.888.777', 'https://ui-avatars.com/api/?name=Nguyễn+Bá+Nhiệm&background=random&color=fff&size=150', 'Chính thức', '2016-03-20', ARRAY['Thiết kế MEP', 'Quản lý dự án', 'Revit']),
('e3', 'CIC-005', 'Lương Thành Hưng', 'BIM Manager', 'Quản lý Dự án', 'hung.luong@cic.com.vn', '0912.345.678', 'https://ui-avatars.com/api/?name=Lương+Thành+Hưng&background=random&color=fff&size=150', 'Chính thức', '2018-06-01', ARRAY['Điều phối BIM', 'Navisworks', 'CDE']),
('e4', 'CIC-008', 'Trần Hữu Hải', 'BIM Coordinator', 'Kỹ thuật - BIM', 'hai.tran@cic.com.vn', '0933.444.555', 'https://ui-avatars.com/api/?name=Trần+Hữu+Hải&background=random&color=fff&size=150', 'Chính thức', '2019-09-10', ARRAY['Kiểm tra va chạm', 'Revit API', 'Dynamo']),
('e5', 'CIC-012', 'Vũ Ngọc Thủy', 'KTS Chủ trì', 'Kỹ thuật - Kiến trúc', 'thuy.vu@cic.com.vn', '0987.654.321', 'https://ui-avatars.com/api/?name=Vũ+Ngọc+Thủy&background=random&color=fff&size=150', 'Chính thức', '2020-02-15', ARRAY['Kiến trúc', 'Diễn họa', 'Enscape']),
('e6', 'CIC-015', 'Nguyễn Đức Thành', 'Kỹ sư Kết cấu', 'Kỹ thuật - Kết cấu', 'thanh.nguyen@cic.com.vn', '0369.852.147', 'https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random&color=fff&size=150', 'Chính thức', '2021-05-20', ARRAY['Tính toán kết cấu', 'Tekla', 'Revit']),
('e7', 'CIC-020', 'Đào Đông Quỳnh', 'Trưởng bộ phận Admin', 'Hành chính - Nhân sự', 'quynh.dao@cic.com.vn', '0905.123.456', 'https://ui-avatars.com/api/?name=Đào+Đông+Quỳnh&background=random&color=fff&size=150', 'Chính thức', '2022-01-05', ARRAY['Nhân sự', 'Kế toán', 'Hành chính']),
('e8', 'CIC-025', 'Phạm Văn Minh', 'Thực tập sinh BIM', 'Kỹ thuật - BIM', 'minh.pham@cic.com.vn', '0333.999.888', 'https://ui-avatars.com/api/?name=Phạm+Văn+Minh&background=random&color=fff&size=150', 'Thử việc', '2024-03-01', ARRAY['Revit Cơ bản', 'AutoCAD']),
('e9', 'CIC-022', 'Lê Thị Mai', 'Kế toán tổng hợp', 'Tài chính - Kế toán', 'mai.le@cic.com.vn', '0911.222.333', 'https://ui-avatars.com/api/?name=Lê+Thị+Mai&background=random&color=fff&size=150', 'Nghỉ phép', '2019-11-15', ARRAY['Kế toán', 'Thuế', 'Báo cáo tài chính'])
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 2. CUSTOMERS (Khách hàng/CRM)
-- ============================================
INSERT INTO customers (id, code, name, "shortName", type, category, "taxCode", address, representative, "contactPerson", email, phone, website, status, tier, "totalProjectValue", logo, rating, evaluation) VALUES
('CUST-001', 'VIG', 'Tập đoàn Vingroup - CTCP', 'VinGroup', 'Client', 'RealEstate', '0101234567', 'Số 7 Đường Bằng Lăng 1, KĐT Vinhomes Riverside, Long Biên, Hà Nội', 'Bà Phạm Thị Lan', 'Ông Lê Văn A (Ban QLDA)', 'info@vingroup.net', '024 3974 9999', 'vingroup.net', 'Active', 'VIP', 15200000000, 'https://ui-avatars.com/api/?name=VinGroup&background=fff&color=333&size=150&font-size=0.33&rounded=true&bold=true', 5, 'Thanh toán đúng hạn, yêu cầu kỹ thuật cao.'),
('CUST-002', 'QLDA-DDCN', 'Ban QLDA ĐTXD Các công trình Dân dụng & CN', 'Ban DD&CN', 'Client', 'StateBudget', '315584775', '341 Sư Vạn Hạnh, Phường 10, Quận 10, TP Hồ Chí Minh', 'Ông Huỳnh Minh Hùng', 'Ông Nguyễn Phương Đông', 'banqlda@tphcm.gov.vn', '028 3835 6789', NULL, 'Active', 'Standard', 155000000, 'https://ui-avatars.com/api/?name=Ban+QLDA&background=fff&color=333&size=150&font-size=0.33&rounded=true&bold=true', 4, 'Quy trình thủ tục hành chính phức tạp, nhưng uy tín.'),
('CUST-003', 'COTECCONS', 'Công ty Cổ phần Xây dựng Coteccons', 'Coteccons', 'Client', 'Construction', '0303443233', 'Tòa nhà Coteccons, 236/6 Điện Biên Phủ, Bình Thạnh, TP.HCM', 'Ông Bolat Duisenov', 'Bà Nguyễn Thị B (Phòng Đấu thầu)', 'contact@coteccons.vn', '028 3514 2255', 'coteccons.vn', 'Active', 'Gold', 5400000000, 'https://ui-avatars.com/api/?name=Coteccons&background=fff&color=333&size=150&font-size=0.33&rounded=true&bold=true', 5, 'Đối tác chiến lược, năng lực thi công mạnh.'),
('CUST-004', 'HBC', 'Tập đoàn Xây dựng Hòa Bình', 'Hòa Bình Corp', 'Client', 'Construction', '0302495123', 'Tòa nhà Pax Sky, 123 Nguyễn Đình Chiểu, Quận 3, TP.HCM', 'Ông Lê Viết Hải', 'Ông Trần Văn C (GĐ Kỹ thuật)', 'info@hbcg.vn', '028 3932 5030', 'hbcg.vn', 'Active', 'Gold', 3200000000, 'https://ui-avatars.com/api/?name=Hoa+Binh&background=fff&color=333&size=150&font-size=0.33&rounded=true&bold=true', 4, 'Cần theo dõi sát tiến độ phối hợp.'),
('CUST-005', 'SUN', 'Công ty Cổ phần Tập đoàn Mặt Trời', 'Sun Group', 'Client', 'RealEstate', '0401345678', 'Tầng 9, Tòa nhà Sun City, 13 Hai Bà Trưng, Hoàn Kiếm, Hà Nội', 'Ông Đặng Minh Trường', 'Bà Lê Thị D (Ban Thiết kế)', 'sungroup@sungroup.com.vn', '024 3938 6666', 'sungroup.com.vn', 'Inactive', 'VIP', 8900000000, 'https://ui-avatars.com/api/?name=Sun+Group&background=fff&color=333&size=150&font-size=0.33&rounded=true&bold=true', 5, 'Khách hàng tiềm năng lớn.'),
('CUST-006', 'TV-INDOCHINE', 'Indochine Engineering', 'Indochine', 'Partner', 'Consulting', '0304892111', 'Tầng 15, Tòa nhà CJ, Lê Thánh Tôn, Q1, TP.HCM', 'Ông David', 'Ông Nguyễn Văn E', 'info@indochine.vn', '028 3822 9999', 'indochine-engineering.com', 'Active', 'Gold', 800000000, 'https://ui-avatars.com/api/?name=Indochine&background=fff&color=333&size=150&font-size=0.33&rounded=true&bold=true', 4, 'Đối tác thiết kế MEP uy tín.')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. PROJECTS (Dự án)
-- ============================================
INSERT INTO projects (id, code, name, client, location, manager, "projectGroup", "constructionType", "constructionLevel", scale, "capitalSource", status, progress, budget, spent, deadline, members, thumbnail) VALUES
('p1', '25099', 'TÒA NHÀ VĂN PHÒNG EIE TOWER', 'Công ty Cổ phần Công nghệ EIE', 'Cầu Giấy, Hà Nội', 'Nguyễn Thúy Hằng', 'Nhóm B', 'Công trình dân dụng', 'Cấp II', '25 tầng nổi, 3 tầng hầm', 'NonStateBudget', 'Lập kế hoạch', 5, 450000000000, 1200000000, '2026-12-31', 15, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=60'),
('p2', '25010', '25010-NHIDONG1_4B_BIM', 'Ban QLDA Dân dụng & Công nghiệp TP.HCM', 'TP. Hồ Chí Minh', 'Nguyễn Quốc Anh', 'Nhóm B', 'Công trình dân dụng', 'Cấp I', '35.000 m2 sàn', 'StateBudget', 'Đang thực hiện', 15, 155000000, 0, '2025-04-26', 5, 'https://picsum.photos/id/122/400/300'),
('p3', '23001', '23001-SKYLINE_VIN_INT', 'Tập đoàn Vingroup - CTCP', 'Hà Nội', 'Nguyễn Hoàng Hà', 'Nhóm A', 'Công trình dân dụng', 'Cấp đặc biệt', '5 tháp 40 tầng', 'NonStateBudget', 'Đang thực hiện', 65, 4200000000, 2100000000, '2024-12-20', 12, 'https://picsum.photos/id/48/200/200'),
('p4', '24005', 'GLORY-HEIGHTS-VINHOME', 'Tập đoàn Vingroup - CTCP', 'TP. Thủ Đức, TP.HCM', 'Nguyễn Bá Nhiệm', 'Nhóm A', 'Công trình dân dụng', 'Cấp I', '5 tòa tháp 39 tầng', 'NonStateBudget', 'Hoàn thành', 100, 3500000000, 3100000000, '2024-10-15', 20, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&auto=format&fit=crop&q=60'),
('p5', '22099', 'METRO-LINE-2-BEN-THANH', 'Ban QL Đường sắt Đô thị (MAUR)', 'Các quận 1, 3, 10, 12, Tân Bình, Tân Phú', 'Trần Hữu Hải', 'Quan trọng quốc gia', 'Công trình giao thông', 'Cấp đặc biệt', '11km ngầm & trên cao', 'StateBudget', 'Lập kế hoạch', 5, 47000000000, 500000000, '2030-12-31', 8, 'https://images.unsplash.com/photo-1510252833074-ce467a807d9d?w=500&auto=format&fit=crop&q=60'),
('p6', '24012', 'LEGO-FACTORY-VSIP', 'LEGO Group', 'VSIP III, Bình Dương', 'Lương Thành Hưng', 'Nhóm A', 'Công trình công nghiệp', 'Cấp I', '44 ha', 'NonStateBudget', 'Tạm hoãn', 35, 25000000000, 8000000000, '2025-08-01', 15, 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=60')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 4. CONTRACTS (Hợp đồng) - Sample
-- ============================================
INSERT INTO contracts (id, "projectId", code, "signedDate", "packageName", "projectName", location, "contractType", "lawApplied", "sideAName", "sideARep", "sideAPosition", "sideAMst", "sideBName", "sideBRep", "sideBPosition", "sideBMst", "sideBBank", "totalValue", "vatIncluded", "advancePayment", duration, "startDate", "endDate", "warrantyPeriod", "mainTasks", "fileFormats", "deliveryMethod", "acceptanceStandard", personnel, "penaltyRate", "maxPenalty", "disputeResolution", "paidValue", "remainingValue", "wipValue", status) VALUES
('c1', 'p2', '30/2025/HĐ-DDCN', '2025-03-20', 'Tư vấn lập mô hình thông tin công trình (BIM)', 'Xây dựng mới Trung tâm chuyên sâu bệnh nhiệt đới (Khối 4B) Bệnh viện Nhi đồng 1', '341 Sư Vạn Hạnh, Phường 10, Quận 10, TP Hồ Chí Minh', 'Trọn gói', 'Luật Việt Nam', 'Ban Quản lý dự án đầu tư xây dựng các công trình dân dụng và công nghiệp', 'Ông Huỳnh Minh Hùng', 'Phó Giám đốc', '315584775', 'Công ty Cổ phần Công nghệ và Tư vấn CIC', 'Ông Nguyễn Hoàng Hà', 'Tổng giám đốc', '0100775353', '1200014777 tại BIDV', 155000000, true, 0, '45 ngày', '2025-03-13', '2025-04-26', '365 ngày', ARRAY['Lập mô hình BIM', 'Xử lý va chạm', 'Xuất khối lượng'], 'IFC 4.0', 'USB', 'Theo CĐT', '[{"role": "Quản lý BIM", "name": "Ông Lương Thành Hưng"}, {"role": "Điều phối BIM", "name": "Ông Trần Hữu Hải"}]'::jsonb, '0.1%', '12%', 'Tòa án', 0, 155000000, 45000000, 'Hiệu lực'),
('c2', 'p3', '01/2024/VIG-CIC', '2024-01-15', 'Tư vấn BIM cấp độ 2 dự án Skyline', 'Skyline Residential - VinGroup', 'Hà Nội', 'Theo đơn giá cố định', 'Luật Việt Nam', 'Tập đoàn Vingroup - CTCP', 'Bà Phạm Thị Lan', 'Giám đốc Ban QLDA', '0101234567', 'Công ty Cổ phần Công nghệ và Tư vấn CIC', 'Ông Nguyễn Hoàng Hà', 'Tổng giám đốc', '0100775353', '1200014777 tại BIDV', 4200000000, true, 840000000, '12 tháng', '2024-01-15', '2025-01-15', '12 tháng', ARRAY['Lập BEP', 'Dựng mô hình', 'Phối hợp 3D'], 'RVT, PDF', 'CDE', 'Theo BEP', '[]'::jsonb, '0.05%', '8%', 'VIAC', 2100000000, 2100000000, 1680000000, 'Hiệu lực'),
('c3', 'p4', 'GH-2023/BIM', '2023-05-10', 'Tư vấn BIM Full Scope', 'GLORY-HEIGHTS-VINHOME', 'TP.Thủ Đức', 'Trọn gói', 'Luật Việt Nam', 'Tập đoàn Vingroup', 'Phạm Thị Lan', 'GĐ', '0101', 'CIC', 'Nguyễn Hoàng Hà', 'GĐ', '0100', 'BIDV', 3500000000, true, 1000000000, '18 tháng', '2023-06-01', '2024-12-01', '24 tháng', ARRAY['LOD 400', 'Coordination'], 'RVT', 'CDE', 'ISO 19650', '[{"role": "BIM Manager", "name": "Lương Thành Hưng"}]'::jsonb, '0.1%', '8%', 'VIAC', 3500000000, 0, 0, 'Hoàn thành')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. CRM CONTACTS (Liên hệ)
-- ============================================
INSERT INTO crm_contacts (id, "customerId", name, position, email, phone, "isPrimary") VALUES
('ct1', 'CUST-001', 'Ông Lê Văn A', 'Giám đốc Ban QLDA', 'a.le@vingroup.net', '0909111222', true),
('ct2', 'CUST-001', 'Bà Trần Thị B', 'Kế toán trưởng', 'b.tran@vingroup.net', '0909333444', false),
('ct3', 'CUST-002', 'Ông Nguyễn Phương Đông', 'Chuyên viên', 'dong.np@tphcm.gov.vn', '0912345678', true),
('ct4', 'CUST-003', 'Bà Nguyễn Thị B', 'Phòng Đấu thầu', 'b.nguyen@coteccons.vn', '0909555666', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. CRM ACTIVITIES (Hoạt động)
-- ============================================
INSERT INTO crm_activities (id, "customerId", type, date, title, description, "createdBy") VALUES
('act1', 'CUST-001', 'Meeting', '2025-03-20', 'Họp giao ban tuần', 'Thống nhất phương án thiết kế Concept tòa A.', 'Nguyễn Bá Nhiệm'),
('act2', 'CUST-001', 'Email', '2025-03-18', 'Gửi hồ sơ năng lực', 'Đã gửi profile cập nhật mới nhất cho chị Lan.', 'Nguyễn Quốc Anh'),
('act3', 'CUST-001', 'Call', '2025-03-15', 'Trao đổi về Hợp đồng', 'Khách hàng yêu cầu giảm 2% giá trị gói thầu.', 'Nguyễn Hoàng Hà'),
('act4', 'CUST-003', 'Meal', '2025-03-10', 'Ăn trưa thân mật', 'Gặp gỡ anh Hùng bên Coteccons bàn về dự án mới.', 'Nguyễn Hoàng Hà')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. CRM OPPORTUNITIES (Cơ hội kinh doanh)
-- ============================================
INSERT INTO crm_opportunities (id, "customerId", name, value, stage, probability, "expectedCloseDate") VALUES
('opp1', 'CUST-001', 'BIM cho Vinhomes Cổ Loa', 5500000000, 'Negotiation', 80, '2025-05-30'),
('opp2', 'CUST-003', 'Phối hợp MEP dự án Lego', 1200000000, 'Proposal', 40, '2025-06-15'),
('opp3', 'CUST-005', 'Digital Twin Sun World', 3000000000, 'New', 20, '2025-09-30')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. TASKS (Công việc mẫu)
-- ============================================
INSERT INTO tasks (id, code, name, "projectId", assignee, reviewer, status, priority, "startDate", "dueDate", progress, tags) VALUES
('t1', '40.10.15.01', 'Dựng mô hình Kiến trúc Tầng 1', 'p2', '{"name": "Vũ Ngọc Thủy", "avatar": "https://ui-avatars.com/api/?name=Vũ+Ngọc+Thủy&background=random", "role": "Modeler"}'::jsonb, 'Trần Hữu Hải', 'S4 Lãnh đạo duyệt', 'Cao', '2025-03-15', '2025-03-20', 100, ARRAY['ARC', 'LOD300']),
('t2', '40.10.15.02', 'Dựng mô hình Kiến trúc Tầng 2', 'p2', '{"name": "Vũ Ngọc Thủy", "avatar": "https://ui-avatars.com/api/?name=Vũ+Ngọc+Thủy&background=random", "role": "Modeler"}'::jsonb, 'Trần Hữu Hải', 'S0 Đang thực hiện', 'Trung bình', '2025-03-21', '2025-03-25', 45, ARRAY['ARC', 'LOD300']),
('t3', '40.10.10.01', 'Dựng mô hình Kết cấu Móng', 'p2', '{"name": "Nguyễn Đức Thành", "avatar": "https://ui-avatars.com/api/?name=Nguyễn+Đức+Thành&background=random", "role": "Modeler"}'::jsonb, 'Trần Hữu Hải', 'S6 Trình khách hàng', 'Cao', '2025-03-13', '2025-03-18', 100, ARRAY['STR', 'LOD350']),
('t4', '40.20.20.01', 'Thiết lập CDE Project', 'p3', '{"name": "Lương Thành Hưng", "avatar": "https://ui-avatars.com/api/?name=Lương+Thành+Hưng&background=random", "role": "BIM Manager"}'::jsonb, NULL, 'Hoàn thành', 'Cao', '2024-01-20', '2024-01-25', 100, ARRAY['Setup', 'CDE'])
ON CONFLICT (id) DO NOTHING;

-- Done! Sample data inserted.
SELECT 'Seed data inserted successfully!' as message;
