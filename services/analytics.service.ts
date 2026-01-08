
import { Project, Contract, Employee, Customer, ProjectStatus, ContractStatus } from '../types';
import { PROJECTS, CONTRACTS, EMPLOYEES, CUSTOMERS, MOCK_CRM_OPPORTUNITIES, TASKS } from '../constants';
import { AIService } from './AIService';
import { EmployeeService } from './employee.service';

// ============================================
// ANALYTICS TYPES
// ============================================

export interface FinancialMetrics {
    totalContractValue: number;
    totalPaidValue: number;
    totalReceivables: number;
    totalWipValue: number;
    revenueByQuarter: { quarter: string; value: number }[];
    revenueByClient: { client: string; value: number; contractCount: number }[];
    receivablesByClient: { client: string; value: number }[];
    paymentProgress: number;
}

export interface ProjectMetrics {
    totalProjects: number;
    byStatus: Record<string, number>;
    byCapitalSource: { stateBudget: number; nonStateBudget: number };
    avgProgress: number;
    delayedCount: number;
    delayedProjects: { name: string; code: string; daysOverdue: number }[];
    projectsByManager: { manager: string; count: number }[];
}

export interface ContractMetrics {
    totalContracts: number;
    byStatus: Record<string, number>;
    avgContractValue: number;
    totalValueByYear: { year: number; value: number }[];
    topContractsByValue: { code: string; projectName: string; value: number }[];
}

export interface HRMetrics {
    totalEmployees: number;
    byDepartment: { department: string; count: number }[];
    byStatus: Record<string, number>;
    averageTenureYears: number;
}

export interface CRMMetrics {
    totalCustomers: number;
    byTier: Record<string, number>;
    totalPipelineValue: number;
    opportunitiesByStage: { stage: string; count: number; value: number }[];
    topCustomersByValue: { name: string; value: number }[];
}

export interface DashboardSummary {
    financial: FinancialMetrics;
    projects: ProjectMetrics;
    contracts: ContractMetrics;
    hr: HRMetrics;
    crm: CRMMetrics;
    topRisks: string[];
    cashFlowForecast: { month: string; expected: number; actual: number }[];
    quality: {
        onTimeDeliveryRate: number;
        reworkRate: number;
        avgCompletionTime: number;
    };
    performance: {
        topPerformers: { id: string; name: string; tasksCompleted: number; onTimeRate: number }[];
    };
}

// ============================================
// ANALYTICS SERVICE
// ============================================

