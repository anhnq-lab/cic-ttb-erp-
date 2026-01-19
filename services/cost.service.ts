
import { supabase } from '../utils/supabaseClient';
import { ProjectCost } from '../types';

export const CostService = {
    // 1. Get Costs by Project
    getCostsByProject: async (projectId: string): Promise<ProjectCost[]> => {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('project_costs')
            .select(`
                *,
                personnel:personnel_id (
                    id,
                    project_id,
                    employee_id,
                    project_role,
                    hourly_rate,
                    employee:employee_id (
                        id,
                        name,
                        avatar
                    )
                )
            `)
            .eq('project_id', projectId)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching project costs:', error);
            return [];
        }

        // Map backend snake_case to frontend camelCase if needed
        return (data || []).map(item => ({
            id: item.id,
            projectId: item.project_id,
            category: item.category,
            salaryType: item.salary_type,
            description: item.description,
            amount: item.amount,
            date: item.date,
            status: item.status,
            spender: item.spender,
            personnelId: item.personnel_id,
            manHours: item.man_hours,
            hourlyRate: item.hourly_rate,
            notes: item.notes
        })) as ProjectCost[];
    },

    // 2. Create Cost
    createCost: async (cost: Omit<ProjectCost, 'id'>): Promise<ProjectCost | null> => {
        if (!supabase) return null;

        const backendCost = {
            project_id: cost.projectId,
            category: cost.category,
            salary_type: cost.salaryType,
            description: cost.description,
            amount: cost.amount,
            date: cost.date,
            status: cost.status || 'Pending',
            spender: cost.spender,
            personnel_id: cost.personnelId,
            man_hours: cost.manHours,
            hourly_rate: cost.hourlyRate,
            notes: cost.notes
        };

        const { data, error } = await supabase
            .from('project_costs')
            .insert([backendCost])
            .select()
            .single();

        if (error) {
            console.error('Error creating cost:', error);
            throw error;
        }

        return {
            ...data,
            projectId: data.project_id,
            salaryType: data.salary_type
        } as any;
    },

    // 3. Update Cost
    updateCost: async (id: string, updates: Partial<ProjectCost>): Promise<ProjectCost | null> => {
        if (!supabase) return null;

        const backendUpdates: any = {};
        if (updates.category) backendUpdates.category = updates.category;
        if (updates.salaryType) backendUpdates.salary_type = updates.salaryType;
        if (updates.description) backendUpdates.description = updates.description;
        if (updates.amount !== undefined) backendUpdates.amount = updates.amount;
        if (updates.date) backendUpdates.date = updates.date;
        if (updates.status) backendUpdates.status = updates.status;
        if (updates.spender) backendUpdates.spender = updates.spender;
        if (updates.personnelId) backendUpdates.personnel_id = updates.personnelId;
        if (updates.manHours !== undefined) backendUpdates.man_hours = updates.manHours;
        if (updates.hourlyRate !== undefined) backendUpdates.hourly_rate = updates.hourlyRate;
        if (updates.notes) backendUpdates.notes = updates.notes;

        const { data, error } = await supabase
            .from('project_costs')
            .update(backendUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating cost:', error);
            throw error;
        }

        return data as any;
    },

    // 4. Delete Cost
    deleteCost: async (id: string): Promise<boolean> => {
        if (!supabase) return false;

        const { error } = await supabase
            .from('project_costs')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting cost:', error);
            return false;
        }

        return true;
    }
};
