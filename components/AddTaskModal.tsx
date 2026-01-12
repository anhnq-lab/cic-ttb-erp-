import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Task } from '../types';
import TaskService from '../services/task.service';

interface AddTaskModalProps {
    projectId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ projectId, isOpen, onClose, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        status: 'Mở',
        priority: 'Trung bình',
        start_date: '',
        due_date: '',
        estimated_hours: '',
        assignee_name: '',
        progress: 0
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'> = {
                project_id: projectId,
                name: formData.name,
                code: formData.code || undefined,
                description: formData.description || undefined,
                status: formData.status as any,
                priority: formData.priority as any,
                start_date: formData.start_date || undefined,
                due_date: formData.due_date || undefined,
                estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : undefined,
                assignee_name: formData.assignee_name || undefined,
                progress: formData.progress
            };

            await TaskService.createTask(newTask);

            // Reset form
            setFormData({
                name: '',
                code: '',
                description: '',
                status: 'Mở',
                priority: 'Trung bình',
                start_date: '',
                due_date: '',
                estimated_hours: '',
                assignee_name: '',
                progress: 0
            });

            onSuccess();
            onClose();
            alert('Task created successfully!');
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Plus size={24} className="text-orange-600" />
                        New Task
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Task Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Task Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Enter task name"
                        />
                    </div>

                    {/* Task Code */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Task Code</label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="e.g., 1.2.3"
                        />
                    </div>

                    {/* Status & Priority */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="Thấp">Thấp</option>
                                <option value="Trung bình">Trung bình</option>
                                <option value="Cao">Cao</option>
                                <option value="Khẩn cấp">Khẩn cấp</option>
                            </select>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Due Date</label>
                            <input
                                type="date"
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Estimated Hours */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Estimated Hours</label>
                        <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={formData.estimated_hours}
                            onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="e.g., 40"
                        />
                    </div>

                    {/* Assignee */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Assignee</label>
                        <input
                            type="text"
                            value={formData.assignee_name}
                            onChange={(e) => setFormData({ ...formData, assignee_name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Assignee name"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                            placeholder="Task description..."
                        />
                    </div>

                    {/* Progress */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Initial Progress: {formData.progress}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={formData.progress}
                            onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                            className="w-full"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={isLoading || !formData.name}
                            className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                                <><Plus size={20} /> Create Task</>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;
