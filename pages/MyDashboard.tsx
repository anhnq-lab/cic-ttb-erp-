
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import {
    Briefcase, CheckCircle, Clock, AlertTriangle,
    Calendar, TrendingUp, User, Activity, List,
    MessageSquare, Award,
    CalendarOff, ShoppingCart, Car, Save, // Added imports for Requests
    Plane // Added for Business Trip
} from 'lucide-react';
import BusinessTripModal from '../components/BusinessTripModal'; // Import Modal
import { ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { PROJECTS, MOCK_USERS } from '../constants';
import { ProjectService } from '../services/project.service';
import { TimesheetService } from '../services/timesheet.service';
import { AIService } from '../services/AIService';

const KPI_DATA = [
    { name: 'Hoàn thành', value: 85, color: '#10b981' },
    { name: 'Chưa hoàn thành', value: 15, color: '#f43f5e' }
];

const PERFORMANCE_DATA = [
    { month: 'T1', score: 80 }, { month: 'T2', score: 82 },
    { month: 'T3', score: 85 }, { month: 'T4', score: 78 },
    { month: 'T5', score: 88 }, { month: 'T6', score: 90 },
];

const StatCard = ({ label, value, subtext, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${color} bg-opacity-20`}>
            <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
        <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
            <h3 className="text-2xl font-black text-slate-800">{value}</h3>
            {subtext && <p className="text-xs text-emerald-600 font-bold mt-1">{subtext}</p>}
        </div>
    </div>
);

import TaskModal from '../components/TaskModal'; // Import TaskModal

const MyDashboard = () => {
    const [greeting, setGreeting] = useState('');
    const [myTasks, setMyTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Task Modal State
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Chào buổi sáng');
        else if (hour < 18) setGreeting('Chào buổi chiều');
        else setGreeting('Chào buổi tối');

        fetchMyTasks();
    }, []);

    const fetchMyTasks = async () => {
        setIsLoading(true);
        try {
            const allTasks = await ProjectService.getAllTasks();
            // Mock: Filter tasks for 'u1' (Nguyen Van A) or show recent ones
            const currentUserTasks = allTasks.filter(t => t.assignee?.id === 'u1' || t.assignee?.name === 'Nguyễn Văn A');
            setMyTasks(currentUserTasks.length > 0 ? currentUserTasks : allTasks.slice(0, 5));
        } catch (error) {
            console.error("Error fetching my tasks", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTaskClick = (task: any) => {
        setSelectedTask(task);
        setIsTaskModalOpen(true);
    };

    const handleSaveTask = async (updatedTask: any) => {
        await ProjectService.updateTask(updatedTask);
        fetchMyTasks();
        setIsTaskModalOpen(false);
    };

    return (
        <div className="flex-1 bg-gray-50 min-h-screen pb-12">
            <Header title="Dashboard Cá nhân" breadcrumb="Trang chủ / Cá nhân" />

            <div className="w-full mx-auto px-4 md:px-8 py-6">

                {/* Welcome Section */}
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">{greeting}, Nguyễn Văn A!</h1>
                        <p className="text-gray-500">Chúc bạn một ngày làm việc hiệu quả. Dưới đây là tổng quan công việc của bạn.</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">KPI tháng này</p>
                        <p className="text-4xl font-black text-orange-600">92/100</p>
                    </div>
                </div>

                {/* AI Executive Report (NEW) */}
                <div className="mb-8 bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Activity size={100} />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                <Award size={14} className="text-amber-400" /> CIC Intelligence Report
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <h3 className="text-2xl font-black mb-1">Tổng quan Portfolio</h3>
                                <p className="text-indigo-200 text-sm mb-4">Dữ liệu phân tích từ {PROJECTS.length} dự án</p>
                                <div className="flex gap-4">
                                    <div>
                                        <p className="text-xs text-indigo-300 font-bold uppercase">Tổng ngân sách</p>
                                        <p className="text-xl font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumSignificantDigits: 3 }).format(AIService.generateExecutiveReport(PROJECTS).totalBudget)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-300 font-bold uppercase">Tiến độ TB</p>
                                        <p className="text-xl font-bold text-emerald-400">{AIService.generateExecutiveReport(PROJECTS).avgProgress.toFixed(1)}%</p>
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-2 bg-white/5 rounded-xl p-4 border border-white/10">
                                <h4 className="font-bold text-sm text-indigo-100 mb-2 flex items-center gap-2">
                                    <AlertTriangle size={16} className="text-orange-400" /> Cảnh báo rủi ro & Insight
                                </h4>
                                <ul className="space-y-2">
                                    {AIService.generateExecutiveReport(PROJECTS).topRisks.length > 0 ? (
                                        AIService.generateExecutiveReport(PROJECTS).topRisks.map((risk, idx) => (
                                            <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                                                {risk}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-slate-300 italic">Hiện chưa phát hiện rủi ro trọng yếu nào.</li>
                                    )}
                                    <li className="text-sm text-slate-300 flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                                        Dự báo: Dòng tiền tháng tới cần chuẩn bị {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumSignificantDigits: 3 }).format(AIService.generateExecutiveReport(PROJECTS).cashFlowForecast[0].value)}.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        label="Việc cần làm"
                        value={myTasks.filter(t => t.status !== 'Hoàn thành' && t.status !== 'Completed').length.toString()}
                        subtext="3 task quá hạn"
                        icon={List}
                        color="text-blue-600 bg-blue-100"
                    />
                    <StatCard
                        label="Đã hoàn thành"
                        value="12"
                        subtext="+2 so với tuần trước"
                        icon={CheckCircle}
                        color="text-emerald-600 bg-emerald-100"
                    />
                    <StatCard
                        label="Giờ làm việc"
                        value="38.5h"
                        subtext="Tuần này"
                        icon={Clock}
                        color="text-orange-600 bg-orange-100"
                    />
                    <StatCard
                        label="Hiệu suất"
                        value="Top 10%"
                        subtext="Trên toàn trung tâm"
                        icon={Award}
                        color="text-purple-600 bg-purple-100"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* My Tasks List */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                    <Briefcase className="text-blue-600" size={20} /> Danh sách công việc
                                </h3>
                                <button className="text-sm font-bold text-blue-600 hover:text-blue-700">Xem tất cả</button>
                            </div>
                            <div className="space-y-4">
                                {isLoading ? (
                                    <div className="text-center py-4 text-gray-400">Đang tải công việc...</div>
                                ) : myTasks.length === 0 ? (
                                    <div className="text-center py-4 text-gray-400">Không có công việc nào.</div>
                                ) : myTasks.map((task) => (
                                    <div key={task.id}
                                        onClick={() => handleTaskClick(task)}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-2 h-12 rounded-full ${task.priority === 'High' || task.priority === 'Cao' ? 'bg-rose-500' :
                                                task.priority === 'Medium' || task.priority === 'Trung bình' ? 'bg-orange-500' : 'bg-emerald-500'
                                                }`}></div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{task.name}</h4>
                                                <div className="flex gap-3 text-xs text-gray-500 mt-1">
                                                    <span className="flex items-center gap-1"><Briefcase size={12} /> {task.projectName || task.projectCode}</span>
                                                    <span className={`flex items-center gap-1 font-bold ${new Date(task.dueDate || task.deadline) < new Date() ? 'text-rose-500' : 'text-gray-500'}`}>
                                                        <Calendar size={12} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString('vi-VN') : 'K/XĐ'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${task.status === 'Completed' || task.status === 'Hoàn thành' ? 'bg-emerald-100 text-emerald-700' :
                                                task.status === 'In Progress' || task.status === 'Đang thực hiện' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                                <Activity className="text-orange-600" size={20} /> Hoạt động gần đây
                            </h3>
                            <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                                <div className="relative">
                                    <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"></span>
                                    <p className="text-sm text-gray-500 mb-1">10:30 AM - Hôm nay</p>
                                    <p className="text-gray-800 font-medium">Bạn đã cập nhật trạng thái <span className="font-bold">Task #009</span> sang <span className="text-blue-600 font-bold">Review</span></p>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm"></span>
                                    <p className="text-sm text-gray-500 mb-1">09:15 AM - Hôm nay</p>
                                    <p className="text-gray-800 font-medium">Bạn đã hoàn thành báo cáo tuần</p>
                                </div>
                                <div className="relative">
                                    <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-purple-500 border-2 border-white shadow-sm"></span>
                                    <p className="text-sm text-gray-500 mb-1">16:45 PM - Hôm qua</p>
                                    <p className="text-gray-800 font-medium">Được thêm vào dự án <span className="font-bold">Cao tốc Bắc Nam</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KPI & Calendar Sidebar */}
                    <div className="space-y-8">
                        {/* Overall KPI Chart */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <h3 className="font-bold text-lg text-slate-800 mb-2">KPI Tổng quan</h3>
                            <div className="h-48 w-full flex justify-center py-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={KPI_DATA}
                                            innerRadius={50}
                                            outerRadius={70}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {KPI_DATA.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                    <span>Hoàn thành ({KPI_DATA[0].value}%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                                    <span>Còn lại ({KPI_DATA[1].value}%)</span>
                                </div>
                            </div>
                        </div>

                        {/* Performance Trend */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
                            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                                <TrendingUp className="text-orange-400" size={20} /> Xu hướng hiệu suất
                            </h3>
                            <p className="text-xs text-slate-400 mb-6">Điểm đánh giá 6 tháng gần nhất</p>
                            <div className="h-32 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={PERFORMANCE_DATA}>
                                        <Line type="monotone" dataKey="score" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#fff' }} />
                                        <XAxis dataKey="month" hide />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                            itemStyle={{ color: '#fb923c' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Upcoming Events */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <h3 className="font-bold text-lg text-slate-800 mb-4">Lịch sắp tới</h3>
                            <div className="space-y-4">
                                <div className="flex gap-4 items-start">
                                    <div className="flex flex-col items-center bg-orange-50 text-orange-600 rounded-lg p-2 min-w-[50px]">
                                        <span className="text-xs font-bold uppercase">Th.1</span>
                                        <span className="text-xl font-black">15</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">Họp giao ban tuần</p>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Clock size={10} /> 08:30 - 09:30</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="flex flex-col items-center bg-blue-50 text-blue-600 rounded-lg p-2 min-w-[50px]">
                                        <span className="text-xs font-bold uppercase">Th.1</span>
                                        <span className="text-xl font-black">18</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">Review thiết kế với CĐT</p>
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Clock size={10} /> 14:00 - 16:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* --- PROPOSALS & REQUESTS SECTION (MOVED FROM HRM) --- */}
                <div className="mt-8">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                            <MessageSquare className="text-orange-600" size={20} /> Đề xuất & Dịch vụ hành chính
                        </h3>
                        <RequestTab myTasks={myTasks} />
                    </div>
                </div>
            </div>

            {isTaskModalOpen && (
                <TaskModal
                    isOpen={isTaskModalOpen}
                    onClose={() => setIsTaskModalOpen(false)}
                    onSave={handleSaveTask}
                    projectId={selectedTask?.projectId || ''}
                    taskToEdit={selectedTask}
                />
            )}
        </div>
    );
};

// --- REQUEST TAB COMPONENT (MOVED FROM HRMList.tsx) ---
const RequestTab = ({ myTasks }: { myTasks: any[] }) => {
    const [requestType, setRequestType] = useState('timesheet'); // timesheet, leave, purchase, vehicle
    const [showBusinessTripModal, setShowBusinessTripModal] = useState(false);

    // Timesheet State
    const [timesheetType, setTimesheetType] = useState<'normal' | 'ot'>('normal');
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState('');
    const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
    const [logHours, setLogHours] = useState<string>('8');
    const [logWorkType, setLogWorkType] = useState('Modeling');
    const [logDesc, setLogDesc] = useState('');

    const handleSaveTimesheet = async () => {
        if (!selectedProject || !selectedTaskId || !logHours) {
            alert("Vui lòng nhập đầy đủ thông tin: Dự án, Công việc và Số giờ.");
            return;
        }

        try {
            await TimesheetService.logTaskHours({
                projectId: selectedProject,
                employeeId: 'u1', // Hardcoded as current user 'u1' (Nguyen Van A)
                date: logDate,
                hours: parseFloat(logHours),
                taskId: selectedTaskId,
                workType: logWorkType as any,
                description: logDesc + (timesheetType === 'ot' ? ' (OT)' : '')
            });
            alert("Đã lưu chấm công thành công! Dữ liệu đã được cập nhật vào bảng công dự án.");
            setLogDesc(''); // Clear description
        } catch (error: any) {
            alert("Lỗi: " + error.message);
        }
    };

    const handleSubmit = (type: string) => {
        // Mock submission
        if (type === 'timesheet') {
            handleSaveTimesheet();
        } else {
            alert(`Đã gửi yêu cầu "${type === 'leave' ? 'Xin nghỉ phép' : type === 'purchase' ? 'Mua sắm' : 'Đặt xe'}" thành công!`);
        }
        // Reset or redirect logic here if needed
    };

    const filteredTasks = selectedProject ? myTasks.filter(t => t.projectId === selectedProject || t.projectName === selectedProject) : myTasks;

    return (
        <div className="flex flex-col md:flex-row gap-6 h-full">
            {showBusinessTripModal && <BusinessTripModal onClose={() => setShowBusinessTripModal(false)} />}

            {/* Sidebar Menu for Requests */}
            <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                <button
                    onClick={() => setRequestType('timesheet')}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${requestType === 'timesheet' ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <Clock size={18} /> Chấm công
                </button>

                <button
                    onClick={() => setShowBusinessTripModal(true)}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 transition-colors bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-md hover:shadow-lg mb-4"
                >
                    <Plane size={18} className="text-orange-400" /> Lập Kế hoạch Công tác
                </button>

                <button
                    onClick={() => setRequestType('leave')}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${requestType === 'leave' ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <CalendarOff size={18} /> Xin nghỉ phép
                </button>
                <button
                    onClick={() => setRequestType('purchase')}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${requestType === 'purchase' ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <ShoppingCart size={18} /> Đề xuất mua sắm
                </button>
                <button
                    onClick={() => setRequestType('vehicle')}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors ${requestType === 'vehicle' ? 'bg-orange-50 text-orange-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    <Car size={18} /> Đặt xe công tác
                </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">

                {requestType === 'timesheet' && (
                    <div className="space-y-4 animate-fade-in-up">
                        <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Clock size={20} /></div>
                                <h3 className="font-bold text-gray-800">Chấm công & Báo cáo giờ làm</h3>
                            </div>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setTimesheetType('normal')}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${timesheetType === 'normal' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Ngày thường
                                </button>
                                <button
                                    onClick={() => setTimesheetType('ot')}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${timesheetType === 'ot' ? 'bg-white shadow text-rose-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Làm thêm giờ
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dự án</label>
                                <select
                                    className="w-full p-2 border rounded-lg text-sm bg-white"
                                    value={selectedProject}
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                >
                                    <option value="">-- Chọn dự án --</option>
                                    {PROJECTS.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Công việc / Task</label>
                                <select
                                    className="w-full p-2 border rounded-lg text-sm bg-white"
                                    value={selectedTaskId}
                                    onChange={(e) => setSelectedTaskId(e.target.value)}
                                >
                                    <option value="">-- Chọn công việc --</option>
                                    {filteredTasks.map((t: any) => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded-lg text-sm"
                                    value={logDate}
                                    onChange={(e) => setLogDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số giờ</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded-lg text-sm"
                                    placeholder="VD: 8"
                                    value={logHours}
                                    onChange={(e) => setLogHours(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Loại hình</label>
                                <select
                                    className="w-full p-2 border rounded-lg text-sm bg-white"
                                    value={logWorkType}
                                    onChange={(e) => setLogWorkType(e.target.value)}
                                >
                                    <option value="Modeling">Dựng hình / Modeling</option>
                                    <option value="Meeting">Họp / Meeting</option>
                                    <option value="Review">Kiểm soát / Review</option>
                                    <option value="Other">Khác</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mô tả công việc</label>
                            <textarea
                                className="w-full p-2 border rounded-lg text-sm h-24"
                                placeholder="Mô tả chi tiết công việc đã làm..."
                                value={logDesc}
                                onChange={(e) => setLogDesc(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => handleSubmit('timesheet')}
                                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md flex items-center gap-2">
                                <Save size={16} /> Lưu chấm công
                            </button>
                        </div>
                    </div>
                )}

                {requestType === 'leave' && (
                    <div className="space-y-4 animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-3">
                            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><CalendarOff size={20} /></div>
                            <h3 className="font-bold text-gray-800">Tạo đơn xin nghỉ phép</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Loại nghỉ</label>
                                <select className="w-full p-2 border rounded-lg text-sm bg-white"><option>Nghỉ phép năm</option><option>Nghỉ ốm</option><option>Nghỉ không lương</option></select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số ngày</label>
                                <input type="number" className="w-full p-2 border rounded-lg text-sm" placeholder="1" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Từ ngày</label>
                                <input type="date" className="w-full p-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Đến ngày</label>
                                <input type="date" className="w-full p-2 border rounded-lg text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lý do</label>
                            <textarea className="w-full p-2 border rounded-lg text-sm h-24" placeholder="Nhập lý do nghỉ..."></textarea>
                        </div>
                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => handleSubmit('leave')}
                                className="px-6 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 shadow-md flex items-center gap-2">
                                <Save size={16} /> Gửi đơn
                            </button>
                        </div>
                    </div>
                )}

                {requestType === 'purchase' && (
                    <div className="space-y-4 animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><ShoppingCart size={20} /></div>
                            <h3 className="font-bold text-gray-800">Đề xuất mua sắm thiết bị</h3>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tên thiết bị / Vật tư</label>
                            <input type="text" className="w-full p-2 border rounded-lg text-sm" placeholder="VD: Màn hình Dell UltraSharp..." />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số lượng</label>
                                <input type="number" className="w-full p-2 border rounded-lg text-sm" placeholder="1" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Đơn giá dự kiến (VNĐ)</label>
                                <input type="text" className="w-full p-2 border rounded-lg text-sm" placeholder="5.000.000" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mục đích sử dụng</label>
                            <textarea className="w-full p-2 border rounded-lg text-sm h-24" placeholder="Giải trình mục đích..."></textarea>
                        </div>
                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => handleSubmit('purchase')}
                                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md flex items-center gap-2">
                                <Save size={16} /> Gửi đề xuất
                            </button>
                        </div>
                    </div>
                )}

                {requestType === 'vehicle' && (
                    <div className="space-y-4 animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-3">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Car size={20} /></div>
                            <h3 className="font-bold text-gray-800">Đăng ký sử dụng xe công ty</h3>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Điểm đến</label>
                            <input type="text" className="w-full p-2 border rounded-lg text-sm" placeholder="VD: Công trường VinHomes Ocean Park..." />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày đi</label>
                                <input type="date" className="w-full p-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Giờ xuất phát</label>
                                <input type="time" className="w-full p-2 border rounded-lg text-sm" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số người</label>
                                <input type="number" className="w-full p-2 border rounded-lg text-sm" placeholder="4" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Loại xe đề xuất</label>
                                <select className="w-full p-2 border rounded-lg text-sm bg-white"><option>Xe 4 chỗ</option><option>Xe 7 chỗ</option></select>
                            </div>
                        </div>
                        <div className="pt-2 flex justify-end">
                            <button
                                onClick={() => handleSubmit('vehicle')}
                                className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-md flex items-center gap-2">
                                <Save size={16} /> Đặt xe
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyDashboard;
