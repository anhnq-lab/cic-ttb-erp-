-- 1. Create task_templates table
CREATE TABLE IF NOT EXISTS public.task_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capital_source TEXT NOT NULL CHECK (capital_source IN ('StateBudget', 'NonStateBudget')),
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    offset_days INTEGER DEFAULT 0,
    duration_days INTEGER DEFAULT 1,
    assignee_role TEXT,
    priority TEXT DEFAULT 'Medium',
    phase TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.task_templates ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read
CREATE POLICY "Everyone can read task_templates" ON public.task_templates
    FOR SELECT USING (true);

-- 2. Seed Data (StateBudget - 25.10)
INSERT INTO public.task_templates (capital_source, phase, code, name, offset_days, duration_days, assignee_role, priority) VALUES 
-- 1. Xúc tiến
('StateBudget', '1. Xúc tiến & Chuẩn bị', '1.1', 'Thuyết trình khách hàng', 0, 2, 'TBP XTDA', 'High'),
('StateBudget', '1. Xúc tiến & Chuẩn bị', '1.2', 'Liên hệ khách hàng nắm bắt thông tin định kỳ', 2, 5, 'TBP XTDA', 'Medium'),
('StateBudget', '1. Xúc tiến & Chuẩn bị', '1.3', 'Cập nhật danh mục khách hàng', 5, 2, 'TBP XTDA', 'Low'),
('StateBudget', '1. Xúc tiến & Chuẩn bị', '1.4', 'Thu thập dữ liệu đầu vào báo giá', 7, 3, 'TBP XTDA', 'High'),

-- 2. Báo giá
('StateBudget', '2. Báo giá & Hợp đồng', '2.1', 'Duyệt khối lượng phục vụ báo giá', 10, 3, 'TBM', 'High'),
('StateBudget', '2. Báo giá & Hợp đồng', '2.2', 'Xem xét sự khả thi về kỹ thuật', 12, 2, 'GĐTT', 'Critical'),
('StateBudget', '2. Báo giá & Hợp đồng', '2.3', 'Pre-Bep', 14, 3, 'TBM', 'High'),
('StateBudget', '2. Báo giá & Hợp đồng', '2.4', 'Lập báo giá', 17, 3, 'TBP XTDA', 'High'),
('StateBudget', '2. Báo giá & Hợp đồng', '2.5', 'Thu thập hồ sơ năng lực đấu thầu liên quan', 20, 5, 'TBP ADMIN', 'Medium'),
('StateBudget', '2. Báo giá & Hợp đồng', '2.6', 'Theo dõi tình trạng báo giá', 25, 5, 'TBP XTDA', 'Low'),

-- 3. Chuẩn bị
('StateBudget', '3. Triển khai & Phối hợp', '3.1', 'Bổ nhiệm QLDA/QLB cho Dự án', 30, 1, 'GĐTT', 'High'),
('StateBudget', '3. Triển khai & Phối hợp', '3.2', 'Bổ nhiệm thành viên dự án', 31, 2, 'GĐTT', 'High'),
('StateBudget', '3. Triển khai & Phối hợp', '3.3', 'Tạo lập Folder Dự án', 33, 1, 'GĐTT', 'Medium'),
('StateBudget', '3. Triển khai & Phối hợp', '3.4', 'Tạo lập Dự án trên Bimcollab', 33, 1, 'GĐTT', 'Medium'),
('StateBudget', '3. Triển khai & Phối hợp', '3.5', 'Thiết lập CDE dự án', 34, 2, 'QLDA', 'High'),
('StateBudget', '3. Triển khai & Phối hợp', '3.6', 'Tạo lập nhóm trao đổi nội bộ dự án', 36, 1, 'QLDA', 'Medium'),
('StateBudget', '3. Triển khai & Phối hợp', '3.7', 'Tạo lập nhóm trao đổi với khách hàng', 36, 1, 'TBP XTDA', 'Medium'),

