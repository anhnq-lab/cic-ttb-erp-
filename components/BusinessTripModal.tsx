import React, { useState } from 'react';
import {
    X, Calendar, MapPin, Users, DollarSign,
    Briefcase, FileText, Plus, Trash2, Save,
    Plane, Hotel, Coffee, UserPlus, Clock,
    CheckCircle, AlertCircle
} from 'lucide-react';
import { Employee } from '../types';
import { EMPLOYEES } from '../constants';

interface BusinessTripModalProps {
    onClose: () => void;
}

// --- MOCK DATA FOR MENTIONS (Simulating Database) ---
const SUGGESTIONS = EMPLOYEES.map(e => ({ id: e.id, name: e.name, role: e.role, avatar: e.avatar }));

const BusinessTripModal: React.FC<BusinessTripModalProps> = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        // Step 1: General Info
        title: '',
        destination: '',
        purpose: '',
        startDate: '',
        endDate: '',

        // Step 2: Personnel
        leader: null as any,
        members: [] as any[],

        // Step 3: Itinerary
        itinerary: [
            { date: '', time: '08:00', activity: '', location: '', note: '' }
        ],

        // Step 4: Budget
        budget: [
            { type: 'transport', description: 'Vé máy bay', amount: 0, note: '' },
            { type: 'hotel', description: 'Khách sạn', amount: 0, note: '' },
            { type: 'perdiem', description: 'Công tác phí', amount: 0, note: '' }
        ]
    });

    // --- HANDLERS ---
    const updateForm = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

    const handleMemberAdd = (employee: any) => {
        if (!form.members.find(m => m.id === employee.id)) {
            updateForm('members', [...form.members, employee]);
        }
    };

    const handleItineraryAdd = () => {
        updateForm('itinerary', [...form.itinerary, { date: form.startDate, time: '08:00', activity: '', location: '', note: '' }]);
    };

    const handleBudgetAdd = () => {
        updateForm('budget', [...form.budget, { type: 'other', description: '', amount: 0, note: '' }]);
    };

    const totalBudget = form.budget.reduce((sum, item) => sum + Number(item.amount), 0);

    // --- RENDER STEPS ---

    const renderStep1 = () => (
        <div className="space-y-6 animate-fade-in-up">
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex gap-3 items-start">
                <InfoIcon className="text-orange-600 mt-0.5 shrink-0" size={18} />
                <div className="text-sm text-orange-800">
                    <p className="font-bold mb-1">Quy định công tác trích dẫn:</p>
                    <ul className="list-disc list-inside space-y-1 opacity-80">
                        <li>Vui lòng tham khảo file: <strong>"QĐ quy che va thu tuc di cong tac (7).pdf"</strong> để biết định mức chi tiêu.</li>
                        <li>Kế hoạch phải được lập trước ít nhất <strong>03 ngày</strong> làm việc.</li>
                    </ul>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tên kế hoạch / Chuyến đi <span className="text-red-500">*</span></label>
                    <input autoFocus type="text" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold text-slate-800"
                        placeholder="VD: Công tác giám sát thi công tại Nghệ An"
                        value={form.title} onChange={e => updateForm('title', e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Địa điểm công tác <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input type="text" className="w-full pl-10 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                placeholder="Tỉnh / Thành phố..."
                                value={form.destination} onChange={e => updateForm('destination', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mục đích <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <select className="w-full pl-10 p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                value={form.purpose} onChange={e => updateForm('purpose', e.target.value)}
                            >
                                <option value="">-- Chọn mục đích --</option>
                                <option value="project">Triển khai Dự án</option>
                                <option value="sale">Xúc tiến kinh doanh (Sales)</option>
                                <option value="meeting">Họp / Hội thảo</option>
                                <option value="training">Đào tạo</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày bắt đầu</label>
                        <input type="date" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            value={form.startDate} onChange={e => updateForm('startDate', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày kết thúc (Dự kiến)</label>
                        <input type="date" className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            value={form.endDate} onChange={e => updateForm('endDate', e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Select Personnel */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 max-h-[400px] overflow-y-auto custom-scrollbar">
                    <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <SearchIcon size={16} /> Danh sách nhân sự
                    </h4>
                    <div className="space-y-2">
                        {SUGGESTIONS.map(emp => (
                            <div key={emp.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-orange-300 cursor-pointer transition-all group"
                                onClick={() => handleMemberAdd(emp)}
                            >
                                <div className="flex items-center gap-3">
                                    <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full bg-gray-200" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{emp.name}</p>
                                        <p className="text-xs text-gray-500">{emp.role}</p>
                                    </div>
                                </div>
                                <Plus size={16} className="text-gray-400 group-hover:text-orange-600" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Selected List */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Trưởng đoàn (Leader)</label>
                        {form.leader ? (
                            <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={form.leader.avatar} alt="" className="w-10 h-10 rounded-full" />
                                        <span className="absolute -bottom-1 -right-1 bg-orange-500 text-white p-0.5 rounded-full border border-white">
                                            <CheckCircle size={10} />
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{form.leader.name}</p>
                                        <p className="text-xs text-orange-600 font-bold uppercase tracking-wider">Trưởng đoàn</p>
                                    </div>
                                </div>
                                <button onClick={() => updateForm('leader', null)} className="text-gray-400 hover:text-red-500"><X size={18} /></button>
                            </div>
                        ) : (
                            <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-400 text-sm italic">
                                Chưa chọn trưởng đoàn. Vui lòng chọn từ danh sách bên trái.
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Thành viên ({form.members.length})</label>
                        <div className="space-y-2">
                            {form.members.map((mem, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <img src={mem.avatar} alt="" className="w-8 h-8 rounded-full" />
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{mem.name}</p>

                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!form.leader && (
                                            <button onClick={() => updateForm('leader', mem)} className="text-xs font-bold text-orange-600 hover:bg-orange-50 px-2 py-1 rounded">Set Leader</button>
                                        )}
                                        <button onClick={() => updateForm('members', form.members.filter(m => m.id !== mem.id))} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
                                    </div>
                                </div>
                            ))}
                            {form.members.length === 0 && (
                                <p className="text-sm text-gray-400 italic">Chưa có thành viên nào.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-800">Chi tiết lịch trình</h4>
                <button onClick={handleItineraryAdd} className="flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-50 px-3 py-2 rounded-lg hover:bg-orange-100">
                    <Plus size={16} /> Thêm hoạt động
                </button>
            </div>

            <div className="space-y-4">
                {form.itinerary.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm group">
                        <div className="flex flex-col gap-2 w-32 shrink-0">
                            <input type="date" className="p-2 border rounded-lg text-xs"
                                value={item.date} onChange={e => {
                                    const newItinerary = [...form.itinerary];
                                    newItinerary[idx].date = e.target.value;
                                    updateForm('itinerary', newItinerary);
                                }}
                            />
                            <input type="time" className="p-2 border rounded-lg text-xs font-bold text-slate-700"
                                value={item.time} onChange={e => {
                                    const newItinerary = [...form.itinerary];
                                    newItinerary[idx].time = e.target.value;
                                    updateForm('itinerary', newItinerary);
                                }}
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <input type="text" className="w-full p-2 border border-gray-200 rounded-lg text-sm font-bold placeholder-gray-400 focus:border-orange-500 focus:ring-0"
                                placeholder="Nội dung công việc (VD: Họp với CĐT...)"
                                value={item.activity} onChange={e => {
                                    const newItinerary = [...form.itinerary];
                                    newItinerary[idx].activity = e.target.value;
                                    updateForm('itinerary', newItinerary);
                                }}
                            />
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input type="text" className="w-full pl-7 p-2 border border-gray-200 rounded-lg text-xs"
                                        placeholder="Địa điểm cụ thể"
                                        value={item.location} onChange={e => {
                                            const newItinerary = [...form.itinerary];
                                            newItinerary[idx].location = e.target.value;
                                            updateForm('itinerary', newItinerary);
                                        }}
                                    />
                                </div>
                                <input type="text" className="flex-1 p-2 border border-gray-200 rounded-lg text-xs"
                                    placeholder="Ghi chú thêm..."
                                    value={item.note} onChange={e => {
                                        const newItinerary = [...form.itinerary];
                                        newItinerary[idx].note = e.target.value;
                                        updateForm('itinerary', newItinerary);
                                    }}
                                />
                            </div>
                        </div>
                        <button onClick={() => updateForm('itinerary', form.itinerary.filter((_, i) => i !== idx))} className="text-gray-300 hover:text-red-500 self-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6 animate-fade-in-up">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex justify-between items-center">
                <div className="flex gap-3 items-center">
                    <Wallet size={24} className="text-blue-600" />
                    <div>
                        <p className="text-xs font-bold text-blue-800 uppercase tracking-widest">Tổng dự toán</p>
                        <p className="text-2xl font-black text-slate-800">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalBudget)}</p>
                    </div>
                </div>
                <button onClick={handleBudgetAdd} className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-white border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 shadow-sm">
                    <Plus size={16} /> Thêm chi phí
                </button>
            </div>

            <div className="space-y-3">
                <div className="grid grid-cols-12 gap-4 text-xs font-bold text-gray-500 uppercase px-4">
                    <div className="col-span-3">Hạng mục</div>
                    <div className="col-span-4">Diễn giải</div>
                    <div className="col-span-4">Số tiền (VNĐ)</div>
                    <div className="col-span-1"></div>
                </div>
                {form.budget.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-4 items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm relative group">
                        <div className="col-span-3">
                            <select className="w-full p-2 bg-gray-50 border border-transparent rounded-lg text-sm font-medium focus:bg-white focus:border-orange-500"
                                value={item.type} onChange={e => {
                                    const newBudget = [...form.budget];
                                    newBudget[idx].type = e.target.value;
                                    updateForm('budget', newBudget);
                                }}
                            >
                                <option value="transport">Đi lại (Vé/Xăng)</option>
                                <option value="hotel">Lưu trú</option>
                                <option value="perdiem">Công tác phí</option>
                                <option value="reception">Tiếp khách</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>
                        <div className="col-span-4">
                            <input type="text" className="w-full p-2 border-b border-gray-200 focus:border-orange-500 outline-none text-sm"
                                placeholder="Chi tiết..."
                                value={item.description} onChange={e => {
                                    const newBudget = [...form.budget];
                                    newBudget[idx].description = e.target.value;
                                    updateForm('budget', newBudget);
                                }}
                            />
                        </div>
                        <div className="col-span-4">
                            <input type="number" className="w-full p-2 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-right outline-none focus:ring-1 focus:ring-emerald-500"
                                placeholder="0"
                                value={item.amount} onChange={e => {
                                    const newBudget = [...form.budget];
                                    newBudget[idx].amount = Number(e.target.value);
                                    updateForm('budget', newBudget);
                                }}
                            />
                        </div>
                        <div className="col-span-1 text-right">
                            <button onClick={() => updateForm('budget', form.budget.filter((_, i) => i !== idx))} className="text-gray-300 hover:text-red-500">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-zoom-in">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <Plane className="text-orange-600" /> Lập Kế hoạch Công tác
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">Hoàn thiện 4 bước để trình duyệt kế hoạch</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="px-8 pt-6 pb-2">
                    <div className="flex justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
                        {[
                            { id: 1, label: 'Thông tin chung', icon: FileText },
                            { id: 2, label: 'Nhân sự', icon: Users },
                            { id: 3, label: 'Lịch trình', icon: Clock },
                            { id: 4, label: 'Dự toán', icon: DollarSign }
                        ].map((s) => (
                            <div key={s.id} className={`flex flex-col items-center gap-2 cursor-pointer group`} onClick={() => setStep(s.id)}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all z-10 
                                      ${step >= s.id ? 'bg-orange-600 border-orange-100 text-white shadow-md scale-110' : 'bg-white border-gray-100 text-gray-400 group-hover:border-orange-200'}`}>
                                    <s.icon size={16} />
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${step >= s.id ? 'text-orange-700' : 'text-gray-400'}`}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <button
                        onClick={() => setStep(prev => Math.max(1, prev - 1))}
                        disabled={step === 1}
                        className="px-6 py-2 rounded-xl font-bold text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Quay lại
                    </button>

                    {step < 4 ? (
                        <button
                            onClick={() => setStep(prev => Math.min(4, prev + 1))}
                            className="px-8 py-2 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:bg-slate-900 transition-all flex items-center gap-2"
                        >
                            Tiếp tục <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={() => { alert('Đã gửi kế hoạch thành công!'); onClose(); }}
                            className="px-8 py-2 bg-orange-600 text-white rounded-xl font-bold shadow-lg hover:bg-orange-700 transition-all flex items-center gap-2 animate-pulse"
                        >
                            <Save size={16} /> Trình duyệt Kế hoạch
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Simple Arrow Right Icon for internal use
const ArrowRight = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

// Simple Search Icon
const SearchIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

// Simple Info Icon
const InfoIcon = ({ className, size }: { className?: string, size: number }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);

// Wallet Icon override
const Wallet = ({ size, className }: { size: number, className?: string }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
);

export default BusinessTripModal;
