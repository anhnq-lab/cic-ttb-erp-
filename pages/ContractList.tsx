
import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import { CONTRACTS, CASHFLOW_DATA } from '../constants';
import { PaymentStatus, Contract, ContractStatus, PaymentTransaction } from '../types';
import { ContractService } from '../services/contract.service';
import ImportModal from '../components/ImportModal';
import {
    FileText, Download, Filter, CheckCircle, AlertTriangle, Clock,
    X, Receipt, Calendar, CreditCard, ChevronRight, FileCheck,
    TrendingUp, ArrowRight, Printer, PlusCircle, Upload, Loader, Loader2, Pencil,
    DollarSign, Image as ImageIcon, FileSpreadsheet
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';

// Define helper components
const TrendingUpIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// --- TRANSACTION MODAL (NEW FEATURE) ---
interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (transaction: PaymentTransaction) => void;
    contractCode: string;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, onSave, contractCode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        invoiceNumber: '',
        method: 'Bank Transfer' as 'Bank Transfer' | 'Cash'
    });

    // Reset when opening
    useEffect(() => {
        if (isOpen) {
            setFileName(null);
            setFormData({
                amount: '',
                date: new Date().toISOString().split('T')[0],
                description: `Thanh toán đợt ... HĐ ${contractCode}`,
                invoiceNumber: '',
                method: 'Bank Transfer'
            });
        }
    }, [isOpen, contractCode]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setIsLoading(true);

        // Simulate OCR / Invoice Processing
        setTimeout(() => {
            setIsLoading(false);
            // Mock extracted data
            setFormData(prev => ({
                ...prev,
                amount: '150000000', // Mock extracted amount
                invoiceNumber: '0012458', // Mock extracted invoice
                description: `Thanh toán đợt 2 theo hóa đơn ${file.name}`,
                date: '2025-03-25'
            }));
        }, 1500);
    };

    const handleSubmit = () => {
        if (!formData.amount) return alert('Vui lòng nhập số tiền');

        const newTransaction: PaymentTransaction = {
            id: `TRX-${Date.now()}`,
            date: formData.date.split('-').reverse().join('/'),
            amount: Number(formData.amount),
            description: formData.description,
            method: formData.method,
            invoiceNumber: formData.invoiceNumber,
            status: PaymentStatus.PAID
        };
        onSave(newTransaction);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <DollarSign className="text-emerald-600" size={20} /> Ghi nhận thanh toán
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                </div>

                <div className="p-6 space-y-5">
                    {/* File Upload Area */}
                    <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-xl p-6 text-center transition-all hover:bg-blue-50 group relative">
                        <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-2">
                                <Loader size={32} className="text-blue-500 animate-spin mb-2" />
                                <p className="text-sm font-medium text-blue-600">Đang phân tích hóa đơn...</p>
                            </div>
                        ) : fileName ? (
                            <div className="flex flex-col items-center justify-center py-2">
                                <FileCheck size={32} className="text-emerald-500 mb-2" />
                                <p className="text-sm font-bold text-slate-700">{fileName}</p>
                                <p className="text-xs text-emerald-600">Đã trích xuất thông tin thành công!</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-2 group-hover:scale-105 transition-transform">
                                <Upload size={32} className="text-blue-400 mb-2" />
                                <p className="text-sm font-bold text-slate-700">Import Hóa đơn (PDF/Ảnh)</p>
                                <p className="text-xs text-slate-500 mt-1">Kéo thả hoặc click để tải lên. Hệ thống sẽ tự động điền thông tin.</p>
                            </div>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Số tiền (VNĐ)</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm font-bold text-emerald-700 focus:border-emerald-500 outline-none"
                                    value={formData.amount}
                                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ngày giao dịch</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 outline-none"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Số hóa đơn / Ref</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 outline-none"
                                    value={formData.invoiceNumber}
                                    onChange={e => setFormData({ ...formData, invoiceNumber: e.target.value })}
                                    placeholder="INV-..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phương thức</label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-blue-500 outline-none"
                                    value={formData.method}
                                    onChange={e => setFormData({ ...formData, method: e.target.value as any })}
                                >
                                    <option value="Bank Transfer">Chuyển khoản</option>
                                    <option value="Cash">Tiền mặt</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nội dung thanh toán</label>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500 outline-none h-20 resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg">Hủy bỏ</button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-2"
                    >
                        <CheckCircle size={16} /> Lưu giao dịch
                    </button>
                </div>
            </div>
        </div>
    );
};