-- 4. Triển khai trình thẩm định
('StateBudget', '4. Thực hiện & Kiểm soát', '4.1', 'Dựng mô hình phục vụ trình thẩm định', 40, 15, 'TNDH', 'High'),
('StateBudget', '4. Thực hiện & Kiểm soát', '4.2', 'Xuất bản vẽ phục vụ thẩm định', 55, 5, 'TNDH', 'High'),
('StateBudget', '4. Thực hiện & Kiểm soát', '4.3', 'Xuất khối lượng phục vụ thẩm định', 60, 3, 'TNDH', 'High'),
('StateBudget', '4. Thực hiện & Kiểm soát', '4.4', 'Tập hợp hồ sơ trình thẩm định', 63, 3, 'QLDA', 'Critical'),
('StateBudget', '4. Thực hiện & Kiểm soát', '4.5', 'Thu thập ý kiến thẩm định', 66, 5, 'QLDA', 'High'),
('StateBudget', '4. Thực hiện & Kiểm soát', '4.6', 'Cập nhật hồ sơ BIM trình thẩm định', 71, 7, 'TNDH', 'High'),
('StateBudget', '4. Thực hiện & Kiểm soát', '4.7', 'Quản lý File trên CDE Nội bộ', 78, 2, 'QLDA', 'Medium'),
('StateBudget', '4. Thực hiện & Kiểm soát', '4.8', 'Đồng bộ File từ CDE nội bộ lên CDE Dự án', 80, 1, 'QLDA', 'Medium'),

-- 5. Triển khai Hỗ trợ QLDA
('StateBudget', '5. Đóng dự án', '5.1', 'Dựng mô hình hoàn thiện phục vụ QLDA', 85, 10, 'TNDH', 'High'),
('StateBudget', '5. Đóng dự án', '5.2', 'Triển khai các ứng dụng BIM theo yêu cầu', 95, 10, 'TNDH', 'Medium'),
('StateBudget', '5. Đóng dự án', '5.3', 'Quản lý File trên CDE Nội bộ', 105, 2, 'QLDA', 'Low'),
('StateBudget', '5. Đóng dự án', '5.4', 'Đồng bộ File từ CDE nội bộ lên CDE Dự án', 107, 1, 'QLDA', 'Low'),
('StateBudget', '5. Đóng dự án', '5.5', 'Bàn giao dữ liệu Dự án cho khách hàng', 110, 2, 'GĐTT', 'Critical'),

-- 6. Thanh quyết toán
('StateBudget', '6. Thanh quyết toán', '6.1', 'Lập hồ sơ thanh toán từng giai đoạn', 115, 5, 'TBP ADMIN', 'High'),
('StateBudget', '6. Thanh quyết toán', '6.2', 'Lập hồ sơ quyết toán hoàn thành dự án', 125, 10, 'TBP ADMIN', 'High'),
('StateBudget', '6. Thanh quyết toán', '6.3', 'Theo dõi tình trạng thanh toán', 125, 10, 'QLDA', 'Medium'),

-- 7. Lưu trữ
('StateBudget', '7. Lưu trữ', '7.1', 'Lưu trữ dữ liệu Dự án', 140, 3, 'QL BIM', 'Low'),
('StateBudget', '7. Lưu trữ', '7.2', 'Rút kinh nghiệm, cải tiến quy trình', 143, 2, 'QLDA', 'Medium');


-- 3. Seed Data (NonStateBudget - 25.20)
INSERT INTO public.task_templates (capital_source, phase, code, name, offset_days, duration_days, assignee_role, priority) VALUES 
-- 1. Xúc tiến
('NonStateBudget', '1. Xúc tiến & Chuẩn bị', '1.1', 'Thuyết trình khách hàng', 0, 2, 'TBP XTDA', 'High'),
('NonStateBudget', '1. Xúc tiến & Chuẩn bị', '1.2', 'Liên hệ khách hàng nắm bắt thông tin định kỳ', 2, 5, 'TBP XTDA', 'Medium'),
('NonStateBudget', '1. Xúc tiến & Chuẩn bị', '1.3', 'Cập nhật danh mục khách hàng', 5, 2, 'TBP XTDA', 'Low'),
('NonStateBudget', '1. Xúc tiến & Chuẩn bị', '1.4', 'Thu thập dữ liệu đầu vào báo giá', 7, 3, 'TBP XTDA', 'High'),

