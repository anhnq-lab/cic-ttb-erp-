import React from 'react';
import { Task, TaskStatus } from '../types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
    status: TaskStatus;
    displayName: string;
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
}

/**
 * KanbanColumn - Single column in Kanban board
 * Represents one status with droppable zone for tasks
 */
export const KanbanColumn: React.FC<KanbanColumnProps> = ({
    status,
    displayName,
    tasks,
    onTaskClick,
    onDragOver,
    onDrop
}) => {
    const getColumnColor = (status: TaskStatus) => {
        if (status === TaskStatus.COMPLETED) return 'bg-green-50 border-green-300';
        if (status === TaskStatus.S0) return 'bg-yellow-50 border-yellow-300';
        if (status === TaskStatus.S4) return 'bg-purple-50 border-purple-300';
        if (status === TaskStatus.S6) return 'bg-blue-50 border-blue-300';
        return 'bg-gray-50 border-gray-300';
    };

    return (
        <div
            className={`kanban-column flex-shrink-0 w-80 rounded-lg border-2 ${getColumnColor(status)} p-3`}
            onDragOver={onDragOver}
            onDrop={onDrop}
            data-status={status}
        >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-300">
                <h3 className="font-semibold text-sm text-gray-700">{displayName}</h3>
                <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600 font-medium">
                    {tasks.length}
                </span>
            </div>

            {/* Task Cards */}
            <div className="kanban-column-cards min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('taskId', task.id);
                                e.dataTransfer.setData('currentStatus', task.status);
                                e.dataTransfer.setData('projectId', task.projectId);
                            }}
                        >
                            <KanbanCard task={task} onClick={() => onTaskClick(task)} />
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-400 text-sm py-8 px-2 border-2 border-dashed border-gray-300 rounded-lg">
                        Kéo task vào đây
                    </div>
                )}
            </div>
        </div>
    );
};