// Modal Component for Contract Details
const ContractDetailModal = ({ contract, onClose }: { contract: Contract, onClose: () => void }) => {
    const [localContract, setLocalContract] = useState<Contract>(contract);
    const [activeTab, setActiveTab] = useState<'info' | 'payment' | 'content'>('payment');
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    const getPaymentStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.PAID: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case PaymentStatus.INVOICED: return 'bg-orange-100 text-orange-700 border-orange-200';
            case PaymentStatus.OVERDUE: return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const handleAddTransaction = async (newTransaction: PaymentTransaction) => {
        // Call Service
        const updated = await ContractService.addTransaction(localContract.id, newTransaction);
        if (updated) {
            setLocalContract(updated);
            // Optionally notify parent to refresh list, but for now local update is fine for modal
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-600 text-white uppercase tracking-wider">Hợp đồng</span>
                            <span className="text-sm font-mono text-gray-500">{localContract.code}</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{localContract.packageName}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto bg-gray-50/50 flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10 px-6">
                        <button
                            onClick={() => setActiveTab('payment')}
                            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'payment' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <CreditCard size={16} /> Quản lý Thanh toán
                        </button>
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'info' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <FileText size={16} /> Thông tin chung
                        </button>
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'content' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            <FileCheck size={16} /> Nội dung Hợp đồng
                        </button>
                    </div>

                    <div className="p-6">
                        {activeTab === 'payment' && (
                            <div className="space-y-6">
                                {/* Financial Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Tổng giá trị</p>
                                        <p className="text-lg font-black text-gray-800">{formatCurrency(localContract.totalValue)}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Đã xuất hóa đơn</p>
                                        <p className="text-lg font-black text-orange-600">
                                            {formatCurrency((localContract.paymentMilestones || []).filter(m => m.status === PaymentStatus.INVOICED || m.status === PaymentStatus.PAID).reduce((acc, curr) => acc + curr.amount, 0))}
                                        </p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Thực thu</p>
                                        <p className="text-lg font-black text-emerald-600">{formatCurrency(localContract.paidValue)}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Còn lại</p>
                                        <p className="text-lg font-black text-rose-600">{formatCurrency(localContract.remainingValue)}</p>
                                    </div>
                                </div>

                                {/* Payment Milestones */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                        <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">
                                            <Calendar size={16} className="text-orange-500" /> Kế hoạch & Tiến độ thanh toán
                                        </h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsTransactionModalOpen(true)}
                                                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                                            >
                                                <PlusCircle size={14} /> Ghi nhận Thu/Chi
                                            </button>
                                            <button className="text-xs font-bold text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-300 rounded-lg flex items-center gap-1">
                                                <Printer size={14} /> Xuất công nợ
                                            </button>
                                        </div>
                                    </div>
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4">Đợt / Giai đoạn</th>
                                                <th className="px-6 py-4">Điều kiện</th>
                                                <th className="px-6 py-4">Bàn giao</th>
                                                <th className="px-6 py-4">Giá trị</th>
                                                <th className="px-6 py-4">Hạn TT</th>
                                                <th className="px-6 py-4">Trạng thái</th>
                                                <th className="px-6 py-4 text-right">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {(localContract.paymentMilestones || []).map((milestone) => (
                                                <tr key={milestone.id} className="hover:bg-gray-50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-800">{milestone.phase}</div>
                                                        <div className="text-xs text-gray-400">{milestone.percentage ? `${milestone.percentage}%` : '-'} HĐ</div>
                                                    </td>
                                                    <td className="px-6 py-4 max-w-xs text-gray-600 leading-relaxed text-xs">
                                                        {milestone.condition || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 max-w-xs text-gray-600 font-medium text-xs">
                                                        {milestone.acceptanceProduct || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 font-mono font-medium text-gray-800">
                                                        {formatCurrency(milestone.amount)}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {milestone.dueDate || '-'}
                                                        {milestone.invoiceDate && (
                                                            <div className="text-[10px] text-orange-500 mt-1">
                                                                Inv: {milestone.invoiceDate}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-wider ${getPaymentStatusColor(milestone.status)}`}>
                                                            {milestone.status}
                                                        </span>
                                                        {milestone.updatedBy && (
                                                            <div className="mt-1 text-[10px] text-gray-400" title={milestone.updatedAt}>
                                                                Thiết lập bởi: <span className="text-gray-600">{milestone.updatedBy.split('@')[0]}</span>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {milestone.status === PaymentStatus.PENDING && (
                                                            <button
                                                                onClick={async () => {
                                                                    if (confirm('Xác nhận đã xuất hóa đơn cho đợt thanh toán này?')) {
                                                                        const today = new Date().toISOString().split('T')[0].split('-').reverse().join('/');
                                                                        const updated = await ContractService.updateMilestoneStatus(localContract.id, milestone.id!, PaymentStatus.INVOICED, today);
                                                                        if (updated) setLocalContract(updated);
                                                                    }
                                                                }}
                                                                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded text-xs font-medium shadow-sm transition-all"
                                                            >
                                                                Xuất Invoice
                                                            </button>
                                                        )}
                                                        {milestone.status === PaymentStatus.INVOICED && (
                                                            <button
                                                                onClick={() => {
                                                                    // Pre-fill transaction modal logic could go here, but for simplicity we reuse the main Add Transaction flow or create a dedicated one.
                                                                    // Let's assume we want to open the Transaction Modal with pre-filled amount
                                                                    setIsTransactionModalOpen(true);
                                                                    // Ideally pass milestone details to modal to pre-fill

                                                                }}
                                                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium shadow-sm transition-all"
                                                            >
                                                                XN Thanh toán
                                                            </button>
                                                        )}
                                                        {milestone.status === PaymentStatus.PAID && (
                                                            <div className="flex items-center justify-end gap-1 text-emerald-600 font-bold text-xs">
                                                                <CheckCircle size={14} /> Hoàn thành
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Transactions History */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                        <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">
                                            <Receipt size={16} className="text-emerald-500" /> Lịch sử giao dịch
                                        </h3>
                                    </div>
                                    {localContract.transactions && localContract.transactions.length > 0 ? (
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-3">Mã GD</th>
                                                    <th className="px-6 py-3">Ngày</th>
                                                    <th className="px-6 py-3">Nội dung</th>
                                                    <th className="px-6 py-3">Số tiền</th>
                                                    <th className="px-6 py-3 text-right">Phương thức</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {localContract.transactions.map((trx) => (
                                                    <tr key={trx.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-3 font-mono text-xs text-gray-500">{trx.id}</td>
                                                        <td className="px-6 py-3 text-gray-700">{trx.date}</td>
                                                        <td className="px-6 py-3 text-gray-700">
                                                            <div className="font-medium">{trx.description}</div>
                                                            {trx.invoiceNumber && <div className="text-[10px] text-gray-400">Ref: {trx.invoiceNumber}</div>}
                                                        </td>
                                                        <td className="px-6 py-3 font-bold text-emerald-600">+{formatCurrency(trx.amount)}</td>
                                                        <td className="px-6 py-3 text-right text-gray-500 text-xs">{trx.method}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="p-8 text-center text-gray-400 italic text-sm">Chưa có giao dịch nào được ghi nhận</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'info' && (
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="font-bold text-gray-800 mb-4 text-xs uppercase tracking-wider border-b pb-2">Bên A (Chủ đầu tư)</h3>
                                        <div className="space-y-3">
                                            <div className="text-sm"><span className="text-gray-500 block text-xs mb-0.5">Tên đơn vị</span><span className="font-medium">{localContract.sideAName}</span></div>
                                            <div className="text-sm"><span className="text-gray-500 block text-xs mb-0.5">Đại diện</span><span className="font-medium">{localContract.sideARep}</span> ({localContract.sideAPosition})</div>
                                            <div className="text-sm"><span className="text-gray-500 block text-xs mb-0.5">Mã số thuế</span><span className="font-mono">{localContract.sideAMst}</span></div>
                                        </div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="font-bold text-gray-800 mb-4 text-xs uppercase tracking-wider border-b pb-2">Thông tin Hợp đồng</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-sm"><span className="text-gray-500 block text-xs mb-0.5">Ngày ký</span><span className="font-medium">{localContract.signedDate || '---'}</span></div>
                                            <div className="text-sm"><span className="text-gray-500 block text-xs mb-0.5">Thời gian thực hiện</span>
                                                <span className="font-medium">
                                                    {localContract.startDate ? `${localContract.startDate} - ${localContract.endDate || '...'}` : (localContract.duration || '---')}
                                                </span>
                                            </div>

                                            <div className="text-sm"><span className="text-gray-500 block text-xs mb-0.5">Giá trị Hợp đồng</span><span className="font-bold text-emerald-600">{formatCurrency(localContract.totalValue)}</span></div>
                                            <div className="text-sm"><span className="text-gray-500 block text-xs mb-0.5">Đã thanh toán</span><span className="font-bold text-blue-600">{formatCurrency(localContract.paidValue)}</span></div>

                                            {localContract.capitalSource && <div className="text-sm"><span className="text-gray-500 block text-xs mb-0.5">Nguồn vốn</span><span className="font-medium">{localContract.capitalSource === 'StateBudget' ? 'Vốn đầu tư công' : 'Vốn khác'}</span></div>}
                                            {localContract.constructionType && <div className="text-sm"><span className="text-gray-500 block text-xs mb-0.5">Loại công trình</span><span className="font-medium">{localContract.constructionType}</span></div>}

                                            <div className="text-sm col-span-2"><span className="text-gray-500 block text-xs mb-0.5">Phạm vi công việc</span>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {localContract.mainTasks && localContract.mainTasks.length > 0 ? (
                                                        localContract.mainTasks.map((t, i) => <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">{t}</span>)
                                                    ) : (
                                                        <span className="text-gray-700 font-medium">{localContract.deliveryMethod || 'Chi tiết trong hồ sơ đính kèm'}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-fit">
                                        <h3 className="font-bold text-gray-800 mb-4 text-xs uppercase tracking-wider border-b pb-2">Điều khoản phạt & Bảo hành</h3>
                                        <div className="space-y-4">
                                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
                                                <p className="text-xs font-bold text-rose-700 mb-1">Phạt chậm tiến độ</p>
                                                <p className="text-sm text-rose-900">{localContract.penaltyRate || 'Không quy định'}</p>
                                            </div>
                                            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                                <p className="text-xs font-bold text-blue-700 mb-1">Thời gian bảo hành</p>
                                                <p className="text-sm text-blue-900">{localContract.warrantyPeriod || 'Không quy định'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {(localContract.fileUrl || localContract.driveLink) && (
                                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm h-fit mt-6">
                                            <h3 className="font-bold text-gray-800 mb-4 text-xs uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                                                <FileCheck size={16} className="text-emerald-600" /> Tài liệu đính kèm
                                            </h3>
                                            <div className="space-y-3">
                                                {localContract.fileUrl && (
                                                    <a href={`/contracts/${localContract.fileUrl.split('/').pop()}`} target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-orange-300 transition-all group">
                                                        <div className="bg-red-50 p-2 rounded text-red-600 group-hover:bg-red-100">
                                                            <FileText size={20} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-bold text-gray-700 group-hover:text-orange-600 truncate">File Hợp đồng (Scan)</p>
                                                            <p className="text-xs text-gray-400">PDF Document</p>
                                                        </div>
                                                        <Download size={16} className="text-gray-400 group-hover:text-orange-500" />
                                                    </a>
                                                )}

                                                {localContract.driveLink && (
                                                    <a href={localContract.driveLink} target="_blank" rel="noopener noreferrer"
                                                        className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-blue-300 transition-all group">
                                                        <div className="bg-blue-50 p-2 rounded text-blue-600 group-hover:bg-blue-100">
                                                            <Upload size={20} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-bold text-gray-700 group-hover:text-blue-600 truncate">Link Google Drive</p>
                                                            <p className="text-xs text-gray-400">Tài liệu dự án</p>
                                                        </div>
                                                        <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-500" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'content' && (
                            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg min-h-[600px] print:p-0">
                                {localContract.content ? (
                                    <div className="prose prose-sm max-w-none prose-headings:text-slate-900 prose-p:text-slate-700">
                                        <div dangerouslySetInnerHTML={{ __html: localContract.content }} />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                                        <div className="bg-gray-100 p-6 rounded-full mb-4">
                                            <FileText size={48} className="text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-700 mb-2">Chưa có nội dung hợp đồng</h3>
                                        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                                            Hợp đồng này chưa được số hóa nội dung hoặc chưa được gán mẫu hợp đồng nào.
                                        </p>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 flex items-center gap-2">
                                            <Upload size={16} /> Tải lên hoặc Tạo từ mẫu
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Render Nested Transaction Modal */}
                <TransactionModal
                    isOpen={isTransactionModalOpen}
                    onClose={() => setIsTransactionModalOpen(false)}
                    onSave={handleAddTransaction}
                    contractCode={localContract.code}
                />
            </div>
        </div >
    );
};

// --- EDIT CONTRACT MODAL ---
const EditContractModal = ({ contract, onClose, onSave }: { contract: Contract, onClose: () => void, onSave: (data: Contract) => void }) => {
    const [formData, setFormData] = useState({
        code: contract.code || '',
        projectName: contract.projectName || '',
        sideAName: contract.sideAName || '',
        sideBName: contract.sideBName || '',
        totalValue: contract.totalValue || 0,
        signedDate: contract.signedDate || '',
        startDate: contract.startDate || '',
        endDate: contract.endDate || '',
        status: contract.status || 'Đang thực hiện'
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const updatedContract: Contract = { ...contract, ...formData };
        onSave(updatedContract);
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">✏️ Chỉnh sửa Hợp đồng</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Số hợp đồng</label>
                            <input name="code" value={formData.code} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Trạng thái</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white">
                                <option value="Đang thực hiện">Đang thực hiện</option>
                                <option value="Đã hoàn thành">Đã hoàn thành</option>
                                <option value="Đã thanh lý">Đã thanh lý</option>
                                <option value="Tạm dừng">Tạm dừng</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Tên dự án</label>
                        <input name="projectName" value={formData.projectName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Bên A (Khách hàng)</label>
                            <input name="sideAName" value={formData.sideAName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Bên B (Nhà cung cấp)</label>
                            <input name="sideBName" value={formData.sideBName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Giá trị hợp đồng (VNĐ)</label>
                        <input name="totalValue" type="number" value={formData.totalValue} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày ký</label>
                            <input name="signedDate" type="date" value={formData.signedDate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày bắt đầu</label>
                            <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày kết thúc</label>
                            <input name="endDate" type="date" value={formData.endDate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Hủy</button>
                        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ContractList = () => {
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingContract, setEditingContract] = useState<Contract | null>(null);
    const [contracts, setContracts] = useState<Contract[]>([]);

    useEffect(() => {
        ContractService.getContracts().then(data => {
            console.log("Contracts loaded:", data);
            if (!data || data.length === 0) {
                console.warn("Service returned empty contracts, falling back to mock constant");
                setContracts(CONTRACTS);
            } else {
                setContracts(data);
            }
        });
    }, []);

    // --- FILTER STATE ---
    const [importType, setImportType] = useState<'Contract' | 'Payment' | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'All' | 'Output' | 'Input'>('All'); // Simulation
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [filterYear, setFilterYear] = useState<string>('All');

    // Get unique years
    const uniqueYears = useMemo(() => {
        const years = contracts.map(c => c.signedDate ? new Date(c.signedDate).getFullYear().toString() : '').filter(y => y);
        return Array.from(new Set(years)).sort().reverse();
    }, [contracts]);

    // --- FILTER LOGIC ---
    const filteredContracts = useMemo(() => {
        return contracts.filter(contract => {
            // 1. Keyword Search (Defensive check for nulls)
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                (contract.code?.toLowerCase() || '').includes(query) ||
                (contract.sideAName?.toLowerCase() || '').includes(query) ||
                (contract.projectName?.toLowerCase() || '').includes(query);

            // 2. Status Filter
            const matchesStatus = filterStatus === 'All' || contract.status === filterStatus;

            // 3. Year Filter
            const contractYear = contract.signedDate ? new Date(contract.signedDate).getFullYear().toString() : '';
            const matchesYear = filterYear === 'All' || contractYear === filterYear;

            // 4. Type Filter (Output vs Input)
            // Output = CIC is Side B (Provider/Seller)
            // Input = CIC is Side A (Buyer/Payer) - Simulation
            const isOutput = (contract.sideBName?.includes('CIC') || contract.sideBName?.includes('Công ty CP Công nghệ và Tư vấn CIC'));
            const isInput = !isOutput; // Simplified logic for now

            const matchesType =
                filterType === 'All' ? true :
                    filterType === 'Output' ? isOutput :
                        isInput;

            return matchesSearch && matchesStatus && matchesType && matchesYear;
        });
    }, [contracts, searchQuery, filterStatus, filterType, filterYear]);

    // --- EDIT CONTRACT HANDLERS ---
    const openEditContractModal = (contract: Contract, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setEditingContract(contract);
        setEditModalOpen(true);
    };

    const handleEditContract = async (updatedContract: Contract) => {
        const result = await ContractService.updateContract(updatedContract.id, updatedContract);
        if (result) {
            setContracts(prev => prev.map(c => c.id === updatedContract.id ? result : c));
            setEditModalOpen(false);
            setEditingContract(null);
            if (selectedContract?.id === updatedContract.id) {
                setSelectedContract(result);
            }
        }
    };

    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <Header title="Quản lý Hợp đồng & Thanh toán" breadcrumb="Trang chủ / Tài chính / Hợp đồng" />

            {selectedContract && (
                <ContractDetailModal
                    contract={selectedContract}
                    onClose={() => {
                        setSelectedContract(null);
                        ContractService.getContracts().then(data => setContracts(data));
                    }}
                />
            )}

            {/* --- EDIT CONTRACT MODAL --- */}
            {isEditModalOpen && editingContract && (
                <EditContractModal
                    contract={editingContract}
                    onClose={() => { setEditModalOpen(false); setEditingContract(null); }}
                    onSave={handleEditContract}
                />
            )}

            <main className="p-8 w-full">

                {/* Cashflow Dashboard Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <TrendingUp className="text-orange-600" size={20} /> Biểu đồ Dòng tiền (2025)
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">So sánh Kế hoạch thu (Kế hoạch) và Thực thu (Thực tế)</p>
                            </div>
                            <div className="flex gap-2">
                                <select className="text-sm border-gray-200 rounded-lg bg-gray-50 p-2 outline-none focus:ring-2 focus:ring-orange-500/20">
                                    <option>Năm 2025</option>
                                    <option>Năm 2024</option>
                                </select>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={CASHFLOW_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        tickFormatter={(value) => `${value / 1000000}M`}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value)}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ fill: '#f8fafc' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                    <Bar dataKey="plan" name="Kế hoạch" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} />
                                    <Bar dataKey="actual" name="Thực tế" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-6 rounded-2xl text-white shadow-lg shadow-orange-200">
                            <p className="text-orange-100 text-xs font-bold uppercase tracking-wider mb-2">Tổng doanh thu dự kiến</p>
                            <h3 className="text-3xl font-black mb-1">15.2 Tỷ ₫</h3>
                            <div className="flex items-center gap-2 text-xs text-orange-200 bg-orange-800/30 w-fit px-2 py-1 rounded-lg border border-orange-500/30">
                                <TrendingUpIcon /> +12.5% so với 2024
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-800 text-sm mb-4 uppercase tracking-wide">Trạng thái thanh toán</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500">Đã thu (62%)</span>
                                        <span className="font-bold text-emerald-600">9.4 Tỷ ₫</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500">Đang chờ (Công nợ)</span>
                                        <span className="font-bold text-amber-500">3.5 Tỷ ₫</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-500">Quá hạn ({'>'}30 ngày)</span>
                                        <span className="font-bold text-rose-500">1.2 Tỷ ₫</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-rose-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Contract Table */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterType('All')}
                                className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-lg border shadow-sm transition-colors
                        ${filterType === 'All' ? 'bg-white text-orange-700 border-orange-200' : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100'}`}
                            >
                                Tất cả
                            </button>
                            <button
                                onClick={() => setFilterType('Output')}
                                className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-lg border shadow-sm transition-colors
                        ${filterType === 'Output' ? 'bg-white text-orange-700 border-orange-200' : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100'}`}
                            >
                                Đầu ra (Doanh thu)
                            </button>
                            <button
                                onClick={() => setFilterType('Input')}
                                className={`px-4 py-2 font-bold text-xs uppercase tracking-wider rounded-lg border shadow-sm transition-colors
                        ${filterType === 'Input' ? 'bg-white text-orange-700 border-orange-200' : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100'}`}
                            >
                                Đầu vào (Chi phí)
                            </button>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm hợp đồng..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 w-64 shadow-sm"
                                />
                                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>

                            <select
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                className="bg-white border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:border-orange-500 shadow-sm"
                            >
                                <option value="All">Tất cả năm</option>
                                {uniqueYears.map(year => (
                                    <option key={year} value={year}>Năm {year}</option>
                                ))}
                            </select>

                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-white border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:border-orange-500 shadow-sm"
                            >
                                <option value="All">Tất cả trạng thái</option>
                                <option value={ContractStatus.ACTIVE}>Đang thực hiện</option>
                                <option value={ContractStatus.COMPLETED}>Hoàn thành</option>
                                <option value={ContractStatus.OVERDUE}>Quá hạn</option>
                            </select>

                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-all hover:border-orange-300 group" onClick={() => setImportType('Contract')}>
                                <Upload size={16} className="text-gray-400 group-hover:text-orange-500" /> Import HĐ
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-all hover:border-emerald-300 group" onClick={() => setImportType('Payment')}>
                                <FileSpreadsheet size={16} className="text-gray-400 group-hover:text-emerald-500" /> Import TT
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-orange-700 transition-all">
                                <Download size={16} /> Xuất Excel
                            </button>
                        </div>
                    </div>

                    {/* Import Modal Integration */}
                    {importType && (
                        <ImportModal
                            isOpen={!!importType}
                            onClose={() => setImportType(null)}
                            type={importType}
                            onImport={async (data) => {
                                console.log('Importing', importType, data);
                                if (importType === 'Contract') {
                                    for (const row of data) {
                                        await ContractService.createContract({
                                            id: `C-IMP-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                                            code: row.Code,
                                            projectName: row.ProjectCode ? `Dự án ${row.ProjectCode}` : 'Dự án Import', // Simple fallback
                                            projectId: row.ProjectCode,
                                            packageName: row.PackageName || 'Gói thầu Import',
                                            totalValue: Number(row.TotalValue) || 0,
                                            paidValue: 0,
                                            remainingValue: Number(row.TotalValue) || 0,
                                            sideAName: row.SideA || 'Chủ đầu tư',
                                            sideBName: 'CIC',
                                            status: row.Status === 'Hiệu lực' ? ContractStatus.ACTIVE : ContractStatus.DRAFT,
                                            signedDate: row.SignedDate
                                        } as any);
                                    }
                                    // Refresh
                                    const refreshed = await ContractService.getContracts();
                                    setContracts(refreshed);
                                } else if (importType === 'Payment') {
                                    // Import Transactions
                                    for (const row of data) {
                                        // Need to find contract by Code
                                        const contractCode = row.ContractCode;
                                        // Find ID. This is inefficient O(N^2) but fine for client-side small imports
                                        const contract = contracts.find(c => c.code === contractCode);
                                        if (contract) {
                                            await ContractService.addTransaction(contract.id, {
                                                id: `TRX-IMP-${Date.now()}`,
                                                amount: Number(row.Amount) || 0,
                                                description: row.Description || 'Thanh toán Import',
                                                paymentDate: row.Date,
                                                status: PaymentStatus.PAID,
                                                invoiceNumber: row.InvoiceNumber,
                                                paymentMethod: row.Method === 'Transfer' ? 'Transfer' : 'Cash'
                                            });
                                        }
                                    }
                                    // Refresh logic
                                    const refreshed = await ContractService.getContracts();
                                    setContracts(refreshed);
                                }
                            }}
                        />
                    )}

                    {filteredContracts.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-500 italic">Không tìm thấy hợp đồng nào phù hợp.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-white border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Mã Hợp Đồng</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Đối tác</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Giá trị (VNĐ)</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Trạng thái</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tiến độ TT</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">WIP</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredContracts.map((contract) => (
                                    <tr key={contract.id} className="hover:bg-orange-50/30 transition-colors group cursor-pointer" onClick={() => setSelectedContract(contract)}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-orange-600 group-hover:underline decoration-orange-300 underline-offset-2">{contract.code}</div>
                                            <div className="text-xs text-gray-400 font-medium mt-1">Ký ngày: {contract.signedDate}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500 uppercase">
                                                    {(contract.sideAName || '??').substring(0, 2)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-700 truncate max-w-[200px]">{contract.sideAName}</p>
                                                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{contract.projectName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-700">
                                            {formatCurrency(contract.totalValue)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border
                                        ${contract.status === ContractStatus.ACTIVE ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    contract.status === ContractStatus.OVERDUE ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                        'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                                {contract.status === ContractStatus.ACTIVE ? 'Đang thực hiện' :
                                                    contract.status === ContractStatus.OVERDUE ? 'Quá hạn' : contract.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="w-24 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className={`h-1.5 rounded-full ${contract.status === ContractStatus.OVERDUE ? 'bg-rose-500' : 'bg-orange-600'}`}
                                                        style={{ width: `${(contract.paidValue / contract.totalValue) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500">
                                                    {Math.round((contract.paidValue / contract.totalValue) * 100)}% ({formatCurrency(contract.paidValue)})
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-500 font-mono bg-gray-50/50 rounded-lg text-center mx-2">
                                            {contract.wipValue > 0 ? formatCurrency(contract.wipValue) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={(e) => openEditContractModal(contract, e)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all group-hover:opacity-100 opacity-0"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all group-hover:opacity-100 opacity-0">
                                                    <ArrowRight size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ContractList;
