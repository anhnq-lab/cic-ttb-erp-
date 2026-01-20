import React from 'react';
import { Task } from '../types';

interface KanbanCardProps {
    task: Task;
    onClick: () => void;
}

/**
 * KanbanCard - Individual task card in Kanban board
 * Displays task name, assignee, priority badge, and due date
 */
export const KanbanCard: React.FC<KanbanCardProps> = ({ task, onClick }) => {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Khẩn cấp': return 'bg-red-100 text-red-800 border-red-300';
            case 'Cao': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'Trung bình': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Thấp': return 'bg-gray-100 text-gray-800 border-gray-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    };

    const isOverdue = () => {
        if (!task.dueDate) return false;
        const today = new Date();
        const due = new Date(task.dueDate);
        return due < today && task.status !== 'Hoàn thành';
    };

    return (
        <div
            onClick={onClick}
            className="kanban-card bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow duration-200"
            draggable
        >
            {/* Task Name */}
            <div className="font-medium text-sm text-gray-900 mb-2 line-clamp-2">
                {task.name}
            </div>

            {/* Priority Badge */}
            {task.priority && (
                <div className="mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                    </span>
                </div>
            )}

            {/* Footer: Assignee + Due Date */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                {/* Assignee Avatar */}
                <div className="flex items-center gap-1">
                    {task.assignee?.avatar ? (
                        <img
                            src={task.assignee.avatar}
                            alt={task.assignee.name}
                            className="w-5 h-5 rounded-full border border-gray-300"
                            title={task.assignee.name}
                        />
                    ) : (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-semibold">
                            {task.assignee?.name?.charAt(0) || '?'}
                        </div>
                    )}
                    <span className="truncate max-w-[80px]">{task.assignee?.name || 'Unassigned'}</span>
                </div>

                {/* Due Date */}
                {task.dueDate && (
                    <span className={`${isOverdue() ? 'text-red-600 font-semibold' : ''}`}>
                        📅 {formatDate(task.dueDate)}
                    </span>
                )}
            </div>
        </div>
    );
};
