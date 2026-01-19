import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://faxcibogggubmjsmtonz.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE5MzQ0OCwiZXhwIjoyMDgzNzY5NDQ4fQ.70lM9uuBJMvxlSqAsMUVisY-hwiscgHQiyDt_9mQBmA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function seedProjectTasks() {
    console.log('🚀 Seeding project tasks...\n');

    // 1. Get all projects with capital_source
    const { data: projects, error: prjError } = await supabase
        .from('projects')
        .select('id, code, name, capital_source');

    if (prjError) {
        console.error('❌ Error fetching projects:', prjError);
        return;
    }

    console.log(`📊 Found ${projects.length} projects\n`);

    let totalTasks = 0;

    // 2. For each project, get task templates and create tasks
    for (const project of projects) {
        const capitalSource = project.capital_source || 'NonStateBudget';

        // Get task templates for this capital source
        const { data: templates, error: templateError } = await supabase
            .from('task_templates')
            .select('*')
            .eq('capital_source', capitalSource)
            .order('offset_days');

        if (templateError) {
            console.error(`❌ Error fetching templates for ${project.code}:`, templateError.message);
            continue;
        }

        if (!templates || templates.length === 0) {
            console.warn(`⚠️  No templates found for ${capitalSource}, skipping ${project.code}`);
            continue;
        }

        // Get project members to assign tasks
        const { data: members, error: memberError } = await supabase
            .from('project_members')
            .select('employee_id, role, raci')
            .eq('project_id', project.id);

        if (memberError || !members || members.length === 0) {
            console.warn(`⚠️  No members found for ${project.code}, skipping tasks`);
            continue;
        }

        // Get employee details
        const { data: employees, error: empError } = await supabase
            .from('employees')
            .select('id, name, avatar, role')
            .in('id', members.map(m => m.employee_id));

        if (empError || !employees) {
            console.warn(`⚠️  Error fetching employees for ${project.code}`);
            continue;
        }

        // Create tasks from templates
        const tasks = [];
        const baseDate = new Date();

        for (const template of templates.slice(0, 10)) { // Limit to 10 tasks per project
            // Assign to random member
            const randomMember = members[Math.floor(Math.random() * members.length)];
            const assignee = employees.find(e => e.id === randomMember.employee_id) || employees[0];

            const startDate = new Date(baseDate);
            startDate.setDate(startDate.getDate() + (template.offset_days || 0));

            const dueDate = new Date(startDate);
            dueDate.setDate(dueDate.getDate() + (template.duration_days || 5));

            tasks.push({
                project_id: project.id,
                code: template.code || `${tasks.length + 1}`,
                name: template.name,
                assignee_id: assignee.id,
                assignee_name: assignee.name,
                assignee_avatar: assignee.avatar,
                assignee_role: template.default_assignee_role || assignee.role,
                status: tasks.length === 0 ? 'Hoàn thành' : (tasks.length < 2 ? 'Đang thực hiện' : 'Mở'),
                priority: tasks.length < 3 ? 'Cao' : 'Trung bình',
                start_date: startDate.toISOString().split('T')[0],
                due_date: dueDate.toISOString().split('T')[0],
                progress: tasks.length === 0 ? 100 : (tasks.length === 1 ? 50 : 0),
                phase: template.phase
            });
        }

        // Insert tasks
        if (tasks.length > 0) {
            const { error: taskError } = await supabase
                .from('tasks')
                .insert(tasks);

            if (taskError) {
                console.error(`❌ Error seeding tasks for ${project.code}:`, taskError.message);
            } else {
                console.log(`✅ [${project.code}] ${project.name}: ${tasks.length} tasks`);
                totalTasks += tasks.length;
            }
        }
    }

    console.log(`\n🎉 Seeded ${totalTasks} tasks for ${projects.length} projects!`);
}

seedProjectTasks();
