import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import ImportModal from '../components/ImportModal';
import { CRMService } from '../services/crm.service';
import { ContractService } from '../services/contract.service';
import { Customer, CustomerType, CRMActivity, CRMContact, CRMOpportunity, CustomerCategory } from '../types';
import { PROJECTS, CONTRACTS } from '../constants';
import {
    Search, Filter, Plus, Building2, Handshake,
    MoreHorizontal, MapPin, Phone, Mail, Globe,
    CheckCircle, X, Users, Award, Wallet, ArrowRight,
    Briefcase, FileText, Star, Calendar, MessageSquare,
    Clock, Coffee, Target, TrendingUp, AlertCircle, Loader2, Upload, RefreshCw, Pencil
} from 'lucide-react';

// --- SUB-COMPONENTS ---

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex text-amber-400">
        {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill={i < rating ? "currentColor" : "none"} className={i < rating ? "" : "text-gray-300"} />
        ))}
    </div>
);

const ContactList = ({ contacts }: { contacts: CRMContact[] }) => (
    <div className="space-y-3">
        {contacts.map(c => (
            <div key={c.id} className="flex items-start gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-orange-200 transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
                    {c.name.split(' ').pop()?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-gray-800">{c.name} {c.isPrimary && <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded ml-2 font-normal">Primary</span>}</h4>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{c.position}</p>
                    <div className="flex gap-4 text-xs text-gray-600">
                        <span className="flex items-center gap-1"><Mail size={12} /> {c.email}</span>
                        <span className="flex items-center gap-1"><Phone size={12} /> {c.phone}</span>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-orange-600"><Phone size={16} /></button>
            </div>
        ))}
        {contacts.length === 0 && <p className="text-xs text-gray-400 italic text-center py-4">Chưa có người liên hệ</p>}
        <button className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:bg-gray-50 hover:text-orange-600 transition-colors flex items-center justify-center gap-2">
            <Plus size={14} /> Thêm người liên hệ
        </button>
    </div>
);

const ActivityTimeline = ({ activities }: { activities: CRMActivity[] }) => (
    <div className="relative pl-4 border-l border-gray-200 space-y-6">
        {activities.map(act => {
            let Icon = MessageSquare;
            let colorClass = "bg-gray-100 text-gray-600";
            if (act.type === 'Meeting') { Icon = Users; colorClass = "bg-blue-100 text-blue-600"; }
            if (act.type === 'Call') { Icon = Phone; colorClass = "bg-green-100 text-green-600"; }
            if (act.type === 'Meal') { Icon = Coffee; colorClass = "bg-orange-100 text-orange-600"; }
            if (act.type === 'Email') { Icon = Mail; colorClass = "bg-purple-100 text-purple-600"; }

            return (
                <div key={act.id} className="relative group">
                    <div className={`absolute -left-[25px] w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${colorClass}`}>
                        <Icon size={14} />
                    </div>
                    <div>
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-bold text-gray-800">{act.title}</h4>
                            <span className="text-[10px] text-gray-400 font-medium">{act.date}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2 rounded-lg border border-gray-100">{act.description}</p>
                        <p className="text-[10px] text-gray-400 mt-1">Bởi: {act.createdBy}</p>
                    </div>
                </div>
            )
        })}
        <button className="w-full py-2 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg hover:bg-orange-100 transition-colors flex items-center justify-center gap-2">
            <Plus size={14} /> Ghi lại hoạt động mới
        </button>
    </div>
);

