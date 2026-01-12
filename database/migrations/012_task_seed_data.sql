-- ============================================
-- Task Management SEED DATA
-- Realistic examples for BIM project workflow
-- ============================================

-- Assumes Migration 001 and 011 have been run
-- Projects and employees should already exist

-- ============================================
-- SAMPLE TASKS for Project: BIM LOD400 - Vincom Metropolis
-- ============================================

INSERT INTO public.tasks (id, project_id, code, name, assignee_id, assignee_name, status, priority, start_date, due_date, progress, estimated_hours, description, created_at) VALUES
-- Phase 1: Khởi tạo dự án
('task-001', 'proj-001', '1.1', 'Kick-off meeting và phân công nhiệm vụ', 'emp-002', 'Trần Thị Bình', 'Hoàn thành', 'Cao', '2025-01-02', '2025-01-02', 100, 4.0, 'Họp kick-off, phân công role, setup môi trường làm việc', '2025-01-02 08:00:00+07'),
('task-002', 'proj-001', '1.2', 'Thu thập và rà soát bản vẽ thiết kế', 'emp-003', 'Lê Minh Châu', 'Hoàn thành', 'Cao', '2025-01-03', '2025-01-05', 100, 16.0, 'Nhận bản vẽ kiến trúc, kết cấu, MEP. Rà soát và list các vấn đề cần làm rõ', '2025-01-03 09:00:00+07'),
('task-003', 'proj-001', '1.3', 'Setup BIM Execution Plan (BEP)', 'emp-002', 'Trần Thị Bình', 'S5 Đã duyệt', 'Cao', '2025-01-06', '2025-01-08', 95, 12.0, 'Lập BEP, quy định về LOD, file naming, coordinate system, clash tolerance', '2025-01-06 08:30:00+07'),

-- Phase 2: Modeling (Đang thực hiện)
('task-004', 'proj-001', '2.1', 'Dựng model kiến trúc LOD 300 - Tầng hầm', 'emp-004', 'Phạm Văn Dũng', 'S2 Kiểm tra chéo', 'Cao', '2025-01-09', '2025-01-15', 75, 40.0, 'Dựng model kiến trúc 2 tầng hầm: cột, dầm, sàn, tường, cửa. Theo bản vẽ A-B01, A-B02', '2025-01-09 08:00:00+07'),
('task-005', 'proj-001', '2.2', 'Dựng model kiến trúc LOD 300 - Tầng 1-5', 'emp-005', 'Hoàng Thị Em', 'S1 Phối hợp', 'Cao', '2025-01-10', '2025-01-20', 45, 80.0, 'Dựng model kiến trúc tầng 1-5: layout, tường, cửa sổ, cửa đi, ban công. Theo bản vẽ A-01 đến A-05', '2025-01-10 08:00:00+07'),
('task-006', 'proj-001', '2.3', 'Dựng model kết cấu LOD 300 - Móng và tầng hầm', 'emp-004', 'Phạm Văn Dũng', 'S0 Đang thực hiện', 'Trung bình', '2025-01-16', '2025-01-25', 30, 60.0, 'Dựng model kết cấu móng, cọc, dầm móng, cột, dầm, sàn tầng hầm. Theo bản vẽ S-B01, S-B02', '2025-01-16 08:00:00+07'),
('task-007', 'proj-001', '2.4', 'Dựng model MEP - Hệ thống điện', 'emp-005', 'Hoàng Thị Em', 'Mở', 'Trung bình', '2025-01-20', '2025-02-05', 0, 100.0, 'Dựng model hệ thống điện: tủ điện, đường ống, cáp, thiết bị chiếu sáng, ổ cắm', '2025-01-20 08:00:00+07'),

-- Phase 3: Review & Coordination
('task-008', 'proj-001', '3.1', 'Clash Detection tầng hầm', 'emp-003', 'Lê Minh Châu', 'S1 Phối hợp', 'Cao', '2025-01-16', '2025-01-18', 60, 16.0, 'Chạy clash detection giữa kiến trúc, kết cấu, MEP tầng hầm. Export clash report', '2025-01-16 09:00:00+07'),
('task-009', 'proj-001', '3.2', 'Họp phối hợp giải quyết clash', 'emp-002', 'Trần Thị Bình', 'Đang chờ', 'Cao', '2025-01-19', '2025-01-19', 0, 4.0, 'Họp với các bên để giải quyết các clash phát hiện được. Ghi chú biên bản', '2025-01-19 14:00:00+07'),
('task-010', 'proj-001', '3.3', 'Cập nhật model sau phối hợp', 'emp-004', 'Phạm Văn Dũng', 'Mở', 'Trung bình', '2025-01-20', '2025-01-22', 0, 20.0, 'Cập nhật model theo kết quả họp phối hợp. Sửa các vị trí clash', '2025-01-20 08:00:00+07'),

