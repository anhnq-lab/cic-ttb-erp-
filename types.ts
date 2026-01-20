
export enum ProjectStatus {
  PLANNING = 'Lập kế hoạch',
  IN_PROGRESS = 'Đang thực hiện',
  DELAYED = 'Tạm hoãn',
  COMPLETED = 'Hoàn thành'
}

export enum ContractStatus {
  DRAFT = 'Nháp',
  ACTIVE = 'Hiệu lực',
  PENDING_PAYMENT = 'Chờ thanh toán',
  COMPLETED = 'Hoàn thành',
  OVERDUE = 'Quá hạn'
}

export enum PaymentStatus {
  PENDING = 'Chưa thanh toán',
  INVOICED = 'Đã xuất hóa đơn',
  PAID = 'Đã thanh toán',
  OVERDUE = 'Quá hạn',
  PARTIAL = 'Thanh toán 1 phần'
}

// Based on Policy 40.20.4
export enum TaskStatus {
  OPEN = 'Mở',
  PENDING = 'Đang chờ',
  S0 = 'S0 Đang thực hiện', // Đang triển khai
  S1 = 'S1 Phối hợp', // Phối hợp
  S2 = 'S2 Kiểm tra chéo', // Kiểm tra bộ môn/chéo
  S3 = 'S3 Duyệt nội bộ', // Kiểm tra nội bộ
  S4 = 'S4 Lãnh đạo duyệt', // Lãnh đạo duyệt
  S4_1 = 'S4.1 Sửa theo LĐ', // Sửa theo comment CIC
  S5 = 'S5 Đã duyệt', // Đã duyệt nội bộ
  S6 = 'S6 Trình khách hàng', // Trình khách hàng
  S6_1 = 'S6.1 Sửa theo KH', // Sửa theo comment KH
  COMPLETED = 'Hoàn thành' // Hoàn thành/Đóng
}

export enum TaskPriority {
  CRITICAL = 'Khẩn cấp',
  HIGH = 'Cao',
  MEDIUM = 'Trung bình',
  LOW = 'Thấp'
}

export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  location: string;
  manager: string;

  // Technical Fields (Based on Law 58/2024/QH15 & Circular 06/2021/TT-BXD)
  projectGroup?: string; // Quan trọng quốc gia, Nhóm A, B, C
  constructionType?: string; // Dân dụng, Công nghiệp...
  constructionLevel?: string; // Đặc biệt, I, II, III, IV
  scale?: string; // Quy mô (m2 sàn, chiều dài tuyến...)

  capitalSource: 'StateBudget' | 'NonStateBudget';
  status: ProjectStatus;
  progress: number;
  budget: number;
  spent: number;
  deadline: string;
  members: number;
  thumbnail: string;

  // Additional Fields from Import
  serviceType?: string;
  area?: string;
  unitPrice?: string;
  phase?: string; // GiaiDoanDuAn
  scope?: string; // PhamViCongViec
  statusDetail?: string; // TinhTrang
  failureReason?: string; // LyDoThatBai
  folderUrl?: string; // Link folder
  completedAt?: string; // NgayHoanThanh
  deliverables?: string; // SanPhamBanGiao


  // RACI & Process Fields
  raci?: RaciMatrix[];
  workflows?: WorkflowStep[];
  financials?: ProjectFinancials;
}

export type RaciRoleCode = 'GĐTT' | 'PGĐTT' | 'QLDA' | 'QL BIM' | 'ĐPBM' | 'TNDH' | 'NDH' | 'Admin' | 'Kế toán';

export interface RaciTask {
  name: string;
  roles: Partial<Record<RaciRoleCode, string>>; // 'R', 'A', 'C', 'I' or combinations like 'I/C'
  workflowId?: string; // Link to specific workflow
}

export interface RaciMatrix {
  phase: string;
  tasks: RaciTask[];
}

export interface WorkflowStep {
  step: number;
  title: string;
  role: string;
  description: string;
  output: string;
}

export interface ProjectFinancials {
  budget: number;
  revenue: number;
  cost: number;
  profit: number;
  invoiced: number;
  received: number;
}

