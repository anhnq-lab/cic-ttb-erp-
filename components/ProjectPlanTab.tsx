
import React, { useState } from 'react';
import { Project, Task, TaskStatus, TaskPriority } from '../types';
import { PROJECT_TEMPLATES } from '../constants';
import {
    ChevronDown, ChevronRight, CheckCircle2, Circle, Clock, AlertTriangle,
    Play, Pause, Calendar, User, Target, Layers, FileText, Settings
} from 'lucide-react';
import TaskModal from './TaskModal';

interface ProjectPlanTabProps {
    project: Project;
    tasks: Task[];
}

interface PhaseGroup {
    code: string;
    name: string;
    tasks: Task[]; // Use actual Task type instead of template type
    progress: number;
    status: 'pending' | 'in_progress' | 'completed';
}

const PHASE_NAMES: Record<string, string> = {
    '1': 'Xúc tiến Dự án',
    '2': 'Báo giá',
    '3': 'Chuẩn bị Triển khai',
    '4': 'Triển khai Trình thẩm định',
    '5': 'Triển khai Hỗ trợ QLDA',
    '6': 'Thanh Quyết toán',
    '7': 'Lưu trữ & Rút kinh nghiệm'
};

const getPhaseIcon = (phaseCode: string) => {
    switch (phaseCode) {
        case '1': return Target;
        case '2': return FileText;
        case '3': return Settings;
        case '4': return Play;
        case '5': return Layers;
        case '6': return Clock;
        case '7': return CheckCircle2;
        default: return Circle;
    }
};

const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
        case TaskPriority.CRITICAL: return 'bg-rose-100 text-rose-700 border-rose-200';
        case TaskPriority.HIGH: return 'bg-orange-100 text-orange-700 border-orange-200';
        case TaskPriority.MEDIUM: return 'bg-blue-100 text-blue-700 border-blue-200';
        case TaskPriority.LOW: return 'bg-gray-100 text-gray-600 border-gray-200';
        default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
};

