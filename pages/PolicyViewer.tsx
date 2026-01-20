
import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import {
    FileText, History, GitCommit, Info,
    Users, Info as InfoIcon, Search,
    Printer, Database, CheckSquare, Wallet, Gift, Shield, ChevronDown, Loader2
} from 'lucide-react';
import { KnowledgeService, PolicySection } from '../services/knowledge.service';

// Helper to render RACI cells with colors
const RaciCell = ({ value }: { value: string }) => {
    if (!value) return null;
    let colorClass = "text-gray-500";
    let bgClass = "bg-gray-50";
    let fontWeight = "font-medium";
    let borderClass = "border-gray-100";

    if (value.includes('R')) {
        colorClass = "text-rose-700";
        bgClass = "bg-rose-50";
        borderClass = "border-rose-200";
        fontWeight = "font-bold";
    }
    else if (value.includes('A')) {
        colorClass = "text-amber-700";
        bgClass = "bg-amber-50";
        borderClass = "border-amber-200";
        fontWeight = "font-bold";
    }
    else if (value.includes('C')) {
        colorClass = "text-blue-700";
        bgClass = "bg-blue-50";
        borderClass = "border-blue-200";
        fontWeight = "font-bold";
    }
    else if (value.includes('I')) {
        colorClass = "text-slate-700";
        bgClass = "bg-slate-100";
        borderClass = "border-slate-200";
        fontWeight = "font-bold";
    }

    return (
        <div className={`w-8 h-8 flex items-center justify-center rounded border ${borderClass} ${bgClass} ${colorClass} ${fontWeight} mx-auto text-xs shadow-sm`}>
            {value}
        </div>
    );
};

// --- INTERACTIVE ORG CHART COMPONENTS ---
const OrgNode = ({ title, code, onClick, colorClass = "bg-white border-gray-200 text-gray-800" }: { title: string, code?: string, onClick: (id: string) => void, colorClass?: string }) => (
    <div
        onClick={() => code && onClick(code)}
        className={`flex flex-col items-center justify-center p-3 rounded-xl border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer w-40 h-24 text-center z-10 ${colorClass}`}
    >
        <p className="text-xs font-bold uppercase tracking-tight">{title}</p>
        {code && <span className="text-[10px] text-gray-500 font-mono mt-1 bg-white/50 px-1.5 rounded">{code}</span>}
    </div>
);

const OrgLineVertical = ({ height = "h-8" }) => <div className={`w-0.5 bg-gray-300 ${height}`}></div>;

