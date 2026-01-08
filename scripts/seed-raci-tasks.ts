
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const PHASES = [
    { name: 'Khởi tạo', tasks: ['Phê duyệt chủ trương', 'Khảo sát hiện trạng', 'Lập nhiệm vụ thiết kế'] },
    { name: 'Thiết kế', tasks: ['Thiết kế ý tưởng (Concept)', 'Phê duyệt ý tưởng', 'Thiết kế cơ sở', 'Thiết kế kỹ thuật'] },
    { name: 'Thi công', tasks: ['Mời thầu', 'Đánh giá thầu', 'Giám sát thi công', 'Nghiệm thu giai đoạn'] },
    { name: 'Hoàn thành', tasks: ['Nghiệm thu đưa vào sử dụng', 'Quyết toán'] }
];

const ROLES = ['PM', 'Team Leader', 'Member', 'Director'];

async function seedRaciTasks() {
    console.log('Seeding RACI tasks...');

    // 1. Get Projects
    const { data: projects, error } = await supabase.from('projects').select('id, code, name'); // Seed for ALL projects
    if (error || !projects) { console.error('Error fetching projects', error); return; }

    let totalTasks = 0;

    for (const proj of projects) {
        console.log(`Processing project: ${proj.code}`);
        const tasksToInsert = [];

        // 2. Generate Tasks per Phase
        for (const phase of PHASES) {
            for (const taskName of phase.tasks) {
                // Determine Status randomly
                const statusOptions = ['Mở', 'Đang thực hiện', 'Chờ duyệt', 'Hoàn thành'];
                const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

                // Assignee Mock
                const assignee = {
                    name: `User ${Math.floor(Math.random() * 10)}`,
                    role: ROLES[Math.floor(Math.random() * ROLES.length)],
                    avatar: `https://i.pravatar.cc/150?u=${Math.random()}`
                };

                // RACI Simulation in JSONB
                const raci = {
                    R: assignee.name,
                    A: 'Director',
                    C: 'Expert',
                    I: 'All Staff'
                };

                tasksToInsert.push({
                    code: `${proj.code}-${phase.name.substring(0, 2).toUpperCase()}-${Math.floor(Math.random() * 100)}`,
                    name: `${phase.name}: ${taskName}`,
                    projectId: proj.id,
                    assignee: { ...assignee, raci }, // Store RACI in assignee for now
                    status: status,
                    priority: ['Cao', 'Trung bình', 'Thấp'][Math.floor(Math.random() * 3)],
                    startDate: new Date().toISOString(),
                    dueDate: new Date(Date.now() + 86400000 * 10).toISOString(), // +10 days
                    progress: status === 'Hoàn thành' ? 100 : Math.floor(Math.random() * 80),
                    tags: ['RACI', 'ClickUp-Sync', phase.name]
                });
            }
        }

        const { error: insertError } = await supabase.from('tasks').insert(tasksToInsert);
        if (insertError) {
            console.error(`Failed to insert tasks for ${proj.code}:`, insertError);
        } else {
            console.log(`Included ${tasksToInsert.length} tasks for ${proj.code}`);
            totalTasks += tasksToInsert.length;
        }
    }

    console.log(`Seeding complete. Total tasks: ${totalTasks}`);
}

seedRaciTasks();
