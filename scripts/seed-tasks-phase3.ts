/**
 * Seed Tasks with RACI Integration - Phase 3
 * Automatically generates tasks based on RACI_TEMPLATES for each project
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { RACI_TEMPLATES } from '../raci-templates';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper to get date offset from today
function getDateOffset(daysOffset: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
}

// Helper to determine task status based on progress
function getTaskStatus(projectProgress: number, taskIndex: number, totalTasks: number): string {
    const taskProgress = (taskIndex / totalTasks) * 100;

    if (taskProgress < projectProgress - 20) return 'Hoàn thành';
    if (taskProgress < projectProgress) return 'Đang thực hiện';
    if (taskProgress < projectProgress + 10) return 'Mở';
    return 'Đang chờ';
}

// Helper to get assignee based on RACI role
function getAssigneeForRole(raciRoles: any): string | null {
    // Priority: R (Responsible) > A (Accountable)
    for (const [role, assignment] of Object.entries(raciRoles)) {
        if (assignment === 'R' || (assignment as string).includes('R')) {
            // Map role to employee ID
            const roleMapping: Record<string, string> = {
                'GĐTT': 'NV006', // Trần Hữu Hải
                'PGĐTT': 'NV003', // Lương Thanh Hưng
                'TBP ADMIN': 'NV007', // Đông Quỳnh
                'TBP QA/QC': 'NV005', // Nguyễn Đức Thành
                'TBM': 'NV015', // Vũ Văn Hòa
                'TVBM': 'NV008', // Đặng Trung Hiếu
                'TBP XTDA': 'NV004', // Nguyễn Quốc Anh
                'TBP R&D': 'NV005',
                'QLDA': 'NV006',
                'QL BIM': 'NV005', // Nguyễn Đức Thành
                'ĐPBM': 'NV015',
                'TNDH': 'NV016', // Trần Văn Nghĩa
                'NDH': 'NV019' // Vũ Ngọc Thủy
            };
            return roleMapping[role] || null;
        }
    }
    return null;
}

// Projects configuration
const PROJECTS = [
    { id: 'PRJ-SB-001', code: 'DA-2025-001', capital_source: 'StateBudget', progress: 35, name: 'Cầu Thủ Thiêm 4' },
    { id: 'PRJ-SB-002', code: 'DA-2025-002', capital_source: 'StateBudget', progress: 20, name: 'TTHC Quận 9' },
    { id: 'PRJ-SB-003', code: 'DA-2026-003', capital_source: 'StateBudget', progress: 5, name: 'Hồ Hoàn Kiếm' },
    { id: 'PRJ-NSB-001', code: 'DA-2024-VH01', capital_source: 'NonStateBudget', progress: 60, name: 'Vinhomes S1' },
    { id: 'PRJ-NSB-002', code: 'DA-2023-HP02', capital_source: 'NonStateBudget', progress: 100, name: 'Hòa Phát DQ' }
];

async function generateTasksForProject(project: any) {
    const template = RACI_TEMPLATES[project.capital_source as keyof typeof RACI_TEMPLATES];
    if (!template) {
        console.error(`No RACI template for ${project.capital_source}`);
        return [];
    }

    const tasks: any[] = [];
    let taskIndex = 0;
    let dayOffset = 0;

    for (const phaseData of template) {
        for (const taskTemplate of phaseData.tasks) {
            const assigneeId = getAssigneeForRole(taskTemplate.roles);
            const totalTasks = template.reduce((sum: number, p: { phase: string; tasks: any[] }) => sum + p.tasks.length, 0);
            const status = getTaskStatus(project.progress, taskIndex, totalTasks);

            // Calculate progress percentage for task
            let taskProgress = 0;
            if (status === 'Hoàn thành') taskProgress = 100;
            else if (status === 'Đang thực hiện') taskProgress = Math.floor(Math.random() * 40) + 30;
            else if (status === 'Mở') taskProgress = Math.floor(Math.random() * 20);

            tasks.push({
                project_id: project.id,
                code: `${project.code}-${taskTemplate.code}`,
                name: taskTemplate.name,
                assignee_id: assigneeId,
                status: status,
                priority: status === 'Hoàn thành' ? 'Trung bình' :
                    taskIndex < 5 ? 'Cao' :
                        Math.random() > 0.7 ? 'Khẩn cấp' : 'Trung bình',
                start_date: getDateOffset(dayOffset),
                due_date: getDateOffset(dayOffset + 7 + Math.floor(Math.random() * 14)),
                progress: taskProgress,
                tags: [phaseData.phase]
            });

            taskIndex++;
            dayOffset += Math.floor(Math.random() * 3) + 1;
        }
    }

    return tasks;
}

async function seedTasks() {
    console.log('\n✅ Seeding Tasks with RACI Integration...\n');

    let totalCreated = 0;

    for (const project of PROJECTS) {
        console.log(`   📊 ${project.name}...`);
        const tasks = await generateTasksForProject(project);

        let projectTaskCount = 0;
        for (const task of tasks) {
            const { error } = await supabase
                .from('tasks')
                .insert(task);

            if (error) {
                console.error(`      ❌ Error: ${error.message}`);
            } else {
                projectTaskCount++;
                totalCreated++;
            }
        }
        console.log(`      ✅ Created ${projectTaskCount} tasks`);
    }

    console.log(`\n   🎉 Total: ${totalCreated} tasks created with RACI integration`);
}

async function main() {
    console.log('🚀 Starting Phase 3: Tasks with RACI Seeding...\n');
    console.log('='.repeat(50));

    try {
        await seedTasks();

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 PHASE 3 SUMMARY\n');

        const { count: taskCount } = await supabase.from('tasks').select('*', { count: 'exact', head: true });

        console.log(`✅ Tasks:  ${taskCount} (with full RACI integration)`);
        console.log('\n🎉 Phase 3 seeding completed successfully!');
        console.log('='.repeat(50));

    } catch (error) {
        console.error('\n❌ Fatal error:', error);
        process.exit(1);
    }
}

main();