const PhaseCard = ({ phase, isExpanded, onToggle, onTaskClick }: { phase: PhaseGroup; isExpanded: boolean; onToggle: () => void, onTaskClick: (task: Task) => void }) => {
    const PhaseIcon = getPhaseIcon(phase.code);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Phase Header */}
            <button
                onClick={onToggle}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${phase.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                        phase.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-500'
                        }`}>
                        <PhaseIcon size={20} />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Giai đoạn {phase.code}</p>
                        <h3 className="font-bold text-slate-800">{phase.name}</h3>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Progress Bar */}
                    <div className="hidden md:flex items-center gap-3 w-48">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${phase.status === 'completed' ? 'bg-emerald-500' :
                                    phase.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                                    }`}
                                style={{ width: `${phase.progress}%` }}
                            />
                        </div>
                        <span className="text-sm font-bold text-gray-600 w-12 text-right">{phase.progress}%</span>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${phase.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        phase.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-500'
                        }`}>
                        {phase.status === 'completed' ? 'Hoàn thành' :
                            phase.status === 'in_progress' ? 'Đang thực hiện' : 'Chờ'}
                    </span>

                    {/* Expand Icon */}
                    {isExpanded ? (
                        <ChevronDown size={20} className="text-gray-400" />
                    ) : (
                        <ChevronRight size={20} className="text-gray-400" />
                    )}
                </div>
            </button>

            {/* Phase Tasks (Expandable) */}
            {isExpanded && (
                <div className="border-t border-gray-100">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
                            <tr>
                                <th className="px-5 py-3 text-left w-12">#</th>
                                <th className="px-5 py-3 text-left">Công việc</th>
                                <th className="px-5 py-3 text-left">Phụ trách</th>
                                <th className="px-5 py-3 text-center">Ưu tiên</th>
                                <th className="px-5 py-3 text-center">Hạn chót</th>
                                <th className="px-5 py-3 text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {phase.tasks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-4 text-center text-gray-400 italic">
                                        Chưa có công việc nào trong giai đoạn này.
                                    </td>
                                </tr>
                            ) : (
                                phase.tasks.map((task, idx) => {
                                    // Map real status to visual status
                                    const isCompleted = task.status === TaskStatus.COMPLETED || task.status === TaskStatus.S6 || task.status === TaskStatus.S5;
                                    const isInProgress = task.status !== TaskStatus.OPEN && task.status !== TaskStatus.PENDING && !isCompleted;

                                    return (
                                        <tr
                                            key={task.id}
                                            className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                            onClick={() => onTaskClick(task)}
                                        >
                                            <td className="px-5 py-3">
                                                <span className="text-gray-400 font-mono text-xs group-hover:text-orange-500 transition-colors">{task.code || `T-${idx + 1}`}</span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <p className="font-medium text-slate-700 group-hover:text-orange-600 transition-colors">{task.name}</p>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    {task.assignee.avatar ? (
                                                        <img src={task.assignee.avatar} alt={task.assignee.name} className="w-5 h-5 rounded-full" />
                                                    ) : (
                                                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500"><User size={12} /></span>
                                                    )}
                                                    <span className="text-xs font-medium text-slate-600">{task.assignee.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold uppercase ${getPriorityColor(task.priority)}`}>
                                                    {task.priority || 'Medium'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                <span className="text-gray-500 text-xs">
                                                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('vi-VN') : '-'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                {isCompleted ? (
                                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                                                        <CheckCircle2 size={12} /> Hoàn thành
                                                    </div>
                                                ) : isInProgress ? (
                                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">
                                                        <Play size={12} /> Đang làm
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-50 text-gray-500 text-[10px] font-bold border border-gray-200">
                                                        <Circle size={12} /> Chờ
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const ProjectPlanTab: React.FC<ProjectPlanTabProps> = ({ project, tasks }) => {
    const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(['1', '2']));
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Get template based on capital source (Used for default phases if no tasks found?)
    // Actually we just map real tasks now.

    // Group tasks by phase (first digit of code or by phase name)
    const phases: PhaseGroup[] = Object.entries(PHASE_NAMES).map(([code, name]) => {
        // Filter tasks by phase name (Linked via phase property)
        const phaseTasks = tasks.filter(t => t.phase === name);

        // Sort tasks by start date if available
        phaseTasks.sort((a, b) => {
            if (!a.startDate || !b.startDate) return 0;
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        });

        // Calculate phase progress based on task completion
        let phaseProgress = 0;
        let status: 'pending' | 'in_progress' | 'completed' = 'pending';

        if (phaseTasks.length > 0) {
            const completedCount = phaseTasks.filter(t =>
                t.status === TaskStatus.COMPLETED || t.status === 'S6' || t.status === 'S5'
            ).length;
            phaseProgress = Math.round((completedCount / phaseTasks.length) * 100);

            if (phaseProgress === 100) status = 'completed';
            else if (phaseProgress > 0) status = 'in_progress';
            else status = 'pending';
        } else {
            // Fallback for demo: if no tasks, set progress based on project phase (mock logic)
            // Or leave it empty
        }

        return {
            code,
            name,
            tasks: phaseTasks,
            progress: phaseProgress,
            status
        };
    });

    const togglePhase = (code: string) => {
        setExpandedPhases(prev => {
            const newSet = new Set(prev);
            if (newSet.has(code)) {
                newSet.delete(code);
            } else {
                newSet.add(code);
            }
            return newSet;
        });
    };

    // Calculate overall timeline stats
    const totalTasks = tasks.filter(t => t.phase).length; // Only count tasks linked to Plan
    const totalDuration = 124; // Mock estimate days

    return (
        <div className="space-y-6 animate-fade-in relative">
            {/* Header Stats */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold mb-1">Kế hoạch Thực hiện Dự án</h2>
                        <p className="text-indigo-200 text-sm">
                            Theo Quy chế {project.capitalSource === 'StateBudget' ? '25.10' : '25.20'} -
                            {project.capitalSource === 'StateBudget' ? ' Vốn Ngân sách Nhà nước' : ' Vốn Ngoài Ngân sách'}
                        </p>
                    </div>
                    <div className="flex gap-6">
                        <div className="text-center">
                            <p className="text-3xl font-black">{phases.length}</p>
                            <p className="text-xs text-indigo-200 uppercase tracking-wider">Giai đoạn</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black">{totalTasks}</p>
                            <p className="text-xs text-indigo-200 uppercase tracking-wider">Công việc</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black">{totalDuration}</p>
                            <p className="text-xs text-indigo-200 uppercase tracking-wider">Ngày (Est.)</p>
                        </div>
                    </div>
                </div>

                {/* Overall Progress */}
                <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-indigo-200">Tiến độ tổng thể</span>
                        <span className="font-bold">{project.progress}%</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Timeline Legend */}
            <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    Hoàn thành
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    Đang thực hiện
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                    Chờ triển khai
                </span>
            </div>

            {/* Phase Cards */}
            <div className="space-y-4">
                {phases.map(phase => (
                    <PhaseCard
                        phase={phase}
                        isExpanded={expandedPhases.has(phase.code)}
                        onToggle={() => togglePhase(phase.code)}
                        onTaskClick={(task) => setSelectedTask(task)}
                    />
                ))}
            </div>

            {/* Task Detail Modal */}
            <TaskModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                taskToEdit={selectedTask}
                projectId={project.id}
                onSave={(updatedTask) => {
                    console.log('Update task:', updatedTask);
                    // In a real app we would call updateTask API here
                    setSelectedTask(null);
                }}
            />
        </div>
    );
};

export default ProjectPlanTab;
