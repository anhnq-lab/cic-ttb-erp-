import { supabase } from '../utils/supabaseClient';
import { Project, Task, ProjectStatus, RaciMatrix, WorkflowStep, ProjectTemplate, TaskStatus, TaskPriority } from '../types';
import { PROJECTS, EMPLOYEES } from '../constants'; // Fallback for mocks
import { generateTasksForProject, syncProjectProgress } from '../utils/projectTaskHelpers';

// Helper to map DB snake_case to App camelCase (simplified for new schema)
const mapProjectFromDB = (p: any): Project => ({
    id: p.id,
    code: p.code,
    name: p.name,
    client: p.client || '',
    location: p.location || '',
    manager: p.manager_id || '',
    status: p.status as ProjectStatus,
    progress: p.progress || 0,
    budget: Number(p.budget) || 0,
    spent: Number(p.spent) || 0,
    deadline: p.deadline || '',
    thumbnail: p.thumbnail || '',
    // Default values for fields not in new schema
    projectGroup: '',
    constructionType: '',
    constructionLevel: '',
    scale: '',
    capitalSource: p.capital_source || 'NonStateBudget',
    members: 0,
    serviceType: '',
    area: '',
    unitPrice: '',
    phase: '',
    scope: '',
    statusDetail: '',
    failureReason: '',
    folderUrl: '',
    completedAt: null,
    deliverables: ''
});

// Helper to map App camelCase to DB snake_case (simplified for new schema)
const mapProjectToDB = (p: Partial<Project>) => ({
    code: p.code,
    name: p.name,
    client: p.client,
    location: p.location,
    manager_id: p.manager,
    status: p.status,
    progress: p.progress,
    budget: p.budget,
    spent: p.spent,
    start_date: p.deadline, // Map deadline to start_date for now
    deadline: p.deadline,
    thumbnail: p.thumbnail,
    description: p.deliverables, // Map deliverables to description
    capital_source: p.capitalSource || 'NonStateBudget'
});

// --- VALIDATION HELPERS ---
const validateManagerExists = async (managerId: string): Promise<boolean> => {
    if (!managerId) return true; // Allow empty manager

    const { data, error } = await supabase
        .from('employees')
        .select('id, name')
        .eq('id', managerId)
        .single();

    if (error || !data) {
        throw new Error(`Manager với ID "${managerId}" không tồn tại trong hệ thống`);
    }

    console.log(`✅ Manager validated: ${data.name}`);
    return true;
};

const validateProjectData = async (project: Partial<Project>): Promise<void> => {
    // Validate required fields
    if (!project.name) {
        throw new Error('Tên dự án không được để trống');
    }

    if (!project.code) {
        throw new Error('Mã dự án không được để trống');
    }

    // Validate manager if provided
    if (project.manager) {
        await validateManagerExists(project.manager);
    }

    // Validate budget > 0
    if (project.budget && project.budget < 0) {
        throw new Error('Ngân sách phải lớn hơn 0');
    }
};

