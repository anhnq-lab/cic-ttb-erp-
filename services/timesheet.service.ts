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
    }
};
