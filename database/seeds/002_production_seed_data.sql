-- ============================================
-- PRODUCTION SEED DATA
-- Khớp chính xác với schema Supabase hiện tại
-- ============================================

-- ========== EMPLOYEES ==========
-- Status values: 'Chính thức', 'Thử việc', 'Nghỉ phép', etc.

-- Admin user
INSERT INTO public.employees (
    code,
    name,
    email,
    phone,
    role,
    department,
    status,
    avatar
) VALUES (
    'NV-ADMIN',
    'Quản Trị Viên',
    'admin@cic.vn',
    '0901234567',
    'Admin',
    'Ban Giám Đốc',
    'Chính thức',
    'https://ui-avatars.com/api/?name=Admin&background=f97316&color=fff'
)
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name, role = EXCLUDED.role, status = EXCLUDED.status;

-- Demo employees
INSERT INTO public.employees (code, name, email, phone, role, department, status, avatar) VALUES
('NV-001', 'Nguyễn Văn A', 'nguyenvana@cic.vn', '0912345678', 'Trưởng phòng', 'Phòng BIM', 'Chính thức', 'https://ui-avatars.com/api/?name=NVA&background=3b82f6&color=fff'),
('NV-002', 'Trần Thị B', 'tranthib@cic.vn', '0923456789', 'Nhân viên', 'Phòng BIM', 'Chính thức', 'https://ui-avatars.com/api/?name=TTB&background=8b5cf6&color=fff'),
('NV-003', 'Lê Văn C', 'levanc@cic.vn', '0934567890', 'Nhân viên', 'Phòng BIM', 'Chính thức', 'https://ui-avatars.com/api/?name=LVC&background=ec4899&color=fff'),
('NV-004', 'Phạm Thị D', 'phamthid@cic.vn', '0945678901', 'Nhân viên', 'Phòng BIM', 'Thử việc', 'https://ui-avatars.com/api/?name=PTD&background=10b981&color=fff')
ON CONFLICT (email) DO NOTHING;

-- ========== PROJECTS ==========
-- Status values: 'Lập kế hoạch', 'Đang thực hiện', 'Hoàn thành', etc.

INSERT INTO public.projects (
    code,
    name,
    type,
    status,
    manager_id,
    client,
    location,
    construction_type,
    scale,
    capital_source,
    budget,
    spent,
    progress,
    start_date,
    end_date,
    thumbnail,
    phase
) VALUES
(
    'PRJ-001',
    'Khu Công nghiệp Trấn Yên',
    'BIM',
    'Đang thực hiện',
    (SELECT id FROM public.employees WHERE email = 'nguyenvana@cic.vn'),
    'Khu Công nghiệp Trấn Yên',
    'Yên Bái',
    'Công nghiệp',
    'Lớn',
    'NonStateBudget',
    500000000,
    150000000,
    30,
    '2024-01-15',
    '2024-12-31',
    'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
    'Xúc tiến Dự án'
),
(
    'PRJ-002',
    'Nhà máy Sản xuất ABC',
    'BIM',
    'Đang thực hiện',
    (SELECT id FROM public.employees WHERE email = 'nguyenvana@cic.vn'),
    'Công ty ABC',
    'Hà Nội',
    'Nhà máy',
    'Trung bình',
    'NonStateBudget',
    300000000,
    80000000,
    25,
    '2024-02-01',
    '2024-11-30',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400',
    'Báo giá'
),
(
    'PRJ-003',
    'Trung tâm Thương mại XYZ',
    'BIM',
    'Hoàn thành',
    (SELECT id FROM public.employees WHERE email = 'levanc@cic.vn'),
    'Công ty XYZ',
    'TP. HCM',
    'Thương mại',
    'Trung bình',
    'StateBudget',
    250000000,
    250000000,
    100,
    '2023-06-01',
    '2024-01-31',
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400',
    'Hoàn thành'
)
ON CONFLICT (code) DO NOTHING;

-- ========== PROJECT MEMBERS ==========

