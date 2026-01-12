import React, { useState, useEffect } from 'react';
import { TaskService } from '../services/task.service';
import { TimesheetService } from '../services/timesheet.service';
import { Clock, TrendingUp, Users, Target, Calendar } from 'lucide-react';

interface TaskTimeReportProps {
    projectId?: string;
}

interface TaskTimeData {
    id: string;
    name: string;
    code: string;
    status: string;
    estimatedHours: number | null;
    actualHours: number;
    variance: number;
    variancePercent: number;
    teamSize: number;
    progress: number;
}

const TaskTimeReport: React.FC<TaskTimeReportProps> = ({ projectId }) => {
    const [tasks, setTasks] = useState<TaskTimeData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'variance' | 'hours' | 'name'>('variance');

    useEffect(() => {
        loadTaskTimeData();
    }, [projectId]);

    const loadTaskTimeData = async () => {
        setIsLoading(true);
        try {
            // Get tasks
            const tasksData = projectId
                ? await TaskService.getProjectTasks(projectId)
                : await TaskService.getAllTasks();

            // Get time analytics for each task
            const taskTimeData: TaskTimeData[] = await Promise.all(
                tasksData.map(async (task) => {
                    const timeAnalytics = await TaskService.getTaskTimeAnalytics(task.id);
                    const estimatedHours = task.estimated_hours || null;
                    const actualHours = timeAnalytics.totalHours;
                    const variance = estimatedHours ? actualHours - estimatedHours : 0;
                    const variancePercent = estimatedHours
                        ? ((variance / estimatedHours) * 100)
                        : 0;

                    return {
                        id: task.id,
                        name: task.name,
                        code: task.code || '-',
                        status: task.status,
                        estimatedHours,
                        actualHours,
                        variance,
                        variancePercent,
                        teamSize: Object.keys(timeAnalytics.byEmployee).length,
                        progress: task.progress || 0
                    };
                })
            );

            setTasks(taskTimeData);
        } catch (error) {
            console.error('Error loading task time data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const sortedTasks = [...tasks].sort((a, b) => {
        switch (sortBy) {
            case 'variance':
                return Math.abs(b.variancePercent) - Math.abs(a.variancePercent);
            case 'hours':
                return b.actualHours - a.actualHours;
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return 0;
        }
    });

    const totalStats = tasks.reduce((acc, task) => ({
        totalEstimated: acc.totalEstimated + (task.estimatedHours || 0),
        totalActual: acc.totalActual + task.actualHours,
        totalTasks: acc.totalTasks + 1,
        tasksWithEstimate: acc.tasksWithEstimate + (task.estimatedHours ? 1 : 0)
    }), { totalEstimated: 0, totalActual: 0, totalTasks: 0, tasksWithEstimate: 0 });

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Target size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Tổng tasks</p>
                            <p className="text-xl font-bold text-gray-800">{totalStats.totalTasks}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Giờ thực tế</p>
                            <p className="text-xl font-bold text-gray-800">{totalStats.totalActual.toFixed(1)}h</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Giờ ước lượng</p>
                            <p className="text-xl font-bold text-gray-800">{totalStats.totalEstimated.toFixed(1)}h</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Chênh lệch</p>
                            <p className={`text-xl font-bold ${totalStats.totalActual > totalStats.totalEstimated ? 'text-red-600' : 'text-green-600'
                                }`}>
                                {totalStats.totalEstimated > 0
                                    ? ((totalStats.totalActual - totalStats.totalEstimated) / totalStats.totalEstimated * 100).toFixed(0)
                                    : 0}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2">
                <button
                    onClick={() => setSortBy('variance')}
                    className={`px-3 py-1 text-sm font-medium rounded-lg ${sortBy === 'variance'
                            ? 'bg-orange-600 text-white'
                            : 'bg-white text-gray-600 border border-gray-200'
                        }`}
                >
                    Sắp xếp theo chênh lệch
                </button>
                <button
                    onClick={() => setSortBy('hours')}
                    className={`px-3 py-1 text-sm font-medium rounded-lg ${sortBy === 'hours'
                            ? 'bg-orange-600 text-white'
                            : 'bg-white text-gray-600 border border-gray-200'
                        }`}
                >
                    Sắp xếp theo giờ
                </button>
                <button
                    onClick={() => setSortBy('name')}
                    className={`px-3 py-1 text-sm font-medium rounded-lg ${sortBy === 'name'
                            ? 'bg-orange-600 text-white'
                            : 'bg-white text-gray-600 border border-gray-200'
                        }`}
                >
                    Sắp xếp theo tên
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Task</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase">Ước lượng</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase">Thực tế</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase">Chênh lệch</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Team</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Progress</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : sortedTasks.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            sortedTasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-800">{task.name}</p>
                                            <p className="text-xs text-gray-500 font-mono">{task.code}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-medium text-gray-800">
                                            {task.estimatedHours ? `${task.estimatedHours.toFixed(1)}h` : '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-bold text-orange-600">
                                            {task.actualHours.toFixed(1)}h
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {task.estimatedHours ? (
                                            <div>
                                                <span className={`font-bold ${task.variance > 0 ? 'text-red-600' : 'text-green-600'
                                                    }`}>
                                                    {task.variance > 0 ? '+' : ''}{task.variance.toFixed(1)}h
                                                </span>
                                                <span className={`text-xs ml-1 ${task.variance > 0 ? 'text-red-600' : 'text-green-600'
                                                    }`}>
                                                    ({task.variancePercent > 0 ? '+' : ''}{task.variancePercent.toFixed(0)}%)
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Users size={14} className="text-gray-400" />
                                            <span className="text-sm font-medium text-gray-800">{task.teamSize}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-500 rounded-full"
                                                    style={{ width: `${task.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-gray-600 w-10 text-right">
                                                {task.progress}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskTimeReport;
