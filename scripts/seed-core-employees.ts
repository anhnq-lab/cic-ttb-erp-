import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://faxcibogggubmjsmtonz.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE5MzQ0OCwiZXhwIjoyMDgzNzY5NDQ4fQ.70lM9uuBJMvxlSqAsMUVisY-hwiscgHQiyDt_9mQBmA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

const EMPLOYEES = [
    {
        id: 'NV001', code: 'NV001', name: 'Đặng Đức Hà', role: 'Chủ tịch HĐQT', department: 'Ban Giám Đốc',
        email: 'dangducha@cic.com.vn', phone: '', avatar: 'https://ui-avatars.com/api/?name=%C4%90%E1%BA%B7ng%20%C4%90%E1%BB%A9c%20H%C3%A0&background=random&color=fff&size=150',
        status: 'Active', join_date: '2010-01-01', dob: '1976-01-11', degree: 'Kỹ sư tin học xây dựng',
        certificates: 'Revit Structure', graduation_year: '1997', profile_url: 'https://drive.google.com/open?id=1KucjjACozmzNTJ9JCSzWNc7aBUQsL2c4'
    },
    {
        id: 'NV002', code: 'NV002', name: 'Nguyễn Hoàng Hà', role: 'Tổng Giám đốc', department: 'Ban Giám Đốc',
        email: 'hoangha@cic.com.vn', phone: '', avatar: 'Nhanvien_Images/TGĐ.Anh.121313.jpg',
        status: 'Active', join_date: '2015-01-15', dob: '2025-07-05', graduation_year: '2003'
    },
    {
        id: 'NV003', code: 'NV003', name: 'Lương Thanh Hưng', role: 'Phó tổng giám đốc', department: 'Ban Giám Đốc',
        email: 'hunglt83@gmail.com', phone: '0886916666', avatar: 'Nhanvien_Images/NV001.Anh.041800.jpg',
        status: 'Active', join_date: '2016-01-01', dob: '1983-09-25', degree: 'Kỹ sư tin học xây dựng',
        certificates: 'Revit Structure, BIM Manager', graduation_year: '2007', profile_url: 'https://drive.google.com/open?id=1jIToxWRlmAzDKLcOW_WhoGwDd9MVkdxk'
    },
    {
        id: 'NV006', code: 'NV006', name: 'Trần Hữu Hải', role: 'Giám đốc TT BIM&Digital Twin', department: 'Ban Giám Đốc',
        email: 'haith@cic.com.vn', phone: '0353582757', avatar: 'Nhanvien_Images/NV004.Anh.041830.jpg',
        status: 'Active', join_date: '2017-01-01', dob: '1987-06-21', degree: 'Kỹ sư Kinh tế xây dựng',
        certificates: 'Revit, BIM Coordinator', graduation_year: '2011', profile_url: 'https://drive.google.com/open?id=19anClk_fw8zigSodkN4F_URDwGp3O6yK'
    },
    {
        id: 'NV005', code: 'NV005', name: 'Nguyễn Đức Thành', role: 'Trưởng bộ phận Quản lý chất lượng (TQLCL)', department: 'Kỹ thuật - BIM',
        email: 'ducthanh@cic.com.vn', phone: '', avatar: 'Nhanvien_Images/NV003.Anh.041823.jpg',
        status: 'Active', join_date: '2019-01-01', dob: '1996-08-20', degree: 'Kỹ sư xây dựng',
        certificates: 'Revit, Civil 3D', graduation_year: '2019', profile_url: 'https://drive.google.com/open?id=1qP4nV6p4MaJArBsQYvZwJervVO6z8P7Y'
    },
    {
        id: 'NV004', code: 'NV004', name: 'Nguyễn Quốc Anh', role: 'Trưởng bộ phận xúc tiến dự án (TXTDA)', department: 'Kinh doanh',
        email: 'anhnq@cic.com.vn', phone: '0943.431.591', avatar: 'Nhanvien_Images/NV002.Anh.041814.jpg',
        status: 'Active', join_date: '2015-01-01', dob: '1991-08-20', degree: 'Kỹ sư xây dựng, Thạc sỹ',
        certificates: 'Chứng chỉ giám sát, BIM', graduation_year: '2014'
    },
    {
        id: 'NV015', code: 'NV015', name: 'Vũ Văn Hòa', role: 'Trưởng bộ môn Kiến trúc + Kết cấu', department: 'Kỹ thuật - Kiến trúc',
        email: 'vanhoa@cic.com.vn', phone: '', avatar: 'https://ui-avatars.com/api/?name=V%C5%A9+V%C4%83n+H%C3%B2a',
        status: 'Active', join_date: '2018-01-01', dob: '1995-10-16', degree: 'Kỹ sư Kỹ thuật',
        certificates: 'Revit, BIM', graduation_year: '2018', profile_url: 'https://drive.google.com/open?id=1vCAWucOZsQy_QT-BTqt4sOc6CMCVbX7y'
    }
];

async function seedEmployees() {
    console.log(`Starting seed of ${EMPLOYEES.length} core employees...`);

    for (const emp of EMPLOYEES) {
        const { error } = await supabase
            .from('employees')
            .upsert(emp, { onConflict: 'id' });

        if (error) {
            console.error(`❌ Error upserting employee ${emp.code}:`, error.message);
        } else {
            console.log(`✅ Successfully upserted employee ${emp.code} (${emp.name})`);
        }
    }
    console.log('Seeding complete.');
}

seedEmployees();