const InteractiveOrgChart = ({ onNavigate }: { onNavigate: (id: string) => void }) => {
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 overflow-x-auto min-w-full">
            <div className="flex flex-col items-center min-w-[800px]">
                <OrgNode
                    title="Giám đốc Trung tâm"
                    code="10.10"
                    onClick={onNavigate}
                    colorClass="bg-orange-50 border-orange-200 text-orange-800 ring-2 ring-orange-100"
                />
                <OrgLineVertical height="h-8" />
                <OrgNode
                    title="Phó Giám đốc"
                    code="10.15"
                    onClick={onNavigate}
                    colorClass="bg-orange-50/50 border-orange-200 text-gray-800"
                />
                <OrgLineVertical height="h-8" />
                <div className="relative w-[90%] flex justify-center">
                    <div className="absolute top-0 w-full border-t-2 border-gray-300"></div>
                    <div className="absolute top-0 left-0 w-0.5 h-8 bg-gray-300"></div>
                    <div className="absolute top-0 left-1/4 w-0.5 h-8 bg-gray-300"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-300"></div>
                    <div className="absolute top-0 right-1/4 w-0.5 h-8 bg-gray-300"></div>
                    <div className="absolute top-0 right-0 w-0.5 h-8 bg-gray-300"></div>
                </div>
                <div className="grid grid-cols-5 gap-4 mt-8 w-full">
                    <div className="flex flex-col items-center">
                        <OrgNode title="TBP Quản lý CL" code="10.24" onClick={onNavigate} />
                    </div>
                    <div className="flex flex-col items-center">
                        <OrgNode title="TB Môn Cơ Điện" code="10.20" onClick={onNavigate} />
                        <OrgLineVertical height="h-4" />
                        <OrgNode title="Thành viên" code="10.30" onClick={onNavigate} colorClass="bg-gray-50 border-gray-200 text-gray-500 scale-90" />
                    </div>
                    <div className="flex flex-col items-center">
                        <OrgNode title="TB Môn KT-KC" code="10.20" onClick={onNavigate} />
                        <OrgLineVertical height="h-4" />
                        <OrgNode title="Thành viên" code="10.30" onClick={onNavigate} colorClass="bg-gray-50 border-gray-200 text-gray-500 scale-90" />
                    </div>
                    <div className="flex flex-col items-center">
                        <OrgNode title="TBP Xúc tiến DA" code="10.26" onClick={onNavigate} />
                        <OrgLineVertical height="h-4" />
                        <OrgNode title="Thành viên" code="10.36" onClick={onNavigate} colorClass="bg-gray-50 border-gray-200 text-gray-500 scale-90" />
                    </div>
                    <div className="flex flex-col items-center">
                        <OrgNode title="TBP R&D" code="10.28" onClick={onNavigate} />
                    </div>
                </div>
                <div className="absolute left-10 top-[200px] hidden xl:block">
                    <div className="flex items-center">
                        <OrgNode title="TBP Admin" code="10.22" onClick={onNavigate} />
                        <div className="w-8 h-0.5 bg-gray-300"></div>
                    </div>
                </div>
            </div>
            <p className="text-center text-xs text-gray-400 mt-8 italic">* Nhấp vào từng vị trí để xem chi tiết nhiệm vụ</p>
        </div>
    );
};

// RACI Headers (Keeping as constant for now, could be moved to DB later)
const RACI_HEADERS = [
    'STT', 'Nội dung công việc',
    'GĐTT', 'PGĐTT', 'TBP Admin', 'TBP QA/QC',
    'TBM', 'TVBM', 'TBP XTDA', 'TBP R&D',
    'QLDA', 'QL BIM', 'ĐPBM', 'TNDH', 'NDH'
];

