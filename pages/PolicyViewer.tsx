
import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import {
    FileText, History, GitCommit, Info,
    Users, Info as InfoIcon, Search,
    Printer, Database, CheckSquare, Wallet, Gift, Shield, ChevronDown
} from 'lucide-react';

// --- INTERFACES & DATA ---
interface PolicyItem {
    id: string;
    title: string;
    text?: string;
    subItems?: string[];
    notes?: string[];
    tableData?: {
        headers: string[];
        rows: (string | React.ReactNode)[][];
    };
    isInteractiveOrgChart?: boolean; // Changed from isOrgChart to interactive
    isRaciMatrix?: boolean;
    isFormula?: boolean;
}

interface PolicySection {
    id: string;
    title: string;
    icon?: any;
    content: PolicyItem[];
}

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
const OrgLineHorizontal = ({ width = "w-full" }) => <div className={`h-0.5 bg-gray-300 ${width}`}></div>;

const InteractiveOrgChart = ({ onNavigate }: { onNavigate: (id: string) => void }) => {
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 overflow-x-auto min-w-full">
            <div className="flex flex-col items-center min-w-[800px]">
                {/* Level 1: GĐTT */}
                <OrgNode
                    title="Giám đốc Trung tâm"
                    code="10.10"
                    onClick={onNavigate}
                    colorClass="bg-orange-50 border-orange-200 text-orange-800 ring-2 ring-orange-100"
                />
                <OrgLineVertical height="h-8" />

                {/* Level 2: PGĐTT */}
                <OrgNode
                    title="Phó Giám đốc"
                    code="10.15"
                    onClick={onNavigate}
                    colorClass="bg-orange-50/50 border-orange-200 text-gray-800"
                />
                <OrgLineVertical height="h-8" />

                {/* Level 3 Connector */}
                <div className="relative w-[90%] flex justify-center">
                    <div className="absolute top-0 w-full border-t-2 border-gray-300"></div>
                    {/* Vertical lines dropping to Level 3 nodes */}
                    <div className="absolute top-0 left-0 w-0.5 h-8 bg-gray-300"></div> {/* Leftmost */}
                    <div className="absolute top-0 left-1/4 w-0.5 h-8 bg-gray-300"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gray-300"></div> {/* Center */}
                    <div className="absolute top-0 right-1/4 w-0.5 h-8 bg-gray-300"></div>
                    <div className="absolute top-0 right-0 w-0.5 h-8 bg-gray-300"></div> {/* Rightmost */}
                </div>

                {/* Level 3: Department Heads */}
                <div className="grid grid-cols-5 gap-4 mt-8 w-full">
                    {/* Col 1: QA/QC */}
                    <div className="flex flex-col items-center">
                        <OrgNode title="TBP Quản lý CL" code="10.24" onClick={onNavigate} />
                    </div>

                    {/* Col 2: MEP */}
                    <div className="flex flex-col items-center">
                        <OrgNode title="TB Môn Cơ Điện" code="10.20" onClick={onNavigate} />
                        <OrgLineVertical height="h-4" />
                        <OrgNode title="Thành viên" code="10.30" onClick={onNavigate} colorClass="bg-gray-50 border-gray-200 text-gray-500 scale-90" />
                    </div>

                    {/* Col 3: Architecture/Structure */}
                    <div className="flex flex-col items-center">
                        <OrgNode title="TB Môn KT-KC" code="10.20" onClick={onNavigate} />
                        <OrgLineVertical height="h-4" />
                        <OrgNode title="Thành viên" code="10.30" onClick={onNavigate} colorClass="bg-gray-50 border-gray-200 text-gray-500 scale-90" />
                    </div>

                    {/* Col 4: Project Promotion */}
                    <div className="flex flex-col items-center">
                        <OrgNode title="TBP Xúc tiến DA" code="10.26" onClick={onNavigate} />
                        <OrgLineVertical height="h-4" />
                        <OrgNode title="Thành viên" code="10.36" onClick={onNavigate} colorClass="bg-gray-50 border-gray-200 text-gray-500 scale-90" />
                    </div>

                    {/* Col 5: R&D */}
                    <div className="flex flex-col items-center">
                        <OrgNode title="TBP R&D" code="10.28" onClick={onNavigate} />
                    </div>
                </div>

                {/* Side Node: Admin (Usually connects to GĐTT or PGĐTT separately, but putting here for simplicity based on previous diagram context, usually admin supports whole center) */}
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


// RACI Headers
const RACI_HEADERS = [
    'STT', 'Nội dung công việc',
    'GĐTT', 'PGĐTT', 'TBP Admin', 'TBP QA/QC',
    'TBM', 'TVBM', 'TBP XTDA', 'TBP R&D',
    'QLDA', 'QL BIM', 'ĐPBM', 'TNDH', 'NDH'
];

// RACI Data 25.10 (Vốn ngân sách)
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

// RACI Data 25.20 (Vốn ngoài NS)
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

const POLICY_CONTENT: PolicySection[] = [
    {
        id: 'versions',
        title: 'Quản lý phiên bản',
        icon: History,
        content: [
            {
                id: 'versions-table',
                title: 'Lịch sử cập nhật tài liệu',
                tableData: {
                    headers: ['STT', 'Số phiên bản', 'Ngày ban hành', 'Nội dung cập nhật'],
                    rows: [
                        ['01', 'P01', '02/09/2024', 'Phát hành lần đầu'],
                        ['02', 'P02', '31/12/2024 (DK)', 'Cập nhật thêm một số mục:\n+ Tuyển dụng\n+ Một số quy định chi tiết hơn cho Bimcollab, ClickUp\n+ Bổ sung thêm quy định về trang phục và vệ sinh\n+ Sửa đổi, cập nhật một số điều chưa hợp lý từ phiên bản 01'],
                        ['03', 'P03', '06/01/2026', 'Cập nhật một số nội dung:\n+ Sơ đồ tổ chức\n+ Quy trình triển khai Dự án & Ma trận Raci\n+ Phân chia tiền thưởng cuối năm']
                    ]
                }
            }
        ]
    },
    {
        id: 'intro',
        title: 'Lời nói đầu & Tổng quan',
        icon: Info,
        content: [
            {
                id: 'foreword',
                title: 'Lời nói đầu',
                text: 'Trong bối cảnh ngành xây dựng và công nghệ đang không ngừng phát triển, việc ứng dụng các công nghệ tiên tiến như BIM (Building Information Modeling) và Digital Twins đã trở thành xu thế tất yếu. Trung tâm BIM và Digital Twins của Công ty được thành lập với mục tiêu tiên phong trong việc áp dụng các giải pháp công nghệ để nâng cao chất lượng, hiệu quả và tính bền vững của các dự án xây dựng.\n\nNhằm đảm bảo sự phối hợp chặt chẽ và hiệu quả giữa các thành viên, đồng thời xây dựng một hệ thống quản lý minh bạch và chuyên nghiệp, tài liệu này được biên soạn để quy định rõ chức năng và nhiệm vụ của từng thành viên trong Trung tâm cũng như vai trò cụ thể của mỗi người trong từng dự án.\n\nTài liệu này sẽ là cơ sở quan trọng giúp mỗi thành viên hiểu rõ trách nhiệm của mình, từ đó góp phần nâng cao hiệu suất làm việc, tạo điều kiện thuận lợi cho quá trình triển khai dự án và đạt được những mục tiêu chiến lược của Công ty. Đồng thời, đây cũng là công cụ hỗ trợ quản lý, giúp lãnh đạo Trung tâm dễ dàng theo dõi, đánh giá và điều chỉnh phù hợp nhằm đảm bảo các dự án được thực hiện đúng tiến độ, đạt chất lượng cao nhất.\n\nVới sự hợp tác và cam kết mạnh mẽ của tất cả các thành viên, Trung tâm BIM và Digital Twins sẽ tiếp tục phát triển và khẳng định vị thế của mình trong ngành xây dựng hiện đại.'
            },
            {
                id: '01',
                title: '01. Phạm vi tài liệu',
                text: 'Tài liệu này xác định cơ chế hoạt động của Trung tâm BIM và Digital Twins tại Công ty. Nội dung tập trung vào việc quy định chức năng và nhiệm vụ của từng thành viên trong trung tâm, đồng thời hướng dẫn cách quản lý dữ liệu, công việc, và quy trình trong các dự án BIM. Tài liệu cũng cung cấp cơ cấu tổ chức, phương pháp làm việc, và hệ thống biểu mẫu, giúp đảm bảo tính minh bạch, hiệu quả, và nâng cao chất lượng trong các dự án xây dựng sử dụng công nghệ BIM và Digital Twins.'
            },
            {
                id: '02',
                title: '02. Mục đích của tài liệu',
                text: 'Tài liệu này được biên soạn nhằm thiết lập các quy định và hướng dẫn cụ thể về cách thức hoạt động, quản lý và phối hợp của Trung tâm BIM và Digital Twins trong Công ty. Nó hướng tới mục tiêu nâng cao hiệu suất làm việc, đảm bảo sự minh bạch trong quản lý, và cải thiện chất lượng dự án. Đồng thời, tài liệu còn đóng vai trò là công cụ hỗ trợ lãnh đạo trong việc theo dõi, đánh giá và điều chỉnh các hoạt động để đảm bảo các dự án đạt được kết quả tối ưu.'
            }
        ]
    },
    {
        id: '10',
        title: '10. Chức năng nhiệm vụ chung',
        icon: GitCommit,
        content: [
            {
                id: '10.00',
                title: '10.00. Sơ đồ tổ chức',
                text: '10.00.100. Sơ đồ tổ chức Trung tâm BIM và Digital Twin như sau:',
                isInteractiveOrgChart: true
            },
            {
                id: '10.10',
                title: '10.10. Giám đốc Trung tâm (GĐTT)',
                subItems: [
                    '10.10.100. Báo cáo công việc hàng tháng, hàng tuần lên ban giám đốc Công ty',
                    '10.10.110. Quản lý các công việc chung của trung tâm',
                    '10.10.113. Là cầu nối giữa Ban lãnh đạo Công ty và đội ngũ kỹ thuật BIM',
                    '10.10.115. Đại diện chuyên môn làm việc với Chủ đầu tư, đối tác và cơ quan quản lý nhà nước',
                    '10.10.117. Dẫn dắt đổi mới công nghệ, triển khai các giải pháp BIM, Digital Twins và AI',
                    '10.10.120. Tạo dự án mới, đặt tên cho dự án',
                    '10.10.130. Nắm và điều phối workload của các thành viên của trung tâm để phân công nhiệm vụ hợp lý, hài hòa.',
                    '10.10.140. Quản lý hiệu suất làm việc của các thành viên, đưa ra điều chỉnh nhằm nâng cao hiệu suất làm việc',
                    '10.10.150. Đề xuất với ban giám đốc Công ty bổ sung thêm thành viên mới',
                    '10.10.160. Quyết định tiếp nhận thành viên mới sau kết thúc thử việc',
                    '10.10.170. Đề xuất ban giám đốc công ty kết thúc hợp đồng với thành viên hiện tại',
                    '10.10.180. Đề xuất ban giám đốc công ty bổ sung / thay đổi môi trường, điều kiện làm việc của trung tâm',
                    '10.10.190. Tạo, quản lý, điều chỉnh cơ chế hoạt động của trung tâm',
                    '10.10.200. Nghiên cứu, tìm hiểu, phê duyệt các giải pháp kỹ thuật mới',
                    '10.10.210. Giao nhiệm vụ từng thành viên trong trung tâm khi có dự án mới phù hợp với năng lực kinh nghiệm và phương hướng phát triển của từng người',
                    '10.10.220. Huấn luyện, đào tạo cho các thành viên trong trung tâm',
                    '10.10.230. Xây dựng biểu mẫu đánh giá phẩm chất và lộ trình phát triển của từng thành viên trong trung tâm.',
                    '10.10.240. Xây dựng biểu mẫu đánh giá hiệu quả công việc của từng thành viên trung tâm',
                    '10.10.250. Đưa ra quyết định nếu vấn đề đưa ra lấy ý kiến biểu quyết mà giá trị biểu quyết đang cân bằng'
                ]
            },
            {
                id: '10.15',
                title: '10.15. Phó giám đốc Trung tâm (PGĐTT)',
                notes: ['Phó giám đốc Trung tâm được GĐTT giao cho ông: Nguyễn Bá Nhiệm đảm nhận'],
                subItems: [
                    '10.15.100. Hỗ trợ Giám đốc Trung tâm điều hành toàn bộ hoạt động của Trung tâm',
                    '10.15.110. Thay mặt GĐTT điều hành hoạt động của Trung tâm trong trường hợp GĐTT vắng mặt',
                    '10.15.120. Là cầu nối giữa Ban lãnh đạo Công ty và đội ngũ kỹ thuật BIM',
                    '10.15.130. Đại diện chuyên môn làm việc với Chủ đầu tư, đối tác và cơ quan quản lý nhà nước',
                    '10.15.140. Dẫn dắt đổi mới công nghệ, triển khai các giải pháp BIM, Digital Twins và AI',
                    '10.15.150. Tổ chức, phân công và giám sát các bộ phận trong trung tâm (mô hình hóa, thẩm tra, đào tạo, tư vấn quy trình BIM)',
                    '10.15.160. Quản lý tiến độ, chất lượng các dự án BIM/Digital Twins',
                    '10.15.170. Kiểm soát việc tuân thủ tiêu chuẩn BIM (EIR, BEP) và các quy định pháp luật hiện hành',
                    '10.15.180. Lên kế hoạch và tổ chức các chương trình đào tạo nội bộ và đào tạo cho khách hàng về BIM/Digital Twins',
                    '10.15.190. Hướng dẫn, cố vấn kỹ thuật cho Quản lý Dự án dưới sự phân công của GĐTT',
                    '10.15.200. Đề xuất các quy trình, công cụ mới nhằm tối ưu hóa năng suất và chất lượng.',
                    '10.15.210. Định hướng nghiên cứu khoa học liên quan đến BIM, Digital Twins, công nghệ AI trong xây dựng'
                ]
            },
            {
                id: '10.20',
                title: '10.20. Trưởng bộ môn (TBM)',
                notes: [
                    'Trưởng bộ môn cơ điện GĐTT giao cho ông: Nguyễn Bá Nhiệm đảm nhận',
                    'Trưởng bộ môn Kiến trúc kết cấu GĐTT giao cho ông: Vũ Văn Hòa đảm nhận'
                ],
                subItems: [
                    '10.20.100. Quản lý các thành viên của bộ môn mình quản lý',
                    '10.20.110. Báo cáo giám đốc trung tâm khi được yêu cầu',
                    '10.20.120. Tham mưu giám đốc trung tâm điều chỉnh Workload / hiệu suất của các thành viên trong bộ môn mình quản lý',
                    '10.20.130. Thúc đẩy hiệu suất làm việc của các thành viên bộ môn mình quản lý',
                    '10.20.140. Nghiên cứu, tìm hiểu, đề xuất lên giám đốc trung tâm các giải pháp kỹ thuật mới',
                    '10.20.150. Đào tạo kỹ năng mới cho các thành viên bộ môn mình quản lý cũng như các thành viên khác của trung tâm',
                    '10.20.160. Nắm bắt thông tin liên quan đến bộ môn mình của tất cả các dự án của Trung tâm',
                    '10.20.170. Báo cáo công việc hàng ngày trên nền tảng quản lý công việc của Trung tâm (ClickUp)'
                ]
            },
            {
                id: '10.22',
                title: '10.22. Trưởng bộ phận Admin (TAM)',
                notes: ['Trưởng bộ phận Admin GĐTT giao cho bà: Đào Đông Quỳnh đảm nhận'],
                subItems: [
                    '10.22.100. Quản lý Hành chính Tổng thể: Tổ chức, điều hành và giám sát mọi hoạt động hành chính, văn phòng',
                    '10.22.110. Quản lý Tài sản và Mua sắm: Chủ trì công tác quản lý tài sản, trang thiết bị, và thực hiện quy trình đề xuất, báo cáo mua sắm',
                    '10.22.120. Hỗ trợ Nhân sự: Phối hợp với Giám đốc/Phó Giám đốc trong công tác tuyển dụng, đào tạo, lưu trữ hồ sơ nhân sự',
                    '10.22.130. Quản lý Văn thư và Dữ liệu Nội bộ: Quản lý hệ thống văn bản, hồ sơ hành chính, tài liệu chung',
                    '10.22.140. Quản lý giờ công: Quản lý số ngày công thực tế (kể cả làm thêm cuối tuần) của các thành viên',
                    '10.22.150. Tham mưu và Báo cáo: Tham mưu cho Giám đốc Trung tâm về các giải pháp tối ưu hóa quy trình',
                    '10.22.160. Quản lý hồ sơ Thanh Quyết toán: Tạo lập hồ sơ phục vụ thanh quyết toán'
                ]
            },
            {
                id: '10.24',
                title: '10.24. Trưởng bộ phận Quản lý chất lượng (TQLCL)',
                text: '(Nội dung đang được cập nhật)',
                subItems: [
                    '10.24.100. Kiểm soát chất lượng hồ sơ, mô hình trước khi xuất bản',
                    '10.24.110. Xây dựng và duy trì hệ thống tiêu chuẩn QA/QC',
                    '10.24.120. Đào tạo quy trình kiểm soát chất lượng cho các thành viên'
                ]
            },
            {
                id: '10.26',
                title: '10.26. Trưởng bộ phận xúc tiến dự án (TXTDA)',
                notes: ['Trưởng bộ phận Xúc tiến dự án GĐTT giao cho ông: Nguyễn Quốc Anh đảm nhận'],
                subItems: [
                    '10.26.100. Lập kế hoạch và triển khai các hoạt động xúc tiến, mở rộng thị trường',
                    '10.26.110. Xây dựng và duy trì quan hệ với Chủ đầu tư, đối tác',
                    '10.26.120. Phối hợp lập hồ sơ dự thầu, đề xuất giải pháp kỹ thuật',
                    '10.26.130. Xây dựng tài liệu marketing, thực hiện các buổi trình bày chuyên môn',
                    '10.26.140. Nghiên cứu thị trường, đối thủ cạnh tranh',
                    '10.26.150. Báo cáo định kỳ về tình hình xúc tiến dự án',
                    '10.26.160. Hỗ trợ, tham mưu cho Quản lý Dự án trong quá trình triển khai hồ sơ',
                    '10.26.170. Đào tạo khách hàng tổng thể BIM, phần mềm'
                ]
            },
            {
                id: '10.28',
                title: '10.28. Trưởng bộ phận R&D (TRD)',
                text: '(Nội dung đang được cập nhật)',
                subItems: [
                    '10.28.100. Nghiên cứu công nghệ mới, tool, plugin hỗ trợ tăng năng suất',
                    '10.28.110. Đề xuất áp dụng các giải pháp Digital Twin, AI vào quy trình',
                    '10.28.120. Đào tạo công nghệ mới cho nội bộ'
                ]
            },
            {
                id: '10.30',
                title: '10.30. Thành viên bộ môn (TVBM)',
                subItems: [
                    '10.30.100. Tuân thủ các nội quy của trung tâm, Công ty',
                    '10.30.110. Quản lý Workload của bản thân',
                    '10.30.120. Duy trì hiệu suất làm việc của bản thân',
                    '10.30.130. Đề xuất với trưởng bộ môn, giám đốc trung tâm các vấn đề của Trung tâm',
                    '10.30.140. Nghiên cứu, tìm hiểu các giải pháp kỹ thuật mới, đệ trình lên Trưởng bộ môn',
                    '10.30.150. Đào tạo kỹ năng mới cho các thành viên khác',
                    '10.30.160. Báo cáo công việc hàng ngày trên nền tảng quản lý công việc (ClickUp)',
                    '10.30.170. Xin phép nghỉ trước ít nhất 1 ngày và thông báo đến các thành viên'
                ]
            },
            {
                id: '10.36',
                title: '10.36. Thành viên bộ phận xúc tiến dự án',
                text: '(Áp dụng tương tự quy định chung cho thành viên)',
                subItems: [
                    '10.36.100. Hỗ trợ trưởng bộ phận trong công tác chuẩn bị hồ sơ thầu',
                    '10.36.110. Tìm kiếm thông tin dự án, khách hàng tiềm năng'
                ]
            }
        ]
    },
    {
        id: '20',
        title: '20. Chức năng nhiệm vụ Dự án',
        icon: Users,
        content: [
            {
                id: '20.00',
                title: '20.00. Quy định chung',
                subItems: [
                    '20.00.100. Mỗi thành viên có thể mang nhiều chức năng trong dự án.',
                    '20.00.110. Quản lý dự án / Quản lý BIM sẽ do GĐTT bổ nhiệm khi bắt đầu triển khai dự án.',
                    '20.00.120. Quản lý dự án / Quản lý BIM cho dự án có thể là trưởng bộ môn, trưởng bộ phận Quản lý chất lượng, trưởng bộ phận Xúc tiến dự án'
                ]
            },
            {
                id: '20.10',
                title: '20.10. Quản lý Dự án / Quản lý BIM (QLDA/QLB)',
                subItems: [
                    '20.10.100. Quản lý chung cho Dự án',
                    '20.10.110. Giao nhiệm vụ cho các thành viên trong khuôn khổ dự án',
                    '20.10.120. Tạo các công việc mới trong khuôn khổ dự án',
                    '20.10.130. Kiểm tra, kiểm soát đột xuất một công việc',
                    '20.10.140. Điều chỉnh trạng thái của công việc trên Click Up',
                    '20.10.150. Kiểm soát tổng thể về Issue trên Bimcollab',
                    '20.10.160. Nắm tiến độ dự án, báo cáo Giám đốc trung tâm khi có yêu cầu',
                    '20.10.170. Làm việc trực tiếp với khách hàng rồi truyền đạt đến điều phối bộ môn',
                    '20.10.180. Tham dự cuộc họp điều phối với khách hàng',
                    '20.10.190. Lập kế hoạch triển khai (BEP) khi chuẩn bị triển khai dự án',
                    '20.10.200. Thiết lập file (tọa độ, cao độ, lưới trục)',
                    '20.10.210. Thiết lập lưu trữ dữ liệu cho dự án',
                    '20.10.220. Thiết lập Bimcollab cho dự án',
                    '20.10.230. Duyệt File hoặc ủy quyền duyệt file trước khi gửi cho khách hàng',
                    '20.10.240. Thêm hoặc bớt thư mục dự án phù hợp với thực tế',
                    '20.10.250. Tạo lập nhóm chung trao đổi công việc giữa CIC và khách hàng'
                ]
            },
            {
                id: '20.20',
                title: '20.20. Điều phối bộ môn (DPBM)',
                subItems: [
                    '20.20.100. Trao đổi, kết nối với các thành viên trong bộ môn của dự án',
                    '20.20.110. Kiểm tra mô hình đơn lẻ được gửi lên bởi người dựng hình',
                    '20.20.120. Kiểm tra mô hình tổng hợp bộ môn',
                    '20.20.130. Chỉ thêm Comments cho công việc',
                    '20.20.140. Nếu thiếu công việc, phản ánh lên BIM Manager để bổ sung',
                    '20.20.150. Tham gia cuộc họp điều phối với khách hàng',
                    '20.20.160. Tham gia trao đổi thông tin trong nhóm trao đổi (Zalo, Telegram...)',
                    '20.20.170. Tham gia tạo lập hoặc góp ý, đề xuất ý kiến xây dựng BEP'
                ]
            },
            {
                id: '20.30',
                title: '20.30. Trưởng nhóm dựng hình (TNDH)',
                subItems: [
                    '20.30.100. Người kiểm tra có thể là điều phối bộ môn hoặc người dựng hình',
                    '20.30.110. Được gán quyền Editor trong Bimcollab để tạo Issue',
                    '20.30.111. Được gán vai trò Assignee trong công việc trên ClickUp',
                    '20.30.120. Yêu cầu người dựng hình gửi file mới nhất để kiểm tra',
                    '20.30.130. Chịu trách nhiệm trước điều phối bộ môn về chất lượng mô hình',
                    '20.30.140. Có thể ủy quyền cho các thành viên trong tổ Dự án kiểm tra mô hình',
                    '20.30.150. Đào tạo, hướng dẫn người dựng hình để ngăn ngừa rủi ro'
                ]
            },
            {
                id: '20.40',
                title: '20.40. Người dựng hình (NDH)',
                subItems: [
                    '20.40.100. Nghiên cứu tài liệu / bản vẽ đầu vào',
                    '20.40.110. Triển khai các công việc theo sự phân công của quản lý BIM',
                    '20.40.120. Trực tiếp phát hiện lỗi sai từ mô hình, báo lên điều phối bộ môn',
                    '20.40.130. Đưa ra các ý kiến về mô hình được chia sẻ',
                    '20.40.140. Chủ động phòng ngừa các lỗi hay gặp',
                    '20.40.150. Tuân thủ quy định của BEP và yêu cầu của Điều phối bộ môn',
                    '20.40.160. Gửi mô hình đúng hạn lên mục 2095_Submital và comment trên ClickUp',
                    '20.40.170. Được gán với vai trò Reviewer với dự án trên Bimcollab',
                    '20.40.180. Được gán với vai trò 2nd Assignee cho công việc trên ClickUp'
                ]
            }
        ]
    },
    {
        id: 'raci',
        title: '25. Quy trình Dự án & Ma trận RACI',
        icon: Users,
        content: [
            {
                id: 'raci-state',
                title: '25.10. Quy trình 25.10 (Vốn Ngân Sách)',
                text: 'R: Bắt buộc | A: Phê duyệt | C: Tham vấn | I: Được thông báo',
                isRaciMatrix: true
            },
            {
                id: 'raci-non-state',
                title: '25.20. Quy trình 25.20 (Vốn Ngoài Ngân Sách)',
                text: 'R: Bắt buộc | A: Phê duyệt | C: Tham vấn | I: Được thông báo',
                isRaciMatrix: true
            }
        ]
    },
    {
        id: '30',
        title: '30. Quản lý dữ liệu',
        icon: Database,
        content: [
            {
                id: '30.10',
                title: '30.10. Không gian lưu trữ',
                subItems: [
                    '30.10.130. Sử dụng Google Drive là giải pháp lưu trữ chung của Trung tâm',
                    '30.10.140. Tất cả thông tin chung của trung tâm được lưu trữ tại thư mục CIC_BIM TEAM_INTERNAL',
                    '30.10.150. Thông tin cá nhân được lưu trữ tại thư mục CIC_BIM TEAM_INTERNAL\\90.For Individual',
                    '30.10.160. Giám đốc trung tâm tạo lập dự án mới (Tạo lập thư mục mới)'
                ],
                notes: [
                    'Tên dự án: <Mã Dự An>-<Tên Dự Án>_<Tên Đối Tác>_(INT)',
                    'Mã dự án: <Năm><Số thứ tự> (VD: 24015)',
                    'Tên Dự án: Chữ in hoa, tối đa 6 ký tự',
                    'Tên đối tác: Chữ in hoa, tối đa 10 ký tự'
                ]
            },
            {
                id: '30.20',
                title: '30.20. Biểu mẫu (Template)',
                subItems: [
                    '30.20.100. Giám đốc trung tâm BIM có trách nhiệm cập nhật, chỉnh sửa template',
                    '30.20.140. Mô hình Dự án mới bắt buộc phải được thiết lập dựa trên biểu mẫu có sẵn',
                    'Đường dẫn template: H:\\Shared drives\\CIC_BIM TEAM_INTERNAL\\30. Template'
                ]
            },
            {
                id: '30.30',
                title: '30.30. Cấu trúc thư mục',
                subItems: [
                    '30.30.100. Cấu trúc thư mục được quản lý bởi Giám đốc Trung tâm BIM',
                    '30.30.140. Tên thư mục gồm 2 thành phần: phần mã thư mục và tên. Từ cấp 4 trở lên bắt buộc đánh mã.',
                    '30.30.141. Chỉ tạo tối đa không quá 7 cấp thư mục'
                ]
            },
            {
                id: '30.40',
                title: '30.40. Dữ liệu dự án',
                subItems: [
                    '30.40.100. Quản lý BIM là người có vai trò Admin đối với thư mục Dự án do mình quản lý',
                    '30.40.140. Mục 2095_Submital gán vai trò "Người quản lý nội dung" cho tất cả thành viên dự án',
                    '30.40.160. Dữ liệu, file, mô hình của từng cá nhân liên quan đến dự án được đặt trên thư mục cá nhân'
                ]
            },
            {
                id: '30.50',
                title: '30.50. Phiên bản',
                subItems: [
                    '30.50.130. Phiên bản trước chia sẻ (S0) có dạng P01.01',
                    '30.50.140. Phiên bản sau chia sẻ (S1 trở đi) có dạng P01 (lược bỏ 2 số sau)',
                    'Cấu trúc tên file: <Mã>_<TênFile>_<PhiênBản>. Ví dụ: K8HH1_CIC_BD_STRU_01FL_P01.01'
                ]
            }
        ]
    },
    {
        id: '40',
        title: '40. Quản lý công việc',
        icon: CheckSquare,
        content: [
            {
                id: '40.10',
                title: '40.10. Mua sắm',
                subItems: [
                    '40.10.100. Thành viên trung tâm báo cáo đề xuất mua sắm lên giám đốc trung tâm',
                    '40.10.110. Báo cáo mua sắm phải làm rõ: Lợi ích, Chi phí, Số lượng, Mục đích',
                    'Biểu mẫu tại: 99.50_Bao Cao Mua Sam\\99.50.10_Bieu Mau Bao Cao'
                ]
            },
            {
                id: '40.20',
                title: '40.20. ClickUp',
                subItems: [
                    '40.20.100. Giám đốc trung tâm sẽ tạo dự án mới trên ClickUp',
                    '40.20.110. Các phân vùng: ONGOING PROJECT, POTENTIAL PROJECT, BIM & DIGITAL TWIN, FINISH PROJECT',
                    '40.20.300. Loại công việc: Task, Milestone (hình thoi), Chu kỳ (vô cực), Đột Xuất',
                    '40.20.420. Trạng thái công việc: Not Started, Active (S0-S6.1), Done (S4-S6), Closed'
                ],
                notes: [
                    'S0: Đang thực hiện', 'S1: Phối hợp', 'S2: Tham khảo', 'S3: Duyệt nội bộ',
                    'S4: Lãnh đạo duyệt', 'S6: Trình khách hàng', 'COMPLETE: Hoàn thành'
                ]
            },
            {
                id: '40.30',
                title: '40.30. BimCollab',
                subItems: [
                    '40.30.100. Giám đốc Trung tâm tạo dự án dựa trên Template',
                    '40.30.120. Tên dự án trên Bimcollab phải giống tên Dự án trên Drive và ClickUp',
                    'Quyền hạn: Viewer (Chủ đầu tư), Reviewer (Người dựng hình), Editor (Điều phối bộ môn), Project Leader (QLDA)'
                ]
            },
            {
                id: '40.40',
                title: '40.40. Tuyển Dụng',
                subItems: [
                    '40.40.100. Trưởng bộ môn tạo bản mô tả công việc gửi phòng nhân sự',
                    '40.40.110. Trưởng bộ môn lọc hồ sơ, phỏng vấn lần 1',
                    '40.40.130. Giám đốc trung tâm và trưởng bộ môn phỏng vấn lần 2'
                ]
            }
        ]
    },
    {
        id: '50',
        title: '50. Quỹ Trung tâm',
        icon: Wallet,
        content: [
            {
                id: '50.10',
                title: '50.10. Quy định chung',
                subItems: [
                    '50.10.110. Quỹ dùng cho công việc chung, hiếu hỉ, mua sắm...',
                    '50.10.120. Người nắm quỹ: Hà Văn Đức',
                    '50.20.120. Đóng quỹ định kỳ đầu tháng: 200.000 VNĐ/người'
                ]
            }
        ]
    },
    {
        id: '60',
        title: '60. Thưởng tết',
        icon: Gift,
        content: [
            {
                id: '60.10',
                title: '60.10. Nguyên tắc chung',
                text: 'Thưởng dựa trên doanh thu của Trung tâm nhằm khuyến khích sự nỗ lực, cống hiến.'
            },
            {
                id: '60.30',
                title: '60.30. Quy trình chia thưởng',
                text: 'Giá trị thưởng (G) = GD + NCPT + TCHC + CTK + KTNL + G1 + G2',
                notes: [
                    'GD (Giám đốc): 18%',
                    'NCPT (Nghiên cứu PT): 3%',
                    'TCHC (Tổ chức HC): 1.5%',
                    'KTNL (Kiểm tra năng lực): 10 triệu (chia 45%, 35%, 20% cho Top 3)',
                    'G1, G2: Thưởng cho các đội bộ môn'
                ]
            },
            {
                id: '60.30.formula',
                title: 'Công thức phân chia',
                isFormula: true,
                text: `
              Công thức tính thưởng bộ môn:
              G1 = G x (T1 / (T1 + T2))
              G2 = G x (T2 / (T1 + T2))
              
              Trong đó:
              T = Tổng số tháng làm việc của tất cả thành viên trong đội
              `
            }
        ]
    },
    {
        id: '90',
        title: '90. Quy định khác',
        icon: Shield,
        content: [
            {
                id: '90.10',
                title: '90.10. Trang phục',
                subItems: [
                    '90.10.110. Mặc lịch sự, gọn gàng, phù hợp môi trường văn phòng',
                    '90.10.140. Quần tây, quần vải, quần jean dáng dài (không rách). Không mặc quần đùi.',
                    '90.10.150. Tránh màu sắc quá chói, sặc sỡ.'
                ]
            },
            {
                id: '90.20',
                title: '90.20. Vệ sinh',
                subItems: [
                    '90.20.100. Bàn làm việc sắp xếp gọn gàng trước khi ra về',
                    '90.20.110. Tự vệ sinh hút bụi khu vực làm việc ít nhất 1 tuần/lần',
                    '90.20.120. Sắp xếp giày dép, thảm gọn gàng',
                    '90.20.140. Tắt điện, điều hòa, đóng cửa sổ khi ra về'
                ]
            }
        ]
    }
];

const PolicyViewer = () => {
    const [activeSectionId, setActiveSectionId] = useState<string>(POLICY_CONTENT[0].id);
    const [searchQuery, setSearchQuery] = useState('');

    const activeSection = POLICY_CONTENT.find(s => s.id === activeSectionId) || POLICY_CONTENT[0];

    const filteredContent = useMemo(() => {
        if (!searchQuery) return POLICY_CONTENT;
        return POLICY_CONTENT.filter(s =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.content.some(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery]);

    const handleScrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Highlight effect
            element.classList.add('bg-orange-50', 'transition-colors', 'duration-500');
            setTimeout(() => {
                element.classList.remove('bg-orange-50');
            }, 2000);
        }
    };

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
                                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-100 text-gray-600 font-bold">
                                                <tr>
                                                    {item.tableData.headers.map((h, i) => <th key={i} className="px-4 py-3 border-b">{h}</th>)}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {item.tableData.rows.map((row, rIdx) => (
                                                    <tr key={rIdx} className="hover:bg-gray-50">
                                                        {row.map((cell, cIdx) => <td key={cIdx} className="px-4 py-3 whitespace-pre-line">{cell}</td>)}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {item.isInteractiveOrgChart && (
                                    <InteractiveOrgChart onNavigate={handleScrollToSection} />
                                )}

                                {item.isRaciMatrix && (
                                    <div className="border border-gray-200 rounded-lg overflow-x-auto">
                                        <table className="w-full text-sm text-left border-collapse min-w-[800px]">
                                            <thead className="bg-slate-800 text-white text-xs uppercase">
                                                <tr>
                                                    {RACI_HEADERS.map((h, i) => (
                                                        <th key={i} className={`px-2 py-3 border border-slate-700 ${i < 2 ? 'sticky left-0 bg-slate-800 z-10' : 'text-center'}`}>
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {(item.id === 'raci-state' ? RACI_ROWS_25_10 : RACI_ROWS_25_20).map((row, rIdx) => (
                                                    <tr key={rIdx} className={row[0].length === 1 ? "bg-slate-50 font-bold" : "hover:bg-orange-50/20"}>
                                                        {row.map((cell, cIdx) => (
                                                            <td key={cIdx} className={`px-2 py-2 border border-gray-100 ${cIdx < 2 ? 'sticky left-0 bg-white' : 'text-center'}`}>
                                                                {cIdx < 2 ? cell : <RaciCell value={cell} />}
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
