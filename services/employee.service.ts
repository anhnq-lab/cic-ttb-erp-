/**
 * Employee Service - Mock Implementation
 * Uses data from constants (Supabase will be added later)
 */

import { Employee } from '../types';
import { EMPLOYEES } from '../constants';

// Mock Store for Employees
let MOCK_EMPLOYEE_STORE: Employee[] = [...EMPLOYEES];

export const EmployeeService = {
    // Get All Employees
    getEmployees: async (): Promise<Employee[]> => {
        if (MOCK_EMPLOYEE_STORE.length === 0 && EMPLOYEES.length > 0) {
            MOCK_EMPLOYEE_STORE = [...EMPLOYEES];
        }
        return [...MOCK_EMPLOYEE_STORE];
    },

    // Get Employee by ID
    getEmployeeById: async (id: string): Promise<Employee | undefined> => {
        return MOCK_EMPLOYEE_STORE.find(e => e.id === id || e.code === id);
    },

    // Create Employee
    createEmployee: async (employee: Omit<Employee, 'id'>): Promise<Employee | null> => {
        const newEmployee = { ...employee, id: `EMP-${Date.now()}` } as Employee;
        MOCK_EMPLOYEE_STORE.unshift(newEmployee);
        return newEmployee;
    },

    // Update Employee
    updateEmployee: async (id: string, updates: Partial<Employee>): Promise<Employee | null> => {
        const idx = MOCK_EMPLOYEE_STORE.findIndex(e => e.id === id);
        if (idx > -1) {
            MOCK_EMPLOYEE_STORE[idx] = { ...MOCK_EMPLOYEE_STORE[idx], ...updates };
            return MOCK_EMPLOYEE_STORE[idx];
        }
        return null;
    },

    // Delete Employee
    deleteEmployee: async (id: string): Promise<boolean> => {
        const originalLength = MOCK_EMPLOYEE_STORE.length;
        MOCK_EMPLOYEE_STORE = MOCK_EMPLOYEE_STORE.filter(e => e.id !== id);
        return MOCK_EMPLOYEE_STORE.length < originalLength;
    },

    // Get Employees by Department
    getEmployeesByDepartment: async (department: string): Promise<Employee[]> => {
        const all = await EmployeeService.getEmployees();
        return all.filter(e => e.department === department);
    },

    // Get Employees by Status
    getEmployeesByStatus: async (status: Employee['status']): Promise<Employee[]> => {
        const all = await EmployeeService.getEmployees();
        return all.filter(e => e.status === status);
    },

    // Get Employee Statistics
    getEmployeeStats: async (): Promise<{
        total: number;
        byStatus: Record<string, number>;
        byDepartment: Array<{ department: string; count: number }>;
        avgTenureYears: number;
    }> => {
        const employees = await EmployeeService.getEmployees();
        const today = new Date();

        const byStatus: Record<string, number> = {};
        employees.forEach(e => { byStatus[e.status] = (byStatus[e.status] || 0) + 1; });

        const deptMap: Record<string, number> = {};
        employees.forEach(e => { deptMap[e.department] = (deptMap[e.department] || 0) + 1; });

        const tenures = employees.filter(e => e.joinDate)
            .map(e => (today.getTime() - new Date(e.joinDate).getTime()) / (1000 * 3600 * 24 * 365));
        const avgTenure = tenures.length > 0 ? tenures.reduce((sum, t) => sum + t, 0) / tenures.length : 0;

        return {
            total: employees.length,
            byStatus,
            byDepartment: Object.entries(deptMap).map(([department, count]) => ({ department, count })).sort((a, b) => b.count - a.count),
            avgTenureYears: Math.round(avgTenure * 10) / 10
        };
    },

    // Get Department Distribution
    getDepartmentDistribution: async (): Promise<Array<{ department: string; total: number; roles: Record<string, number> }>> => {
        const employees = await EmployeeService.getEmployees();
        const deptMap: Record<string, { total: number; roles: Record<string, number> }> = {};

        employees.forEach(e => {
            if (!deptMap[e.department]) deptMap[e.department] = { total: 0, roles: {} };
            deptMap[e.department].total += 1;
            const role = e.role || 'Unassigned';
            deptMap[e.department].roles[role] = (deptMap[e.department].roles[role] || 0) + 1;
        });

        return Object.entries(deptMap).map(([department, data]) => ({ department, total: data.total, roles: data.roles })).sort((a, b) => b.total - a.total);
    },

    // Get Employees by Tenure
    getEmployeesByTenure: async (): Promise<{ lessThan1Year: number; oneToThreeYears: number; threeToFiveYears: number; moreThanFiveYears: number }> => {
        const employees = await EmployeeService.getEmployees();
        const today = new Date();
        let lessThan1Year = 0, oneToThreeYears = 0, threeToFiveYears = 0, moreThanFiveYears = 0;

        employees.forEach(e => {
            if (!e.joinDate) return;
            const years = (today.getTime() - new Date(e.joinDate).getTime()) / (1000 * 3600 * 24 * 365);
            if (years < 1) lessThan1Year++;
            else if (years < 3) oneToThreeYears++;
            else if (years < 5) threeToFiveYears++;
            else moreThanFiveYears++;
        });

        return { lessThan1Year, oneToThreeYears, threeToFiveYears, moreThanFiveYears };
    },

    // Search Employees
    searchEmployees: async (query: string): Promise<Employee[]> => {
        const employees = await EmployeeService.getEmployees();
        const lowerQuery = query.toLowerCase();
        return employees.filter(e => e.name.toLowerCase().includes(lowerQuery) || (e.email && e.email.toLowerCase().includes(lowerQuery)));
    },

    // Subscribe (no-op without Supabase)
    subscribeToEmployees: (callback: () => void) => null,
    unsubscribe: (channel: any) => { }
};
