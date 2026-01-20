/**
 * Expense Service - Quản lý Chi phí đầu vào
 * Handles CRUD operations for expenses table
 */

import { supabase } from '../utils/supabaseClient';

export interface Expense {
    id: string;
    expense_code?: string;
    category: 'Salary' | 'Equipment' | 'Travel' | 'Outsource' | 'Office' | 'Marketing' | 'Other';
    sub_category?: string;
    description: string;
    vendor_name?: string;

    amount: number;
    vat_rate?: number;
    vat_amount?: number;
    total_amount?: number;

    expense_date: string;
    payment_date?: string;
    due_date?: string;

    payment_status: 'Pending' | 'Paid' | 'Partial' | 'Cancelled' | 'Overdue';
    payment_method?: 'Cash' | 'Transfer' | 'Check' | 'Card';

    project_id?: string;

    invoice_number?: string;
    invoice_date?: string;
    invoice_file_url?: string;
    receipt_file_url?: string;

    created_by?: string;
    approved_by?: string;
    approved_at?: string;
    approval_status?: 'Pending' | 'Approved' | 'Rejected';

    notes?: string;
    created_at?: string;
    updated_at?: string;
}

// Mapper: DB → App
const mapExpenseFromDB = (e: any): Expense => ({
    id: e.id,
    expense_code: e.expense_code,
    category: e.category,
    sub_category: e.sub_category,
    description: e.description,
    vendor_name: e.vendor_name,

    amount: Number(e.amount),
    vat_rate: e.vat_rate ? Number(e.vat_rate) : 0,
    vat_amount: e.vat_amount ? Number(e.vat_amount) : 0,
    total_amount: e.total_amount ? Number(e.total_amount) : Number(e.amount),

    expense_date: e.expense_date,
    payment_date: e.payment_date,
    due_date: e.due_date,

    payment_status: e.payment_status,
    payment_method: e.payment_method,

    project_id: e.project_id,

    invoice_number: e.invoice_number,
    invoice_date: e.invoice_date,
    invoice_file_url: e.invoice_file_url,
    receipt_file_url: e.receipt_file_url,

    created_by: e.created_by,
    approved_by: e.approved_by,
    approved_at: e.approved_at,
    approval_status: e.approval_status,

    notes: e.notes,
    created_at: e.created_at,
    updated_at: e.updated_at
});

// Mapper: App → DB
const mapExpenseToDB = (e: Partial<Expense>) => {
    const payload: any = {
        expense_code: e.expense_code,
        category: e.category,
        sub_category: e.sub_category,
        description: e.description,
        vendor_name: e.vendor_name,

        amount: e.amount,
        vat_rate: e.vat_rate,

        expense_date: e.expense_date,
        payment_date: e.payment_date,
        due_date: e.due_date,

        payment_status: e.payment_status,
        payment_method: e.payment_method,

        project_id: e.project_id,

        invoice_number: e.invoice_number,
        invoice_date: e.invoice_date,
        invoice_file_url: e.invoice_file_url,
        receipt_file_url: e.receipt_file_url,

        created_by: e.created_by,
        approved_by: e.approved_by,
        approved_at: e.approved_at,
        approval_status: e.approval_status,

        notes: e.notes
    };

    // Remove undefined
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
    return payload;
};