export const AnalyticsService = {
    isMock: true,

    /**
     * Get Dashboard Summary - Mock Implementation
     */
    getDashboardSummary: async (): Promise<DashboardSummary> => {
        return {
            financial: AnalyticsService.calculateFinancialMetrics(CONTRACTS),
            projects: AnalyticsService.calculateProjectMetrics(PROJECTS),
            contracts: AnalyticsService.calculateContractMetrics(CONTRACTS),
            hr: AnalyticsService.calculateHRMetrics(EMPLOYEES),
            crm: AnalyticsService.calculateCRMMetrics(CUSTOMERS),
            topRisks: AnalyticsService.analyzeRisks(PROJECTS, CONTRACTS),
            cashFlowForecast: AnalyticsService.calculateCashFlowForecast(CONTRACTS),
            quality: AnalyticsService.calculateQualityMetrics(TASKS),
            performance: AnalyticsService.calculatePerformanceMetrics(TASKS, EMPLOYEES),
        };
    },


    // =========================================================================
    // CALCULATION HELPERS (Logic remains mostly same, but operates on passed data)
    // =========================================================================

    calculateFinancialMetrics: (contracts: Contract[]): FinancialMetrics => {
        const totalContractValue = contracts.reduce((sum, c) => sum + (Number(c.totalValue) || 0), 0);
        const totalPaidValue = contracts.reduce((sum, c) => sum + (Number(c.paidValue) || 0), 0);
        const totalReceivables = contracts.reduce((sum, c) => sum + (Number(c.remainingValue) || 0), 0);
        const totalWipValue = contracts.reduce((sum, c) => sum + (Number(c.wipValue) || 0), 0);

        const revenueByQuarter: Record<string, number> = {};
        contracts.forEach(c => {
            if (!c.signedDate) return;
            const date = new Date(c.signedDate);
            const quarter = `Q${Math.ceil((date.getMonth() + 1) / 3)}/${date.getFullYear()}`;
            revenueByQuarter[quarter] = (revenueByQuarter[quarter] || 0) + (Number(c.paidValue) || 0);
        });

        const revenueByClientMap: Record<string, { value: number; count: number }> = {};
        contracts.forEach(c => {
            const client = c.sideAName || 'Không xác định';
            if (!revenueByClientMap[client]) {
                revenueByClientMap[client] = { value: 0, count: 0 };
            }
            revenueByClientMap[client].value += (Number(c.paidValue) || 0);
            revenueByClientMap[client].count += 1;
        });

        const receivablesByClientMap: Record<string, number> = {};
        contracts.filter(c => (Number(c.remainingValue) || 0) > 0).forEach(c => {
            const client = c.sideAName || 'Không xác định';
            receivablesByClientMap[client] = (receivablesByClientMap[client] || 0) + Number(c.remainingValue);
        });

        return {
            totalContractValue,
            totalPaidValue,
            totalReceivables,
            totalWipValue,
            paymentProgress: totalContractValue > 0 ? (totalPaidValue / totalContractValue) * 100 : 0,
            revenueByQuarter: Object.entries(revenueByQuarter)
                .map(([quarter, value]) => ({ quarter, value }))
                .sort((a, b) => a.quarter.localeCompare(b.quarter)),
            revenueByClient: Object.entries(revenueByClientMap)
                .map(([client, { value, count }]) => ({ client, value, contractCount: count }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 10),
            receivablesByClient: Object.entries(receivablesByClientMap)
                .map(([client, value]) => ({ client, value }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 10),
        };
    },

    calculateProjectMetrics: (projects: Project[]): ProjectMetrics => {
        const today = new Date();
        const byStatus: Record<string, number> = {};
        projects.forEach(p => {
            const status = p.status || 'Khác';
            byStatus[status] = (byStatus[status] || 0) + 1;
        });

        const stateBudget = projects.filter(p => p.capitalSource === 'StateBudget').length;
        const nonStateBudget = projects.filter(p => p.capitalSource === 'NonStateBudget').length;

        const delayedProjects = projects
            .filter(p => {
                if (!p.deadline) return false;
                const deadline = new Date(p.deadline);
                return deadline < today && (p.progress || 0) < 100;
            })
            .map(p => ({
                name: p.name,
                code: p.code,
                daysOverdue: Math.floor((today.getTime() - new Date(p.deadline).getTime()) / (1000 * 3600 * 24))
            }))
            .sort((a, b) => b.daysOverdue - a.daysOverdue);

        const projectsByManagerMap: Record<string, number> = {};
        projects.forEach(p => {
            const manager = p.manager || 'Unassigned';
            projectsByManagerMap[manager] = (projectsByManagerMap[manager] || 0) + 1;
        });

        return {
            totalProjects: projects.length,
            byStatus,
            byCapitalSource: { stateBudget, nonStateBudget },
            avgProgress: projects.length > 0
                ? projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length
                : 0,
            delayedCount: delayedProjects.length,
            delayedProjects,
            projectsByManager: Object.entries(projectsByManagerMap)
                .map(([manager, count]) => ({ manager, count }))
                .sort((a, b) => b.count - a.count),
        };
    },

    calculateContractMetrics: (contracts: Contract[]): ContractMetrics => {
        const byStatus: Record<string, number> = {};
        contracts.forEach(c => {
            const status = c.status || 'Khác';
            byStatus[status] = (byStatus[status] || 0) + 1;
        });

        const valueByYear: Record<number, number> = {};
        contracts.forEach(c => {
            if (!c.signedDate) return;
            const year = new Date(c.signedDate).getFullYear();
            valueByYear[year] = (valueByYear[year] || 0) + (Number(c.totalValue) || 0);
        });

        return {
            totalContracts: contracts.length,
            byStatus,
            avgContractValue: contracts.length > 0
                ? contracts.reduce((sum, c) => sum + (Number(c.totalValue) || 0), 0) / contracts.length
                : 0,
            totalValueByYear: Object.entries(valueByYear)
                .map(([year, value]) => ({ year: parseInt(year), value }))
                .sort((a, b) => b.year - a.year),
            topContractsByValue: [...contracts]
                .sort((a, b) => (Number(b.totalValue) || 0) - (Number(a.totalValue) || 0))
                .slice(0, 5)
                .map(c => ({ code: c.code, projectName: c.projectName, value: Number(c.totalValue) || 0 })),
        };
    },

    calculateHRMetrics: (employees: Employee[]): HRMetrics => {
        const byDepartmentMap: Record<string, number> = {};
        employees.forEach(e => {
            const dept = e.department || 'Khác';
            byDepartmentMap[dept] = (byDepartmentMap[dept] || 0) + 1;
        });

        const byStatus: Record<string, number> = {};
        employees.forEach(e => {
            const status = e.status || 'Khác';
            byStatus[status] = (byStatus[status] || 0) + 1;
        });

        const today = new Date();
        const tenures = employees
            .filter(e => e.joinDate)
            .map(e => (today.getTime() - new Date(e.joinDate).getTime()) / (1000 * 3600 * 24 * 365));
        const avgTenure = tenures.length > 0
            ? tenures.reduce((sum, t) => sum + t, 0) / tenures.length
            : 0;

        return {
            totalEmployees: employees.length,
            byDepartment: Object.entries(byDepartmentMap)
                .map(([department, count]) => ({ department, count }))
                .sort((a, b) => b.count - a.count),
            byStatus,
            averageTenureYears: Math.round(avgTenure * 10) / 10,
        };
    },

    calculateCRMMetrics: (
        customers: Customer[],
        opportunities: any[] = [] // Typings for opportunities can be added later
    ): CRMMetrics => {
        const byTier: Record<string, number> = {};
        customers.forEach(c => {
            const tier = c.tier || 'Standard';
            byTier[tier] = (byTier[tier] || 0) + 1;
        });

        const totalPipelineValue = opportunities.reduce((sum, o) => sum + (Number(o.value) || 0), 0);

        const byStage: Record<string, { count: number; value: number }> = {};
        opportunities.forEach(o => {
            const stage = o.stage || 'New';
            if (!byStage[stage]) byStage[stage] = { count: 0, value: 0 };
            byStage[stage].count += 1;
            byStage[stage].value += (Number(o.value) || 0);
        });

        return {
            totalCustomers: customers.length,
            byTier,
            totalPipelineValue,
            opportunitiesByStage: Object.entries(byStage)
                .map(([stage, { count, value }]) => ({ stage, count, value })),
            topCustomersByValue: [...customers]
                .sort((a, b) => (Number(b.totalProjectValue) || 0) - (Number(a.totalProjectValue) || 0))
                .slice(0, 5)
                .map(c => ({ name: c.shortName || c.name, value: Number(c.totalProjectValue) || 0 })),
        };
    },

    calculateCashFlowForecast: (contracts: Contract[]): { month: string; expected: number; actual: number }[] => {
        const today = new Date();
        const forecast: { month: string; expected: number; actual: number }[] = [];

        for (let i = 0; i < 6; i++) {
            const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
            const monthStr = `T${month.getMonth() + 1}/${month.getFullYear()}`;

            const activeContracts = contracts.filter(c =>
                c.status === ContractStatus.ACTIVE && (Number(c.remainingValue) || 0) > 0
            );
            const expectedValue = activeContracts.reduce((sum, c) => sum + (Number(c.remainingValue) || 0), 0) / 6;

            forecast.push({
                month: monthStr,
                expected: Math.round(expectedValue),
                actual: i === 0 ? Math.round(expectedValue * 0.8) : 0,
            });
        }
        return forecast;
    },

    analyzeRisks: (projects: Project[], contracts: Contract[]): string[] => {
        // Delegate to AIService for richer, AI-generated insights (with emojis!)
        return AIService.generateQuickInsights(projects, contracts);
    },

    calculateQualityMetrics: (tasks: any[]): { onTimeDeliveryRate: number; reworkRate: number; avgCompletionTime: number } => {
        const completedTasks = tasks.filter(t => t.status === 'Completed');
        if (completedTasks.length === 0) return { onTimeDeliveryRate: 100, reworkRate: 0, avgCompletionTime: 0 };

        const onTimeCount = completedTasks.filter(t => {
            if (!t.dueDate) return true;
            // Assuming we don't have actual completion date in mock, so we random logic or use status
            // For mock demo, let's assume 85% are on time
            return Math.random() > 0.15;
        }).length;

        // Simulate rework rate based on some property or random for now
        // In real app, check checklist logs for 'Failed'
        const reworkRate = 12.5;

        return {
            onTimeDeliveryRate: (onTimeCount / completedTasks.length) * 100,
            reworkRate,
            avgCompletionTime: 4.5
        };
    },

    calculatePerformanceMetrics: (tasks: any[], employees: Employee[]): { topPerformers: any[] } => {
        const taskCounts: Record<string, number> = {};
        tasks.filter(t => t.status === 'Completed').forEach(t => {
            if (t.assignee?.id) {
                taskCounts[t.assignee.id] = (taskCounts[t.assignee.id] || 0) + 1;
            }
        });

        const topPerformers = Object.entries(taskCounts)
            .map(([id, count]) => {
                const emp = employees.find(e => e.id === id);
                return {
                    id,
                    name: emp?.name || 'Unknown',
                    tasksCompleted: count,
                    onTimeRate: 90 + Math.random() * 10 // Mock high performance
                };
            })
            .sort((a, b) => b.tasksCompleted - a.tasksCompleted)
            .slice(0, 5);

        return { topPerformers };
    },

    // Format helpers
    formatCurrency: (value: number): string => {
        if (!value) return '0 ₫';
        if (value >= 1000000000) {
            return `${(value / 1000000000).toFixed(2)} tỷ ₫`;
        } else if (value >= 1000000) {
            return `${(value / 1000000).toFixed(0)} tr ₫`;
        }
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    },
};

// Data mappers (similar to ProjectService)
const mapToProject = (data: any): Project => ({
    ...data,
    projectGroup: data.project_group || data.projectGroup,
    constructionType: data.construction_type || data.constructionType,
    constructionLevel: data.construction_level || data.constructionLevel,
    capitalSource: data.capital_source || data.capitalSource,
    members: data.members_count || data.members,
    serviceType: data.service_type || data.serviceType,
    folderUrl: data.folder_url || data.folderUrl,
    progress: Number(data.progress || 0),
    budget: Number(data.budget || 0),
    spent: Number(data.spent || 0),
});

const mapToContract = (data: any): Contract => ({
    ...data,
    projectId: data.project_id || data.projectId,
    signedDate: data.signed_date || data.signedDate,
    packageName: data.package_name || data.packageName,
    projectName: data.project_name || data.projectName,
    contractType: data.contract_type || data.contractType,
    lawApplied: data.law_applied || data.lawApplied,

    // Side A
    sideAName: data.side_a_name || data.sideAName,
    sideARep: data.side_a_rep || data.sideARep,
    sideAPosition: data.side_a_position || data.sideAPosition,
    sideAMst: data.side_a_mst || data.sideAMst,
    sideAStaff: data.side_a_staff || data.sideAStaff,

    // Side B
    sideBName: data.side_b_name || data.sideBName,
    sideBRep: data.side_b_rep || data.sideBRep,
    sideBPosition: data.side_b_position || data.sideBPosition,
    sideBMst: data.side_b_mst || data.sideBMst,
    sideBBank: data.side_b_bank || data.sideBBank,

    // Finance
    totalValue: Number(data.total_value || data.totalValue || 0),
    vatIncluded: data.vat_included !== undefined ? data.vat_included : data.vatIncluded,
    advancePayment: Number(data.advance_payment || data.advancePayment || 0),
    paidValue: Number(data.paid_value || data.paidValue || 0),
    remainingValue: Number(data.remaining_value || data.remainingValue || 0),
    wipValue: Number(data.wip_value || data.wipValue || 0),

    // Dates
    startDate: data.start_date || data.startDate,
    endDate: data.end_date || data.endDate,

    status: data.status,
    // Add default empty arrays if missing
    paymentMilestones: data.paymentMilestones || [],
    personnel: data.personnel || [],
});
