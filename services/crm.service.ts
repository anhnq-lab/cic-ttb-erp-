/**
 * CRM Service - Mock Implementation
 * Uses data from constants (Supabase will be added later)
 */

import { Customer, CRMContact, CRMActivity, CRMOpportunity } from '../types';
import { CUSTOMERS, MOCK_CRM_CONTACTS, MOCK_CRM_ACTIVITIES, MOCK_CRM_OPPORTUNITIES } from '../constants';

// Mock stores
let MOCK_CUSTOMER_STORE: Customer[] = [...CUSTOMERS];
let MOCK_CONTACT_STORE: CRMContact[] = [...MOCK_CRM_CONTACTS];
let MOCK_ACTIVITY_STORE: CRMActivity[] = [...MOCK_CRM_ACTIVITIES];
let MOCK_OPPORTUNITY_STORE: CRMOpportunity[] = [...MOCK_CRM_OPPORTUNITIES];

export const CRMService = {
    // CUSTOMERS
    getCustomers: async (): Promise<Customer[]> => [...MOCK_CUSTOMER_STORE],

    getCustomerById: async (id: string): Promise<Customer | undefined> =>
        MOCK_CUSTOMER_STORE.find(c => c.id === id || c.code === id),

    createCustomer: async (customer: Omit<Customer, 'id'>): Promise<Customer | null> => {
        const newCustomer = { ...customer, id: `CUST-${Date.now()}` } as Customer;
        MOCK_CUSTOMER_STORE.unshift(newCustomer);
        return newCustomer;
    },

    updateCustomer: async (id: string, updates: Partial<Customer>): Promise<Customer | null> => {
        const idx = MOCK_CUSTOMER_STORE.findIndex(c => c.id === id);
        if (idx > -1) { MOCK_CUSTOMER_STORE[idx] = { ...MOCK_CUSTOMER_STORE[idx], ...updates }; return MOCK_CUSTOMER_STORE[idx]; }
        return null;
    },

    deleteCustomer: async (id: string): Promise<boolean> => {
        const len = MOCK_CUSTOMER_STORE.length;
        MOCK_CUSTOMER_STORE = MOCK_CUSTOMER_STORE.filter(c => c.id !== id);
        return MOCK_CUSTOMER_STORE.length < len;
    },

    // CONTACTS
    getContacts: async (customerId: string): Promise<CRMContact[]> =>
        MOCK_CONTACT_STORE.filter(c => c.customerId === customerId),

    createContact: async (contact: Omit<CRMContact, 'id'>): Promise<CRMContact | null> => {
        const newContact = { ...contact, id: `CT-${Date.now()}` } as CRMContact;
        MOCK_CONTACT_STORE.push(newContact);
        return newContact;
    },

    deleteContact: async (id: string): Promise<boolean> => {
        MOCK_CONTACT_STORE = MOCK_CONTACT_STORE.filter(c => c.id !== id);
        return true;
    },

    // ACTIVITIES
    getActivities: async (customerId: string): Promise<CRMActivity[]> =>
        MOCK_ACTIVITY_STORE.filter(a => a.customerId === customerId),

    createActivity: async (activity: Omit<CRMActivity, 'id'>): Promise<CRMActivity | null> => {
        const newActivity = { ...activity, id: `ACT-${Date.now()}` } as CRMActivity;
        MOCK_ACTIVITY_STORE.unshift(newActivity);
        return newActivity;
    },

    deleteActivity: async (id: string): Promise<boolean> => {
        MOCK_ACTIVITY_STORE = MOCK_ACTIVITY_STORE.filter(a => a.id !== id);
        return true;
    },

    // OPPORTUNITIES
    getOpportunities: async (customerId: string): Promise<CRMOpportunity[]> =>
        MOCK_OPPORTUNITY_STORE.filter(o => o.customerId === customerId),

    getAllOpportunities: async (): Promise<CRMOpportunity[]> => [...MOCK_OPPORTUNITY_STORE],

    createOpportunity: async (opp: Omit<CRMOpportunity, 'id'>): Promise<CRMOpportunity | null> => {
        const newOpp = { ...opp, id: `OPP-${Date.now()}` } as CRMOpportunity;
        MOCK_OPPORTUNITY_STORE.push(newOpp);
        return newOpp;
    },

    updateOpportunity: async (id: string, updates: Partial<CRMOpportunity>): Promise<CRMOpportunity | null> => {
        const idx = MOCK_OPPORTUNITY_STORE.findIndex(o => o.id === id);
        if (idx > -1) { MOCK_OPPORTUNITY_STORE[idx] = { ...MOCK_OPPORTUNITY_STORE[idx], ...updates }; return MOCK_OPPORTUNITY_STORE[idx]; }
        return null;
    },

    deleteOpportunity: async (id: string): Promise<boolean> => {
        MOCK_OPPORTUNITY_STORE = MOCK_OPPORTUNITY_STORE.filter(o => o.id !== id);
        return true;
    },

    // ANALYTICS
    getCustomerStats: async (): Promise<{ total: number; byTier: Record<string, number>; byStatus: Record<string, number>; topByValue: Array<{ name: string; value: number }> }> => {
        const customers = await CRMService.getCustomers();
        const byTier: Record<string, number> = {};
        const byStatus: Record<string, number> = {};
        customers.forEach(c => { byTier[c.tier] = (byTier[c.tier] || 0) + 1; byStatus[c.status] = (byStatus[c.status] || 0) + 1; });
        const topByValue = [...customers].sort((a, b) => b.totalProjectValue - a.totalProjectValue).slice(0, 5).map(c => ({ name: c.shortName || c.name, value: c.totalProjectValue }));
        return { total: customers.length, byTier, byStatus, topByValue };
    },

    getPipelineStats: async (): Promise<{ totalPipelineValue: number; byStage: Array<{ stage: string; count: number; value: number }>; winRate: number; avgDealSize: number }> => {
        const opportunities = [...MOCK_OPPORTUNITY_STORE];
        const byStageMap: Record<string, { count: number; value: number }> = {};
        opportunities.forEach(o => { if (!byStageMap[o.stage]) byStageMap[o.stage] = { count: 0, value: 0 }; byStageMap[o.stage].count += 1; byStageMap[o.stage].value += o.value; });
        const wonOpps = opportunities.filter(o => o.stage === 'Won');
        const closedOpps = opportunities.filter(o => o.stage === 'Won' || o.stage === 'Lost');
        const winRate = closedOpps.length > 0 ? (wonOpps.length / closedOpps.length) * 100 : 0;
        const totalPipelineValue = opportunities.filter(o => o.stage !== 'Won' && o.stage !== 'Lost').reduce((sum, o) => sum + o.value, 0);
        const avgDealSize = opportunities.length > 0 ? opportunities.reduce((sum, o) => sum + o.value, 0) / opportunities.length : 0;
        return { totalPipelineValue, byStage: Object.entries(byStageMap).map(([stage, data]) => ({ stage, count: data.count, value: data.value })), winRate: Math.round(winRate * 10) / 10, avgDealSize: Math.round(avgDealSize) };
    },

    getRecentActivities: async (limit: number = 10): Promise<CRMActivity[]> =>
        [...MOCK_ACTIVITY_STORE].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit),

    getCustomerWithDetails: async (customerId: string): Promise<{ customer: Customer | undefined; contacts: CRMContact[]; activities: CRMActivity[]; opportunities: CRMOpportunity[]; stats: { totalOpportunityValue: number; activeOpportunities: number } }> => {
        const [customer, contacts, activities, opportunities] = await Promise.all([
            CRMService.getCustomerById(customerId), CRMService.getContacts(customerId), CRMService.getActivities(customerId), CRMService.getOpportunities(customerId)
        ]);
        const activeOpps = opportunities.filter(o => o.stage !== 'Won' && o.stage !== 'Lost');
        return { customer, contacts, activities, opportunities, stats: { totalOpportunityValue: opportunities.reduce((sum, o) => sum + o.value, 0), activeOpportunities: activeOpps.length } };
    },

    // Subscribe (no-op without Supabase)
    subscribeToCustomers: (callback: () => void) => null,
    unsubscribe: (channel: any) => { }
};
