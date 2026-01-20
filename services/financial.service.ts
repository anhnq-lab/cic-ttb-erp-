/**
 * Financial Service - Tổng hợp Tài chính
 * Aggregates revenue (contracts) and expenses data
 */

import { supabase } from '../utils/supabaseClient';
import { ContractService } from './contract.service';
import { ExpenseService } from './expense.service';
import { CostService } from './cost.service';
import { PaymentService } from './payment.service';

export interface FinancialSummary {
    totalRevenue: number;
    collectedRevenue: number;
    receivables: number;
    totalExpenses: number;
    paidExpenses: number;
    payables: number;
    netProfit: number;
    profitMargin: number;
}

export interface MonthlyFinancial {
    month: number;
    year: number;
    revenue: number;
    expenses: number;
    profit: number;
}

export interface CategoryExpenseSummary {
    category: string;
    amount: number;
    percentage: number;
}

export const FinancialService = {
    // Get overall financial summary
    getFinancialSummary: async (): Promise<FinancialSummary> => {
        // Revenue from contracts
        const contracts = await ContractService.getContracts();
        const totalRevenue = contracts.reduce((sum, c) => sum + (c.totalValue || 0), 0);
        const collectedRevenue = contracts.reduce((sum, c) => sum + (c.paidValue || 0), 0);
        const receivables = totalRevenue - collectedRevenue;

        // Expenses
        const expenses = await ExpenseService.getExpenses();
        const totalExpenses = expenses.reduce((sum, e) => sum + (e.total_amount || 0), 0);
        const paidExpenses = expenses
            .filter(e => e.payment_status === 'Paid')
            .reduce((sum, e) => sum + (e.total_amount || 0), 0);
        const payables = totalExpenses - paidExpenses;

        // Profit calculation
        const netProfit = collectedRevenue - paidExpenses;
        const profitMargin = collectedRevenue > 0 ? (netProfit / collectedRevenue) * 100 : 0;

        return {
            totalRevenue,
            collectedRevenue,
            receivables,
            totalExpenses,
            paidExpenses,
            payables,
            netProfit,
            profitMargin
        };
    },

    // Get financial summary by project
    getProjectFinancialSummary: async (projectId: string): Promise<FinancialSummary> => {
        // Revenue from project contracts
        const contracts = await ContractService.getContractsByProject(projectId);
        const totalRevenue = contracts.reduce((sum, c) => sum + (c.totalValue || 0), 0);
        const collectedRevenue = contracts.reduce((sum, c) => sum + (c.paidValue || 0), 0);
        const receivables = totalRevenue - collectedRevenue;

        // Expenses from project
        const expenses = await ExpenseService.getExpensesByProject(projectId);
        const projectCosts = await CostService.getCostsByProject(projectId);

        const expensesAmount = expenses.reduce((sum, e) => sum + (e.total_amount || 0), 0);
        const costsAmount = projectCosts.reduce((sum, c) => sum + (c.amount || 0), 0);
        const totalExpenses = expensesAmount + costsAmount;

        const paidExpenses = expenses
            .filter(e => e.payment_status === 'Paid')
            .reduce((sum, e) => sum + (e.total_amount || 0), 0);
        const payables = totalExpenses - paidExpenses;

        // Profit calculation
        const netProfit = collectedRevenue - paidExpenses;
        const profitMargin = collectedRevenue > 0 ? (netProfit / collectedRevenue) * 100 : 0;

        return {
            totalRevenue,
            collectedRevenue,
            receivables,
            totalExpenses,
            paidExpenses,
            payables,
            netProfit,
            profitMargin
        };
    },

    // Get monthly financial data
    getMonthlyFinancials: async (year: number): Promise<MonthlyFinancial[]> => {
        const monthlyData: Record<number, MonthlyFinancial> = {};

        // Initialize months
        for (let month = 1; month <= 12; month++) {
            monthlyData[month] = {
                month,
                year,
                revenue: 0,
                expenses: 0,
                profit: 0
            };
        }

        // Revenue from contracts (by signed date)
        const contracts = await ContractService.getContracts();
        contracts.forEach(contract => {
            if (contract.signedDate) {
                const date = new Date(contract.signedDate);
                if (date.getFullYear() === year) {
                    const month = date.getMonth() + 1;
                    monthlyData[month].revenue += contract.totalValue || 0;
                }
            }
        });

        // Expenses (by expense date)
        const expenses = await ExpenseService.getExpenses();
        expenses.forEach(expense => {
            const date = new Date(expense.expense_date);
            if (date.getFullYear() === year) {
                const month = date.getMonth() + 1;
                monthlyData[month].expenses += expense.total_amount || 0;
            }
        });

        // Calculate profit
        Object.values(monthlyData).forEach(data => {
            data.profit = data.revenue - data.expenses;
        });

        return Object.values(monthlyData).sort((a, b) => a.month - b.month);
    },

    // Get expense breakdown by category
    getExpensesByCategory: async (): Promise<CategoryExpenseSummary[]> => {
        const expenses = await ExpenseService.getExpenses();
        const categoryTotals: Record<string, number> = {};

        expenses.forEach(expense => {
            const category = expense.category;
            categoryTotals[category] = (categoryTotals[category] || 0) + (expense.total_amount || 0);
        });

        const totalExpenses = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

        return Object.entries(categoryTotals).map(([category, amount]) => ({
            category,
            amount,
            percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
        })).sort((a, b) => b.amount - a.amount);
    },

    // Get cash flow data (thu - chi thực tế theo tháng)
    getCashFlow: async (year: number): Promise<Array<{
        month: number;
        inflow: number;
        outflow: number;
        netCashFlow: number;
    }>> => {
        const monthlyData: Record<number, { inflow: number; outflow: number }> = {};

        // Initialize
        for (let month = 1; month <= 12; month++) {
            monthlyData[month] = { inflow: 0, outflow: 0 };
        }

        // Inflow from payments (collected revenue)
        const payments = await PaymentService.getPayments();
        payments.forEach(payment => {
            if (payment.payment_date && payment.status === 'Đã thanh toán') {
                const date = new Date(payment.payment_date);
                if (date.getFullYear() === year) {
                    const month = date.getMonth() + 1;
                    monthlyData[month].inflow += payment.amount || 0;
                }
            }
        });

        // Outflow from expenses (paid expenses)
        const expenses = await ExpenseService.getExpenses();
        expenses.forEach(expense => {
            if (expense.payment_date && expense.payment_status === 'Paid') {
                const date = new Date(expense.payment_date);
                if (date.getFullYear() === year) {
                    const month = date.getMonth() + 1;
                    monthlyData[month].outflow += expense.total_amount || 0;
                }
            }
        });

        return Object.entries(monthlyData).map(([month, data]) => ({
            month: parseInt(month),
            inflow: data.inflow,
            outflow: data.outflow,
            netCashFlow: data.inflow - data.outflow
        })).sort((a, b) => a.month - b.month);
    },

    // Get revenue by source (project/contract)
    getRevenueByProject: async (): Promise<Array<{
        projectId: string;
        projectName: string;
        revenue: number;
        collected: number;
        percentage: number;
    }>> => {
        const contracts = await ContractService.getContracts();
        const projectRevenue: Record<string, {
            projectName: string;
            revenue: number;
            collected: number;
        }> = {};

        contracts.forEach(contract => {
            const projectId = contract.projectId || 'unknown';
            const projectName = contract.projectName || 'Unknown Project';

            if (!projectRevenue[projectId]) {
                projectRevenue[projectId] = {
                    projectName,
                    revenue: 0,
                    collected: 0
                };
            }

            projectRevenue[projectId].revenue += contract.totalValue || 0;
            projectRevenue[projectId].collected += contract.paidValue || 0;
        });

        const totalRevenue = Object.values(projectRevenue).reduce((sum, p) => sum + p.revenue, 0);

        return Object.entries(projectRevenue).map(([projectId, data]) => ({
            projectId,
            projectName: data.projectName,
            revenue: data.revenue,
            collected: data.collected,
            percentage: totalRevenue > 0 ? (data.revenue / totalRevenue) * 100 : 0
        })).sort((a, b) => b.revenue - a.revenue);
    },

    // Get top expenses
    getTopExpenses: async (limit: number = 10): Promise<Array<{
        expense_code: string;
        description: string;
        amount: number;
        category: string;
        expense_date: string;
    }>> => {
        const expenses = await ExpenseService.getExpenses();

        return expenses
            .sort((a, b) => (b.total_amount || 0) - (a.total_amount || 0))
            .slice(0, limit)
            .map(e => ({
                expense_code: e.expense_code || '',
                description: e.description,
                amount: e.total_amount || 0,
                category: e.category,
                expense_date: e.expense_date
            }));
    }
};
