
import dotenv from 'dotenv';
dotenv.config();

import { Project, ProjectStatus } from '../types';

async function testProjectCreation() {
    console.log('Testing Project Creation...');

    // Dynamic import to ensure env is loaded first
    const { ProjectService } = await import('../services/project.service');

    const newProject: Project = {
        id: `test-proj-${Date.now()}`,
        code: `TEST-${Math.floor(Math.random() * 1000)}`,
        name: 'Dự án Test Tự Động (Real DB)',
        client: 'Client Test',
        location: 'Hà Nội',
        manager: 'Test Manager',
        projectGroup: 'Nhóm C',
        constructionType: 'Công trình dân dụng',
        constructionLevel: 'Cấp IV',
        scale: 'N/A',
        capitalSource: 'NonStateBudget',
        status: ProjectStatus.PLANNING,
        progress: 0,
        budget: 1000000000,
        spent: 0,
        deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
        members: 5,
        thumbnail: 'https://via.placeholder.com/150'
    };

    console.log('Creating project:', newProject.code);
    const created = await ProjectService.createProject(newProject);

    if (created) {
        console.log('Project created successfully!');

        // Verify fetch
        console.log('Fetching project back...');
        const fetched = await ProjectService.getProjectById(newProject.id);
        if (fetched) {
            console.log('Project fetched successfully:', fetched.name);
            if (fetched.name === newProject.name) {
                console.log('TEST PASSED: Project data matches.');
            } else {
                console.error('TEST FAILED: Data mismatch.');
            }
        } else {
            console.error('TEST FAILED: Could not fetch created project.');
        }
    } else {
        console.error('TEST FAILED: Project creation returned null.');
    }
}

testProjectCreation();