-- 2. Báo giá
('NonStateBudget', '2. Báo giá & Hợp đồng', '2.1', 'Duyệt khối lượng phục vụ báo giá', 10, 3, 'TBM', 'High'),
('NonStateBudget', '2. Báo giá & Hợp đồng', '2.2', 'Xem xét sự khả thi về kỹ thuật', 12, 2, 'GĐTT', 'Critical'),
('NonStateBudget', '2. Báo giá & Hợp đồng', '2.3', 'Pre-Bep', 14, 3, 'TBM', 'High'),
('NonStateBudget', '2. Báo giá & Hợp đồng', '2.4', 'Lập báo giá', 17, 3, 'TBP XTDA', 'High'),
('NonStateBudget', '2. Báo giá & Hợp đồng', '2.5', 'Thu thập hồ sơ năng lực đấu thầu liên quan', 20, 5, 'TBP ADMIN', 'Medium'),
('NonStateBudget', '2. Báo giá & Hợp đồng', '2.6', 'Theo dõi tình trạng báo giá', 25, 5, 'TBP XTDA', 'Low'),

-- 3. Chuẩn bị
('NonStateBudget', '3. Triển khai & Phối hợp', '3.1', 'Bổ nhiệm QLDA/QLB cho Dự án', 30, 1, 'GĐTT', 'High'),
('NonStateBudget', '3. Triển khai & Phối hợp', '3.2', 'Bổ nhiệm thành viên dự án', 31, 2, 'GĐTT', 'High'),
('NonStateBudget', '3. Triển khai & Phối hợp', '3.3', 'Tạo lập Folder Dự án', 33, 1, 'GĐTT', 'Medium'),
('NonStateBudget', '3. Triển khai & Phối hợp', '3.4', 'Tạo lập Dự án trên Bimcollab', 33, 1, 'GĐTT', 'Medium'),
('NonStateBudget', '3. Triển khai & Phối hợp', '3.5', 'Thiết lập CDE dự án', 34, 2, 'QLDA', 'High'),
('NonStateBudget', '3. Triển khai & Phối hợp', '3.6', 'Tạo lập nhóm trao đổi nội bộ dự án', 36, 1, 'QLDA', 'Medium'),
('NonStateBudget', '3. Triển khai & Phối hợp', '3.7', 'Tạo lập nhóm trao đổi với khách hàng', 36, 1, 'TBP XTDA', 'Medium'),

-- 4. Triển khai Hỗ trợ QLDA
('NonStateBudget', '4. Thực hiện & Kiểm soát', '4.1', 'Dựng mô hình hoàn thiện phục vụ QLDA', 40, 15, 'TNDH', 'High'),
('NonStateBudget', '4. Thực hiện & Kiểm soát', '4.2', 'Triển khai các ứng dụng BIM theo yêu cầu', 55, 10, 'TNDH', 'Medium'),
('NonStateBudget', '4. Thực hiện & Kiểm soát', '4.3', 'Quản lý File trên CDE Nội bộ', 65, 2, 'QLDA', 'Low'),
('NonStateBudget', '4. Thực hiện & Kiểm soát', '4.4', 'Đồng bộ File từ CDE nội bộ lên CDE Dự án', 67, 1, 'QLDA', 'Low'),
('NonStateBudget', '4. Thực hiện & Kiểm soát', '4.5', 'Bàn giao dữ liệu Dự án cho khách hàng', 70, 2, 'GĐTT', 'Critical'),

-- 5. Thanh quyết toán
('NonStateBudget', '5. Đóng dự án', '5.1', 'Lập hồ sơ thanh toán từng giai đoạn', 75, 5, 'TBP ADMIN', 'High'),
('NonStateBudget', '5. Đóng dự án', '5.2', 'Lập hồ sơ quyết toán hoàn thành dự án', 85, 10, 'TBP ADMIN', 'High'),
('NonStateBudget', '5. Đóng dự án', '5.3', 'Theo dõi tình trạng thanh toán', 85, 10, 'QLDA', 'Medium'),

-- 6. Lưu trữ
('NonStateBudget', '6. Lưu trữ', '6.1', 'Lưu trữ dữ liệu Dự án', 100, 3, 'QL BIM', 'Low'),
('NonStateBudget', '6. Lưu trữ', '6.2', 'Rút kinh nghiệm, cải tiến quy trình', 103, 2, 'QLDA', 'Medium');
