
import {
  Project, Contract, Employee, Department, KPI, Task, TaskStatus, TaskPriority,
  ProjectMember, CRMContact, CRMActivity, CRMOpportunity,
  ConstructionType, ConstructionLevel, ContractType, ContractStatus, ProjectStatus, PaymentStatus
} from './types';

// import { getAvatar } from './utils/avatar'; 

export const getAvatar = (name: string) => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
};


export * from './constants_data/customers';
export * from './constants_data/projects';
export * from './constants_data/contracts';
export { SAMPLE_TASKS } from './constants_data/tasks';
export { RACI_TEMPLATES } from './raci-templates';

// --- ENUMS & CONSTANTS ---
export const PROJECT_GROUPS = ['BIM', 'Design', 'Consultancy', 'Construction', 'Training'] as const;

export const CONSTRUCTION_TYPES: ConstructionType[] = [
  'Dân dụng', 'Giao thông', 'Hạ tầng kỹ thuật', 'Công nghiệp', 'Nông nghiệp & PTNT'
];

export const CONSTRUCTION_LEVELS: ConstructionLevel[] = ['I', 'II', 'III', 'IV', 'Đặc biệt'];

export const KPIS: KPI[] = [
  { id: 'KPI-001', name: 'Doanh thu cá nhân', target: 500000000, actual: 350000000, unit: 'VNĐ', weight: 40 },
  { id: 'KPI-002', name: 'Tiến độ dự án', target: 100, actual: 95, unit: '%', weight: 30 },
  { id: 'KPI-003', name: 'Đào tạo nội bộ', target: 20, actual: 15, unit: 'Giờ', weight: 10 },
  { id: 'KPI-004', name: 'Sáng kiến cải tiến', target: 2, actual: 1, unit: 'Sáng kiến', weight: 20 }
];

const getDepartment = (id: string): Department => ({ id, name: id === 'BIM' ? 'Trung tâm BIM' : 'Phòng ban khác' });

// --- MOCK USERS (Auth) ---
export const MOCK_USERS = [
  { id: 'U1', username: 'admin', password: '123', role: 'admin', name: 'Nguyễn Quốc Anh', avatar: 'https://i.pravatar.cc/150?u=admin' },
  { id: 'U2', username: 'kientruc', password: '123', role: 'architect', name: 'Vũ Ngọc Thủy', avatar: 'https://i.pravatar.cc/150?u=kientruc' },
  { id: 'U3', username: 'ketcau', password: '123', role: 'engineer', name: 'Nguyễn Đức Thành', avatar: 'https://i.pravatar.cc/150?u=ketcau' },
  { id: 'U4', username: 'mep', password: '123', role: 'engineer', name: 'Nguyễn Bá Nhiệm', avatar: 'https://i.pravatar.cc/150?u=mep' },
  { id: 'U5', username: 'manager', password: '123', role: 'manager', name: 'Trần Hữu Hải', avatar: 'https://i.pravatar.cc/150?u=manager' },
];

// --- RACI Roles ---
export const RACI_ROLES_MAPPING: Record<string, string> = {
  'GĐDA': 'Giám đốc Dự án',
  'CN': 'Chủ nhiệm',
  'CT': 'Chủ trì',
  'TKS': 'Thiết kế',
  'MTK': 'Mô hình thiết kế',
  'MTC': 'Mô hình thi công',
  'KST': 'Kiểm soát',
  'PD': 'Phê duyệt',
  'TV': 'Tư vấn',
  'Q': 'QA/QC'
};