-- Phase 4: Documentation
('task-011', 'proj-001', '4.1', 'Xuất bản vẽ 2D từ model', 'emp-005', 'Hoàng Thị Em', 'Mở', 'Thấp', '2025-01-23', '2025-01-25', 0, 16.0, 'Xuất bản vẽ mặt bằng, mặt đứng, mặt cắt từ model Revit', '2025-01-23 08:00:00+07'),
('task-012', 'proj-001', '4.2', 'Lập Schedule và BOQ', 'emp-003', 'Lê Minh Châu', 'Mở', 'Trung bình', '2025-01-26', '2025-01-28', 0, 20.0, 'Lập schedule vật liệu, BOQ chi tiết theo từng hạng mục', '2025-01-26 08:00:00+07');

-- ============================================
-- SAMPLE TASKS for Project: Digital Twin - Ecopark
-- ============================================

INSERT INTO public.tasks (id, project_id, code, name, assignee_id, assignee_name, status, priority, start_date, due_date, progress, estimated_hours, description, created_at) VALUES
('task-013', 'proj-002', '1.1', '3D Laser Scanning toàn khu đô thị', 'emp-003', 'Lê Minh Châu', 'S4 Lãnh đạo duyệt', 'Cao', '2024-12-15', '2024-12-20', 100, 60.0, 'Quét 3D laser toàn bộ khu đô thị hiện trạng. Point cloud density: 5mm', '2024-12-15 08:00:00+07'),
('task-014', 'proj-002', '1.2', 'Xử lý point cloud và tạo mesh', 'emp-004', 'Phạm Văn Dũng', 'S3 Duyệt nội bộ', 'Cao', '2024-12-21', '2025-01-05', 90, 80.0, 'Import point cloud vào ReCap, làm sạch, tạo mesh 3D cho các tòa nhà', '2024-12-21 08:00:00+07'),
('task-015', 'proj-002', '2.1', 'Scan to BIM - Tòa A1', 'emp-005', 'Hoàng Thị Em', 'S1 Phối hợp', 'Cao', '2025-01-06', '2025-01-20', 50, 100.0, 'Dựng model Revit LOD 350 từ point cloud cho Tòa A1 (20 tầng)', '2025-01-06 08:00:00+07'),
('task-016', 'proj-002', '2.2', 'Scan to BIM - Tòa A2', 'emp-004', 'Phạm Văn Dũng', 'Mở', 'Trung bình', '2025-01-21', '2025-02-10', 0, 100.0, 'Dựng model Revit LOD 350 từ point cloud cho Tòa A2 (18 tầng)', '2025-01-21 08:00:00+07'),
('task-017', 'proj-002', '3.1', 'Setup Unity Digital Twin platform', 'emp-003', 'Lê Minh Châu', 'S0 Đang thực hiện', 'Cao', '2025-01-10', '2025-01-25', 35, 60.0, 'Setup Unity project, import models, setup camera, lighting, navigation', '2025-01-10 08:00:00+07'),
('task-018', 'proj-002', '3.2', 'Tích hợp IoT sensors data', 'emp-003', 'Lê Minh Châu', 'Mở', 'Trung bình', '2025-01-26', '2025-02-15', 0, 80.0, 'Connect IoT sensors (nhiệt độ, độ ẩm, năng lượng) vào Digital Twin', '2025-01-26 08:00:00+07');

-- ============================================
-- TASK HISTORY - Auto-logged changes
-- ============================================

INSERT INTO public.task_history (id, task_id, field_name, old_value, new_value, changed_by, changed_at, notes) VALUES
-- Task 004 history
('hist-001', 'task-004', 'status', 'Mở', 'S0 Đang thực hiện', 'emp-004', '2025-01-09 08:30:00+07', 'Bắt đầu làm việc'),
('hist-002', 'task-004', 'progress', '0', '25', 'emp-004', '2025-01-10 17:00:00+07', 'Hoàn thành model tầng B2'),
('hist-003', 'task-004', 'status', 'S0 Đang thực hiện', 'S1 Phối hợp', 'emp-004', '2025-01-11 16:00:00+07', 'Gửi coordinator review'),
('hist-004', 'task-004', 'progress', '25', '50', 'emp-004', '2025-01-12 17:00:00+07', 'Hoàn thành model tầng B1'),
('hist-005', 'task-004', 'status', 'S1 Phối hợp', 'S2 Kiểm tra chéo', 'emp-003', '2025-01-13 10:00:00+07', 'Coordinator approve, chuyển QA/QC'),
('hist-006', 'task-004', 'progress', '50', '75', 'emp-004', '2025-01-14 17:00:00+07', 'Fix theo góp ý QA/QC'),

