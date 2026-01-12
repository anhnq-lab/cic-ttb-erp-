import { supabase } from '../utils/supabaseClient';
import { Task, Employee, Project } from '../types';

/**
 * Real Supabase-based Task Service
 * Replaces mock implementation in project.service.ts
 */

// Helper types
interface TaskWithRelations extends Task {
    project?: Project;
    assignee_employee?: Employee;
    reviewer_employee?: Employee;
}

interface TaskHistory {
    id: string;
    task_id: string;
    field_name: string;
    old_value: string | null;
    new_value: string | null;
    changed_by: string | null;
    changed_at: string;
    notes: string | null;
}

interface TaskAttachment {
    id: string;
    task_id: string;
    file_name: string;
    file_url: string;
    file_type: string | null;
    file_size: number | null;
    uploaded_by: string | null;
    uploaded_at: string;
}

export const TaskService = {
    /**
     * Get all tasks with project and employee data
     */
    getAllTasks: async (): Promise<TaskWithRelations[]> => {
        const { data, error } = await supabase
            .from('tasks')
            .select(`
                *,
                project:projects!project_id(id, code, name, client),
                assignee_employee:employees!assignee_id(id, name, avatar, role),
                reviewer_employee:employees!reviewer_id(id, name, avatar, role)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }

        return data as TaskWithRelations[];
    },

    /**
     * Get tasks for a specific project
     */
    getProjectTasks: async (projectId: string): Promise<Task[]> => {
        const { data, error } = await supabase
            .from('tasks')
            .select(`
                *,
                assignee_employee:employees!assignee_id(id, name, avatar, role),
                reviewer_employee:employees!reviewer_id(id, name, avatar, role)
            `)
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching project tasks:', error);
            throw error;
        }

        return data as Task[];
    },

    /**
     * Get a single task by ID
     */
    getTaskById: async (taskId: string): Promise<Task | null> => {
        const { data, error } = await supabase
            .from('tasks')
            .select(`
                *,
                project:projects!project_id(*),
                assignee_employee:employees!assignee_id(*),
                reviewer_employee:employees!reviewer_id(*)
            `)
            .eq('id', taskId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            console.error('Error fetching task:', error);
            throw error;
        }

        return data as Task;
    },

    /**
     * Create a new task
     */
    createTask: async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
        const { data, error } = await supabase
            .from('tasks')
            .insert([{
                ...task,
                id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating task:', error);
            throw error;
        }

        return data as Task;
    },

    /**
     * Update a task (with automatic history logging via trigger)
     */
    updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task> => {
        const { data, error } = await supabase
            .from('tasks')
            .update(updates)
            .eq('id', taskId)
            .select()
            .single();

        if (error) {
            console.error('Error updating task:', error);
            throw error;
        }

        return data as Task;
    },

    /**
     * Delete a task
     */
    deleteTask: async (taskId: string): Promise<void> => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId);

        if (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    },

    /**
     * Get task history
     */
    getTaskHistory: async (taskId: string): Promise<TaskHistory[]> => {
        const { data, error } = await supabase
            .from('task_history')
            .select('*')
            .eq('task_id', taskId)
            .order('changed_at', { ascending: false });

        if (error) {
            console.error('Error fetching task history:', error);
            throw error;
        }

        return data as TaskHistory[];
    },

    /**
     * Get task attachments
     */
    getTaskAttachments: async (taskId: string): Promise<TaskAttachment[]> => {
        const { data, error } = await supabase
            .from('task_attachments')
            .select('*')
            .eq('task_id', taskId)
            .order('uploaded_at', { ascending: false });

        if (error) {
            console.error('Error fetching attachments:', error);
            throw error;
        }

        return data as TaskAttachment[];
    },

    /**
     * Upload task attachment
     */
    uploadTaskAttachment: async (
        taskId: string,
        file: File,
        uploadedBy: string
    ): Promise<TaskAttachment> => {
        // Upload file to Supabase Storage
        const fileName = `${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('task-attachments')
            .upload(fileName, file);

        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('task-attachments')
            .getPublicUrl(fileName);

        // Save attachment record
        const { data, error } = await supabase
            .from('task_attachments')
            .insert([{
                task_id: taskId,
                file_name: file.name,
                file_url: publicUrl,
                file_type: file.type,
                file_size: file.size,
                uploaded_by: uploadedBy
            }])
            .select()
            .single();

        if (error) {
            console.error('Error saving attachment record:', error);
            throw error;
        }

        return data as TaskAttachment;
    },

    /**
     * Delete task attachment
     */
    deleteTaskAttachment: async (attachmentId: string): Promise<void> => {
        // Get attachment to get file URL
        const { data: attachment, error: fetchError } = await supabase
            .from('task_attachments')
            .select('file_url')
            .eq('id', attachmentId)
            .single();

        if (fetchError) throw fetchError;

        // Extract file name from URL
        const fileName = attachment.file_url.split('/').pop();

        // Delete from storage
        if (fileName) {
            await supabase.storage
                .from('task-attachments')
                .remove([fileName]);
        }

        // Delete record
        const { error } = await supabase
            .from('task_attachments')
            .delete()
            .eq('id', attachmentId);

        if (error) {
            console.error('Error deleting attachment:', error);
            throw error;
        }
    },

    /**
     * Get task time analytics (hours logged)
     */
    getTaskTimeAnalytics: async (taskId: string): Promise<{
        totalHours: number;
        byEmployee: Record<string, number>;
        byDate: Record<string, number>;
    }> => {
        const { data, error } = await supabase
            .from('timesheet_logs')
            .select('employee_id, date, hours')
            .eq('task_id', taskId);

        if (error) {
            console.error('Error fetching task time analytics:', error);
            throw error;
        }

        const analytics = {
            totalHours: 0,
            byEmployee: {} as Record<string, number>,
            byDate: {} as Record<string, number>
        };

        data.forEach(log => {
            analytics.totalHours += log.hours;
            analytics.byEmployee[log.employee_id] = (analytics.byEmployee[log.employee_id] || 0) + log.hours;
            analytics.byDate[log.date] = (analytics.byDate[log.date] || 0) + log.hours;
        });

        return analytics;
    },

    /**
     * Subscribe to real-time task changes
     */
    subscribeToTasks: (projectId: string | null, callback: (payload: any) => void) => {
        const channel = supabase
            .channel('tasks_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'tasks',
                    filter: projectId ? `project_id=eq.${projectId}` : undefined
                },
                callback
            )
            .subscribe();

        return channel;
    },

    /**
     * Unsubscribe from real-time updates
     */
    unsubscribe: (channel: any) => {
        supabase.removeChannel(channel);
    },

    /**
     * Get task statistics
     */
    getTaskStats: async (projectId?: string): Promise<{
        total: number;
        byStatus: Record<string, number>;
        byPriority: Record<string, number>;
        completed: number;
        overdue: number;
    }> => {
        let query = supabase.from('tasks').select('status, priority, due_date');

        if (projectId) {
            query = query.eq('project_id', projectId);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching task stats:', error);
            throw error;
        }

        const stats = {
            total: data.length,
            byStatus: {} as Record<string, number>,
            byPriority: {} as Record<string, number>,
            completed: 0,
            overdue: 0
        };

        const today = new Date().toISOString().split('T')[0];

        data.forEach(task => {
            stats.byStatus[task.status] = (stats.byStatus[task.status] || 0) + 1;
            stats.byPriority[task.priority || 'Trung bình'] = (stats.byPriority[task.priority || 'Trung bình'] || 0) + 1;

            if (task.status === 'Hoàn thành') {
                stats.completed++;
            }

            if (task.due_date && task.due_date < today && task.status !== 'Hoàn thành') {
                stats.overdue++;
            }
        });

        return stats;
    }
};

export default TaskService;
