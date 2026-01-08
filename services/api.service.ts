/**
 * API Service - Centralized data layer for CIC.TTB.ERP
 * 
 * This service provides a unified interface for all data operations,
 * abstracting the complexity of Supabase vs Mock data switching.
 */

import { ProjectService } from './project.service';
import { ContractService } from './contract.service';
import { EmployeeService } from './employee.service';
import { CRMService } from './crm.service';
import { AnalyticsService, DashboardSummary } from './analytics.service';
import { AIService } from './AIService';
import { realtimeStore } from '../utils/realtimeStore';
import { Project, Contract, Employee, Task, Customer } from '../types';

// ============================================
// UNIFIED API SERVICE
// ============================================

export const API = {
    // ==========================================
    // PROJECTS
    // ==========================================
    projects: {
        getAll: () => ProjectService.getProjects(),
        getById: (id: string) => ProjectService.getProjectById(id),
        create: (project: Project) => ProjectService.createProject(project),
        update: (project: Project) => ProjectService.updateProject(project.id, project),
        delete: (id: string) => ProjectService.deleteProject(id),

        // Analytics
        getStats: () => ProjectService.getProjectStats(),
        getWithFinancials: () => ProjectService.getProjectsWithFinancials(),
        getDelayed: () => ProjectService.getDelayedProjects(),

        // RACI & Workflows
        getRaci: (projectId: string) => ProjectService.getProjectRaci(projectId),
        getWorkflows: (projectId: string) => ProjectService.getProjectWorkflows(projectId),
    },

    // ==========================================
    // CONTRACTS
    // ==========================================
    contracts: {
        getAll: () => ContractService.getContracts(),
        getByProject: (projectId: string) => ContractService.getContractsByProject(projectId),
        create: (contract: Contract) => ContractService.createContract(contract),
        update: (id: string, updates: Partial<Contract>) => ContractService.updateContract(id, updates),
        delete: (id: string) => ContractService.deleteContract(id),

        // Transactions
        addTransaction: (contractId: string, transaction: any) =>
            ContractService.addTransaction(contractId, transaction),

        // Analytics
        getStats: () => ContractService.getContractStats(),
        getReceivables: () => ContractService.getReceivablesByClient(),
        getRevenue: (period: 'monthly' | 'quarterly' = 'quarterly') =>
            ContractService.getRevenueByPeriod(period),
        getTop: (limit?: number) => ContractService.getTopContracts(limit),
    },

    // ==========================================
    // EMPLOYEES
    // ==========================================
    employees: {
        getAll: () => EmployeeService.getEmployees(),
        getById: (id: string) => EmployeeService.getEmployeeById(id),
        create: (employee: Omit<Employee, 'id'>) => EmployeeService.createEmployee(employee),
        update: (id: string, updates: Partial<Employee>) => EmployeeService.updateEmployee(id, updates),
        delete: (id: string) => EmployeeService.deleteEmployee(id),

        // Filters
        getByDepartment: (department: string) => EmployeeService.getEmployeesByDepartment(department),
        getByStatus: (status: 'Chính thức' | 'Nghỉ phép' | 'Thử việc') => EmployeeService.getEmployeesByStatus(status),

        // Subscriptions
        subscribe: (callback: () => void) => EmployeeService.subscribeToEmployees(callback),
    },

    // ==========================================
    // CRM
    // ==========================================
    crm: {
        // Customers
        customers: {
            getAll: () => CRMService.getCustomers(),
            getById: (id: string) => CRMService.getCustomerById(id),
            getWithDetails: (id: string) => CRMService.getCustomerWithDetails(id),
            create: (customer: Omit<Customer, 'id'>) => CRMService.createCustomer(customer),
            update: (id: string, updates: Partial<Customer>) => CRMService.updateCustomer(id, updates),
            delete: (id: string) => CRMService.deleteCustomer(id),
            getStats: () => CRMService.getCustomerStats(),
        },

        // Contacts
        contacts: {
            get: (customerId: string) => CRMService.getContacts(customerId),
            create: (contact: any) => CRMService.createContact(contact),
            delete: (id: string) => CRMService.deleteContact(id),
        },

        // Activities
        activities: {
            get: (customerId: string) => CRMService.getActivities(customerId),
            getRecent: (limit?: number) => CRMService.getRecentActivities(limit),
            create: (activity: any) => CRMService.createActivity(activity),
            delete: (id: string) => CRMService.deleteActivity(id),
        },

        // Opportunities
        opportunities: {
            get: (customerId: string) => CRMService.getOpportunities(customerId),
            getAll: () => CRMService.getAllOpportunities(),
            create: (opp: any) => CRMService.createOpportunity(opp),
            update: (id: string, updates: any) => CRMService.updateOpportunity(id, updates),
            delete: (id: string) => CRMService.deleteOpportunity(id),
            getStats: () => CRMService.getPipelineStats(),
        },

        // Subscriptions
        subscribe: (callback: () => void) => CRMService.subscribeToCustomers(callback),
    },

    // ==========================================
    // TASKS
    // ==========================================
    tasks: {
        getByProject: (projectId: string) => realtimeStore.getTasks(projectId),
        create: (task: Task) => realtimeStore.createTask(task),
        update: (task: Task) => realtimeStore.updateTask(task),
        updateStatus: (taskId: string, status: any) => realtimeStore.updateTaskStatus(taskId, status),
        delete: (taskId: string) => realtimeStore.deleteTask(taskId),

        // Subscriptions
        subscribe: (projectId: string, callback: () => void) => realtimeStore.subscribe(projectId, callback),
        unsubscribe: (channel: any) => realtimeStore.unsubscribe(channel),
    },

    // ==========================================
    // ANALYTICS (Aggregated)
    // ==========================================
    analytics: {
        // Get complete dashboard summary
        getDashboard: (): Promise<DashboardSummary> => AnalyticsService.getDashboardSummary(),

        // Individual metrics
        financial: async () => {
            const contracts = await ContractService.getContracts();
            return AnalyticsService.calculateFinancialMetrics(contracts);
        },
        projects: async () => {
            const projects = await ProjectService.getProjects();
            return AnalyticsService.calculateProjectMetrics(projects);
        },
        contracts: async () => {
            const contracts = await ContractService.getContracts();
            return AnalyticsService.calculateContractMetrics(contracts);
        },
        hr: async () => {
            const employees = await EmployeeService.getEmployees();
            return AnalyticsService.calculateHRMetrics(employees);
        },
        crm: async () => {
            const customers = await CRMService.getCustomers();
            return AnalyticsService.calculateCRMMetrics(customers);
        },

        // Risk & Forecasting
        risks: async () => {
            const [projects, contracts] = await Promise.all([ProjectService.getProjects(), ContractService.getContracts()]);
            return AnalyticsService.analyzeRisks(projects, contracts);
        },
        cashflow: async () => {
            const contracts = await ContractService.getContracts();
            return AnalyticsService.calculateCashFlowForecast(contracts);
        },

        // Utilities
        formatCurrency: (value: number) => AnalyticsService.formatCurrency(value),
    },

    // ==========================================
    // AI SERVICES
    // ==========================================
    ai: {
        // Risk Assessment
        calculateRisk: (project: Project, tasks: Task[]) => AIService.calculateProjectRisk(project, tasks),

        // Resource Recommendations
        recommendResources: (task: Task, employees: Employee[]) => AIService.recommendResources(task, employees),

        // Reports
        executiveReport: (projects: Project[], contracts?: Contract[]) =>
            AIService.generateExecutiveReport(projects, contracts),
        quickInsights: (projects: Project[], contracts?: Contract[]) =>
            AIService.generateQuickInsights(projects, contracts),
    },
};

// ============================================
// EXPORT TYPES
// ============================================
export type { DashboardSummary } from './analytics.service';

// Default export for convenience
export default API;
