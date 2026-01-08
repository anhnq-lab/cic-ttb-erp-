import React, { useState } from 'react';
import Header from '../components/Header';
import { FileText, Download, Filter, Calendar, BarChart2, PieChart, Users, CheckSquare, Printer, Share2 } from 'lucide-react';
import { PROJECTS } from '../constants';

type ReportType = 'progress' | 'finance' | 'quality' | 'hr';

const Reports = () => {
    const [reportType, setReportType] = useState<ReportType>('progress');
    const [selectedProject, setSelectedProject] = useState<string>('all');
    const [dateRange, setDateRange] = useState('this_month');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleExport = (format: 'pdf' | 'excel') => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            alert(`Đã xuất báo cáo ${reportType.toUpperCase()} định dạng ${format.toUpperCase()} thành công!`);
        }, 1500);
    };

    const renderReportPreview = () => {
        switch (reportType) {
            case 'progress':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex justify-between items-end border-b pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Báo cáo Tiến độ Dự án</h3>
                                <p className="text-slate-500">Kỳ báo cáo: Tháng 05/2025</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-slate-800">CIC CENTER</p>
                                <p className="text-xs text-slate-500">Ngày xuất: {new Date().toLocaleDateString('vi-VN')}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="text-xs font-bold text-blue-600 uppercase">Tổng dự án</p>
                                <p className="text-2xl font-bold text-slate-800">{PROJECTS.length}</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                                <p className="text-xs font-bold text-green-600 uppercase">Đúng tiến độ</p>
                                <p className="text-2xl font-bold text-slate-800">{PROJECTS.filter(p => p.progress >= 90).length}</p>
                            </div>
                            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                                <p className="text-xs font-bold text-red-600 uppercase">Chậm tiến độ</p>
                                <p className="text-2xl font-bold text-slate-800">{PROJECTS.filter(p => p.progress < 50).length}</p>
                            </div>
                        </div>

                        <table className="w-full text-sm text-left border rounded-lg overflow-hidden">
                            <thead className="bg-slate-100 uppercase text-xs font-bold text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Mã DA</th>
                                    <th className="px-4 py-3">Tên Dự án</th>
                                    <th className="px-4 py-3">Quản lý</th>
                                    <th className="px-4 py-3 text-center">Tiến độ</th>
                                    <th className="px-4 py-3">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {PROJECTS.map(p => (
                                    <tr key={p.id}>
                                        <td className="px-4 py-3 font-mono text-slate-600">{p.code}</td>
                                        <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                                        <td className="px-4 py-3">{p.manager}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`font-bold ${p.progress < 50 ? 'text-red-600' : 'text-green-600'}`}>
                                                {p.progress}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-slate-100 rounded text-xs">{p.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'finance':
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <BarChart2 size={48} className="mb-4 opacity-20" />
                        <p>Preview Báo cáo Tài chính đang được cập nhật...</p>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p>Chọn loại báo cáo để xem trước</p>
                    </div>
                );
        }
    };

    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <Header title="Báo cáo & Xuất bản" breadcrumb="Trang chủ / Báo cáo" />

            <div className="p-6 w-full mx-auto flex gap-6">
                {/* Sidebar Configuration */}
                <div className="w-80 space-y-6">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Filter size={18} className="text-indigo-500" /> Cấu hình Báo cáo
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Loại báo cáo</label>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setReportType('progress')}
                                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${reportType === 'progress' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm border' : 'hover:bg-gray-50 text-slate-600'}`}
                                    >
                                        <BarChart2 size={18} /> Tiến độ Dự án
                                    </button>
                                    <button
                                        onClick={() => setReportType('finance')}
                                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${reportType === 'finance' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm border' : 'hover:bg-gray-50 text-slate-600'}`}
                                    >
                                        <PieChart size={18} /> Tài chính & Dòng tiền
                                    </button>
                                    <button
                                        onClick={() => setReportType('quality')}
                                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${reportType === 'quality' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm border' : 'hover:bg-gray-50 text-slate-600'}`}
                                    >
                                        <CheckSquare size={18} /> Chất lượng (QA/QC)
                                    </button>
                                    <button
                                        onClick={() => setReportType('hr')}
                                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${reportType === 'hr' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm border' : 'hover:bg-gray-50 text-slate-600'}`}
                                    >
                                        <Users size={18} /> Hiệu suất Nhân sự
                                    </button>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phạm vi dữ liệu</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg text-sm mb-3"
                                    value={selectedProject}
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                >
                                    <option value="all">Tất cả Dự án</option>
                                    {PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                >
                                    <option value="this_month">Tháng này</option>
                                    <option value="last_month">Tháng trước</option>
                                    <option value="q1">Quý 1/2025</option>
                                    <option value="ytd">Đầu năm đến nay (YTD)</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => handleExport('pdf')}
                                disabled={isGenerating}
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 mb-3"
                            >
                                {isGenerating ? <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div> : <Download size={18} />}
                                Xuất PDF
                            </button>
                            <button
                                onClick={() => handleExport('excel')}
                                disabled={isGenerating}
                                className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                            >
                                <FileText size={18} className="text-green-600" /> Xuất Excel
                            </button>
                        </div>
                    </div>
                </div>

                {/* Report Preview */}
                <div className="flex-1 space-y-6">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 min-h-[600px] print:shadow-none">
                        {renderReportPreview()}
                    </div>

                    <div className="flex justify-end gap-3">
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-slate-600 hover:bg-gray-50 flex items-center gap-2">
                            <Printer size={16} /> In
                        </button>
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-slate-600 hover:bg-gray-50 flex items-center gap-2">
                            <Share2 size={16} /> Chia sẻ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
