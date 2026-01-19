
import { supabase } from '../utils/supabaseClient';
import { TimesheetLog } from '../types';

export const TimesheetService = {
    // 1. Get Logs by Project
    getLogsByProject: async (projectId: string): Promise<TimesheetLog[]> => {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('timesheet_logs')
            .select(`
                *,
                employee:employee_id (
                    id,
                    name,
                    avatar
                ),
                task:task_id (
                    id,
                    name,
                    code
                )
            `)
            .eq('project_id', projectId)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching timesheet logs:', error);
            return [];
        }

        // Map backend snake_case to frontend camelCase
        return (data || []).map(item => ({
            id: item.id,
            projectId: item.project_id,
            employeeId: item.employee_id,
            taskId: item.task_id,
            date: item.date,
            hours: item.hours,
            workType: item.work_type,
            description: item.description,
            // Joined data
            employeeName: item.employee?.name,
            taskName: item.task?.name
        })) as any[];
    },

    // 2. Create Log
    createLog: async (log: Omit<TimesheetLog, 'id'>): Promise<TimesheetLog | null> => {
        if (!supabase) return null;

        const backendLog = {
            project_id: log.projectId,
            employee_id: log.employeeId,
            task_id: log.taskId,
            date: log.date,
            hours: log.hours,
            work_type: log.workType,
            description: log.description
        };

        const { data, error } = await supabase
            .from('timesheet_logs')
            .insert([backendLog])
            .select()
            .single();

        if (error) {
            console.error('Error creating timesheet log:', error);
            throw error;
        }

        return data as any;
    },

    // 3. Delete Log
    deleteLog: async (id: string): Promise<boolean> => {
        if (!supabase) return false;

        const { error } = await supabase
            .from('timesheet_logs')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting timesheet log:', error);
            return false;
        }

        return true;
    },

    // 4. Get Monthly Report
    getMonthlyReport: async (projectId: string, month: number, year: number): Promise<any> => {
        // Simple implementation: fetch all and filter or use a more complex query
        const logs = await TimesheetService.getLogsByProject(projectId);

        return logs.filter(log => {
            const date = new Date(log.date);
            return (date.getMonth() + 1) === month && date.getFullYear() === year;
        });
    }
};