// --- EMPLOYEES ---
export const EMPLOYEES: Employee[] = [
  // Board of Directors
  { id: 'NV001', code: 'NV001', name: 'Đặng Đức Hà', department: 'Ban lãnh đạo', position: 'Chủ tịch HĐQT', email: 'had@cic.com.vn', phone: '0901234567', status: 'Active', avatar: getAvatar('Đặng Đức Hà'), joinDate: '2010-01-01', skills: ['Management', 'Strategy'] },
  { id: 'NV002', code: 'NV002', name: 'Nguyễn Hoàng Hà', department: 'Ban lãnh đạo', position: 'Tổng Giám đốc', email: 'hanh@cic.com.vn', phone: '0901234568', status: 'Active', avatar: getAvatar('Nguyễn Hoàng Hà'), joinDate: '2012-05-15', skills: ['Management', 'Business Dev'] },
  { id: 'NV003', code: 'NV003', name: 'Lương Thành Hưng', department: 'Ban lãnh đạo', position: 'Phó TGĐ Thường trực', email: 'hunglt@cic.com.vn', phone: '0901234569', status: 'Active', avatar: getAvatar('Lương Thành Hưng'), joinDate: '2015-08-20', skills: ['Operations', 'BIM'] },
  { id: 'NV004', code: 'NV004', name: 'Lê Thế Hạnh', department: 'Ban lãnh đạo', position: 'Phó Tổng Giám đốc', email: 'hanhlt@cic.com.vn', phone: '0901234570', status: 'Active', avatar: getAvatar('Lê Thế Hạnh'), joinDate: '2018-02-10', skills: ['Sales', 'Finance'] },

  // BIM Center Leadership (Trung tâm TTBIM)
  { id: 'NV005', code: 'NV005', name: 'Đông Quỳnh', department: 'Trung tâm TTBIM', position: 'Giám đốc Trung tâm', email: 'quynhd@cic.com.vn', phone: '0901234571', status: 'Active', avatar: getAvatar('Đông Quỳnh'), joinDate: '2019-01-01', skills: ['BIM Management', 'Leadership', 'Revit'] },
  { id: 'NV006', code: 'NV006', name: 'Trần Hữu Hải', department: 'Trung tâm TTBIM', position: 'Phó Giám đốc TT', email: 'haith@cic.com.vn', phone: '0901234572', status: 'Active', avatar: getAvatar('Trần Hữu Hải'), joinDate: '2020-03-15', skills: ['Coordination', 'Navisworks', 'Tekla'] },
  { id: 'NV007', code: 'NV007', name: 'Dương Văn Tiên', department: 'Trung tâm TTBIM', position: 'Trưởng phòng Kỹ thuật', email: 'tiendv@cic.com.vn', phone: '0901234573', status: 'Active', avatar: getAvatar('Dương Văn Tiên'), joinDate: '2021-06-01', skills: ['Structural Eng', 'Civil 3D'] },
  { id: 'NV008', code: 'NV008', name: 'Nguyễn Quốc Anh', department: 'Trung tâm TTBIM', position: 'Trưởng phòng R&D', email: 'anhnq@cic.com.vn', phone: '0901234574', status: 'Active', avatar: getAvatar('Nguyễn Quốc Anh'), joinDate: '2022-09-10', skills: ['Programming', 'BIM API', 'AI'] },

  // Staff
  { id: 'NV009', code: 'NV009', name: 'Hoàng Thị Thùy', department: 'Trung tâm TTBIM', position: 'BIM Modeler', email: 'thuyht@cic.com.vn', phone: '0901234575', status: 'Active', avatar: getAvatar('Hoàng Thị Thùy'), joinDate: '2023-01-15' },
  { id: 'NV010', code: 'NV010', name: 'Bùi Đức Lương', department: 'Trung tâm TTBIM', position: 'BIM Modeler', email: 'luongbd@cic.com.vn', phone: '0901234576', status: 'Active', avatar: getAvatar('Bùi Đức Lương'), joinDate: '2023-02-20' },
  { id: 'NV011', code: 'NV011', name: 'Kim Thu Huyền', department: 'Trung tâm TTBIM', position: 'BIM Coordinator', email: 'huyenkt@cic.com.vn', phone: '0901234577', status: 'Active', avatar: getAvatar('Kim Thu Huyền'), joinDate: '2023-03-01' },
  { id: 'NV012', code: 'NV012', name: 'Phạm Việt Anh', department: 'Trung tâm TTBIM', position: 'MEP Engineer', email: 'anhpv@cic.com.vn', phone: '0901234578', status: 'Active', avatar: getAvatar('Phạm Việt Anh'), joinDate: '2023-04-10' },
  { id: 'NV013', code: 'NV013', name: 'Nguyễn Hữu Hùng', department: 'Trung tâm TTBIM', position: 'BIM Modeler', email: 'hungnh@cic.com.vn', phone: '0901234579', status: 'Active', avatar: getAvatar('Nguyễn Hữu Hùng'), joinDate: '2023-05-15' },
  { id: 'NV014', code: 'NV014', name: 'Trần Thịnh', department: 'Trung tâm TTBIM', position: 'BIM Modeler', email: 'thinht@cic.com.vn', phone: '0901234580', status: 'Active', avatar: getAvatar('Trần Thịnh'), joinDate: '2023-06-20' },
  { id: 'NV015', code: 'NV015', name: 'Vũ Văn Hòa', department: 'Trung tâm TTBIM', position: 'Site Engineer', email: 'hoavv@cic.com.vn', phone: '0901234581', status: 'Active', avatar: getAvatar('Vũ Văn Hòa'), joinDate: '2023-07-01' },
  { id: 'NV016', code: 'NV016', name: 'Nhữ Thị Thu Hiền', department: 'Trung tâm TTBIM', position: 'BIM Modeler', email: 'hiennt@cic.com.vn', phone: '0901234582', status: 'Active', avatar: getAvatar('Nhữ Thị Thu Hiền'), joinDate: '2023-08-15' },
  { id: 'NV017', code: 'NV017', name: 'Đặng Tuấn Hùng', department: 'Trung tâm TTBIM', position: 'IT Support', email: 'hungdt@cic.com.vn', phone: '0901234583', status: 'Active', avatar: getAvatar('Đặng Tuấn Hùng'), joinDate: '2023-09-10' },
  { id: 'NV018', code: 'NV018', name: 'Nguyễn Bá Nhiệm', department: 'Trung tâm TTBIM', position: 'MEP Lead', email: 'nhiemnb@cic.com.vn', phone: '0901234584', status: 'Active', avatar: getAvatar('Nguyễn Bá Nhiệm'), joinDate: '2023-10-01' },
  { id: 'NV019', code: 'NV019', name: 'Vũ Ngọc Thủy', department: 'Trung tâm TTBIM', position: 'Architect', email: 'thuyvn@cic.com.vn', phone: '0901234585', status: 'Active', avatar: getAvatar('Vũ Ngọc Thủy'), joinDate: '2023-11-15' },
  { id: 'NV020', code: 'NV020', name: 'Trần Đức Hoàng', department: 'Trung tâm TTBIM', position: 'Surveyor', email: 'hoangtd@cic.com.vn', phone: '0901234586', status: 'Active', avatar: getAvatar('Trần Đức Hoàng'), joinDate: '2023-12-01' },
  { id: 'NV021', code: 'NV021', name: 'Nguyễn Đức Thành', department: 'Trung tâm TTBIM', position: 'Structural Eng', email: 'thanhnd@cic.com.vn', phone: '0901234587', status: 'Active', avatar: getAvatar('Nguyễn Đức Thành'), joinDate: '2024-01-01' },
  { id: 'NV022', code: 'NV022', name: 'Nguyễn Xuân Trường', department: 'Trung tâm TTBIM', position: 'BIM Modeler', email: 'truongnx@cic.com.vn', phone: '0901234588', status: 'Active', avatar: getAvatar('Nguyễn Xuân Trường'), joinDate: '2024-02-15' },

  // Admin & HR
  { id: 'NV023', code: 'NV023', name: 'Phạm Thị Lan', department: 'Hành chính - Nhân sự', position: 'Trưởng phòng HCNS', email: 'lanpt@cic.com.vn', phone: '0901234590', status: 'Active', avatar: getAvatar('Phạm Thị Lan'), joinDate: '2019-05-20', skills: ['HR Management', 'Recruitment'] },
  { id: 'NV024', code: 'NV024', name: 'Lê Thị Mai', department: 'Hành chính - Nhân sự', position: 'Chuyên viên Nhân sự', email: 'mailt@cic.com.vn', phone: '0901234591', status: 'Active', avatar: getAvatar('Lê Thị Mai'), joinDate: '2021-08-15', skills: ['C&B', 'Training'] },

  // Finance & Accounting
  { id: 'NV025', code: 'NV025', name: 'Trần Văn Tài', department: 'Kế toán', position: 'Kế toán trưởng', email: 'taitv@cic.com.vn', phone: '0901234592', status: 'Active', avatar: getAvatar('Trần Văn Tài'), joinDate: '2016-11-01', skills: ['Accounting', 'Tax', 'Finance'] },
  { id: 'NV026', code: 'NV026', name: 'Nguyễn Thị Thu', department: 'Kế toán', position: 'Kế toán viên', email: 'thunt@cic.com.vn', phone: '0901234593', status: 'Active', avatar: getAvatar('Nguyễn Thị Thu'), joinDate: '2022-03-10', skills: ['Accounting'] },

  // Sale & Marketing
  { id: 'NV027', code: 'NV027', name: 'Đỗ Minh Tuấn', department: 'Kinh doanh', position: 'Trưởng phòng Kinh doanh', email: 'tuandm@cic.com.vn', phone: '0901234594', status: 'Active', avatar: getAvatar('Đỗ Minh Tuấn'), joinDate: '2020-06-01', skills: ['Sales B2B', 'Negotiation'] },
  { id: 'NV028', code: 'NV028', name: 'Vũ Thị Hằng', department: 'Kinh doanh', position: 'Chuyên viên Kinh doanh', email: 'hangvt@cic.com.vn', phone: '0901234595', status: 'Active', avatar: getAvatar('Vũ Thị Hằng'), joinDate: '2023-01-05', skills: ['Sales Support', 'CRM'] },

  // IT Support (More)
  { id: 'NV029', code: 'NV029', name: 'Ngô Văn Nam', department: 'IT', position: 'System Admin', email: 'namnv@cic.com.vn', phone: '0901234596', status: 'Active', avatar: getAvatar('Ngô Văn Nam'), joinDate: '2021-12-12', skills: ['Network', 'Security'] },
  { id: 'NV030', code: 'NV030', name: 'Bùi Thị Dung', department: 'IT', position: 'Helpdesk', email: 'dungbt@cic.com.vn', phone: '0901234597', status: 'Active', avatar: getAvatar('Bùi Thị Dung'), joinDate: '2023-09-20', skills: ['Support', 'Office 365'] },
];