export const ExpenseService = {
    // Get all expenses
    getExpenses: async (): Promise<Expense[]> => {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .order('expense_date', { ascending: false });

        if (error) {
            console.error('Error fetching expenses:', error);
            return [];
        }
        return data.map(mapExpenseFromDB);
    },

    // Get expenses by project
    getExpensesByProject: async (projectId: string): Promise<Expense[]> => {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('project_id', projectId)
            .order('expense_date', { ascending: false });

        if (error) {
            console.error('Error fetching project expenses:', error);
            return [];
        }
        return data.map(mapExpenseFromDB);
    },

    // Get expense by ID
    getExpenseById: async (id: string): Promise<Expense | null> => {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            console.error('Error fetching expense:', error);
            return null;
        }
        return mapExpenseFromDB(data);
    },

    // Create expense
    createExpense: async (expense: Partial<Expense>): Promise<Expense | null> => {
        const payload = mapExpenseToDB(expense);
        const { data, error } = await supabase
            .from('expenses')
            .insert([payload])
            .select()
            .single();

        if (error) {
            console.error('Error creating expense:', error);
            return null;
        }
        return mapExpenseFromDB(data);
    },

    // Update expense
    updateExpense: async (id: string, updates: Partial<Expense>): Promise<Expense | null> => {
        const payload = mapExpenseToDB(updates);
        const { data, error } = await supabase
            .from('expenses')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating expense:', error);
            return null;
        }
        return mapExpenseFromDB(data);
    },

    // Delete expense
    deleteExpense: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting expense:', error);
        }
    },

    // Mark as paid
    markAsPaid: async (id: string, paymentDate: string, paymentMethod: string): Promise<Expense | null> => {
        return ExpenseService.updateExpense(id, {
            payment_status: 'Paid',
            payment_date: paymentDate,
            payment_method: paymentMethod as any
        });
    },

    // Approve expense
    approveExpense: async (id: string, approvedBy: string): Promise<Expense | null> => {
        return ExpenseService.updateExpense(id, {
            approval_status: 'Approved',
            approved_by: approvedBy,
            approved_at: new Date().toISOString()
        });
    },

    // Get expenses by category
    getExpensesByCategory: async (category: string): Promise<Expense[]> => {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('category', category)
            .order('expense_date', { ascending: false });

        if (error) {
            console.error('Error fetching expenses by category:', error);
            return [];
        }
        return data.map(mapExpenseFromDB);
    },

    // Get expenses by date range
    getExpensesByDateRange: async (startDate: string, endDate: string): Promise<Expense[]> => {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .gte('expense_date', startDate)
            .lte('expense_date', endDate)
            .order('expense_date', { ascending: false });

        if (error) {
            console.error('Error fetching expenses by date range:', error);
            return [];
        }
        return data.map(mapExpenseFromDB);
    },

    // Get expense statistics
    getExpenseStats: async () => {
        const expenses = await ExpenseService.getExpenses();

        const totalExpenses = expenses.reduce((sum, e) => sum + (e.total_amount || 0), 0);
        const paidExpenses = expenses.filter(e => e.payment_status === 'Paid').reduce((sum, e) => sum + (e.total_amount || 0), 0);
        const pendingExpenses = expenses.filter(e => e.payment_status === 'Pending').reduce((sum, e) => sum + (e.total_amount || 0), 0);

        const byCategory: Record<string, number> = {};
        expenses.forEach(e => {
            byCategory[e.category] = (byCategory[e.category] || 0) + (e.total_amount || 0);
        });

        return {
            total: expenses.length,
            totalAmount: totalExpenses,
            paidAmount: paidExpenses,
            pendingAmount: pendingExpenses,
            byCategory,
            avgExpenseAmount: expenses.length > 0 ? Math.round(totalExpenses / expenses.length) : 0
        };
    },

    // Get expenses summary by month
    getExpensesByMonth: async (year: number): Promise<Array<{
        month: number;
        totalAmount: number;
        count: number;
    }>> => {
        const expenses = await ExpenseService.getExpenses();
        const monthlyData: Record<number, { totalAmount: number; count: number }> = {};

        expenses.forEach(e => {
            const expenseDate = new Date(e.expense_date);
            if (expenseDate.getFullYear() === year) {
                const month = expenseDate.getMonth() + 1;
                if (!monthlyData[month]) {
                    monthlyData[month] = { totalAmount: 0, count: 0 };
                }
                monthlyData[month].totalAmount += (e.total_amount || 0);
                monthlyData[month].count += 1;
            }
        });

        return Object.entries(monthlyData).map(([month, data]) => ({
            month: parseInt(month),
            totalAmount: data.totalAmount,
            count: data.count
        })).sort((a, b) => a.month - b.month);
    }
};
