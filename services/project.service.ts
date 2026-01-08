import { PROJECTS, TASKS, MOCK_CHECKLIST_LOGS, QUALITY_CHECKLISTS, EMPLOYEES, PROJECT_TEMPLATES } from '../constants';
import { Project, Task, ProjectStatus, RaciMatrix, WorkflowStep, ProjectTemplate, TaskStatus, TaskPriority } from '../types';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-Memory Storage for dynamic updates (initially loaded from constants)
// Note: In a real app, this would reset on reload. To persist, we'd use localStorage.
let localChecklistLogs = [...MOCK_CHECKLIST_LOGS];
let localTasks = [...TASKS];

export const ProjectService = {
    // --- PROJECT METHODS ---

    getProjects: async (): Promise<Project[]> => {
        await delay(300);
        return PROJECTS;
    },

    getProjectById: async (identifier: string): Promise<Project | undefined> => {
        await delay(200);
        return PROJECTS.find(p => p.id === identifier || p.code === identifier) || PROJECTS.find(p => p.code === identifier);
    },

    createProject: async (project: Project): Promise<Project | null> => {
        await delay(500);
        console.log('Mock Create Project:', project);
        return project;
    },

    updateProject: async (id: string, updates: Partial<Project>): Promise<Project | null> => {
        await delay(300);
        console.log('Mock Update Project:', id, updates);
        const project = PROJECTS.find(p => p.id === id);
        return project ? { ...project, ...updates } : null;
    },

    deleteProject: async (id: string): Promise<boolean> => {
        await delay(300);
        return true;
    },

    // --- ANALYTICS METHODS ---

    getProjectStats: async (): Promise<any> => {
        await delay(200);
        return {
            total: PROJECTS.length,
            active: PROJECTS.filter(p => p.status === ProjectStatus.IN_PROGRESS).length,
            delayed: PROJECTS.filter(p => p.status === ProjectStatus.DELAYED).length,
            completed: PROJECTS.filter(p => p.status === ProjectStatus.COMPLETED).length
        };
    },

    getProjectsWithFinancials: async (): Promise<Project[]> => {
        await delay(300);
        return PROJECTS; // Mocks already contain some financial data ideally
    },

    getDelayedProjects: async (): Promise<Project[]> => {
        await delay(200);
        return PROJECTS.filter(p => p.status === ProjectStatus.DELAYED);
    },

    // --- TASK METHODS ---

    getAllTasks: async (): Promise<any[]> => {
        await delay(400);
        // Join with Project and Employee data
        return localTasks.map(t => {
            const project = PROJECTS.find(p => p.id === t.projectId);
            const assignee = EMPLOYEES.find(e => e.name === t.assignee?.name);

            return {
                ...t,
                projectName: project?.name,
                projectCode: project?.code,
                client: project?.client,
                assignee: assignee ? {
                    id: assignee.id,
                    name: assignee.name,
                    avatar: assignee.avatar,
                    role: assignee.role
                } : t.assignee
            };
        });
    },

    getProjectTasks: async (projectId: string): Promise<Task[]> => {
        await delay(200);
        return localTasks.filter(t => t.projectId === projectId);
    },

    addTask: async (task: Task): Promise<Task> => {
        await delay(300);
        localTasks.push(task);
        return task;
    },

    updateTask: async (task: Task): Promise<Task> => {
        await delay(300);
        const index = localTasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
            localTasks[index] = { ...localTasks[index], ...task };
        }
        return task;
    },

    deleteTask: async (taskId: string): Promise<void> => {
        await delay(300);
        localTasks = localTasks.filter(t => t.id !== taskId);
    },

    // --- CHECKLIST METHODS ---

    getQualityChecklists: async (): Promise<any[]> => {
        await delay(200);
        return QUALITY_CHECKLISTS;
    },

    getTaskChecklistLogs: async (taskId: string): Promise<any[]> => {
        await delay(200);
        return localChecklistLogs.filter(l => l.taskId === taskId).map(l => ({
            item_id: l.itemId,
            checklist_id: l.checklistId,
            status: l.status
        }));
    },

    updateChecklistLog: async (log: { taskId: string, checklistId: string, itemId: string, status: boolean, checkedBy: string }): Promise<void> => {
        await delay(100);
        const existingIndex = localChecklistLogs.findIndex(l => l.taskId === log.taskId && l.checklistId === log.checklistId && l.itemId === log.itemId);

        const newLogEntry = {
            taskId: log.taskId,
            checklistId: log.checklistId,
            itemId: log.itemId,
            status: log.status ? 'Completed' : 'Pending',
            checkedBy: log.checkedBy,
            checkedAt: new Date().toISOString()
        };

        if (existingIndex >= 0) {
            localChecklistLogs[existingIndex] = newLogEntry;
        } else {
            localChecklistLogs.push(newLogEntry);
        }
        console.log('Mock Checklist Logs Updated. Total:', localChecklistLogs.length);
    },

    // --- OTHER METHODS (Stubs) ---

    getProjectWorkflows: async (projectId: string): Promise<Record<string, any>> => {
        await delay(100);
        return {}; // Return empty object - workflows are optional
    },

    getProjectRaci: async (projectId: string): Promise<any[]> => [],

    getProjectMembers: async (projectId: string) => {
        const roleMapping: Record<string, string> = {
            'Director': 'GĐTT', 'Vice Director': 'PGĐTT', 'BIM Manager': 'QL BIM',
            'Project Manager': 'QLDA', 'Coordinator': 'ĐPBM', 'BIM Coordinator': 'ĐPBM',
            'Team Leader': 'TNDH', 'Modeler': 'NDH', 'BIM Modeler': 'NDH',
            'Surveyor': 'NDH', 'Admin': 'TBP ADMIN', 'QA/QC': 'TBP QA/QC'
        };

        return EMPLOYEES.slice(0, 15).map((e, index) => {
            let projectRole = roleMapping[e.position] || roleMapping[e.role] || 'NDH';
            // Force key roles
            if (index === 0) projectRole = 'GĐTT';
            else if (index === 1) projectRole = 'QLDA';
            else if (index === 2) projectRole = 'QL BIM';
            else if (index === 3) projectRole = 'ĐPBM';
            else if (index === 4) projectRole = 'TNDH';

            const rates: Record<string, number> = {
                'GĐTT': 500000,
                'QL BIM': 350000,
                'QLDA': 300000,
                'ĐPBM': 250000,
                'TNDH': 200000,
                'NDH': 150000
            };

            return {
                id: 'pm-' + e.id,
                projectId: projectId,
                employeeId: e.id,
                role: e.role,
                projectRole: projectRole,
                hourlyRate: rates[projectRole] || 150000,
                allocation: Math.floor(Math.random() * 40) + 60,
                joinedAt: '2024-01-15',
                employee: e
            };
        });
    },

    addProjectMembers: async (projectId: string, members: any[]) => {
        await delay(300);
        console.log('Added members to project', projectId, members);
    },
    removeProjectMember: async () => { },

    syncRaciTasks: async (projectId: string) => {
        await delay(500);
        console.log('Synced RACI tasks for project', projectId);
    },

    getProjectContracts: async () => [],
    createContract: async () => { },
    getProjectRisks: async () => [],

    getTaskComments: async () => [],
    addTaskComment: async () => { },
    getTaskAttachments: async () => [],
    uploadTaskAttachment: async () => { },

    // --- PROJECT TEMPLATES ---
    getProjectTemplates: async (): Promise<ProjectTemplate[]> => {
        await delay(200);
        // Convert PROJECT_TEMPLATES to ProjectTemplate format
        return PROJECT_TEMPLATES.map(t => ({
            id: t.id,
            name: t.name,
            type: t.type,
            description: t.description,
            phases: (t.defaultPhases || []).map((phaseName, idx) => ({
                name: phaseName,
                tasks: (t.defaultTasks || [])
                    .filter(task => task.phase === phaseName)
                    .map((task, taskIdx) => ({
                        name: task.name,
                        code: `${idx + 1}.${taskIdx + 1}`,
                        duration: task.durationDays
                    }))
            }))
        }));
    },

    createTasksFromTemplate: async (projectId: string, template: ProjectTemplate): Promise<Task[]> => {
        await delay(500);
        const tasks: Task[] = [];
        let taskIndex = 0;

        template.phases.forEach((phase, phaseIdx) => {
            phase.tasks.forEach((taskDef, taskDefIdx) => {
                taskIndex++;
                const task: Task = {
                    id: `task-${projectId}-${taskIndex}`,
                    code: `${phaseIdx + 1}.${taskDefIdx + 1}`,
                    name: taskDef.name,
                    projectId: projectId,
                    assignee: {
                        name: 'Chưa phân công',
                        avatar: 'https://ui-avatars.com/api/?name=NA&background=random',
                        role: 'Staff'
                    },
                    status: TaskStatus.PENDING,
                    priority: TaskPriority.MEDIUM,
                    startDate: new Date().toISOString().split('T')[0],
                    dueDate: new Date(Date.now() + (taskDef.duration || 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    progress: 0
                };
                tasks.push(task);
                localTasks.push(task);
            });
        });

        console.log('Created tasks from template:', tasks.length);
        return tasks;
    }
};