export const ProjectService = {
    // --- PROJECT METHODS ---

    // Generate Project Code: 26xxx (e.g., 26001)
    generateProjectCode: async (): Promise<string> => {
        const currentYear = new Date().getFullYear().toString().slice(-2); // "26"
        const prefix = `${currentYear}`;

        // Find the latest project with code starting with "26"
        const { data, error } = await supabase
            .from('projects')
            .select('code')
            .ilike('code', `${prefix}%`)
            .order('code', { ascending: false })
            .limit(1)
            .single();

        let sequence = 1;
        if (data && data.code) {
            // Extract sequence part (assuming 26001 format)
            const existingSequence = parseInt(data.code.substring(2));
            if (!isNaN(existingSequence)) {
                sequence = existingSequence + 1;
            }
        }

        // Format: 26 + 3 digits (e.g., 001) -> 26001
        return `${prefix}${sequence.toString().padStart(3, '0')}`;
    },

    getProjects: async (): Promise<Project[]> => {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching projects:', error);
            return PROJECTS; // Fallback to mock if API fails/not ready
        }

        return data.map(mapProjectFromDB);
    },

    getProjectById: async (identifier: string): Promise<Project | undefined> => {
        // Try to find by ID first
        let { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', identifier)
            .single();

        if (error || !data) {
            // Try by code
            const { data: dataCode, error: errorCode } = await supabase
                .from('projects')
                .select('*')
                .eq('code', identifier)
                .single();

            data = dataCode;
            error = errorCode;
        }

        if (error || !data) return undefined;
        return mapProjectFromDB(data);
    },

    createProject: async (project: Project): Promise<Project | null> => {
        try {
            // VALIDATE DATA FIRST
            await validateProjectData(project);

            const dbPayload = mapProjectToDB(project);
            // Remove undefined fields
            Object.keys(dbPayload).forEach(key => (dbPayload as any)[key] === undefined && delete (dbPayload as any)[key]);

            const { data, error } = await supabase
                .from('projects')
                .insert([dbPayload])
                .select()
                .single();

            if (error) {
                console.error('Error creating project:', error);
                throw new Error(error.message || 'Lỗi khi tạo dự án');
            }

            const newProject = mapProjectFromDB(data);

            // --- AUTOMATIC TASK GENERATION ---
            try {
                await ProjectService.generateTasksFromTemplate(newProject.id, project.capitalSource || 'NonStateBudget', project.deadline);
            } catch (taskError) {
                console.error('Error generating automatic tasks:', taskError);
                // Don't fail the project creation if task gen fails, but log it
            }

            return newProject;
        } catch (validationError: any) {
            console.error('Project validation failed:', validationError);
            throw validationError; // Re-throw to caller can handle
        }
    },

    generateTasksFromTemplate: async (projectId: string, capitalSource: string, projectStartDate?: string) => {
        // 1. Fetch Templates
        const { data: templates, error } = await supabase
            .from('task_templates')
            .select('*')
            .eq('capital_source', capitalSource)
            .order('code', { ascending: true }); // Ensure order

        if (error || !templates || templates.length === 0) {
            console.log('No templates found for', capitalSource);
            return;
        }

        const startDate = projectStartDate ? new Date(projectStartDate) : new Date();

        // 2. Prepare Task Payloads
        const tasksToInsert = templates.map(t => {
            // Calculate Dates
            const taskStart = new Date(startDate);
            taskStart.setDate(startDate.getDate() + (t.offset_days || 0));

            const taskDue = new Date(taskStart);
            taskDue.setDate(taskStart.getDate() + (t.duration_days || 1));

            // Determine Assignee Role (Find 'R' in RACI)
            let assigneeRole = 'Staff';
            if (t.raci_matrix) {
                const raci = t.raci_matrix as Record<string, string>;
                const responsibleRole = Object.keys(raci).find(role => raci[role]?.includes('R'));
                if (responsibleRole) assigneeRole = responsibleRole;
            }

            return {
                project_id: projectId,
                code: t.code,
                name: t.name,
                phase: t.phase,
                assignee_role: assigneeRole,
                assignee_name: 'Unassigned', // To be assigned later
                status: 'Mở', // TaskStatus.OPEN
                priority: 'Trung bình', // TaskPriority.MEDIUM
                start_date: taskStart.toISOString(),
                due_date: taskDue.toISOString(),
                progress: 0
            };
        });

        // 3. Insert Tasks
        const { error: insertError } = await supabase
            .from('tasks')
            .insert(tasksToInsert);

        if (insertError) {
            console.error('Failed to insert template tasks:', insertError);
            throw insertError;
        }
    },

    updateProject: async (id: string, updates: Partial<Project>): Promise<Project | null> => {
        try {
            // VALIDATE DATA BEFORE UPDATE
            if (updates.manager !== undefined) {
                await validateManagerExists(updates.manager);
            }

            const dbPayload = mapProjectToDB(updates);
            // Remove undefined fields
            Object.keys(dbPayload).forEach(key => (dbPayload as any)[key] === undefined && delete (dbPayload as any)[key]);

            const { data, error } = await supabase
                .from('projects')
                .update(dbPayload)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating project:', error);
                throw new Error(error.message || 'Lỗi khi cập nhật dự án');
            }
            return mapProjectFromDB(data);
        } catch (validationError: any) {
            console.error('Project update validation failed:', validationError);
            throw validationError;
        }
    },

    deleteProject: async (id: string): Promise<boolean> => {
        // Delete related tasks first (if cascade not set)
        await supabase.from('tasks').delete().eq('project_id', id);

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting project:', error);
            return false;
        }
        return true;
    },

    // --- ANALYTICS METHODS ---

    getProjectStats: async (): Promise<any> => {
        const { data, error } = await supabase
            .from('projects')
            .select('status');

        if (error) return { total: 0, active: 0, delayed: 0, completed: 0 };

        return {
            total: data.length,
            active: data.filter(p => p.status === ProjectStatus.IN_PROGRESS).length,
            delayed: data.filter(p => p.status === ProjectStatus.DELAYED).length,
            completed: data.filter(p => p.status === ProjectStatus.COMPLETED).length
        };
    },

    getProjectsWithFinancials: async (): Promise<Project[]> => {
        // For MVP, just return projects. Real implementation would join contracts/invoices
        return ProjectService.getProjects();
    },

    getDelayedProjects: async (): Promise<Project[]> => {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('status', ProjectStatus.DELAYED);

        if (error) return [];
        return data.map(mapProjectFromDB);
    },

    // --- TASK METHODS (Legacy Wrapper or Migration?) ---
    // For now, these are still needed by UI components until we migrate TaskService
    // We will leave them broken or mock-connected for a moment while we focus on Projects

    getAllTasks: async (): Promise<any[]> => {
        // Temporary: still return mocks to avoid breaking everything immediately
        console.warn('getAllTasks is still mocked - migrate TaskService next');
        return [];
    },

    getProjectTasks: async (projectId: string): Promise<Task[]> => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('project_id', projectId);

        if (error) return [];

        // Map tasks
        return data.map((t: any) => ({
            id: t.id,
            code: t.code,
            name: t.name,
            projectId: t.project_id,
            assignee: {
                name: t.assignee_name || 'Unassigned',
                avatar: t.assignee_avatar || '',
                role: t.assignee_role || 'Staff',
                id: t.assignee_id
            },
            status: t.status as TaskStatus,
            priority: t.priority as TaskPriority,
            startDate: t.start_date,
            dueDate: t.due_date,
            progress: t.progress
        }));
    },

    addTask: async (task: Task): Promise<Task> => {
        // Basic insert
        const payload = {
            project_id: task.projectId,
            code: task.code,
            name: task.name,
            assignee_name: task.assignee.name,
            assignee_avatar: task.assignee.avatar,
            assignee_role: task.assignee.role,
            status: task.status,
            priority: task.priority,
            start_date: task.startDate,
            due_date: task.dueDate,
            progress: task.progress
        };

        const { data, error } = await supabase.from('tasks').insert([payload]).select().single();
        if (error) throw error;
        return { ...task, id: data.id };
    },

    updateTask: async (task: Task): Promise<Task> => {
        const payload = {
            name: task.name,
            status: task.status,
            priority: task.priority,
            progress: task.progress
        };
        await supabase.from('tasks').update(payload).eq('id', task.id);
        return task;
    },

    deleteTask: async (taskId: string): Promise<void> => {
        await supabase.from('tasks').delete().eq('id', taskId);
    },

    // --- CHECKLIST METHODS ---

    getQualityChecklists: async (): Promise<any[]> => {
        const { data, error } = await supabase
            .from('checklist_templates')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching checklist templates:', error);
            return [];
        }

        return data.map(t => ({
            id: t.id,
            name: t.name,
            department: t.department_id,
            items: t.items
        }));
    },

    getTaskChecklistLogs: async (taskId: string): Promise<any[]> => {
        const { data, error } = await supabase
            .from('checklist_logs')
            .select('*, completed_by_emp:employees(*)')
            .eq('task_id', taskId)
            .order('completed_at', { ascending: false });

        if (error) {
            console.error('Error fetching checklist logs:', error);
            return [];
        }

        return data.map(log => ({
            id: log.id,
            taskId: log.task_id,
            templateId: log.template_id,
            results: log.results,
            completedBy: log.completed_by_emp?.name || 'Unknown',
            completedAt: log.completed_at,
            status: log.status
        }));
    },

    updateChecklistLog: async (log: any): Promise<void> => {
        const payload = {
            task_id: log.taskId,
            template_id: log.templateId,
            results: log.results,
            completed_by: log.completedByUserId, // Assuming we pass user ID
            status: log.status,
            updated_at: new Date().toISOString()
        };

        if (log.id) {
            const { error } = await supabase
                .from('checklist_logs')
                .update(payload)
                .eq('id', log.id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('checklist_logs')
                .insert([payload]);
            if (error) throw error;
        }
    },

    // --- OTHER METHODS ---

    getProjectWorkflows: async (projectId: string): Promise<Record<string, any>> => {
        return {};
    },

    getProjectRaci: async (projectId: string): Promise<any[]> => {
        const { data: project } = await supabase.from('projects').select('capital_source').eq('id', projectId).single();
        if (!project) return [];

        const { data: templates } = await supabase
            .from('task_templates')
            .select('*')
            .eq('capital_source', project.capital_source)
            .order('code', { ascending: true });

        if (!templates) return [];

        const phases: Record<string, any> = {};
        templates.forEach(t => {
            if (!phases[t.phase]) {
                phases[t.phase] = { phase: t.phase, tasks: [] };
            }
            phases[t.phase].tasks.push({
                name: t.name,
                roles: t.raci_matrix
            });
        });

        return Object.values(phases);
    },

    getProjectMembers: async (projectId: string) => {
        // Join project_members
        const { data, error } = await supabase
            .from('project_members')
            .select('*, employee:employees(*)')
            .eq('project_id', projectId);

        if (error || !data) return [];

        return data.map((pm: any) => ({
            id: pm.id,
            projectId: pm.project_id,
            employeeId: pm.employee_id,
            role: pm.role,
            projectRole: pm.role, // Simple mapping
            hourlyRate: 0,
            allocation: 100,
            joinedAt: pm.joined_at,
            employee: pm.employee
        }));
    },

    addProjectMembers: async (projectId: string, members: any[]) => {
        // TODO
    },
    removeProjectMember: async () => { },

    syncRaciTasks: async (projectId: string) => { },

    getProjectContracts: async () => [],
    createContract: async () => { },
    getProjectRisks: async () => [],

    getTaskComments: async () => [],
    addTaskComment: async () => { },
    getTaskAttachments: async () => [],
    uploadTaskAttachment: async () => { },

    // --- PROJECT TEMPLATES ---
    getProjectTemplates: async (): Promise<ProjectTemplate[]> => {
        return [];
    },

    createTasksFromTemplate: async (projectId: string, template: ProjectTemplate): Promise<Task[]> => {
        return [];
    }
};