export interface PaymentTransaction {
  id: string;
  description: string;
  amount: number;
  paymentDate?: string;
  date?: string; // Alias for paymentDate (backward compatibility)
  status: PaymentStatus;
  // Enhanced fields
  invoiceNumber?: string; // Số hóa đơn GTGT
  paymentMethod?: 'Transfer' | 'Cash' | 'Check'; // Hình thức thanh toán
  method?: 'Bank Transfer' | 'Cash'; // Alias for paymentMethod
  vatRate?: number; // 8% or 10%
  notes?: string;
  documents?: { name: string, url: string }[];
}

export interface Contract {
  id: string;
  projectId?: string; // Link to Project
  customerId?: string; // Link to Customer
  code: string;
  signedDate: string;
  packageName: string;
  projectName: string;

  location: string;
  contractType: string;
  lawApplied: string;

  // Side A
  sideAName: string;
  sideARep: string;
  sideAPosition: string;
  sideAMst: string;
  sideAStaff: string;

  // Side B
  sideBName: string;
  sideBRep: string;
  sideBPosition: string;
  sideBMst: string;
  sideBBank: string;

  // Finance
  totalValue: number;
  vatIncluded: boolean;
  advancePayment: number;
  capitalSource?: string;
  constructionType?: string;
  fileUrl?: string;
  driveLink?: string;
  paymentMilestones: {
    id: string;
    phase: string;
    condition: string;
    percentage: number;
    amount: number;
    dueDate: string;
    status: PaymentStatus;
    invoiceDate?: string;
    acceptanceProduct?: string;
    updatedBy?: string;
    updatedAt?: string;
    expectedAmount?: number;
    completionProgress?: number;
  }[];

  // Schedule
  duration: string;
  startDate: string;
  endDate: string;
  warrantyPeriod: string;

  // Scope
  mainTasks: string[];
  fileFormats: string;
  deliveryMethod: string;
  acceptanceStandard: string;

  // Key Personnel
  personnel: {
    role: string;
    name: string;
  }[];

  // Legal
  penaltyRate: string;
  maxPenalty: string;
  disputeResolution: string;

  paidValue: number;
  remainingValue: number;
  wipValue: number;
  status: ContractStatus;
  transactions?: PaymentTransaction[]; // History of actual payments
  content?: string; // HTML Content or Markdown of the contract
}

export interface Task {
  id: string;
  code: string; // [GiaiDoan].[Loai].[BoMon].[STT]
  name: string;
  projectId: string;
  phase?: string; // Link to Plan phase: 'Xúc tiến Dự án' | 'Báo giá' | 'Chuẩn bị Triển khai' | ...
  assignee: {
    id?: string;
    name: string;
    avatar: string;
    role: 'Modeler' | 'Leader' | 'Coordinator' | 'Staff' | 'Manager' | string;
    raci?: Record<string, string>; // R, A, C, I mapping
  };
  reviewer?: string; // Người kiểm tra (Policy 20.30)
  status: TaskStatus;
  priority: TaskPriority;
  startDate: string;
  dueDate: string;
  progress: number;
  tags?: string[];
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  subtasks?: SubTask[];
  // EDT Core Extensions
  checklistLogs?: ChecklistLog[];
  deliverables?: Deliverable[];
}


export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  assignee?: { id: string; name: string; avatar: string };
  dueDate?: string;
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Employee {
  id: string;
  code: string;
  name: string;
  position?: string;
  role?: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'Chính thức' | 'Nghỉ phép' | 'Thử việc' | 'Active' | 'Inactive';
  joinDate: string;
  skills?: string[];
  dob?: string;
  degree?: string;
  certificates?: string;
  graduationYear?: string;
  profileUrl?: string;
}

export interface KpiMetric {
  label: string;
  value: string;
  trend: number;
  isPositive: boolean;
  icon: string;
}

export type CustomerType = 'Client' | 'Partner' | 'Subcontractor';
export type CustomerCategory = 'RealEstate' | 'StateBudget' | 'Consulting' | 'Construction' | 'Other';

