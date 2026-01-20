import * as XLSX from 'xlsx';
import { TaskService } from './task.service';
import { Task } from '../types';

/**
 * Export Service
 * Xuất dữ liệu tasks ra file Excel để báo cáo
 */

interface TaskFilter {
    status?: string[];
    priority?: string[];
    assigneeId?: string;
    dateRange?: {
        from: string;
        to: string;
    };
    phase?: string;
}

interface ExportRow {
    'Mã CV': string;
    'Tên công việc': string;
    'Dự án': string;
    'Giai đoạn': string;
    'Người thực hiện': string;
    'Trạng thái': string;
    'Ưu tiên': string;
    'Ngày bắt đầu': string;
    'Hạn hoàn thành': string;
    'Tiến độ (%)': number;
    'Tags': string;
}

export const ExportService = {
    /**
     * Export danh sách tasks ra file Excel
     */
    async exportTasksToExcel(
        projectId: string,
        filters?: TaskFilter
    ): Promise<Blob> {
        try {
            // Fetch tasks
            let tasks = await TaskService.getProjectTasks(projectId);

            // Apply filters
            if (filters) {
                if (filters.status && filters.status.length > 0) {
                    tasks = tasks.filter(t => filters.status!.includes(t.status));
                }

                if (filters.priority && filters.priority.length > 0) {
                    tasks = tasks.filter(t => filters.priority!.includes(t.priority));
                }

                if (filters.assigneeId) {
                    tasks = tasks.filter(t => t.assignee?.id === filters.assigneeId);
                }

                if (filters.dateRange) {
                    const fromDate = new Date(filters.dateRange.from);
                    const toDate = new Date(filters.dateRange.to);
                    tasks = tasks.filter(t => {
                        if (!t.dueDate) return false;
                        const dueDate = new Date(t.dueDate);
                        return dueDate >= fromDate && dueDate <= toDate;
                    });
                }

                if (filters.phase) {
                    tasks = tasks.filter(t => t.phase === filters.phase);
                }
            }

            // Transform to Excel rows
            const rows: ExportRow[] = tasks.map(t => ({
                'Mã CV': t.code || '',
                'Tên công việc': t.name,
                'Dự án': (t as any).project?.name || '',
                'Giai đoạn': t.phase || '',
                'Người thực hiện': t.assignee?.name || 'Chưa gán',
                'Trạng thái': t.status,
                'Ưu tiên': t.priority,
                'Ngày bắt đầu': t.startDate || '',
                'Hạn hoàn thành': t.dueDate || '',
                'Tiến độ (%)': t.progress || 0,
                'Tags': (t.tags || []).join(', '),
            }));

            // Create workbook
            const ws = XLSX.utils.json_to_sheet(rows);

            // Set column widths
            ws['!cols'] = [
                { wch: 15 }, // Mã CV
                { wch: 40 }, // Tên công việc
                { wch: 30 }, // Dự án
                { wch: 25 }, // Giai đoạn
                { wch: 20 }, // Người thực hiện
                { wch: 20 }, // Trạng thái
                { wch: 12 }, // Ưu tiên
                { wch: 15 }, // Ngày bắt đầu
                { wch: 15 }, // Hạn hoàn thành
                { wch: 12 }, // Tiến độ
                { wch: 30 }, // Tags
            ];

            // Create workbook and add worksheet
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Danh sách công việc');

            // Add summary sheet
            const summary = this.generateSummarySheet(tasks);
            const wsSummary = XLSX.utils.json_to_sheet(summary);
            XLSX.utils.book_append_sheet(wb, wsSummary, 'Tổng hợp');

            // Generate Excel file as Blob
            const excelBuffer = XLSX.write(wb, {
                bookType: 'xlsx',
                type: 'array'
            });

            return new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
        } catch (error) {
            console.error('[Export] Error exporting tasks:', error);
            throw error;
        }
    },

    /**
     * Generate summary statistics
     */
    generateSummarySheet(tasks: Task[]): any[] {
        const total = tasks.length;
        const statusCounts: Record<string, number> = {};
        const priorityCounts: Record<string, number> = {};
        const phaseCounts: Record<string, number> = {};

        tasks.forEach(t => {
            // Count by status
            statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;

            // Count by priority
            priorityCounts[t.priority] = (priorityCounts[t.priority] || 0) + 1;

            // Count by phase
            if (t.phase) {
                phaseCounts[t.phase] = (phaseCounts[t.phase] || 0) + 1;
            }
        });

        const avgProgress = tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / total;

        const summary = [
            { 'Chỉ tiêu': 'Tổng số công việc', 'Giá trị': total },
            { 'Chỉ tiêu': 'Tiến độ trung bình', 'Giá trị': `${avgProgress.toFixed(1)}%` },
            { 'Chỉ tiêu': '', 'Giá trị': '' },
            { 'Chỉ tiêu': '=== THEO TRẠNG THÁI ===', 'Giá trị': '' },
            ...Object.entries(statusCounts).map(([status, count]) => ({
                'Chỉ tiêu': status,
                'Giá trị': `${count} (${((count / total) * 100).toFixed(1)}%)`
            })),
            { 'Chỉ tiêu': '', 'Giá trị': '' },
            { 'Chỉ tiêu': '=== THEO ƯU TIÊN ===', 'Giá trị': '' },
            ...Object.entries(priorityCounts).map(([priority, count]) => ({
                'Chỉ tiêu': priority,
                'Giá trị': `${count} (${((count / total) * 100).toFixed(1)}%)`
            })),
        ];

        if (Object.keys(phaseCounts).length > 0) {
            summary.push({ 'Chỉ tiêu': '', 'Giá trị': '' });
            summary.push({ 'Chỉ tiêu': '=== THEO GIAI ĐOẠN ===', 'Giá trị': '' });
            summary.push(...Object.entries(phaseCounts).map(([phase, count]) => ({
                'Chỉ tiêu': phase,
                'Giá trị': `${count} (${((count / total) * 100).toFixed(1)}%)`
            })));
        }

        return summary;
    },

    /**
     * Export task history to Excel
     */
    async exportTaskHistory(taskId: string): Promise<Blob> {
        try {
            const history = await TaskService.getTaskHistory(taskId);

            const rows = history.map(h => ({
                'Thời gian': new Date(h.changed_at).toLocaleString('vi-VN'),
                'Trường dữ liệu': h.field_name,
                'Giá trị cũ': h.old_value || '-',
                'Giá trị mới': h.new_value || '-',
                'Người thay đổi': h.changed_by || 'Hệ thống',
                'Ghi chú': h.notes || '',
            }));

            const ws = XLSX.utils.json_to_sheet(rows);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Lịch sử thay đổi');

            const excelBuffer = XLSX.write(wb, {
                bookType: 'xlsx',
                type: 'array'
            });

            return new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
        } catch (error) {
            console.error('[Export] Error exporting history:', error);
            throw error;
        }
    },

    /**
     * Download blob as file
     */
    downloadBlob(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },

    /**
     * Export tasks and download immediately
     */
    async exportAndDownload(projectId: string, projectName: string, filters?: TaskFilter): Promise<void> {
        const blob = await this.exportTasksToExcel(projectId, filters);
        const timestamp = new Date().toISOString().slice(0, 10);
        const filename = `DanhSachCongViec_${projectName}_${timestamp}.xlsx`;
        this.downloadBlob(blob, filename);
    }
};

export default ExportService;