export const MOCK_CRM_CONTACTS: CRMContact[] = [];
export const MOCK_CRM_ACTIVITIES: CRMActivity[] = [];
export const MOCK_CRM_OPPORTUNITIES: CRMOpportunity[] = [];

export const QUALITY_CHECKLISTS = [
  {
    id: 'CL-ARC-01', name: 'Checklist Kiến trúc - Giai đoạn TKCS', departmentId: 'BIM', items: [
      { id: 'I1', content: 'Kiểm tra cao độ sàn hoàn thiện', required: true },
      { id: 'I2', content: 'Kiểm tra vị trí tường xây', required: true },
      { id: 'I3', content: 'Kiểm tra kích thước cửa', required: false }
    ]
  },
  {
    id: 'CL-STR-01', name: 'Checklist Kết cấu - Giai đoạn Thẩm tra', departmentId: 'BIM', items: [
      { id: 'I4', content: 'Kiểm tra tiết diện dầm/cột', required: true },
      { id: 'I5', content: 'Kiểm tra sơ đồ tính', required: true }
    ]
  },
  {
    id: 'CL-MEP-01', name: 'Checklist MEP - Giai đoạn Combine', departmentId: 'BIM', items: [
      { id: 'I6', content: 'Kiểm tra cao độ ống gió', required: true },
      { id: 'I7', content: 'Check clash với Dầm chính', required: true },
      { id: 'I8', content: 'Kiểm tra độ dốc ống nước ngưng', required: true },
      { id: 'I9', content: 'Khoảng cách ty treo', required: false }
    ]
  }
];

