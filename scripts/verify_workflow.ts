
import dotenv from 'dotenv';
dotenv.config();

import { Project, ProjectStatus } from '../types.ts';
import { supabase } from '../utils/supabaseClient';

async function testWorkflow() {
    console.log('Testing Automatic Task Generation...');

    // Dynamic import to ensure env is loaded first
    const { ProjectService } = await import('../services/project.service');

    // 1. Test State Budget Project
    const stateProject: Project = {
        id: `test-state-${Date.now()}`,
        code: `TEST-STATE-${Math.floor(Math.random() * 1000)}`,
        name: 'Dự án Vốn Ngân Sách Test',
        client: 'Ban QLDA Test',
        location: 'Hà Nội',
        manager: 'Test Manager',
        capitalSource: 'StateBudget',
        status: ProjectStatus.PLANNING,
        progress: 0,
        budget: 5000000000,
        spent: 0,
        deadline: new Date(Date.now() + 86400000 * 60).toISOString(),
        members: 5,
        thumbnail: 'https://via.placeholder.com/150'
    };

    console.log(`Creating State Budget Project: ${stateProject.code}`);
    const createdState = await ProjectService.createProject(stateProject);

    if (createdState) {
        console.log('State Project created.');
        // Verify Tasks
        const tasks = await ProjectService.getProjectTasks(createdState.id);
        console.log(`Generated ${tasks.length} tasks for State Budget project.`);

        if (tasks.length > 0) {
            const firstTask = tasks.find(t => t.code === '1.1');
            console.log('Task 1.1:', firstTask?.name, '| Role:', firstTask?.assignee?.role);
            if (firstTask?.assignee?.role === 'TBP XTDA') {
                console.log('✅ Role assignment correct (TBP XTDA)');
            } else {
                console.log('❌ Role assignment failed. Expected TBP XTDA, got', firstTask?.assignee?.role);
            }
        } else {
            console.log('❌ No tasks generated!');
        }
    }

    // 2. Test Non-State Budget Project
    const nonStateProject: Project = {
        id: `test-private-${Date.now()}`,
        code: `TEST-PVT-${Math.floor(Math.random() * 1000)}`,
        name: 'Dự án Vốn Ngoài NS Test',
        client: 'Private Corp',
        location: 'HCM',
        manager: 'Test Manager',
        capitalSource: 'NonStateBudget',
        status: ProjectStatus.PLANNING,
        progress: 0,
        budget: 2000000000,
        spent: 0,
        deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
        members: 3,
        thumbnail: 'https://via.placeholder.com/150'
    };

    console.log(`\nCreating Non-State Budget Project: ${nonStateProject.code}`);
    const createdNonState = await ProjectService.createProject(nonStateProject);

    if (createdNonState) {
        console.log('Non-State Project created.');
        const tasks = await ProjectService.getProjectTasks(createdNonState.id);
        console.log(`Generated ${tasks.length} tasks for Non-State Budget project.`);
    }

    // 3. Test Auto Project Code Generation
    console.log('\nTesting Project Code Generation...');
    const generatedCode = await ProjectService.generateProjectCode();
    console.log(`Generated Code: ${generatedCode}`);

    if (generatedCode.startsWith('26')) {
        console.log('✅ Generated code starts with 26 (Year)');
    } else {
        console.log('❌ Generated code format incorrect');
    }

    // Cleanup
    console.log('\nCleaning up test projects...');
    if (createdState) await ProjectService.deleteProject(createdState.id);
    if (createdNonState) await ProjectService.deleteProject(createdNonState.id);
    console.log('Cleanup complete.');
}

testWorkflow();
