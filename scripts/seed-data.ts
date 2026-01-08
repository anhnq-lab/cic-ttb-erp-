
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIG ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- DATA ---
const PROJECTS = [
    {
        code: '25001',
        name: 'Khu Đô Thị Sinh Thái Hòa Lạc',
        client: 'Tập đoàn Vingroup',
        location: 'Hòa Lạc, Hà Nội',
        manager: 'Nguyễn Hoàng Hà',
        budget: 50000000000,
        capitalSource: 'NonStateBudget',
        status: 'In Progress',
        progress: 35,
        spent: 12000000000,
        deadline: '2025-12-31',
        members: 15,
        thumbnail: 'https://picsum.photos/id/10/400/300',
        projectGroup: 'Nhóm A',
        constructionType: 'Công trình dân dụng',
        constructionLevel: 'Cấp I',
        scale: '150ha',
        description: 'Dự án khu đô thị sinh thái kết hợp nghỉ dưỡng cao cấp.'
    },
    {
        code: '25002',
        name: 'Bệnh viện Đa khoa Quốc tế Miền Đông',
        client: 'Sở Y Tế Bình Dương',
        location: 'Bình Dương',
        manager: 'Trần Hữu Hải',
        budget: 250000000000,
        capitalSource: 'StateBudget',
        status: 'Planning',
        progress: 5,
        spent: 500000000,
        deadline: '2026-06-30',
        members: 20,
        thumbnail: 'https://picsum.photos/id/20/400/300',
        projectGroup: 'Quan trọng quốc gia',
        constructionType: 'Công trình công nghiệp',
        constructionLevel: 'Cấp đặc biệt',
        scale: '1000 giường',
        description: 'Bệnh viện quy mô lớn phục vụ khu vực miền Đông Nam Bộ.'
    },
    {
        code: '25003',
        name: 'Cao tốc Bắc Nam - Đoạn Nha Trang - Cam Lâm',
        client: 'Bộ Giao Thông Vận Tải',
        location: 'Khánh Hòa',
        manager: 'Nguyễn Bá Nhiệm',
        budget: 4500000000000,
        capitalSource: 'StateBudget',
        status: 'In Progress',
        progress: 60,
        spent: 2800000000000,
        deadline: '2024-09-02',
        members: 50,
        thumbnail: 'https://picsum.photos/id/30/400/300',
        projectGroup: 'Quan trọng quốc gia',
        constructionType: 'Công trình giao thông',
        constructionLevel: 'Cấp đặc biệt',
        scale: '49km',
        description: 'Dự án thành phần cao tốc Bắc Nam phía Đông.'
    },
    {
        code: '25004',
        name: 'Tổ hợp Chung cư cao cấp Riverside',
        client: 'Novaland Group',
        location: 'Thủ Đức, TP.HCM',
        manager: 'Vũ Ngọc Thủy',
        budget: 8000000000,
        capitalSource: 'NonStateBudget',
        status: 'Delayed',
        progress: 15,
        spent: 2000000000,
        deadline: '2025-05-15',
        members: 10,
        thumbnail: 'https://picsum.photos/id/40/400/300',
        projectGroup: 'Nhóm B',
        constructionType: 'Công trình dân dụng',
        constructionLevel: 'Cấp I',
        scale: '3 block 25 tầng',
        description: 'Chung cư view sông Sài Gòn.'
    },
    {
        code: '25005',
        name: 'Nhà máy Sản xuất Chip Bán dẫn',
        client: 'Intel Vietnam',
        location: 'Khu Công Nghệ Cao, TP.HCM',
        manager: 'Lương Thành Hưng',
        budget: 120000000000,
        capitalSource: 'NonStateBudget',
        status: 'Completed',
        progress: 100,
        spent: 115000000000,
        deadline: '2023-12-20',
        members: 30,
        thumbnail: 'https://picsum.photos/id/50/400/300',
        projectGroup: 'Nhóm A',
        constructionType: 'Công trình công nghiệp',
        constructionLevel: 'Cấp I',
        scale: '50.000 m2 sàn',
        description: 'Mở rộng dây chuyền sản xuất chip thế hệ mới.'
    }
];

