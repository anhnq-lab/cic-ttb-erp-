-- ============================================
-- Seed Script: Master Data + Sample Demo Data
-- Dữ liệu mẫu để test hệ thống
-- ============================================

-- ====== MASTER DATA: Admin User ======
-- Note: Supabase Auth user phải được tạo thủ công qua Dashboard
-- Email: admin@cic.vn | Password: Admin123!

INSERT INTO public.employees (
    id,
    code,
    full_name,
    email,
    phone,
    position,
    role,
    department,
    salary_level,
    hourly_rate,
    status,
    avatar
) VALUES (
    gen_random_uuid()::text,
    'NV-ADMIN',
    'Quản Trị Viên',
    'admin@cic.vn',
    '0901234567',
    'Giám đốc',
    'Admin',
    'Ban Giám Đốc',
    'Senior',
    500000,
    'active',
    'https://ui-avatars.com/api/?name=Admin&background=f97316&color=fff'
)
ON CONFLICT (email) DO UPDATE
SET full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

-- ====== DEMO DATA: Sample Employees ======
INSERT INTO public.employees (code, full_name, email, phone, position, role, department, salary_level, hourly_rate, status, avatar) VALUES
('NV-001', 'Nguyễn Văn A', 'nguyenvana@cic.vn', '0912345678', 'Trưởng phòng BIM', 'Trưởng phòng', 'Phòng BIM', 'Senior', 450000, 'active', 'https://ui-avatars.com/api/?name=NVA&background=3b82f6&color=fff'),
('NV-002', 'Trần Thị B', 'tranthib@cic.vn', '0923456789', 'BIM Modeler', 'Modeler', 'Phòng BIM', 'Mid', 300000, 'active', 'https://ui-avatars.com/api/?name=TTB&background=8b5cf6&color=fff'),
('NV-003', 'Lê Văn C', 'levanc@cic.vn', '0934567890', 'BIM Coordinator', 'Coordinator', 'Phòng BIM', 'Senior', 400000, 'active', 'https://ui-avatars.com/api/?name=LVC&background=ec4899&color=fff'),
('NV-004', 'Phạm Thị D', 'phamthid@cic.vn', '0945678901', 'BIM Modeler', 'Modeler', 'Phòng BIM', 'Junior', 250000, 'active', 'https://ui-avatars.com/api/?name=PTD&background=10b981&color=fff')
ON CONFLICT (email) DO NOTHING;

-- ====== DEMO DATA: Sample Projects ======
INSERT INTO public.projects (code, name, type, status, manager_id, description, start_date, end_date, thumbnail) VALUES
('PRJ-001', 'Khu Công nghiệp Trấn Yên', 'Công nghiệp', 'Đang thực hiện', (SELECT id FROM public.employees WHERE email = 'nguyenvana@cic.vn'), 'Dự án khu công nghiệp quy mô lớn tại Yên Bái', '2024-01-15', '2024-12-31', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400'),
('PRJ-002', 'Nhà máy Sản xuất ABC', 'Nhà máy', 'Đang thực hiện', (SELECT id FROM public.employees WHERE email = 'nguyenvana@cic.vn'), 'Nhà máy sản xuất linh kiện điện tử', '2024-02-01', '2024-11-30', 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'),
('PRJ-003', 'Trung tâm Thương mại XYZ', 'Thương mại', 'Hoàn thành', (SELECT id FROM public.employees WHERE email = 'levanc@cic.vn'), 'Trung tâm thương mại 5 tầng', '2023-06-01', '2024-01-31', 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400')
ON CONFLICT (code) DO NOTHING;

-- ====== DEMO DATA: Project Members ======
INSERT INTO public.project_members (project_id, employee_id, role, raci, is_active) VALUES
-- PRJ-001 team
((SELECT id FROM public.projects WHERE code = 'PRJ-001'), (SELECT id FROM public.employees WHERE email = 'nguyenvana@cic.vn'), 'Leader', 'A', TRUE),
((SELECT id FROM public.projects WHERE code = 'PRJ-001'), (SELECT id FROM public.employees WHERE email = 'tranthib@cic.vn'), 'Modeler', 'R', TRUE),
((SELECT id FROM public.projects WHERE code = 'PRJ-001'), (SELECT id FROM public.employees WHERE email = 'levanc@cic.vn'), 'Coordinator', 'R', TRUE),

-- PRJ-002 team
((SELECT id FROM public.projects WHERE code = 'PRJ-002'), (SELECT id FROM public.employees WHERE email = 'nguyenvana@cic.vn'), 'Leader', 'A', TRUE),
((SELECT id FROM public.projects WHERE code = 'PRJ-002'), (SELECT id FROM public.employees WHERE email = 'phamthid@cic.vn'), 'Modeler', 'R', TRUE)
ON CONFLICT (project_id, employee_id) DO NOTHING;

-- ====== DEMO DATA: Sample Tasks ======
INSERT INTO public.tasks (
    project_id,
    code,
    name,
    assignee_id,
    assignee_name,
    assignee_avatar,
    assignee_role,
    status,
    priority,
    start_date,
    due_date,
    progress,
    phase,
    estimated_hours,
    description,
    tags
) VALUES
-- PRJ-001 tasks
((SELECT id FROM public.projects WHERE code = 'PRJ-001'), 'TASK-001', 'Dựng model MEP - Tầng 1', (SELECT id FROM public.employees WHERE email = 'tranthib@cic.vn'), 'Trần Thị B', 'https://ui-avatars.com/api/?name=TTB&background=8b5cf6&color=fff', 'Modeler', 'Mở', 'Cao', '2024-01-15', '2024-01-30', 0, 'Xúc tiến Dự án', 40, 'Dựng hình hệ thống MEP tầng 1', ARRAY['MEP', 'Tầng 1']),

((SELECT id FROM public.projects WHERE code = 'PRJ-001'), 'TASK-002', 'Kiểm tra clash detection', (SELECT id FROM public.employees WHERE email = 'levanc@cic.vn'), 'Lê Văn C', 'https://ui-avatars.com/api/?name=LVC&background=ec4899&color=fff', 'Coordinator', 'S0', 'Trung bình', '2024-01-20', '2024-02-05', 30, 'Báo giá', 20, 'Kiểm tra xung đột giữa các chuyên ngành', ARRAY['Clash', 'QA']),

-- PRJ-002 tasks
((SELECT id FROM public.projects WHERE code = 'PRJ-002'), 'TASK-003', 'Lập schedule BOQ', (SELECT id FROM public.employees WHERE email = 'phamthid@cic.vn'), 'Phạm Thị D', 'https://ui-avatars.com/api/?name=PTD&background=10b981&color=fff', 'Modeler', 'Hoàn thành', 'Thấp', '2024-02-01', '2024-02-10', 100, 'Chuẩn bị Triển khai', 16, 'Lập bảng khối lượng công việc', ARRAY['BOQ', 'Planning'])
ON CONFLICT (code) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Master data và demo data đã được seed thành công!';
    RAISE NOTICE 'Admin user: admin@cic.vn (cần tạo trong Supabase Auth)';
    RAISE NOTICE 'Demo employees: 4 users';
    RAISE NOTICE 'Demo projects: 3 projects';
    RAISE NOTICE 'Demo tasks: 3 tasks';
END $$;
