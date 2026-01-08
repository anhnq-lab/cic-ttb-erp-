import React, { useState, useEffect } from 'react';
import { ProjectCost, ProjectMember } from '../types';
import { CostService } from '../services/cost.service';
import { ProjectService } from '../services/project.service';
import {
    DollarSign, Briefcase, Plane, Printer, Wrench,
    Plus, Filter, FileText, CheckCircle2, Clock, XCircle,
    Pencil, Trash2, X, Save, Loader, User, Calculator
} from 'lucide-react';

interface ProjectCostTabProps {
    projectId: string;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const CATEGORY_CONFIG: Record<string, { label: string, icon: any, color: string }> = {
    'Travel': { label: 'Công tác phí', icon: Plane, color: 'text-sky-600 bg-sky-50' },
    'Outsource': { label: 'Thuê ngoài', icon: Briefcase, color: 'text-purple-600 bg-purple-50' },
    'Equipment': { label: 'Thiết bị & PM', icon: Wrench, color: 'text-orange-600 bg-orange-50' },
    'Other': { label: 'Khác', icon: Printer, color: 'text-gray-600 bg-gray-50' },
    'Salary': { label: 'Lương nhân sự', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' }
};

const STATUS_Styles = {
    'Approved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
    'Rejected': 'bg-rose-100 text-rose-700 border-rose-200'
};

const ProjectCostTab: React.FC<ProjectCostTabProps> = ({ projectId }) => {
    // Data State
    const [costs, setCosts] = useState<ProjectCost[]>([]);
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState<string>('All');

    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCost, setEditingCost] = useState<ProjectCost | undefined>(undefined);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<ProjectCost>>({});

    useEffect(() => {
        loadData();
    }, [projectId]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [costsData, membersData] = await Promise.all([
                CostService.getCostsByProject(projectId),
                ProjectService.getProjectMembers(projectId)
            ]);
            setCosts(costsData);
            setMembers(membersData); // Casting if needed depending on return type
        } catch (error) {
            console.error("Failed to load project data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddNew = () => {
        setEditingCost(undefined);
        setFormData({
            projectId,
            category: 'Outsource', // Default
            salaryType: 'Internal', // Default if Salary selected
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            amount: 0,
            description: '',
            spender: '',
            manHours: 0,
            hourlyRate: 0
        });
        setIsModalOpen(true);
    };

    const handleEdit = (cost: ProjectCost) => {
        setEditingCost(cost);
        setFormData({ ...cost });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa khoản chi này?')) {
            await CostService.deleteCost(id);
            loadData();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // Auto-generate description for Salary if empty
            let finalData = { ...formData };
            if (formData.category === 'Salary' && formData.salaryType === 'Internal' && !formData.description) {
                finalData.description = `Lương ${formData.spender} (Tháng ${new Date().getMonth() + 1})`;
            }

            if (editingCost) {
                await CostService.updateCost(editingCost.id, finalData);
            } else {
                await CostService.createCost(finalData as Omit<ProjectCost, 'id'>);
            }
            await loadData();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to save cost", error);
            alert("Có lỗi xảy ra khi lưu dữ liệu");
        } finally {
            setIsSaving(false);
        }
    };

    // Auto-calculate amount when hours or rate changes
    useEffect(() => {
        if (formData.category === 'Salary' && formData.salaryType === 'Internal') {
            const amount = (formData.manHours || 0) * (formData.hourlyRate || 0);
            if (amount !== formData.amount) {
                setFormData(prev => ({ ...prev, amount }));
            }
        }
    }, [formData.manHours, formData.hourlyRate, formData.category, formData.salaryType]);

    const handleMemberSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const memId = e.target.value;
        const member = members.find(m => m.id === memId);
        if (member) {
            setFormData(prev => ({
                ...prev,
                personnelId: member.id,
                spender: member.employee?.name || 'Unknown',
                hourlyRate: member.hourlyRate || 0,
                // manHours: 0 // Reset or keep? Keep is better UX
            }));
        } else {
            // Reset
            setFormData(prev => ({ ...prev, personnelId: '', spender: '', hourlyRate: 0 }));
        }
    };

    const filteredCosts = filterCategory === 'All'
        ? costs
        : costs.filter(c => c.category === filterCategory);

