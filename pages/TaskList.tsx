
import React, { useState, useEffect } from 'react';
import TaskService from '../services/task.service';
import { Task, TaskStatus, TaskPriority } from '../types';
import {
    Search, Filter, Calendar, Kanban, List, BarChart2,
    ChevronDown, MessageSquare, Paperclip, Clock, AlertCircle, CheckCircle2, Plus
} from 'lucide-react';
import TaskDetailModal from '../components/TaskDetailModal';
import AddTaskModal from '../components/AddTaskModal';

const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'gantt'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: 'All',
        priority: 'All',
        project: 'All'
    });
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = await TaskService.getAllTasks();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Tasks
    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.projectCode?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filters.status === 'All' || task.status === filters.status;
        const matchesPriority = filters.priority === 'All' || task.priority === filters.priority;
        // Assuming we might filter by project later, implementing logic but UI needs project list
        const matchesProject = filters.project === 'All' || task.projectName === filters.project;

        return matchesSearch && matchesStatus && matchesPriority && matchesProject;
    });

    // Calculate Metrics
    const stats = {
        total: filteredTasks.length,
        critical: filteredTasks.filter(t => t.priority === TaskPriority.CRITICAL).length,
        completed: filteredTasks.filter(t => t.status === TaskStatus.COMPLETED).length,
        inProgress: filteredTasks.filter(t => [TaskStatus.S0, TaskStatus.S1, TaskStatus.S3, TaskStatus.S4].includes(t.status)).length
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case TaskPriority.CRITICAL: return 'text-red-500 bg-red-100 dark:bg-red-900/20';
            case TaskPriority.HIGH: return 'text-orange-500 bg-orange-100 dark:bg-orange-900/20';
            case TaskPriority.MEDIUM: return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
            default: return 'text-slate-500 bg-slate-100 dark:bg-slate-900/20';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case TaskStatus.COMPLETED: return 'bg-green-100 text-green-700 border-green-200';
            case TaskStatus.OPEN: return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-blue-50 text-blue-700 border-blue-200';
        }
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            {/* Header & Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Quản lý công việc
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Tổng quan công việc từ tất cả các dự án
                    </p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2 shadow-lg"
                >
                    <Plus size={18} /> New Task
                </button>
                <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <List size={18} /> Danh sách
                    </button>
                    <button
                        onClick={() => setViewMode('kanban')}
                        className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'kanban' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Kanban size={18} /> Kanban
                    </button>
                    <button
                        onClick={() => setViewMode('gantt')}
                        className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'gantt' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                        <BarChart2 size={18} /> Gantt
                    </button>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Tổng việc</p>
                        <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                        <List size={20} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Đang thực hiện</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <Clock size={20} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Khẩn cấp</p>
                        <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg text-red-600">
                        <AlertCircle size={20} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium">Hoàn thành</p>
                        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-green-600">
                        <CheckCircle2 size={20} />
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm công việc, dự án..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="All">Tất cả trạng thái</option>
                        {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    >
                        <option value="All">Độ ưu tiên</option>
                        {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-slate-400">
                        <div className="animate-spin mr-2 h-5 w-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                        Đang tải dữ liệu...
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <List size={48} className="mb-4 text-slate-200" />
                        <p>Không tìm thấy công việc nào</p>
                    </div>
                ) : (
                    <>
                        {viewMode === 'list' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
                                            <th className="p-4 font-semibold">Tên công việc</th>
                                            <th className="p-4 font-semibold">Dự án</th>
                                            <th className="p-4 font-semibold">Người thực hiện</th>
                                            <th className="p-4 font-semibold">Trạng thái</th>
                                            <th className="p-4 font-semibold">Độ ưu tiên</th>
                                            <th className="p-4 font-semibold">Hạn chót</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredTasks.map((task) => (
                                            <tr
                                                key={task.id}
                                                onClick={() => setSelectedTask(task)}
                                                className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                                            >
                                                <td className="p-4">
                                                    <div>
                                                        <p className="font-medium text-slate-900 line-clamp-1">{task.name}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.code}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-indigo-600 font-medium truncate max-w-[150px]">{task.project_id}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-sm text-slate-700">{task.assignee_name || 'Chưa gán'}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                                        {task.priority || 'Thấp'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center text-slate-600 text-sm">
                                                        <Calendar size={14} className="mr-1.5 text-slate-400" />
                                                        {task.due_date ? new Date(task.due_date).toLocaleDateString('vi-VN') : '-'}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {viewMode === 'kanban' && (
                            <div className="flex overflow-x-auto p-4 gap-4 h-full bg-slate-50/50">
                                {[TaskStatus.OPEN, TaskStatus.S0, TaskStatus.S4, TaskStatus.COMPLETED].map(status => (
                                    <div key={status} className="flex-none w-80 flex flex-col gap-3">
                                        <div className="flex items-center justify-between sticky top-0 bg-white/50 backdrop-blur-sm p-3 rounded-lg border border-slate-200">
                                            <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${status === TaskStatus.COMPLETED ? 'bg-green-500' : 'bg-blue-500'}`} />
                                                {status === TaskStatus.OPEN ? 'Mới / Chưa bắt đầu' : status}
                                            </h3>
                                            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                                                {filteredTasks.filter(t => t.status === status || (status === TaskStatus.S0 && [TaskStatus.S1, TaskStatus.S3].includes(t.status))).length}
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            {filteredTasks
                                                .filter(t => {
                                                    if (status === TaskStatus.S0) return [TaskStatus.S0, TaskStatus.S1, TaskStatus.S3].includes(t.status);
                                                    if (status === TaskStatus.OPEN) return [TaskStatus.OPEN, TaskStatus.PENDING].includes(t.status);
                                                    return t.status === status;
                                                })
                                                .map(task => (
                                                    <div
                                                        key={task.id}
                                                        onClick={() => setSelectedTask(task)}
                                                        className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group"
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getPriorityColor(task.priority)}`}>
                                                                {task.priority}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-mono">{task.code}</span>
                                                        </div>
                                                        <h4 className="font-medium text-slate-800 text-sm mb-1 group-hover:text-indigo-600 transition-colors">{task.name}</h4>
                                                        <p className="text-xs text-slate-500 mb-2 truncate">{task.project_id}</p>

                                                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                                <Calendar size={12} />
                                                                {task.due_date ? new Date(task.due_date).toLocaleDateString('vi-VN').slice(0, 5) : '-'}
                                                            </div>
                                                            <span className="text-xs text-slate-600">{task.assignee_name || '?'}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {viewMode === 'gantt' && (
                            <div className="p-8 text-center text-slate-500">
                                <BarChart2 size={48} className="mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-medium text-slate-700">Chế độ Gantt đang được phát triển</h3>
                                <p>Tính năng này sẽ sớm ra mắt trong phiên bản tiếp theo.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            {selectedTask && (
                <TaskDetailModal
                    task={selectedTask}
                    isOpen={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onUpdate={() => {
                        fetchTasks();
                        setSelectedTask(null);
                    }}
                />
            )}

            <AddTaskModal
                projectId="proj-demo-001"
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={() => {
                    fetchTasks();
                    setShowAddModal(false);
                }}
            />
        </div>
    );
};

export default TaskList;
