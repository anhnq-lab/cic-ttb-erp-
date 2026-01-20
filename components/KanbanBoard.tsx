import React, { useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types';
import { KanbanColumn } from './KanbanColumn';
import { TaskMoveConfirmDialog } from './TaskMoveConfirmDialog';
import TaskService from '../services/task.service';

interface KanbanBoardProps {
    projectId: string;
    onTaskClick: (task: Task) => void;
    currentUserId: string; // For permission check
}

/**
 * KanbanBoard - Main Kanban container with 8 status columns
 * Handles drag-drop, permission checks, and real-time updates
 */
export const KanbanBoard: React.FC<KanbanBoardProps> = ({
    projectId,
    onTaskClick,
    currentUserId
}) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        taskId: string;
        taskName: string;
        oldStatus: string;
        newStatus: string;
    }>({
        isOpen: false,
        taskId: '',
        taskName: '',
        oldStatus: '',
        newStatus: ''
    });

    // Kanban columns configuration (8 columns)
    const columns: Array<{ status: TaskStatus; displayName: string }> = [
        { status: TaskStatus.S0, displayName: 'S0 Đang thực hiện' },
        { status: TaskStatus.S1, displayName: 'S1 Phối hợp' },
        { status: TaskStatus.S2, displayName: 'S2 Kiểm tra chéo' },
        { status: TaskStatus.S3, displayName: 'S3 Duyệt nội bộ' },
        { status: TaskStatus.S4, displayName: 'S4 Lãnh đạo duyệt' },
        { status: TaskStatus.S5, displayName: 'S5 Đã duyệt' },
        { status: TaskStatus.S6, displayName: 'S6 Trình khách hàng' },
        { status: TaskStatus.COMPLETED, displayName: 'Hoàn thành' }
    ];

    // Load tasks on mount
    useEffect(() => {
        loadTasks();
    }, [projectId]);

    // Subscribe to real-time updates
    useEffect(() => {
        const channel = TaskService.subscribeToTasks(projectId, (payload) => {
            console.log('Real-time update:', payload);
            loadTasks(); // Reload tasks on any change
        });

        return () => {
            TaskService.unsubscribe(channel);
        };
    }, [projectId]);

    const loadTasks = async () => {
        try {
            setIsLoading(true);
            const data = await TaskService.getProjectTasks(projectId);
            setTasks(data);
        } catch (error) {
            console.error('Error loading tasks:', error);
            alert('Lỗi tải tasks');
        } finally {
            setIsLoading(false);
        }
    };

    // Group tasks by status
    const getTasksByStatus = (status: TaskStatus) => {
        return tasks.filter(task => task.status === status);
    };

    // Handle drag over (allow drop)
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    // Handle drop
    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();

        const taskId = e.dataTransfer.getData('taskId');
        const currentStatus = e.dataTransfer.getData('currentStatus');
        const projectId = e.dataTransfer.getData('projectId');
        const targetColumn = (e.currentTarget as HTMLElement).getAttribute('data-status');

        if (!taskId || !targetColumn || currentStatus === targetColumn) {
            return; // No change needed
        }

        // Find task details
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        // Show confirmation dialog
        setConfirmDialog({
            isOpen: true,
            taskId,
            taskName: task.name,
            oldStatus: currentStatus,
            newStatus: targetColumn
        });
    };

    // Handle confirmation
    const handleConfirmMove = async (notes?: string) => {
        const { taskId, newStatus } = confirmDialog;

        try {
            const result = await TaskService.updateTaskStatusWithConfirmation(
                taskId,
                newStatus,
                currentUserId,
                notes
            );

            if (result.success) {
                // Success - reload tasks
                await loadTasks();
                alert('✅ Cập nhật thành công!');
            } else {
                // Permission denied or error
                alert(`❌ ${result.error || 'Lỗi không xác định'}`);
            }
        } catch (error) {
            console.error('Error updating task:', error);
            alert('❌ Lỗi cập nhật task');
        } finally {
            setConfirmDialog({ ...confirmDialog, isOpen: false });
        }
    };

    // Handle cancel
    const handleCancelMove = () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="kanban-board-container">
            {/* Kanban Board */}
            <div className="flex gap-4 overflow-x-auto pb-4">
                {columns.map(column => (
                    <KanbanColumn
                        key={column.status}
                        status={column.status}
                        displayName={column.displayName}
                        tasks={getTasksByStatus(column.status)}
                        onTaskClick={onTaskClick}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    />
                ))}
            </div>

            {/* Confirmation Dialog */}
            <TaskMoveConfirmDialog
                isOpen={confirmDialog.isOpen}
                taskName={confirmDialog.taskName}
                oldStatus={confirmDialog.oldStatus}
                newStatus={confirmDialog.newStatus}
                onConfirm={handleConfirmMove}
                onCancel={handleCancelMove}
            />
        </div>
    );
};
