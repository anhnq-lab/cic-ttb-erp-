-- ============================================
-- Migration 129: Seed Policy Data
-- Purpose: Chuyển dữ liệu quy chế từ hardcoded sang database
-- ============================================

INSERT INTO public.organization_policies (section_id, title, icon, content, version, effective_date)
VALUES 
('versions', 'Quản lý phiên bản', 'History', '[
    {
        "id": "versions-table",
        "title": "Lịch sử cập nhật tài liệu",
        "tableData": {
            "headers": ["STT", "Số phiên bản", "Ngày ban hành", "Nội dung cập nhật"],
            "rows": [
                ["01", "P01", "02/09/2024", "Phát hành lần đầu"],
                ["02", "P02", "31/12/2024 (DK)", "Cập nhật thêm một số mục:\n+ Tuyển dụng\n+ Một số quy định chi tiết hơn cho Bimcollab, ClickUp\n+ Bổ sung thêm quy định về trang phục và vệ sinh\n+ Sửa đổi, cập nhật một số điều chưa hợp lý từ phiên bản 01"],
                ["03", "P03", "06/01/2026", "Cập nhật một số nội dung:\n+ Sơ đồ tổ chức\n+ Quy trình triển khai Dự án & Ma trận Raci\n+ Phân chia tiền thưởng cuối năm"]
            ]
        }
    }
]'::jsonb, 'P03', '2026-01-06'),

('intro', 'Lời nói đầu & Tổng quan', 'Info', '[
    {
        "id": "foreword",
        "title": "Lời nói đầu",
        "text": "Trong bối cảnh ngành xây dựng và công nghệ đang không ngừng phát triển, việc ứng dụng các công nghệ tiên tiến như BIM (Building Information Modeling) và Digital Twins đã trở thành xu thế tất yếu..."
    },
    {
        "id": "01",
        "title": "01. Phạm vi tài liệu",
        "text": "Tài liệu này xác định cơ chế hoạt động của Trung tâm BIM và Digital Twins tại Công ty..."
    }
]'::jsonb, 'P03', '2026-01-01'),

('10', '10. Chức năng nhiệm vụ chung', 'GitCommit', '[
    {
        "id": "10.00",
        "title": "10.00. Sơ đồ tổ chức",
        "text": "10.00.100. Sơ đồ tổ chức Trung tâm BIM và Digital Twin như sau:",
        "isInteractiveOrgChart": true
    },
    {
        "id": "10.10",
        "title": "10.10. Giám đốc Trung tâm (GĐTT)",
        "subItems": [
            "10.10.100. Báo cáo công việc hàng tháng, hàng tuần lên ban giám đốc Công ty",
            "10.10.110. Quản lý các công việc chung của trung tâm"
        ]
    }
]'::jsonb, 'P03', '2026-01-01'),

('raci', '25. Quy trình Dự án & Ma trận RACI', 'Users', '[
    {
        "id": "raci-state",
        "title": "25.10. Quy trình 25.10 (Vốn Ngân Sách)",
        "text": "R: Bắt buộc | A: Phê duyệt | C: Tham vấn | I: Được thông báo",
        "isRaciMatrix": true
    },
    {
        "id": "raci-non-state",
        "title": "25.20. Quy trình 25.20 (Vốn Ngoài Ngân Sách)",
        "text": "R: Bắt buộc | A: Phê duyệt | C: Tham vấn | I: Được thông báo",
        "isRaciMatrix": true
    }
]'::jsonb, 'P03', '2026-01-01');
