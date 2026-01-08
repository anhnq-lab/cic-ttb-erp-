/**
 * Contract Service - Mock Implementation
 * Uses data from constants_data/contracts.ts
 * Backend will be implemented later
 */

import { Contract, ContractStatus, PaymentTransaction, PaymentStatus } from '../types';
import { CONTRACTS } from '../constants';

// Mock Store for Contracts
let MOCK_CONTRACT_STORE: Contract[] = [...CONTRACTS];

export const ContractService = {
    // Get All Contracts
    getContracts: async (): Promise<Contract[]> => {
        if (MOCK_CONTRACT_STORE.length === 0 && CONTRACTS.length > 0) {
            MOCK_CONTRACT_STORE = [...CONTRACTS];
        }
        return [...MOCK_CONTRACT_STORE];
    },

    // Get Contracts by Project ID
    getContractsByProject: async (projectId: string): Promise<Contract[]> => {
        const all = await ContractService.getContracts();
        return all.filter(c => c.projectId === projectId);
    },

    // Get Contract by Code
    getContractByCode: async (code: string): Promise<Contract | undefined> => {
        const contracts = await ContractService.getContracts();
        return contracts.find(c => c.code === code);
    },

    // Update Contract
    updateContract: async (id: string, updates: Partial<Contract>): Promise<Contract | null> => {
        const idx = MOCK_CONTRACT_STORE.findIndex(c => c.id === id);
        if (idx > -1) {
            MOCK_CONTRACT_STORE[idx] = { ...MOCK_CONTRACT_STORE[idx], ...updates };
            return MOCK_CONTRACT_STORE[idx];
        }
        return null;
    },

    // Create Contract
    createContract: async (contract: Contract): Promise<Contract | null> => {
        MOCK_CONTRACT_STORE.push(contract);
        return contract;
    },

    // Delete Contract
    deleteContract: async (contractId: string): Promise<void> => {
        MOCK_CONTRACT_STORE = MOCK_CONTRACT_STORE.filter(c => c.id !== contractId);
    },

    // Add Transaction
    addTransaction: async (contractId: string, transaction: PaymentTransaction): Promise<Contract | null> => {
        const contract = MOCK_CONTRACT_STORE.find(c => c.id === contractId);
        if (!contract) return null;

        const newTransactions = [transaction, ...(contract.transactions || [])];
        const newPaidValue = contract.paidValue + transaction.amount;
        const newRemainingValue = contract.totalValue - newPaidValue;

        const idx = MOCK_CONTRACT_STORE.findIndex(c => c.id === contractId);
        if (idx > -1) {
            MOCK_CONTRACT_STORE[idx] = {
                ...MOCK_CONTRACT_STORE[idx],
                transactions: newTransactions,
                paidValue: newPaidValue,
                remainingValue: newRemainingValue
            };
            return MOCK_CONTRACT_STORE[idx];
        }
        return null;
    },

    // Update Milestone Status
    updateMilestoneStatus: async (contractId: string, milestoneId: string, status: PaymentStatus, invoiceDate?: string): Promise<Contract | null> => {
        const contract = MOCK_CONTRACT_STORE.find(c => c.id === contractId);
        if (!contract || !contract.paymentMilestones) return null;

        const updatedMilestones = contract.paymentMilestones.map(m => {
            if (m.id === milestoneId) {
                return { ...m, status, invoiceDate: invoiceDate || m.invoiceDate, updatedAt: new Date().toISOString() };
            }
            return m;
        });

        const idx = MOCK_CONTRACT_STORE.findIndex(c => c.id === contractId);
        if (idx > -1) {
            MOCK_CONTRACT_STORE[idx] = { ...MOCK_CONTRACT_STORE[idx], paymentMilestones: updatedMilestones };
            return MOCK_CONTRACT_STORE[idx];
        }
        return null;
    },

    // Get receivables by client
    getReceivablesByClient: async (): Promise<Array<{
        client: string;
        totalValue: number;
        paidValue: number;
        receivables: number;
        contractCount: number;
        paymentProgress: number;
    }>> => {
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
    getContractStats: async (): Promise<{
        total: number;
        totalValue: number;
        totalPaid: number;
        totalReceivables: number;
        byStatus: Record<string, number>;
        avgContractValue: number;
        paymentProgress: number;
    }> => {
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
    getTopContracts: async (limit: number = 5): Promise<Array<{
        id: string;
        code: string;
        projectName: string;
        client: string;
        totalValue: number;
        paidValue: number;
        status: ContractStatus;
    }>> => {
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