-- Task 005 history
('hist-007', 'task-005', 'status', 'Mở', 'S0 Đang thực hiện', 'emp-005', '2025-01-10 08:30:00+07', 'Bắt đầu tầng 1'),
('hist-008', 'task-005', 'progress', '0', '15', 'emp-005', '2025-01-11 17:00:00+07', 'Hoàn thành layout tầng 1'),
('hist-009', 'task-005', 'progress', '15', '30', 'emp-005', '2025-01-13 17:00:00+07', 'Hoàn thành tường, cửa tầng 1-2'),
('hist-010', 'task-005', 'status', 'S0 Đang thực hiện', 'S1 Phối hợp', 'emp-005', '2025-01-14 16:00:00+07', 'Gửi review tầng 1-2'),
('hist-011', 'task-005', 'progress', '30', '45', 'emp-005', '2025-01-15 17:00:00+07', 'Tiếp tục tầng 3');

-- ============================================
-- TIMESHEET LOGS - Linked to tasks
-- ============================================

INSERT INTO public.timesheet_logs (id, project_id, employee_id, task_id, date, hours, work_type, description, status) VALUES
-- Task 004 timesheets
('ts-001', 'proj-001', 'emp-004', 'task-004', '2025-01-09', 8.0, 'Modeling', 'Dựng model tầng B2: cột, dầm', 'Approved'),
('ts-002', 'proj-001', 'emp-004', 'task-004', '2025-01-10', 8.0, 'Modeling', 'Tiếp tục model tầng B2: sàn, tường', 'Approved'),
('ts-003', 'proj-001', 'emp-004', 'task-004', '2025-01-11', 6.0, 'Modeling', 'Hoàn thiện tầng B2, bắt đầu B1', 'Approved'),
('ts-004', 'proj-001', 'emp-004', 'task-004', '2025-01-12', 8.0, 'Modeling', 'Model tầng B1', 'Approved'),
('ts-005', 'proj-001', 'emp-004', 'task-004', '2025-01-13', 4.0, 'Modeling', 'Hoàn thiện tầng B1', 'Approved'),
('ts-006', 'proj-001', 'emp-004', 'task-004', '2025-01-14', 6.0, 'Review', 'Fix theo góp ý QA/QC', 'Pending'),

-- Task 005 timesheets
('ts-007', 'proj-001', 'emp-005', 'task-005', '2025-01-10', 8.0, 'Modeling', 'Layout tầng 1', 'Approved'),
('ts-008', 'proj-001', 'emp-005', 'task-005', '2025-01-11', 8.0, 'Modeling', 'Hoàn thiện layout, bắt đầu tường', 'Approved'),
('ts-009', 'proj-001', 'emp-005', 'task-005', '2025-01-13', 8.0, 'Modeling', 'Tường, cửa tầng 1-2', 'Approved'),
('ts-010', 'proj-001', 'emp-005', 'task-005', '2025-01-14', 6.0, 'Modeling', 'Cửa sổ, ban công tầng 2', 'Approved'),
('ts-011', 'proj-001', 'emp-005', 'task-005', '2025-01-15', 8.0, 'Modeling', 'Bắt đầu tầng 3', 'Pending'),

-- Task 006 timesheets
('ts-012', 'proj-001', 'emp-004', 'task-006', '2025-01-16', 8.0, 'Modeling', 'Bắt đầu model móng', 'Pending'),
('ts-013', 'proj-001', 'emp-004', 'task-006', '2025-01-17', 8.0, 'Modeling', 'Model cọc, dầm móng', 'Pending'),

-- Task 008 timesheets
('ts-014', 'proj-001', 'emp-003', 'task-008', '2025-01-16', 4.0, 'Coordination', 'Setup Navisworks, import models', 'Approved'),
('ts-015', 'proj-001', 'emp-003', 'task-008', '2025-01-17', 6.0, 'Coordination', 'Run clash detection, phân loại clash', 'Pending');

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'Task Management Seed Data Created! ✅' as message;
SELECT COUNT(*) || ' tasks created' as info FROM public.tasks WHERE id LIKE 'task-%';
SELECT COUNT(*) || ' history entries created' as info2 FROM public.task_history WHERE id LIKE 'hist-%';
SELECT COUNT(*) || ' timesheet logs created' as info3 FROM public.timesheet_logs WHERE id LIKE 'ts-%';
