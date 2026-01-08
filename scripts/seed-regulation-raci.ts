
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- DATA FROM POLICY VIEWER ---
const RACI_HEADERS = [
    'STT', 'Nội dung công việc',
    'GĐTT', 'PGĐTT', 'TBP Admin', 'TBP QA/QC',
    'TBM', 'TVBM', 'TBP XTDA', 'TBP R&D',
    'QLDA', 'QL BIM', 'ĐPBM', 'TNDH', 'NDH'
];

const RACI_ROWS_25_10 = [
    ['1', 'Xúc tiến Dự án', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['1.1', 'Thuyết trình khách hàng', 'I/C', 'C', '', '', '', '', 'C', 'C', 'C', 'R', '', '', ''],
    ['1.2', 'Liên hệ khách hàng nắm bắt thông tin định kỳ', 'I', 'I', '', '', '', '', '', '', 'R', '', '', '', ''],
    ['1.3', 'Cập nhật danh mục khách hàng', 'I', 'I', 'I', 'I', 'I', 'I', 'R', '', '', '', '', '', ''],
    ['1.4', 'Thu thập dữ liệu đầu vào báo giá', 'I', 'I', 'I', 'I', 'I', '', 'R', '', '', '', '', '', ''],
    ['2', 'Báo giá', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['2.1', 'Tạo thư mục Dự án tiềm năng', 'I', 'I', 'I', 'I', 'I', '', 'R', '', '', '', '', '', ''],
    ['2.2', 'Chốt khối lượng báo giá', '', 'A', '', '', '', '', 'R', '', '', '', '', '', ''],
    ['2.3', 'Xem xét khả thi kỹ thuật', 'R', '', '', '', '', '', 'C', '', '', '', '', '', ''],
    ['2.4', 'Pre-Bep', 'I', 'A', '', '', '', '', 'R', '', 'C', '', '', '', ''],
    ['2.5', 'Lập báo giá', 'A', 'C', '', '', '', '', 'C', '', 'R', '', '', '', ''],
    ['2.6', 'Thu thập hồ sơ năng lực đấu thầu', 'C', 'C', 'R', '', 'C', 'C', 'A', '', '', '', '', '', ''],
    ['2.7', 'Theo dõi tình trạng báo giá', 'I', 'I', '', '', '', '', 'R', '', '', '', '', '', ''],
    ['3', 'Chuẩn bị', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['3.1', 'Bổ nhiệm QLDA/QLB', 'R', 'C', 'I', '', '', '', '', '', 'I', '', '', '', ''],
    ['3.2', 'Bổ nhiệm thành viên dự án', 'R', 'C', 'I', 'C', 'C', 'I', 'C', '', '', 'I', 'I', 'I', ''],
    ['3.3', 'Tạo lập Folder Dự án', 'R', '', '', '', '', '', '', '', '', 'I', 'I', 'I', 'I'],
    ['3.4', 'Tạo lập Dự án trên Bimcollab', 'R', '', '', '', '', '', '', '', '', 'I', 'I', 'I', 'I'],
    ['3.5', 'Thiết lập CDE dự án', 'R', '', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['3.6', 'Tạo Template dự án', '', 'A', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['3.7', 'Tạo lập nhóm trao đổi nội bộ', 'I', 'I', '', '', 'I', '', 'I', '', 'R', 'I', 'I', 'I', ''],
    ['3.8', 'Tạo lập nhóm trao đổi khách hàng', '', '', 'I', '', '', '', 'R', '', 'I', 'I', '', '', ''],
    ['4', 'Triển khai trình thẩm định', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['4.1', 'Dựng mô hình trình thẩm định', 'I', 'I', '', 'A', 'C', '', 'I', '', 'A', 'A', 'A', 'R', ''],
    ['4.2', 'Xuất bản vẽ trình thẩm định', 'I', 'I', '', 'A', 'C', '', 'I', '', 'A', 'A', 'A', 'R', ''],
    ['4.3', 'Xuất khối lượng trình thẩm định', 'I', 'I', '', 'A', 'C', '', 'I', '', 'A', 'A', 'A', 'R', ''],
    ['4.4', 'Tập hợp hồ sơ trình thẩm định', 'A', 'I', '', '', '', '', 'R', '', 'C', '', '', '', ''],
    ['4.5', 'Thu thập ý kiến thẩm định', 'I', '', '', '', '', '', 'R', '', 'I', 'I', 'I', 'I', ''],
    ['4.6', 'Cập nhật hồ sơ BIM', 'I', 'I', '', 'A', 'C', '', 'I', '', 'A', 'A', 'A', 'R', ''],
    ['4.7', 'Quản lý File trên CDE Nội bộ', 'I', '', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['4.8', 'Đồng bộ File lên CDE Dự án', 'I', '', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['5', 'Triển khai Hỗ trợ QLDA', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['5.1', 'Dựng mô hình hoàn thiện', 'I', 'I', '', 'A', 'C', '', 'I', '', 'A', 'A', 'A', 'R', ''],
    ['5.2', 'Triển khai ứng dụng BIM', 'I', 'I', '', 'A', 'C', '', 'C', '', 'A', 'A', 'A', 'R', ''],
    ['5.3', 'Quản lý File trên CDE Nội bộ', 'I', '', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['5.4', 'Đồng bộ File lên CDE Dự án', 'I', '', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['5.5', 'Bàn giao dữ liệu cho khách hàng', 'A', 'I', '', '', '', '', 'R', '', 'C', '', '', '', ''],
    ['6', 'Thanh quyết toán', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['6.1', 'Lập hồ sơ thanh toán từng giai đoạn', 'I', 'I', 'R', '', '', '', 'C', '', 'C', '', '', '', ''],
    ['6.2', 'Lập hồ sơ quyết toán', 'I', 'I', 'R', '', '', '', 'C', '', 'C', '', '', '', ''],
    ['6.3', 'Theo dõi tình trạng thanh toán', 'I', 'I', 'R', '', '', '', 'C', '', 'I', '', '', '', ''],
    ['7', 'Lưu trữ & Rút KN', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['7.1', 'Lưu trữ dữ liệu về Server TT', '', '', '', '', '', '', '', '', '', 'R', '', '', ''],
    ['7.2', 'Rút kinh nghiệm', 'I', 'I', '', '', '', '', '', 'C', 'R', 'C', 'C', 'C', '']
];

const RACI_ROWS_25_20 = [
    ['1', 'Xúc tiến Dự án', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['1.1', 'Thuyết trình khách hàng', 'I/C', 'C', '', '', '', '', 'C', 'C', 'C', 'R', '', '', ''],
    ['1.2', 'Liên hệ khách hàng', 'I', 'I', '', '', '', '', '', '', 'R', '', '', '', ''],
    ['1.3', 'Cập nhật danh mục', 'I', 'I', 'I', 'I', 'I', 'I', 'R', '', '', '', '', '', ''],
    ['1.4', 'Thu thập dữ liệu đầu vào', 'I', 'I', 'I', 'I', 'I', '', 'R', '', '', '', '', '', ''],
    ['2', 'Báo giá', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['2.1', 'Tạo thư mục tiềm năng', 'I', 'I', 'I', 'I', 'I', '', 'R', '', '', '', '', '', ''],
    ['2.2', 'Chốt khối lượng', '', 'A', '', '', '', '', 'R', '', '', '', '', '', ''],
    ['2.3', 'Khả thi kỹ thuật', 'R', '', '', '', '', '', 'C', '', '', '', '', '', ''],
    ['2.4', 'Pre-Bep', 'I', 'A', '', '', '', '', 'R', '', 'C', '', '', '', ''],
    ['2.5', 'Lập báo giá', 'A', 'C', '', '', '', '', 'C', '', 'R', '', '', '', ''],
    ['2.6', 'Hồ sơ năng lực', 'C', 'C', 'R', '', 'C', 'C', 'A', '', '', '', '', '', ''],
    ['2.7', 'Theo dõi báo giá', 'I', 'I', '', '', '', '', 'R', '', '', '', '', '', ''],
    ['3', 'Chuẩn bị', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['3.1', 'Bổ nhiệm QLDA/QLB', 'R', 'C', 'I', '', '', '', '', '', 'I', '', '', '', ''],
    ['3.2', 'Bổ nhiệm thành viên', 'R', 'C', 'I', 'C', 'C', 'I', 'C', '', '', 'I', 'I', 'I', ''],
    ['3.3', 'Tạo Folder', 'R', '', '', '', '', '', '', '', '', 'I', 'I', 'I', 'I'],
    ['3.4', 'Tạo Bimcollab', 'R', '', '', '', '', '', '', '', '', 'I', 'I', 'I', 'I'],
    ['3.5', 'Thiết lập CDE', 'R', '', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['3.6', 'Template', '', 'A', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['3.7', 'Nhóm nội bộ', 'I', 'I', '', '', 'I', '', 'I', '', 'R', 'I', 'I', 'I', ''],
    ['3.8', 'Nhóm khách hàng', '', '', 'I', '', '', '', 'R', '', 'I', 'I', '', '', ''],
    ['4', 'Triển khai Hỗ trợ QLDA', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['4.1', 'Dựng mô hình hoàn thiện', 'I', 'I', '', 'A', 'C', '', 'I', '', 'A', 'A', 'A', 'R', ''],
    ['4.2', 'Triển khai ứng dụng BIM', 'I', 'I', '', 'A', 'C', '', 'C', '', 'A', 'A', 'A', 'R', ''],
    ['4.3', 'Quản lý File CDE Nội bộ', 'I', '', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['4.4', 'Đồng bộ CDE Dự án', 'I', '', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['4.5', 'Bàn giao dữ liệu', 'A', 'I', '', '', '', '', 'R', '', 'C', '', '', '', ''],
    ['5', 'Thanh quyết toán', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['5.1', 'Hồ sơ thanh toán', 'I', 'I', 'R', '', '', '', 'C', '', 'C', '', '', '', ''],
    ['5.2', 'Hồ sơ quyết toán', 'I', 'I', 'R', '', '', '', 'C', '', 'C', '', '', '', ''],
    ['5.3', 'Theo dõi thanh toán', 'I', 'I', 'R', '', '', '', 'C', '', 'I', '', '', '', ''],
    ['6', 'Lưu trữ', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['6.1', 'Lưu trữ dữ liệu', '', '', '', '', '', '', '', '', '', 'R', '', '', ''],
    ['6.2', 'Rút kinh nghiệm', 'I', 'I', '', '', '', '', '', 'C', 'R', 'C', 'C', 'C', '']
];


// MOCK USERS FOR ROLES
const USER_MAP: Record<string, any> = {
    'GĐTT': { name: 'Nguyễn Hoàng Hà', role: 'Giám đốc', avatar: 'https://i.pravatar.cc/150?u=1' },
    'PGĐTT': { name: 'Nguyễn Bá Nhiệm', role: 'Phó giám đốc', avatar: 'https://i.pravatar.cc/150?u=2' },
    'TBP Admin': { name: 'Đào Đông Quỳnh', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=3' },
    'TBP QA/QC': { name: 'Phạm Thị Hương', role: 'QA/QC', avatar: 'https://i.pravatar.cc/150?u=4' },
    'QL BIM': { name: 'Nguyễn Quốc Anh', role: 'BIM Manager', avatar: 'https://i.pravatar.cc/150?u=5' },
    'QLDA': { name: 'Trần Văn Tú', role: 'PM', avatar: 'https://i.pravatar.cc/150?u=6' },
    'TNDH': { name: 'Lê Văn Luyện', role: 'Leader', avatar: 'https://i.pravatar.cc/150?u=7' },
    'NDH': { name: 'Vũ Văn Hòa', role: 'Staff', avatar: 'https://i.pravatar.cc/150?u=8' },
    'TBP XTDA': { name: 'Nguyễn Quốc Anh', role: 'Sales', avatar: 'https://i.pravatar.cc/150?u=5' }
};

// --- SEED FUNCTION ---
async function seedByRegulation() {
    console.log('Seeding tasks based on Regulation 25.10 & 25.20...');

    // 1. Get All Projects
    const { data: projects, error } = await supabase.from('projects').select('id, code, name, capitalSource, status');
    if (error) { console.error(error); return; }

    // 2. Clear Existing RACI Tasks (Assume tags contain RACI)
    // await supabase.from('tasks').delete().like('tags', '%RACI%'); // Careful, deleting might be too aggressive if user made edits. 
    // Let's just append or update. To be clean, maybe delete tasks created by previous seed (check tag).
    await supabase.from('tasks').delete().contains('tags', ['RACI']);

    let totalTasks = 0;

    for (const proj of projects) {
        // Determine Matrix
        // Assuming 'StateBudget' -> 25.10, others -> 25.20
        const isState = proj.capitalSource === 'StateBudget' || proj.name?.toLowerCase().includes('bệnh viện') || proj.name?.toLowerCase().includes('ban quản lý');
        const matrix = isState ? RACI_ROWS_25_10 : RACI_ROWS_25_20;
        const matrixName = isState ? '25.10 - Vốn Ngân Sách' : '25.20 - Vốn Ngoài NS';

        console.log(`Project ${proj.code}: Using ${matrixName}`);

        const tasksToInsert = [];
        let currentPhase = 'Khác';

        for (const row of matrix) {
            const stt = row[0] as string; // '1', '1.1'
            const content = row[1] as string; // 'Xúc tiến Dự án'

            // Check if it's a Header Row (Level 1, e.g. '1', '2')
            if (!stt.includes('.')) {
                currentPhase = `${stt}. ${content}`;
                continue; // Don't create task for header, just set phase
            }

            // It's a Task Row
            // Parse Roles from Columns 2-14
            const raciMap: Record<string, string> = {};
            let responsibilityUser = null;

            // Map columns to Roles
            // 2: GĐTT, 3: PGĐTT ... 14: NDH
            for (let i = 2; i < row.length; i++) {
                const roleCode = RACI_HEADERS[i];
                const val = row[i] as string;
                if (val && val.trim() !== '') {
                    raciMap[roleCode] = val;
                    if (val.includes('R') && !responsibilityUser) {
                        responsibilityUser = USER_MAP[roleCode];
                    }
                }
            }

            // Fallback user
            if (!responsibilityUser) responsibilityUser = USER_MAP['NDH'];

            tasksToInsert.push({
                code: `${proj.code}-${stt}`,
                name: `${stt} ${content}`,
                projectId: proj.id,
                assignee: {
                    name: responsibilityUser.name,
                    avatar: responsibilityUser.avatar,
                    role: responsibilityUser.role,
                    raci: raciMap // Store exact matrix here
                },
                status: 'Mở',
                priority: 'Trung bình',
                startDate: new Date().toISOString(),
                dueDate: new Date(Date.now() + 86400000 * 30).toISOString(),
                tags: ['RACI', 'Regulation', currentPhase], // Tag with Phase Name for grouping
                progress: 0
            });
        }

        if (tasksToInsert.length > 0) {
            const { error: insErr } = await supabase.from('tasks').insert(tasksToInsert);
            if (!insErr) totalTasks += tasksToInsert.length;
        }
    }

    console.log(`Done. Seeded ${totalTasks} regulation tasks.`);
}

seedByRegulation();
