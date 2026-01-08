import React, { useState, useEffect } from 'react';
import { Task, Employee, TaskPriority, TaskStatus } from '../types';
import { X, Sparkles, User, Users, Calendar, Tag, AlertCircle, Check, Trash2, MessageSquare, Paperclip, Send, FileText, Download, CheckSquare, Plus, ClipboardCheck, CheckCircle } from 'lucide-react';
import { ProjectService } from '../services/project.service';
import { AIService, ResourceRecommendation } from '../services/AIService';
import { EMPLOYEES } from '../constants';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Partial<Task>) => void;
    onDelete?: (taskId: string) => void;
    projectId: string;
    employees?: Employee[];
    taskToEdit?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, onDelete, projectId, employees = EMPLOYEES, taskToEdit }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'comments' | 'files' | 'checklist'>('info');
    const [taskName, setTaskName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assigneeId, setAssigneeId] = useState('');
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
    const [status, setStatus] = useState<string>(TaskStatus.OPEN);

    // Mock Data for new features
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [attachments, setAttachments] = useState<any[]>([]);
    const [subtasks, setSubtasks] = useState<{ id: string, title: string, completed: boolean }[]>([]);
    const [newSubtask, setNewSubtask] = useState('');

    // Checklist State
    const [checklists, setChecklists] = useState<any[]>([]);
    const [selectedChecklistId, setSelectedChecklistId] = useState<string>('');
    const [checklistLogs, setChecklistLogs] = useState<Record<string, boolean>>({});

    const [showRecommendations, setShowRecommendations] = useState(false);
    const [recommendations, setRecommendations] = useState<ResourceRecommendation[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (taskToEdit) {
                setTaskName(taskToEdit.name);
                setDueDate(taskToEdit.dueDate || '');
                setPriority(taskToEdit.priority as TaskPriority);
                setStatus(taskToEdit.status || TaskStatus.OPEN);
                // Find assignee based on name if ID not present (legacy mock data issue)
                // Ideally task should have assigneeId. Here we check by name match to sync with EMPLOYEES
                const emp = employees.find(e => e.name === taskToEdit.assignee?.name);
                setAssigneeId(emp ? emp.id : '');

                // Load existing or mock comments/files
                setComments(taskToEdit.comments || [
                    { id: '1', userName: 'Nguyễn Hoàng Hà', userAvatar: 'https://i.pravatar.cc/150?u=1', content: 'Lưu ý kiểm tra kỹ cao độ trần nhé.', createdAt: '2 giờ trước' }
                ]);
                setAttachments(taskToEdit.attachments || [
                    { id: '1', name: 'Ban_ve_tang_1.pdf', size: '2.4 MB', type: 'pdf', uploadedBy: 'Vũ Văn Hòa', uploadedAt: 'Yesterday' }
                ]);
                setSubtasks(taskToEdit.subtasks || [
                    { id: '1', title: 'Kiểm tra bản vẽ kiến trúc', completed: true },
                    { id: '2', title: 'Dựng cột vách tầng 1', completed: false },
                    { id: '3', title: 'Dựng dầm sàn tầng 1', completed: false }
                ]);
            } else {
                // Reset for new task
                setTaskName('');
                setDueDate('');
                setPriority(TaskPriority.MEDIUM);
                setStatus(TaskStatus.OPEN);
                setAssigneeId('');
                setComments([]);
                setAttachments([]);
                setSubtasks([]);
                setSelectedChecklistId('');
                setChecklistLogs({});
            }
            setActiveTab('info');
            loadChecklists();
        }
    }, [isOpen, taskToEdit, employees]);

    const loadChecklists = async () => {
        const [allChecklists, logs] = await Promise.all([
            ProjectService.getQualityChecklists(),
            taskToEdit ? ProjectService.getTaskChecklistLogs(taskToEdit.id) : Promise.resolve([])
        ]);
        setChecklists(allChecklists);

        const logMap: Record<string, boolean> = {};
        logs.forEach((l: any) => {
            logMap[l.item_id] = l.status === 'Completed';
            if (l.checklist_id && !selectedChecklistId) setSelectedChecklistId(l.checklist_id);
        });
        setChecklistLogs(logMap);
    };

    const handleCheckItem = async (itemId: string, isChecked: boolean) => {
        if (!taskToEdit || !selectedChecklistId) return;
        setChecklistLogs(prev => ({ ...prev, [itemId]: isChecked }));
        await ProjectService.updateChecklistLog({
            taskId: taskToEdit.id,
            checklistId: selectedChecklistId,
            itemId: itemId,
            status: isChecked,
            checkedBy: 'u1' // Mock ID
        });
    };

    const currentChecklist = checklists.find(c => c.id === selectedChecklistId);
    const checklistItems = currentChecklist ? (typeof currentChecklist.items === 'string' ? JSON.parse(currentChecklist.items) : currentChecklist.items) : [];

    const checklistProgress = checklistItems.length > 0
        ? Math.round((checklistItems.filter((i: any) => checklistLogs[i.id]).length / checklistItems.length) * 100)
        : 0;

    if (!isOpen) return null;

    const handleRecommend = () => {
        if (!taskName) return;

        const dummyTask = {
            name: taskName,
            assignee: { role: 'Modeler' }
        } as any;

        const recs = AIService.recommendResources(dummyTask, employees);
        setRecommendations(recs);
        setShowRecommendations(true);
    };

    const handleSelectRecommendation = (empId: string) => {
        setAssigneeId(empId);
        setShowRecommendations(false);
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        setComments([...comments, {
            id: Date.now().toString(),
            userName: 'Bạn',
            userAvatar: 'https://i.pravatar.cc/150?u=99',
            content: newComment,
            createdAt: 'Vừa xong'
        }]);
        setNewComment('');
    };

    const handleAddSubtask = () => {
        if (!newSubtask.trim()) return;
        setSubtasks([...subtasks, {
            id: Date.now().toString(),
            title: newSubtask,
            completed: false
        }]);
        setNewSubtask('');
    };

    const toggleSubtask = (id: string) => {
        setSubtasks(subtasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st));
    };

    const deleteSubtask = (id: string) => {
        setSubtasks(subtasks.filter(st => st.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // CHECKLIST VALIDATION
        if ((status === 'Completed' || status === 'Hoàn thành' || status === 'Review') && selectedChecklistId) {
            const allChecked = checklistItems.every((item: any) => checklistLogs[item.id]);
            if (!allChecked) {
                alert('⚠️ Bạn phải hoàn thành 100% checklist nghiệm thu trước khi Chuyển trạng thái Review/Hoàn thành!');
                setActiveTab('checklist');
                return;
            }
        }

        const selectedEmp = employees.find(e => e.id === assigneeId);

        const newTask: Partial<Task> = {
            name: taskName,
            dueDate: dueDate,
            priority: priority,
            projectId: projectId,
            status: status,
            assignee: selectedEmp ? {
                name: selectedEmp.name,
                avatar: selectedEmp.avatar,
                role: selectedEmp.role,
                raci: (taskToEdit?.assignee as any)?.raci // Preserve RACI if exists
            } : { name: 'Unassigned', avatar: '', role: '' },
            comments: comments,
            attachments: attachments,
            subtasks: subtasks
        };

        // Preserve ID if editing
        if (taskToEdit) {
            newTask.id = taskToEdit.id;
        }

        onSave(newTask);
        onClose();
    };

    const handleDelete = () => {
        if (taskToEdit && onDelete) {
            if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
                onDelete(taskToEdit.id);
                onClose();
            }
        }
    };

    const isEditing = !!taskToEdit;

    // Calculate progress
    const subtaskProgress = subtasks.length > 0
        ? Math.round((subtasks.filter(st => st.completed).length / subtasks.length) * 100)
        : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${activeTab === 'info' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            Thông tin
                        </button>
                        <button
                            onClick={() => setActiveTab('comments')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'comments' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            <MessageSquare size={16} /> Thảo luận ({comments.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('files')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'files' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            <Paperclip size={16} /> Tài liệu ({attachments.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('checklist')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${activeTab === 'checklist' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                        >
                            <ClipboardCheck size={16} /> Nghiệm thu ({checklistProgress}%)
                        </button>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'info' && (
                        <form id="taskForm" onSubmit={handleSubmit} className="space-y-5">
                            {/* Task Name */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tên công việc <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none font-medium"
                                    placeholder="Ví dụ: Dựng hình kết cấu tầng 1..."
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Assignee Section with AI */}
                            <div className="relative">
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Người thực hiện</label>
                                <div className="flex gap-2">
                                    <select
                                        className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                        value={assigneeId}
                                        onChange={(e) => setAssigneeId(e.target.value)}
                                    >
                                        <option value="">-- Chọn nhân sự --</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.name} - {emp.role}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={handleRecommend}
                                        disabled={!taskName}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Sparkles size={16} /> AI Gợi ý
                                    </button>
                                </div>

                                {/* AI Recommendations Dropdown */}
                                {showRecommendations && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-indigo-100 z-10 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <div className="bg-indigo-50 px-4 py-2 border-b border-indigo-100 flex justify-between items-center">
                                            <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                                                <Sparkles size={12} /> Gợi ý phù hợp nhất
                                            </span>
                                            <button type="button" onClick={() => setShowRecommendations(false)} className="text-indigo-400 hover:text-indigo-700"><X size={14} /></button>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {recommendations.map((rec, idx) => {
                                                const emp = employees.find(e => e.id === rec.employeeId);
                                                if (!emp) return null;
                                                return (
                                                    <div
                                                        key={rec.employeeId}
                                                        className="p-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer transition-colors"
                                                        onClick={() => handleSelectRecommendation(rec.employeeId)}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs">
                                                                    {emp.name.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-700">{emp.name}</p>
                                                                    <p className="text-xs text-gray-500">{emp.role}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${rec.matchScore >= 80 ? 'bg-emerald-100 text-emerald-700' :
                                                                    rec.matchScore >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                                                                    }`}>
                                                                    {Math.round(rec.matchScore)}% hợp
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {rec.reason.length > 0 && (
                                                            <div className="mt-2 text-[10px] text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">
                                                                {rec.reason.map((r, i) => <div key={i} className="flex items-center gap-1"><Check size={10} className="text-emerald-500" /> {r}</div>)}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Due Date & Priority */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hạn hoàn thành</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                                        <input
                                            type="date"
                                            className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Độ ưu tiên</label>
                                    <select
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value as TaskPriority)}
                                    >
                                        <option value={TaskPriority.LOW}>Thấp</option>
                                        <option value={TaskPriority.MEDIUM}>Trung bình</option>
                                        <option value={TaskPriority.HIGH}>Cao</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Trạng thái</label>
                                    <select
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value={TaskStatus.OPEN}>Mở</option>
                                        <option value="In Progress">Đang thực hiện</option>
                                        <option value="Review">Chờ duyệt</option>
                                        <option value={TaskStatus.COMPLETED}>Hoàn thành</option>
                                    </select>
                                </div>
                            </div>

                            {/* Subtasks Section */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2">
                                        <CheckSquare size={14} /> Công việc con ({subtasks.filter(s => s.completed).length}/{subtasks.length})
                                    </h4>
                                    <span className="text-[10px] font-bold text-slate-500">{subtaskProgress}%</span>
                                </div>

                                {subtasks.length > 0 && (
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                                        <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${subtaskProgress}%` }}></div>
                                    </div>
                                )}

                                <div className="space-y-2 mb-3">
                                    {subtasks.map(st => (
                                        <div key={st.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors group">
                                            <button
                                                type="button"
                                                onClick={() => toggleSubtask(st.id)}
                                                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${st.completed ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-300 bg-white hover:border-orange-500'}`}
                                            >
                                                {st.completed && <Check size={12} />}
                                            </button>

                                            <span className={`text-sm font-medium flex-1 ${st.completed ? 'text-gray-400 line-through' : 'text-slate-700'}`}>{st.title}</span>

                                            {/* Assignee Selector */}
                                            <div className="relative group/user">
                                                {st.assignee ? (
                                                    <img src={st.assignee.avatar} alt={st.assignee.name} className="w-6 h-6 rounded-full border border-gray-200 object-cover" title={st.assignee.name} />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-orange-400 hover:text-orange-500 bg-gray-50"><User size={12} /></div>
                                                )}
                                                <select
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    value={st.assignee?.id || ''}
                                                    onChange={(e) => {
                                                        const emp = employees.find(em => em.id === e.target.value);
                                                        const updatedSubtasks = subtasks.map(s => s.id === st.id ? {
                                                            ...s,
                                                            assignee: emp ? { id: emp.id, name: emp.name, avatar: emp.avatar } : undefined
                                                        } : s);
                                                        setSubtasks(updatedSubtasks);
                                                    }}
                                                >
                                                    <option value="">Chưa gán</option>
                                                    {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                                </select>
                                            </div>

                                            {/* Due Date Selector */}
                                            <div className="relative group/date">
                                                {st.dueDate ? (
                                                    <div className="px-2 py-1 rounded bg-red-50 text-[10px] font-bold text-red-600 border border-red-100 whitespace-nowrap">
                                                        {new Date(st.dueDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                                    </div>
                                                ) : (
                                                    <div className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-orange-500 cursor-pointer"><Calendar size={14} /></div>
                                                )}
                                                <input
                                                    type="date"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    value={st.dueDate || ''}
                                                    onChange={(e) => {
                                                        const updatedSubtasks = subtasks.map(s => s.id === st.id ? { ...s, dueDate: e.target.value } : s);
                                                        setSubtasks(updatedSubtasks);
                                                    }}
                                                />
                                            </div>

                                            <button type="button" onClick={() => deleteSubtask(st.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Thêm công việc con..."
                                        className="flex-1 p-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-orange-500 bg-white"
                                        value={newSubtask}
                                        onChange={(e) => setNewSubtask(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubtask())}
                                    />
                                    <button type="button" onClick={handleAddSubtask} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-orange-600 hover:border-orange-500 transition-all"><Plus size={16} /></button>
                                </div>
                            </div>

                            {/* RACI Details Section (View Only) */}
                            {taskToEdit && (taskToEdit as any).raci && (
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                                    <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2">
                                        <Users size={14} /> Ma trận trách nhiệm (RACI)
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['R', 'A', 'C', 'I'].map(role => (
                                            <div key={role} className={`p-2 rounded-lg border flex flex-col justify-center ${role === 'R' ? 'bg-rose-50 border-rose-100' : role === 'A' ? 'bg-amber-50 border-amber-100' : role === 'C' ? 'bg-blue-50 border-blue-100' : 'bg-gray-100 border-gray-200'}`}>
                                                <div className="text-[10px] uppercase font-bold mb-1 opacity-70">{role} - {{ 'R': 'Thực hiện', 'A': 'Phê duyệt', 'C': 'Tham vấn', 'I': 'Thông báo' }[role]}</div>
                                                <div className="text-sm font-bold text-slate-800">{(taskToEdit as any).raci[role] || '-'}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </form>
                    )}

                    {activeTab === 'comments' && (
                        <div className="h-full flex flex-col">
                            <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
                                {comments.length === 0 && <div className="text-center text-gray-400 py-10 italic">Chưa có thảo luận nào.</div>}
                                {comments.map((cmt) => (
                                    <div key={cmt.id} className="flex gap-3">
                                        <img src={cmt.userAvatar || 'https://i.pravatar.cc/150'} alt={cmt.userName} className="w-8 h-8 rounded-full" />
                                        <div className="bg-gray-50 p-3 rounded-2xl rounded-tl-none">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold text-slate-700">{cmt.userName}</span>
                                                <span className="text-[10px] text-gray-400">{cmt.createdAt}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{cmt.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 items-center border-t border-gray-100 pt-3">
                                <input
                                    type="text"
                                    className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Viết bình luận..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                />
                                <button onClick={handleAddComment} className="p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"><Send size={18} /></button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'files' && (
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 text-orange-500 group-hover:scale-110 transition-transform"><Paperclip size={24} /></div>
                                <p className="text-sm font-medium text-gray-600">Kéo thả file vào đây hoặc <span className="text-orange-600 font-bold">Tải lên</span></p>
                            </div>
                            <div className="space-y-2">
                                {attachments.length === 0 && <div className="text-center text-gray-400 py-4 italic">Chưa có tài liệu đính kèm.</div>}
                                {attachments.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><FileText size={20} /></div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{file.name}</p>
                                                <p className="text-[10px] text-gray-400">{file.size} • Uploaded by {file.uploadedBy}</p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors"><Download size={18} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'checklist' && (
                        <div className="space-y-4">
                            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                                <label className="block text-xs font-bold text-orange-800 uppercase mb-2">Quy trình nghiệm thu áp dụng</label>
                                <select
                                    className="w-full p-2 border border-orange-200 rounded-lg text-sm bg-white outline-none focus:ring-2 focus:ring-orange-500"
                                    value={selectedChecklistId}
                                    onChange={(e) => setSelectedChecklistId(e.target.value)}
                                >
                                    <option value="">-- Chọn quy trình kiểm tra --</option>
                                    {checklists.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type})</option>)}
                                </select>
                            </div>

                            {currentChecklist ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end mb-2">
                                        <h4 className="font-bold text-gray-700">Các hạng mục kiểm tra</h4>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${checklistProgress === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                                            Hoàn thành: {checklistProgress}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                        <div className={`h-2 rounded-full transition-all duration-500 ${checklistProgress === 100 ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${checklistProgress}%` }}></div>
                                    </div>

                                    {checklistItems.map((item: any) => (
                                        <div key={item.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleCheckItem(item.id, !checklistLogs[item.id])}>
                                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all ${checklistLogs[item.id] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 bg-white'}`}>
                                                {checklistLogs[item.id] && <Check size={14} />}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`text-sm font-medium ${checklistLogs[item.id] ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{item.text}</p>
                                                {item.instruction && <p className="text-xs text-gray-400 mt-1">{item.instruction}</p>}
                                            </div>
                                        </div>
                                    ))}

                                    {checklistProgress === 100 && (
                                        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-700 text-sm font-bold animate-pulse-subtle">
                                            <CheckCircle size={18} /> Đã đủ điều kiện nghiệm thu/hoàn thành!
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                    <ClipboardCheck size={32} className="mx-auto mb-2 opacity-50" />
                                    <p>Vui lòng chọn quy trình kiểm tra để bắt đầu nghiệm thu.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 flex gap-3 bg-white shrink-0">
                    {isEditing && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-4 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
                            title="Xóa công việc"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={(e) => handleSubmit(e as any)}
                        className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all"
                    >
                        {isEditing ? 'Lưu thay đổi' : 'Tạo công việc'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