    const totalCost = costs.reduce((sum, c) => sum + c.amount, 0);

    const categoryTotals = costs.reduce((acc, c) => {
        acc[c.category] = (acc[c.category] || 0) + c.amount;
        return acc;
    }, {} as Record<string, number>);

    if (isLoading && costs.length === 0) {
        return <div className="p-12 text-center text-gray-400"><Loader className="animate-spin mx-auto mb-2" /> Đang tải dữ liệu...</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Cards (Same as before) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white shadow-lg">
                    <div className="flex items-center gap-3 mb-2 opacity-80">
                        <DollarSign size={20} />
                        <span className="text-sm font-bold uppercase tracking-wider">Tổng chi phí</span>
                    </div>
                    <p className="text-3xl font-black tracking-tight">{formatCurrency(totalCost)}</p>
                    <p className="text-xs text-slate-400 mt-2">Tính đến hiện tại</p>
                </div>
                {['Salary', 'Outsource', 'Equipment'].map(cat => (
                    <div key={cat} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
                        <div className={`flex items-center gap-2 mb-2 ${CATEGORY_CONFIG[cat].color} w-fit px-2 py-1 rounded-lg`}>
                            {React.createElement(CATEGORY_CONFIG[cat].icon, { size: 16 })}
                            <span className="text-xs font-bold uppercase">{CATEGORY_CONFIG[cat].label}</span>
                        </div>
                        <p className="text-xl font-bold text-slate-800">{formatCurrency(categoryTotals[cat] || 0)}</p>
                        <div className="w-full bg-gray-100 h-1.5 mt-3 rounded-full overflow-hidden">
                            <div className="bg-slate-800 h-full" style={{ width: `${totalCost ? ((categoryTotals[cat] || 0) / totalCost) * 100 : 0}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        <button
                            onClick={() => setFilterCategory('All')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap
                ${filterCategory === 'All' ? 'bg-slate-800 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                        >
                            Tất cả
                        </button>
                        {Object.keys(CATEGORY_CONFIG).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5
                  ${filterCategory === cat ? 'bg-white border-indigo-500 text-indigo-700 ring-1 ring-indigo-500 shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                            >
                                {React.createElement(CATEGORY_CONFIG[cat].icon, { size: 14 })}
                                {CATEGORY_CONFIG[cat].label}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-indigo-700 transition-colors shrink-0"
                    >
                        <Plus size={18} /> Thêm khoản chi
                    </button>
                </div>

                {/* List */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Nội dung chi</th>
                                <th className="px-6 py-4">Phân loại</th>
                                <th className="px-6 py-4">Người chi / Thực hiện</th>
                                <th className="px-6 py-4">Chi tiết</th>
                                <th className="px-6 py-4 text-right">Số tiền</th>
                                <th className="px-6 py-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCosts.length > 0 ? (
                                filteredCosts.map((cost) => (
                                    <tr key={cost.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">{cost.description}</div>
                                            {cost.notes && <div className="text-xs text-gray-400 mt-0.5 italic">{cost.notes}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${CATEGORY_CONFIG[cost.category]?.color.replace('bg-', 'border-').replace('text-', 'bg-opacity-10 ')}`}>
                                                {React.createElement(CATEGORY_CONFIG[cost.category]?.icon || FileText, { size: 12 })}
                                                {CATEGORY_CONFIG[cost.category]?.label || cost.category}
                                            </span>
                                            {cost.category === 'Salary' && (
                                                <div className="mt-1">
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border border-gray-200 ${cost.salaryType === 'Internal' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                                        {cost.salaryType === 'Internal' ? 'Nội bộ' : 'Thuê ngoài'}
                                                    </span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">{cost.spender}</td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">
                                            {cost.category === 'Salary' && cost.salaryType === 'Internal' ? (
                                                <div className="flex flex-col gap-1">
                                                    <span>Giờ công: <b>{cost.manHours}</b></span>
                                                    <span>Đơn giá: <b>{formatCurrency(cost.hourlyRate || 0)}</b>/h</span>
                                                </div>
                                            ) : (
                                                <span>{cost.date}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-800">
                                            {formatCurrency(cost.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(cost)}
                                                    className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-md transition-colors"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cost.id)}
                                                    className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-md transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={6} className="text-center py-12 text-gray-400 italic">Không có dữ liệu chi phí</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                {editingCost ? <Pencil size={18} className="text-indigo-600" /> : <Plus size={18} className="text-emerald-600" />}
                                {editingCost ? 'Chỉnh sửa khoản chi' : 'Thêm khoản chi mới'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Category Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phân loại <span className="text-rose-500">*</span></label>
                                <select
                                    value={formData.category || 'Outsource'}
                                    onChange={e => setFormData({ ...formData, category: e.target.value as any, salaryType: e.target.value === 'Salary' ? 'Internal' : undefined })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    {Object.keys(CATEGORY_CONFIG).map(key => (
                                        <option key={key} value={key}>{CATEGORY_CONFIG[key].label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Salary Specific Fields */}
                            {formData.category === 'Salary' && (
                                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 space-y-4">
                                    {/* Salary Type Toggle */}
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="salaryType"
                                                value="Internal"
                                                checked={formData.salaryType === 'Internal'}
                                                onChange={() => setFormData({ ...formData, salaryType: 'Internal', amount: 0 })}
                                                className="text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm font-medium text-slate-700">Nhân sự Nội bộ</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="salaryType"
                                                value="Outsource"
                                                checked={formData.salaryType === 'Outsource'}
                                                onChange={() => setFormData({ ...formData, salaryType: 'Outsource', amount: 0 })}
                                                className="text-emerald-600 focus:ring-emerald-500"
                                            />
                                            <span className="text-sm font-medium text-slate-700">Lương Thuê ngoài</span>
                                        </label>
                                    </div>

                                    {/* Internal Salary Logic */}
                                    {formData.salaryType === 'Internal' ? (
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Chọn nhân sự</label>
                                                <select
                                                    value={formData.personnelId || ''}
                                                    onChange={handleMemberSelect}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                                >
                                                    <option value="">-- Chọn nhân sự --</option>
                                                    {members.map(m => (
                                                        <option key={m.id} value={m.id}>{m.employee?.name} ({m.projectRole})</option>
                                                    ))}
                                                </select>
                                                {formData.hourlyRate ? (
                                                    <div className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
                                                        <User size={12} /> {formData.spender} - Đơn giá: {formatCurrency(formData.hourlyRate)}/h
                                                    </div>
                                                ) : null}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Giờ công</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={formData.manHours || ''}
                                                        onChange={e => setFormData({ ...formData, manHours: Number(e.target.value) })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                                        placeholder="Nhập số giờ..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Thành tiền (Tự động)</label>
                                                    <div className="w-full px-3 py-2 bg-slate-100 border border-gray-200 rounded-lg font-bold text-slate-800">
                                                        {formatCurrency(formData.amount || 0)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Salary Outsource
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Đơn vị / Cá nhân thuê ngoài</label>
                                            <input
                                                type="text"
                                                value={formData.spender || ''}
                                                onChange={e => setFormData({ ...formData, spender: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Default Description Field */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nội dung chi {formData.category !== 'Salary' && <span className="text-rose-500">*</span>}</label>
                                <input
                                    type="text"
                                    required={formData.category !== 'Salary'}
                                    value={formData.description || ''}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder={formData.category === 'Salary' ? "Để trống sẽ tự động tạo: Lương [Tên]..." : "VD: Mua vé máy bay..."}
                                />
                            </div>

                            {/* Standard Amount Field (Hidden for Internal Salary as it's auto-calc) */}
                            {!(formData.category === 'Salary' && formData.salaryType === 'Internal') && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số tiền <span className="text-rose-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                required // Actually should be handled carefully
                                                value={formData.amount || ''}
                                                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                                                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700"
                                            />
                                            <span className="absolute right-3 top-2 text-gray-400 text-xs font-bold">VNĐ</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Người chi / Đơn vị</label>
                                        <input
                                            type="text"
                                            value={formData.spender || ''}
                                            onChange={e => setFormData({ ...formData, spender: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Additional Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày chứng từ</label>
                                    <input
                                        type="date"
                                        value={formData.date || ''}
                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3 border-t border-gray-100 mt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200">Hủy bỏ</button>
                                <button type="submit" disabled={isSaving} className="flex-1 px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                                    {isSaving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectCostTab;
