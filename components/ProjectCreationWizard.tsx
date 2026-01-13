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
            // Remove empty manager to prevent FK violation
            const projectData = { ...formData };
            if (!projectData.manager) {
                delete (projectData as any).manager;
            }

            // Create Project (will auto-generate tasks)
            const newProject = await ProjectService.createProject(projectData as Project);

            if (newProject) {
                console.log('✅ Project created with auto-generated tasks!');
                onSuccess(newProject);
                onClose();
                // Reset form
                setStep(1);
                setFormData({
                    name: '',
                    code: '',
                    client: '',
                    manager: '',
                    capitalSource: 'NonStateBudget',
                    status: 'Lập kế hoạch' as any,
                    progress: 0,
                    budget: 0
                });
            } else {
                alert('Không thể tạo dự án. Vui lòng kiểm tra Supabase logs hoặc browser console.');
            }
        } catch (error: any) {
            console.error("Creation failed", error);
            const errorMsg = error?.message || error?.toString() || 'Unknown error';
            alert(`Lỗi tạo dự án:\n${errorMsg}\n\nVui lòng check console để biết chi tiết.`);
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
                            Thông tin Dự án
                        </div>
                        <div className="w-12 h-0.5 bg-gray-200"></div>
                        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 2 ? 'bg-orange-100' : 'bg-gray-200'}`}>2</div>
                            Xác nhận
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {step === 1 && (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tên Dự án <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="VD: Khu Công nghiệp Trấn Yên"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Mã Dự án <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                                    placeholder="VD: PRJ-001"
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
                                <label className="block text-sm font-bold text-gray-700 mb-1">Địa điểm</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="VD: Yên Bái"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Quản lý dự án (PM)</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={formData.manager}
                                    onChange={e => setFormData({ ...formData, manager: e.target.value })}
                                    placeholder="Tên PM..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Ngân sách (VND)</label>
                                <input
                                    type="number"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={formData.budget}
                                    onChange={e => setFormData({ ...formData, budget: Number(e.target.value) })}
                                    placeholder="500000000"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-1">Deadline</label>
                                <input
                                    type="date"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={formData.deadline}
                                    onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 animate-bounce-subtle">
                                <Check size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Sẵn sàng khởi tạo!</h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-8">
                                Hệ thống sẽ tạo dự án <strong>{formData.name}</strong> và tự động sinh ra <strong>20 công việc</strong> theo quy trình BIM chuẩn.
                            </p>

                            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 max-w-lg mx-auto text-left">
                                <h4 className="font-bold text-orange-800 mb-2 uppercase text-xs tracking-wider">Các giai đoạn tự động:</h4>
                                <ul className="space-y-2">
                                    <li className="text-sm text-gray-700 flex items-center gap-2">
                                        <ChevronRight size={14} className="text-orange-500" /> Xúc tiến Dự án <span className="text-gray-400 text-xs">(3 tasks)</span>
                                    </li>
                                    <li className="text-sm text-gray-700 flex items-center gap-2">
                                        <ChevronRight size={14} className="text-orange-500" /> Báo giá <span className="text-gray-400 text-xs">(3 tasks)</span>
                                    </li>
                                    <li className="text-sm text-gray-700 flex items-center gap-2">
                                        <ChevronRight size={14} className="text-orange-500" /> Chuẩn bị Triển khai <span className="text-gray-400 text-xs">(3 tasks)</span>
                                    </li>
                                    <li className="text-sm text-gray-700 flex items-center gap-2">
                                        <ChevronRight size={14} className="text-orange-500" /> Triển khai BIM <span className="text-gray-400 text-xs">(5 tasks)</span>
                                    </li>
                                    <li className="text-sm text-gray-700 flex items-center gap-2">
                                        <ChevronRight size={14} className="text-orange-500" /> Bàn giao <span className="text-gray-400 text-xs">(6 tasks)</span>
                                    </li>
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

                    {step < 2 ? (
                        <button
                            onClick={handleNext}
                            disabled={!formData.name || !formData.code}
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
