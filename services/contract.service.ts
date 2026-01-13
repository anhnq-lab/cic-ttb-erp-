/**
 * Contract Service - Supabase Implementation
 */

import { supabase } from '../utils/supabaseClient';
import { Contract, ContractStatus, PaymentTransaction, PaymentStatus } from '../types';
import { CONTRACTS } from '../constants'; // Fallback

// Mapper for DB -> App
const mapContractFromDB = (c: any): Contract => ({
    id: c.id,
    projectId: c.project_id,
    customerId: c.customer_id, // ensure compatible with type
    code: c.code,
    signedDate: c.signed_date,
    packageName: c.package_name,
    projectName: c.project_name,
    location: c.location,
    contractType: c.contract_type,
    lawApplied: c.law_applied,

    sideAName: c.side_a_name,
    sideARep: c.side_a_rep,
    sideAPosition: c.side_a_position,
    sideAMst: c.side_a_mst,
    sideAStaff: c.side_a_staff,

    sideBName: c.side_b_name,
    sideBRep: c.side_b_rep,
    sideBPosition: c.side_b_position,
    sideBMst: c.side_b_mst,
    sideBBank: c.side_b_bank,

    totalValue: Number(c.total_value),
    vatIncluded: c.vat_included,
    advancePayment: Number(c.advance_payment),
    paidValue: Number(c.paid_value),
    remainingValue: Number(c.remaining_value),
    wipValue: Number(c.wip_value),

    duration: c.duration,
    startDate: c.start_date,
    endDate: c.end_date,
    warrantyPeriod: c.warranty_period,

    mainTasks: c.main_tasks || [],
    fileFormats: c.file_formats,
    deliveryMethod: c.delivery_method,
    acceptanceStandard: c.acceptance_standard,

    penaltyRate: c.penalty_rate,
    maxPenalty: c.max_penalty,
    disputeResolution: c.dispute_resolution,

    status: c.status as ContractStatus,
    fileUrl: c.file_url,
    driveLink: c.drive_link,

    // Relations
    paymentMilestones: (c.payment_milestones || []).map((m: any) => ({
        id: m.id,
        phase: m.phase,
        condition: m.condition,
        percentage: Number(m.percentage),
        amount: Number(m.amount),
        dueDate: m.due_date,
        status: m.status as PaymentStatus,
        invoiceDate: m.invoice_date,
        acceptanceProduct: m.acceptance_product,
        updatedBy: m.updated_by,
        completionProgress: m.completion_progress
    })),

    transactions: (c.payment_transactions || []).map((t: any) => ({
        id: t.id,
        description: t.description,
        amount: Number(t.amount),
        paymentDate: t.payment_date,
        date: t.payment_date,
        status: t.status as PaymentStatus,
        invoiceNumber: t.invoice_number,
        paymentMethod: t.payment_method as any
    })),

    // Personnel is in a separate table contract_personnel, check if joined
    // For now returning empty or mapping if joined
    personnel: (c.contract_personnel || []).map((p: any) => ({
        role: p.role,
        name: p.name
    }))
});

// Mapper for App -> DB
const mapContractToDB = (c: Partial<Contract>) => {
    const payload: any = {
        project_id: c.projectId,
        code: c.code,
        signed_date: c.signedDate,
        package_name: c.packageName,
        project_name: c.projectName,
        location: c.location,
        contract_type: c.contractType,
        law_applied: c.lawApplied,

        side_a_name: c.sideAName,
        side_a_rep: c.sideARep,
        side_a_position: c.sideAPosition,
        side_a_mst: c.sideAMst,
        side_a_staff: c.sideAStaff,

        side_b_name: c.sideBName,
        side_b_rep: c.sideBRep,
        side_b_position: c.sideBPosition,
        side_b_mst: c.sideBMst,

        total_value: c.totalValue,
        vat_included: c.vatIncluded,
        advance_payment: c.advancePayment,
        paid_value: c.paidValue,
        remaining_value: c.remainingValue,
        wip_value: c.wipValue,

        duration: c.duration,
        start_date: c.startDate,
        end_date: c.endDate,
        warranty_period: c.warrantyPeriod,

        main_tasks: c.mainTasks,
        file_formats: c.fileFormats,
        delivery_method: c.deliveryMethod,
        acceptance_standard: c.acceptanceStandard,

        penalty_rate: c.penaltyRate,
        max_penalty: c.maxPenalty,
        dispute_resolution: c.disputeResolution,

        status: c.status,
        file_url: c.fileUrl,
        drive_link: c.driveLink
    };

    // Remove undefined
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
    return payload;
};

