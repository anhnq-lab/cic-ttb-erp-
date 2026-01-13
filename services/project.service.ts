import { supabase } from '../utils/supabaseClient';
import { Project, Task, ProjectStatus, RaciMatrix, WorkflowStep, ProjectTemplate, TaskStatus, TaskPriority } from '../types';
import { PROJECTS, EMPLOYEES } from '../constants'; // Fallback for mocks

// Helper to map DB snake_case to App camelCase
const mapProjectFromDB = (p: any): Project => ({
    id: p.id,
    code: p.code,
    name: p.name,
    client: p.client || '', // Or fetch from customer
    location: p.location,
    manager: p.manager || '', // Or fetch from employee

    projectGroup: p.project_group,
    constructionType: p.construction_type,
    constructionLevel: p.construction_level,
    scale: p.scale,

    capitalSource: p.capital_source as any,
    status: p.status as ProjectStatus,
    progress: p.progress,
    budget: Number(p.budget),
    spent: Number(p.spent),
    deadline: p.deadline,
    members: p.members_count || 0,
    thumbnail: p.thumbnail,

    serviceType: p.service_type,
    area: p.area,
    unitPrice: p.unit_price,
    phase: p.phase,
    scope: p.scope,
    statusDetail: p.status_detail,
    failureReason: p.failure_reason,
    folderUrl: p.folder_url,
    completedAt: p.completed_at,
    deliverables: p.deliverables
});

// Helper to map App camelCase to DB snake_case
const mapProjectToDB = (p: Partial<Project>) => ({
    code: p.code,
    name: p.name,
    client: p.client,
    location: p.location,
    manager: p.manager,

    project_group: p.projectGroup,
    construction_type: p.constructionType,
    construction_level: p.constructionLevel,
    scale: p.scale,

    capital_source: p.capitalSource,
    status: p.status,
    progress: p.progress,
    budget: p.budget,
    spent: p.spent,
    deadline: p.deadline,
    members_count: p.members,
    thumbnail: p.thumbnail,

    service_type: p.serviceType,
    area: p.area,
    unit_price: p.unitPrice,
    phase: p.phase,
    scope: p.scope,
    status_detail: p.statusDetail,
    failure_reason: p.failureReason,
    folder_url: p.folderUrl,
    completed_at: p.completedAt,
    deliverables: p.deliverables
});

export const ProjectService = {
    // --- PROJECT METHODS ---

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
            return null;
        }
        return mapProjectFromDB(data);
    },

    updateProject: async (id: string, updates: Partial<Project>): Promise<Project | null> => {
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
            return null;
        }
        return mapProjectFromDB(data);
    },

    deleteProject: async (id: string): Promise<boolean> => {
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
        // TODO: Migrate checklists to DB
        return [];
    },

    getTaskChecklistLogs: async (taskId: string): Promise<any[]> => {
        return [];
    },

    updateChecklistLog: async (log: any): Promise<void> => {
        console.log('updateChecklistLog not implemented');
    },

    // --- OTHER METHODS ---

    getProjectWorkflows: async (projectId: string): Promise<Record<string, any>> => {
        return {};
    },

    getProjectRaci: async (projectId: string): Promise<any[]> => [],

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

