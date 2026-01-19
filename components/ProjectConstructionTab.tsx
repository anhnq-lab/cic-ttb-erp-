import React, { useState, useEffect } from 'react';
import {
    HardHat, ClipboardCheck, Calendar, Thermometer, Users,
    AlertTriangle, CheckCircle, XCircle, Camera, Plus,
    Hammer, Truck, Clock, Eye, Edit, Trash2, Shield
} from 'lucide-react';
import { ConstructionService, ConstructionLog, QualityInspection } from '../services/construction.service';
import { Project } from '../types';

interface ProjectConstructionTabProps {
    project: Project;
}

const ProjectConstructionTab: React.FC<ProjectConstructionTabProps> = ({ project }) => {
    const [activeView, setActiveView] = useState<'logs' | 'inspections'>('logs');
    const [logs, setLogs] = useState<ConstructionLog[]>([]);
    const [inspections, setInspections] = useState<QualityInspection[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [project.id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [logsData, insData, summData] = await Promise.all([
                ConstructionService.getLogs(project.id),
                ConstructionService.getInspections(project.id),
                ConstructionService.getConstructionSummary(project.id)
            ]);
            setLogs(logsData);
            setInspections(insData);
            setSummary(summData);
        } catch (error) {
            console.error('Error loading construction data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getResultColor = (result: string) => {
        switch (result) {
            case 'passed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'failed': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'conditional': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getResultIcon = (result: string) => {
        switch (result) {
            case 'passed': return <CheckCircle size={14} />;
            case 'failed': return <XCircle size={14} />;
            case 'conditional': return <AlertTriangle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
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
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Nhật ký</p>
                            <p className="text-2xl font-black text-slate-800 mt-1">{summary?.totalLogs || 0}</p>
                        </div>
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <HardHat size={20} className="text-orange-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Nghiệm thu</p>
                            <p className="text-2xl font-black text-slate-800 mt-1">{summary?.totalInspections || 0}</p>
                        </div>
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <ClipboardCheck size={20} className="text-indigo-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">An toàn</p>
                            <p className="text-2xl font-black text-emerald-600 mt-1">{summary?.safeDays || 0} ngày</p>
                        </div>
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Shield size={20} className="text-emerald-600" /> {/* Shield not imported, using AlertTriangle as placeholder if Shield missing in imports, but wait I added imports? Ah I forgot Shield in imports list above. Fixed now.*/}
                            <AlertTriangle size={20} className="text-emerald-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Nhân lực TB</p>
                            <p className="text-2xl font-black text-slate-800 mt-1">{summary?.avgWorkers || 0}</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-xl border border-gray-200 p-1.5 flex gap-1">
                <button
                    onClick={() => setActiveView('logs')}
                    className={`flex-1 py-2 px-4 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeView === 'logs'
                        ? 'bg-slate-900 text-white'
                        : 'text-gray-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                >
                    <Hammer size={14} className="inline mr-2" />
                    Nhật ký thi công
                </button>
                <button
                    onClick={() => setActiveView('inspections')}
                    className={`flex-1 py-2 px-4 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeView === 'inspections'
                        ? 'bg-slate-900 text-white'
                        : 'text-gray-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                >
                    <ClipboardCheck size={14} className="inline mr-2" />
                    Nghiệm thu & Chất lượng
                </button>
            </div>

            {/* Construction Logs View */}
            {activeView === 'logs' && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-800">Nhật ký hàng ngày</h3>
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-orange-700 transition-all flex items-center gap-2">
                            <Plus size={14} /> Ghi nhật ký
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {logs.map((log) => (
                            <div key={log.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-700 flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(log.log_date).toLocaleDateString('vi-VN')}
                                        </span>
                                        <span className="px-2 py-1 bg-blue-50 rounded text-xs font-bold text-blue-700 flex items-center gap-1">
                                            <Thermometer size={12} />
                                            {log.temperature}°C - {log.weather}
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"><Eye size={14} /></button>
                                        <button className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-blue-600"><Edit size={14} /></button>
                                    </div>
                                </div>

                                <h4 className="font-bold text-slate-800 text-sm mb-2">{log.work_completed}</h4>

                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-2">
                                    <div className="flex items-center gap-1.5">
                                        <Users size={14} className="text-indigo-500" />
                                        <span className="font-semibold">{log.workers_count}</span> nhân công
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Truck size={14} className="text-orange-500" />
                                        <span className="truncate">{log.equipment_used?.join(', ') || 'Không sử dụng máy móc'}</span>
                                    </div>
                                </div>

                                {log.issues && (
                                    <div className="bg-rose-50 border border-rose-100 rounded-lg p-2 flex gap-2 items-start mt-2">
                                        <AlertTriangle size={14} className="text-rose-600 shrink-0 mt-0.5" />
                                        <p className="text-xs text-rose-700">{log.issues}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Inspections View */}
            {activeView === 'inspections' && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-800">Biên bản nghiệm thu</h3>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-indigo-700 transition-all flex items-center gap-2">
                            <Plus size={14} /> Tạo biên bản
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {inspections.map((ins) => (
                            <div key={ins.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase border flex items-center gap-1 ${getResultColor(ins.result)}`}>
                                            {getResultIcon(ins.result)}
                                            {ins.result === 'passed' ? 'Đạt' : ins.result === 'failed' ? 'Không đạt' : 'Có điều kiện'}
                                        </span>
                                        <span className="text-xs font-bold text-slate-700">{ins.inspection_type}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 font-medium">
                                        {new Date(ins.inspection_date).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mb-2">
                                    <span className="font-semibold text-slate-800">Vị trí:</span> {ins.location}
                                </p>

                                {ins.findings && (
                                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded mb-2">
                                        {ins.findings}
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mt-2">
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold">
                                            {ins.inspector_name?.charAt(0)}
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500">Giám sát: {ins.inspector_name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectConstructionTab;