export const ContractService = {
    // Get All Contracts
    getContracts: async (): Promise<Contract[]> => {
        const { data, error } = await supabase
            .from('contracts')
            .select(`
                *,
                payment_milestones(*),
                payment_transactions(*),
                contract_personnel(*)
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching contracts:', error);
            return CONTRACTS;
        }
        return data.map(mapContractFromDB);
    },

    // Get Contracts by Project ID
    getContractsByProject: async (projectId: string): Promise<Contract[]> => {
        const { data, error } = await supabase
            .from('contracts')
            .select(`
                *,
                payment_milestones(*),
                payment_transactions(*),
                contract_personnel(*)
            `)
            .eq('project_id', projectId);

        if (error) return [];
        return data.map(mapContractFromDB);
    },

    // Get Contract by Code
    getContractByCode: async (code: string): Promise<Contract | undefined> => {
        const { data, error } = await supabase
            .from('contracts')
            .select(`
                *,
                payment_milestones(*),
                payment_transactions(*),
                contract_personnel(*)
            `)
            .eq('code', code)
            .single();

        if (error || !data) return undefined;
        return mapContractFromDB(data);
    },

    // Update Contract
    updateContract: async (id: string, updates: Partial<Contract>): Promise<Contract | null> => {
        const payload = mapContractToDB(updates);
        const { data, error } = await supabase
            .from('contracts')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating contract:', error);
            return null;
        }
        // Return full object by refetching or allow generic return
        // Ideally should fetch relations again, but for now map what we have
        return mapContractFromDB(data);
    },

    // Create Contract
    createContract: async (contract: Contract): Promise<Contract | null> => {
        const payload = mapContractToDB(contract);
        const { data, error } = await supabase
            .from('contracts')
            .insert([payload])
            .select()
            .single();

        if (error) {
            console.error('Error creating contract:', error);
            return null;
        }

        // Also need to create milestones if present?
        // Usually creation is separate for relations, but if provided in UI...
        // For MVP, we assume complex creation handled separately or we add logic here

        return mapContractFromDB(data);
    },

    // Delete Contract
    deleteContract: async (contractId: string): Promise<void> => {
        await supabase.from('contracts').delete().eq('id', contractId);
    },

    // Add Transaction
    addTransaction: async (contractId: string, transaction: PaymentTransaction): Promise<Contract | null> => {
        const payload = {
            contract_id: contractId,
            description: transaction.description,
            amount: transaction.amount,
            payment_date: transaction.paymentDate || transaction.date,
            status: transaction.status,
            invoice_number: transaction.invoiceNumber,
            payment_method: transaction.paymentMethod
        };

        const { error } = await supabase.from('payment_transactions').insert([payload]);
        if (error) {
            console.error('Error adding transaction:', error);
            return null;
        }

        // Update contract totals trigger typically handles this, but if not:
        // We rely on DB triggers ideally.

        // Return updated contract
        const { data } = await supabase.from('contracts').select('*, payment_transactions(*)').eq('id', contractId).single();
        return data ? mapContractFromDB(data) : null;
    },

    // Update Milestone Status
    updateMilestoneStatus: async (contractId: string, milestoneId: string, status: PaymentStatus, invoiceDate?: string): Promise<Contract | null> => {
        const payload: any = { status };
        if (invoiceDate) payload.invoice_date = invoiceDate;

        await supabase.from('payment_milestones').update(payload).eq('id', milestoneId);

        // Return updated contract
        const { data } = await supabase
            .from('contracts')
            .select('*, payment_milestones(*)')
            .eq('id', contractId)
            .single();

        return data ? mapContractFromDB(data) : null;
    },

    // Get receivables by client (Aggregation)
    getReceivablesByClient: async (): Promise<Array<{
        client: string;
        totalValue: number;
        paidValue: number;
        receivables: number;
        contractCount: number;
        paymentProgress: number;
    }>> => {
        // This is complex to do with simple Supabase query.
        // Option 1: Fetch all and aggregate in JS (easiest for small data)
        // Option 2: RPC call
        const contracts = await ContractService.getContracts();

        const clientMap: Record<string, { total: number; paid: number; remaining: number; count: number }> = {};

        contracts.forEach(c => {
            const client = c.sideAName || 'Không xác định';
            if (!clientMap[client]) {
                clientMap[client] = { total: 0, paid: 0, remaining: 0, count: 0 };
            }
            clientMap[client].total += c.totalValue;
            clientMap[client].paid += c.paidValue;
            clientMap[client].remaining += c.remainingValue;
            clientMap[client].count += 1;
        });

        return Object.entries(clientMap)
            .map(([client, data]) => ({
                client,
                totalValue: data.total,
                paidValue: data.paid,
                receivables: data.remaining,
                contractCount: data.count,
                paymentProgress: data.total > 0 ? Math.round((data.paid / data.total) * 100) : 0
            }))
            .filter(item => item.receivables > 0)
            .sort((a, b) => b.receivables - a.receivables);
    },

    // Get revenue by period
    getRevenueByPeriod: async (period: 'monthly' | 'quarterly' = 'quarterly'): Promise<Array<{
        period: string;
        totalValue: number;
        paidValue: number;
        contractCount: number;
    }>> => {
        const contracts = await ContractService.getContracts();
        const periodMap: Record<string, { total: number; paid: number; count: number }> = {};

        contracts.forEach(c => {
            if (!c.signedDate) return;
            const date = new Date(c.signedDate);
            let periodKey: string;
            if (period === 'monthly') {
                periodKey = `T${date.getMonth() + 1}/${date.getFullYear()}`;
            } else {
                const quarter = Math.ceil((date.getMonth() + 1) / 3);
                periodKey = `Q${quarter}/${date.getFullYear()}`;
            }

            if (!periodMap[periodKey]) {
                periodMap[periodKey] = { total: 0, paid: 0, count: 0 };
            }
            periodMap[periodKey].total += c.totalValue;
            periodMap[periodKey].paid += c.paidValue;
            periodMap[periodKey].count += 1;
        });

        return Object.entries(periodMap)
            .map(([periodStr, data]) => ({
                period: periodStr,
                totalValue: data.total,
                paidValue: data.paid,
                contractCount: data.count
            }))
            .sort((a, b) => b.period.localeCompare(a.period));
    },

    // Get contract statistics
    getContractStats: async () => {
        const contracts = await ContractService.getContracts();
        const byStatus: Record<string, number> = {};
        contracts.forEach(c => {
            byStatus[c.status] = (byStatus[c.status] || 0) + 1;
        });

        const totalValue = contracts.reduce((sum, c) => sum + c.totalValue, 0);
        const totalPaid = contracts.reduce((sum, c) => sum + c.paidValue, 0);
        const totalReceivables = contracts.reduce((sum, c) => sum + c.remainingValue, 0);

        return {
            total: contracts.length,
            totalValue,
            totalPaid,
            totalReceivables,
            byStatus,
            avgContractValue: contracts.length > 0 ? Math.round(totalValue / contracts.length) : 0,
            paymentProgress: totalValue > 0 ? Math.round((totalPaid / totalValue) * 100) : 0
        };
    },

    // Get top contracts by value
    getTopContracts: async (limit: number = 5) => {
        const contracts = await ContractService.getContracts();
        return [...contracts]
            .sort((a, b) => b.totalValue - a.totalValue)
            .slice(0, limit)
            .map(c => ({
                id: c.id,
                code: c.code,
                projectName: c.projectName,
                client: c.sideAName,
                totalValue: c.totalValue,
                paidValue: c.paidValue,
                status: c.status
            }));
    }
};

