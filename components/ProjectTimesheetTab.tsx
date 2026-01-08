import React, { useState, useEffect } from 'react';
import { ProjectMember, TimesheetLog, Task } from '../types';
import { TimesheetService } from '../services/timesheet.service';
import { ProjectService } from '../services/project.service';
import { CostService } from '../services/cost.service';
import {
    Calendar, ChevronLeft, ChevronRight, Save, User,
    Calculator, CheckCircle2, Loader, AlertCircle, Plus, X
} from 'lucide-react';

interface ProjectTimesheetTabProps {
    projectId: string;
}

const ProjectTimesheetTab: React.FC<ProjectTimesheetTabProps> = ({ projectId }) => {
    const [loading, setLoading] = useState(true);
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [logs, setLogs] = useState<TimesheetLog[]>([]);
    const [selectableOptions, setSelectableOptions] = useState<{ id: string, label: string, taskId: string, subTaskId?: string }[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    // Period State
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());

    // Generating Days in Month
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Modal State
    const [selectedCell, setSelectedCell] = useState<{ empId: string, day: number } | null>(null);
    const [dailyLogs, setDailyLogs] = useState<TimesheetLog[]>([]); // Logs for selected cell
    const [newLogData, setNewLogData] = useState<{ taskId: string, subTaskId: string, hours: string, workType: string, description: string }>({
        taskId: '', subTaskId: '', hours: '', workType: 'Modeling', description: ''
    });

    useEffect(() => {
        loadData();
    }, [projectId, month, year]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [mems, timesheets, projectTasks] = await Promise.all([
                ProjectService.getProjectMembers(projectId),
                TimesheetService.getTimesheets(projectId, month, year),
                ProjectService.getProjectTasks(projectId)
            ]);
            const allowedRoles = ['NDH', 'TNDH', 'ĐPBM'];
            setMembers(mems.filter(m => allowedRoles.includes(m.projectRole || '')));
            setLogs(timesheets);

            // Filter tasks for "Modeling/Implementation" context
            const modelingTasks = projectTasks.filter(t =>
                t.status !== 'Hoàn thành' && (
                    t.name.includes('Dựng') ||
                    t.name.includes('Mô hình') ||
                    t.name.includes('Triển khai') ||
                    t.tags?.some(tag => ['Revit', 'Civil 3D', 'Tekla', 'Modeling', 'BIM'].includes(tag))
                )
            );
            setTasks(modelingTasks); // Keep parent tasks for reference

            // Flatten Sub-tasks for Dropdown
            const options: { id: string, label: string, taskId: string, subTaskId?: string }[] = [];
            modelingTasks.forEach(t => {
                if (t.subtasks && t.subtasks.length > 0) {
                    t.subtasks.forEach(st => {
                        options.push({
                            id: st.id,
                            label: `[${t.code}] ${st.title}`,
                            taskId: t.id,
                            subTaskId: st.id
                        });
                    });
                } else {
                    // Fallback if no subtasks defined yet, but it's a valid task
                    options.push({
                        id: t.id,
                        label: `[${t.code}] ${t.name}`,
                        taskId: t.id
                    });
                }
            });
            setSelectableOptions(options);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCellClick = (empId: string, day: number) => {
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const cellLogs = logs.filter(l => l.employeeId === empId && l.date === dateStr);
        setDailyLogs(cellLogs);
        setSelectedCell({ empId, day });

        // Reset New Log Form
        setNewLogData({ taskId: '', subTaskId: '', hours: '', workType: 'Modeling', description: '' });
    };

    const handleAddLog = async () => {
        if (!selectedCell) return;
        const hours = parseFloat(newLogData.hours);

        // Find selected item to get taskId and subTaskId matches
        // Actually newLogData.taskId currently stores the value of the select, which I'll set to the Option ID
        // Wait, if I set value={option.id}, I need to lookup the real taskId/subTaskId

        // Correction in flow below: I'll use a temporary state or just look it up.
        // Let's assume newLogData.subTaskId stores the "Option ID" which fits better.
        // CHANGED: newLogData.taskId will act as the "Selected Option ID" for the dropdown state

        const selectedOptionId = newLogData.taskId; // Using taskId state to hold selected option ID for simplicity of binding
        const selectedOption = selectableOptions.find(o => o.id === selectedOptionId);

        if (!selectedOption || isNaN(hours) || hours <= 0) {
            alert("Vui lòng chọn Công việc và nhập Số giờ hợp lệ.");
            return;
        }

        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${selectedCell.day.toString().padStart(2, '0')}`;

        try {
            const newLog = await TimesheetService.logTaskHours({
                projectId,
                employeeId: selectedCell.empId,
                date: dateStr,
                hours: hours,
                taskId: selectedOption.taskId,
                subTaskId: selectedOption.subTaskId,
                workType: newLogData.workType as any,
                description: newLogData.description || selectedOption.label
            });

            // Update UI
            setLogs(prev => [...prev, newLog]);
            setDailyLogs(prev => [...prev, newLog]);
            // clear form
            setNewLogData({ taskId: '', subTaskId: '', hours: '', workType: 'Modeling', description: '' });
        } catch (error: any) {
            alert(error.message || "Lỗi khi lưu giờ công");
        }
    };

    const handleDeleteLog = async (logId: string) => {
        if (!confirm("Xóa dòng chấm công này?")) return;
        await TimesheetService.deleteLog(logId);
        setLogs(prev => prev.filter(l => l.id !== logId));
        setDailyLogs(prev => prev.filter(l => l.id !== logId));
    };

    const getDailyTotal = (empId: string, day: number) => {
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const total = logs.filter(l => l.employeeId === empId && l.date === dateStr).reduce((sum, l) => sum + l.hours, 0);
        return total > 0 ? total : '';
    };

    const getTotalHours = (empId: string) => {
        return logs.filter(l => l.employeeId === empId).reduce((sum, l) => sum + l.hours, 0);
    };

    const handleGenerateSalary = async () => {
        if (!confirm(`Bạn có chắc muốn chốt công và tạo chi phí lương cho Tháng ${month}/${year}?`)) return;

        const report = await TimesheetService.getMonthlyReport(projectId, month, year);
        let createdCount = 0;

        for (const empId of Object.keys(report)) {
            const totalHours = report[empId];
            if (totalHours <= 0) continue;

            const member = members.find(m => m.employeeId === empId || m.id === empId); // Adjust based on ID match logic
            if (!member) continue;

            const rate = member.hourlyRate || 0;
            const amount = totalHours * rate;

            // Create Cost Item
            await CostService.createCost({
                projectId,
                category: 'Salary',
                salaryType: 'Internal',
                description: `Lương ${member.employee?.name} (Tháng ${month}/${year}) - Auto`,
                amount,
                date: new Date().toISOString().split('T')[0],
                status: 'Pending',
                spender: member.employee?.name || 'Unknown',
                personnelId: member.id, // Using the ProjectMember ID
                manHours: totalHours,
                hourlyRate: rate,
                notes: `Tự động tạo từ bảng chấm công: ${totalHours} giờ x ${rate}`
            });
            createdCount++;
        }

        alert(`Đã tạo thành công ${createdCount} khoản lương vào Tab Chi phí.`);
    };

    const changeMonth = (delta: number) => {
        let newMonth = month + delta;
        let newYear = year;
        if (newMonth > 12) { newMonth = 1; newYear++; }
        if (newMonth < 1) { newMonth = 12; newYear--; }
        setMonth(newMonth);
        setYear(newYear);
    };

    if (loading && members.length === 0) return <div className="p-12 text-center"><Loader className="animate-spin mx-auto" /> Loading Timesheet...</div>;

    const selectedMember = selectedCell ? members.find(m => m.employeeId === selectedCell.empId) : null;

    return (
        <div className="space-y-6 animate-fade-in bg-white p-6 rounded-xl border border-gray-200 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white rounded-md shadow-sm transition-all"><ChevronLeft size={20} /></button>
                    <div className="flex items-center gap-2 px-2">
                        <Calendar size={20} className="text-indigo-600" />
                        <span className="text-lg font-bold text-slate-800">Tháng {month}, {year}</span>
                    </div>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white rounded-md shadow-sm transition-all"><ChevronRight size={20} /></button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleGenerateSalary}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-md transition-colors"
                    >
                        <Calculator size={18} /> Chốt công & Tính lương
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-xs border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500">
                            <th className="p-3 border-b border-r border-gray-200 min-w-[200px] text-left">Nhân sự</th>
                            {daysArray.map(d => (
                                <th key={d} className={`p-1 border-b border-r border-gray-200 w-10 text-center ${[0, 6].includes(new Date(year, month - 1, d).getDay()) ? 'bg-amber-50 text-amber-700' : ''}`}>
                                    {d}
                                </th>
                            ))}
                            <th className="p-3 border-b border-gray-200 min-w-[80px] bg-indigo-50 text-indigo-700 font-bold text-center">Tổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(mem => (
                            <tr key={mem.id} className="hover:bg-slate-50 group transition-colors">
                                <td className="p-2 border-b border-r border-gray-200 font-medium text-slate-700 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden">
                                        {mem.employee?.avatar ? <img src={mem.employee.avatar} alt="" className="w-full h-full object-cover" /> : <User size={14} />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span>{mem.employee?.name}</span>
                                        <span className="text-[10px] text-gray-400 font-normal">{mem.projectRole}</span>
                                    </div>
                                </td>
                                {daysArray.map(d => {
                                    const total = getDailyTotal(mem.employeeId, d);
                                    let cellClass = "cursor-pointer hover:bg-indigo-50 transition-colors";
                                    if (typeof total === 'number') {
                                        if (total >= 8) cellClass += " bg-emerald-100 text-emerald-700 font-bold";
                                        else if (total > 0) cellClass += " bg-yellow-50 text-yellow-700";
                                    }

                                    return (
                                        <td
                                            key={d}
                                            className={`p-0 border-b border-r border-gray-200 text-center relative ${cellClass}`}
                                            onClick={() => handleCellClick(mem.employeeId, d)}
                                        >
                                            <div className="py-2.5">{total}</div>
                                        </td>
                                    );
                                })}
                                <td className="p-2 border-b border-gray-200 text-center font-bold text-indigo-700 bg-indigo-50/30">
                                    {getTotalHours(mem.employeeId)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
                <AlertCircle size={16} className="text-blue-600" />
                <span>Click vào ô ngày để nhập chi tiết công việc. Màu xanh: &ge;8h, Màu vàng: &lt;8h.</span>
            </div>

            {/* TASK LOGGING MODAL */}
            {selectedCell && selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Chấm công Task</h3>
                                <p className="text-xs text-gray-500">
                                    {selectedMember.employee?.name} - Ngày {selectedCell.day}/{month}/{year}
                                </p>
                            </div>
                            <button onClick={() => setSelectedCell(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Existing Logs List */}
                            <div className="bg-slate-50 rounded-lg p-3 border border-gray-200 space-y-2 max-h-[150px] overflow-y-auto">
                                <h4 className="text-xs font-bold text-gray-500 uppercase">Đã ghi nhận</h4>
                                {dailyLogs.length > 0 ? dailyLogs.map(log => (
                                    <div key={log.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm border border-gray-100 text-sm">
                                        <div>
                                            <div className="font-bold text-slate-700">{log.workType} ({log.hours}h)</div>
                                            <div className="text-xs text-gray-500 truncate max-w-[200px]">
                                                {tasks.find(t => t.id === log.taskId)?.name || log.description || 'N/A'}
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteLog(log.id)} className="text-rose-500 hover:bg-rose-50 p-1 rounded"><X size={14} /></button>
                                    </div>
                                )) : <div className="text-xs text-gray-400 italic">Chưa có giờ công nào trong ngày này.</div>}
                            </div>

                            {/* Add New Log Form */}
                            <div className="border-t border-gray-100 pt-4 space-y-3">
                                <h4 className="text-xs font-bold text-indigo-600 uppercase">Thêm giờ công mới</h4>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Chọn Task / Đầu việc</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={newLogData.taskId}
                                        onChange={e => setNewLogData({ ...newLogData, taskId: e.target.value })}
                                    >
                                        <option value="">-- Chọn công việc (Sub-task) --</option>
                                        {selectableOptions.map(opt => (
                                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Số giờ</label>
                                        <input
                                            type="number" min="0" max="24" step="0.5"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold"
                                            value={newLogData.hours}
                                            onChange={e => setNewLogData({ ...newLogData, hours: e.target.value })}
                                            placeholder="VD: 4"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Loại công việc</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            value={newLogData.workType}
                                            onChange={e => setNewLogData({ ...newLogData, workType: e.target.value })}
                                        >
                                            <option value="Modeling">Dựng hình</option>
                                            <option value="Review">Kiểm tra / Review</option>
                                            <option value="Meeting">Họp / Phối hợp</option>
                                            <option value="Coordination">Coordination</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1">Ghi chú (Tùy chọn)</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        value={newLogData.description}
                                        onChange={e => setNewLogData({ ...newLogData, description: e.target.value })}
                                        placeholder="Note chi tiết..."
                                    />
                                </div>

                                <button
                                    onClick={handleAddLog}
                                    className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
                                >
                                    <Plus size={16} /> Lưu giờ công
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectTimesheetTab;
