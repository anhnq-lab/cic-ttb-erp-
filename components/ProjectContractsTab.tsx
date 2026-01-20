import React, { useState, useEffect } from 'react';
import {
    FileText, Download, Plus, Calendar, DollarSign,
    Building2, User as UserIcon, Scale, FileCheck,
    ChevronDown, ChevronUp, AlertCircle, CheckCircle, Clock
} from 'lucide-react';
import { ContractService, ContractAmendment } from '../services/contract.service';
import { Project, Contract, ContractStatus } from '../types';
import ContractModal from './ContractModal';

interface ProjectContractsTabProps {
    project: Project;
}

const ProjectContractsTab: React.FC<ProjectContractsTabProps> = ({ project }) => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedContract, setExpandedContract] = useState<string | null>(null);
    const [amendments, setAmendments] = useState<Record<string, ContractAmendment[]>>({});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<Contract | undefined>(undefined);

    useEffect(() => {
        loadContracts();
    }, [project.id]);

    const loadContracts = async () => {
        setLoading(true);
        try {
            const data = await ContractService.getContractsByProject(project.id);
            setContracts(data);
            if (data.length > 0) {
                setExpandedContract(data[0].id);
                // Load amendments for all contracts
                const amendmentsMap: Record<string, ContractAmendment[]> = {};
                await Promise.all(data.map(async (c) => {
                    amendmentsMap[c.id] = await ContractService.getAmendments(c.id);
                }));
                setAmendments(amendmentsMap);
            }
        } catch (error) {
            console.error('Error loading contracts:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleContract = (id: string) => {
        setExpandedContract(expandedContract === id ? null : id);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    const handleOpenCreate = () => {
        setSelectedContract(undefined);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (contract: Contract, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedContract(contract);
        setIsModalOpen(true);
    };

    const handleSaveContract = async (contractData: Partial<Contract>) => {
        if (selectedContract) {
            // Update
            const updated = await ContractService.updateContract(selectedContract.id, contractData);
            if (updated) {
                setContracts(prev => prev.map(c => c.id === updated.id ? updated : c));
            }
        } else {
            // Create
            const newContract = { ...contractData, projectId: project.id } as Contract;
            const created = await ContractService.createContract(newContract);
            if (created) {
                setContracts(prev => [created, ...prev]);
            }
        }
        setIsModalOpen(false);
    };

    const handleDeleteContract = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Bạn có chắc chắn muốn xóa hợp đồng này? Hành động này không thể hoàn tác.')) {
            await ContractService.deleteContract(id);
            setContracts(prev => prev.filter(c => c.id !== id));
            if (expandedContract === id) setExpandedContract(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (contracts.length === 0) {
        return (
            <>
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <FileText className="mx-auto text-gray-400 mb-2" size={48} />
                    <p className="text-gray-500 font-medium">Chưa có hợp đồng nào cho dự án này.</p>
                    <button
                        onClick={handleOpenCreate}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow hover:bg-indigo-700 transition-all"
                    >
                        Thêm hợp đồng
                    </button>
                </div>
                <ContractModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveContract}
                    contract={selectedContract}
                    projectId={project.id}
                />
            </>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800">Quản lý Hợp đồng</h3>
                <button
                    onClick={handleOpenCreate}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                    <Plus size={16} /> Tạo hợp đồng mới
                </button>
            </div>

            <div className="space-y-4">
                {contracts.map(contract => (
                    <div key={contract.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                        {/* Contract Header */}
                        <div
                            className="p-5 flex items-center justify-between cursor-pointer bg-slate-50 border-b border-gray-100"
                            onClick={() => toggleContract(contract.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl border border-gray-200 text-indigo-600">
                                    <FileCheck size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-slate-800 text-lg">{contract.code}</h4>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(contract.status)}`}>
                                            {contract.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{contract.packageName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right hidden md:block">
                                    <p className="text-xs text-gray-400 font-bold uppercase">Giá trị hợp đồng</p>
                                    <p className="text-lg font-black text-slate-800">{formatCurrency(contract.totalValue)}</p>
                                </div>
                                <div className="text-right hidden md:block">
                                    <p className="text-xs text-gray-400 font-bold uppercase">Đã thanh toán</p>
                                    <p className={`text-lg font-black ${contract.paidValue > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        {formatCurrency(contract.paidValue)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => handleOpenEdit(contract, e)}
                                        className="p-2 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                        title="Chỉnh sửa"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteContract(contract.id, e)}
                                        className="p-2 hover:bg-rose-100 text-rose-600 rounded-full transition-colors"
                                        title="Xóa"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                                    </button>
                                </div>
                                {expandedContract === contract.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                            </div>
                        </div>

                        {expandedContract === contract.id && (
                            <div className="p-6 space-y-8 animate-fade-in">
                                {/* General Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h5 className="font-bold text-slate-800 flex items-center gap-2 text-sm border-b pb-2">
                                            <Building2 size={16} className="text-indigo-500" /> Thông tin chung
                                        </h5>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500 text-xs">Ngày ký</p>
                                                <p className="font-semibold text-slate-800">{new Date(contract.signedDate!).toLocaleDateString('vi-VN')}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Thời hạn</p>
                                                <p className="font-semibold text-slate-800">{contract.duration} ngày</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Loại hợp đồng</p>
                                                <p className="font-semibold text-slate-800">{contract.contractType}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Hình thức</p>
                                                <p className="font-semibold text-slate-800">{contract.deliveryMethod}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h5 className="font-bold text-slate-800 flex items-center gap-2 text-sm border-b pb-2">
                                            <UserIcon size={16} className="text-indigo-500" /> Các bên tham gia
                                        </h5>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500 text-xs">Bên A (Chủ đầu tư)</p>
                                                <p className="font-semibold text-slate-800">{contract.sideAName}</p>
                                                <p className="text-xs text-gray-500">Đại diện: {contract.sideARep}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-xs">Bên B (Nhà thầu)</p>
                                                <p className="font-semibold text-slate-800">{contract.sideBName}</p>
                                                <p className="text-xs text-gray-500">Đại diện: {contract.sideBRep}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Progress */}
                                <div>
                                    <h5 className="font-bold text-slate-800 flex items-center gap-2 text-sm border-b pb-2 mb-4">
                                        <DollarSign size={16} className="text-emerald-500" /> Tiến độ thanh toán
                                    </h5>

                                    {/* Progress Bar */}
                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span className="text-emerald-600">Đã thanh toán: {((contract.paidValue / contract.totalValue) * 100).toFixed(1)}%</span>
                                            <span className="text-gray-500">Còn lại: {((contract.remainingValue / contract.totalValue) * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${(contract.paidValue / contract.totalValue) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Milestones Table */}
                                    <div className="overflow-x-auto border border-gray-100 rounded-lg">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-bold">
                                                <tr>
                                                    <th className="px-4 py-3">Giai đoạn</th>
                                                    <th className="px-4 py-3">Điều kiện</th>
                                                    <th className="px-4 py-3 text-right">Giá trị (VNĐ)</th>
                                                    <th className="px-4 py-3 text-center">Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {contract.paymentMilestones.map(ms => (
                                                    <tr key={ms.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 font-medium text-slate-800">{ms.phase}</td>
                                                        <td className="px-4 py-3 text-gray-600">{ms.condition}</td>
                                                        <td className="px-4 py-3 text-right font-bold text-slate-800">{formatCurrency(ms.amount)}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${String(ms.status) === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                                                                String(ms.status) === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-gray-100 text-gray-600'
                                                                }`}>
                                                                {String(ms.status)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Amendments */}
                                <div>
                                    <div className="flex justify-between items-center border-b pb-2 mb-4">
                                        <h5 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
                                            <FileText size={16} className="text-indigo-500" /> Phụ lục hợp đồng
                                        </h5>
                                        <button className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center gap-1">
                                            <Plus size={12} /> Thêm phụ lục
                                        </button>
                                    </div>

                                    {amendments[contract.id] && amendments[contract.id].length > 0 ? (
                                        <div className="space-y-3">
                                            {amendments[contract.id].map(am => (
                                                <div key={am.id} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100 hover:border-indigo-200 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xs border border-indigo-100">
                                                            {String(am.amendmentNumber).padStart(2, '0')}
                                                        </div>
                                                        <div>
                                                            <h6 className="text-sm font-bold text-slate-800">Phụ lục số {am.amendmentNumber}</h6>
                                                            <p className="text-xs text-slate-500">{new Date(am.amendmentDate).toLocaleDateString('vi-VN')} - {am.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`text-sm font-bold ${am.valueChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                            {am.valueChange > 0 ? '+' : ''}{formatCurrency(am.valueChange)}
                                                        </p>
                                                        <p className="text-xs text-gray-500">Sau ĐC: {formatCurrency(am.newTotalValue)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                            <p className="text-sm text-gray-500">Chưa có phụ lục điều chỉnh nào.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <ContractModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveContract}
                contract={selectedContract}
                projectId={project.id}
            />
        </div>
    );
};

export default ProjectContractsTab;
