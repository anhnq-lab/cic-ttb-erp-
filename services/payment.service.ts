/**
 * Payment Service - Quản lý Thanh toán Hợp đồng
 * Handles payment transactions for contracts and milestones
 */

import { supabase } from '../utils/supabaseClient';
import { ContractService } from './contract.service';

export interface PaymentTransaction {
    id: string;
    contract_id: string;
    milestone_id?: string;
    description?: string;
    amount: number;
    payment_date?: string;
    status: 'Chưa thanh toán' | 'Đã thanh toán' | 'Đã hủy';
    invoice_number?: string;
    payment_method?: 'Tiền mặt' | 'Chuyển khoản' | 'Séc' | 'Khác';
    vat_rate?: number;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

// Mapper: DB → App
const mapPaymentFromDB = (p: any): PaymentTransaction => ({
    id: p.id,
    contract_id: p.contract_id,
    milestone_id: p.milestone_id,
    description: p.description,
    amount: Number(p.amount),
    payment_date: p.payment_date,
    status: p.status,
    invoice_number: p.invoice_number,
    payment_method: p.payment_method,
    vat_rate: p.vat_rate ? Number(p.vat_rate) : 0,
    notes: p.notes,
    created_at: p.created_at,
    updated_at: p.updated_at
});

// Mapper: App → DB
const mapPaymentToDB = (p: Partial<PaymentTransaction>) => {
    const payload: any = {
        contract_id: p.contract_id,
        milestone_id: p.milestone_id,
        description: p.description,
        amount: p.amount,
        payment_date: p.payment_date,
        status: p.status,
        invoice_number: p.invoice_number,
        payment_method: p.payment_method,
        vat_rate: p.vat_rate,
        notes: p.notes
    };

    // Remove undefined
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
    return payload;
};

export const PaymentService = {
    // Get all payment transactions
    getPayments: async (): Promise<PaymentTransaction[]> => {
        const { data, error } = await supabase
            .from('payment_transactions')
            .select('*')
            .order('payment_date', { ascending: false });

        if (error) {
            console.error('Error fetching payments:', error);
            return [];
        }
        return data.map(mapPaymentFromDB);
    },

    // Get payments by contract
    getPaymentsByContract: async (contractId: string): Promise<PaymentTransaction[]> => {
        const { data, error } = await supabase
            .from('payment_transactions')
            .select('*')
            .eq('contract_id', contractId)
            .order('payment_date', { ascending: false });

        if (error) {
            console.error('Error fetching contract payments:', error);
            return [];
        }
        return data.map(mapPaymentFromDB);
    },

    // Get payment by ID
    getPaymentById: async (id: string): Promise<PaymentTransaction | null> => {
        const { data, error } = await supabase
            .from('payment_transactions')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            console.error('Error fetching payment:', error);
            return null;
        }
        return mapPaymentFromDB(data);
    },

    // Create payment transaction
    createPayment: async (payment: Partial<PaymentTransaction>): Promise<PaymentTransaction | null> => {
        const payload = mapPaymentToDB(payment);
        const { data, error } = await supabase
            .from('payment_transactions')
            .insert([payload])
            .select()
            .single();

        if (error) {
            console.error('Error creating payment:', error);
            return null;
        }

        // Update contract paid_value after payment
        if (payment.contract_id && payment.amount) {
            await PaymentService.updateContractPaidValue(payment.contract_id);
        }

        // Update milestone status if linked
        if (payment.milestone_id && payment.status === 'Đã thanh toán') {
            await PaymentService.updateMilestoneStatus(payment.milestone_id, 'Đã thanh toán');
        }

        return mapPaymentFromDB(data);
    },

    // Update payment
    updatePayment: async (id: string, updates: Partial<PaymentTransaction>): Promise<PaymentTransaction | null> => {
        const payload = mapPaymentToDB(updates);
        const { data, error } = await supabase
            .from('payment_transactions')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating payment:', error);
            return null;
        }

