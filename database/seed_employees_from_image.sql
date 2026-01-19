-- SQL Script to seed employees from image data
-- Target table: public.employees

-- 1. Ensure table has required columns (adding if missing)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'employees' AND column_name = 'dob') THEN
        ALTER TABLE public.employees ADD COLUMN dob DATE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'employees' AND column_name = 'degree') THEN
        ALTER TABLE public.employees ADD COLUMN degree TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'employees' AND column_name = 'certificates') THEN
        ALTER TABLE public.employees ADD COLUMN certificates TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'employees' AND column_name = 'graduation_year') THEN
        ALTER TABLE public.employees ADD COLUMN graduation_year TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'employees' AND column_name = 'join_date') THEN
        ALTER TABLE public.employees ADD COLUMN join_date DATE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'employees' AND column_name = 'profile_url') THEN
        ALTER TABLE public.employees ADD COLUMN profile_url TEXT;
    END IF;
END $$;

-- 2. Insert Data
INSERT INTO public.employees (
    id, code, name, role, department, email, phone, status, dob, degree, certificates, graduation_year, join_date
)
VALUES
('NV001', 'NV001', 'Đặng Đức Hà', 'Chủ tịch HĐQT', 'Ban Giám Đốc', 'dangducha@cic.com.vn', NULL, 'Chính thức', '1976-01-11', 'Kỹ sư tin học xây dựng công trình - Trường Đại học Xây dựng Hà Nội - Năm 1997', 'Chứng nhận khóa học Revit Structure – Viện Tin học xây dựng – Năm 2011', '1997', '2010-01-01'),
('NV002', 'NV002', 'Nguyễn Hoàng Hà', 'Tổng Giám đốc', 'Ban Giám Đốc', 'hoangha@cic.com.vn', NULL, 'Chính thức', '2025-07-05', NULL, NULL, '2003', '2015-01-15'),
('NV003', 'NV003', 'Lương Thanh Hưng', 'Phó tổng giám đốc', 'Ban Giám Đốc', 'hunglt83@gmail.com', '0886916666', 'Chính thức', '1983-09-25', 'Kỹ sư Tin học xây dựng & Quản lý DA - Trường Đại học Xây dựng – Năm 2007', 'Chứng nhận khóa học Revit Structure – Viện Tin học xây dựng – Năm 2011', '2007', '2016-01-01'),
('NV006', 'NV006', 'Trần Hữu Hải', 'Giám đốc TT BIM&Digital Twin', 'Ban Giám Đốc', 'haith@cic.com.vn', '0353582757', 'Chính thức', '1987-06-21', 'Kỹ sư Kinh tế xây dựng - Đại học Kiến trúc Hà Nội - Năm 2011', 'Chứng nhận khóa học Revit Architecture & Revit Structure – Viện Tin học xây dựng – Năm 2011', '2011', '2017-01-01'),
('NV005', 'NV005', 'Nguyễn Đức Thành', 'Trưởng bộ phận Quản lý chất lượng (TQLCL)', 'Kỹ thuật - BIM', 'ducthanh@cic.com.vn', NULL, 'Chính thức', '1996-08-20', 'Kỹ sư xây dựng - Đại học Kiến trúc Hà Nội – Năm 2019', 'Chứng nhận khóa học Revit Structure – Viện Tin học xây dựng – Năm 2019', '2019', '2019-01-01'),
('NV004', 'NV004', 'Nguyễn Quốc Anh', 'Trưởng bộ phận xúc tiến dự án (TXTDA)', 'Kinh doanh', 'anhnq@cic.com.vn', '0943.431.591', 'Chính thức', '1991-08-20', 'Kỹ sư xây dựng - Đại học Xây dựng; Thạc sỹ Quản lý xây dựng', 'Chứng chỉ giám sát công tác xây dựng và hoàn thiện công trình', '2014', '2015-01-01'),
('NV007', 'NV007', 'Đông Quỳnh', 'Trưởng bộ phận Admin (TAM)', 'Hành chính - Nhân sự', 'quynhdd@cic.com.vn', NULL, 'Chính thức', '2025-07-11', NULL, NULL, '2020', '2020-01-01'),
('NV008', 'NV008', 'Đặng Trung Hiếu', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - BIM', 'hieudt@cic.com.vn', NULL, 'Chính thức', '1996-01-10', 'Kỹ sư Tin học xây dựng – Trường Đại học Xây dựng – Năm 2021', 'Chứng nhận khóa học Revit Structure - Viện Tin học xây dựng – Năm 2021', '2021', '2021-01-01'),
('NV009', 'NV009', 'Đặng Văn Quang', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - MEP', 'quangdv@cic.com.vn', NULL, 'Chính thức', '1998-05-10', 'Kỹ sư công nghệ kỹ thuật nhiệt – Trường Đại học Công nghệ Hà Nội – Năm 2020', 'Chứng nhận khóa học Revit MEP – Viện Tin học xây dựng – Năm 2020', '2020', '2020-01-01'),
('NV010', 'NV010', 'Nguyễn Huỳnh Huy', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - MEP', 'huynguyen@cic.com.vn', NULL, 'Chính thức', '1996-03-05', 'Kỹ sư Điện (Hệ thống điện) – Đại học Bách Khoa TP. Hồ Chí Minh – Năm 2018', 'Chứng nhận khóa học Revit MEP – Viện Tin học xây dựng – Năm 2023', '2018', '2018-01-01'),
('NV011', 'NV011', 'Trần Đức Hoàng', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Kết cấu', 'hoangtd@cic.com.vn', NULL, 'Chính thức', '1998-05-09', 'Kỹ sư xây dựng – Trường Đại học Xây dựng – Năm 2021', 'Chứng nhận khóa học Revit Structure – Viện Tin học xây dựng – Năm 2021', '2021', '2021-01-01'),
('NV012', 'NV012', 'Nguyễn Bá Nhiệm', 'Phó giám đốc trung tâm (Trưởng bộ môn Cơ điện)', 'Kỹ thuật - MEP', 'banhiem@cic.com.vn', NULL, 'Chính thức', '1989-01-20', 'Kỹ sư cấp thoát nước – Trường Đại học Xây dựng – Năm 2015', 'Chứng nhận khóa học Revit MEP – Viện Tin học xây dựng – Năm 2017', '2015', '2015-01-01'),
('NV013', 'NV013', 'Hà Văn Đức', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - MEP', 'duchv@cic.com.vn', NULL, 'Chính thức', '1997-07-30', 'Kỹ sư Công nghệ Điện – Trường Đại học Công nghiệp Hà Nội – Năm 2020', 'Chứng nhận khóa học Revit MEP – Viện Tin học xây dựng – Năm 2019', '2020', '2020-01-01'),
('NV014', 'NV014', 'Phạm Việt Anh', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - MEP', 'phamvietanh@cic.com.vn', NULL, 'Chính thức', NULL, 'Kỹ sư Hệ thống điện', 'Revit MEP, BIMCollab Academy', '2014', '2014-01-01'),
('NV015', 'NV015', 'Vũ Văn Hòa', 'Trưởng bộ môn Kiến trúc + Kết cấu', 'Kỹ thuật - Kiến trúc', 'vanhoa@cic.com.vn', NULL, 'Chính thức', '1995-10-16', 'Kỹ sư Kỹ thuật công trình xây dựng – Trường Đại học Xây dựng – Năm 2018', 'Chứng nhận khóa học Revit Architecture & Revit Structure – Viện Tin học xây dựng – Năm 2018', '2018', '2018-01-01'),
('NV016', 'NV016', 'Trần Văn Nghĩa', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Xây dựng', 'nghiantv@cic.com.vn', NULL, 'Chính thức', '1997-07-18', 'Kỹ sư Công trình – Trường Đại học Xây dựng – Năm 2020', 'Chứng nhận khóa học Revit Architecture – Viện Tin học xây dựng – Năm 2020', '2020', '2020-01-01'),
('NV017', 'NV017', 'Vương Chí Lập', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Điện', 'lapvc@cic.com.vn', NULL, 'Chính thức', '1994-09-25', 'Kỹ sư Công nghệ kỹ thuật điện – Trường Đại học Sư phạm Kỹ thuật Hưng Yên – Năm 2017', 'Chứng nhận khóa học BIM do BIMCollab Academy cấp', '2017', '2017-01-01'),
('NV018', 'NV018', 'Hoàng Xuân Hải', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - MEP', NULL, NULL, 'Chính thức', '1981-01-22', 'Kỹ sư Điện tử & Cung cấp điện – Trường Đại học Sư phạm Kỹ thuật TP.HCM – Năm 2005', 'Chứng nhận khóa học Revit MEP – Viện Tin học xây dựng – Năm 2019', '2005', '2005-01-01'),
('NV019', 'NV019', 'Vũ Ngọc Thủy', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Kiến trúc', NULL, NULL, 'Chính thức', '1997-03-04', 'Kiến trúc sư – Đại học Kiến trúc Hà Nội – Năm 2003', 'Chứng nhận khóa học Revit Architecture – Viện Tin học xây dựng – Năm 2003', '2003', '2003-01-01'),
('NV020', 'NV020', 'Nhữ Thị Thu Hiền', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Xây dựng', NULL, NULL, 'Chính thức', '1981-09-15', 'Kỹ sư xây dựng – Học viện Kỹ thuật quân sự – Năm 2006', 'Chứng nhận khóa học Revit Structure – Viện Tin học xây dựng – Năm 2006', '2006', '2006-01-01'),
('NV021', 'NV021', 'Vũ Hương Thảo', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Kiến trúc', NULL, NULL, 'Chính thức', '1978-04-19', 'Kiến trúc sư – Trường Đại học Xây dựng – Năm 2001', 'Chứng nhận khóa học Revit Architecture – Viện Tin học xây dựng – Năm 2001', '2001', '2001-01-01'),
('NV022', 'NV022', 'Trần Thế Lực', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Xây dựng', NULL, NULL, 'Chính thức', '1975-10-12', 'Kỹ sư xây dựng – Trường Đại học Xây dựng – Năm 1999', 'Chứng nhận khóa học Revit Structure – Viện Tin học xây dựng – Năm 1999', '1999', '1999-01-01'),
('c4af4da7', 'c4af4da7', 'Đinh Trần Tuấn', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Tin học', NULL, NULL, 'Chính thức', '1984-08-05', 'Kỹ sư tin học xây dựng – Trường Đại học Xây dựng – Năm 2011', 'Chứng nhận khóa học Revit Structure – Viện Tin học xây dựng – Năm 2011', '2011', '2011-01-01'),
('d0cd130a', 'd0cd130a', 'Thái Minh Đạt', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - BIM', NULL, NULL, 'Chính thức', '2025-07-22', NULL, NULL, NULL, '2025-01-01'),
('8f33f228', '8f33f228', 'Đinh Huỳnh Thái', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Xây dựng', NULL, NULL, 'Chính thức', '2025-07-23', 'Kỹ sư Xây dựng – Trường Đại học Kiến trúc TP. Hồ Chí Minh – Năm 2011', 'Chứng nhận khóa học Revit Structure – Viện Tin học xây dựng – Năm 2011', '2011', '2011-01-01')
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    status = EXCLUDED.status,
    dob = EXCLUDED.dob,
    degree = EXCLUDED.degree,
    certificates = EXCLUDED.certificates,
    graduation_year = EXCLUDED.graduation_year,
    join_date = EXCLUDED.join_date;
