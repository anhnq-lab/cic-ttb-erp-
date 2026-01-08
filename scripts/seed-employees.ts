
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// Helper
const getAvatar = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=150`;

const EMPLOYEES = [
    {
        id: 'NV001', code: 'NV001', name: 'Đặng Đức Hà', role: 'Chủ tịch HĐQT', department: 'Ban Giám Đốc',
        email: 'dangducha@cic.com.vn', phone: '', avatar: getAvatar('Đặng Đức Hà'),
        status: 'Chính thức', joinDate: '2010-01-01', skills: ['Quản lý', 'Chiến lược'],
        dob: '11/01/1976',
        degree: 'Kỹ sư tin học xây dựng công trình – Trường Đại học Xây dựng Hà Nội – Năm 1997',
        certificates: '- Chứng nhận khóa học Revit Structure – Viện Tin học xây dựng – Năm 2022\n- Chứng nhận khóa học BIM Coodinator - Viện Tin học xây dựng – Năm 2025',
        graduationYear: '1997',
        profileUrl: 'https://drive.google.com/open?id=1KucjjACozmzNTJ9JCSzWNc7aBUQsL2c4&usp=drive_fs'
    },
    {
        id: 'NV002', code: 'NV002', name: 'Nguyễn Hoàng Hà', role: 'Tổng Giám đốc', department: 'Ban Giám Đốc',
        email: 'hoangha@cic.com.vn', phone: '', avatar: 'Nhanvien_Images/TGĐ.Anh.121313.jpg',
        status: 'Chính thức', joinDate: '2015-01-15', skills: ['Quản lý', 'Chiến lược', 'BIM'],
        dob: '05/07/2025',
        graduationYear: '2003'
    },
    {
        id: 'NV003', code: 'NV003', name: 'Lương Thanh Hưng', role: 'Phó tổng giám đốc', department: 'Ban Giám Đốc',
        email: 'hunglt83@gmail.com', phone: '0886916666', avatar: 'Nhanvien_Images/NV001.Anh.041800.jpg',
        status: 'Chính thức', joinDate: '2016-01-01', skills: ['Quản lý', 'BIM Manager'],
        dob: '25/09/1983',
        degree: 'Kỹ sư tin học xây dựng – Trường Đại học Xây dựng – Năm 2007',
        certificates: 'Chứng nhận khóa học Revit Structure – Viện Tin học xây dựng – Năm 2015\n- Chứng nhận khóa học BIM Manager – Viện Tin học xây dựng – Năm 2023\n- Chứng nhận BIM của Viện tiêu chuẩn Anh BSI cấp',
        graduationYear: '2007',
        profileUrl: 'https://drive.google.com/open?id=1jIToxWRlmAzDKLcOW_WhoGwDd9MVkdxk&usp=drive_fs'
    },
    {
        id: 'NV006', code: 'NV006', name: 'Trần Hữu Hải', role: 'Giám đốc TT BIM&Digital Twin', department: 'Ban Giám Đốc',
        email: 'haith@cic.com.vn', phone: '0353582757', avatar: 'Nhanvien_Images/NV004.Anh.041830.jpg',
        status: 'Chính thức', joinDate: '2017-01-01', skills: ['BIM', 'Digital Twin', 'Quản lý DA'],
        dob: '21/06/1987',
        degree: '- Kỹ sư Kinh tế xây dựng & Quản lý DA – Trường Đại học Bách Khoa – Đại học Đà Nẵng – Năm 2011',
        certificates: '- Chứng nhận khóa học Revit Architecture & Revit Structure – Viện Tin học xây dựng – Năm 2019\n- Chứng nhận BIM Coordinator – Viện Tin học xây dựng – Năm 2023\n- Chứng chỉ BIM do Viện Tiêu chuẩn Anh BSI cấp.',
        graduationYear: '2011',
        profileUrl: 'https://drive.google.com/open?id=19anClk_fw8zigSodkN4F_URDwGp3O6yK&usp=drive_fs'
    },
    {
        id: 'NV005', code: 'NV005', name: 'Nguyễn Đức Thành', role: 'Trưởng bộ phận Quản lý chất lượng (TQLCL)', department: 'Kỹ thuật - BIM',
        email: 'ducthanh@cic.com.vn', phone: '', avatar: 'Nhanvien_Images/NV003.Anh.041823.jpg',
        status: 'Chính thức', joinDate: '2019-01-01', skills: ['QA/QC', 'BIM', 'Civil 3D'],
        dob: '20/08/1996',
        degree: '- Kỹ sư xây dựng – Trường Đại học Kiến Trúc Hà Nội – Năm 2019',
        certificates: '- Chứng nhận khóa học Revit Structure – Viện Tin học xây dựng – Năm 2021\n- Chứng nhận khóa học Civil 3D – Công ty TNHH Giải pháp BIM Hà Nội – Năm 2022\n- Chứng nhận khóa học BIM do BIMCollab Academy cấp',
        graduationYear: '2019',
        profileUrl: 'https://drive.google.com/open?id=1qP4nV6p4MaJArBsQYvZwJervVO6z8P7Y&usp=drive_fs'
    },
    {
        id: 'NV004', code: 'NV004', name: 'Nguyễn Quốc Anh', role: 'Trưởng bộ phận xúc tiến dự án (TXTDA)', department: 'Kinh doanh',
        email: 'anhnq@cic.com.vn', phone: '0943.431.591', avatar: 'Nhanvien_Images/NV002.Anh.041814.jpg',
        status: 'Chính thức', joinDate: '2015-01-01', skills: ['Quản lý dự án', 'Kinh doanh'],
        dob: '20/08/1991',
        degree: '- Kỹ sư xây dựng DD & CN\n- Thạc sỹ Quản lý xây dựng',
        certificates: '- Chứng chỉ giám sát công tác xây dựng và hoàn thiện công trình DD&CN hạng 3.\n- Chứng chỉ thiết kế kết cấu công trình DD&CN hạng 3.\n- Chứng nhận Quản lý BIM (CIC)',
        graduationYear: '2014'
    },
    {
        id: 'NV007', code: 'NV007', name: 'Đông Quỳnh', role: 'Trưởng bộ phận Admin (TAM)', department: 'Hành chính - Nhân sự',
        email: 'quynhdd@cic.com.vn', phone: '', avatar: 'Nhanvien_Images/604ff785.Anh.041838.jpg',
        status: 'Chính thức', joinDate: '2020-01-01', skills: ['Hành chính', 'Admin'],
        dob: '11/07/2025',
        graduationYear: '2020'
    },
    {
        id: 'NV008', code: 'NV008', name: 'Đặng Trung Hiếu', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - BIM',
        email: 'hieudt@cic.com.vn', phone: '', avatar: getAvatar('Đặng Trung Hiếu'),
        status: 'Chính thức', joinDate: '2021-01-01', skills: ['BIM', 'Revit'],
        dob: '10/01/1996',
        degree: '- Kỹ sư Tin học xây dựng – Trường Đại học Xây dựng Hà Nội – Năm 2021',
        certificates: '- Chứng nhận khóa học Revit Structure– Viện Tin học xây dựng – Năm 2023\n- Chứng nhận khóa học BIM do BIMCollab Academy cấp',
        graduationYear: '2021',
        profileUrl: 'https://drive.google.com/open?id=1KQE0Jq0F9g4a-UjLIDgzsOUgjTn9yfn0&usp=drive_fs'
    },
    {
        id: 'NV009', code: 'NV009', name: 'Đặng Văn Quang', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - MEP',
        email: 'quangdv@cic.com.vn', phone: '', avatar: getAvatar('Đặng Văn Quang'),
        status: 'Chính thức', joinDate: '2020-01-01', skills: ['MEP', 'Revit'],
        dob: '10/05/1998',
        degree: '- Kỹ sư công nghệ kỹ thuật nhiệt – Trường Đại học Công Nghiệp Hà Nội – Năm 2020',
        certificates: '- Chứng nhận khóa học Revit MEP – Viện Tin học xây dựng – Năm 2023\n- Chứng nhận khóa học BIM do BIMCollab Academy cấp',
        graduationYear: '2020',
        profileUrl: 'https://drive.google.com/open?id=1Y6KC12luTKsN8AxV5UtQddhFbVPGr6d5&usp=drive_fs'
    },
    {
        id: 'NV010', code: 'NV010', name: 'Nguyễn Huỳnh Huy', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - MEP',
        email: 'huynguyen@cic.com.vn', phone: '', avatar: getAvatar('Nguyễn Huỳnh Huy'),
        status: 'Chính thức', joinDate: '2018-01-01', skills: ['Điện', 'Điện tử', 'Revit MEP'],
        dob: '05/03/1996',
        degree: '- Kỹ sư Công nghệ kỹ thuật điện, điện tử- Trường Đại học Sư phạm kỹ thuật TP. Hồ Chí Minh – Năm 2018',
        certificates: '- Chứng nhận khóa học Revit MEP– Viện Tin học xây dựng – Năm 2023\n- Chứng nhận khóa học BIM do BIMCollab Academy cấp',
        graduationYear: '2018',
        profileUrl: 'https://drive.google.com/open?id=1ZLnlnsr2fDLPftbNIpSTPFCRflotaIKR&usp=drive_fs'
    },
    {
        id: 'NV011', code: 'NV011', name: 'Trần Đức Hoàng', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - Kết cấu',
        email: 'hoangtd@cic.com.vn', phone: '', avatar: getAvatar('Trần Đức Hoàng'),
        status: 'Chính thức', joinDate: '2021-01-01', skills: ['Kết cấu', 'Revit Structure'],
        dob: '09/05/1998',
        degree: '- Kĩ sư xây dựng – Trường Đại học Kiến trúc Hà Nội – Năm 2021',
        certificates: '- Chứng nhận khóa học Revit Structure– Viện Tin học xây dựng – Năm 2023\n- Chứng nhận khóa học BIM do BIMCollab Academy cấp',
        graduationYear: '2021',
        profileUrl: 'https://drive.google.com/open?id=1GveeaS6J1pdGpBAlB9L_rJqeStNXQzZ7&usp=drive_fs'
    },
    {
        id: 'NV012', code: 'NV012', name: 'Nguyễn Bá Nhiệm', role: 'Phó giám đốc trung tâm (Trưởng bộ môn Cơ điện)', department: 'Kỹ thuật - MEP',
        email: 'banhiem@cic.com.vn', phone: '', avatar: getAvatar('Nguyễn Bá Nhiệm'),
        status: 'Chính thức', joinDate: '2015-01-01', skills: ['MEP', 'Quản lý', 'BIM Coordinator'],
        dob: '20/01/1989',
        degree: '- Kĩ sư cấp thoát nước – Trường Đại học Xây dựng – Năm 2015',
        certificates: '- Chứng nhận khóa học Revit MEP – Viện Tin học xây dựng – Năm 2017\n- Chứng nhận BIM Coordinator – Viện Tin học xây dựng – Năm 2023',
        graduationYear: '2015',
        profileUrl: 'https://drive.google.com/open?id=14Nua_szhLJyEnvB7l4wUt7WvJivE0RLj&usp=drive_fs'
    },
    {
        id: 'NV013', code: 'NV013', name: 'Hà Văn Đức', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - MEP',
        email: 'duchv@cic.com.vn', phone: '', avatar: getAvatar('Hà Văn Đức'),
        status: 'Chính thức', joinDate: '2020-01-01', skills: ['Điện', 'Revit MEP'],
        dob: '30/07/1997',
        degree: '- Kỹ sư Công nghệ Điện, Điện tử – Trường Đại học Điện Lực Hà Nội – Năm 2020',
        certificates: '- Chứng nhận khóa học Revit MEP – Viện Tin học xây dựng – Năm 2019\n- Chứng nhận khóa học BIM do BIMCollab Academy cấp',
        graduationYear: '2020',
        profileUrl: 'https://drive.google.com/open?id=1Bx8PcjkIX-tUGVub-bAd4MKVF5Zh7Nuh&usp=drive_fs'
    },
    {
        id: 'NV014', code: 'NV014', name: 'Phạm Việt Anh', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - MEP',
        email: 'phamvietanh@cic.com.vn', phone: '', avatar: getAvatar('Phạm Việt Anh'),
        status: 'Chính thức', joinDate: '2014-01-01', skills: ['Điện', 'Revit MEP'],
        degree: 'Kỹ sư Hệ thống điện',
        certificates: 'Revit MEP, BIMCollab Academy',
        graduationYear: '2014',
        profileUrl: 'https://drive.google.com/open?id=144ZLVbMaWQt6OVxeLQbUMDMS2b2xlVmn&usp=drive_fs'
    },
    {
        id: 'NV015', code: 'NV015', name: 'Vũ Văn Hòa', role: 'Trưởng bộ môn Kiến trúc + Kết cấu', department: 'Kỹ thuật - Kiến trúc',
        email: 'vanhoa@cic.com.vn', phone: '', avatar: getAvatar('Vũ Văn Hòa'),
        status: 'Chính thức', joinDate: '2018-01-01', skills: ['Kiến trúc', 'Kết cấu', 'BIM Coordinator'],
        dob: '16/10/1995',
        degree: '- Kỹ sư Kỹ thuật công trình Xây dựng – Trường Đại học Xây dựng – Năm 2018',
        certificates: '- Chứng nhận khóa học Revit Architecture & Revit Structure – Viện Tin học xây dựng – Năm 2020\n- Chứng nhận BIM Coordinator – Viện Tin học xây dựng – Năm 2023',
        graduationYear: '2018',
        profileUrl: 'https://drive.google.com/open?id=1vCAWucOZsQy_QT-BTqt4sOc6CMCVbX7y&usp=drive_fs'
    },
    {
        id: 'NV016', code: 'NV016', name: 'Trần Văn Nghĩa', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - Xây dựng',
        email: 'nghiantv@cic.com.vn', phone: '', avatar: getAvatar('Trần Văn Nghĩa'),
        status: 'Chính thức', joinDate: '2020-01-01', skills: ['Xây dựng', 'Revit Architecture'],
        dob: '18/07/1997',
        degree: '- Kỹ sư Công trình Xây dựng – Trường Đại học Kiến Trúc Hà Nội – Năm 2020',
        certificates: '- Chứng nhận khóa học Revit Architecture – Viện Tin học xây dựng – Năm 2022',
        graduationYear: '2020',
        profileUrl: 'https://drive.google.com/open?id=1cAfe8O7oKFaUdHvhd6XX4pyiw5kYkCsi&usp=drive_fs'
    },
    {
        id: 'NV017', code: 'NV017', name: 'Vương Chí Lập', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - Điện',
        email: 'lapvc@cic.com.vn', phone: '', avatar: getAvatar('Vương Chí Lập'),
        status: 'Chính thức', joinDate: '2017-01-01', skills: ['Điện', 'BIM'],
        dob: '25/09/1994',
        degree: '- Kỹ sư Công nghệ kỹ thuật điện- Trường Đại học Công nghiệp Hà Nội– Năm 2018',
        certificates: '- Chứng nhận khóa học BIM do BIMCollab Academy cấp',
        graduationYear: '2017',
        profileUrl: 'https://drive.google.com/open?id=18r9eJEYk4C7r9Z4_pq2J9u6w7vVcejeQ&usp=drive_fs'
    },
    {
        id: 'NV018', code: 'NV018', name: 'Hoàng Xuân Hải', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - MEP',
        email: '', phone: '', avatar: getAvatar('Hoàng Xuân Hải'),
        status: 'Chính thức', joinDate: '2005-01-01', skills: ['Điện', 'BIM Manager'],
        dob: '22/01/1981',
        degree: '- Kỹ sư Điện khí hóa & Cung cấp điện– Trường Đại học Sư phạm Kỹ thuật TP.HCM – Năm 2005',
        certificates: '- Chứng nhận khóa học Revit MEP – Viện Tin học xây dựng – Năm 2019\n- Chứng nhận BIM Manager – Viện Tin học xây dựng – Năm 2023\n- Chứng chỉ hành nghề Thiết kế cơ – điện công trình Hạng 1 từ 12/02/2025 đến 12/02/2030',
        graduationYear: '2005',
        profileUrl: 'https://drive.google.com/open?id=18rds-oEeJnqvodOyb7fEy6zdbuaqacIV&usp=drive_fs'
    },
    {
        id: 'NV019', code: 'NV019', name: 'Vũ Ngọc Thủy', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - Kiến trúc',
        email: '', phone: '', avatar: getAvatar('Vũ Ngọc Thủy'),
        status: 'Chính thức', joinDate: '2003-01-01', skills: ['Kiến trúc', 'Revit'],
        dob: '04/03/1997',
        degree: '- Kiến trúc sư – Đại học Kiến trúc Hà Nội – Năm 2003',
        certificates: '- Chứng nhận khóa học Revit Architecture – Viện Tin học xây dựng – Năm 2018\n- Chứng nhận khóa học Điều phối BIM – Viện Tin học xây dựng – Năm 2025',
        graduationYear: '2003',
        profileUrl: 'https://drive.google.com/open?id=1vmt64hpdGRjH56obUy8a_k5NAVrx96yi&usp=drive_fs'
    },
    {
        id: 'NV020', code: 'NV020', name: 'Nhữ Thị Thu Hiền', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - Xây dựng',
        email: '', phone: '', avatar: getAvatar('Nhữ Thị Thu Hiền'),
        status: 'Chính thức', joinDate: '2006-01-01', skills: ['Xây dựng', 'Revit'],
        dob: '15/09/1981',
        degree: '- Kỹ sư xây dựng – Học viện Kỹ thuật quân sự – Năm 2006',
        certificates: '- Chứng nhận khóa học Revit Structure – Viện Tin học xây dựng – Năm 2018\n- Chứng nhận khóa học BIM do BIMCollab Academy cấp',
        graduationYear: '2006',
        profileUrl: 'https://drive.google.com/open?id=14sECML3uW1usolfUUYcj3H_bFUwSQtwB&usp=drive_fs'
    },
    {
        id: 'NV021', code: 'NV021', name: 'Vũ Hương Thảo', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - Kiến trúc',
        email: '', phone: '', avatar: getAvatar('Vũ Hương Thảo'),
        status: 'Chính thức', joinDate: '2001-01-01', skills: ['Kiến trúc', 'Revit'],
        dob: '19/04/1978',
        degree: 'Kiến trúc sư – Trường Đại học Xây dựng – Năm 2001',
        certificates: 'Chứng nhận khóa học Revit Architecture – Viện Tin học xây dựng – Năm 2015\n-  Chứng nhận khóa học BIM do BIMCollab Academy cấp',
        graduationYear: '2001',
        profileUrl: 'https://drive.google.com/open?id=1BoFAE5JQ_7UT15f2Xd9ftarHRVjOXw7i&usp=drive_fs'
    },
    {
        id: 'NV022', code: 'NV022', name: 'Trần Thế Lực', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - Xây dựng',
        email: '', phone: '', avatar: getAvatar('Trần Thế Lực'),
        status: 'Chính thức', joinDate: '1999-01-01', skills: ['Xây dựng', 'Revit', 'BIM Coordinator'],
        dob: '12/10/1975',
        degree: '- Kỹ sư xây dựng – Trường Đại học Xây dựng – Năm 1999',
        certificates: '- Chứng nhận khóa học Revit Structure – Viện Tin học xây dựng – Năm 2015\n- Chứng nhận BIM Coordinator – Viện Tin học xây dựng – Năm 2025',
        graduationYear: '1999',
        profileUrl: 'https://drive.google.com/open?id=1kWIekCWmOvt0o411HHVaPUGn2cVhUrAt&usp=drive_fs'
    },
    {
        id: 'c4af4da7', code: 'c4af4da7', name: 'Đinh Trần Tuấn', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - Tin học',
        email: '', phone: '', avatar: getAvatar('Đinh Trần Tuấn'),
        status: 'Chính thức', joinDate: '2011-01-01', skills: ['Tin học xây dựng', 'Revit'],
        dob: '05/08/1984',
        degree: '- Kỹ sư tin học xây dựng  – Trường Đại học Xây dựng – Năm 2011',
        certificates: '- Chứng nhận khóa học Revit Structure – Viện Tin học xây dựng – Năm 2018\n- Chứng nhận khóa học BIM do BIMCollab Academy cấp',
        graduationYear: '2011',
        profileUrl: 'https://drive.google.com/open?id=1sZ5YFZldfhE2JHp5qH4WlW2USdJAlxFS&usp=drive_fs'
    },
    {
        id: 'd0cd130a', code: 'd0cd130a', name: 'Thái Minh Đạt', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - BIM',
        email: '', phone: '', avatar: getAvatar('Thái Minh Đạt'),
        status: 'Chính thức', joinDate: '2025-01-01', skills: [],
        dob: '22/07/2025'
    },
    {
        id: '8f33f228', code: '8f33f228', name: 'Đinh Huỳnh Thái', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - Xây dựng',
        email: '', phone: '', avatar: getAvatar('Đinh Huỳnh Thái'),
        status: 'Chính thức', joinDate: '2011-01-01', skills: ['Xây dựng', 'Revit'],
        dob: '23/07/2025',
        degree: 'Kỹ sư Xây dựng – Trường Đại học Kiến trúc TP. Hồ Chí Minh – Năm 2011',
        certificates: 'Chứng nhận khóa học Revit Structure – Viện Tin học xây dựng – Năm 2015',
        graduationYear: '2011',
        profileUrl: 'https://drive.google.com/open?id=1ArQL-YJGx7h5PHkkdk8lQQ_vbKDIp7K4&usp=drive_fs'
    },
    {
        id: 'a488bf2f', code: 'a488bf2f', name: 'Vũ Thị Thu', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - BIM',
        email: 'thuvt@cic.com.vn', phone: '', avatar: 'NhanSu_Images/a488bf2f.image.025011.jpg',
        status: 'Chính thức', joinDate: '2025-01-01', skills: [],
        dob: '28/07/2025'
    },
    {
        id: '5bb21db6', code: '5bb21db6', name: 'Ninh Văn Bình', role: 'Thành viên bộ môn (TVBM)', department: 'Kỹ thuật - BIM',
        email: '', phone: '', avatar: getAvatar('Ninh Văn Bình'),
        status: 'Chính thức', joinDate: '2025-01-01', skills: [],
        dob: '18/09/2025'
    }
];

async function seedEmployees() {
    console.log(`Starting seed of ${EMPLOYEES.length} employees...`);

    let successCount = 0;
    let failCount = 0;

    for (const emp of EMPLOYEES) {
        try {
            const { id, ...empData } = emp;

            // Check if employee with this CODE already exists
            const { data: existing } = await supabase
                .from('employees')
                .select('id')
                .eq('code', emp.code)
                .single();

            let error;
            if (existing) {
                // Update existing
                console.log(`Updating employee ${emp.code}...`);
                const result = await supabase
                    .from('employees')
                    .update(empData)
                    .eq('id', existing.id);
                error = result.error;
            } else {
                // Insert new
                console.log(`Inserting employee ${emp.code}...`);
                const result = await supabase
                    .from('employees')
                    .insert(emp);
                error = result.error;
            }

            if (error) {
                console.error(`Error upserting employee ${emp.code}:`, error.message);
                failCount++;
            } else {
                console.log(`Successfully upserted employee ${emp.code}`);
                successCount++;
            }
        } catch (e) {
            console.error(`Exception processing employee ${emp.code}:`, e);
            failCount++;
        }
    }

    console.log('--------------------------------------------------');
    console.log(`Seeding complete.`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);
}

seedEmployees();
