-- ============================================
-- Task Management SEED DATA (SIMPLIFIED)
-- Works without FK dependencies
-- ============================================

-- Note: This version sets assignee_id and assignee_name to NULL
-- You can update them later via UI to assign real employees

-- Create projects if they don't exist
INSERT INTO public.projects (id, code, name, client, location, manager, capital_source, status, progress, budget, spent, deadline, members_count, thumbnail)
VALUES 
    ('proj-demo-001', 'DEMO-001', 'BIM LOD400 - Vincom Metropolis Demo', 'Vingroup', 'Hà Nội', 'PM Demo', 'NonStateBudget', 'Đang thực hiện', 75, 2500000000, 1800000000, '2025-06-30', 8, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'),
    ('proj-demo-002', 'DEMO-002', 'Digital Twin - Ecopark Demo', 'Ecopark', 'Hưng Yên', 'PM Demo', 'NonStateBudget', 'Đang thực hiện', 45, 3800000000, 1600000000, '2025-12-31', 12, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SAMPLE TASKS - No FK dependencies
-- ============================================

INSERT INTO public.tasks (id, project_id, code, name, assignee_name, status, priority, start_date, due_date, progress, estimated_hours, description) VALUES
-- PROJECT 1: BIM LOD400
('task-demo-001', 'proj-demo-001', '1.1', 'Kick-off meeting và phân công', 'Trần Thị Bình', 'Hoàn thành', 'Cao', '2025-01-02', '2025-01-02', 100, 4.0, 'Họp kick-off, phân công role, setup môi trường'),
('task-demo-002', 'proj-demo-001', '1.2', 'Thu thập bản vẽ thiết kế', 'Lê Minh Châu', 'Hoàn thành', 'Cao', '2025-01-03', '2025-01-05', 100, 16.0, 'Nhận bản vẽ kiến trúc, kết cấu, MEP'),
('task-demo-003', 'proj-demo-001', '1.3', 'Setup BIM Execution Plan', 'Trần Thị Bình', 'S5 Đã duyệt', 'Cao', '2025-01-06', '2025-01-08', 95, 12.0, 'Lập BEP, LOD requirements'),
('task-demo-004', 'proj-demo-001', '2.1', 'Dựng model KT LOD 300 - Tầng hầm', 'Phạm Văn Dũng', 'S2 Kiểm tra chéo', 'Cao', '2025-01-09', '2025-01-15', 75, 40.0, 'Model 2 tầng hầm: cột, dầm, sàn, tường'),
('task-demo-005', 'proj-demo-001', '2.2', 'Dựng model KT LOD 300 - Tầng 1-5', 'Hoàng Thị Em', 'S1 Phối hợp', 'Cao', '2025-01-10', '2025-01-20', 45, 80.0, 'Model tầng 1-5: layout, tường, cửa'),
('task-demo-006', 'proj-demo-001', '2.3', 'Dựng model kết cấu - Móng', 'Phạm Văn Dũng', 'S0 Đang thực hiện', 'Trung bình', '2025-01-16', '2025-01-25', 30, 60.0, 'Model móng, cọc, dầm móng'),
('task-demo-007', 'proj-demo-001', '2.4', 'Dựng model MEP - Điện', 'Hoàng Thị Em', 'Mở', 'Trung bình', '2025-01-20', '2025-02-05', 0, 100.0, 'Hệ thống điện, tủ, cáp'),
('task-demo-008', 'proj-demo-001', '3.1', 'Clash Detection tầng hầm', 'Lê Minh Châu', 'S1 Phối hợp', 'Cao', '2025-01-16', '2025-01-18', 60, 16.0, 'Chạy clash detection'),
('task-demo-009', 'proj-demo-001', '3.2', 'Họp phối hợp clash', 'Trần Thị Bình', 'Đang chờ', 'Cao', '2025-01-19', '2025-01-19', 0, 4.0, 'Họp giải quyết clash'),
('task-demo-010', 'proj-demo-001', '3.3', 'Cập nhật model sau phối hợp', 'Phạm Văn Dũng', 'Mở', 'Trung bình', '2025-01-20', '2025-01-22', 0, 20.0, 'Sửa các vị trí clash'),
('task-demo-011', 'proj-demo-001', '4.1', 'Xuất bản vẽ 2D', 'Hoàng Thị Em', 'Mở', 'Thấp', '2025-01-23', '2025-01-25', 0, 16.0, 'Xuất mặt bằng, mặt đứng'),
('task-demo-012', 'proj-demo-001', '4.2', 'Lập Schedule BOQ', 'Lê Minh Châu', 'Mở', 'Trung bình', '2025-01-26', '2025-01-28', 0, 20.0, 'Schedule vật liệu, BOQ'),

-- PROJECT 2: Digital Twin
('task-demo-013', 'proj-demo-002', '1.1', '3D Laser Scanning', 'Lê Minh Châu', 'S4 Lãnh đạo duyệt', 'Cao', '2024-12-15', '2024-12-20', 100, 60.0, 'Quét 3D laser khu đô thị'),
('task-demo-014', 'proj-demo-002', '1.2', 'Xử lý point cloud', 'Phạm Văn Dũng', 'S3 Duyệt nội bộ', 'Cao', '2024-12-21', '2025-01-05', 90, 80.0, 'Import ReCap, làm sạch, mesh'),
('task-demo-015', 'proj-demo-002', '2.1', 'Scan to BIM - Tòa A1', 'Hoàng Thị Em', 'S1 Phối hợp', 'Cao', '2025-01-06', '2025-01-20', 50, 100.0, 'Model Revit LOD 350 từ point cloud'),
('task-demo-016', 'proj-demo-002', '2.2', 'Scan to BIM - Tòa A2', 'Phạm Văn Dũng', 'Mở', 'Trung bình', '2025-01-21', '2025-02-10', 0, 100.0, 'Model Tòa A2'),
('task-demo-017', 'proj-demo-002', '3.1', 'Setup Unity Digital Twin', 'Lê Minh Châu', 'S0 Đang thực hiện', 'Cao', '2025-01-10', '2025-01-25', 35, 60.0, 'Setup Unity project'),
('task-demo-018', 'proj-demo-002', '3.2', 'Tích hợp IoT sensors', 'Lê Minh Châu', 'Mở', 'Trung bình', '2025-01-26', '2025-02-15', 0, 80.0, 'Connect IoT sensors')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TASK HISTORY (Không cần employee FK)
-- ============================================

INSERT INTO public.task_history (id, task_id, field_name, old_value, new_value, changed_at, notes) VALUES
('hist-demo-001', 'task-demo-004', 'status', 'Mở', 'S0 Đang thực hiện', '2025-01-09 08:30:00+07', 'Bắt đầu'),
('hist-demo-002', 'task-demo-004', 'progress', '0', '25', '2025-01-10 17:00:00+07', 'Hoàn thành B2'),
('hist-demo-003', 'task-demo-004', 'status', 'S0 Đang thực hiện', 'S1 Phối hợp', '2025-01-11 16:00:00+07', 'Gửi review'),
('hist-demo-004', 'task-demo-004', 'progress', '25', '50', '2025-01-12 17:00:00+07', 'Hoàn thành B1'),
('hist-demo-005', 'task-demo-004', 'status', 'S1 Phối hợp', 'S2 Kiểm tra chéo', '2025-01-13 10:00:00+07', 'QA/QC'),
('hist-demo-006', 'task-demo-004', 'progress', '50', '75', '2025-01-14 17:00:00+07', 'Fix QA'),
('hist-demo-007', 'task-demo-005', 'status', 'Mở', 'S0 Đang thực hiện', '2025-01-10 08:30:00+07', 'Bắt đầu'),
('hist-demo-008', 'task-demo-005', 'progress', '0', '15', '2025-01-11 17:00:00+07', 'Layout T1'),
('hist-demo-009', 'task-demo-005', 'progress', '15', '30', '2025-01-13 17:00:00+07', 'Tường T1-2'),
('hist-demo-010', 'task-demo-005', 'status', 'S0 Đang thực hiện', 'S1 Phối hợp', '2025-01-14 16:00:00+07', 'Review'),
('hist-demo-011', 'task-demo-005', 'progress', '30', '45', '2025-01-15 17:00:00+07', 'T3')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- TIMESHEET LOGS (Không có employee_id FK)
-- ============================================

INSERT INTO public.timesheet_logs (id, project_id, task_id, date, hours, work_type, description, status) VALUES
('ts-demo-001', 'proj-demo-001', 'task-demo-004', '2025-01-09', 8.0, 'Modeling', 'Model B2: cột, dầm', 'Approved'),
('ts-demo-002', 'proj-demo-001', 'task-demo-004', '2025-01-10', 8.0, 'Modeling', 'Model B2: sàn, tường', 'Approved'),
('ts-demo-003', 'proj-demo-001', 'task-demo-004', '2025-01-11', 6.0, 'Modeling', 'Hoàn thiện B2', 'Approved'),
('ts-demo-004', 'proj-demo-001', 'task-demo-004', '2025-01-12', 8.0, 'Modeling', 'Model B1', 'Approved'),
('ts-demo-005', 'proj-demo-001', 'task-demo-004', '2025-01-13', 4.0, 'Modeling', 'Hoàn thiện B1', 'Approved'),
('ts-demo-006', 'proj-demo-001', 'task-demo-004', '2025-01-14', 6.0, 'Review', 'Fix QA/QC', 'Pending'),
('ts-demo-007', 'proj-demo-001', 'task-demo-005', '2025-01-10', 8.0, 'Modeling', 'Layout T1', 'Approved'),
('ts-demo-008', 'proj-demo-001', 'task-demo-005', '2025-01-11', 8.0, 'Modeling', 'Tường', 'Approved'),
('ts-demo-009', 'proj-demo-001', 'task-demo-005', '2025-01-13', 8.0, 'Modeling', 'Tường T1-2', 'Approved'),
('ts-demo-010', 'proj-demo-001', 'task-demo-005', '2025-01-14', 6.0, 'Modeling', 'Cửa sổ T2', 'Approved'),
('ts-demo-011', 'proj-demo-001', 'task-demo-005', '2025-01-15', 8.0, 'Modeling', 'T3', 'Pending'),
('ts-demo-012', 'proj-demo-001', 'task-demo-006', '2025-01-16', 8.0, 'Modeling', 'Model móng', 'Pending'),
('ts-demo-013', 'proj-demo-001', 'task-demo-006', '2025-01-17', 8.0, 'Modeling', 'Cọc, dầm móng', 'Pending'),
('ts-demo-014', 'proj-demo-001', 'task-demo-008', '2025-01-16', 4.0, 'Coordination', 'Setup Navisworks', 'Approved'),
('ts-demo-015', 'proj-demo-001', 'task-demo-008', '2025-01-17', 6.0, 'Coordination', 'Clash detection', 'Pending')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SUCCESS
-- ============================================
SELECT '✅ Demo Data Created!' as message;
SELECT COUNT(*) || ' tasks' as tasks FROM public.tasks WHERE id LIKE 'task-demo-%';
SELECT COUNT(*) || ' history entries' as history FROM public.task_history WHERE id LIKE 'hist-demo-%';
SELECT COUNT(*) || ' timesheet logs' as timesheets FROM public.timesheet_logs WHERE id LIKE 'ts-demo-%';
