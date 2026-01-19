import React, { useState, useEffect } from 'react';
import {
    FileText, Download, Printer, Share2, BarChart3, PieChart as PieChartIcon,
    TrendingUp, AlertCircle, CheckCircle, Calendar, DollarSign, Briefcase
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { ReportService } from '../services/report.service';
import { Project } from '../types';

interface ProjectReportsTabProps {
    project: Project;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ProjectReportsTab: React.FC<ProjectReportsTabProps> = ({ project }) => {
    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeReport, setActiveReport] = useState<'overview' | 'financial' | 'quality'>('overview');

    useEffect(() => {
        loadReportData();
    }, [project.id]);

    const loadReportData = async () => {
        setLoading(true);
        try {
            const data = await ReportService.getFullProjectReport(project.id);
            setReportData(data);
        } catch (error) {
            console.error('Error loading report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = (type: 'pdf' | 'excel') => {
        // Mock export function
        alert(`Đang xuất báo cáo ${activeReport} ra file ${type.toUpperCase()}...`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!reportData) return <div>Không có dữ liệu báo cáo.</div>;

    const { overview, financial, quality, legal } = reportData;

    // Prepare data for charts
    const costData = financial?.breakdown ? Object.entries(financial.breakdown).map(([name, value]) => ({ name, value })) : [];
    const qualityData = quality?.issuesTrend || [];

    const progressData = [
        { name: 'T1', plan: 10, actual: 10 },
        { name: 'T2', plan: 25, actual: 20 },
        { name: 'T3', plan: 45, actual: 40 },
        { name: 'T4', plan: 60, actual: 55 },
        { name: 'T5', plan: 80, actual: 75 },
        { name: 'T6', plan: 100, actual: overview.progress } // Current
    ];

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveReport('overview')}
                        className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-all ${activeReport === 'overview' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Tổng quan
                    </button>
                    <button
                        onClick={() => setActiveReport('financial')}
                        className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-all ${activeReport === 'financial' ? 'bg-white shadow text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Tài chính
                    </button>
                    <button
                        onClick={() => setActiveReport('quality')}
                        className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-all ${activeReport === 'quality' ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Chất lượng
                    </button>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => handleExport('pdf')} className="flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors">
                        <FileText size={14} /> PDF
                    </button>
                    <button onClick={() => handleExport('excel')} className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors">
                        <Download size={14} /> Excel
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">
                        <Printer size={14} /> In
                    </button>
                </div>
            </div>

            {/* OVERVIEW REPORT */}
            {activeReport === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tiến độ tổng thể</p>
                                    <h3 className="text-3xl font-black text-indigo-600 mt-2">{overview.progress}%</h3>
                                    <p className="text-xs text-gray-500 mt-1">Trạng thái: {overview.status}</p>
                                </div>
                                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-500">
                                    <TrendingUp size={24} />
                                </div>
                            </div>
                            <div className="mt-4 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${overview.progress}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Công việc</p>
                                    <h3 className="text-3xl font-black text-slate-800 mt-2">{overview.taskStats.completed}/{overview.taskStats.total}</h3>
                                    <p className="text-xs text-emerald-600 mt-1 font-bold">Hoàn thành {overview.taskStats.completionRate}%</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl text-slate-500">
                                    <Briefcase size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Ngân sách tiêu thụ</p>
                                    <h3 className="text-3xl font-black text-emerald-600 mt-2">{Math.round((financial.totalActual / financial.totalBudget) * 100)}%</h3>
                                    <p className="text-xs text-gray-500 mt-1">Còn lại: {(financial.variance / 1000000000).toFixed(1)} Tỷ</p>
                                </div>
                                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
                                    <DollarSign size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Vấn đề & Rủi ro</p>
                                    <h3 className="text-3xl font-black text-rose-600 mt-2">{quality.defectCount + overview.taskStats.overdue}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{overview.taskStats.overdue} quá hạn, {quality.defectCount} lỗi</p>
                                </div>
                                <div className="p-3 bg-rose-50 rounded-xl text-rose-500">
                                    <AlertCircle size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
                            <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <TrendingUp size={18} className="text-indigo-500" /> Biểu đồ tiến độ (S-Curve)
                            </h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={progressData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="name" fontSize={12} stroke="#94a3b8" />
                                    <YAxis fontSize={12} stroke="#94a3b8" />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="plan" name="Kế hoạch" stroke="#94a3b8" strokeWidth={2} dot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="actual" name="Thực tế" stroke="#6366f1" strokeWidth={3} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
                            <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <PieChartIcon size={18} className="text-emerald-500" /> Phân bổ chi phí
                            </h4>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={costData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        label
                                    >
                                        {costData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* FINANCIAL REPORT */}
            {activeReport === 'financial' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-lg text-slate-800">Báo cáo kiểm soát chi phí</h3>
                        <p className="text-sm text-gray-500">Cập nhật lúc: {new Date(reportData.generatedAt).toLocaleString('vi-VN')}</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Hạng mục chi phí</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Ngân sách (VNĐ)</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Thực tế (VNĐ)</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Chênh lệch</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">% SD</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {costData.map((item: any, index: number) => {
                                    const budget = 2500000000; // Mock breakdown budget
                                    const variance = budget - item.value;
                                    const percent = (item.value / budget) * 100;
                                    return (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                                            <td className="px-6 py-4 text-right text-gray-600">{new Intl.NumberFormat('vi-VN').format(budget)}</td>
                                            <td className="px-6 py-4 text-right font-bold text-slate-800">{new Intl.NumberFormat('vi-VN').format(item.value)}</td>
                                            <td className={`px-6 py-4 text-right font-bold ${variance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {new Intl.NumberFormat('vi-VN').format(variance)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${percent > 100 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                    {percent.toFixed(1)}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {/* Total Row */}
                                <tr className="bg-slate-50 font-black">
                                    <td className="px-6 py-4 text-slate-900">TỔNG CỘNG</td>
                                    <td className="px-6 py-4 text-right text-slate-900">{new Intl.NumberFormat('vi-VN').format(financial.totalBudget)}</td>
                                    <td className="px-6 py-4 text-right text-indigo-600">{new Intl.NumberFormat('vi-VN').format(financial.totalActual)}</td>
                                    <td className="px-6 py-4 text-right text-emerald-600">{new Intl.NumberFormat('vi-VN').format(financial.variance)}</td>
                                    <td className="px-6 py-4 text-center">
                                        {((financial.totalActual / financial.totalBudget) * 100).toFixed(1)}%
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* QUALITY REPORT */}
            {activeReport === 'quality' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase">Tổng lượt kiểm tra</p>
                                <p className="text-3xl font-black text-slate-800 mt-2">{quality.totalInspections}</p>
                            </div>
                            <BarChart3 size={32} className="text-indigo-400" />
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase">Tỷ lệ đạt</p>
                                <p className="text-3xl font-black text-emerald-600 mt-2">{quality.passRate}%</p>
                            </div>
                            <CheckCircle size={32} className="text-emerald-400" />
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs font-bold uppercase">Sự cố an toàn</p>
                                <p className="text-3xl font-black text-rose-600 mt-2">{quality.safetyIncidents}</p>
                            </div>
                            <AlertCircle size={32} className="text-rose-400" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h4 className="font-bold text-slate-800 mb-6">Biểu đồ xu hướng lỗi kỹ thuật</h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={qualityData.length > 0 ? qualityData : [{ date: 'T1', count: 0 }]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" fontSize={12} stroke="#94a3b8" />
                                <YAxis fontSize={12} stroke="#94a3b8" />
                                <Tooltip />
                                <Bar dataKey="count" name="Số lượng lỗi" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectReportsTab;
