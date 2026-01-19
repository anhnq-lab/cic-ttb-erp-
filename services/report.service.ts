import { supabase } from '../utils/supabaseClient';
import { ConstructionService } from './construction.service';
import { CostService } from './cost.service';
import { LegalService } from './legal.service';

export class ReportService {

    // 1. PROJECT OVERVIEW REPORT
    static async getProjectOverview(projectId: string) {
        try {
            const { data: project } = await supabase.from('projects').select('*').eq('id', projectId).single();
            const { data: tasks } = await supabase.from('tasks').select('*').eq('project_id', projectId);

            const totalTasks = tasks?.length || 0;
            const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
            const overDueTasks = tasks?.filter(t => {
                if (!t.end_date) return false;
                return new Date(t.end_date) < new Date() && t.status !== 'completed';
            }).length || 0;

            return {
                projectCode: project?.code,
                projectName: project?.name,
                progress: project?.progress || 0,
                status: project?.status,
                taskStats: {
                    total: totalTasks,
                    completed: completedTasks,
                    pending: totalTasks - completedTasks,
                    overdue: overDueTasks,
                    completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
                }
            };
        } catch (error) {
            console.error('Error fetching project overview:', error);
            return null;
        }
    }

    // 2. FINANCIAL REPORT (Budget vs Actual)
    static async getFinancialReport(projectId: string) {
        try {
            const costs = await CostService.getCostsByProject(projectId);

            // Group by type (Labor, Material, Machine, Other)
            const budgetByType: Record<string, number> = {};
            const actualByType: Record<string, number> = {};

            costs.forEach(cost => {
                const amount = Number(cost.amount) || 0;
                // Assuming cost table has 'type' field, or we categorize by 'description' or 'cost_code'
                const type = 'General';

                // Check status for Budget vs Actual
                // 'Pending' | 'Approved' | 'Rejected'
                if (cost.status === 'Pending' || cost.status === 'Approved') {
                    budgetByType[type] = (budgetByType[type] || 0) + amount;
                }

                if (cost.status === 'Approved') {
                    actualByType[type] = (actualByType[type] || 0) + amount;
                }
            });

            // Mock Budget Data if not enough data
            const mockBreakdown = {
                'Vật liệu': 5000000000,
                'Nhân công': 3000000000,
                'Máy thi công': 1500000000,
                'Quản lý phí': 500000000
            };

            // Use mock data for breakdown if real data is empty (for demo)
            const breakdown = Object.keys(actualByType).length > 0 ? actualByType : mockBreakdown;

            const totalActual = costs.filter(c => c.status === 'Approved').reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
            const totalBudget = 10000000000; // Mock total budget

            return {
                totalBudget,
                totalActual,
                variance: totalBudget - totalActual,
                breakdown: breakdown
            };
        } catch (error) {
            console.error('Error fetching financial report:', error);
            return null;
        }
    }

    // 3. CONSTRUCTION & QUALITY REPORT
    static async getQualityReport(projectId: string) {
        try {
            const inspections = await ConstructionService.getInspections(projectId);
            const logs = await ConstructionService.getLogs(projectId);

            const passedInspections = inspections.filter(i => i.result === 'passed').length;
            const failedInspections = inspections.filter(i => i.result === 'failed').length;

            const issuesByDate: Record<string, number> = {};
            logs.forEach(log => {
                if (log.issues) {
                    const date = log.log_date.substring(0, 7); // YYYY-MM
                    issuesByDate[date] = (issuesByDate[date] || 0) + 1;
                }
            });

            return {
                totalInspections: inspections.length,
                passRate: inspections.length > 0 ? Math.round((passedInspections / inspections.length) * 100) : 0,
                defectCount: failedInspections,
                safetyIncidents: logs.filter(l => l.issues && l.issues.toLowerCase().includes('an toàn')).length,
                issuesTrend: Object.entries(issuesByDate).map(([date, count]) => ({ date, count }))
            };
        } catch (error) {
            console.error('Error fetching quality report:', error);
            return null;
        }
    }

    // 4. GENERATE COMPLETE REPORT DATA
    static async getFullProjectReport(projectId: string) {
        const [overview, financial, quality, legal] = await Promise.all([
            this.getProjectOverview(projectId),
            this.getFinancialReport(projectId),
            this.getQualityReport(projectId),
            LegalService.getLegalSummary(projectId)
        ]);

        return {
            overview,
            financial,
            quality,
            legal,
            generatedAt: new Date().toISOString()
        };
    }
}
