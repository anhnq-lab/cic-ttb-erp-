
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { TaskStatus, TaskPriority, ContractStatus } from '../types';

// Load env vars
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

const HERO_PROJECT_ID = 'P-007';

async function seedHeroProject() {
    console.log('--- SEEDING HERO PROJECT (P-007) ---');

    // 1. UPSCALE THE PROJECT
    const heroProject = {
        id: HERO_PROJECT_ID,
        code: '25016',
        name: 'CẦU THỦ THIÊM 4',
        client: 'Ban QLDA Giao thông TP.HCM',
        location: 'TP. Thủ Đức - Quận 7, TP.HCM',
        manager: 'Trần Hữu Hải',
        project_group: 'Nhóm A',
        construction_type: 'Công trình giao thông',
        construction_level: 'Cấp đặc biệt',
        scale: 'Cầu dây văng 2km (Nhịp chính 300m)',
        capital_source: 'StateBudget',
        status: 'Đang thực hiện',
        progress: 12,
        budget: 8500000000,
        spent: 1250000000,
        deadline: '2028-04-30',
        members_count: 12,
        thumbnail: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=500&auto=format&fit=crop&q=60'
    };

    const { error: pError } = await supabase.from('projects').upsert(heroProject);
    if (pError) console.error('Error upserting project:', pError);
    else console.log('Project P-007 upserted.');

    // 2. CREATE CONTRACTS
    const contracts = [
        {
            projectId: HERO_PROJECT_ID,
            code: '15/2025/HĐ-TVTK',
            signedDate: '2025-01-15',
            packageName: 'Tư vấn Thiết kế Kỹ thuật & BIM',
            projectName: 'Cầu Thủ Thiêm 4',
            location: 'TP.HCM',
            contractType: 'Tư vấn BIM',
            lawApplied: 'Luật Việt Nam',
            sideAName: 'Ban QLDA Giao thông TP.HCM',
            sideARep: 'Ông Nguyễn Văn A',
            sideAPosition: 'Giám đốc',
            sideBName: 'CIC',
            sideBRep: 'Nguyễn Hoàng Hà',
            totalValue: 5200000000,
            paidValue: 1560000000, // 30% advance
            remainingValue: 3640000000,
            wipValue: 2000000000,
            status: 'Hiệu lực',
            duration: '15/01/2025 - 15/01/2026',
            startDate: '2025-01-15',
            endDate: '2026-01-15',
            personnel: [
                { role: 'Giám đốc dự án', name: 'Trần Hữu Hải' },
                { role: 'Chủ trì Kết cấu', name: 'Nguyễn Đức Thành' },
                { role: 'Chủ trì BIM', name: 'Lương Thành Hưng' }
            ],
            mainTasks: ['Lập mô hình BIM TKKT', 'Mô phỏng 4D Biện pháp thi công', 'Hồ sơ bản vẽ thi công', 'Báo cáo va chạm'],
            transactions: [
                {
                    id: 'TX-001',
                    amount: 1560000000,
                    paymentDate: '2025-01-20',
                    description: 'Tạm ứng hợp đồng đợt 1',
                    status: 'Paid',
                    invoiceNumber: 'HD-00123',
                    paymentMethod: 'Transfer'
                }
            ]
        },
        {
            projectId: HERO_PROJECT_ID,
            code: '02/2025/HĐ-TVTT',
            signedDate: '2025-02-10',
            packageName: 'Tư vấn Thẩm tra Thiết kế',
            projectName: 'Cầu Thủ Thiêm 4',
            location: 'TP.HCM',
            contractType: 'Tư vấn Thẩm tra',
            lawApplied: 'Luật Việt Nam',
            sideAName: 'Ban QLDA Giao thông TP.HCM',
            sideBName: 'CIC',
            totalValue: 850000000,
            paidValue: 0,
            remainingValue: 850000000,
            status: 'Mới',
            duration: '30 ngày',
            personnel: [
                { role: 'Chủ trì Thẩm tra', name: 'Vũ Văn Hòa' }
            ]
        }
    ];

    for (const c of contracts) {
        const { error } = await supabase.from('contracts').upsert(c, { onConflict: 'code' });
        if (error) console.error(`Error adding contract ${c.code}:`, error);
        else console.log(`Contract ${c.code} added.`);
    }

    // 3. CREATE TASKS (For RACI & Kanban)
    const raciTasks = [
        // PHASE 1: PREPARATION
        {
            code: '1.1.01', name: 'Họp khởi động dự án (Kick-off)',
            assignee: { name: 'Trần Hữu Hải', role: 'QLDA', raci: { R: 'Trần Hữu Hải', A: 'Nguyễn Hoàng Hà', C: 'Ban Giám Đốc', I: 'Toàn bộ team' } },
            startDate: '2025-01-16', dueDate: '2025-01-16', status: TaskStatus.COMPLETED, priority: TaskPriority.HIGH,
            tags: ['1. Chuẩn bị', 'Họp']
        },
        {
            code: '1.2.01', name: 'Phê duyệt Kế hoạch thực hiện BIM (BEP)',
            assignee: { name: 'Lương Thành Hưng', role: 'BIM Manager', raci: { R: 'Lương Thành Hưng', A: 'Trần Hữu Hải', C: 'TVBM', I: 'Khách hàng' } },
            startDate: '2025-01-17', dueDate: '2025-01-25', status: TaskStatus.COMPLETED, priority: TaskPriority.CRITICAL,
            progress: 100, tags: ['1. Chuẩn bị', 'BIM']
        },

        // PHASE 2: DESIGN (TKKT)
        {
            code: '2.1.01', name: 'Dựng mô hình Kết cấu nhịp chính (LOD 300)',
            assignee: { name: 'Nguyễn Đức Thành', role: 'Lead Structure', raci: { R: 'Nguyễn Đức Thành', A: 'Trần Hữu Hải', C: 'Lương Thành Hưng', I: 'Đội mô hình' } },
            startDate: '2025-02-01', dueDate: '2025-03-15', status: TaskStatus.S0, priority: TaskPriority.HIGH,
            progress: 60, tags: ['2. Thiết kế Kỹ thuật', 'Modeling', 'STR']
        },
        {
            code: '2.1.02', name: 'Dựng mô hình Kết cấu dẫn cầu Q7',
            assignee: { name: 'Trần Văn Nghĩa', role: 'Modeler', raci: { R: 'Trần Văn Nghĩa', A: 'Nguyễn Đức Thành' } },
            startDate: '2025-02-05', dueDate: '2025-03-20', status: TaskStatus.S0, priority: TaskPriority.MEDIUM,
            progress: 45, tags: ['2. Thiết kế Kỹ thuật', 'Modeling', 'STR']
        },
        {
            code: '2.2.01', name: 'Phối hợp hệ thống Chiếu sáng mỹ thuật',
            assignee: { name: 'Nguyễn Bá Nhiệm', role: 'Lead MEP', raci: { R: 'Nguyễn Bá Nhiệm', A: 'Trần Hữu Hải' } },
            startDate: '2025-03-01', dueDate: '2025-03-30', status: TaskStatus.OPEN, priority: TaskPriority.MEDIUM,
            progress: 0, tags: ['2. Thiết kế Kỹ thuật', 'MEP']
        },

        // PHASE 3: REVIEW & QC
        {
            code: '3.1.01', name: 'Kiểm tra va chạm (Clash Detection) Đợt 1',
            assignee: { name: 'Lương Thành Hưng', role: 'BIM Manager', raci: { R: 'Lương Thành Hưng', A: 'Trần Hữu Hải', I: 'Các bộ môn' } },
            startDate: '2025-03-25', dueDate: '2025-03-28', status: TaskStatus.OPEN, priority: TaskPriority.HIGH,
            tags: ['3. Kiểm soát chất lượng', 'QA/QC']
        },

        // PHASE 4: DOCUMENTATION
        {
            code: '4.1.01', name: 'Xuất bản vẽ 2D từ mô hình',
            assignee: { name: 'Vũ Ngọc Thủy', role: 'Lead Arch', raci: { R: 'Vũ Ngọc Thủy', A: 'Trần Hữu Hải' } },
            startDate: '2025-04-01', dueDate: '2025-04-15', status: TaskStatus.OPEN, priority: TaskPriority.MEDIUM,
            tags: ['4. Hồ sơ', 'Drawings']
        }
    ];

    // Clear existing tasks for this project to avoid duplicates/clutter
    await supabase.from('tasks').delete().eq('projectId', HERO_PROJECT_ID);

    for (const t of raciTasks) {
        const { error } = await supabase.from('tasks').insert({
            ...t,
            projectId: HERO_PROJECT_ID,
            id: undefined // Let DB gen ID
        });
        if (error) console.error(`Error creating task ${t.code}:`, error);
        else console.log(`Task ${t.code} created.`);
    }

    console.log('--- SEEDING COMPLETE ---');
}

seedHeroProject();