        // Re-calculate contract paid_value
        if (data.contract_id) {
            await PaymentService.updateContractPaidValue(data.contract_id);
        }

        // Update milestone status if needed
        if (data.milestone_id && updates.status) {
            await PaymentService.updateMilestoneStatus(data.milestone_id, updates.status);
        }

        return mapPaymentFromDB(data);
    },

    // Delete payment
    deletePayment: async (id: string): Promise<void> => {
        // Get payment first to re-calculate contract value after deletion
        const payment = await PaymentService.getPaymentById(id);

        const { error } = await supabase
            .from('payment_transactions')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting payment:', error);
            return;
        }

        // Re-calculate contract paid_value
        if (payment?.contract_id) {
            await PaymentService.updateContractPaidValue(payment.contract_id);
        }

        // Reset milestone status if needed
        if (payment?.milestone_id) {
            await PaymentService.updateMilestoneStatus(payment.milestone_id, 'Chưa thanh toán');
        }
    },

    // Update contract paid_value (sum of all paid transactions)
    updateContractPaidValue: async (contractId: string): Promise<void> => {
        const payments = await PaymentService.getPaymentsByContract(contractId);
        const totalPaid = payments
            .filter(p => p.status === 'Đã thanh toán')
            .reduce((sum, p) => sum + p.amount, 0);

        // Update contract
        await ContractService.updateContract(contractId, {
            paidValue: totalPaid
        } as any);
    },

    // Update milestone status
    updateMilestoneStatus: async (milestoneId: string, status: string): Promise<void> => {
        const { error } = await supabase
            .from('payment_milestones')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', milestoneId);

        if (error) {
            console.error('Error updating milestone status:', error);
        }
    },

    // Record payment for a milestone
    recordMilestonePayment: async (
        contractId: string,
        milestoneId: string,
        amount: number,
        paymentDate: string,
        paymentMethod: string,
        invoiceNumber?: string
    ): Promise<PaymentTransaction | null> => {
        // Get milestone details
        const { data: milestone } = await supabase
            .from('payment_milestones')
            .select('*')
            .eq('id', milestoneId)
            .single();

        if (!milestone) {
            console.error('Milestone not found');
            return null;
        }

        // Create payment transaction
        const payment = await PaymentService.createPayment({
            contract_id: contractId,
            milestone_id: milestoneId,
            description: `Thanh toán ${milestone.phase}`,
            amount,
            payment_date: paymentDate,
            status: 'Đã thanh toán',
            payment_method: paymentMethod as any,
            invoice_number: invoiceNumber
        });

        return payment;
    },

    // Get payment statistics
    getPaymentStats: async () => {
        const payments = await PaymentService.getPayments();

        const totalPayments = payments.length;
        const paidPayments = payments.filter(p => p.status === 'Đã thanh toán');
        const pendingPayments = payments.filter(p => p.status === 'Chưa thanh toán');

        const totalPaidAmount = paidPayments.reduce((sum, p) => sum + p.amount, 0);
        const totalPendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

        return {
            totalPayments,
            paidCount: paidPayments.length,
            pendingCount: pendingPayments.length,
            totalPaidAmount,
            totalPendingAmount,
            avgPaymentAmount: totalPayments > 0 ? Math.round(totalPaidAmount / paidPayments.length) : 0
        };
    },

    // Get payments by date range
    getPaymentsByDateRange: async (startDate: string, endDate: string): Promise<PaymentTransaction[]> => {
        const { data, error } = await supabase
            .from('payment_transactions')
            .select('*')
            .gte('payment_date', startDate)
            .lte('payment_date', endDate)
            .order('payment_date', { ascending: false });

        if (error) {
            console.error('Error fetching payments by date range:', error);
            return [];
        }
        return data.map(mapPaymentFromDB);
    },

    // Get payments by month
    getPaymentsByMonth: async (year: number, month: number): Promise<PaymentTransaction[]> => {
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];

        return PaymentService.getPaymentsByDateRange(startDate, endDate);
    }
};
