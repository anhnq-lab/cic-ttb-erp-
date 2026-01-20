import { supabase } from '../utils/supabaseClient';
import { Task, Employee, Project } from '../types';
import { NotificationService } from './telegram.service';

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
        if (!supabase) {
            console.error('❌ Supabase client is null - environment variables not configured');
            return [];
        }

        try {
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
                console.error('❌ Error fetching tasks:', error);
                throw error;
            }

            console.log(`✅ Fetched ${data?.length || 0} tasks from Supabase`);
            return data as TaskWithRelations[];
        } catch (err) {
            console.error('❌ Exception in getAllTasks:', err);
            return [];
        }
    },

    /**
     * Get tasks for a specific project (excluding soft-deleted)
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
            .is('deleted_at', null) // Only get non-deleted tasks
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
     * Create a new task with notification
     */
    createTask: async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>, createdBy?: string): Promise<Task> => {
        const { data, error } = await supabase
            .from('tasks')
            .insert([{
                ...task,
                id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                last_modified_by: createdBy,
            }])
            .select(`
                *,
                assignee_employee:employees!assignee_id(id, name, avatar, role),
                project:projects!project_id(id, code, name)
            `)
            .single();

        if (error) {
            console.error('Error creating task:', error);
            throw error;
        }

        const createdTask = data as any;

        // Send Telegram notification
        try {
            if (createdTask.assignee_employee && createdTask.project) {
                await NotificationService.notifyTaskCreated(
                    createdTask,
                    createdTask.project,
                    createdTask.assignee_employee
                );
            }
        } catch (notifError) {
            console.error('Failed to send notification:', notifError);
            // Don't fail task creation if notification fails
        }

        return createdTask as Task;
    },

    /**
     * Update a task (with automatic history logging via trigger + notifications)
     */
    updateTask: async (taskId: string, updates: Partial<Task>, updatedBy?: string): Promise<Task> => {
        // Get old task data to compare changes
        const { data: oldTask } = await supabase
            .from('tasks')
            .select('*')
            .eq('id', taskId)
            .single();

        const { data, error } = await supabase
            .from('tasks')
            .update({
                ...updates,
                last_modified_by: updatedBy,
                updated_at: new Date().toISOString()
            })
            .eq('id', taskId)
            .select(`
                *,
                assignee_employee:employees!assignee_id(id, name, avatar, role)
            `)
            .single();

        if (error) {
            console.error('Error updating task:', error);
            throw error;
        }

        const updatedTask = data as any;

        // Detect changes for notification
        if (oldTask) {
            const changes: string[] = [];
            if (oldTask.status !== updatedTask.status) changes.push(`Trạng thái: ${oldTask.status} → ${updatedTask.status}`);
            if (oldTask.priority !== updatedTask.priority) changes.push(`Ưu tiên: ${oldTask.priority} → ${updatedTask.priority}`);
            if (oldTask.assignee_id !== updatedTask.assignee_id) changes.push('Đổi người thực hiện');
            if (oldTask.due_date !== updatedTask.due_date) changes.push(`Deadline: ${oldTask.due_date || 'N/A'} → ${updatedTask.due_date || 'N/A'}`);

            // Send notification if significant changes
            if (changes.length > 0) {
                try {
                    const updaterName = updatedBy || 'Hệ thống';
                    await NotificationService.notifyTaskUpdated(updatedTask, changes, updaterName);
                } catch (notifError) {
                    console.error('Failed to send update notification:', notifError);
                }
            }

            // Special notification for completion
            if (oldTask.status !== 'Hoàn thành' && updatedTask.status === 'Hoàn thành') {
                try {
                    await NotificationService.notifyTaskCompleted(
                        updatedTask,
                        updatedTask.assignee_employee || { name: updatedBy || 'Unknown' }
                    );
                } catch (notifError) {
                    console.error('Failed to send completion notification:', notifError);
                }
            }
        }

        return updatedTask as Task;
    },

    /**
     * Soft delete a task using stored procedure
     */
    deleteTask: async (taskId: string, deletedBy: string = 'unknown'): Promise<void> => {
        const { error } = await supabase
            .rpc('soft_delete_task', {
                p_task_id: taskId,
                p_deleted_by: deletedBy
            });

        if (error) {
            console.error('Error soft deleting task:', error);
            throw error;
        }

        console.log(`✅ Task ${taskId} soft deleted by ${deletedBy}`);
    },

    /**
     * Restore a soft-deleted task
     */
    restoreTask: async (taskId: string, restoredBy: string = 'unknown'): Promise<void> => {
        const { error } = await supabase
            .rpc('restore_task', {
                p_task_id: taskId,
                p_restored_by: restoredBy
            });

        if (error) {
            console.error('Error restoring task:', error);
            throw error;
        }

        console.log(`✅ Task ${taskId} restored by ${restoredBy}`);
    },

    /**
     * Permanently delete a task (hard delete - admin only)
     */
    permanentlyDeleteTask: async (taskId: string): Promise<void> => {
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId);

        if (error) {
            console.error('Error permanently deleting task:', error);
            throw error;
        }

        console.log(`✅ Task ${taskId} permanently deleted`);
    },

    /**
     * Check if user can access task
     */
    canUserAccessTask: async (userId: string, taskId: string): Promise<boolean> => {
        const { data, error } = await supabase
            .rpc('can_user_access_task', {
                p_user_id: userId,
                p_task_id: taskId
            });

        if (error) {
            console.error('Error checking task access:', error);
            return false;
        }

        return data as boolean;
    },

    /**
     * Get task comments
     */
    getTaskComments: async (taskId: string) => {
        const { data, error } = await supabase
            .from('task_comments')
            .select(`
                *,
                employee:employees!user_id(id, name, avatar)
            `)
            .eq('task_id', taskId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }

        return data;
    },

    /**
     * Add a comment to a task
     */
    addTaskComment: async (taskId: string, content: string, employeeId: string) => {
        const { data, error } = await supabase
            .from('task_comments')
            .insert([{
                task_id: taskId,
                content: content,
                user_id: employeeId
            }])
            .select(`
                *,
                employee:employees!user_id(id, name, avatar)
            `)
            .single();

        if (error) {
            console.error('Error adding comment:', error);
            throw error;
        }

        return data;
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
    },

    /**
     * ==================== KANBAN \u0026 GANTT FEATURES ====================
     * Added for Phase 01: Backend Permission Logic
     */

    /**
     * Check if user can move a task (for Kanban drag-drop)
     */
    canMoveTask: async (userId: string, taskId: string, projectId: string): Promise<boolean> => {
        if (!supabase) {
            console.error('❌ Supabase client is null');
            return false;
        }

        try {
            // Get task details
            const { data: task, error: taskError } = await supabase
                .from('tasks')
                .select('assignee_id')
                .eq('id', taskId)
                .single();

            if (taskError || !task) {
                console.error('❌ Error fetching task:', taskError);
                return false;
            }

            // Get project details
            const { data: project, error: projectError } = await supabase
                .from('projects')
                .select('manager_id')
                .eq('id', projectId)
                .single();

            if (projectError || !project) {
                console.error('❌ Error fetching project:', projectError);
                return false;
            }

            // Get user role
            const { data: employee, error: employeeError } = await supabase
                .from('employees')
                .select('role')
                .eq('id', userId)
                .single();

            if (employeeError || !employee) {
                console.error('❌ Error fetching employee:', employeeError);
                return false;
            }

            // Permission logic:
            // 1. Task assignee can move their own task
            // 2. Project manager can move any task in their project
            // 3. Admin or Giám đốc can move any task
            const isAssignee = task.assignee_id === userId;
            const isProjectManager = project.manager_id === userId;
            const isAdmin = employee.role === 'Admin' || employee.role === 'Giám đốc';

            const canMove = isAssignee || isProjectManager || isAdmin;

            console.log(`✅ Permission check: userId=${userId}, taskId=${taskId}, canMove=${canMove}`);
            return canMove;
        } catch (err) {
            console.error('❌ Exception in canMoveTask:', err);
            return false;
        }
    },

    /**
     * Update task status with confirmation (for Kanban drag-drop)
     * Returns success status and updated task or error message
     */
    updateTaskStatusWithConfirmation: async (
        taskId: string,
        newStatus: string,
        userId: string,
        notes?: string
    ): Promise<{ success: boolean; task?: any; error?: string }> => {
        if (!supabase) {
            return { success: false, error: 'Supabase client not configured' };
        }

        try {
            // Get old task data
            const { data: oldTask, error: fetchError } = await supabase
                .from('tasks')
                .select('*, project:projects!project_id(id, code, name)')
                .eq('id', taskId)
                .single();

            if (fetchError || !oldTask) {
                return { success: false, error: 'Task not found' };
            }

            // Check permission
            const canMove = await TaskService.canMoveTask(userId, taskId, oldTask.project_id);
            if (!canMove) {
                return { success: false, error: 'Không có quyền thay đổi task này' };
            }

            // Update task status
            const { data: updatedTask, error: updateError } = await supabase
                .from('tasks')
                .update({
                    status: newStatus,
                    last_modified_by: userId,
                    updated_at: new Date().toISOString()
                })
                .eq('id', taskId)
                .select(`
                    *,
                    assignee_employee:employees!assignee_id(id, name, avatar, role),
                    project:projects!project_id(id, code, name)
                `)
                .single();

            if (updateError) {
                console.error('❌ Error updating task:', updateError);
                return { success: false, error: 'Lỗi cập nhật task' };
            }

            // Log history
            const { error: historyError } = await supabase
                .from('task_history')
                .insert([{
                    task_id: taskId,
                    field_name: 'status',
                    old_value: oldTask.status,
                    new_value: newStatus,
                    changed_by: userId,
                    notes: notes || 'Moved via Kanban board'
                }]);

            if (historyError) {
                console.warn('⚠️ Error logging history:', historyError);
                // Don't fail the update if history logging fails
            }

            // Send Telegram notification
            try {
                await NotificationService.notifyTaskUpdated(
                    updatedTask,
                    [`Trạng thái: ${oldTask.status} → ${newStatus}`],
                    updatedTask.assignee_employee?.name || 'Unknown'
                );
            } catch (notifError) {
                console.warn('⚠️ Failed to send notification:', notifError);
                // Don't fail the update if notification fails
            }

            console.log(`✅ Task status updated: ${taskId} (${oldTask.status} → ${newStatus})`);
            return { success: true, task: updatedTask };
        } catch (err) {
            console.error('❌ Exception in updateTaskStatusWithConfirmation:', err);
            return { success: false, error: 'Unexpected error occurred' };
        }
    },

    /**
     * Get tasks formatted for Gantt chart visualization
     */
    getTasksForGantt: async (projectId: string): Promise<any[]> => {
        if (!supabase) {
            console.error('❌ Supabase client is null');
            return [];
        }

        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('id, code, name, start_date, due_date, progress, status, priority, phase')
                .eq('project_id', projectId)
                .is('deleted_at', null)
                .order('start_date', { ascending: true });

            if (error) {
                console.error('❌ Error fetching tasks for Gantt:', error);
                throw error;
            }

            // Format for Frappe Gantt
            const ganttTasks = data.map(task => ({
                id: task.id,
                name: task.name || task.code,
                start: task.start_date || new Date().toISOString().split('T')[0],
                end: task.due_date || new Date().toISOString().split('T')[0],
                progress: task.progress || 0,
                custom_class: getGanttColorClass(task.status, task.priority),
                // Optional: dependencies can be added here later
                // dependencies: task.dependencies || ''
            }));

            console.log(`✅ Formatted ${ganttTasks.length} tasks for Gantt chart`);
            return ganttTasks;
        } catch (err) {
            console.error('❌ Exception in getTasksForGantt:', err);
            return [];
        }
    }
};

/**
 * Helper function to determine Gantt bar color based on status/priority
 */
function getGanttColorClass(status: string, priority: string): string {
    // Priority-based coloring
    if (priority === 'Khẩn cấp') return 'bar-critical';
    if (priority === 'Cao') return 'bar-high';

    // Status-based coloring
    if (status === 'Hoàn thành') return 'bar-completed';
    if (status?.startsWith('S0')) return 'bar-s0';
    if (status?.startsWith('S1')) return 'bar-s1';
    if (status?.startsWith('S2')) return 'bar-s2';
    if (status?.startsWith('S3')) return 'bar-s3';
    if (status?.startsWith('S4')) return 'bar-s4';
    if (status?.startsWith('S5')) return 'bar-s5';
    if (status?.startsWith('S6')) return 'bar-s6';

    return 'bar-default';
}

export default TaskService;
