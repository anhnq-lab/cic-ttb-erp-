import { Project, Task, Employee, ProjectStatus } from '../types';

export interface RiskAssessment {
    score: number; // 0-100
    level: 'Low' | 'Medium' | 'High' | 'Critical';
    factors: string[];
}

export interface ResourceRecommendation {
    employeeId: string;
    matchScore: number; // 0-100
    reason: string[];
}

export interface ExecutiveReport {
    totalBudget: number;
    totalSpent: number;
    avgProgress: number;
    projectCount: number;
    delayedProjects: { name: string; days: number }[];
    topRisks: string[];
    cashFlowForecast: { month: string; value: number }[];
}

export const AIService = {
    /**
     * Tính toán rủi ro dự án dựa trên tiến độ và ngân sách
     * @param project Dữ liệu dự án
     * @param tasks Danh sách công việc của dự án
     */
    calculateProjectRisk: (project: Project, tasks: Task[]): RiskAssessment => {
        let score = 0;
        const factors: string[] = [];

        // 1. Phân tích tiến độ (Schedule Risk)
        const today = new Date();
        const deadline = new Date(project.deadline);
        const totalDays = (deadline.getTime() - new Date(project.deadline).getTime()) / (1000 * 3600 * 24); // Đơn giản hóa

        // Nếu đã quá hạn mà chưa hoàn thành
        if (today > deadline && project.status !== ProjectStatus.COMPLETED) {
            score += 50;
            factors.push('Dự án đã quá hạn thời gian hoàn thành (Overdue).');
        }

        // Nếu tiến độ < 50% mà thời gian còn lại < 20%
        // Giả sử project.startDate logic cần lấy thêm, tạm tính theo task
        // Logic đơn giản: Check task overdue
        const overdueTasks = tasks.filter(t => new Date(t.dueDate) < today && t.progress < 100);
        if (overdueTasks.length > 0) {
            const taskRisk = Math.min(overdueTasks.length * 5, 30); // Max 30 điểm
            score += taskRisk;
            factors.push(`Có ${overdueTasks.length} công việc quá hạn.`);
        }

        // 2. Phân tích ngân sách (Budget Risk)
        if (project.budget > 0) {
            const spendingRatio = project.spent / project.budget;
            if (spendingRatio > 1) {
                score += 40;
                factors.push('Chi phí dự án đã vượt quá ngân sách (Over Budget).');
            } else if (spendingRatio > 0.8 && project.progress < 50) {
                score += 20;
                factors.push('Tốc độ chi tiêu nhanh hơn tiến độ thực hiện (High Burn Rate).');
            }
        }

        // Chuẩn hóa điểm số
        score = Math.min(score, 100);

        let level: RiskAssessment['level'] = 'Low';
        if (score >= 80) level = 'Critical';
        else if (score >= 50) level = 'High';
        else if (score >= 20) level = 'Medium';

        if (factors.length === 0) {
            factors.push('Dự án đang diễn ra tốt đẹp, chưa phát hiện rủi ro đáng kể.');
        }

        return { score, level, factors };
    },

    /**
     * Gợi ý nhân sự phù hợp cho công việc
     * @param task Công việc cần phân bổ
     * @param employees Danh sách nhân viên
     */
    recommendResources: (task: Task, employees: Employee[]): ResourceRecommendation[] => {
        // Phân tích keywords trong tên task để đoán kỹ năng cần thiết (Logic Heuristic đơn giản)
        const requiredSkills: string[] = [];
        const lowerName = task.name.toLowerCase();

        if (lowerName.includes('bim') || lowerName.includes('revit') || lowerName.includes('mô hình')) requiredSkills.push('BIM', 'Revit');
        if (lowerName.includes('kết cấu') || lowerName.includes('structure')) requiredSkills.push('Structural Analysis');
        if (lowerName.includes('mep') || lowerName.includes('điện') || lowerName.includes('nước')) requiredSkills.push('MEP');
        if (lowerName.includes('quản lý') || lowerName.includes('manager')) requiredSkills.push('Project Management');

        return employees.map(emp => {
            let matchScore = 0;
            const reason: string[] = [];

            // Check skills
            const matchingSkills = emp.skills.filter(skill =>
                requiredSkills.some(req => skill.toLowerCase().includes(req.toLowerCase()))
            );

            if (requiredSkills.length > 0) {
                if (matchingSkills.length > 0) {
                    matchScore += 60 + (matchingSkills.length / requiredSkills.length) * 20;
                    reason.push(`Có kỹ năng phù hợp: ${matchingSkills.join(', ')}`);
                }
            } else {
                // Nếu không xác định được skill, ưu tiên đúng Role
                if (emp.role === task.assignee.role) { // Lưu ý: task.assignee ở đây có thể là dummy data ban đầu
                    matchScore += 50;
                    reason.push('Vai trò phù hợp');
                }
                matchScore += 30; // Điểm cơ bản
            }

            // Check availability (Giả định: check trạng thái)
            if (emp.status === 'Chính thức') {
                matchScore += 10;
            } else {
                matchScore -= 20;
                reason.push('Nhân sự không ở trạng thái sẵn sàng (Nghỉ phép/Thử việc)');
            }

            return {
                employeeId: emp.id,
                matchScore: Math.min(matchScore, 100),
                reason
            };
        }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 5); // Lấy top 5
    },

    /**
     * Tạo báo cáo tổng hợp dành cho Ban lãnh đạo
     * @param projects Danh sách dự án
     * @param contracts Danh sách hợp đồng (optional)
     */
    generateExecutiveReport: (projects: Project[], contracts?: any[]): ExecutiveReport => {
        const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
        const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
        const avgProgress = projects.reduce((sum, p) => sum + p.progress, 0) / (projects.length || 1);

        const delayedProjects = projects
            .filter(p => new Date(p.deadline) < new Date() && p.progress < 100)
            .map(p => ({
                name: p.name,
                days: Math.floor((new Date().getTime() - new Date(p.deadline).getTime()) / (1000 * 3600 * 24))
            }));

        const topRisks: string[] = [];
        if (delayedProjects.length > 0) {
            const names = delayedProjects.slice(0, 2).map(d => d.name).join(', ');
            topRisks.push(`${delayedProjects.length} dự án đang chậm tiến độ (${names}${delayedProjects.length > 2 ? '...' : ''}).`);
        }
        if (totalBudget > 0 && totalSpent / totalBudget > 0.8) {
            topRisks.push('Tỷ lệ giải ngân toàn bộ portfolio đạt mức cao (>80%), cần chuẩn bị dòng tiền.');
        }

        // Calculate Cashflow Forecast based on contracts if available
        let cashFlowForecast: { month: string; value: number }[];

        if (contracts && contracts.length > 0) {
            // Use actual contract receivables
            const totalReceivables = contracts.reduce((sum, c) => sum + (c.remainingValue || 0), 0);
            const today = new Date();

            cashFlowForecast = [];
            for (let i = 0; i < 6; i++) {
                const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
                const monthStr = `T${month.getMonth() + 1}`;
                // Distribute receivables with decreasing weight over 6 months
                const weight = (6 - i) / 21; // Sum of 1+2+3+4+5+6 = 21
                cashFlowForecast.push({
                    month: monthStr,
                    value: Math.round(totalReceivables * weight)
                });
            }

            // Add receivables-based risk
            const totalContractValue = contracts.reduce((sum, c) => sum + (c.totalValue || 0), 0);
            if (totalContractValue > 0 && totalReceivables / totalContractValue > 0.5) {
                topRisks.push(`Công nợ phải thu cao (${((totalReceivables / totalContractValue) * 100).toFixed(0)}% giá trị HĐ).`);
            }
        } else {
            // Fallback to budget-based estimate
            cashFlowForecast = [
                { month: 'T1', value: totalBudget * 0.1 },
                { month: 'T2', value: totalBudget * 0.15 },
                { month: 'T3', value: totalBudget * 0.2 },
                { month: 'T4', value: totalBudget * 0.1 },
                { month: 'T5', value: totalBudget * 0.15 },
                { month: 'T6', value: totalBudget * 0.1 }
            ];
        }

        return {
            totalBudget,
            totalSpent,
            avgProgress,
            projectCount: projects.length,
            delayedProjects,
            topRisks,
            cashFlowForecast
        };
    },

    /**
     * Generate quick insights for dashboard
     */
    generateQuickInsights: (projects: Project[], contracts?: any[]): string[] => {
        const insights: string[] = [];
        const today = new Date();

        // Project insights
        const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED);
        const inProgressProjects = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS);

        if (completedProjects.length > 0) {
            insights.push(`✅ ${completedProjects.length} dự án đã hoàn thành trong portfolio.`);
        }

        if (inProgressProjects.length > 0) {
            const avgProgress = inProgressProjects.reduce((sum, p) => sum + p.progress, 0) / inProgressProjects.length;
            insights.push(`📊 Tiến độ trung bình các dự án đang thực hiện: ${avgProgress.toFixed(0)}%.`);
        }

        // Contract insights
        if (contracts && contracts.length > 0) {
            const activeContracts = contracts.filter((c: any) => c.status === 'Hiệu lực');
            const totalValue = contracts.reduce((sum, c) => sum + (c.totalValue || 0), 0);
            const totalPaid = contracts.reduce((sum, c) => sum + (c.paidValue || 0), 0);

            insights.push(`💰 Tổng giá trị hợp đồng: ${(totalValue / 1000000000).toFixed(1)} tỷ VNĐ.`);
            insights.push(`📈 Tiến độ thu tiền: ${((totalPaid / totalValue) * 100).toFixed(0)}%.`);

            if (activeContracts.length > 0) {
                insights.push(`📝 ${activeContracts.length} hợp đồng đang hiệu lực.`);
            }
        }

        // Deadline warnings
        const upcomingDeadlines = projects.filter(p => {
            const deadline = new Date(p.deadline);
            const daysLeft = (deadline.getTime() - today.getTime()) / (1000 * 3600 * 24);
            return daysLeft > 0 && daysLeft <= 30 && p.progress < 100;
        });

        if (upcomingDeadlines.length > 0) {
            insights.push(`⚠️ ${upcomingDeadlines.length} dự án có deadline trong 30 ngày tới.`);
        }

        return insights;
    }
};
