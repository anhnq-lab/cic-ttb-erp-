import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Loader2, Calendar, FileText, DollarSign, User, Building2, Gavel } from 'lucide-react';
import { Contract, ContractStatus } from '../types';

interface ContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (contract: Partial<Contract>) => Promise<void>;
    contract?: Contract;
    projectId: string; // Required for creating new contract
}

const ContractModal: React.FC<ContractModalProps> = ({ isOpen, onClose, onSave, contract, projectId }) => {
    const [formData, setFormData] = useState<Partial<Contract>>({
        code: '',
        packageName: '',
        projectName: '',
        projectId: projectId,
        status: ContractStatus.ACTIVE,
        totalValue: 0,
        paidValue: 0,
        remainingValue: 0,
        wipValue: 0,
        signedDate: new Date().toISOString().split('T')[0],
        startDate: '', // Optional
        endDate: '',   // Optional
        duration: '',
        contractType: 'Hợp đồng trọn gói',
        lawApplied: 'Luật Xây dựng 2014',

        // Side A
        sideAName: '',
        sideARep: '',
        sideAPosition: '',
        sideAMst: '',
        sideAStaff: '',

        // Side B
        sideBName: 'Công ty Cổ phần Công nghệ và Tư vấn CIC',
        sideBRep: '',
        sideBPosition: '',
        sideBMst: '0101234567',
        sideBBank: '',

        // Others
        deliveryMethod: '',
        penaltyRate: '',
        warrantyPeriod: ''
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (contract) {
            setFormData({
                ...contract,
                signedDate: contract.signedDate ? contract.signedDate.split('T')[0] : '',
                startDate: contract.startDate ? contract.startDate.split('T')[0] : '',
                endDate: contract.endDate ? contract.endDate.split('T')[0] : ''
            });
        } else {
            // Reset for new contract
            setFormData(prev => ({
                ...prev,
                projectId: projectId,
                sideBName: 'Công ty Cổ phần Công nghệ và Tư vấn CIC',
                status: ContractStatus.ACTIVE
            }));
        }
    }, [contract, isOpen, projectId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        let finalValue: any = value;
        if (type === 'number') {
            finalValue = parseFloat(value) || 0;
        }
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error("Failed to save contract", error);
            alert("Có lỗi xảy ra khi lưu hợp đồng");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            {contract ? '✏️ Chỉnh sửa Hợp đồng' : '✨ Tạo Hợp đồng Mới'}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Điền thông tin chi tiết cho hợp đồng dự án</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <form id="contract-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* Section 1: General Info */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-gray-200">
                            <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm uppercase">
                                <FileText size={16} className="text-indigo-600" /> Thông tin chung
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Mã hợp đồng <span className="text-red-500">*</span></label>
                                    <input
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none"
                                        placeholder="VD: HĐ-001/2025"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Tên gói thầu <span className="text-red-500">*</span></label>
                                    <input
                                        name="packageName"
                                        value={formData.packageName}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-indigo-500 outline-none"
                                        placeholder="VD: Tư vấn thiết kế BIM..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Loại hợp đồng</label>
                                    <select
                                        name="contractType"
                                        value={formData.contractType}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:border-indigo-500 outline-none"
                                    >
                                        <option value="Hợp đồng trọn gói">Hợp đồng trọn gói</option>
                                        <option value="Hợp đồng theo đơn giá">Hợp đồng theo đơn giá</option>
                                        <option value="Hợp đồng theo thời gian">Hợp đồng theo thời gian</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Trạng thái</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:border-indigo-500 outline-none"
                                    >
                                        <option value={ContractStatus.DRAFT}>Nháp</option>
                                        <option value={ContractStatus.ACTIVE}>Hiệu lực</option>
                                        <option value={ContractStatus.COMPLETED}>Hoàn thành</option>
                                        <option value={ContractStatus.PENDING_PAYMENT}>Chờ thanh toán</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Values & Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm uppercase">
                                    <DollarSign size={16} className="text-emerald-600" /> Giá trị & Thanh toán
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Tổng giá trị (VNĐ)</label>
                                        <input
                                            name="totalValue"
                                            type="number"
                                            value={formData.totalValue}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-bold text-emerald-600 focus:border-emerald-500 outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1">Tạm ứng</label>
                                            <input
                                                name="advancePayment"
                                                type="number"
                                                value={formData.advancePayment}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-emerald-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1">VAT Included?</label>
                                            <div className="flex items-center gap-2 mt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.vatIncluded}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, vatIncluded: e.target.checked }))}
                                                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                                />
                                                <span className="text-sm">Đã bao gồm VAT</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-200">
                                <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm uppercase">
                                    <Calendar size={16} className="text-orange-600" /> Thời gian thực hiện
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Ngày ký HĐ</label>
                                        <input
                                            name="signedDate"
                                            type="date"
                                            value={formData.signedDate}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-orange-500 outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1">Ngày bắt đầu</label>
                                            <input
                                                name="startDate"
                                                type="date"
                                                value={formData.startDate}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-orange-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1">Ngày kết thúc (Dự kiến)</label>
                                            <input
                                                name="endDate"
                                                type="date"
                                                value={formData.endDate}
                                                onChange={handleChange}
                                                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-orange-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Thời hạn (Ngày)</label>
                                        <input
                                            name="duration"
                                            value={formData.duration}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-orange-500 outline-none"
                                            placeholder="VD: 90 ngày"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Parties */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm uppercase">
                                    <Building2 size={16} className="text-blue-600" /> Bên A (Chủ đầu tư)
                                </h4>
                                <div className="space-y-3">
                                    <input
                                        name="sideAName"
                                        value={formData.sideAName}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                        placeholder="Tên đơn vị (Bên A)"
                                    />
                                    <input
                                        name="sideARep"
                                        value={formData.sideARep}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                        placeholder="Người đại diện"
                                    />
                                    <input
                                        name="sideAMst"
                                        value={formData.sideAMst}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                        placeholder="Mã số thuế"
                                    />
                                </div>
                            </div>

                            <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                                <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm uppercase">
                                    <Building2 size={16} className="text-purple-600" /> Bên B (Nhà thầu tư vấn)
                                </h4>
                                <div className="space-y-3">
                                    <input
                                        name="sideBName"
                                        value={formData.sideBName}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                        placeholder="Tên đơn vị (Bên B)"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            name="sideBRep"
                                            value={formData.sideBRep}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                            placeholder="Người đại diện"
                                        />
                                        <input
                                            name="sideBMst"
                                            value={formData.sideBMst}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                            placeholder="Mã số thuế"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Legal & Other */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm uppercase">
                                <Gavel size={16} className="text-gray-600" /> Pháp lý khác
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Luật áp dụng</label>
                                    <input
                                        name="lawApplied"
                                        value={formData.lawApplied}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1">Phạt vi phạm</label>
                                    <input
                                        name="penaltyRate"
                                        value={formData.penaltyRate}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                                        placeholder="VD: 8% giá trị hợp đồng"
                                    />
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        type="button"
                        className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all text-sm"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all text-sm flex items-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                        {contract ? 'Lưu Thay đổi' : 'Tạo Hợp đồng'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContractModal;