export const MOCK_CHECKLIST_LOGS = [];
export const MOCK_DELIVERABLES = [];

// --- PROJECT TEMPLATES (7 GIAI ĐOẠN THEO QUY CHẾ) ---
export const PROJECT_TEMPLATES = [
  {
    id: 'tpl-bim-civil',
    name: 'Dự án BIM Dân dụng (Tiêu chuẩn)',
    description: 'Mẫu dự án BIM cho công trình nhà ở, văn phòng, khách sạn theo quy trình ISO 19650.',
    type: 'Dân dụng',
    defaultPhases: ['Xúc tiến Dự án', 'Báo giá', 'Chuẩn bị Triển khai', 'Triển khai Trình thẩm định', 'Triển khai Hỗ trợ QLDA', 'Thanh Quyết toán', 'Lưu trữ & Rút kinh nghiệm'],
    defaultTasks: [
      // Phase 1: Xúc tiến Dự án
      { name: 'Demo năng lực BIM cho khách hàng', phase: 'Xúc tiến Dự án', durationDays: 3, role: 'BIM Manager' },
      { name: 'Khảo sát yêu cầu dự án & Scope', phase: 'Xúc tiến Dự án', durationDays: 2, role: 'BIM Manager' },
      { name: 'Lập hồ sơ năng lực team', phase: 'Xúc tiến Dự án', durationDays: 2, role: 'BIM Manager' },
      // Phase 2: Báo giá
      { name: 'Phân tích khối lượng công việc', phase: 'Báo giá', durationDays: 3, role: 'BIM Manager' },
      { name: 'Lập BEP sơ bộ & Dự toán', phase: 'Báo giá', durationDays: 5, role: 'BIM Manager' },
      { name: 'Thuyết trình phương án kỹ thuật', phase: 'Báo giá', durationDays: 2, role: 'BIM Manager' },
      { name: 'Đàm phán & Ký hợp đồng', phase: 'Báo giá', durationDays: 7, role: 'BIM Manager' },
      // Phase 3: Chuẩn bị Triển khai
      { name: 'Kick-off meeting dự án', phase: 'Chuẩn bị Triển khai', durationDays: 1, role: 'BIM Manager' },
      { name: 'Lập BIM Execution Plan (BEP)', phase: 'Chuẩn bị Triển khai', durationDays: 5, role: 'BIM Manager' },
      { name: 'Setup CDE & Folder Structure', phase: 'Chuẩn bị Triển khai', durationDays: 2, role: 'Coordinator' },
      { name: 'Khởi tạo Template & Standards', phase: 'Chuẩn bị Triển khai', durationDays: 3, role: 'Modeler (ARC)' },
      { name: 'Phân công nhân sự dự án', phase: 'Chuẩn bị Triển khai', durationDays: 1, role: 'BIM Manager' },
      // Phase 4: Triển khai Trình thẩm định (Thiết kế cơ sở)
      { name: 'Dựng hình Kiến trúc (LOD 200)', phase: 'Triển khai Trình thẩm định', durationDays: 14, role: 'Modeler (ARC)' },
      { name: 'Dựng hình Kết cấu (LOD 200)', phase: 'Triển khai Trình thẩm định', durationDays: 14, role: 'Modeler (STR)' },
      { name: 'Kiểm tra va chạm sơ bộ', phase: 'Triển khai Trình thẩm định', durationDays: 3, role: 'Coordinator' },
      { name: 'Xuất hồ sơ TKCS trình thẩm định', phase: 'Triển khai Trình thẩm định', durationDays: 5, role: 'BIM Manager' },
      // Phase 5: Triển khai Hỗ trợ QLDA (Thiết kế kỹ thuật + Thi công)
      { name: 'Mô hình chi tiết Kiến trúc (LOD 350)', phase: 'Triển khai Hỗ trợ QLDA', durationDays: 20, role: 'Modeler (ARC)' },
      { name: 'Mô hình chi tiết Kết cấu (LOD 350)', phase: 'Triển khai Hỗ trợ QLDA', durationDays: 20, role: 'Modeler (STR)' },
      { name: 'Mô hình MEP (LOD 350)', phase: 'Triển khai Hỗ trợ QLDA', durationDays: 25, role: 'Modeler (MEP)' },
      { name: 'Phối hợp Clash Detection', phase: 'Triển khai Hỗ trợ QLDA', durationDays: 5, role: 'Coordinator' },
      { name: 'Xuất hồ sơ bản vẽ thi công', phase: 'Triển khai Hỗ trợ QLDA', durationDays: 10, role: 'BIM Manager' },
      { name: 'Hỗ trợ thi công & RFI', phase: 'Triển khai Hỗ trợ QLDA', durationDays: 30, role: 'Coordinator' },
      // Phase 6: Thanh Quyết toán
      { name: 'Lập biên bản nghiệm thu giai đoạn', phase: 'Thanh Quyết toán', durationDays: 3, role: 'BIM Manager' },
      { name: 'Hoàn thiện hồ sơ As-Built', phase: 'Thanh Quyết toán', durationDays: 10, role: 'Coordinator' },
      { name: 'Xác nhận khối lượng thanh toán', phase: 'Thanh Quyết toán', durationDays: 5, role: 'BIM Manager' },
      { name: 'Đối chiếu công nợ & Xuất hóa đơn', phase: 'Thanh Quyết toán', durationDays: 3, role: 'BIM Manager' },
      // Phase 7: Lưu trữ & Rút kinh nghiệm
      { name: 'Archive hồ sơ lên CDE/NAS', phase: 'Lưu trữ & Rút kinh nghiệm', durationDays: 2, role: 'Coordinator' },
      { name: 'Họp rút kinh nghiệm (Lessons Learned)', phase: 'Lưu trữ & Rút kinh nghiệm', durationDays: 1, role: 'BIM Manager' },
      { name: 'Cập nhật Knowledge Base', phase: 'Lưu trữ & Rút kinh nghiệm', durationDays: 2, role: 'BIM Manager' }
    ],
    defaultDocs: ['BEP Template', 'Checklist QA/QC', 'Form RFI', 'Biên bản nghiệm thu']
  },
  {
    id: 'tpl-bim-infra',
    name: 'Dự án BIM Hạ tầng / Cầu đường',
    description: 'Mẫu áp dụng cho công trình cầu, đường hầm, hạ tầng kỹ thuật.',
    type: 'Giao thông',
    defaultPhases: ['Xúc tiến Dự án', 'Báo giá', 'Chuẩn bị Triển khai', 'Triển khai Trình thẩm định', 'Triển khai Hỗ trợ QLDA', 'Thanh Quyết toán', 'Lưu trữ & Rút kinh nghiệm'],
    defaultTasks: [
      // Phase 1: Xúc tiến Dự án
      { name: 'Demo năng lực BIM Hạ tầng', phase: 'Xúc tiến Dự án', durationDays: 3, role: 'BIM Manager' },
      { name: 'Khảo sát yêu cầu dự án', phase: 'Xúc tiến Dự án', durationDays: 2, role: 'BIM Manager' },
      // Phase 2: Báo giá
      { name: 'Phân tích khối lượng & Lập dự toán', phase: 'Báo giá', durationDays: 5, role: 'BIM Manager' },
      { name: 'Thuyết trình & Đàm phán', phase: 'Báo giá', durationDays: 5, role: 'BIM Manager' },
      // Phase 3: Chuẩn bị Triển khai
      { name: 'Kick-off & BEP', phase: 'Chuẩn bị Triển khai', durationDays: 5, role: 'BIM Manager' },
      { name: 'Setup Civil 3D Template', phase: 'Chuẩn bị Triển khai', durationDays: 3, role: 'Modeler (Civil)' },
      // Phase 4: Triển khai Trình thẩm định
      { name: 'Xử lý dữ liệu Khảo sát (Point Cloud)', phase: 'Triển khai Trình thẩm định', durationDays: 10, role: 'Surveyor' },
      { name: 'Dựng tuyến (Alignment)', phase: 'Triển khai Trình thẩm định', durationDays: 5, role: 'Modeler (Civil)' },
      { name: 'Dựng bề mặt (Corridor) & Taluy', phase: 'Triển khai Trình thẩm định', durationDays: 10, role: 'Modeler (Civil)' },
      { name: 'Xuất hồ sơ TKCS', phase: 'Triển khai Trình thẩm định', durationDays: 5, role: 'BIM Manager' },
      // Phase 5: Triển khai Hỗ trợ QLDA
      { name: 'Mô hình Cầu/Cống chi tiết', phase: 'Triển khai Hỗ trợ QLDA', durationDays: 20, role: 'Modeler (STR)' },
      { name: 'Tính toán khối lượng đào đắp', phase: 'Triển khai Hỗ trợ QLDA', durationDays: 5, role: 'BIM Manager' },
      { name: 'Hỗ trợ thi công hiện trường', phase: 'Triển khai Hỗ trợ QLDA', durationDays: 30, role: 'Coordinator' },
      // Phase 6: Thanh Quyết toán
      { name: 'Nghiệm thu & As-Built', phase: 'Thanh Quyết toán', durationDays: 10, role: 'BIM Manager' },
      { name: 'Xuất hóa đơn thanh toán', phase: 'Thanh Quyết toán', durationDays: 3, role: 'BIM Manager' },
      // Phase 7: Lưu trữ
      { name: 'Archive & Lessons Learned', phase: 'Lưu trữ & Rút kinh nghiệm', durationDays: 3, role: 'BIM Manager' }
    ],
    defaultDocs: ['Quy trình CDE', 'Civil 3D Template', 'Báo cáo khối lượng']
  }
];


