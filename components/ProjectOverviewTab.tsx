import React from 'react';
import { Project, Task, ProjectMember, Contract } from '../types';
import {
    Activity, TrendingUp, AlertTriangle, CheckCircle2,
    Clock, DollarSign, Users, Briefcase, ChevronRight, User as UserIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface ProjectOverviewTabProps {
    project: Project;
    tasks: Task[];
    members: ProjectMember[];
    contracts: Contract[];
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const StatCard = ({ title, value, subValue, icon: Icon, colorClass, bgClass }: any) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h3>
            {subValue && <p className={`text-xs font-medium mt-1 ${colorClass}`}>{subValue}</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgClass}`}>
            {Icon && <Icon size={24} className={colorClass.replace('text-', 'text-')} />}
        </div>
    </div>
);

const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({ project, tasks = [], members = [], contracts = [] }) => {
    if (!project) return <div className="p-4 text-center text-gray-400">Đang tải dữ liệu tổng quan...</div>;

    // Calculations
    const totalBudget = contracts.reduce((sum, c) => sum + c.totalValue, 0) || project.budget || 0;
    const spentBudget = project.spent || 0; // Mock spent
    const completedTasks = tasks.filter(t => t.status === 'Hoàn thành' || t.status === 'Completed').length;
    const delayedTasks = tasks.filter(t => t.status === 'Delayed' || (new Date(t.dueDate) < new Date() && t.status !== 'Hoàn thành')).length;
    const totalTasks = tasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const activeRisks = 3; // Mock
    const riskLevel = 'Thấp';

    const recentTasks = [...tasks].sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return dateB - dateA;
    }).slice(0, 5);

    const taskStatusData = [
        { name: 'Hoàn thành', value: completedTasks, color: '#10b981' },
        { name: 'Đang làm', value: totalTasks - completedTasks - delayedTasks, color: '#3b82f6' },
        { name: 'Chậm', value: delayedTasks, color: '#f43f5e' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* 1. Key Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Tiến độ tổng thể"
                    value={`${project.progress}%`}
                    subValue={`${completionRate}% công việc hoàn thành`}
                    icon={TrendingUp}
                    colorClass="text-emerald-600"
                    bgClass="bg-emerald-100"
                />
                <StatCard
                    title="Ngân sách / Hợp đồng"
                    value={formatCurrency(totalBudget)}
                    subValue={`Đã chi: ${formatCurrency(spentBudget)}`}
                    icon={DollarSign}
                    colorClass="text-blue-600"
                    bgClass="bg-blue-100"
                />
                <StatCard
                    title="Nhân sự tham gia"
                    value={`${members.length}`}
                    subValue="Đang hoạt động"
                    icon={Users}
                    colorClass="text-purple-600"
                    bgClass="bg-purple-100"
                />
                <StatCard
                    title="Vấn đề / Rủi ro"
                    value={`${activeRisks}`}
                    subValue={`Mức độ: ${riskLevel}`}
                    icon={AlertTriangle}
                    colorClass="text-amber-600"
                    bgClass="bg-amber-100"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2. Left Column: Task Status & Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Task Overview */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Activity size={20} className="text-indigo-600" /> Trạng thái công việc
                            </h3>
                            <div className="flex gap-2">
                                {taskStatusData.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        {item.name} ({item.value})
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Tasks List */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Hoạt động gần đây</h4>
                            {recentTasks.length > 0 ? recentTasks.map(task => (
                                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-indigo-50 hover:border-indigo-100 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${task.status === 'Hoàn thành' ? 'bg-emerald-100 text-emerald-600' :
                                            task.status === 'Delayed' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {(task.code || 'T').split('.').pop()}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700 text-sm">{task.name}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <UserIcon size={10} /> {task.assignee?.name || 'Unassigned'} •
                                                <Clock size={10} /> {task.dueDate || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${task.status === 'Hoàn thành' ? 'bg-emerald-200 text-emerald-800' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                        {task.status}
                                    </span>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-400 italic">Chưa có công việc nào.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3. Right Column: Charts & Quick Actions */}
                <div className="space-y-6">
                    {/* Project Information Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-slate-800 uppercase mb-4 border-b border-gray-100 pb-2">
                            Thông tin dự án
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mã dự án</p>
                                <p className="text-sm font-bold text-slate-700">{project.code}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tên dự án</p>
                                <p className="text-sm font-semibold text-slate-700">{project.name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Địa điểm</p>
                                <p className="text-sm font-medium text-slate-700">{project.location}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nguồn vốn</p>
                                    <p className="text-sm font-medium text-slate-700">
                                        {project.capitalSource === 'StateBudget' ? 'Ngân sách' : 'Ngoài NS'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Trạng thái</p>
                                    <p className="text-sm font-medium text-slate-700">{project.status}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Khách hàng</p>
                                <p className="text-sm font-medium text-slate-700">{project.client}</p>
                            </div>
                            {project.deadline && (
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Deadline</p>
                                    <p className="text-sm font-medium text-slate-700">{project.deadline}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Chart */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center">
                        <h3 className="text-sm font-bold text-slate-800 uppercase mb-4 self-start w-full border-b border-gray-100 pb-2">
                            Biểu đồ công việc
                        </h3>
                        <div className="w-40 h-40 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={taskStatusData}
                                        innerRadius={35}
                                        outerRadius={55}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {taskStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <span className="text-2xl font-black text-slate-800">{totalTasks}</span>
                                <span className="text-[10px] text-gray-400 uppercase">Tasks</span>
                            </div>
                        </div>
                    </div>

                    {/* Cost Chart */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center">
                        <h3 className="text-sm font-bold text-slate-800 uppercase mb-4 self-start w-full border-b border-gray-100 pb-2">
                            Chi phí dự án
                        </h3>
                        <div className="w-full h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Ngân sách', value: totalBudget, color: '#3b82f6' },
                                    { name: 'Thực chi', value: spentBudget, color: '#f97316' }
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} />
                                    <YAxis hide />
                                    <RechartsTooltip
                                        formatter={(value: number) => formatCurrency(value)}
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {
                                            [{ name: 'Ngân sách', value: totalBudget, color: '#3b82f6' }, { name: 'Thực chi', value: spentBudget, color: '#f97316' }].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))
                                        }
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full mt-2 flex justify-between text-xs">
                            <div>
                                <span className="block text-gray-400">Ngân sách</span>
                                <span className="font-bold text-blue-600">{formatCurrency(totalBudget)}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-gray-400">Đã chi</span>
                                <span className="font-bold text-orange-600">{formatCurrency(spentBudget)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="bg-indigo-600 rounded-2xl shadow-lg p-5 text-white">
                        <h3 className="font-bold mb-2 flex items-center gap-2">
                            <Briefcase size={18} /> Truy cập nhanh
                        </h3>
                        <p className="text-indigo-100 text-xs mb-4">Các lối tắt quản lý dự án.</p>
                        <div className="space-y-2">
                            <button className="w-full text-left px-3 py-2 bg-indigo-700/50 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors flex justify-between items-center group">
                                Xem báo cáo tuần <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button className="w-full text-left px-3 py-2 bg-indigo-700/50 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors flex justify-between items-center group">
                                Phê duyệt chi phí <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button className="w-full text-left px-3 py-2 bg-indigo-700/50 hover:bg-indigo-700 rounded-lg text-sm font-medium transition-colors flex justify-between items-center group">
                                Quản lý rủi ro <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectOverviewTab;
