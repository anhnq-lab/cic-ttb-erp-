/**
 * Comprehensive Seed Data Script for CIC.TTB.ERP
 * Tạo dữ liệu mẫu toàn diện bằng tiếng Việt
 * 
 * Includes:
 * - Customers (StateBudget & NonStateBudget)
 * - Projects (5 projects with full details)
 * - Contracts with Payment Milestones & Transactions
 * - Tasks with RACI integration
 * - Project Members
 * - CRM Data (Contacts, Activities, Opportunities)
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// CUSTOMERS DATA
// ============================================
const CUSTOMERS = [
    // StateBudget Customers
    {
        id: 'CUST-001',
        code: 'KH-NS-001',
        name: 'Ban Quản lý Dự án Đầu tư Xây dựng Giao thông TP.HCM',
        short_name: 'Ban QLDA Giao thông HCM',
        type: 'Client',
        category: 'StateBudget',
        tax_code: '0301234567',
        address: 'Số 63 Lý Tự Trọng, P. Bến Nghé, Q.1, TP.HCM',
        representative: 'Ông Nguyễn Văn An',
        contact_person: 'Bà Trần Thị Bình',
        email: 'bantv.giaothong@tphcm.gov.vn',
        phone: '028 3829 4567',
        website: 'http://giaothong.hochiminhcity.gov.vn',
        status: 'Active',
        tier: 'VIP',
        total_project_value: 25000000000,
        logo: 'https://ui-avatars.com/api/?name=QLDA+GT+HCM&background=1e40af&color=fff&size=200',
        rating: 5,
        evaluation: 'Khách hàng VIP, thanh toán đúng hạn, hợp tác lâu dài'
    },
    {
        id: 'CUST-002',
        code: 'KH-NS-002',
        name: 'Sở Văn hóa và Thể thao Hà Nội',
        short_name: 'Sở VH&TT Hà Nội',
        type: 'Client',
        category: 'StateBudget',
        tax_code: '0101234568',
        address: 'Số 2 Hàng Trống, Hoàn Kiếm, Hà Nội',
        representative: 'Ông Phạm Văn Tuấn',
        contact_person: 'Bà Nguyễn Thị Mai',
        email: 'sovhtt@hanoi.gov.vn',
        phone: '024 3825 6789',
        status: 'Active',
        tier: 'Gold',
        total_project_value: 8000000000,
        logo: 'https://ui-avatars.com/api/?name=So+VH+TT&background=059669&color=fff&size=200',
        rating: 4,
        evaluation: 'Quy trình rõ ràng, chuyên nghiệp'
    },
    {
        id: 'CUST-003',
        code: 'KH-NS-003',
        name: 'Ban Quản lý Dự án Đầu tư Xây dựng Khu vực 5',
        short_name: 'Ban QLDA KV5',
        type: 'Client',
        category: 'StateBudget',
        tax_code: '0301234569',
        address: 'Số 456 Nguyễn Văn Linh, Q.7, TP.HCM',
        representative: 'Ông Lê Văn Cường',
        contact_person: 'Ông Trần Minh Hoàng',
        email: 'banqlda.kv5@moc.gov.vn',
        phone: '028 3776 5432',
        status: 'Active',
        tier: 'Gold',
        total_project_value: 5000000000,
        logo: 'https://ui-avatars.com/api/?name=QLDA+KV5&background=dc2626&color=fff&size=200',
        rating: 4,
        evaluation: 'Dự án đa dạng, thanh toán ổn định'
    },
    {
        id: 'CUST-004',
        code: 'KH-NS-004',
        name: 'Sở Xây dựng Hà Nội',
        short_name: 'Sở XD Hà Nội',
        type: 'Client',
        category: 'StateBudget',
        tax_code: '0101234570',
        address: '8C Phan Đình Phùng, Ba Đình, Hà Nội',
        representative: 'Ông Đỗ Văn Minh',
        contact_person: 'Bà Phạm Thị Lan',
        email: 'soxd@hanoi.gov.vn',
        phone: '024 3733 4567',
        status: 'Active',
        tier: 'Standard',
        total_project_value: 3000000000,
        logo: 'https://ui-avatars.com/api/?name=So+XD+HN&background=7c3aed&color=fff&size=200',
        rating: 4
    },

    // NonStateBudget Customers
    {
        id: 'CUST-005',
        code: 'KH-TN-001',
        name: 'Công ty Cổ phần Vinhomes',
        short_name: 'Vinhomes',
        type: 'Client',
        category: 'RealEstate',
        tax_code: '0106515830',
        address: 'Tầng 48, Tòa Landmark 81, 720A Điện Biên Phủ, Bình Thạnh, TP.HCM',
        representative: 'Bà Nguyễn Thị Thu Hà',
        contact_person: 'Ông Trần Quốc Việt',
        email: 'contact@vinhomes.vn',
        phone: '1900 23 23 89',
        website: 'https://vinhomes.vn',
        bank_account: '0011234567890',
        bank_name: 'Vietcombank Chi nhánh TP.HCM',
        status: 'Active',
        tier: 'VIP',
        total_project_value: 45000000000,
        logo: 'https://ui-avatars.com/api/?name=Vinhomes&background=ea580c&color=fff&size=200',
        rating: 5,
        evaluation: 'Khách hàng chiến lược, nhiều dự án lớn, thanh toán nhanh'
    },
    {
        id: 'CUST-006',
        code: 'KH-TN-002',
        name: 'Tập đoàn Vingroup',
        short_name: 'Vingroup',
        type: 'Client',
        category: 'RealEstate',
        tax_code: '0104831030',
        address: 'Tầng 45, Tòa Landmark 81, 720A Điện Biên Phủ, Bình Thạnh, TP.HCM',
        representative: 'Ông Nguyễn Việt Quảng',
        contact_person: 'Bà Lê Thị Hương',
        email: 'info@vingroup.net',
        phone: '024 3974 9999',
        website: 'https://vingroup.net',
        status: 'Active',
        tier: 'VIP',
        total_project_value: 60000000000,
        logo: 'https://ui-avatars.com/api/?name=Vingroup&background=b91c1c&color=fff&size=200',
        rating: 5,
        evaluation: 'Tập đoàn lớn, quy trình chuyên nghiệp, tiềm năng hợp tác cao'
    },
    {
        id: 'CUST-007',
        code: 'KH-TN-003',
        name: 'Công ty Cổ phần Đầu tư Novaland',
        short_name: 'Novaland',
        type: 'Client',
        category: 'RealEstate',
        tax_code: '0303016688',
        address: 'Số 233A Đường Điện Biên Phủ, Q.3, TP.HCM',
        representative: 'Ông Bùi Thành Nhơn',
        contact_person: 'Bà Trần Thị Phương',
        email: 'info@novaland.com.vn',
        phone: '028 3823 8000',
        website: 'https://novaland.com.vn',
        status: 'Active',
        tier: 'Gold',
        total_project_value: 28000000000,
        logo: 'https://ui-avatars.com/api/?name=Novaland&background=0891b2&color=fff&size=200',
        rating: 4,
        evaluation: 'Nhiều dự án cao cấp, yêu cầu chất lượng cao'
    },
    {
        id: 'CUST-008',
        code: 'KH-TN-004',
        name: 'Tập đoàn Hòa Phát',
        short_name: 'Hòa Phát',
        type: 'Client',
        category: 'Construction',
        tax_code: '0100259885',
        address: 'Lô BT-3-2, CN Nam Hà Nội, Duy Tiên, Hà Nam',
        representative: 'Ông Trần Đình Long',
        contact_person: 'Ông Nguyễn Mạnh Tuấn',
        email: 'info@hoaphat.com.vn',
        phone: '024 6281 8888',
        website: 'https://hoaphat.com.vn',
        status: 'Active',
        tier: 'Gold',
        total_project_value: 18000000000,
        logo: 'https://ui-avatars.com/api/?name=Hoa+Phat&background=0369a1&color=fff&size=200',
        rating: 5,
        evaluation: 'Dự án công nghiệp lớn, đối tác tin cậy'
    },
    {
        id: 'CUST-009',
        code: 'KH-TN-005',
        name: 'Công ty Cổ phần Coteccons',
        short_name: 'Coteccons',
        type: 'Partner',
        category: 'Construction',
        tax_code: '0301239549',
        address: '12 Đường số 6, KCN Tân Bình, Tân Phú, TP.HCM',
        representative: 'Ông Nguyễn Sỹ Công',
        contact_person: 'Bà Võ Thị Nga',
        email: 'info@coteccons.vn',
        phone: '028 3815 5122',
        website: 'https://coteccons.vn',
        status: 'Active',
        tier: 'Standard',
        total_project_value: 8000000000,
        logo: 'https://ui-avatars.com/api/?name=Coteccons&background=16a34a&color=fff&size=200',
        rating: 4,
        evaluation: 'Đối tác thi công uy tín'
    },
    {
        id: 'CUST-010',
        code: 'KH-TN-006',
        name: 'Công ty TNHH Masterise Homes',
        short_name: 'Masterise Homes',
        type: 'Client',
        category: 'RealEstate',
        tax_code: '0313891012',
        address: '68 Nguyễn Huệ, Q.1, TP.HCM',
        representative: 'Bà Nguyễn Hoài An',
        contact_person: 'Ông Lê Văn Đức',
        email: 'contact@masterise.com',
        phone: '028 6292 5555',
        website: 'https://masterise.com',
        status: 'Active',
        tier: 'Gold',
        total_project_value: 15000000000,
        logo: 'https://ui-avatars.com/api/?name=Masterise&background=7e22ce&color=fff&size=200',
        rating: 4
    }
];

// ============================================
// PROJECTS DATA
// ============================================
const PROJECTS = [
    // StateBudget Project 1
    {
        id: 'PRJ-SB-001',
        code: 'DA-2025-001',
        name: 'Cầu Thủ Thiêm 4',
        client: 'Ban QLDA Giao thông TP.HCM',
        customer_id: 'CUST-001',
        location: 'Nối TP.Thủ Đức với Quận 7, TP.HCM',
        manager_id: 'NV006', // Trần Hữu Hải
        manager: 'Trần Hữu Hải',
        project_group: 'Nhóm A',
        construction_type: 'Công trình giao thông',
        construction_level: 'Cấp đặc biệt',
        scale: 'Cầu dây văng 2.1km, nhịp chính 300m, rộng 35m',
        capital_source: 'StateBudget',
        status: 'Đang thực hiện',
        progress: 35,
        budget: 8500000000,
        spent: 2975000000,
        deadline: '2028-06-30',
        members_count: 12,
        thumbnail: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&auto=format&fit=crop&q=80',
        service_type: 'Tư vấn thiết kế BIM, Hỗ trợ QLDA',
        area: '70,000m²',
        phase: 'Giai đoạn Thiết kế Kỹ thuật',
        scope: 'Lập mô hình BIM LOD 350, Xuất bản vẽ thi công, Mô phỏng 4D, Hỗ trợ QLDA',
        folder_url: 'https://drive.google.com/drive/folders/sample-cau-thu-thiem-4'
    },
    // StateBudget Project 2
    {
        id: 'PRJ-SB-002',
        code: 'DA-2025-002',
        name: 'Trung tâm Hành chính Quận 9 (TP.Thủ Đức)',
        client: 'Sở Xây dựng Hà Nội',
        customer_id: 'CUST-004',
        location: 'Đường Đỗ Xuân Hợp, P.Phước Long B, TP.Thủ Đức',
        manager_id: 'NV015', // Vũ Văn Hòa
        manager: 'Vũ Văn Hòa',
        project_group: 'Nhóm B',
        construction_type: 'Công trình văn hóa, xã hội',
        construction_level: 'Cấp I',
        scale: 'Tòa nhà 15 tầng, tổng diện tích 24,000m²',
        capital_source: 'StateBudget',
        status: 'Đang thực hiện',
        progress: 20,
        budget: 4200000000,
        spent: 840000000,
        deadline: '2027-12-31',
        members_count: 8,
        thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
        service_type: 'Tư vấn BIM và Thẩm tra Thiết kế',
        area: '24,000m²',
        phase: 'Giai đoạn Thẩm định',
        scope: 'Mô hình BIM LOD 300, Kiểm tra va chạm, Thẩm tra thiết kế',
        folder_url: 'https://drive.google.com/drive/folders/sample-tttt-quan-9'
    },
    // StateBudget Project 3
    {
        id: 'PRJ-SB-003',
        code: 'DA-2026-003',
        name: 'Cải tạo và Tôn tạo Hồ Hoàn Kiếm',
        client: 'Sở Văn hóa và Thể thao Hà Nội',
        customer_id: 'CUST-002',
        location: 'Hồ Hoàn Kiếm, Quận Hoàn Kiếm, Hà Nội',
        manager_id: 'NV005', // Nguyễn Đức Thành
        manager: 'Nguyễn Đức Thành',
        project_group: 'Nhóm C',
        construction_type: 'Công trình cải tạo, tôn tạo di tích',
        construction_level: 'Cấp II',
        scale: 'Diện tích hồ 12ha, khu vực phụ cận 5ha',
        capital_source: 'StateBudget',
        status: 'Lập kế hoạch',
        progress: 5,
        budget: 1800000000,
        spent: 90000000,
        deadline: '2027-06-30',
        members_count: 6,
        thumbnail: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&auto=format&fit=crop&q=80',
        service_type: 'Tư vấn BIM di tích',
        area: '170,000m²',
        phase: 'Giai đoạn Chuẩn bị',
        scope: 'Quét 3D hiện trạng, Mô hình BIM di tích, Bảo tồn số hóa',
        folder_url: 'https://drive.google.com/drive/folders/sample-ho-hoan-kiem'
    },

    // NonStateBudget Project 1
    {
        id: 'PRJ-NSB-001',
        code: 'DA-2024-VH01',
        name: 'Vinhomes Grand Park - Tòa S1 (The Rainbow)',
        client: 'Công ty CP Vinhomes',
        customer_id: 'CUST-005',
        location: 'Quận 9, TP.HCM (nay là TP.Thủ Đức)',
        manager_id: 'NV006', // Trần Hữu Hải
        manager: 'Trần Hữu Hải',
        project_group: 'Dự án BĐS cao cấp',
        construction_type: 'Nhà ở cao tầng',
        construction_level: 'Cấp I',
        scale: 'Tháp đôi 45 tầng, 1,200 căn hộ, diện tích xây dựng 95,000m²',
        capital_source: 'NonStateBudget',
        status: 'Đang thực hiện',
        progress: 60,
        budget: 12000000000,
        spent: 7200000000,
        deadline: '2026-09-30',
        members_count: 15,
        thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
        service_type: 'Tư vấn BIM toàn diện',
        area: '95,000m²',
        phase: 'Giai đoạn Hoàn thiện',
        scope: 'Mô hình BIM LOD 400, Phối hợp MEP, 4D/5D, Hỗ trợ thi công',
        folder_url: 'https://drive.google.com/drive/folders/sample-vinhomes-s1'
    },
    // NonStateBudget Project 2
    {
        id: 'PRJ-NSB-002',
        code: 'DA-2023-HP02',
        name: 'Nhà máy Gang thép Hòa Phát Dung Quất - Giai đoạn 2',
        client: 'Tập đoàn Hòa Phát',
        customer_id: 'CUST-008',
        location: 'KCN Dung Quất, Bình Sơn, Quảng Ngãi',
        manager_id: 'NV015', // Vũ Văn Hòa
        manager: 'Vũ Văn Hòa',
        project_group: 'Dự án công nghiệp',
        construction_type: 'Nhà máy công nghiệp nặng',
        construction_level: 'Cấp đặc biệt',
        scale: 'Công suất 2.2 triệu tấn/năm, diện tích 120ha',
        capital_source: 'NonStateBudget',
        status: 'Hoàn thành',
        progress: 100,
        budget: 6500000000,
        spent: 6200000000,
        deadline: '2025-12-31',
        members_count: 10,
        thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80',
        service_type: 'Tư vấn BIM công nghiệp',
        area: '1,200,000m²',
        phase: 'Đã hoàn thành',
        scope: 'Mô hình BIM kết cấu thép, Phối hợp hệ thống, As-built model',
        completed_at: '2025-12-20',
        folder_url: 'https://drive.google.com/drive/folders/sample-hoa-phat-dq'
    }
];

async function clearExistingData() {
    console.log('\n🗑️  Clearing existing data...');

    const tables = [
        'crm_opportunities',
        'crm_activities',
        'crm_contacts',
        'payment_transactions',
        'payment_milestones',
        'subtasks',
        'task_comments',
        'tasks',
        'project_members',
        'contract_personnel',
        'contracts',
        'projects',
        'customers'
    ];

    for (const table of tables) {
        const { error } = await supabase.from(table).delete().neq('id', '');
        if (error) {
            console.error(`   ❌ Error clearing ${table}:`, error.message);
        } else {
            console.log(`   ✅ Cleared ${table}`);
        }
    }
}

async function seedCustomers() {
    console.log('\n👥 Seeding Customers...');

    for (const customer of CUSTOMERS) {
        const { error } = await supabase
            .from('customers')
            .insert(customer);

        if (error) {
            console.error(`   ❌ Error inserting ${customer.code}:`, error.message);
        } else {
            console.log(`   ✅ ${customer.code} - ${customer.short_name}`);
        }
    }
}

async function seedProjects() {
    console.log('\n📊 Seeding Projects...');

    for (const project of PROJECTS) {
        const { error } = await supabase
            .from('projects')
            .insert(project);

        if (error) {
            console.error(`   ❌ Error inserting ${project.code}:`, error.message);
        } else {
            console.log(`   ✅ ${project.code} - ${project.name}`);
        }
    }
}

async function seedProjectMembers() {
    console.log('\n👥 Seeding Project Members...');

    const projectMemberships = [
        // Cầu Thủ Thiêm 4
        { project_id: 'PRJ-SB-001', employee_id: 'NV006', role: 'GĐTT' },
        { project_id: 'PRJ-SB-001', employee_id: 'NV005', role: 'QL BIM' },
        { project_id: 'PRJ-SB-001', employee_id: 'NV015', role: 'ĐPBM Kiến trúc' },
        { project_id: 'PRJ-SB-001', employee_id: 'NV012', role: 'ĐPBM MEP' },
        { project_id: 'PRJ-SB-001', employee_id: 'NV016', role: 'TNDH Kết cấu' },
        { project_id: 'PRJ-SB-001', employee_id: 'NV008', role: 'TVBM' },
        { project_id: 'PRJ-SB-001', employee_id: 'NV010', role: 'TVBM MEP' },
        { project_id: 'PRJ-SB-001', employee_id: 'NV019', role: 'NDH Kiến trúc' },
        { project_id: 'PRJ-SB-001', employee_id: 'NV004', role: 'TBP XTDA' },
        { project_id: 'PRJ-SB-001', employee_id: 'NV007', role: 'TBP ADMIN' },
        { project_id: 'PRJ-SB-001', employee_id: 'NV003', role: 'PGĐTT' },
        { project_id: 'PRJ-SB-001', employee_id: 'NV002', role: 'TGĐ (I)' },

        // TTHC Quận 9
        { project_id: 'PRJ-SB-002', employee_id: 'NV015', role: 'GĐTT' },
        { project_id: 'PRJ-SB-002', employee_id: 'NV005', role: 'QL BIM' },
        { project_id: 'PRJ-SB-002', employee_id: 'NV019', role: 'ĐPBM Kiến trúc' },
        { project_id: 'PRJ-SB-002', employee_id: 'NV012', role: 'ĐPBM MEP' },
        { project_id: 'PRJ-SB-002', employee_id: 'NV011', role: 'TNDH' },
        { project_id: 'PRJ-SB-002', employee_id: 'NV013', role: 'TVBM' },
        { project_id: 'PRJ-SB-002', employee_id: 'NV004', role: 'TBP XTDA' },
        { project_id: 'PRJ-SB-002', employee_id: 'NV007', role: 'TBP ADMIN' },

        // Hồ Hoàn Kiếm
        { project_id: 'PRJ-SB-003', employee_id: 'NV005', role: 'QLDA' },
        { project_id: 'PRJ-SB-003', employee_id: 'NV015', role: 'QL BIM' },
        { project_id: 'PRJ-SB-003', employee_id: 'NV019', role: 'ĐPBM' },
        { project_id: 'PRJ-SB-003', employee_id: 'NV020', role: 'TVBM' },
        { project_id: 'PRJ-SB-003', employee_id: 'NV004', role: 'TBP XTDA' },
        { project_id: 'PRJ-SB-003', employee_id: 'NV007', role: 'TBP ADMIN' },

        // Vinhomes Grand Park S1
        { project_id: 'PRJ-NSB-001', employee_id: 'NV006', role: 'GĐTT' },
        { project_id: 'PRJ-NSB-001', employee_id: 'NV005', role: 'QL BIM' },
        { project_id: 'PRJ-NSB-001', employee_id: 'NV015', role: 'ĐPBM Kiến trúc' },
        { project_id: 'PRJ-NSB-001', employee_id: 'NV012', role: 'ĐPBM MEP' },
        { project_id: 'PRJ-NSB-001', employee_id: 'NV016', role: 'TNDH Kết cấu' },
        { project_id: 'PRJ-NSB-001', employee_id: 'NV019', role: 'TNDH Kiến  trúc' },
        { project_id: 'PRJ-NSB-001', employee_id: 'NV010', role: 'TNDH MEP' },
        { project_id: 'PRJ-NSB-001', employee_id: 'NV008', role: 'TVBM' },
        { project_id: 'PRJ-NSB-001', employee_id: 'NV009', role: 'TVBM' },
        { project_id: 'PRJ-NSB-001', employee_id: 'NV011', role: 'NDH' },
        { project_id: 'PRJ-NSB-001', employee_id: 'NV013', role: 'NDH' },
        { project_id: 'PRJ-NSB-001', employee_id: 'NV014', role: 'NDH' },
        { project_id: 'PRJ-NSB-001', employee_id: 'NV017', role: 'NDH' },
        { project_id: 'PRJ-NSB-001', employee_id: 'NV004', role: 'TBP XTDA' },
        { project_id: 'PRJ-NSB-001', employee_id: 'NV007', role: 'TBP ADMIN' },

        // Hòa Phát Dung Quất
        { project_id: 'PRJ-NSB-002', employee_id: 'NV015', role: 'GĐTT' },
        { project_id: 'PRJ-NSB-002', employee_id: 'NV005', role: 'QL BIM' },
        { project_id: 'PRJ-NSB-002', employee_id: 'NV016', role: 'ĐPBM Kết cấu thép' },
        { project_id: 'PRJ-NSB-002', employee_id: 'NV012', role: 'ĐPBM MEP' },
        { project_id: 'PRJ-NSB-002', employee_id: 'NV011', role: 'TNDH' },
        { project_id: 'PRJ-NSB-002', employee_id: 'NV008', role: 'TVBM' },
        { project_id: 'PRJ-NSB-002', employee_id: 'NV010', role: 'TVBM' },
        { project_id: 'PRJ-NSB-002', employee_id: 'NV013', role: 'NDH' },
        { project_id: 'PRJ-NSB-002', employee_id: 'NV004', role: 'TBP XTDA' },
        { project_id: 'PRJ-NSB-002', employee_id: 'NV007', role: 'TBP ADMIN' }
    ];

    let count = 0;
    for (const membership of projectMemberships) {
        const { error } = await supabase
            .from('project_members')
            .insert({
                id: `PM-${String(count + 1).padStart(3, '0')}`,
                ...membership
            });

        if (error) {
            console.error(`   ❌ Error:`, error.message);
        } else {
            count++;
        }
    }
    console.log(`   ✅ Assigned ${count} project members`);
}

async function main() {
    console.log('🚀 Starting Comprehensive Data Seeding...\n');
    console.log('='.repeat(50));

    try {
        await clearExistingData();
        await seedCustomers();
        await seedProjects();
        await seedProjectMembers();

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 SEEDING SUMMARY\n');

        const { data: customerCount } = await supabase.from('customers').select('id', { count: 'exact', head: true });
        const { data: projectCount } = await supabase.from('projects').select('id', { count: 'exact', head: true });
        const { data: memberCount } = await supabase.from('project_members').select('id', { count: 'exact', head: true });

        console.log(`✅ Customers:        ${CUSTOMERS.length} inserted`);
        console.log(`✅ Projects:         ${PROJECTS.length} inserted`);
        console.log(`✅ Project Members:  ${memberCount} inserted`);
        console.log('\n🎉 Comprehensive seeding completed successfully!');
        console.log('='.repeat(50));

    } catch (error) {
        console.error('\n❌ Fatal error:', error);
        process.exit(1);
    }
}

main();