const CONTRACTS = [
    {
        packageName: 'HĐ Tư vấn Thiết kế BV Đa khoa Miền Đông',
        code: 'HD-25002-TK',
        totalValue: 5000000000,
        status: 'Active',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        project_code: '25002' // Link via code
    },
    {
        packageName: 'HĐ Giám sát thi công Cao tốc',
        code: 'HD-25003-GS',
        totalValue: 12000000000,
        status: 'Active',
        startDate: '2023-06-01',
        endDate: '2024-09-01',
        project_code: '25003'
    },
    {
        packageName: 'HĐ Thiết kế BIM Riverside',
        code: 'HD-25004-BIM',
        totalValue: 1500000000,
        status: 'Suspended',
        startDate: '2024-02-15',
        endDate: '2024-08-15',
        project_code: '25004'
    },
    {
        packageName: 'HĐ Bảo trì hệ thống MEP Nhà máy Intel',
        code: 'HD-25005-BT',
        totalValue: 800000000,
        status: 'Completed',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        project_code: '25005'
    },
    {
        packageName: 'HĐ Quy hoạch 1/500 KĐT Hòa Lạc',
        code: 'HD-25001-QH',
        totalValue: 3000000000,
        status: 'Active',
        startDate: '2024-03-01',
        endDate: '2024-09-30',
        project_code: '25001'
    }
];

// --- TEMPLATES & EMPLOYEES ---
const PROJECT_TEMPLATES = {
    StateBudget: [
        { code: '1.1', name: 'Thuyết trình khách hàng (Vốn NS)', offset: 0, duration: 3, assigneeRole: 'QL BIM', priority: 'High' },
        { code: '1.4', name: 'Thu thập dữ liệu đầu vào báo giá', offset: 2, duration: 5, assigneeRole: 'QLDA', priority: 'Medium' },
        { code: '2.5', name: 'Lập báo giá & Hồ sơ thầu', offset: 7, duration: 5, assigneeRole: 'GĐTT', priority: 'High' },
        { code: '3.1', name: 'Quyết định bổ nhiệm nhân sự (QĐ-01)', offset: 12, duration: 1, assigneeRole: 'GĐTT', priority: 'High' },
        { code: '3.4', name: 'Thiết lập môi trường CDE & Bimcollab', offset: 13, duration: 2, assigneeRole: 'QL BIM', priority: 'High' },
        { code: '4.1', name: 'Dựng mô hình trình thẩm định (LOD 300)', offset: 15, duration: 14, assigneeRole: 'TNDH', priority: 'High' },
        { code: '4.4', name: 'Tập hợp hồ sơ trình thẩm định', offset: 29, duration: 3, assigneeRole: 'QLDA', priority: 'High' },
    ],
    NonStateBudget: [
        { code: '1.1', name: 'Thuyết trình giải pháp (Tư nhân)', offset: 0, duration: 2, assigneeRole: 'QL BIM', priority: 'High' },
        { code: '2.2', name: 'Chốt khối lượng & Scope', offset: 3, duration: 4, assigneeRole: 'PGĐTT', priority: 'High' },
        { code: '2.4', name: 'Lập Pre-BEP', offset: 5, duration: 3, assigneeRole: 'QL BIM', priority: 'Medium' },
        { code: '3.6', name: 'Tạo Template dự án (Theo chuẩn CĐT)', offset: 8, duration: 3, assigneeRole: 'PGĐTT', priority: 'Medium' },
        { code: '4.1', name: 'Dựng mô hình thiết kế kỹ thuật', offset: 12, duration: 20, assigneeRole: 'TNDH', priority: 'High' },
        { code: '5.1', name: 'Hồ sơ thanh toán đợt 1', offset: 32, duration: 5, assigneeRole: 'Admin', priority: 'High' },
    ]
};

