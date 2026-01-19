import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://faxcibogggubmjsmtonz.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE5MzQ0OCwiZXhwIjoyMDgzNzY5NDQ4fQ.70lM9uuBJMvxlSqAsMUVisY-hwiscgHQiyDt_9mQBmA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const DEMO_PROJECTS = [
    {
        id: 'proj-demo-001',
        code: 'DEMO-001',
        name: 'BIM LOD400 - Vincom Metropolis Demo',
        client: 'Vingroup',
        location: 'Hà Nội',
        status: 'Đang thực hiện',
        progress: 75,
        budget: 2500000000,
        spent: 1800000000,
        deadline: '2025-06-30',
        thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'
    },
    {
        id: 'proj-demo-002',
        code: 'DEMO-002',
        name: 'Digital Twin - Ecopark Demo',
        client: 'Ecopark',
        location: 'Hưng Yên',
        status: 'Đang thực hiện',
        progress: 45,
        budget: 3800000000,
        spent: 1600000000,
        deadline: '2025-12-31',
        thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00'
    }
];

const DEMO_TASKS = [
    // PROJECT 1: BIM LOD400
    { id: 'task-demo-001', project_id: 'proj-demo-001', code: 'T001', name: 'Kick-off meeting và phân công', assignee_name: 'Trần Thị Bình', status: 'Hoàn thành', priority: 'Cao', start_date: '2025-01-02', due_date: '2025-01-02', progress: 100, description: 'Họp kick-off, phân công role, setup môi trường' },
    { id: 'task-demo-002', project_id: 'proj-demo-001', code: 'T002', name: 'Thu thập bản vẽ thiết kế', assignee_name: 'Lê Minh Châu', status: 'Hoàn thành', priority: 'Cao', start_date: '2025-01-03', due_date: '2025-01-05', progress: 100, description: 'Nhận bản vẽ kiến trúc, kết cấu, MEP' },
    { id: 'task-demo-003', project_id: 'proj-demo-001', code: 'T003', name: 'Setup BIM Execution Plan', assignee_name: 'Trần Thị Bình', status: 'S5 Đã duyệt', priority: 'Cao', start_date: '2025-01-06', due_date: '2025-01-08', progress: 95, description: 'Lập BEP, LOD requirements' },
    { id: 'task-demo-004', project_id: 'proj-demo-001', code: 'T004', name: 'Dựng model KT LOD 300 - Tầng hầm', assignee_name: 'Phạm Văn Dũng', status: 'S2 Kiểm tra chéo', priority: 'Cao', start_date: '2025-01-09', due_date: '2025-01-15', progress: 75, description: 'Model 2 tầng hầm: cột, dầm, sàn, tường' },
    { id: 'task-demo-005', project_id: 'proj-demo-001', code: 'T005', name: 'Dựng model KT LOD 300 - Tầng 1-5', assignee_name: 'Hoàng Thị Em', status: 'S1 Phối hợp', priority: 'Cao', start_date: '2025-01-10', due_date: '2025-01-20', progress: 45, description: 'Model tầng 1-5: layout, tường, cửa' },
    { id: 'task-demo-006', project_id: 'proj-demo-001', code: 'T006', name: 'Dựng model kết cấu - Móng', assignee_name: 'Phạm Văn Dũng', status: 'S0 Đang thực hiện', priority: 'Trung bình', start_date: '2025-01-16', due_date: '2025-01-25', progress: 30, description: 'Model móng, cọc, dầm móng' },
    { id: 'task-demo-007', project_id: 'proj-demo-001', code: 'T007', name: 'Dựng model MEP - Điện', assignee_name: 'Hoàng Thị Em', status: 'Mở', priority: 'Trung bình', start_date: '2025-01-20', due_date: '2025-02-05', progress: 0, description: 'Hệ thống điện, tủ, cáp' },
    { id: 'task-demo-008', project_id: 'proj-demo-001', code: 'T008', name: 'Clash Detection tầng hầm', assignee_name: 'Lê Minh Châu', status: 'S1 Phối hợp', priority: 'Cao', start_date: '2025-01-16', due_date: '2025-01-18', progress: 60, description: 'Chạy clash detection' },
    { id: 'task-demo-009', project_id: 'proj-demo-001', code: 'T009', name: 'Họp phối hợp clash', assignee_name: 'Trần Thị Bình', status: 'Đang thực hiện', priority: 'Cao', start_date: '2025-01-19', due_date: '2025-01-19', progress: 0, description: 'Họp giải quyết clash' },

    // PROJECT 2: Digital Twin
    { id: 'task-demo-013', project_id: 'proj-demo-002', code: 'T013', name: '3D Laser Scanning', assignee_name: 'Lê Minh Châu', status: 'S4 Lãnh đạo duyệt', priority: 'Cao', start_date: '2024-12-15', due_date: '2024-12-20', progress: 100, description: 'Quét 3D laser khu đô thị' },
    { id: 'task-demo-014', project_id: 'proj-demo-002', code: 'T014', name: 'Xử lý point cloud', assignee_name: 'Phạm Văn Dũng', status: 'S3 Duyệt nội bộ', priority: 'Cao', start_date: '2024-12-21', due_date: '2025-01-05', progress: 90, description: 'Import ReCap, làm sạch, mesh' },
    { id: 'task-demo-015', project_id: 'proj-demo-002', code: 'T015', name: 'Scan to BIM - Tòa A1', assignee_name: 'Hoàng Thị Em', status: 'S1 Phối hợp', priority: 'Cao', start_date: '2025-01-06', due_date: '2025-01-20', progress: 50, description: 'Model Revit LOD 350 từ point cloud' }
];

async function seed() {
    console.log('Upserting demo projects...');
    const { error: pError } = await supabase.from('projects').upsert(DEMO_PROJECTS);
    if (pError) {
        console.error('Error upserting projects:', pError);
        return;
    }
    console.log('✅ Projects upserted.');

    console.log('Upserting demo tasks...');
    const { error: tError } = await supabase.from('tasks').upsert(DEMO_TASKS);
    if (tError) {
        console.error('Error upserting tasks:', tError);
        return;
    }
    console.log('✅ Tasks upserted.');
}

seed();