// MOCK DATA IMPORTS
import { SAMPLE_TASKS as TASKS_DATA } from './constants_data/tasks';
import { MOCK_PROJECT_COSTS as COSTS_DATA } from './constants_data/costs';
export const TASKS: Task[] = [...TASKS_DATA];
export const PROJECT_COSTS = [...COSTS_DATA];
export const MOCK_PROJECT_MEMBERS: ProjectMember[] = [];

// --- CHARTS DATA ---
export const REVENUE_DATA = [
  { name: 'T1', revenue: 400000000, expenses: 240000000 },
  { name: 'T2', revenue: 300000000, expenses: 139800000 },
  { name: 'T3', revenue: 200000000, expenses: 980000000 },
  { name: 'T4', revenue: 278000000, expenses: 390800000 },
  { name: 'T5', revenue: 189000000, expenses: 480000000 },
  { name: 'T6', revenue: 239000000, expenses: 380000000 },
];

export const CASHFLOW_DATA = [
  { name: 'T1', plan: 800000000, actual: 840000000 },
  { name: 'T2', plan: 200000000, actual: 150000000 },
  { name: 'T3', plan: 450000000, actual: 400000000 },
  { name: 'T4', plan: 600000000, actual: 300000000 },
  { name: 'T5', plan: 500000000, actual: 550000000 },
  { name: 'T6', plan: 1200000000, actual: 1260000000 },
  { name: 'T7', plan: 300000000, actual: 0 },
  { name: 'T8', plan: 400000000, actual: 0 },
  { name: 'T9', plan: 250000000, actual: 0 },
  { name: 'T10', plan: 800000000, actual: 0 },
  { name: 'T11', plan: 1600000000, actual: 0 },
  { name: 'T12', plan: 500000000, actual: 0 },
];

