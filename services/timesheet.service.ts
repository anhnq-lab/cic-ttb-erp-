import { TimesheetLog, Task } from '../types';
import { ProjectService } from './project.service';

// Mock Data Storage
let MOCK_TIMESHEETS: TimesheetLog[] = [];

// Helper to generate some initial data
const generateMockData = () => {
    // Check if data already exists to avoid dupes on reload
    if (MOCK_TIMESHEETS.length > 0) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const projectId = 'P-002'; // Demo Project

    // Mock Data Generator
    // ... (Keep existing simple mock if needed, or clear for fresh start)
};

generateMockData();

export const TimesheetService = {
    getTimesheets: async (projectId: string, month: number, year: number): Promise<TimesheetLog[]> => {
        const prefix = `${year}-${month.toString().padStart(2, '0')}`;
        return MOCK_TIMESHEETS.filter(t => t.projectId === projectId && t.date.startsWith(prefix));
    },

    // New: Log specific task hours
    logTaskHours: async (log: Omit<TimesheetLog, 'id' | 'status'>): Promise<TimesheetLog> => {
        // Validation: Max 24h per day per person
        const existingLogs = MOCK_TIMESHEETS.filter(t =>
            t.employeeId === log.employeeId &&
            t.date === log.date
        );
        const totalHours = existingLogs.reduce((sum, t) => sum + t.hours, 0);

        if (totalHours + log.hours > 24) {
            throw new Error("Tổng số giờ làm việc trong ngày không được vượt quá 24 giờ.");
        }

        const newLog: TimesheetLog = {
            ...log,
            id: `ts-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            status: 'Pending',
            created_at: new Date().toISOString()
        };

        MOCK_TIMESHEETS.push(newLog);
        return newLog;
    },

    deleteLog: async (id: string): Promise<void> => {
        MOCK_TIMESHEETS = MOCK_TIMESHEETS.filter(t => t.id !== id);
    },

    getMonthlyReport: async (projectId: string, month: number, year: number) => {
        const logs = await TimesheetService.getTimesheets(projectId, month, year);
        const report: Record<string, number> = {};

        logs.forEach(log => {
            report[log.employeeId] = (report[log.employeeId] || 0) + log.hours;
        });

        return report;
    },

    // Helper to get daily total for a cell
    getDailyTotal: (employeeId: string, date: string) => {
        return MOCK_TIMESHEETS
            .filter(t => t.employeeId === employeeId && t.date === date)
            .reduce((sum, t) => sum + t.hours, 0);
    },

    // NEW: Get all timesheets with advanced filters
    getAllTimesheets: async (filters?: {
        employeeId?: string;
        projectId?: string;
        startDate?: string;
        endDate?: string;
        status?: string;
        taskId?: string;
        workType?: string;
    }): Promise<TimesheetLog[]> => {
        let filtered = [...MOCK_TIMESHEETS];

        if (filters) {
            if (filters.employeeId) {
                filtered = filtered.filter(t => t.employeeId === filters.employeeId);
            }
            if (filters.projectId) {
                filtered = filtered.filter(t => t.projectId === filters.projectId);
            }
            if (filters.startDate) {
                filtered = filtered.filter(t => t.date >= filters.startDate!);
            }
            if (filters.endDate) {
                filtered = filtered.filter(t => t.date <= filters.endDate!);
            }
            if (filters.status) {
                filtered = filtered.filter(t => t.status === filters.status);
            }
            if (filters.taskId) {
                filtered = filtered.filter(t => t.taskId === filters.taskId);
            }
            if (filters.workType) {
                filtered = filtered.filter(t => t.workType === filters.workType);
            }
        }

        // Sort by date descending
        return filtered.sort((a, b) => b.date.localeCompare(a.date));
    },

    // NEW: Get summary statistics
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
            stats.byEmployee[log.employeeId] = (stats.byEmployee[log.employeeId] || 0) + log.hours;
            stats.byProject[log.projectId] = (stats.byProject[log.projectId] || 0) + log.hours;
            stats.byStatus[log.status] = (stats.byStatus[log.status] || 0) + 1;
            if (log.workType) {
                stats.byWorkType[log.workType] = (stats.byWorkType[log.workType] || 0) + 1;
            }
        });

        return stats;
    },

    // NEW: Export to CSV format
    exportToCSV: async (filters?: any): Promise<string> => {
        const logs = await TimesheetService.getAllTimesheets(filters);

        // CSV Header
        const headers = ['Ngày', 'Nhân viên', 'Dự án', 'Task', 'Giờ làm', 'Loại công việc', 'Mô tả', 'Trạng thái', 'Ngày tạo'];
        const csvRows = [headers.join(',')];

        // CSV Data
        logs.forEach(log => {
            const row = [
                log.date,
                log.employeeId,
                log.projectId,
                log.taskId || '',
                log.hours.toString(),
                log.workType || '',
                `"${(log.description || '').replace(/"/g, '""')}"`, // Escape quotes in description
                log.status,
                log.created_at || ''
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }
};
