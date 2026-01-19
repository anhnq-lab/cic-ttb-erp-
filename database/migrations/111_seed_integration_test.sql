-- Migration 111: Final Seed for Employee Integration Testing
-- This migration ensures we have at least one project with real members and RACI

-- 1. Create a stable test project if not exists
INSERT INTO public.projects (id, code, name, client, location, status, capital_source, progress, budget, spent)
VALUES (
    'test-project-001', 
    'TEST-2025-001', 
    'Dự án Thử nghiệm Tích hợp Personnel', 
    'CIC Test Client', 
    'Hà Nội', 
    'Đang thực hiện', 
    'StateBudget', 
    45, 
    1000000000, 
    400000000
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, capital_source = EXCLUDED.capital_source;

-- 2. Ensure we have some tasks with assignee_id for this project
-- We need to find some real employee IDs first. Let's use a subquery.

-- 3. Add members to this project
INSERT INTO public.project_members (project_id, employee_id, role, raci)
SELECT 'test-project-001', id, 'QL BIM', 'A' FROM public.employees WHERE name LIKE '%Phan Anh' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.project_members (project_id, employee_id, role, raci)
SELECT 'test-project-001', id, 'ĐPBM', 'R' FROM public.employees WHERE name LIKE '%Minh Quang' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.project_members (project_id, employee_id, role, raci)
SELECT 'test-project-001', id, 'TNDH', 'C' FROM public.employees WHERE name LIKE '%Hoàng Hà' LIMIT 1
ON CONFLICT DO NOTHING;

-- 4. Create tasks for this project that use these employees
INSERT INTO public.tasks (id, project_id, code, name, assignee_id, assignee_name, assignee_role, status, priority, start_date, due_date, progress, phase)
SELECT 
    'task-test-001', 
    'test-project-001', 
    '1.1', 
    'Thiết lập môi trường BIM dự án', 
    id, 
    name, 
    role, 
    'Hoàn thành', 
    'Cao', 
    CURRENT_DATE - INTERVAL '10 days', 
    CURRENT_DATE - INTERVAL '8 days', 
    100, 
    '1. Xúc tiến Dự án'
FROM public.employees WHERE name LIKE '%Phan Anh' LIMIT 1
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.tasks (id, project_id, code, name, assignee_id, assignee_name, assignee_role, status, priority, start_date, due_date, progress, phase)
SELECT 
    'task-test-002', 
    'test-project-001', 
    '2.1', 
    'Dựng mô hình kiến trúc sơ bộ', 
    id, 
    name, 
    role, 
    'Đang thực hiện', 
    'Trung bình', 
    CURRENT_DATE - INTERVAL '2 days', 
    CURRENT_DATE + INTERVAL '5 days', 
    30, 
    '2. Báo giá'
FROM public.employees WHERE name LIKE '%Minh Quang' LIMIT 1
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
    RAISE NOTICE '✅ Test integration project and members created successfully!';
END $$;