export const RESOURCE_DATA = [
  { name: 'Tính phí', value: 75, fill: '#3b82f6' },
  { name: 'Nội bộ', value: 25, fill: '#e2e8f0' },
];

export const WORKFLOW_TEMPLATES: Record<string, any[]> = {
  'wf-1.1': [
    { step: 1, title: 'Tiếp nhận yêu cầu', role: 'QL BIM', description: 'Nhận yêu cầu demo/thuyết trình từ BGĐ hoặc Khách hàng. Xác định phạm vi và mục tiêu.', output: 'Email xác nhận' },
    { step: 2, title: 'Chuẩn bị tài liệu & Slide', role: 'QL BIM', description: 'Soạn thảo slide giới thiệu năng lực, giải pháp kỹ thuật và kế hoạch sơ bộ.', output: 'File Slide .pptx' },
    { step: 3, title: 'Review nội bộ', role: 'GĐTT / PGĐTT', description: 'Đánh giá nội dung, chiến lược tiếp cận và chỉnh sửa nếu cần.', output: 'Slide hoàn thiện' },
    { step: 4, title: 'Thuyết trình', role: 'QL BIM / GĐTT', description: 'Trình bày trực tiếp với khách hàng, demo mô hình mẫu (nếu có).', output: 'Biên bản cuộc họp' },
    { step: 5, title: 'Ghi nhận phản hồi', role: 'QL BIM', description: 'Ghi chép các yêu cầu điều chỉnh hoặc mối quan tâm của khách hàng để phục vụ báo giá.', output: 'Report Q&A' }
  ],
  'wf-1.1-p': [
    { step: 1, title: 'Tiếp nhận nhu cầu', role: 'TBP XTDA', description: 'Làm việc với khách hàng tư nhân để nắm bắt nhu cầu và "nỗi đau" (pain points).', output: 'Biên bản làm việc' },
    { step: 2, title: 'Xây dựng giải pháp', role: 'TBP XTDA / QL BIM', description: 'Đề xuất giải pháp kỹ thuật và phương án thi công/BIM tối ưu chi phí.', output: 'Hồ sơ giải pháp' },
    { step: 3, title: 'Review báo giá sơ bộ', role: 'PGĐTT', description: 'Kiểm tra tính khả thi và biên độ lợi nhuận.', output: 'Duyệt phương án' },
    { step: 4, title: 'Thuyết trình & Chốt Deal', role: 'GĐTT / TBP XTDA', description: 'Thuyết trình trực tiếp, tập trung vào hiệu quả đầu tư (ROI) và tiến độ.', output: 'Thỏa thuận hợp tác' }
  ],
  'wf-4.1': [
    { step: 1, title: 'Nghiên cứu bản vẽ', role: 'NDH', description: 'Đọc hiểu bản vẽ 2D, phát hiện các sai sót/thiếu thông tin ban đầu (RFI).', output: 'List RFI (nếu có)' },
    { step: 2, title: 'Dựng hình (Modeling)', role: 'NDH', description: 'Triển khai dựng mô hình 3D theo tiêu chuẩn BEP và LOD yêu cầu.', output: 'File Revit (.rvt)' },
    { step: 3, title: 'Tự kiểm tra (Self-Check)', role: 'NDH', description: 'Kiểm tra va chạm sơ bộ và tính đầy đủ của thông tin phi hình học.', output: 'Checklist cá nhân' },
    { step: 4, title: 'Kiểm soát chất lượng (QA/QC)', role: 'TNDH / ĐPBM', description: 'Kiểm tra mô hình theo Checklist QA/QC của dự án. Yêu cầu sửa lỗi.', output: 'Report QA/QC' },
    { step: 5, title: 'Đệ trình', role: 'QL BIM', description: 'Đóng gói file, upload lên CDE và gửi thông báo cho CĐT.', output: 'Transmittal' }
  ],
  'wf-4.4': [
    { step: 1, title: 'Kiểm tra danh mục hồ sơ', role: 'QL BIM', description: 'Rà soát danh mục các file cần nộp theo hợp đồng/giai đoạn.', output: 'Master List' },
    { step: 2, title: 'Xuất hồ sơ từ mô hình', role: 'QL BIM', description: 'Xuất bản vẽ PDF, file IFC, NWC và các báo cáo khối lượng.', output: 'Bộ hồ sơ số' },
    { step: 3, title: 'Ký số / Đóng dấu', role: 'GĐTT', description: 'Thực hiện quy trình ký duyệt nội bộ và đóng dấu pháp nhân (nếu cần).', output: 'Hồ sơ pháp lý' },
    { step: 4, title: 'Bàn giao', role: 'QLDA', description: 'Gửi hồ sơ cứng hoặc link tải hồ sơ mềm cho đơn vị thẩm định.', output: 'Biên bản bàn giao' }
  ]
};

