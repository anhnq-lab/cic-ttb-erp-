-- Migration 103: Rebuild task_templates with RACI support
-- Replaces previous task_templates table to support BIM Center Regulation workflows

-- 1. Reset Table
DROP TABLE IF EXISTS public.task_templates;

CREATE TABLE public.task_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capital_source TEXT NOT NULL, -- 'StateBudget' | 'NonStateBudget'
    phase TEXT NOT NULL,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    duration_days INTEGER DEFAULT 1,
    offset_days INTEGER DEFAULT 0,
    raci_matrix JSONB, -- Stores full RACI { "Role": "R/A/C/I" }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.task_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can read task_templates" ON public.task_templates FOR SELECT USING (true);

-- 2. Seed Data
-- Data merged from raci-templates.ts (Structure/Roles) and 008_raci_templates.sql (Timing)

INSERT INTO public.task_templates (capital_source, phase, code, name, raci_matrix, offset_days, duration_days) VALUES
-- ================================================================================================
-- STATE BUDGET (Vốn Ngân Sách)
-- ================================================================================================

-- Phase 1: Xúc tiến Dự án
('StateBudget', '1. Xúc tiến Dự án', '1.1', 'Thuyết trình khách hàng', 
 '{"GĐTT": "I/C", "PGĐTT": "C", "TBP XTDA": "R", "TBP ADMIN": "I", "TBP QA/QC": "C", "TBM": "C", "TVBM": "C"}', 0, 2),
