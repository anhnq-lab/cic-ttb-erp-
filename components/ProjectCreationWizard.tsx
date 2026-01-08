import React, { useState, useEffect } from 'react';
import { ProjectService } from '../services/project.service';
import { Project, ProjectTemplate } from '../types';
import { X, Layers, Check, ChevronRight, Layout, ArrowRight } from 'lucide-react';

interface ProjectCreationWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newProject: Project) => void;
}

const ProjectCreationWizard: React.FC<ProjectCreationWizardProps> = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Project>>({
        name: '',
        code: '',
        client: '',
        manager: '',
        capitalSource: 'NonStateBudget',
        status: 'Lập kế hoạch' as any,
        progress: 0,
        budget: 0
    });

    useEffect(() => {
        if (isOpen) {
            loadTemplates();
        }
    }, [isOpen]);

    const loadTemplates = async () => {
        try {
            const data = await ProjectService.getProjectTemplates();
            setTemplates(data || []);
        } catch (error) {
            console.error("Failed to load templates", error);
        }
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // 1. Create Project
            const newProject = await ProjectService.createProject(formData as Project);

            if (newProject && selectedTemplate) {
                // 2. Generate WBS from Template
                await ProjectService.createTasksFromTemplate(newProject.id, selectedTemplate);
                onSuccess(newProject);
                onClose();
            }
        } catch (error) {
            console.error("Creation failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-600 to-rose-600 p-6 flex justify-between items-center text-white shrink-0">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Layout size={24} /> Khởi tạo Dự án Thông minh
                        </h2>
                        <p className="text-orange-100 text-sm mt-1">Hệ thống tự động thiết lập quy trình chuẩn (EDT Standard)</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Steps Progress */}
                <div className="bg-gray-50 border-b border-gray-100 p-4 shrink-0">
                    <div className="flex items-center justify-center gap-4">
                        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 1 ? 'bg-orange-100' : 'bg-gray-200'}`}>1</div>
                            Chọn Template
                        </div>
                        <div className="w-12 h-0.5 bg-gray-200"></div>
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 2 ? 'bg-orange-100' : 'bg-gray-200'}`}>2</div>
                            Thông tin Dự án
                        </div>
                        <div className="w-12 h-0.5 bg-gray-200"></div>
                        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 3 ? 'bg-orange-100' : 'bg-gray-200'}`}>3</div>
                            Xác nhận
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {templates.map(tpl => (
                                <div
                                    key={tpl.id}
                                    onClick={() => setSelectedTemplate(tpl)}
                                    className={`border-2 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all relative ${selectedTemplate?.id === tpl.id ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-orange-200'}`}
                                >
                                    {selectedTemplate?.id === tpl.id && (
                                        <div className="absolute top-4 right-4 bg-orange-500 text-white p-1 rounded-full"><Check size={16} /></div>
                                    )}
                                    <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center mb-4 text-orange-600">
                                        <Layers size={24} />
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-lg mb-2">{tpl.name}</h3>
                                    <span className="text-xs font-bold uppercase tracking-wider bg-gray-200 text-gray-600 px-2 py-1 rounded">{tpl.type}</span>
                                    <p className="text-sm text-gray-500 mt-3 line-clamp-2">{tpl.description}</p>
                                </div>
                            ))}
                            {templates.length === 0 && (
                                <div className="col-span-2 text-center py-10 text-gray-400">
                                    <p>Chưa có Template nào. Vui lòng chạy Seed Data.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tên Dự án <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="VD: Chung cư Cao cấp VinHome..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Mã Dự án <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                                    placeholder="VD: 25099"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Khách hàng</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={formData.client}
                                    onChange={e => setFormData({ ...formData, client: e.target.value })}
                                    placeholder="Tên CĐT..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nguồn vốn</label>
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={formData.capitalSource}
                                    onChange={e => setFormData({ ...formData, capitalSource: e.target.value as any })}
                                >
                                    <option value="StateBudget">Vốn Ngân Sách (Nhà nước)</option>
                                    <option value="NonStateBudget">Vốn Ngoài Ngân Sách (Tư nhân)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Quản trị dự án (PM)</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={formData.manager}
                                    onChange={e => setFormData({ ...formData, manager: e.target.value })}
                                    placeholder="Tên PM..."
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-bounce-subtle">
                                <Check size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Sẵn sàng khởi tạo!</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-8">
                                Hệ thống sẽ tạo dự án <strong>{formData.name}</strong> và tự động sinh ra cấu trúc công việc (WBS) dựa trên template <strong>{selectedTemplate?.name}</strong>.
                            </p>

                            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 max-w-lg mx-auto text-left">
                                <h4 className="font-bold text-orange-800 mb-2 uppercase text-xs tracking-wider">Review Cấu trúc WBS:</h4>
                                <ul className="space-y-2">
                                    {selectedTemplate?.phases.map((p, i) => (
                                        <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                                            <ChevronRight size={14} className="text-orange-500" /> {p.name} <span className="text-gray-400 text-xs">({p.tasks.length} tasks)</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between shrink-0">
                    {step > 1 ? (
                        <button onClick={handleBack} className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition-colors">
                            Quay lại
                        </button>
                    ) : <div></div>}

                    {step < 3 ? (
                        <button
                            onClick={handleNext}
                            disabled={step === 1 && !selectedTemplate}
                            className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Tiếp tục <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="px-8 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/30 flex items-center gap-2"
                        >
                            {isLoading ? 'Đang xử lý...' : 'Xác nhận & Khởi tạo'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectCreationWizard;