const EMPLOYEES = [
    { name: 'Nguyễn Hoàng Hà', role: 'Giám đốc Trung tâm' },
    { name: 'Nguyễn Bá Nhiệm', role: 'Phó GĐTT / Trưởng MEP' },
    { name: 'Lương Thành Hưng', role: 'BIM Manager' },
    { name: 'Trần Hữu Hải', role: 'BIM Coordinator' },
    { name: 'Vũ Ngọc Thủy', role: 'KTS Chủ trì' },
    { name: 'Nguyễn Đức Thành', role: 'Kỹ sư Kết cấu' },
    { name: 'Đào Đông Quỳnh', role: 'Trưởng bộ phận Admin' }
];

async function seed() {
    console.log('🌱 Starting seed...');

    // 1. Seed Projects
    for (const p of PROJECTS) {
        const { data: existing } = await supabase.from('projects').select('id').eq('code', p.code).single();

        let projectId;
        if (!existing) {
            const { data, error } = await supabase.from('projects').insert(p).select().single();
            if (error) {
                console.error(`Error inserting project ${p.code}:`, error.message);
                continue;
            }
            console.log(`✅ Created project: ${p.name}`);
            projectId = data.id;
        } else {
            console.log(`⚠️ Project ${p.code} already exists. Skipping.`);
            projectId = existing.id;
        }

        if (projectId) {
            // 2. Seed Contracts for this project
            const contract = CONTRACTS.find(c => c.project_code === p.code);
            if (contract) {
                const { project_code, ...contractData } = contract;
                const { data: existingContract } = await supabase.from('contracts').select('id').eq('code', contract.code).single();

                // Enrich with Personnel (Randomly assigned)
                const personnel = EMPLOYEES.slice(0, 3 + Math.floor(Math.random() * 3)).map(emp => ({
                    name: emp.name,
                    role: emp.role
                }));

                const contractWithPersonnel = {
                    ...contractData,
                    projectId: projectId,
                    personnel: personnel
                };

                if (!existingContract) {
                    const { error } = await supabase.from('contracts').insert(contractWithPersonnel);
                    if (error) console.error(`Error inserting contract ${contract.code}:`, error.message);
                    else console.log(`   ✅ Created contract: ${contract.packageName}`);
                } else {
                    // Update personnel
                    await supabase.from('contracts').update({ personnel: personnel }).eq('id', existingContract.id);
                    console.log(`   ⚠️ Contract ${contract.code} updated with personnel.`);
                }
            }

            // 3. Seed Tasks
            // Clean existing tasks to generate fresh ones
            await supabase.from('tasks').delete().eq('projectId', projectId);

            const template = p.capitalSource === 'StateBudget' ? PROJECT_TEMPLATES.StateBudget : PROJECT_TEMPLATES.NonStateBudget;
            const tasksToInsert = template.map((t, index) => {
                let status = 'Open';
                if (index === 0) status = 'S6 Trình khách hàng';
                if (index === 1) status = 'S0 Đang thực hiện';
                if (index === 2) status = 'S1 Phối hợp';

                const assignee = EMPLOYEES.find(e => e.role.includes(t.assigneeRole)) || EMPLOYEES[0];

                return {
                    code: t.code,
                    name: t.name,
                    projectId: projectId,
                    assignee: { name: assignee.name, role: t.assigneeRole, avatar: `https://ui-avatars.com/api/?name=${assignee.name}&background=random` },
                    status: status,
                    priority: t.priority,
                    startDate: new Date(Date.now() + t.offset * 86400000).toISOString().split('T')[0],
                    dueDate: new Date(Date.now() + (t.offset + t.duration) * 86400000).toISOString().split('T')[0],
                    progress: index === 0 ? 100 : (status === 'Open' ? 0 : 35),
                    tags: [t.assigneeRole]
                };
            });

            const { error: taskError } = await supabase.from('tasks').insert(tasksToInsert);
            if (taskError) console.error(`   ❌ Error seeding tasks for ${p.code}:`, taskError.message);
            // else console.log(`   ✅ Seeded ${tasksToInsert.length} tasks for ${p.code}`);
        }
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
}

seed();