// RACI Data 25.10 & 25.20 (Vốn ngân sách & Vốn ngoài NS)
const RACI_ROWS_25_10 = [
    ['1', 'Xúc tiến Dự án', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['1.1', 'Thuyết trình khách hàng', 'I/C', 'C', '', '', '', '', 'C', 'C', 'C', 'R', '', '', ''],
    ['1.2', 'Liên hệ khách hàng nắm bắt thông tin định kỳ', 'I', 'I', '', '', '', '', '', '', 'R', '', '', '', ''],
    ['1.3', 'Cập nhật danh mục khách hàng', 'I', 'I', 'I', 'I', 'I', 'I', 'R', '', '', '', '', '', ''],
    ['1.4', 'Thu thập dữ liệu đầu vào báo giá', 'I', 'I', 'I', 'I', 'I', '', 'R', '', '', '', '', '', ''],
    ['2', 'Báo giá', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['2.1', 'Tạo thư mục Dự án tiềm năng', 'I', 'I', 'I', 'I', 'I', '', 'R', '', '', '', '', '', ''],
    ['2.2', 'Chốt khối lượng báo giá', '', 'A', '', '', '', '', 'R', '', '', '', '', '', ''],
    ['2.3', 'Xem xét khả thi kỹ thuật', 'R', '', '', '', '', '', 'C', '', '', '', '', '', ''],
    ['2.4', 'Pre-Bep', 'I', 'A', '', '', '', '', 'R', '', 'C', '', '', '', ''],
    ['2.5', 'Lập báo giá', 'A', 'C', '', '', '', '', 'C', '', 'R', '', '', '', ''],
    ['2.6', 'Thu thập hồ sơ năng lực đấu thầu', 'C', 'C', 'R', '', 'C', 'C', 'A', '', '', '', '', '', ''],
    ['2.7', 'Theo dõi tình trạng báo giá', 'I', 'I', '', '', '', '', 'R', '', '', '', '', '', ''],
    ['3', 'Chuẩn bị', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['3.1', 'Bổ nhiệm QLDA/QLB', 'R', 'C', 'I', '', '', '', '', '', 'I', '', '', '', ''],
    ['3.2', 'Bổ nhiệm thành viên dự án', 'R', 'C', 'I', 'C', 'C', 'I', 'C', '', '', 'I', 'I', 'I', ''],
    ['3.3', 'Tạo lập Folder Dự án', 'R', '', '', '', '', '', '', '', '', 'I', 'I', 'I', 'I'],
    ['3.4', 'Tạo lập Dự án trên Bimcollab', 'R', '', '', '', '', '', '', '', '', 'I', 'I', 'I', 'I'],
    ['3.5', 'Thiết lập CDE dự án', 'R', '', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['3.6', 'Tạo Template dự án', '', 'A', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['3.7', 'Tạo lập nhóm trao đổi nội bộ', 'I', 'I', '', '', 'I', '', 'I', '', 'R', 'I', 'I', 'I', ''],
    ['3.8', 'Tạo lập nhóm trao đổi khách hàng', '', '', 'I', '', '', '', 'R', '', 'I', 'I', '', '', ''],
    ['4', 'Triển khai trình thẩm định', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['4.1', 'Dựng mô hình trình thẩm định', 'I', 'I', '', 'A', 'C', '', 'I', '', 'A', 'A', 'A', 'R', ''],
    ['4.2', 'Xuất bản vẽ trình thẩm định', 'I', 'I', '', 'A', 'C', '', 'I', '', 'A', 'A', 'A', 'R', ''],
    ['4.3', 'Xuất khối lượng trình thẩm định', 'I', 'I', '', 'A', 'C', '', 'I', '', 'A', 'A', 'A', 'R', ''],
    ['4.4', 'Tập hợp hồ sơ trình thẩm định', 'A', 'I', '', '', '', '', 'R', '', 'C', '', '', '', ''],
    ['4.5', 'Thu thập ý kiến thẩm định', 'I', '', '', '', '', '', 'R', '', 'I', 'I', 'I', 'I', ''],
    ['4.6', 'Cập nhật hồ sơ BIM', 'I', 'I', '', 'A', 'C', '', 'I', '', 'A', 'A', 'A', 'R', ''],
    ['4.7', 'Quản lý File trên CDE Nội bộ', 'I', '', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['4.8', 'Đồng bộ File lên CDE Dự án', 'I', '', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['5', 'Triển khai Hỗ trợ QLDA', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['5.1', 'Dựng mô hình hoàn thiện', 'I', 'I', '', 'A', 'C', '', 'I', '', 'A', 'A', 'A', 'R', ''],
    ['5.2', 'Triển khai ứng dụng BIM', 'I', 'I', '', 'A', 'C', '', 'C', '', 'A', 'A', 'A', 'R', ''],
    ['5.3', 'Quản lý File trên CDE Nội bộ', 'I', '', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['5.4', 'Đồng bộ File lên CDE Dự án', 'I', '', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['5.5', 'Bàn giao dữ liệu cho khách hàng', 'A', 'I', '', '', '', '', 'R', '', 'C', '', '', '', ''],
    ['6', 'Thanh quyết toán', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['6.1', 'Lập hồ sơ thanh toán từng giai đoạn', 'I', 'I', 'R', '', '', '', 'C', '', 'C', '', '', '', ''],
    ['6.2', 'Lập hồ sơ quyết toán', 'I', 'I', 'R', '', '', '', 'C', '', 'C', '', '', '', ''],
    ['6.3', 'Theo dõi tình trạng thanh toán', 'I', 'I', 'R', '', '', '', 'C', '', 'I', '', '', '', ''],
    ['7', 'Lưu trữ & Rút KN', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['7.1', 'Lưu trữ dữ liệu về Server TT', '', '', '', '', '', '', '', '', '', 'R', '', '', ''],
    ['7.2', 'Rút kinh nghiệm', 'I', 'I', '', '', '', '', '', 'C', 'R', 'C', 'C', 'C', '']
];

const RACI_ROWS_25_20 = [
    ['1', 'Xúc tiến Dự án', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['1.1', 'Thuyết trình khách hàng', 'I/C', 'C', '', '', '', '', 'C', 'C', 'C', 'R', '', '', ''],
    ['1.2', 'Liên hệ khách hàng', 'I', 'I', '', '', '', '', '', '', 'R', '', '', '', ''],
    ['1.3', 'Cập nhật danh mục', 'I', 'I', 'I', 'I', 'I', 'I', 'R', '', '', '', '', '', ''],
    ['1.4', 'Thu thập dữ liệu đầu vào', 'I', 'I', 'I', 'I', 'I', '', 'R', '', '', '', '', '', ''],
    ['2', 'Báo giá', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['2.1', 'Tạo thư mục tiềm năng', 'I', 'I', 'I', 'I', 'I', '', 'R', '', '', '', '', '', ''],
    ['2.2', 'Chốt khối lượng', '', 'A', '', '', '', '', 'R', '', '', '', '', '', ''],
    ['2.3', 'Khả thi kỹ thuật', 'R', '', '', '', '', '', 'C', '', '', '', '', '', ''],
    ['2.4', 'Pre-Bep', 'I', 'A', '', '', '', '', 'R', '', 'C', '', '', '', ''],
    ['2.5', 'Lập báo giá', 'A', 'C', '', '', '', '', 'C', '', 'R', '', '', '', ''],
    ['2.6', 'Hồ sơ năng lực', 'C', 'C', 'R', '', 'C', 'C', 'A', '', '', '', '', '', ''],
    ['2.7', 'Theo dõi báo giá', 'I', 'I', '', '', '', '', 'R', '', '', '', '', '', ''],
    ['3', 'Chuẩn bị', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['3.1', 'Bổ nhiệm QLDA/QLB', 'R', 'C', 'I', '', '', '', '', '', 'I', '', '', '', ''],
    ['3.2', 'Bổ nhiệm thành viên', 'R', 'C', 'I', 'C', 'C', 'I', 'C', '', '', 'I', 'I', 'I', ''],
    ['3.3', 'Tạo Folder', 'R', '', '', '', '', '', '', '', '', 'I', 'I', 'I', 'I'],
    ['3.4', 'Tạo Bimcollab', 'R', '', '', '', '', '', '', '', '', 'I', 'I', 'I', 'I'],
    ['3.5', 'Thiết lập CDE', 'R', '', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['3.6', 'Template', '', 'A', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['3.7', 'Nhóm nội bộ', 'I', 'I', '', '', 'I', '', 'I', '', 'R', 'I', 'I', 'I', ''],
    ['3.8', 'Nhóm khách hàng', '', '', 'I', '', '', '', 'R', '', 'I', 'I', '', '', ''],
    ['4', 'Triển khai Hỗ trợ QLDA', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['4.1', 'Dựng mô hình hoàn thiện', 'I', 'I', '', 'A', 'C', '', 'I', '', 'A', 'A', 'A', 'R', ''],
    ['4.2', 'Triển khai ứng dụng BIM', 'I', 'I', '', 'A', 'C', '', 'C', '', 'A', 'A', 'A', 'R', ''],
    ['4.3', 'Quản lý File CDE Nội bộ', 'I', '', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['4.4', 'Đồng bộ CDE Dự án', 'I', '', '', '', '', '', '', '', '', 'R', 'C', 'C', 'C'],
    ['4.5', 'Bàn giao dữ liệu', 'A', 'I', '', '', '', '', 'R', '', 'C', '', '', '', ''],
    ['5', 'Thanh quyết toán', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['5.1', 'Hồ sơ thanh toán', 'I', 'I', 'R', '', '', '', 'C', '', 'C', '', '', '', ''],
    ['5.2', 'Hồ sơ quyết toán', 'I', 'I', 'R', '', '', '', 'C', '', 'C', '', '', '', ''],
    ['5.3', 'Theo dõi thanh toán', 'I', 'I', 'R', '', '', '', 'C', '', 'I', '', '', '', ''],
    ['6', 'Lưu trữ', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    ['6.1', 'Lưu trữ dữ liệu', '', '', '', '', '', '', '', '', '', 'R', '', '', ''],
    ['6.2', 'Rút kinh nghiệm', 'I', 'I', '', '', '', '', '', 'C', 'R', 'C', 'C', 'C', '']
];

const PolicyViewer = () => {
    const [activeSectionId, setActiveSectionId] = useState<string>('versions');
    const [searchQuery, setSearchQuery] = useState('');
    const [policies, setPolicies] = useState<PolicySection[]>([]);
    const [loading, setLoading] = useState(true);

    const IconMap: Record<string, any> = {
        'History': History,
        'Info': Info,
        'GitCommit': GitCommit,
        'Users': Users,
        'Database': Database,
        'Shield': Shield,
        'Wallet': Wallet,
        'Gift': Gift,
        'CheckSquare': CheckSquare,
        'InfoIcon': InfoIcon
    };

    useEffect(() => {
        const fetchPolicies = async () => {
            setLoading(true);
            try {
                const data = await KnowledgeService.getPolicies();
                if (data.length > 0) {
                    const mappedData = data.map(section => ({
                        ...section,
                        id: section.sectionId,
                        icon: IconMap[section.icon] || Info
                    }));
                    setPolicies(mappedData);
                    setActiveSectionId(mappedData[0].id);
                }
            } catch (error) {
                console.error('Fetch policies error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPolicies();
    }, []);

    const activeSection = useMemo(() =>
        policies.find(s => s.id === activeSectionId) || (policies.length > 0 ? policies[0] : null),
        [activeSectionId, policies]
    );

    const filteredContent = useMemo(() => {
        if (!searchQuery) return policies;
        return policies.filter(s =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.content.some(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, policies]);

    const handleNavigate = (id: string) => {
        const foundSection = policies.find(s => s.id === id || s.content.some(c => c.id === id));
        if (foundSection) {
            setActiveSectionId(foundSection.id);
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    element.classList.add('bg-orange-50', 'transition-colors', 'duration-500');
                    setTimeout(() => element.classList.remove('bg-orange-50'), 2000);
                }
            }, 100);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-20">
                <Loader2 className="animate-spin text-orange-600 mb-4" size={40} />
                <p className="text-gray-500 font-medium">Đang tải tài liệu quy chế...</p>
            </div>
        );
    }

    if (!activeSection) {
        return (
            <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-20">
                <InfoIcon className="text-gray-300 mb-4" size={60} />
                <p className="text-gray-500 font-medium">Không có dữ liệu quy chế.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-gray-50 min-h-screen flex flex-col">
            <Header title="Quy chế & Quy trình hoạt động" breadcrumb="Trang chủ / Quy chế" />
            <main className="flex-1 w-full mx-auto p-6 flex gap-6 h-[calc(100vh-64px)]">
                {/* Sidebar */}
                <aside className="w-80 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden shrink-0">
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm quy chế..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {filteredContent.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSectionId(section.id)}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-colors
                            ${activeSectionId === section.id
                                        ? 'bg-orange-50 text-orange-700 font-bold border border-orange-100'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'}`}
                            >
                                {section.icon && <section.icon size={18} />}
                                <span className="line-clamp-1">{section.title}</span>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Content */}
                <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                                {activeSection.icon ? <activeSection.icon size={20} /> : <FileText size={20} />}
                            </div>
                            <h2 className="text-xl font-bold text-gray-800">{activeSection.title}</h2>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 p-2"><Printer size={20} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 space-y-12 scroll-smooth custom-scrollbar relative">
                        {activeSection.content.map((item) => (
                            <div key={item.id} id={item.id} className="scroll-mt-4 rounded-xl p-2 -m-2">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-orange-500">#</span> {item.title}
                                </h3>

                                {item.text && (
                                    <div className="text-slate-600 leading-relaxed text-sm whitespace-pre-line mb-4 text-justify">
                                        {item.text}
                                    </div>
                                )}

                                {item.subItems && (
                                    <ul className="space-y-2 mb-4">
                                        {item.subItems.map((sub, idx) => (
                                            <li key={idx} className="flex gap-3 text-sm text-slate-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 shrink-0"></div>
                                                <span>{sub}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {item.notes && (
                                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-4">
                                        <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase mb-2">
                                            <InfoIcon size={14} /> Ghi chú
                                        </div>
                                        <ul className="list-disc list-inside text-xs text-amber-900 space-y-1">
                                            {item.notes.map((note, idx) => <li key={idx}>{note}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {item.isFormula && (
                                    <div className="bg-slate-800 text-slate-200 p-6 rounded-xl font-mono text-sm whitespace-pre-line shadow-inner border border-slate-700 mb-4">
                                        {item.text}
                                    </div>
                                )}

                                {item.tableData && (
                                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 shadow-sm bg-gray-50/20">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-800 text-white text-[10px] uppercase font-black tracking-widest">
                                                <tr>
                                                    {item.tableData.headers.map((h, i) => <th key={i} className="px-4 py-3 border-b">{h}</th>)}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 bg-white">
                                                {item.tableData.rows.map((row, rIdx) => (
                                                    <tr key={rIdx} className="hover:bg-gray-50/50">
                                                        {row.map((cell, cIdx) => <td key={cIdx} className="px-4 py-3 whitespace-pre-line text-gray-600">{cell}</td>)}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {item.isInteractiveOrgChart && (
                                    <InteractiveOrgChart onNavigate={handleNavigate} />
                                )}

                                {item.isRaciMatrix && (
                                    <div className="border border-gray-200 rounded-2xl overflow-x-auto shadow-lg mb-6">
                                        <table className="w-full text-[11px] text-left border-collapse min-w-[1000px]">
                                            <thead className="bg-slate-900 text-white font-black tracking-wider uppercase sticky top-0 z-20">
                                                <tr>
                                                    {RACI_HEADERS.map((h, i) => (
                                                        <th key={i} className={`px-2 py-4 border-r border-slate-700 whitespace-nowrap ${i < 2 ? 'sticky left-0 bg-slate-900 z-30 shadow-[2px_0_5px_rgba(0,0,0,0.1)]' : 'text-center'}`}>
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {(item.id === 'raci-state' ? RACI_ROWS_25_10 : RACI_ROWS_25_20).map((row, rIdx) => (
                                                    <tr key={rIdx} className={row[0].length === 1 ? "bg-slate-50 font-black" : "hover:bg-orange-50/30 transition-colors"}>
                                                        {row.map((cell, cIdx) => (
                                                            <td key={cIdx} className={`px-2 py-3 border-r border-gray-100 ${cIdx < 2 ? 'sticky left-0 bg-white font-bold text-slate-800 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.05)]' : 'text-center'}`}>
                                                                {cIdx < 2 ? cell : <RaciCell value={cell as string} />}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PolicyViewer;
