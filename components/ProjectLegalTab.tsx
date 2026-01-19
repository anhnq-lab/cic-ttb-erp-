import React, { useState, useEffect } from 'react';
import {
    FileText, Shield, CheckCircle, AlertTriangle, XCircle, Clock,
    Plus, Download, Eye, Edit, Trash2, Calendar, Building2, Award,
    AlertCircle, TrendingUp, FileCheck, Search, Filter
} from 'lucide-react';
import { LegalService, LegalDocument, ComplianceCheck } from '../services/legal.service';
import { Project } from '../types';

interface ProjectLegalTabProps {
    project: Project;
}

const ProjectLegalTab: React.FC<ProjectLegalTabProps> = ({ project }) => {
    const [documents, setDocuments] = useState<LegalDocument[]>([]);
    const [checks, setChecks] = useState<ComplianceCheck[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<'documents' | 'compliance'>('documents');

    useEffect(() => {
        loadData();
    }, [project.id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [docs, compl, summ] = await Promise.all([
                LegalService.getLegalDocuments(project.id),
                LegalService.getComplianceChecks(project.id),
                LegalService.getLegalSummary(project.id)
            ]);
            setDocuments(docs);
            setChecks(compl);
            setSummary(summ);
        } catch (error) {
            console.error('Error loading legal data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'valid':
            case 'passed':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'pending':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'expired':
            case 'failed':
                return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'conditional':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'valid':
            case 'passed':
                return <CheckCircle size={14} />;
            case 'pending':
                return <Clock size={14} />;
            case 'expired':
            case 'failed':
                return <XCircle size={14} />;
            case 'conditional':
                return <AlertTriangle size={14} />;
            default:
                return <FileText size={14} />;
        }
    };

    const getDocumentTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            license: 'Giấy phép',
            permit: 'Phép',
            approval: 'Phê duyệt',
            certificate: 'Chứng nhận',
            contract: 'Hợp đồng'
        };
        return labels[type] || type;
    };

    const getCheckTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            safety: 'An toàn',
            environmental: 'Môi trường',
            quality: 'Chất lượng',
            legal: 'Pháp lý',
            financial: 'Tài chính'
        };
        return labels[type] || type;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tài liệu</p>
                            <p className="text-2xl font-black text-slate-800 mt-1">{summary?.totalDocuments || 0}</p>
                        </div>
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FileText size={20} className="text-indigo-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Kiểm tra</p>
                            <p className="text-2xl font-black text-slate-800 mt-1">{summary?.totalChecks || 0}</p>
                        </div>
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Shield size={20} className="text-emerald-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Điểm tuân thủ</p>
                            <p className="text-2xl font-black text-slate-800 mt-1">{summary?.complianceScore || 0}%</p>
                        </div>
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <TrendingUp size={20} className="text-amber-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Sắp hết hạn</p>
                            <p className="text-2xl font-black text-rose-600 mt-1">{summary?.expiringDocuments?.length || 0}</p>
                        </div>
                        <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center">
                            <AlertCircle size={20} className="text-rose-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-xl border border-gray-200 p-1.5 flex gap-1">
                <button
                    onClick={() => setActiveView('documents')}
                    className={`flex-1 py-2 px-4 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeView === 'documents'
                            ? 'bg-slate-900 text-white'
                            : 'text-gray-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                >
                    <FileText size={14} className="inline mr-2" />
                    Tài liệu pháp lý ({documents.length})
                </button>
                <button
                    onClick={() => setActiveView('compliance')}
                    className={`flex-1 py-2 px-4 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeView === 'compliance'
                            ? 'bg-slate-900 text-white'
                            : 'text-gray-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                >
                    <Shield size={14} className="inline mr-2" />
                    Kiểm tra tuân thủ ({checks.length})
                </button>
            </div>

            {/* Documents View */}
            {activeView === 'documents' && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-800">Tài liệu pháp lý</h3>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-indigo-700 transition-all flex items-center gap-2">
                            <Plus size={14} /> Thêm tài liệu
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {documents.map((doc) => (
                            <div key={doc.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${getStatusColor(doc.status)} border flex items-center gap-1`}>
                                                {getStatusIcon(doc.status)}
                                                {doc.status}
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-100 text-slate-700">
                                                {getDocumentTypeLabel(doc.document_type)}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-sm mb-1">{doc.document_name}</h4>
                                        {doc.document_number && (
                                            <p className="text-xs text-gray-600 mb-2">Số: {doc.document_number}</p>
                                        )}
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            {doc.issuing_authority && (
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <Building2 size={12} />
                                                    <span>{doc.issuing_authority}</span>
                                                </div>
                                            )}
                                            {doc.issue_date && (
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <Calendar size={12} />
                                                    <span>Cấp: {new Date(doc.issue_date).toLocaleDateString('vi-VN')}</span>
                                                </div>
                                            )}
                                            {doc.expiry_date && (
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <Clock size={12} />
                                                    <span>Hết hạn: {new Date(doc.expiry_date).toLocaleDateString('vi-VN')}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Xem">
                                            <Eye size={14} className="text-gray-600" />
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Tải xuống">
                                            <Download size={14} className="text-gray-600" />
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Sửa">
                                            <Edit size={14} className="text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Compliance View */}
            {activeView === 'compliance' && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-800">Kiểm tra tuân thủ</h3>
                        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-emerald-700 transition-all flex items-center gap-2">
                            <Plus size={14} /> Thêm kiểm tra
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {checks.map((check) => (
                            <div key={check.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${getStatusColor(check.status)} border flex items-center gap-1`}>
                                                {getStatusIcon(check.status)}
                                                {check.status}
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-100 text-slate-700">
                                                {getCheckTypeLabel(check.check_type)}
                                            </span>
                                            {check.score !== undefined && (
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black ${check.score >= 90 ? 'bg-emerald-100 text-emerald-700' :
                                                        check.score >= 75 ? 'bg-amber-100 text-amber-700' :
                                                            'bg-rose-100 text-rose-700'
                                                    }`}>
                                                    {check.score}đ
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-slate-800 text-sm mb-1">{check.check_name}</h4>
                                        <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Calendar size={12} />
                                                <span>{new Date(check.check_date).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            {check.inspector_organization && (
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <Award size={12} />
                                                    <span>{check.inspector_organization}</span>
                                                </div>
                                            )}
                                        </div>
                                        {check.findings && (
                                            <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">{check.findings}</p>
                                        )}
                                        {check.actions_required && (
                                            <div className="mt-2 flex items-start gap-2 text-xs text-orange-700 bg-orange-50 p-2 rounded">
                                                <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                                                <span>{check.actions_required}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-1">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Xem">
                                            <Eye size={14} className="text-gray-600" />
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Sửa">
                                            <Edit size={14} className="text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectLegalTab;
