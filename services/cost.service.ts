import { ProjectCost } from '../types';
import { MOCK_PROJECT_COSTS } from '../constants_data/costs';

// Initialize in-memory store
let MOCK_COST_STORE: ProjectCost[] = [...MOCK_PROJECT_COSTS];

export const CostService = {
    // 1. Get Costs by Project
    getCostsByProject: async (projectId: string): Promise<ProjectCost[]> => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return MOCK_COST_STORE.filter(c => c.projectId === projectId);
    },

    // 2. Create Cost
    createCost: async (cost: Omit<ProjectCost, 'id'>): Promise<ProjectCost> => {
        await new Promise(resolve => setTimeout(resolve, 300));

        const newCost: ProjectCost = {
            ...cost,
            id: `C-${Date.now()}`, // Simple ID generation
        };

        MOCK_COST_STORE = [newCost, ...MOCK_COST_STORE];
        return newCost;
    },

    // 3. Update Cost
    updateCost: async (id: string, updates: Partial<ProjectCost>): Promise<ProjectCost | null> => {
        await new Promise(resolve => setTimeout(resolve, 300));

        const index = MOCK_COST_STORE.findIndex(c => c.id === id);
        if (index === -1) return null;

        const updatedCost = { ...MOCK_COST_STORE[index], ...updates };
        MOCK_COST_STORE[index] = updatedCost;

        return updatedCost;
    },

    // 4. Delete Cost
    deleteCost: async (id: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 300));

        const initialLength = MOCK_COST_STORE.length;
        MOCK_COST_STORE = MOCK_COST_STORE.filter(c => c.id !== id);

        return MOCK_COST_STORE.length < initialLength;
    }
};
