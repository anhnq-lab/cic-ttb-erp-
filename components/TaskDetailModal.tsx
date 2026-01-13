import React, { useState, useEffect } from 'react';
import { X, Edit2, Trash2, Calendar, Clock, User, Tag, TrendingUp, Save, XCircle } from 'lucide-react';
import { Task } from '../types';
import TaskService from '../services/task.service';
import TaskHistoryViewer from './TaskHistoryViewer';

interface TaskDetailModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, isOpen, onClose, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState<Task>(task);
    const [timeAnalytics, setTimeAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && task.id) {
            loadTimeAnalytics();
        }
    }, [isOpen, task.id]);

    const loadTimeAnalytics = async () => {
        try {
            const analytics = await TaskService.getTaskTimeAnalytics(task.id);
            setTimeAnalytics(analytics);
        } catch (error) {
            console.error('Error loading time analytics:', error);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await TaskService.updateTask(task.id, editedTask);
            setIsEditing(false);
            onUpdate();
            alert('Task updated successfully!');
        } catch (error) {
            console.error('Error updating task:', error);
            alert('Failed to update task');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Xóa task "${task.name}"?`)) return;

        setIsLoading(true);
        try {
            await TaskService.deleteTask(task.id);
            onUpdate();
            onClose();
            alert('Task deleted successfully!');
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task');
        } finally {
            setIsLoading(false);
        }
    };

    const variance = task.estimated_hours && timeAnalytics
        ? timeAnalytics.totalHours - task.estimated_hours
        : null;

    const variancePercent = variance && task.estimated_hours
        ? (variance / task.estimated_hours) * 100
        : null;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedTask.name}
                                onChange={(e) => setEditedTask({ ...editedTask, name: e.target.value })}
                                className="text-xl font-bold w-full border-b-2 border-orange-500 focus:outline-none"
                            />
                        ) : (
                            <h2 className="text-xl font-bold text-gray-800">{task.name}</h2>
                        )}
                        <p className="text-sm text-gray-500 font-mono mt-1">{task.code}</p>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                                >
                                    <Save size={16} /> Save
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditedTask(task);
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                                >
                                    <XCircle size={16} /> Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                >
                                    <Edit2 size={16} /> Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Status & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
                            {isEditing ? (
                                <select
                                    value={editedTask.status}
                                    onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value as any })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="Mở">Mở</option>
                                    <option value="S0 Đang thực hiện">S0 Đang thực hiện</option>
                                    <option value="S1 Phối hợp">S1 Phối hợp</option>
                                    <option value="S2 Kiểm tra chéo">S2 Kiểm tra chéo</option>
                                    <option value="S3 Duyệt nội bộ">S3 Duyệt nội bộ</option>
                                    <option value="S4 Lãnh đạo duyệt">S4 Lãnh đạo duyệt</option>
                                    <option value="S5 Đã duyệt">S5 Đã duyệt</option>
                                    <option value="S6 Nộp thành phẩm">S6 Nộp thành phẩm</option>
                                    <option value="Hoàn thành">Hoàn thành</option>
                                    <option value="Đang chờ">Đang chờ</option>
                                </select>
                            ) : (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium inline-block">
                                    {task.status}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Priority</label>
                            {isEditing ? (
                                <select
                                    value={editedTask.priority || 'Trung bình'}
                                    onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as any })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="Thấp">Thấp</option>
                                    <option value="Trung bình">Trung bình</option>
                                    <option value="Cao">Cao</option>
                                    <option value="Khẩn cấp">Khẩn cấp</option>
                                </select>
                            ) : (
                                <span className={`px-3 py-1 rounded-lg text-sm font-medium inline-block ${task.priority === 'Cao' || task.priority === 'Khẩn cấp'
                                        ? 'bg-red-100 text-red-700'
                                        : task.priority === 'Trung bình'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {task.priority || 'Trung bình'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Time Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                                <Calendar size={14} /> Timeline
                            </label>
                            <div className="space-y-1">
                                {isEditing ? (
                                    <>
                                        <input
                                            type="date"
                                            value={editedTask.start_date || ''}
                                            onChange={(e) => setEditedTask({ ...editedTask, start_date: e.target.value })}
                                            className="w-full px-2 py-1 border rounded text-sm"
                                        />
                                        <input
                                            type="date"
                                            value={editedTask.due_date || ''}
                                            onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value })}
                                            className="w-full px-2 py-1 border rounded text-sm"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm"><span className="font-medium">Start:</span> {task.start_date || '-'}</p>
                                        <p className="text-sm"><span className="font-medium">Due:</span> {task.due_date || '-'}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                                <Clock size={14} /> Hours
                            </label>
                            <div className="space-y-2">
                                {isEditing ? (
                                    <input
                                        type="number"
                                        step="0.5"
                                        value={editedTask.estimated_hours || ''}
                                        onChange={(e) => setEditedTask({ ...editedTask, estimated_hours: parseFloat(e.target.value) })}
                                        placeholder="Estimated hours"
                                        className="w-full px-2 py-1 border rounded text-sm"
                                    />
                                ) : (
                                    <>
                                        <p className="text-sm"><span className="font-medium">Estimated:</span> {task.estimated_hours ? `${task.estimated_hours}h` : '-'}</p>
                                        {timeAnalytics && (
                                            <>
                                                <p className="text-sm"><span className="font-medium">Actual:</span> {timeAnalytics.totalHours.toFixed(1)}h</p>
                                                {variance !== null && (
                                                    <p className={`text-sm font-bold ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                        Variance: {variance > 0 ? '+' : ''}{variance.toFixed(1)}h ({variancePercent?.toFixed(0)}%)
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Progress */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Progress</label>
                        {isEditing ? (
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={editedTask.progress || 0}
                                onChange={(e) => setEditedTask({ ...editedTask, progress: parseInt(e.target.value) })}
                                className="w-full"
                            />
                        ) : null}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
                                    style={{ width: `${isEditing ? editedTask.progress : task.progress}%` }}
                                />
                            </div>
                            <span className="text-sm font-bold text-gray-800 min-w-[50px] text-right">
                                {isEditing ? editedTask.progress : task.progress}%
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                        {isEditing ? (
                            <textarea
                                value={editedTask.description || ''}
                                onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                                rows={4}
                                className="w-full px-3 py-2 border rounded-lg resize-none"
                                placeholder="Task description..."
                            />
                        ) : (
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                {task.description || 'No description'}
                            </p>
                        )}
                    </div>

                    {/* Assignee */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                            <User size={14} /> Assignee
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedTask.assignee_name || ''}
                                onChange={(e) => setEditedTask({ ...editedTask, assignee_name: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg"
                                placeholder="Assignee name"
                            />
                        ) : (
                            <p className="text-sm">{task.assignee_name || 'Unassigned'}</p>
                        )}
                    </div>

                    {/* History */}
                    {!isEditing && (
                        <div className="border-t border-gray-200 pt-6">
                            <TaskHistoryViewer taskId={task.id} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
