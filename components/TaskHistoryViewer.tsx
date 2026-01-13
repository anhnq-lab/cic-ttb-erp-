import React, { useState, useEffect } from 'react';
import { TaskService } from '../services/task.service';
import { Clock, User, Calendar, FileText } from 'lucide-react';

interface TaskHistoryViewerProps {
    taskId: string;
}

interface HistoryEntry {
    id: string;
    field_name: string;
    old_value: string | null;
    new_value: string | null;
    changed_by: string | null;
    changed_at: string;
    notes: string | null;
}

const TaskHistoryViewer: React.FC<TaskHistoryViewerProps> = ({ taskId }) => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, [taskId]);

    const loadHistory = async () => {
        setIsLoading(true);
        try {
            const data = await TaskService.getTaskHistory(taskId);
            setHistory(data);
        } catch (error) {
            console.error('Error loading task history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getFieldLabel = (fieldName: string): string => {
        const labels: Record<string, string> = {
            'status': 'Trạng thái',
            'progress': 'Tiến độ',
            'assignee_id': 'Người thực hiện',
            'reviewer_id': 'Người review',
            'priority': 'Độ ưu tiên',
            'due_date': 'Deadline',
            'name': 'Tên task',
            'description': 'Mô tả',
            'estimated_hours': 'Giờ ước lượng'
        };
        return labels[fieldName] || fieldName;
    };

    const formatValue = (value: string | null): string => {
        if (!value) return '-';
        return value;
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="p-6 text-center text-gray-500">
                <Clock className="animate-spin mx-auto mb-2" size={24} />
                Đang tải lịch sử...
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500">
                <FileText className="mx-auto mb-2 text-gray-300" size={32} />
                Chưa có lịch sử thay đổi
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Clock size={18} className="text-orange-600" />
                Lịch sử thay đổi ({history.length})
            </h3>

            <div className="space-y-3">
                {history.map((entry) => (
                    <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                    <User size={16} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        {getFieldLabel(entry.field_name)}
                                    </p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Calendar size={12} />
                                        {formatDate(entry.changed_at)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm mt-2">
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 mb-1">Từ:</p>
                                <p className="font-medium text-gray-800 bg-gray-50 px-3 py-1 rounded">
                                    {formatValue(entry.old_value)}
                                </p>
                            </div>
                            <div className="text-gray-400">→</div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 mb-1">Đến:</p>
                                <p className="font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded">
                                    {formatValue(entry.new_value)}
                                </p>
                            </div>
                        </div>

                        {entry.notes && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Ghi chú:</p>
                                <p className="text-sm text-gray-700 italic">{entry.notes}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskHistoryViewer;