export interface Customer {
  id: string;
  code: string;
  name: string;
  shortName: string;
  type: CustomerType;
  category: CustomerCategory;
  taxCode: string;
  address: string;
  representative: string; // Người đại diện pháp luật
  contactPerson: string; // Người liên hệ chính
  email: string;
  phone: string;
  website?: string;
  bankAccount?: string;
  bankName?: string;
  status: 'Active' | 'Inactive';
  tier: 'VIP' | 'Gold' | 'Standard'; // Phân hạng
  totalProjectValue: number; // Tổng giá trị dự án đã hợp tác
  logo: string;
  rating?: number; // 1-5 stars
  evaluation?: string; // Short note on reliability
}

// CRM Extensions
export interface CRMContact {
  id: string;
  customerId: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface CRMActivity {
  id: string;
  customerId: string;
  type: 'Meeting' | 'Call' | 'Email' | 'Meal' | 'Note';
  date: string;
  title: string;
  description: string;
  createdBy: string;
}

export interface CRMOpportunity {
  id: string;
  customerId: string;
  name: string;
  value: number;
  stage: 'New' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  probability: number; // %
  expectedCloseDate: string;
}

// ==========================================
// EDT CORE INTERFACES
// ==========================================

export interface ProjectTemplate {
  id: string;
  name: string;
  type: string;
  phases: {
    name: string;
    description?: string;
    tasks: {
      name: string;
      code: string;
      duration?: number;
      dependOn?: string;
    }[];
  }[];
  description?: string;
  created_at?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  isMandatory: boolean;
  guidance?: string;
}

export interface QualityChecklist {
  id: string;
  code: string;
  name: string;
  type: string;
  items: ChecklistItem[];
  created_at?: string;
}

export interface Deliverable {
  id: string;
  taskId: string;
  name: string;
  type: 'File' | 'Drawing' | 'Model' | 'Report' | 'Other';
  status: 'Pending' | 'Submitted' | 'Approved' | 'Rejected';
  url?: string;
  driveId?: string;
  created_at?: string;
}

export interface SOPStep {
  id: string;
  code: string;
  name: string;
  description?: string;
  steps: {
    step: number;
    description: string;
    role: string;
    estimatedTime?: string;
  }[];
  created_at?: string;
}

export interface ChecklistLogResult {
  item_id: string;
  checked: boolean;
  note?: string;
  attachment_url?: string;
}

export interface ChecklistLog {
  id: string;
  taskId: string;
  templateId: string;
  results: ChecklistLogResult[];
  completedBy: string;
  completedAt: string;
  status: 'Draft' | 'Completed' | string;
}

export interface LessonLearned {
  id: string;
  projectId?: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
  solution?: string;
  author?: string;
  created_at?: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface KPI {
  id: string;
  name: string;
  target: number;
  actual: number;
  unit: string;
  weight: number;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  employeeId: string;
  role: string;
  joinedAt: string;
  projectRole?: string;
  allocation?: number;
  hourlyRate?: number;
  employee?: Employee;
}

export type ConstructionType = string;
export type ConstructionLevel = string;
export type ContractType = string;
export interface ProjectCost {
  id: string;
  projectId: string;
  category: 'Travel' | 'Outsource' | 'Equipment' | 'Other' | 'Salary';
  description: string;
  amount: number;
  date: string;
  spender: string; // Employee Name or ID
  status: 'Pending' | 'Approved' | 'Rejected';
  notes?: string;
  invoiceUrl?: string;

  // Salary Extensions
  salaryType?: 'Internal' | 'Outsource';
  personnelId?: string; // If Internal, link to Employee/ProjectMember
  manHours?: number;
  hourlyRate?: number;
}

export interface TimesheetLog {
  id: string;
  projectId: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  hours: number;
  description?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  // New Fields for Task-Based Timesheet
  taskId?: string;
  workType?: 'Modeling' | 'Review' | 'Meeting' | 'Coordination' | 'Other';
  created_at?: string;
}

// ==========================================
// KANBAN & GANTT INTERFACES
// ==========================================

/**
 * GanttTask interface for Frappe Gantt library
 * Used by TaskService.getTasksForGantt()
 */
export interface GanttTask {
  id: string;
  name: string;
  start: string; // YYYY-MM-DD format
  end: string;   // YYYY-MM-DD format
  progress: number; // 0-100
  custom_class: string; // CSS class for color coding (bar-s0, bar-s1, etc.)
  dependencies?: string; // Comma-separated task IDs (optional, for future use)
}

