-- Dữ liệu mẫu chi tiết cho dự án Trung tâm Pháp y Hà Nội
-- 1. Cập nhật thông tin chi tiết dự án
UPDATE public.projects 
SET 
    location = 'Số 35 Trần Bình, Mai Dịch, Cầu Giấy, Hà Nội',
    construction_type = 'Công trình dân dụng (Y tế)',
    construction_level = 'Cấp I',
    scale = 'Diện tích sàn 15.600m2, 10 tầng nổi, 2 tầng hầm',
    project_group = 'Nhóm A',
    progress = 35,
    budget = 45000000000,
    spent = 12500000000,
    thumbnail = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000',
    scope = 'Cung cấp dịch vụ tư vấn BIM (BIM Consultant) giai đoạn Thiết kế bản vẽ thi công và hỗ trợ quản lý thi công. Xây dựng mô hình 3D kiến trúc, kết cấu, MEP. Thực hiện kiểm tra xung đột và xuất bản vẽ phối hợp.'
WHERE name LIKE '%Pháp y Hà Nội%';

-- 2. Thêm hợp đồng mẫu
INSERT INTO public.contracts (
    id, project_id, code, signed_date, package_name, project_name, 
    side_a_name, total_value, paid_value, status, contract_type
) 
SELECT 
    gen_random_uuid(), id, 'HĐ-BIM-2024-011', '2024-01-15', 
    'Tư vấn triển khai BIM', name, 
    'Ban Quản lý dự án Đầu tư xây dựng công trình Dân dụng Hà Nội', 
    1200000000, 300000000, 'Hiệu lực', 'Tư vấn'
FROM public.projects 
WHERE name LIKE '%Pháp y Hà Nội%'
ON CONFLICT DO NOTHING;

-- 3. Thêm chi phí mẫu
INSERT INTO public.project_costs (
    project_id, category, description, amount, date, status, spender
)
SELECT 
    id, 'Travel', 'Công tác phí khảo sát hiện trạng và đo đạc laser scan', 15000000, CURRENT_DATE - INTERVAL '5 days', 'Approved', 'Nguyễn Phan Anh'
FROM public.projects 
WHERE name LIKE '%Pháp y Hà Nội%';

INSERT INTO public.project_costs (
    project_id, category, description, amount, date, status, spender
)
SELECT 
    id, 'Salary', 'Chi phí lương chuyên gia BIM tháng 12/2023', 85000000, CURRENT_DATE - INTERVAL '15 days', 'Approved', 'Hệ thống'
FROM public.projects 
WHERE name LIKE '%Pháp y Hà Nội%';

-- 4. Thêm log chấm công mẫu
INSERT INTO public.timesheet_logs (
    project_id, employee_id, date, hours, work_type, description
)
SELECT 
    p.id, e.id, CURRENT_DATE - INTERVAL '1 day', 8, 'Modeling', 'Dựng mô hình kiến trúc tầng hầm B1, B2 hệ thống MEP'
FROM public.projects p, public.employees e
WHERE p.name LIKE '%Pháp y Hà Nội%' AND e.name LIKE '%Phan Anh'
LIMIT 1;

INSERT INTO public.timesheet_logs (
    project_id, employee_id, date, hours, work_type, description
)
SELECT 
    p.id, e.id, CURRENT_DATE - INTERVAL '2 days', 4, 'Meeting', 'Hợp đồng kỹ thuật tại BQLDA về quy trình phối hợp BIM'
FROM public.projects p, public.employees e
WHERE p.name LIKE '%Pháp y Hà Nội%' AND e.name LIKE '%Minh Quang'
LIMIT 1;