export const LESSONS_LEARNED = [
  {
    id: 'LL-001',
    date: '2024-03-15',
    project: 'P-007 (Cầu Thủ Thiêm 4)',
    category: 'Kỹ thuật',
    severity: 'High',
    summary: 'Xung đột cốt thép dầm chủ va chạm với cáp dự ứng lực',
    detail: 'Trong quá trình mô hình hóa chi tiết (LOD 400), phát hiện tại vị trí nút khung K3, mật độ cốt thép quá dày dẫn đến không thể luồn ống gen cáp dự ứng lực.',
    action: 'Đề xuất thay đổi thiết kế tăng cường thép hình thay vì thép thường, hoặc điều chỉnh quỹ đạo cáp.',
    author: 'Nguyễn Văn A (BIM Lead)',
    tags: ['Revit', 'Structure', 'Clash Detection']
  },
  {
    id: 'LL-002',
    date: '2024-04-10',
    project: 'P-005 (Bệnh viện Đa khoa)',
    category: 'Xung đột',
    severity: 'Medium',
    summary: 'Thiếu không gian lắp đặt hệ thống HVAC hành lang',
    detail: 'Trần giả thiết kế quá thấp (2.4m) trong khi ống gió kích thước lớn (600x400) cộng với độ dốc ống nước ngưng không đủ chỗ thi công.',
    action: 'Hạ cao độ trần giả xuống 2.2m tại khu vực hành lang kỹ thuật hoặc chia nhỏ ống gió.',
    author: 'Trần Thị B (MEP Coord)',
    tags: ['Navisworks', 'MEP', 'Design Review']
  },
  {
    id: 'LL-003',
    date: '2024-05-20',
    project: 'P-003 (Chung cư Cao cấp)',
    category: 'Quy trình',
    severity: 'Low',
    summary: 'Sai sót đồng bộ file tọa độ Shared Coordinates',
    detail: 'Các file link kiến trúc và kết cấu không cùng mốc tọa độ, dẫn đến khi Link vào bị lệch, mất 2 ngày để fix lại toàn bộ.',
    action: 'Cần thiết lập file Grid & Level chuẩn ngay từ đầu dự án và lock, gửi cho tất cả các bên tham gia.',
    author: 'Lê Văn C (BIM Manager)',
    tags: ['Process', 'Revit Setup', 'Coordinates']
  }
];
