import { supabase } from './supabaseClient';
import { Task, TaskStatus, TaskPriority } from '../types';
import { SAMPLE_TASKS } from '../constants_data/tasks';

// Mappers: DB snake_case ↔ App camelCase
const mapTaskFromDB = (t: any): Task => ({
  id: t.id,
  code: t.code || `TASK-${t.id.substring(0, 8)}`,
  name: t.name,
  projectId: t.project_id,
  phase: t.phase,
  assignee: t.assignee_id ? {
    id: t.assignee_id,
    name: t.assignee_name || 'Unassigned',
    avatar: t.assignee_avatar || '',
    role: t.assignee_role || 'Staff'
  } : {
    name: 'Unassigned',
    avatar: '',
    role: 'Staff'
  },
  reviewer: t.reviewer,
  status: t.status,
  priority: t.priority,
  startDate: t.start_date,
  dueDate: t.due_date || t.end_date, // Support both column names
  progress: t.progress || 0,
  tags: t.tags || [],
  comments: t.comments || [],
  attachments: t.attachments || [],
  subtasks: t.subtasks || [],
  checklistLogs: t.checklist_logs || [],
  deliverables: t.deliverables || []
});

const mapTaskToDB = (t: Partial<Task>) => {
  const payload: any = {
    code: t.code,
    name: t.name,
    project_id: t.projectId,
    phase: t.phase,
    assignee_id: t.assignee?.id,
    assignee_name: t.assignee?.name,
    assignee_avatar: t.assignee?.avatar,
    assignee_role: t.assignee?.role,
    reviewer: t.reviewer,
    status: t.status,
    priority: t.priority,
    start_date: t.startDate,
    due_date: t.dueDate,
    progress: t.progress,
    tags: t.tags,
    comments: t.comments,
    attachments: t.attachments,
    subtasks: t.subtasks,
    checklist_logs: t.checklistLogs,
    deliverables: t.deliverables
  };
  // Remove undefined
  Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
  return payload;
};

export const realtimeStore = {
  // Get Tasks by Project
  getTasks: async (projectId: string): Promise<Task[]> => {
    if (!supabase) {
      console.warn('Supabase not configured. Using fallback.');
      return SAMPLE_TASKS.filter(t => t.projectId === projectId);
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return SAMPLE_TASKS.filter(t => t.projectId === projectId);
    }
    return data.map(mapTaskFromDB);
  },

  // Update Task Status (Quick action)
  updateTaskStatus: async (taskId: string, newStatus: TaskStatus) => {
    if (!supabase) return;

    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', taskId);

    if (error) console.error('Error updating task status:', error);
  },

  // Create Task
  createTask: async (task: Task): Promise<Task | null> => {
    if (!supabase) {
      console.warn('Supabase not configured.');
      return task;
    }

    const payload = mapTaskToDB(task);
    const { data, error } = await supabase
      .from('tasks')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return null;
    }
    return mapTaskFromDB(data);
  },

  // Update Task
  updateTask: async (taskId: string, updates: Partial<Task>): Promise<void> => {
    if (!supabase) return;

    const payload = mapTaskToDB(updates);
    payload.updated_at = new Date().toISOString();

    const { error } = await supabase
      .from('tasks')
      .update(payload)
      .eq('id', taskId);

    if (error) console.error('Error updating task:', error);
  },

  // Delete Task
  deleteTask: async (taskId: string): Promise<void> => {
    if (!supabase) return;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) console.error('Error deleting task:', error);
  },

  // Subscribe to Realtime Updates
  subscribe: (projectId: string, callback: () => void) => {
    if (!supabase) {
      console.warn('Supabase not configured. Realtime disabled.');
      return () => { };
    }

    const channel = supabase
      .channel(`tasks:project_id=eq.${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          console.log('Realtime task update:', payload);
          callback();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // Unsubscribe
  unsubscribe: async (channel: any) => {
    if (channel && supabase) {
      await supabase.removeChannel(channel);
    }
  }
};

