-- ============================================
-- EDT CORE SEED DATA
-- Description: Sample data for Templates, SOPs, and QA/QC Checklists
-- ============================================

-- ============================================
-- 1. PROJECT TEMPLATES
-- ============================================
INSERT INTO project_templates (name, type, phases, description) VALUES
('Mẫu Dự án Dân dụng Điển hình (Nhóm B)', 'Dân dụng', 
'[
  {
    "name": "1. Chuẩn bị đầu tư",
    "description": "Giai đoạn lập báo cáo và xin phép",
    "tasks": [
      {"code": "PRE-01", "name": "Khảo sát địa chất", "duration": 15},
      {"code": "PRE-02", "name": "Lập Báo cáo nghiên cứu khả thi", "duration": 30}
    ]
  },
  {
    "name": "2. Thiết kế",
    "description": "Thiết kế cơ sở và kỹ thuật",
    "tasks": [
      {"code": "DES-01", "name": "Thiết kế Concept Kiến trúc", "duration": 20},
      {"code": "DES-02", "name": "Dựng mô hình BIM LOD 300", "duration": 45},
      {"code": "DES-03", "name": "Phối hợp va chạm (Clash Detection)", "duration": 10}
    ]
  },
  {
    "name": "3. Thi công",
    "description": "Giai đoạn thực hiện tại công trường",
    "tasks": [
      {"code": "CON-01", "name": "Shop Drawing Móng", "duration": 15},
      {"code": "CON-02", "name": "Shop Drawing Thân", "duration": 30}
    ]
  }
]'::jsonb, 
'Áp dụng cho các dự án chung cư, văn phòng quy mô vừa.'
);

-- ============================================
-- 2. QUALITY CHECKLISTS
-- ============================================
INSERT INTO quality_checklists (code, name, type, items) VALUES
('QC-STR-COL', 'Kiểm tra mô hình Cột (Structural Column)', 'Kết cấu', 
'[
  {"id": "1", "text": "Đúng vị trí lưới trục (Grids)", "isMandatory": true, "guidance": "Sai lệch tối đa 5mm"},
  {"id": "2", "text": "Đúng tiết diện thiết kế", "isMandatory": true},
  {"id": "3", "text": "Vật liệu (Material) chính xác", "isMandatory": true},
  {"id": "4", "text": "Top/Base Constraint đúng tầng", "isMandatory": false}
]'::jsonb
),
('QC-ARC-WALL', 'Kiểm tra mô hình Tường (Architectural Wall)', 'Kiến trúc', 
'[
  {"id": "1", "text": "Đúng loại tường (Wall Type)", "isMandatory": true},
  {"id": "2", "text": "Join tường chính xác (không overlap)", "isMandatory": true},
  {"id": "3", "text": "Chiều cao (Unconnected Height) đúng", "isMandatory": true},
  {"id": "4", "text": "Đã gán tham biến Room Bounding", "isMandatory": false}
]'::jsonb
);

-- ============================================
-- 3. SOP STEPS
-- ============================================
INSERT INTO sop_steps (code, name, description, steps) VALUES
('SOP-BIM-01', 'Quy trình Khởi tạo File Central', 'Hướng dẫn tạo file trung tâm cho dự án mới', 
'[
  {"step": 1, "description": "Chọn Template file theo bộ môn (Kiến trúc/Kết cấu/MEP)", "role": "BIM Manager", "estimatedTime": "15m"},
  {"step": 2, "description": "Thiết lập đơn vị (Project Units)", "role": "BIM Coordinator", "estimatedTime": "10m"},
  {"step": 3, "description": "Thiết lập tọa độ (Project Base Point & Survey Point)", "role": "BIM key", "estimatedTime": "30m"},
  {"step": 4, "description": "Tạo Worksets chuẩn (Shared Levels and Grids, Work in Progress)", "role": "BIM Coordinator", "estimatedTime": "20m"},
  {"step": 5, "description": "Lưu file thành Central Model và phân quyền", "role": "BIM Manager", "estimatedTime": "15m"}
]'::jsonb
),
('SOP-GEN-01', 'Quy trình Phê duyệt Bản vẽ', 'Quy trình trình ký hồ sơ thiết kế', 
'[
  {"step": 1, "description": "Họa viên in nháp và tự kiểm tra (Self-Check)", "role": "Staff", "estimatedTime": "2h"},
  {"step": 2, "description": "Trưởng nhóm kiểm tra kỹ thuật (Checklist QC)", "role": "Leader", "estimatedTime": "4h"},
  {"step": 3, "description": "Chủ trì bộ môn ký duyệt", "role": "Manager", "estimatedTime": "2h"},
  {"step": 4, "description": "Giám đốc Trung tâm ký phát hành", "role": "Director", "estimatedTime": "2h"}
]'::jsonb
);

-- ============================================
-- 4. LESSONS LEARNED
-- ============================================
INSERT INTO lessons_learned (title, category, tags, content, solution, author) 
SELECT 
  'Lỗi Circular Chain of References trong Revit', 
  'Lỗi kỹ thuật', 
  ARRAY['Revit', 'Error', 'Family'], 
  'Gặp lỗi khi load family cửa vào dự án, báo lỗi Reference vòng lặp.', 
  'Kiểm tra lại công thức trong Family, đảm bảo không có tham biến A phụ thuộc B và B phụ thuộc ngược lại A. Xóa các biến thừa.',
  id 
FROM employees WHERE email = 'hung.luong@cic.com.vn' LIMIT 1;

INSERT INTO lessons_learned (title, category, tags, content, solution, author) 
SELECT 
  'Kinh nghiệm phối hợp trục toạ độ với bộ môn M&E', 
  'Phối hợp', 
  ARRAY['Coordinate', 'MEP', 'Link'], 
  'File M&E khi link vào hay bị lệch cao độ do dùng Relative Base Point.', 
  'Thống nhất sử dụng Shared Coordinates ngay từ đầu dự án (SOP-BIM-01).',
  id 
FROM employees WHERE email = 'nhiem.nguyen@cic.com.vn' LIMIT 1;

-- Done!
SELECT 'EDT Core seed data inserted successfully!' as message;