const OpportunityList = ({ opportunities }: { opportunities: CRMOpportunity[] }) => (
    <div className="space-y-3">
        {opportunities.map(opp => (
            <div key={opp.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center group hover:border-orange-300 transition-all">
                <div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">{opp.name}</h4>
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase
                            ${opp.stage === 'Won' ? 'bg-emerald-100 text-emerald-700' :
                                opp.stage === 'Negotiation' ? 'bg-purple-100 text-purple-700' :
                                    'bg-blue-100 text-blue-700'
                            }`}>
                            {opp.stage}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} /> Dự kiến: {opp.expectedCloseDate}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-black text-gray-800 text-base">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumSignificantDigits: 3 }).format(opp.value)}
                    </p>
                    <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
                        <Target size={12} className={opp.probability > 70 ? "text-emerald-500" : "text-orange-500"} />
                        Khả năng: {opp.probability}%
                    </div>
                </div>
            </div>
        ))}
        {opportunities.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-xs text-gray-400">Chưa có cơ hội kinh doanh nào</p>
            </div>
        )}
        <button className="w-full py-3 border border-dashed border-orange-300 bg-orange-50/50 rounded-xl text-sm font-bold text-orange-600 hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
            <Plus size={16} /> Tạo cơ hội mới (Deal)
        </button>
    </div>
);

// --- MAIN DETAIL MODAL ---
const CustomerDetailModal = ({ customer, onClose }: { customer: Customer, onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [contacts, setContacts] = useState<CRMContact[]>([]);
    const [activities, setActivities] = useState<CRMActivity[]>([]);
    const [opportunities, setOpportunities] = useState<CRMOpportunity[]>([]);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const [c, a, o] = await Promise.all([
                    CRMService.getContacts(customer.id),
                    CRMService.getActivities(customer.id),
                    CRMService.getOpportunities(customer.id)
                ]);
                setContacts(c);
                setActivities(a);
                setOpportunities(o);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [customer.id]);

    // Note: PROJECTS and CONTRACTS are still from constants/mock for now as per plan
    const relatedProjects = PROJECTS?.filter(p => p.client?.includes(customer.shortName) || p.client === customer.name) || [];
    const relatedContracts = CONTRACTS?.filter(c => c.sideAName === customer.name || c.sideBName === customer.name) || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
                {/* Header Cover */}
                <div className="h-40 bg-gradient-to-r from-slate-800 to-slate-900 relative shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 backdrop-blur-md z-10 transition-colors"><X size={20} /></button>

                    {/* Floating Logo - Overlapping Bottom */}
                    <div className="absolute -bottom-10 left-8 z-20">
                        <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl bg-white p-2 flex items-center justify-center">
                            <img src={customer.logo} className="w-full h-full object-contain rounded-lg" alt={customer.name} />
                        </div>
                    </div>
                </div>

                {/* Info Bar (Below Header) */}
                <div className="pt-4 px-8 bg-white border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                        <div className="pl-36">
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-bold text-slate-900 line-clamp-1">{customer.name}</h2>
                                {customer.tier === 'VIP' && (
                                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-amber-200 uppercase tracking-wide shrink-0">
                                        <Award size={12} /> VIP
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm">
                                <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-gray-200">{customer.shortName}</span>
                                <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded border ${customer.type === 'Client' ? 'text-orange-600 bg-orange-50 border-orange-100' : 'text-purple-600 bg-purple-50 border-purple-100'}`}>
                                    {customer.type === 'Client' ? 'Chủ Đầu Tư' : 'Đối Tác'}
                                </span>
                                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 text-xs">
                                    <span className="font-bold">{customer.rating || 5}</span>
                                    <Star size={12} fill="currentColor" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-8 overflow-x-auto pl-2">
                        {['overview', 'contacts', 'activities', 'opportunities', 'history'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap
                                    ${activeTab === tab ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                            >
                                {tab === 'overview' && 'Tổng quan'}
                                {tab === 'contacts' && `Liên hệ`}
                                {tab === 'activities' && `Hoạt động`}
                                {tab === 'opportunities' && `Cơ hội`}
                                {tab === 'history' && 'Lịch sử hợp tác'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="animate-spin text-orange-600" size={32} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* LEFT COLUMN (Static Info) */}
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b pb-2">Thông tin chung</h4>
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <MapPin size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                            <p className="text-sm text-gray-600">{customer.address}</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <Users size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-400">Đại diện pháp luật</p>
                                                <p className="text-sm font-medium text-gray-800">{customer.representative}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Globe size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                            <a href={`https://${customer.website}`} target="_blank" className="text-sm text-blue-600 hover:underline">{customer.website || 'N/A'}</a>
                                        </div>
                                        <div className="flex gap-3">
                                            <AlertCircle size={18} className="text-gray-400 shrink-0 mt-0.5" />
                                            <p className="text-sm text-gray-600">MST: <span className="font-mono">{customer.taxCode}</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                    <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b pb-2">Đánh giá nội bộ</h4>
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg border border-gray-100 relative">
                                            <span className="text-4xl text-gray-200 absolute -top-2 -left-1">“</span>
                                            <span className="relative z-10">{customer.evaluation || 'Chưa có đánh giá'}</span>
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                                        <span className="text-xs text-gray-400">Tổng giá trị hợp tác</span>
                                        <span className="font-bold text-emerald-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumSignificantDigits: 3 }).format(customer.totalProjectValue)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN (Dynamic Content based on Tab) */}
                            <div className="lg:col-span-2 space-y-6">

                                {activeTab === 'overview' && (
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-orange-600" /> Hiệu suất hợp tác</h3>
                                            <div className="grid grid-cols-3 gap-4 text-center">
                                                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                                                    <p className="text-2xl font-black text-orange-600">{relatedProjects.length}</p>
                                                    <p className="text-xs text-gray-500 font-bold uppercase">Dự án</p>
                                                </div>
                                                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                                    <p className="text-2xl font-black text-emerald-600">{relatedContracts.length}</p>
                                                    <p className="text-xs text-gray-500 font-bold uppercase">Hợp đồng</p>
                                                </div>
                                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                                                    <p className="text-2xl font-black text-blue-600">{contacts.length}</p>
                                                    <p className="text-xs text-gray-500 font-bold uppercase">Liên hệ</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <h3 className="font-bold text-gray-800 mb-3">Người liên hệ chính</h3>
                                            {contacts.filter(c => c.isPrimary).length > 0 ? (
                                                <ContactList contacts={contacts.filter(c => c.isPrimary)} />
                                            ) : (
                                                <p className="text-sm text-gray-500 italic">Chưa thiết lập người liên hệ chính</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'contacts' && (
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="font-bold text-gray-800 mb-4">Danh sách liên hệ</h3>
                                        <ContactList contacts={contacts} />
                                    </div>
                                )}

                                {activeTab === 'activities' && (
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="font-bold text-gray-800 mb-4">Lịch sử tương tác</h3>
                                        <ActivityTimeline activities={activities} />
                                    </div>
                                )}

                                {activeTab === 'opportunities' && (
                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="font-bold text-gray-800 mb-4">Cơ hội kinh doanh (Pipeline)</h3>
                                        <OpportunityList opportunities={opportunities} />
                                    </div>
                                )}

                                {activeTab === 'history' && (
                                    <div className="space-y-6">
                                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Briefcase size={18} className="text-slate-500" /> Các dự án đã thực hiện</h3>
                                            {relatedProjects.length > 0 ? (
                                                <div className="space-y-3">
                                                    {relatedProjects.map(proj => (
                                                        <div key={proj.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                                            <div>
                                                                <p className="font-bold text-sm text-slate-800">{proj.name}</p>
                                                                <p className="text-xs text-gray-500">{proj.code}</p>
                                                            </div>
                                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${proj.status === 'Đang thực hiện' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                                {proj.status}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">Chưa có dữ liệu dự án</p>
                                            )}
                                        </div>

                                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FileText size={18} className="text-slate-500" /> Hợp đồng đã ký</h3>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                                        <tr>
                                                            <th className="px-4 py-2">Số HĐ</th>
                                                            <th className="px-4 py-2">Giá trị</th>
                                                            <th className="px-4 py-2">Ngày ký</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {relatedContracts.map(c => (
                                                            <tr key={c.id}>
                                                                <td className="px-4 py-2 font-medium text-blue-600">{c.code}</td>
                                                                <td className="px-4 py-2 font-bold text-slate-700">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(c.totalValue)}</td>
                                                                <td className="px-4 py-2 text-gray-500">{c.signedDate}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- CREATE MODAL ---
const CreateCustomerModal = ({ onClose, onSave }: { onClose: () => void, onSave: (data: any) => void }) => {
    const [formData, setFormData] = useState({
        code: '', name: '', shortName: '', type: 'Client',
        taxCode: '', address: '', website: '',
        representative: '', email: '', phone: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Thêm Khách hàng mới</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Mã khách hàng</label>
                            <input name="code" value={formData.code} onChange={handleChange} required className="w-full border rounded p-2 text-sm" placeholder="VD: CUST-001" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Loại hình</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full border rounded p-2 text-sm">
                                <option value="Client">Chủ đầu tư</option>
                                <option value="Partner">Đối tác</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Tên đầy đủ</label>
                        <input name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded p-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Tên viết tắt</label>
                        <input name="shortName" value={formData.shortName} onChange={handleChange} required className="w-full border rounded p-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Mã số thuế</label>
                        <input name="taxCode" value={formData.taxCode} onChange={handleChange} className="w-full border rounded p-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Địa chỉ</label>
                        <input name="address" value={formData.address} onChange={handleChange} className="w-full border rounded p-2 text-sm" />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Hủy</button>
                        <button type="submit" className="px-4 py-2 bg-orange-600 text-white font-bold rounded hover:bg-orange-700">Lưu thông tin</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// --- EDIT MODAL ---
const EditCustomerModal = ({ customer, onClose, onSave }: { customer: Customer, onClose: () => void, onSave: (data: Customer) => void }) => {
    const [formData, setFormData] = useState({
        code: customer.code || '',
        name: customer.name || '',
        shortName: customer.shortName || '',
        type: customer.type || 'Client',
        taxCode: customer.taxCode || '',
        address: customer.address || '',
        website: customer.website || '',
        representative: customer.representative || '',
        email: customer.email || '',
        phone: customer.phone || '',
        tier: customer.tier || 'Standard',
        status: customer.status || 'Active',
        evaluation: customer.evaluation || ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const updatedCustomer: Customer = {
            ...customer,
            ...formData,
            type: formData.type as CustomerType
        };
        onSave(updatedCustomer);
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">✏️ Chỉnh sửa Khách hàng</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Row 1: Code & Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Mã khách hàng</label>
                            <input name="code" value={formData.code} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Loại hình</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white">
                                <option value="Client">Chủ đầu tư</option>
                                <option value="Partner">Đối tác</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 2: Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Tên đầy đủ</label>
                        <input name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                    </div>

                    {/* Row 3: ShortName & TaxCode */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Tên viết tắt</label>
                            <input name="shortName" value={formData.shortName} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Mã số thuế</label>
                            <input name="taxCode" value={formData.taxCode} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                        </div>
                    </div>

                    {/* Row 4: Address */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Địa chỉ</label>
                        <input name="address" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                    </div>

                    {/* Row 5: Website & Representative */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Website</label>
                            <input name="website" value={formData.website} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" placeholder="example.com" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Đại diện pháp luật</label>
                            <input name="representative" value={formData.representative} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                        </div>
                    </div>

                    {/* Row 6: Email & Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                            <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Số điện thoại</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" />
                        </div>
                    </div>

                    {/* Row 7: Tier & Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Hạng khách hàng</label>
                            <select name="tier" value={formData.tier} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white">
                                <option value="VIP">VIP</option>
                                <option value="Premium">Premium</option>
                                <option value="Standard">Standard</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Trạng thái</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white">
                                <option value="Active">Hoạt động</option>
                                <option value="Inactive">Ngừng hoạt động</option>
                                <option value="Potential">Tiềm năng</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 8: Evaluation */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Đánh giá nội bộ</label>
                        <textarea name="evaluation" value={formData.evaluation} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none resize-none" placeholder="Nhận xét, đánh giá về khách hàng..." />
                    </div>

                    {/* Actions */}
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

const CRMList = () => {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('All');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    const handleImportCustomers = async (data: any[]) => {
        for (const row of data) {
            await handleCreateCustomer({
                code: row.Code,
                name: row.Name,
                type: row.Type || 'Client',
                phone: row.Phone,
                email: row.Email,
                address: row.Address,
                shortName: row.Name ? row.Name.substring(0, 10) : 'Import'
            });
        }
    };

    const handleSyncContracts = async () => {
        if (!confirm('Hệ thống sẽ quét tất cả hợp đồng để tạo hồ sơ khách hàng/đối tác mới nếu chưa có. Bạn có chắc chắn?')) return;

        setLoading(true);
        // 1. Get All Contracts
        const contracts = await ContractService.getContracts();

        // 2. Get Existing Customers (to check duplicates)
        const existingUsers = await CRMService.getCustomers();
        const existingNames = new Set(existingUsers.map(c => c.name.toLowerCase().trim()));

        let addedCount = 0;

        for (const contract of contracts) {
            // Check Side A (Client)
            const sideA = contract.sideAName?.trim();
            if (sideA && !existingNames.has(sideA.toLowerCase()) && !sideA.includes('CIC')) {
                await CRMService.createCustomer({
                    id: `CUST-${Date.now()}-${Math.random()}`,
                    code: `CUST-${Date.now().toString().slice(-4)}`,
                    name: sideA,
                    shortName: sideA.split(' ').slice(0, 2).join(' ').toUpperCase(),
                    type: 'Client',
                    status: 'Active',
                    tier: 'Standard',
                    category: 'Other',
                    rating: 5,
                    totalProjectValue: contracts.filter(c => c.sideAName === sideA).reduce((sum, c) => sum + (c.totalValue || 0), 0),
                    logo: 'https://ui-avatars.com/api/?background=random&name=' + encodeURIComponent(sideA),
                    created_at: new Date().toISOString()
                } as any);
                existingNames.add(sideA.toLowerCase());
                addedCount++;
            }

            // Check Side B (Partner)
            const sideB = contract.sideBName?.trim();
            if (sideB && !existingNames.has(sideB.toLowerCase()) && !sideB.includes('CIC')) {
                await CRMService.createCustomer({
                    id: `PART-${Date.now()}-${Math.random()}`,
                    code: `PART-${Date.now().toString().slice(-4)}`,
                    name: sideB,
                    shortName: sideB.split(' ').slice(0, 2).join(' ').toUpperCase(),
                    type: 'Partner',
                    status: 'Active',
                    tier: 'Standard',
                    category: 'Other',
                    rating: 5,
                    totalProjectValue: contracts.filter(c => c.sideBName === sideB).reduce((sum, c) => sum + (c.totalValue || 0), 0),
                    logo: 'https://ui-avatars.com/api/?background=random&name=' + encodeURIComponent(sideB),
                    created_at: new Date().toISOString()
                } as any);
                existingNames.add(sideB.toLowerCase());
                addedCount++;
            }
        }

        const data = await CRMService.getCustomers();
        setCustomers(data);
        setLoading(false);
        alert(`Đã đồng bộ xong! Thêm mới ${addedCount} khách hàng/đối tác từ hợp đồng.`);
    };

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            const data = await CRMService.getCustomers();
            setCustomers(data);
            setLoading(false);
        };
        fetchCustomers();
    }, []);

    const handleCreateCustomer = async (data: any) => {
        const newCustomer: any = {
            ...data,
            tier: 'Standard',
            status: 'Active',
            totalProjectValue: 0,
            rating: 5,
            logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
            category: 'Other'
        };
        const result = await CRMService.createCustomer(newCustomer);
        if (result) {
            setCustomers([result, ...customers]);
            setCreateModalOpen(false);
        }
    }

    // --- EDIT CUSTOMER HANDLER ---
    const handleEditCustomer = async (updatedCustomer: Customer) => {
        const result = await CRMService.updateCustomer(updatedCustomer.id, updatedCustomer);
        if (result) {
            setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? result : c));
            setEditModalOpen(false);
            setEditingCustomer(null);
            // Also update selectedCustomer if it's the same one being edited
            if (selectedCustomer?.id === updatedCustomer.id) {
                setSelectedCustomer(result);
            }
        }
    };

    const openEditModal = (customer: Customer, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering detail modal
        setEditingCustomer(customer);
        setEditModalOpen(true);
    };

    const filteredCustomers = useMemo(() => {
        return customers.filter(c => {
            const matchesSearch =
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.code.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterType === 'All' || c.type === filterType;
            return matchesSearch && matchesType;
        });
    }, [searchQuery, filterType, customers]);

    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <Header title="Quản lý Khách hàng (CRM)" breadcrumb="Trang chủ / CRM" />

            {selectedCustomer && (
                <CustomerDetailModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
            )}
            {isCreateModalOpen && (
                <CreateCustomerModal onClose={() => setCreateModalOpen(false)} onSave={handleCreateCustomer} />
            )}
            {isEditModalOpen && editingCustomer && (
                <EditCustomerModal
                    customer={editingCustomer}
                    onClose={() => { setEditModalOpen(false); setEditingCustomer(null); }}
                    onSave={handleEditCustomer}
                />
            )}
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                type="Customer"
                onImport={handleImportCustomers}
            />

            <main className="p-8 w-full">

                {/* Statistics Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-0.5">Tổng khách hàng</p>
                            <h3 className="text-2xl font-bold text-gray-800">{loading ? '...' : customers.length}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <Handshake size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-0.5">Đối tác chiến lược</p>
                            <h3 className="text-2xl font-bold text-gray-800">{loading ? '...' : customers.filter(c => c.type === 'Partner').length}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Award size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-0.5">Khách hàng VIP</p>
                            <h3 className="text-2xl font-bold text-gray-800">{loading ? '...' : customers.filter(c => c.tier === 'VIP').length}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-0.5">Giá trị hợp tác</p>
                            <h3 className="text-2xl font-bold text-gray-800">35.2 Tỷ</h3>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Tìm khách hàng..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 w-64 shadow-sm"
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-white border border-gray-200 rounded-lg text-sm px-3 py-2 outline-none shadow-sm"
                        >
                            <option value="All">Phân loại: Tất cả</option>
                            <option value="Client">Chủ đầu tư (Client)</option>
                            <option value="Partner">Đối tác (Partner)</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleSyncContracts} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-bold" title="Tự động tạo khách hàng từ tên trong Hợp đồng">
                            <RefreshCw size={18} /> Đồng bộ từ HĐ
                        </button>
                        <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold">
                            <Upload size={18} /> Import
                        </button>
                        <button onClick={() => setCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 text-sm">
                            <Plus size={18} /> Thêm khách hàng mới
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="text-center py-20 text-gray-400">Đang tải dữ liệu...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {filteredCustomers.map(customer => (
                            <div key={customer.id} onClick={() => setSelectedCustomer(customer)} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-orange-200 transition-all cursor-pointer group flex flex-col">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-16 h-16 bg-white rounded-xl border border-gray-100 p-2 flex items-center justify-center shadow-sm">
                                            <img src={customer.logo} alt={customer.name} className="w-full h-full object-contain rounded" />
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            {customer.tier === 'VIP' && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wide">VIP</span>}
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${customer.type === 'Client' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                                {customer.type}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors h-14">
                                        {customer.name}
                                    </h3>
                                    <p className="text-xs font-mono text-gray-400 mb-4">{customer.code}</p>

                                    <div className="space-y-3 pt-4 border-t border-gray-50">
                                        <div className="flex items-start gap-3">
                                            <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                                            <p className="text-xs text-gray-600 line-clamp-2">{customer.address}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Users size={16} className="text-gray-400 shrink-0" />
                                            <p className="text-xs text-gray-600">Đại diện: <span className="font-medium text-gray-800">{customer.representative}</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center rounded-b-xl">
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-gray-400 font-medium mr-1">Rating:</span>
                                        <StarRating rating={customer.rating || 0} />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => openEditModal(customer, e)}
                                            className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                                            title="Chỉnh sửa"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <span className="text-xs font-bold text-orange-600 group-hover:underline flex items-center gap-1">
                                            Chi tiết <ArrowRight size={12} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default CRMList;
