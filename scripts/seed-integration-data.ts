import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://faxcibogggubmjsmtonz.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE5MzQ0OCwiZXhwIjoyMDgzNzY5NDQ4fQ.70lM9uuBJMvxlSqAsMUVisY-hwiscgHQiyDt_9mQBmA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function seedTestProject() {
    console.log('🚀 Seeding test project for integration...');

    const project = {
        id: 'test-project-001',
        code: 'TEST-2025-001',
        name: 'Dự án Thử nghiệm Tích hợp Personnel',
        client: 'CIC Test Client',
        location: 'Hà Nội',
        manager_id: 'NV006', // Trần Hữu Hải
        status: 'In Progress',
        budget: 1000000000,
        spent: 400000000,
        progress: 45,
        capital_source: 'StateBudget'
    };

    const { error: prjError } = await supabase.from('projects').upsert(project);
    if (prjError) {
        console.error('❌ Error upserting project:', prjError.message);
        return;
    }
    console.log('✅ Project upserted.');

    const members = [
        { project_id: 'test-project-001', employee_id: 'NV006', role: 'QL BIM', raci: 'A' },
        { project_id: 'test-project-001', employee_id: 'NV005', role: 'ĐPBM', raci: 'R' },
        { project_id: 'test-project-001', employee_id: 'NV004', role: 'TNDH', raci: 'C' }
    ];

    for (const member of members) {
        const { error: memError } = await supabase.from('project_members').upsert(member, { onConflict: 'project_id, employee_id' });
        if (memError) console.error(`❌ Error upserting member ${member.employee_id}:`, memError.message);
        else console.log(`✅ Member ${member.employee_id} upserted.`);
    }

    const tasks = [
        {
            id: 'task-test-001',
            project_id: 'test-project-001',
            code: '1.1',
            name: 'Thiết lập môi trường BIM dự án',
            assignee_id: 'NV006',
            assignee_name: 'Trần Hữu Hải',
            assignee_role: 'QL BIM',
            status: 'Hoàn thành',
            priority: 'Cao',
            start_date: '2025-01-01',
            due_date: '2025-01-05',
            progress: 100,
            phase: '1. Xúc tiến Dự án'
        },
        {
            id: 'task-test-002',
            project_id: 'test-project-001',
            code: '2.1',
            name: 'Dựng mô hình kiến trúc sơ bộ',
            assignee_id: 'NV005',
            assignee_name: 'Nguyễn Đức Thành',
            assignee_role: 'ĐPBM',
            status: 'Đang thực hiện',
            priority: 'Trung bình',
            start_date: '2025-01-10',
            due_date: '2025-01-20',
            progress: 30,
            phase: '2. Báo giá'
        }
    ];

    for (const task of tasks) {
        const { error: taskError } = await supabase.from('tasks').upsert(task);
        if (taskError) console.error(`❌ Error upserting task ${task.code}:`, taskError.message);
        else console.log(`✅ Task ${task.code} upserted.`);
    }

    console.log('🎉 Integration test data seeded successfully!');
}

seedTestProject();
