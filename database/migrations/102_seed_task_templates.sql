-- ============================================
-- Migration 102: Seed Task Templates
-- Mẫu công việc theo quy trình dự án
-- ============================================

INSERT INTO public.task_templates (phase, task_name, order_index, default_duration_days, default_assignee_role, is_active) VALUES
-- Giai đoạn 1: Xúc tiến Dự án
('Xúc tiến Dự án', 'Tiếp nhận yêu cầu khách hàng', 1, 1, 'Leader', TRUE),
('Xúc tiến Dự án', 'Khảo sát hiện trạng', 2, 3, 'Coordinator', TRUE),
('Xúc tiến Dự án', 'Thu thập hồ sơ thiết kế', 3, 2, 'Coordinator', TRUE),

-- Giai đoạn 2: Báo giá
('Báo giá', 'Phân tích yêu cầu kỹ thuật', 4, 2, 'Leader', TRUE),
('Báo giá', 'Lập dự toán chi phí', 5, 3, 'Leader', TRUE),
('Báo giá', 'Trình báo giá cho khách hàng', 6, 2, 'Leader', TRUE),

-- Giai đoạn 3: Chuẩn bị Triển khai
('Chuẩn bị Triển khai', 'Họp Kickoff dự án', 7, 1, 'Leader', TRUE),
('Chuẩn bị Triển khai', 'Phân công nhiệm vụ chi tiết', 8, 1, 'Leader', TRUE),
('Chuẩn bị Triển khai', 'Chuẩn bị môi trường làm việc', 9, 2, 'Coordinator', TRUE),

-- Giai đoạn 4: Triển khai BIM
('Triển khai BIM', 'Dựng hình 3D Kiến trúc', 10, 15, 'Modeler', TRUE),
('Triển khai BIM', 'Dựng hình 3D Kết cấu', 11, 15, 'Modeler', TRUE),
('Triển khai BIM', 'Dựng hình 3D MEP', 12, 20, 'Modeler', TRUE),
('Triển khai BIM', 'Kiểm tra xung đột (Clash Detection)', 13, 5, 'Coordinator', TRUE),
('Triển khai BIM', 'Tối ưu hóa model', 14, 3, 'Coordinator', TRUE),

-- Giai đoạn 5: Kiểm tra & Bàn giao
('Bàn giao', 'Kiểm tra chất lượng nội bộ', 15, 3, 'Reviewer', TRUE),
('Bàn giao', 'Xuất bản vẽ 2D', 16, 2, 'Modeler', TRUE),
('Bàn giao', 'Xuất báo cáo khối lượng (BOQ)', 17, 2, 'Modeler', TRUE),
('Bàn giao', 'Chuẩn bị tài liệu bàn giao', 18, 2, 'Coordinator', TRUE),
('Bàn giao', 'Họp nghiệm thu với khách hàng', 19, 1, 'Leader', TRUE),
('Bàn giao', 'Bàn giao sản phẩm cuối cùng', 20, 1, 'Leader', TRUE);

-- Success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Task templates seeded successfully!';
    RAISE NOTICE '   Total: 20 task templates';
    RAISE NOTICE '   Phases: Xúc tiến, Báo giá, Chuẩn bị, Triển khai, Bàn giao';
    RAISE NOTICE '========================================';
END $$;