('StateBudget', '1. Xúc tiến Dự án', '1.2', 'Liên hệ khách hàng nắm bắt thông tin định kỳ', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP XTDA": "R"}', 2, 5),
('StateBudget', '1. Xúc tiến Dự án', '1.3', 'Cập nhật danh mục khách hàng', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP XTDA": "R", "TBP ADMIN": "I", "TBP QA/QC": "I", "TBM": "I", "TVBM": "I"}', 5, 2),
('StateBudget', '1. Xúc tiến Dự án', '1.4', 'Thu thập dữ liệu đầu vào của dự án phục vụ báo giá', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP XTDA": "R", "TBP ADMIN": "I", "TBP QA/QC": "I", "TVBM": "I"}', 7, 3),

-- Phase 2: Báo giá
('StateBudget', '2. Báo giá', '2.1', 'Tạo thư mục Dự án tiềm năng (bao gồm mã dự án)', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP XTDA": "R", "TBP ADMIN": "I", "TBP QA/QC": "I", "TVBM": "I"}', 8, 1),
('StateBudget', '2. Báo giá', '2.2', 'Chốt khối lượng phục vụ báo giá', 
 '{"GĐTT": "A", "TBM": "R"}', 10, 3),
('StateBudget', '2. Báo giá', '2.3', 'Xem xét sự khả thi về kỹ thuật (bao gồm cả tiến độ)', 
 '{"GĐTT": "R", "TBP XTDA": "C"}', 12, 2),
('StateBudget', '2. Báo giá', '2.4', 'Pre-Bep', 
 '{"GĐTT": "I", "PGĐTT": "A", "TBM": "R", "TBP XTDA": "C"}', 14, 3),
('StateBudget', '2. Báo giá', '2.5', 'Lập báo giá', 
 '{"GĐTT": "A", "PGĐTT": "C", "TBM": "C", "TBP XTDA": "R"}', 17, 3),
('StateBudget', '2. Báo giá', '2.6', 'Thu thập hồ sơ năng lực đấu thầu liên quan', 
 '{"GĐTT": "C", "PGĐTT": "C", "TBP ADMIN": "R", "TBP QA/QC": "C", "TBM": "C", "TBP XTDA": "A"}', 20, 5),
('StateBudget', '2. Báo giá', '2.7', 'Theo dõi tình trạng báo giá', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP XTDA": "R"}', 25, 5),

-- Phase 3: Chuẩn bị
('StateBudget', '3. Chuẩn bị', '3.1', 'Bổ nhiệm QLDA/QLB cho Dự án', 
 '{"GĐTT": "R", "PGĐTT": "C", "TBP ADMIN": "I", "QLDA": "I"}', 30, 1),
('StateBudget', '3. Chuẩn bị', '3.2', 'Bổ nhiệm thành viên dự án', 
 '{"GĐTT": "R", "PGĐTT": "C", "TBP ADMIN": "I", "TBP QA/QC": "C", "TBM": "C", "TVBM": "I", "TBP XTDA": "C", "QLDA": "I", "QL BIM": "I", "ĐPBM": "I"}', 31, 2),
('StateBudget', '3. Chuẩn bị', '3.3', 'Tạo lập Folder Dự án', 
 '{"GĐTT": "R", "QLDA": "I", "QL BIM": "I", "ĐPBM": "I", "TNDH": "I"}', 33, 1),
('StateBudget', '3. Chuẩn bị', '3.4', 'Tạo lập Dự án trên Bimcollab', 
 '{"GĐTT": "R", "QLDA": "I", "QL BIM": "I", "ĐPBM": "I", "TNDH": "I"}', 33, 1),
('StateBudget', '3. Chuẩn bị', '3.5', 'Thiết lập CDE dự án', 
 '{"GĐTT": "R", "QL BIM": "R", "ĐPBM": "C", "TNDH": "C", "NDH": "C"}', 34, 2),
('StateBudget', '3. Chuẩn bị', '3.6', 'Tạo Template dự án', 
 '{"GĐTT": "A", "QL BIM": "R", "ĐPBM": "C", "TNDH": "C", "NDH": "C"}', 35, 1),
('StateBudget', '3. Chuẩn bị', '3.7', 'Tạo lập nhóm trao đổi nội bộ dự án', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBM": "I", "TBP XTDA": "I", "QLDA": "R", "QL BIM": "I", "ĐPBM": "I", "TNDH": "I"}', 36, 1),
('StateBudget', '3. Chuẩn bị', '3.8', 'Tạo lập nhóm trao đổi với khách hàng', 
 '{"TBP ADMIN": "I", "TBP XTDA": "R", "QLDA": "I", "QL BIM": "I"}', 36, 1),

-- Phase 4: Triển khai trình thẩm định
('StateBudget', '4. Triển khai trình thẩm định', '4.1', 'Dựng mô hình phục vụ trình thẩm định', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP QA/QC": "A", "TBM": "C", "TBP XTDA": "I", "QLDA": "A", "QL BIM": "A", "ĐPBM": "A", "TNDH": "R"}', 40, 15),
('StateBudget', '4. Triển khai trình thẩm định', '4.2', 'Xuất bản vẽ phục vụ thẩm định', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP QA/QC": "A", "TBM": "C", "TBP XTDA": "I", "QLDA": "A", "QL BIM": "A", "ĐPBM": "A", "TNDH": "R"}', 55, 5),
('StateBudget', '4. Triển khai trình thẩm định', '4.3', 'Xuất khối lượng phục vụ thẩm định', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP QA/QC": "A", "TBM": "C", "TBP XTDA": "I", "QLDA": "A", "QL BIM": "A", "ĐPBM": "A", "TNDH": "R"}', 60, 3),
('StateBudget', '4. Triển khai trình thẩm định', '4.4', 'Tập hợp hồ sơ trình thẩm định', 
 '{"GĐTT": "A", "PGĐTT": "I", "QLDA": "R", "QL BIM": "C"}', 63, 3),
('StateBudget', '4. Triển khai trình thẩm định', '4.5', 'Thu thập ý kiến thẩm định', 
 '{"GĐTT": "I", "QLDA": "R", "QL BIM": "I", "ĐPBM": "I", "TNDH": "I", "NDH": "I"}', 66, 5),
('StateBudget', '4. Triển khai trình thẩm định', '4.6', 'Cập nhật hồ sơ BIM trình thẩm định', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP QA/QC": "A", "TBM": "C", "TBP XTDA": "I", "QLDA": "A", "QL BIM": "A", "ĐPBM": "A", "TNDH": "R"}', 71, 7),
('StateBudget', '4. Triển khai trình thẩm định', '4.7', 'Quản lý File trên CDE Nội bộ', 
 '{"GĐTT": "I", "QL BIM": "R", "ĐPBM": "C", "TNDH": "C", "NDH": "C"}', 78, 2),
('StateBudget', '4. Triển khai trình thẩm định', '4.8', 'Đồng bộ File từ CDE nội bộ lên CDE Dự án', 
 '{"GĐTT": "I", "QL BIM": "R", "ĐPBM": "C", "TNDH": "C", "NDH": "C"}', 80, 1),

-- Phase 5: Triển khai Hỗ trợ QLDA
('StateBudget', '5. Triển khai Hỗ trợ QLDA', '5.1', 'Dựng mô hình hoàn thiện phục vụ QLDA', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP QA/QC": "A", "TBM": "C", "TBP XTDA": "I", "QLDA": "A", "QL BIM": "A", "ĐPBM": "A", "TNDH": "R"}', 85, 10),
('StateBudget', '5. Triển khai Hỗ trợ QLDA', '5.2', 'Triển khai các ứng dụng BIM theo yêu cầu của CĐT dự án', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP QA/QC": "A", "TBM": "C", "TBP R&D": "C", "QLDA": "A", "QL BIM": "A", "ĐPBM": "A", "TNDH": "R"}', 95, 10),
('StateBudget', '5. Triển khai Hỗ trợ QLDA', '5.3', 'Quản lý File trên CDE Nội bộ', 
 '{"GĐTT": "I", "QL BIM": "R", "ĐPBM": "C", "TNDH": "C", "NDH": "C"}', 105, 2),
('StateBudget', '5. Triển khai Hỗ trợ QLDA', '5.4', 'Đồng bộ File từ CDE nội bộ lên CDE Dự án', 
 '{"GĐTT": "I", "QL BIM": "R", "ĐPBM": "C", "TNDH": "C", "NDH": "C"}', 107, 1),
('StateBudget', '5. Triển khai Hỗ trợ QLDA', '5.5', 'Bàn giao dữ liệu Dự án cho khách hàng', 
 '{"GĐTT": "A", "PGĐTT": "I", "QLDA": "R", "QL BIM": "C"}', 110, 2),

-- Phase 6: Thanh quyết toán
('StateBudget', '6. Thanh quyết toán', '6.1', 'Lập hồ sơ thanh toán từng giai đoạn', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP ADMIN": "R", "TBP XTDA": "C", "QLDA": "C"}', 115, 5),
('StateBudget', '6. Thanh quyết toán', '6.2', 'Lập hồ sơ quyết toán hoàn thành dự án', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP ADMIN": "R", "TBP XTDA": "C", "QLDA": "C"}', 125, 10),
('StateBudget', '6. Thanh quyết toán', '6.3', 'Theo dõi tình trạng thanh toán', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP ADMIN": "R", "TBP XTDA": "C", "QLDA": "I"}', 125, 10),

-- Phase 7: Lưu trữ rút KN
('StateBudget', '7. Lưu trữ rút KN', '7.1', 'Lưu trữ dữ liệu Dự án từ CDE dự án về hệ thống lưu trữ của TT', 
 '{"QL BIM": "R"}', 140, 3),
('StateBudget', '7. Lưu trữ rút KN', '7.2', 'Rút kinh nghiệm, cải tiến quy trình', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP R&D": "R", "QLDA": "C", "QL BIM": "C", "ĐPBM": "C", "TNDH": "C"}', 143, 2),


-- ================================================================================================
-- NON-STATE BUDGET (Vốn Ngoài Ngân Sách)
-- ================================================================================================

-- Phase 1
('NonStateBudget', '1. Xúc tiến Dự án', '1.1', 'Thuyết trình khách hàng', 
 '{"GĐTT": "I/C", "PGĐTT": "C", "TBP XTDA": "R", "TBP ADMIN": "I", "TBP QA/QC": "C", "TBM": "C", "TVBM": "C"}', 0, 2),
('NonStateBudget', '1. Xúc tiến Dự án', '1.2', 'Liên hệ khách hàng nắm bắt thông tin định kỳ', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP XTDA": "R"}', 2, 5),
('NonStateBudget', '1. Xúc tiến Dự án', '1.3', 'Cập nhật danh mục khách hàng', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP XTDA": "R", "TBP ADMIN": "I", "TBP QA/QC": "I", "TBM": "I", "TVBM": "I"}', 5, 2),
('NonStateBudget', '1. Xúc tiến Dự án', '1.4', 'Thu thập dữ liệu đầu vào của dự án phục vụ báo giá', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP XTDA": "R", "TBP ADMIN": "I", "TBP QA/QC": "I", "TVBM": "I"}', 7, 3),

-- Phase 2
('NonStateBudget', '2. Báo giá', '2.1', 'Tạo thư mục Dự án tiềm năng (bao gồm mã dự án)', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP XTDA": "R", "TBP ADMIN": "I", "TBP QA/QC": "I", "TVBM": "I"}', 8, 1),
('NonStateBudget', '2. Báo giá', '2.2', 'Chốt khối lượng phục vụ báo giá', 
 '{"GĐTT": "A", "TBM": "R"}', 10, 3),
('NonStateBudget', '2. Báo giá', '2.3', 'Xem xét sự khả thi về kỹ thuật (bao gồm cả tiến độ)', 
 '{"GĐTT": "R", "TBP XTDA": "C"}', 12, 2),
('NonStateBudget', '2. Báo giá', '2.4', 'Pre-Bep', 
 '{"GĐTT": "I", "PGĐTT": "A", "TBM": "R", "TBP XTDA": "C"}', 14, 3),
('NonStateBudget', '2. Báo giá', '2.5', 'Lập báo giá', 
 '{"GĐTT": "A", "PGĐTT": "C", "TBM": "C", "TBP XTDA": "R"}', 17, 3),
('NonStateBudget', '2. Báo giá', '2.6', 'Thu thập hồ sơ năng lực đấu thầu liên quan', 
 '{"GĐTT": "C", "PGĐTT": "C", "TBP ADMIN": "R", "TBP QA/QC": "C", "TBM": "C", "TBP XTDA": "A"}', 20, 5),
('NonStateBudget', '2. Báo giá', '2.7', 'Theo dõi tình trạng báo giá', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP XTDA": "R"}', 25, 5),

-- Phase 3
('NonStateBudget', '3. Chuẩn bị', '3.1', 'Bổ nhiệm QLDA/QLB cho Dự án', 
 '{"GĐTT": "R", "PGĐTT": "C", "TBP ADMIN": "I", "QLDA": "I"}', 30, 1),
('NonStateBudget', '3. Chuẩn bị', '3.2', 'Bổ nhiệm thành viên dự án', 
 '{"GĐTT": "R", "PGĐTT": "C", "TBP ADMIN": "I", "TBP QA/QC": "C", "TBM": "C", "TVBM": "I", "TBP XTDA": "C", "QLDA": "I", "QL BIM": "I", "ĐPBM": "I"}', 31, 2),
('NonStateBudget', '3. Chuẩn bị', '3.3', 'Tạo lập Folder Dự án', 
 '{"GĐTT": "R", "QLDA": "I", "QL BIM": "I", "ĐPBM": "I", "TNDH": "I"}', 33, 1),
('NonStateBudget', '3. Chuẩn bị', '3.4', 'Tạo lập Dự án trên Bimcollab', 
 '{"GĐTT": "R", "QLDA": "I", "QL BIM": "I", "ĐPBM": "I", "TNDH": "I"}', 33, 1),
('NonStateBudget', '3. Chuẩn bị', '3.5', 'Thiết lập CDE dự án', 
 '{"GĐTT": "R", "QL BIM": "R", "ĐPBM": "C", "TNDH": "C", "NDH": "C"}', 34, 2),
('NonStateBudget', '3. Chuẩn bị', '3.6', 'Tạo Template dự án', 
 '{"GĐTT": "A", "QL BIM": "R", "ĐPBM": "C", "TNDH": "C", "NDH": "C"}', 35, 1),
('NonStateBudget', '3. Chuẩn bị', '3.7', 'Tạo lập nhóm trao đổi nội bộ dự án', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBM": "I", "TBP XTDA": "I", "QLDA": "R", "QL BIM": "I", "ĐPBM": "I", "TNDH": "I"}', 36, 1),
('NonStateBudget', '3. Chuẩn bị', '3.8', 'Tạo lập nhóm trao đổi với khách hàng', 
 '{"TBP ADMIN": "I", "TBP XTDA": "R", "QLDA": "I", "QL BIM": "I"}', 36, 1),

-- Phase 4
('NonStateBudget', '4. Triển khai Hỗ trợ QLDA', '4.1', 'Dựng mô hình hoàn thiện phục vụ QLDA', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP QA/QC": "A", "TBM": "C", "TBP XTDA": "I", "QLDA": "A", "QL BIM": "A", "ĐPBM": "A", "TNDH": "R"}', 40, 15),
('NonStateBudget', '4. Triển khai Hỗ trợ QLDA', '4.2', 'Triển khai các ứng dụng BIM theo yêu cầu của CĐT dự án', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP QA/QC": "A", "TBM": "C", "TBP R&D": "C", "QLDA": "A", "QL BIM": "A", "ĐPBM": "A", "TNDH": "R"}', 55, 10),
('NonStateBudget', '4. Triển khai Hỗ trợ QLDA', '4.3', 'Quản lý File trên CDE Nội bộ', 
 '{"GĐTT": "I", "QL BIM": "R", "ĐPBM": "C", "TNDH": "C", "NDH": "C"}', 65, 2),
('NonStateBudget', '4. Triển khai Hỗ trợ QLDA', '4.4', 'Đồng bộ File từ CDE nội bộ lên CDE Dự án', 
 '{"GĐTT": "I", "QL BIM": "R", "ĐPBM": "C", "TNDH": "C", "NDH": "C"}', 67, 1),
('NonStateBudget', '4. Triển khai Hỗ trợ QLDA', '4.5', 'Bàn giao dữ liệu Dự án cho khách hàng', 
 '{"GĐTT": "A", "PGĐTT": "I", "QLDA": "R", "QL BIM": "C"}', 70, 2),

-- Phase 5
('NonStateBudget', '5. Thanh quyết toán', '5.1', 'Lập hồ sơ thanh toán từng giai đoạn', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP ADMIN": "R", "TBP XTDA": "C", "QLDA": "C"}', 75, 5),
('NonStateBudget', '5. Thanh quyết toán', '5.2', 'Lập hồ sơ quyết toán hoàn thành dự án', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP ADMIN": "R", "TBP XTDA": "C", "QLDA": "C"}', 85, 10),
('NonStateBudget', '5. Thanh quyết toán', '5.3', 'Theo dõi tình trạng thanh toán', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP ADMIN": "R", "TBP XTDA": "C", "QLDA": "I"}', 85, 10),

-- Phase 6
('NonStateBudget', '6. Lưu trữ rút KN', '6.1', 'Lưu trữ dữ liệu Dự án từ CDE dự án về hệ thống lưu trữ của TT', 
 '{"QL BIM": "R"}', 100, 3),
('NonStateBudget', '6. Lưu trữ rút KN', '6.2', 'Rút kinh nghiệm, cải tiến quy trình', 
 '{"GĐTT": "I", "PGĐTT": "I", "TBP R&D": "R", "QLDA": "C", "QL BIM": "C", "ĐPBM": "C", "TNDH": "C"}', 103, 2);

DO $$
BEGIN
    RAISE NOTICE '✅ Task templates rebuilt and seeded successfully!';
END $$;
