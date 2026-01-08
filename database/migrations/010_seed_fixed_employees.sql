/*
 Migration 010: Seed Fixed Employees matching constants.ts
 Purpose: Ensure DB Employee IDs match Frontend Constants (NV001, etc.) to fix FK errors
*/

-- 1. Cleaup specific employees if they exist with different IDs (via code conflict)
DELETE FROM public.employees;

-- 2. Insert Employees from constants.ts with unique emails
INSERT INTO public.employees (id, code, name, role, department, email, phone, avatar, status, join_date, dob, degree, certificates, graduation_year, profile_url)
VALUES
('NV001', 'NV001', 'Đặng Đức Hà', 'Chủ tịch HĐQT', 'Ban Giám Đốc', 'dangducha@cic.com.vn', '', 'https://ui-avatars.com/api/?name=%C4%90%E1%BA%B7ng%20%C4%90%E1%BB%A9c%20H%C3%A0&background=random&color=fff&size=150', 'Chính thức', '2010-01-01', '1976-01-11', 'Kỹ sư tin học xây dựng', 'Revit Structure', '1997', 'https://drive.google.com/open?id=1KucjjACozmzNTJ9JCSzWNc7aBUQsL2c4'),
('NV002', 'NV002', 'Nguyễn Hoàng Hà', 'Tổng Giám đốc', 'Ban Giám Đốc', 'hoangha@cic.com.vn', '', 'Nhanvien_Images/TGĐ.Anh.121313.jpg', 'Chính thức', '2015-01-15', '2025-07-05', NULL, NULL, '2003', NULL),
('NV003', 'NV003', 'Lương Thanh Hưng', 'Phó tổng giám đốc', 'Ban Giám Đốc', 'hunglt83@gmail.com', '0886916666', 'Nhanvien_Images/NV001.Anh.041800.jpg', 'Chính thức', '2016-01-01', '1983-09-25', 'Kỹ sư tin học xây dựng', 'Revit Structure, BIM Manager', '2007', 'https://drive.google.com/open?id=1jIToxWRlmAzDKLcOW_WhoGwDd9MVkdxk'),
('NV006', 'NV006', 'Trần Hữu Hải', 'Giám đốc TT BIM&Digital Twin', 'Ban Giám Đốc', 'haith@cic.com.vn', '0353582757', 'Nhanvien_Images/NV004.Anh.041830.jpg', 'Chính thức', '2017-01-01', '1987-06-21', 'Kỹ sư Kinh tế xây dựng', 'Revit, BIM Coordinator', '2011', 'https://drive.google.com/open?id=19anClk_fw8zigSodkN4F_URDwGp3O6yK'),
('NV005', 'NV005', 'Nguyễn Đức Thành', 'Trưởng bộ phận Quản lý chất lượng (TQLCL)', 'Kỹ thuật - BIM', 'ducthanh@cic.com.vn', '', 'Nhanvien_Images/NV003.Anh.041823.jpg', 'Chính thức', '2019-01-01', '1996-08-20', 'Kỹ sư xây dựng', 'Revit, Civil 3D', '2019', 'https://drive.google.com/open?id=1qP4nV6p4MaJArBsQYvZwJervVO6z8P7Y'),
('NV004', 'NV004', 'Nguyễn Quốc Anh', 'Trưởng bộ phận xúc tiến dự án (TXTDA)', 'Kinh doanh', 'anhnq@cic.com.vn', '0943.431.591', 'Nhanvien_Images/NV002.Anh.041814.jpg', 'Chính thức', '2015-01-01', '1991-08-20', 'Kỹ sư xây dựng, Thạc sỹ', 'Chứng chỉ giám sát, BIM', '2014', NULL),
('NV007', 'NV007', 'Đông Quỳnh', 'Trưởng bộ phận Admin (TAM)', 'Hành chính - Nhân sự', 'quynhdd@cic.com.vn', '', 'Nhanvien_Images/604ff785.Anh.041838.jpg', 'Chính thức', '2020-01-01', '2025-07-11', NULL, NULL, '2020', NULL),
('NV008', 'NV008', 'Đặng Trung Hiếu', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - BIM', 'hieudt@cic.com.vn', '', 'https://ui-avatars.com/api/?name=%C4%90%E1%BA%B7ng+Trung+Hi%E1%BA%BFu', 'Chính thức', '2021-01-01', '1996-01-10', 'Kỹ sư Tin học xây dựng', 'Revit Structure, BIM', '2021', 'https://drive.google.com/open?id=1KQE0Jq0F9g4a-UjLIDgzsOUgjTn9yfn0'),
('NV009', 'NV009', 'Đặng Văn Quang', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - MEP', 'quangdv@cic.com.vn', '', 'https://ui-avatars.com/api/?name=%C4%90%E1%BA%B7ng+V%C4%83n+Quang', 'Chính thức', '2020-01-01', '1998-05-10', 'Kỹ sư công nghệ nhiệt', 'Revit MEP', '2020', 'https://drive.google.com/open?id=1Y6KC12luTKsN8AxV5UtQddhFbVPGr6d5'),
('NV010', 'NV010', 'Nguyễn Huỳnh Huy', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - MEP', 'huynguyen@cic.com.vn', '', 'https://ui-avatars.com/api/?name=Nguy%E1%BB%85n+Hu%E1%BB%B3nh+Huy', 'Chính thức', '2018-01-01', '1996-03-05', 'Kỹ sư điện', 'Revit MEP', '2018', 'https://drive.google.com/open?id=1ZLnlnsr2fDLPftbNIpSTPFCRflotaIKR'),
('NV011', 'NV011', 'Trần Đức Hoàng', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Kết cấu', 'hoangtd@cic.com.vn', '', 'https://ui-avatars.com/api/?name=Tr%E1%BA%A7n+%C4%90%E1%BB%A9c+Ho%C3%A0ng', 'Chính thức', '2021-01-01', '1998-05-09', 'Kĩ sư xây dựng', 'Revit Structure', '2021', 'https://drive.google.com/open?id=1GveeaS6J1pdGpBAlB9L_rJqeStNXQzZ7'),
('NV012', 'NV012', 'Nguyễn Bá Nhiệm', 'Phó giám đốc trung tâm (Trưởng bộ môn Cơ điện)', 'Kỹ thuật - MEP', 'banhiem@cic.com.vn', '', 'https://ui-avatars.com/api/?name=Nguy%E1%BB%85n+B%C3%A1+Nhi%E1%BB%87m', 'Chính thức', '2015-01-01', '1989-01-20', 'Kĩ sư cấp thoát nước', 'Revit MEP', '2015', 'https://drive.google.com/open?id=14Nua_szhLJyEnvB7l4wUt7WvJivE0RLj'),
('NV013', 'NV013', 'Hà Văn Đức', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - MEP', 'duchv@cic.com.vn', '', 'https://ui-avatars.com/api/?name=H%C3%A0+V%C4%83n+%C4%90%E1%BB%A9c', 'Chính thức', '2020-01-01', '1997-07-30', 'Kỹ sư Công nghệ Điện', 'Revit MEP', '2020', 'https://drive.google.com/open?id=1Bx8PcjkIX-tUGVub-bAd4MKVF5Zh7Nuh'),
('NV014', 'NV014', 'Phạm Việt Anh', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - MEP', 'phamvietanh@cic.com.vn', '', 'https://ui-avatars.com/api/?name=Ph%E1%BA%A1m+Vi%E1%BB%87t+Anh', 'Chính thức', '2014-01-01', NULL, 'Kỹ sư Hệ thống điện', 'Revit MEP', '2014', 'https://drive.google.com/open?id=144ZLVbMaWQt6OVxeLQbUMDMS2b2xlVmn'),
('NV015', 'NV015', 'Vũ Văn Hòa', 'Trưởng bộ môn Kiến trúc + Kết cấu', 'Kỹ thuật - Kiến trúc', 'vanhoa@cic.com.vn', '', 'https://ui-avatars.com/api/?name=V%C5%A9+V%C4%83n+H%C3%B2a', 'Chính thức', '2018-01-01', '1995-10-16', 'Kỹ sư Kỹ thuật', 'Revit, BIM', '2018', 'https://drive.google.com/open?id=1vCAWucOZsQy_QT-BTqt4sOc6CMCVbX7y'),
('NV016', 'NV016', 'Trần Văn Nghĩa', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Xây dựng', 'nghiantv@cic.com.vn', '', 'https://ui-avatars.com/api/?name=Tr%E1%BA%A7n+V%C4%83n+Ngh%C4%A9a', 'Chính thức', '2020-01-01', '1997-07-18', 'Kỹ sư Công trình', 'Revit', '2020', 'https://drive.google.com/open?id=1cAfe8O7oKFaUdHvhd6XX4pyiw5kYkCsi'),
('NV017', 'NV017', 'Vương Chí Lập', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Điện', 'lapvc@cic.com.vn', '', 'https://ui-avatars.com/api/?name=V%C6%B0%C6%A1ng+Ch%C3%AD+L%E1%BA%ADp', 'Chính thức', '2017-01-01', '1994-09-25', 'Kỹ sư Công nghệ điện', 'BIM', '2017', 'https://drive.google.com/open?id=18r9eJEYk4C7r9Z4_pq2J9u6w7vVcejeQ'),
('NV018', 'NV018', 'Hoàng Xuân Hải', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - MEP', 'nv018@cic.mock', '', 'https://ui-avatars.com/api/?name=Ho%C3%A0ng+Xu%C3%A2n+H%E1%BA%A3i', 'Chính thức', '2005-01-01', '1981-01-22', 'Kỹ sư Điện', 'Revit MEP', '2005', 'https://drive.google.com/open?id=18rds-oEeJnqvodOyb7fEy6zdbuaqacIV'),
('NV019', 'NV019', 'Vũ Ngọc Thủy', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Kiến trúc', 'nv019@cic.mock', '', 'https://ui-avatars.com/api/?name=V%C5%A9+Ng%E1%BB%8Dc+Th%E1%BB%A7y', 'Chính thức', '2003-01-01', '1997-03-04', 'Kiến trúc sư', 'Revit, BIM', '2003', 'https://drive.google.com/open?id=1vmt64hpdGRjH56obUy8a_k5NAVrx96yi'),
('NV020', 'NV020', 'Nhữ Thị Thu Hiền', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Xây dựng', 'nv020@cic.mock', '', 'https://ui-avatars.com/api/?name=Nh%E1%BB%AF+Th%E1%BB%8B+Thu+Hi%E1%BB%81n', 'Chính thức', '2006-01-01', '1981-09-15', 'Kỹ sư xây dựng', 'Revit, BIM', '2006', 'https://drive.google.com/open?id=14sECML3uW1usolfUUYcj3H_bFUwSQtwB'),
('NV021', 'NV021', 'Vũ Hương Thảo', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Kiến trúc', 'nv021@cic.mock', '', 'https://ui-avatars.com/api/?name=V%C5%A9+H%C6%B0%C6%A1ng+Th%E1%BA%A3o', 'Chính thức', '2001-01-01', '1978-04-19', 'Kiến trúc sư', 'Revit, BIM', '2001', 'https://drive.google.com/open?id=1BoFAE5JQ_7UT15f2Xd9ftarHRVjOXw7i'),
('NV022', 'NV022', 'Trần Thế Lực', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Xây dựng', 'nv022@cic.mock', '', 'https://ui-avatars.com/api/?name=Tr%E1%BA%A7n+Th%E1%BA%BF+L%E1%BB%B1c', 'Chính thức', '1999-01-01', '1975-10-12', 'Kỹ sư xây dựng', 'Revit, BIM', '1999', 'https://drive.google.com/open?id=1kWIekCWmOvt0o411HHVaPUGn2cVhUrAt'),
('c4af4da7', 'c4af4da7', 'Đinh Trần Tuấn', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Tin học', 'c4af4da7@cic.mock', '', 'https://ui-avatars.com/api/?name=%C4%90inh+Tr%E1%BA%A7n+Tu%E1%BA%A5n', 'Chính thức', '2011-01-01', '1984-08-05', 'Kỹ sư tin học', 'Revit, BIM', '2011', 'https://drive.google.com/open?id=1sZ5YFZldfhE2JHp5qH4WlW2USdJAlxFS'),
('d0cd130a', 'd0cd130a', 'Thái Minh Đạt', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - BIM', 'd0cd130a@cic.mock', '', 'https://ui-avatars.com/api/?name=Th%C3%A1i+Minh+%C4%90%E1%BA%A1t', 'Chính thức', '2025-01-01', '2025-07-22', NULL, NULL, NULL, NULL),
('8f33f228', '8f33f228', 'Đinh Huỳnh Thái', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - Xây dựng', '8f33f228@cic.mock', '', 'https://ui-avatars.com/api/?name=%C4%90inh+Hu%E1%BB%B3nh+Th%C3%A1i', 'Chính thức', '2011-01-01', '2025-07-23', 'Kỹ sư Xây dựng', 'Revit', '2011', 'https://drive.google.com/open?id=1ArQL-YJGx7h5PHkkdk8lQQ_vbKDIp7K4'),
('a488bf2f', 'a488bf2f', 'Vũ Thị Thu', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - BIM', 'thuvt@cic.com.vn', '', 'NhanSu_Images/a488bf2f.image.025011.jpg', 'Chính thức', '2025-01-01', '2025-07-28', NULL, NULL, NULL, NULL),
('5bb21db6', '5bb21db6', 'Ninh Văn Bình', 'Thành viên bộ môn (TVBM)', 'Kỹ thuật - BIM', '5bb21db6@cic.mock', '', 'https://ui-avatars.com/api/?name=Ninh+V%C4%83n+B%C3%ACnh', 'Chính thức', '2025-01-01', '2025-09-18', NULL, NULL, NULL, NULL)
ON CONFLICT (code) DO UPDATE SET
    id = EXCLUDED.id,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    avatar = EXCLUDED.avatar,
    status = EXCLUDED.status,
    join_date = EXCLUDED.join_date,
    dob = EXCLUDED.dob,
    degree = EXCLUDED.degree,
    certificates = EXCLUDED.certificates,
    graduation_year = EXCLUDED.graduation_year,
    profile_url = EXCLUDED.profile_url;
