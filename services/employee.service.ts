/**
 * Employee Service - Supabase Implementation
 */

import { supabase } from '../utils/supabaseClient';
import { Employee } from '../types';
import { EMPLOYEES } from '../constants'; // Fallback

const mapEmployeeFromDB = (e: any): Employee => ({
    id: e.id,
    code: e.code,
    name: e.full_name, // Map full_name -> name
    position: e.position,
    role: e.role,
    department: e.department,
    email: e.email,
    phone: e.phone,
    avatar: e.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(e.full_name || 'User'),
    status: e.status,
    joinDate: e.join_date,
    skills: e.skills || [],
    dob: e.dob,
    degree: e.education?.degree,
    certificates: e.education?.certificates,
    graduationYear: e.education?.graduationYear,
    profileUrl: e.profile_url
});

const mapEmployeeToDB = (e: Partial<Employee>) => {
    const payload: any = {
        code: e.code,
        full_name: e.name,
        position: e.position,
        role: e.role,
        department: e.department,
        email: e.email,
        phone: e.phone,
        avatar_url: e.avatar,
        status: e.status,
        join_date: e.joinDate,
        skills: e.skills,
        dob: e.dob,
        education: {
            degree: e.degree,
            certificates: e.certificates,
            graduationYear: e.graduationYear
        },
        profile_url: e.profileUrl
    };

    // Remove undefined
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
    return payload;
};

export const EmployeeService = {
    // Get All Employees
    getEmployees: async (): Promise<Employee[]> => {
        const { data, error } = await supabase
            .from('employees')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching employees:', error);
            return EMPLOYEES;
        }
        return data.map(mapEmployeeFromDB);
    },

    // Get Employee by ID
    getEmployeeById: async (id: string): Promise<Employee | undefined> => {
        // Try ID first
        let { data, error } = await supabase
            .from('employees')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            // Try code
            const { data: dataCode, error: errorCode } = await supabase
                .from('employees')
                .select('*')
                .eq('code', id)
                .single();
            data = dataCode;
            error = errorCode;
        }

        if (error || !data) return undefined;
        return mapEmployeeFromDB(data);
    },

    // Create Employee
    createEmployee: async (employee: Omit<Employee, 'id'>): Promise<Employee | null> => {
        const payload = mapEmployeeToDB(employee);
        const { data, error } = await supabase
            .from('employees')
            .insert([payload])
            .select()
            .single();

        if (error) {
            console.error('Error creating employee:', error);
            return null;
        }
        return mapEmployeeFromDB(data);
    },

    // Update Employee
    updateEmployee: async (id: string, updates: Partial<Employee>): Promise<Employee | null> => {
        const payload = mapEmployeeToDB(updates);
        const { data, error } = await supabase
            .from('employees')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating employee:', error);
            return null;
        }
        return mapEmployeeFromDB(data);
    },

    // Delete Employee
    deleteEmployee: async (id: string): Promise<boolean> => {
        const { error } = await supabase.from('employees').delete().eq('id', id);
        return !error;
    },

    // Get Employees by Department
    getEmployeesByDepartment: async (department: string): Promise<Employee[]> => {
        const { data, error } = await supabase
            .from('employees')
            .select('*')
            .eq('department', department);

        if (error) return [];
        return data.map(mapEmployeeFromDB);
    },

    // Get Employees by Status
    getEmployeesByStatus: async (status: Employee['status']): Promise<Employee[]> => {
        const { data, error } = await supabase
            .from('employees')
            .select('*')
            .eq('status', status);

        if (error) return [];
        return data.map(mapEmployeeFromDB);
    },

    // Get Employee Statistics
    getEmployeeStats: async () => {
        // Fetch all (or use RPC for stats if large)
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
    getDepartmentDistribution: async () => {
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
    getEmployeesByTenure: async () => {
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
        // Supabase text search can be used here: .ilike('full_name', `%${query}%`)
        const lowerQuery = query.toLowerCase();
        const { data, error } = await supabase
            .from('employees')
            .select('*')
            .ilike('full_name', `%${lowerQuery}%`); // Simple server-side filter

        if (error || !data) return [];
        return data.map(mapEmployeeFromDB);
    },

    // Subscribe (Stub for now)
    subscribeToEmployees: (callback: () => void) => {
        // Realtime subscription logic would go here
        return supabase
            .channel('public:employees')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'employees' }, callback)
            .subscribe();
    },
    unsubscribe: (channel: any) => {
        if (channel) supabase.removeChannel(channel);
    }
};