INSERT INTO public.project_members (project_id, employee_id, role, raci, is_active) VALUES
-- PRJ-001 team
(
    (SELECT id FROM public.projects WHERE code = 'PRJ-001'),
    (SELECT id FROM public.employees WHERE email = 'nguyenvana@cic.vn'),
    'Leader',
    'A',
    TRUE
),
(
    (SELECT id FROM public.projects WHERE code = 'PRJ-001'),
    (SELECT id FROM public.employees WHERE email = 'tranthib@cic.vn'),
    'Modeler',
    'R',
    TRUE
),
(
    (SELECT id FROM public.projects WHERE code = 'PRJ-001'),
    (SELECT id FROM public.employees WHERE email = 'levanc@cic.vn'),
    'Coordinator',
    'R',
    TRUE
),
-- PRJ-002 team
(
    (SELECT id FROM public.projects WHERE code = 'PRJ-002'),
    (SELECT id FROM public.employees WHERE email = 'nguyenvana@cic.vn'),
    'Leader',
    'A',
    TRUE
),
(
    (SELECT id FROM public.projects WHERE code = 'PRJ-002'),
    (SELECT id FROM public.employees WHERE email = 'phamthid@cic.vn'),
    'Modeler',
    'R',
    TRUE
)
ON CONFLICT (project_id, employee_id) DO NOTHING;

-- ========== TASKS ==========

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
(
    (SELECT id FROM public.projects WHERE code = 'PRJ-001'),
    'TASK-001',
    'Dựng model MEP - Tầng 1',
    (SELECT id FROM public.employees WHERE email = 'tranthib@cic.vn'),
    'Trần Thị B',
    'https://ui-avatars.com/api/?name=TTB&background=8b5cf6&color=fff',
    'Modeler',
    'Mở',
    'Cao',
    '2024-01-15',
    '2024-01-30',
    0,
    'Xúc tiến Dự án',
    40,
    'Dựng hình hệ thống MEP tầng 1 theo bản vẽ thiết kế',
    ARRAY['MEP', 'Tầng 1', 'Dựng hình']
),
(
    (SELECT id FROM public.projects WHERE code = 'PRJ-001'),
    'TASK-002',
    'Kiểm tra clash detection - MEP vs KT',
    (SELECT id FROM public.employees WHERE email = 'levanc@cic.vn'),
    'Lê Văn C',
    'https://ui-avatars.com/api/?name=LVC&background=ec4899&color=fff',
    'Coordinator',
    'S0',
    'Trung bình',
    '2024-01-20',
    '2024-02-05',
    30,
    'Báo giá',
    20,
    'Kiểm tra xung đột giữa MEP và Kết cấu',
    ARRAY['Clash Detection', 'QA']
),
-- PRJ-002 tasks
(
    (SELECT id FROM public.projects WHERE code = 'PRJ-002'),
    'TASK-003',
    'Lập schedule BOQ',
    (SELECT id FROM public.employees WHERE email = 'phamthid@cic.vn'),
    'Phạm Thị D',
    'https://ui-avatars.com/api/?name=PTD&background=10b981&color=fff',
    'Modeler',
    'Hoàn thành',
    'Thấp',
    '2024-02-01',
    '2024-02-10',
    100,
    'Chuẩn bị Triển khai',
    16,
    'Lập bảng khối lượng công việc từ model',
    ARRAY['BOQ', 'Planning']
)
ON CONFLICT (code) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Seed data completed successfully!';
    RAISE NOTICE '   - 5 employees (1 Admin + 4 staff)';
    RAISE NOTICE '   - 3 projects';
    RAISE NOTICE '   - 5 project member assignments';
    RAISE NOTICE '   - 3 tasks';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Next steps:';
    RAISE NOTICE '   1. Create Supabase Auth user: admin@cic.vn';
    RAISE NOTICE '   2. Login to app';
    RAISE NOTICE '   3. Test functionality';
    RAISE NOTICE '========================================';
END $$;
