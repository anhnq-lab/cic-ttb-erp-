/**
 * CRM Service - Supabase Implementation
 * Managed by Antigravity
 */

import { supabase } from '../utils/supabaseClient';
import { Customer, CRMContact, CRMActivity, CRMOpportunity } from '../types';

// --- MAPPING HELPERS ---

const mapCustomerFromDB = (c: any): Customer => ({
    id: c.id,
    code: c.code,
    name: c.name,
    shortName: c.short_name || '',
    type: c.type,
    category: c.category,
    taxCode: c.tax_code || '',
    address: c.address || '',
    representative: c.representative || '',
    contactPerson: c.contact_person || '',
    email: c.email || '',
    phone: c.phone || '',
    status: c.status as 'Active' | 'Inactive',
    tier: c.tier as 'VIP' | 'Gold' | 'Standard',
    totalProjectValue: Number(c.total_project_value) || 0,
    logo: c.logo || ''
});

const mapCustomerToDB = (c: Partial<Customer>) => {
    const payload: any = {
        code: c.code,
        name: c.name,
        short_name: c.shortName,
        type: c.type,
        category: c.category,
        tax_code: c.taxCode,
        address: c.address,
        representative: c.representative,
        contact_person: c.contactPerson,
        email: c.email,
        phone: c.phone,
        status: c.status,
        tier: c.tier,
        total_project_value: c.totalProjectValue,
        logo: c.logo
    };
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
    return payload;
};

const mapContactFromDB = (c: any): CRMContact => ({
    id: c.id,
    customerId: c.customer_id,
    name: c.name,
    position: c.position || '',
    email: c.email || '',
    phone: c.phone || '',
    isPrimary: c.is_primary || false
});

const mapActivityFromDB = (a: any): CRMActivity => ({
    id: a.id,
    customerId: a.customer_id,
    type: a.type as any,
    date: a.activity_date,
    title: a.subject || '',
    description: a.description || '',
    createdBy: a.created_by || ''
});

const mapOpportunityFromDB = (o: any): CRMOpportunity => ({
    id: o.id,
    customerId: o.customer_id,
    name: o.name,
    value: Number(o.value) || 0,
    stage: o.stage as any,
    probability: o.probability || 0,
    expectedCloseDate: o.expected_close_date
});

// --- SERVICE IMPLEMENTATION ---

