import { supabase } from '../utils/supabaseClient';

/**
 * Enhanced Timesheet Service with Supabase Backend
 * Replaces mock implementation
 */

export interface TimesheetLog {
    id: string;
    project_id: string;
    employee_id: string;
    task_id?: string;
    date: string;
    hours: number;
    work_type?: 'Modeling' | 'Review' | 'Meeting' | 'Coordination' | 'Other';
    description?: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    created_at?: string;
    updated_at?: string;
}

// Fallback to mock data if Supabase not configured
let MOCK_TIMESHEETS: TimesheetLog[] = [];

export const TimesheetService = {
    /**
     * Get timesheets for a project and month
     */
    getTimesheets: async (projectId: string, month: number, year: number): Promise<TimesheetLog[]> => {
        if (!supabase) {
            // Mock mode
            const prefix = `${year}-${month.toString().padStart(2, '0')}`;
            return MOCK_TIMESHEETS.filter(t => t.project_id === projectId && t.date.startsWith(prefix));
        }

        const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;

        const { data, error } = await supabase
            .from('timesheet_logs')
            .select('*')
            .eq('project_id', projectId)
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching timesheets:', error);
            throw error;
        }

        return data as TimesheetLog[];
    },

    /**
     * Log task hours
     */
    logTaskHours: async (log: Omit<TimesheetLog, 'id' | 'status' | 'created_at' | 'updated_at'>): Promise<TimesheetLog> => {
        // Validation: Max 24h per day per person
        const existingLogs = await TimesheetService.getDailyLogs(log.employee_id, log.date);
        const totalHours = existingLogs.reduce((sum, t) => sum + t.hours, 0);

        if (totalHours + log.hours > 24) {
            throw new Error("Tổng số giờ làm việc trong ngày không được vượt quá 24 giờ.");
        }

        if (!supabase) {
            // Mock mode
            const newLog: TimesheetLog = {
                ...log,
                id: `ts-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                status: 'Pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            MOCK_TIMESHEETS.push(newLog);
            return newLog;
        }

        const { data, error } = await supabase
            .from('timesheet_logs')
            .insert([log])
            .select()
            .single();

        if (error) {
            console.error('Error logging hours:', error);
            throw error;
        }

        return data as TimesheetLog;
    },

    /**
     * Delete a timesheet log
     */
    deleteLog: async (id: string): Promise<void> => {
        if (!supabase) {
            MOCK_TIMESHEETS = MOCK_TIMESHEETS.filter(t => t.id !== id);
            return;
        }

        const { error } = await supabase
            .from('timesheet_logs')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting log:', error);
            throw error;
        }
    },

    /**
     * Get monthly report
     */
    getMonthlyReport: async (projectId: string, month: number, year: number): Promise<Record<string, number>> => {
        const logs = await TimesheetService.getTimesheets(projectId, month, year);
        const report: Record<string, number> = {};

        logs.forEach(log => {
            report[log.employee_id] = (report[log.employee_id] || 0) + log.hours;
        });

        return report;
    },

    /**
     * Get daily total for an employee
     */
    getDailyTotal: async (employeeId: string, date: string): Promise<number> => {
        const logs = await TimesheetService.getDailyLogs(employeeId, date);
        return logs.reduce((sum, t) => sum + t.hours, 0);
    },

    /**
     * Get all logs for an employee on a specific date
     */
    getDailyLogs: async (employeeId: string, date: string): Promise<TimesheetLog[]> => {
        if (!supabase) {
            return MOCK_TIMESHEETS.filter(t => t.employee_id === employeeId && t.date === date);
        }

        const { data, error } = await supabase
            .from('timesheet_logs')
            .select('*')
            .eq('employee_id', employeeId)
            .eq('date', date);

        if (error) {
            console.error('Error fetching daily logs:', error);
            return [];
        }

        return data as TimesheetLog[];
    },

    /**
     * Get all timesheets with advanced filters
     */
    getAllTimesheets: async (filters?: {
        employeeId?: string;
        projectId?: string;
        startDate?: string;
        endDate?: string;
        status?: string;
        taskId?: string;
        workType?: string;
    }): Promise<TimesheetLog[]> => {
        if (!supabase) {
            // Mock mode filtering
            let filtered = [...MOCK_TIMESHEETS];
            if (filters) {
                if (filters.employeeId) filtered = filtered.filter(t => t.employee_id === filters.employeeId);
                if (filters.projectId) filtered = filtered.filter(t => t.project_id === filters.projectId);
                if (filters.startDate) filtered = filtered.filter(t => t.date >= filters.startDate!);
                if (filters.endDate) filtered = filtered.filter(t => t.date <= filters.endDate!);
                if (filters.status) filtered = filtered.filter(t => t.status === filters.status);
                if (filters.taskId) filtered = filtered.filter(t => t.task_id === filters.taskId);
                if (filters.workType) filtered = filtered.filter(t => t.work_type === filters.workType);
            }
            return filtered.sort((a, b) => b.date.localeCompare(a.date));
        }

        let query = supabase.from('timesheet_logs').select('*');

        if (filters) {
            if (filters.employeeId) query = query.eq('employee_id', filters.employeeId);
            if (filters.projectId) query = query.eq('project_id', filters.projectId);
            if (filters.startDate) query = query.gte('date', filters.startDate);
            if (filters.endDate) query = query.lte('date', filters.endDate);
            if (filters.status) query = query.eq('status', filters.status);
            if (filters.taskId) query = query.eq('task_id', filters.taskId);
            if (filters.workType) query = query.eq('work_type', filters.workType);
        }

        const { data, error } = await query.order('date', { ascending: false });

        if (error) {
            console.error('Error fetching all timesheets:', error);
            throw error;
        }

        return data as TimesheetLog[];
    },

    /**
     * Get summary statistics
     */
    getSummaryStats: async (filters?: any): Promise<{
        totalHours: number;
        totalReports: number;
        byEmployee: Record<string, number>;
        byProject: Record<string, number>;
        byStatus: Record<string, number>;
        byWorkType: Record<string, number>;
    }> => {
        const logs = await TimesheetService.getAllTimesheets(filters);

        const stats = {
            totalHours: 0,
            totalReports: logs.length,
            byEmployee: {} as Record<string, number>,
            byProject: {} as Record<string, number>,
            byStatus: {} as Record<string, number>,
            byWorkType: {} as Record<string, number>
        };

        logs.forEach(log => {
            stats.totalHours += log.hours;
            stats.byEmployee[log.employee_id] = (stats.byEmployee[log.employee_id] || 0) + log.hours;
            stats.byProject[log.project_id] = (stats.byProject[log.project_id] || 0) + log.hours;
            stats.byStatus[log.status] = (stats.byStatus[log.status] || 0) + 1;
            if (log.work_type) {
                stats.byWorkType[log.work_type] = (stats.byWorkType[log.work_type] || 0) + 1;
            }
        });

        return stats;
    },

    /**
     * Export to CSV
     */
    exportToCSV: async (filters?: any): Promise<string> => {
        const logs = await TimesheetService.getAllTimesheets(filters);

        const headers = ['Ngày', 'Nhân viên', 'Dự án', 'Task', 'Giờ làm', 'Loại công việc', 'Mô tả', 'Trạng thái', 'Ngày tạo'];
        const csvRows = [headers.join(',')];

        logs.forEach(log => {
            const row = [
                log.date,
                log.employee_id,
                log.project_id,
                log.task_id || '',
                log.hours.toString(),
                log.work_type || '',
                `"${(log.description || '').replace(/"/g, '""')}"`,
                log.status,
                log.created_at || ''
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }
};

export default TimesheetService;