export const CRMService = {
    // CUSTOMERS
    getCustomers: async (): Promise<Customer[]> => {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching customers:', error);
            return [];
        }
        return data.map(mapCustomerFromDB);
    },

    getCustomerById: async (id: string): Promise<Customer | undefined> => {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .or(`id.eq.${id},code.eq.${id}`)
            .single();

        if (error || !data) return undefined;
        return mapCustomerFromDB(data);
    },

    createCustomer: async (customer: Omit<Customer, 'id'>): Promise<Customer | null> => {
        const dbPayload = mapCustomerToDB(customer);
        const { data, error } = await supabase
            .from('customers')
            .insert([dbPayload])
            .select()
            .single();

        if (error) {
            console.error('Error creating customer:', error);
            return null;
        }
        return mapCustomerFromDB(data);
    },

    updateCustomer: async (id: string, updates: Partial<Customer>): Promise<Customer | null> => {
        const dbPayload = mapCustomerToDB(updates);
        const { data, error } = await supabase
            .from('customers')
            .update(dbPayload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating customer:', error);
            return null;
        }
        return mapCustomerFromDB(data);
    },

    deleteCustomer: async (id: string): Promise<boolean> => {
        const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting customer:', error);
            return false;
        }
        return true;
    },

    // CONTACTS
    getContacts: async (customerId: string): Promise<CRMContact[]> => {
        const { data, error } = await supabase
            .from('crm_contacts')
            .select('*')
            .eq('customer_id', customerId);

        if (error) return [];
        return data.map(mapContactFromDB);
    },

    createContact: async (contact: Omit<CRMContact, 'id'>): Promise<CRMContact | null> => {
        const payload = {
            customer_id: contact.customerId,
            name: contact.name,
            position: contact.position,
            phone: contact.phone,
            email: contact.email,
            is_primary: contact.isPrimary
        };
        const { data, error } = await supabase.from('crm_contacts').insert([payload]).select().single();
        if (error) return null;
        return mapContactFromDB(data);
    },

    deleteContact: async (id: string): Promise<boolean> => {
        const { error } = await supabase.from('crm_contacts').delete().eq('id', id);
        return !error;
    },

    // ACTIVITIES
    getActivities: async (customerId: string): Promise<CRMActivity[]> => {
        const { data, error } = await supabase
            .from('crm_activities')
            .select('*')
            .eq('customer_id', customerId)
            .order('activity_date', { ascending: false });

        if (error) return [];
        return data.map(mapActivityFromDB);
    },

    createActivity: async (activity: Omit<CRMActivity, 'id'>): Promise<CRMActivity | null> => {
        const payload = {
            customer_id: activity.customerId,
            type: activity.type,
            subject: activity.title,
            activity_date: activity.date,
            description: activity.description,
            created_by: activity.createdBy
        };
        const { data, error } = await supabase.from('crm_activities').insert([payload]).select().single();
        if (error) return null;
        return mapActivityFromDB(data);
    },

    deleteActivity: async (id: string): Promise<boolean> => {
        const { error } = await supabase.from('crm_activities').delete().eq('id', id);
        return !error;
    },

    // OPPORTUNITIES
    getOpportunities: async (customerId: string): Promise<CRMOpportunity[]> => {
        const { data, error } = await supabase
            .from('crm_opportunities')
            .select('*')
            .eq('customer_id', customerId)
            .order('created_at', { ascending: false });

        if (error) return [];
        return data.map(mapOpportunityFromDB);
    },

    getAllOpportunities: async (): Promise<CRMOpportunity[]> => {
        const { data, error } = await supabase
            .from('crm_opportunities')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) return [];
        return data.map(mapOpportunityFromDB);
    },

    createOpportunity: async (opp: Omit<CRMOpportunity, 'id'>): Promise<CRMOpportunity | null> => {
        const payload = {
            customer_id: opp.customerId,
            name: opp.name,
            value: opp.value,
            stage: opp.stage,
            probability: opp.probability,
            expected_close_date: opp.expectedCloseDate
        };
        const { data, error } = await supabase.from('crm_opportunities').insert([payload]).select().single();
        if (error) return null;
        return mapOpportunityFromDB(data);
    },

    updateOpportunity: async (id: string, updates: Partial<CRMOpportunity>): Promise<CRMOpportunity | null> => {
        const payload: any = {
            name: updates.name,
            value: updates.value,
            stage: updates.stage,
            probability: updates.probability,
            expected_close_date: updates.expectedCloseDate
        };
        Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

        const { data, error } = await supabase.from('crm_opportunities').update(payload).eq('id', id).select().single();
        if (error) return null;
        return mapOpportunityFromDB(data);
    },

    deleteOpportunity: async (id: string): Promise<boolean> => {
        const { error } = await supabase.from('crm_opportunities').delete().eq('id', id);
        return !error;
    },

    // ANALYTICS
    getCustomerStats: async (): Promise<any> => {
        const { data, error } = await supabase.from('customers').select('*');
        if (error || !data) return { total: 0, byTier: {}, byStatus: {}, topByValue: [] };

        const byTier: Record<string, number> = {};
        const byStatus: Record<string, number> = {};
        data.forEach(c => {
            byTier[c.tier] = (byTier[c.tier] || 0) + 1;
            byStatus[c.status] = (byStatus[c.status] || 0) + 1;
        });

        const topByValue = [...data]
            .sort((a, b) => (Number(b.total_project_value) || 0) - (Number(a.total_project_value) || 0))
            .slice(0, 5)
            .map(c => ({ name: c.short_name || c.name, value: Number(c.total_project_value) || 0 }));

        return { total: data.length, byTier, byStatus, topByValue };
    },

    getPipelineStats: async (): Promise<any> => {
        const { data: opportunities, error } = await supabase.from('crm_opportunities').select('*');
        if (error || !opportunities) return { totalPipelineValue: 0, byStage: [], winRate: 0, avgDealSize: 0 };

        const byStageMap: Record<string, { count: number; value: number }> = {};
        opportunities.forEach(o => {
            if (!byStageMap[o.stage]) byStageMap[o.stage] = { count: 0, value: 0 };
            byStageMap[o.stage].count += 1;
            byStageMap[o.stage].value += Number(o.value) || 0;
        });

        const wonOpps = opportunities.filter(o => o.stage === 'Won');
        const closedOpps = opportunities.filter(o => o.stage === 'Won' || o.stage === 'Lost');
        const winRate = closedOpps.length > 0 ? (wonOpps.length / closedOpps.length) * 100 : 0;
        const totalPipelineValue = opportunities.filter(o => o.stage !== 'Won' && o.stage !== 'Lost').reduce((sum, o) => sum + (Number(o.value) || 0), 0);
        const avgDealSize = opportunities.length > 0 ? opportunities.reduce((sum, o) => sum + (Number(o.value) || 0), 0) / opportunities.length : 0;

        return {
            totalPipelineValue,
            byStage: Object.entries(byStageMap).map(([stage, data]) => ({ stage, count: data.count, value: data.value })),
            winRate: Math.round(winRate * 10) / 10,
            avgDealSize: Math.round(avgDealSize)
        };
    },

    getRecentActivities: async (limit: number = 10): Promise<CRMActivity[]> => {
        const { data, error } = await supabase
            .from('crm_activities')
            .select('*')
            .order('activity_date', { ascending: false })
            .limit(limit);

        if (error || !data) return [];
        return data.map(mapActivityFromDB);
    },

    getCustomerWithDetails: async (customerId: string): Promise<any> => {
        const [customer, contacts, activities, opportunities] = await Promise.all([
            CRMService.getCustomerById(customerId),
            CRMService.getContacts(customerId),
            CRMService.getActivities(customerId),
            CRMService.getOpportunities(customerId)
        ]);

        const activeOpps = opportunities.filter(o => o.stage !== 'Won' && o.stage !== 'Lost');
        return {
            customer,
            contacts,
            activities,
            opportunities,
            stats: {
                totalOpportunityValue: opportunities.reduce((sum, o) => sum + o.value, 0),
                activeOpportunities: activeOpps.length
            }
        };
    },

    subscribeToCustomers: (callback: () => void) => {
        return supabase
            .channel('public:customers')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, callback)
            .subscribe();
    },

    unsubscribe: (channel: any) => {
        if (channel) supabase.removeChannel(channel);
    }
};
