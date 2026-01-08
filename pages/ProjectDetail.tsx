import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, DollarSign, Users, CheckSquare,
  Clock, FileText, Layers, Table, List, Shield, Landmark, ScrollText,
  MapPin, Scale, Briefcase, Info, BadgeCheck, Gavel, TrendingUp, CreditCard,
  MessageSquareWarning, Package, X, ChevronRight, FileCheck,
  Columns, Filter, Plus, User as UserIcon, Building2, Award, Ruler,
  ArrowRightCircle, ArrowLeftCircle, Loader, BarChart3, Box, Layout
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';

import { EMPLOYEES, CONTRACTS, PROJECTS } from '../constants';
import { Contract, TaskStatus, TaskPriority, Task, Project, WorkflowStep } from '../types';
import { realtimeStore } from '../utils/realtimeStore';
import { ContractService } from '../services/contract.service';
import { ProjectService } from '../services/project.service';

import Header from '../components/Header';
import ProjectGantt from '../components/ProjectGantt';
import ProjectKanban from '../components/ProjectKanban';
import ProjectDocuments from '../components/ProjectDocuments';
import ProjectInfoTab from '../components/ProjectInfoTab';
import ProjectPlanTab from '../components/ProjectPlanTab';
import ProjectPersonnelTab from '../components/ProjectPersonnelTab';
import BIMModelViewer from '../components/BIMModelViewer';
import TaskModal from '../components/TaskModal';
import ProjectCostTab from '../components/ProjectCostTab';
import ProjectTimesheetTab from '../components/ProjectTimesheetTab';
import ProjectOverviewTab from '../components/ProjectOverviewTab'; // NEW IMPORT

// --- HELPER FUNCTIONS ---
const formatCurrency = (value: number | undefined) => {
  if (value === undefined || isNaN(value)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// --- SUB-COMPONENTS ---
const HighlightStat = ({ label, value, subValue, icon: Icon, colorClass }: { label: string, value: string, subValue?: string, icon: any, colorClass: string }) => (
  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
    <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center shrink-0`}>
      <Icon size={24} />
    </div>
    <div className="overflow-hidden">
      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-0.5">{label}</p>
      <p className="text-lg font-black text-slate-800 truncate">{value}</p>
      {subValue && <p className="text-[10px] font-bold text-gray-500 truncate">{subValue}</p>}
    </div>
  </div>
);

const RaciBadge = ({ value }: { value?: string }) => {
  if (!value) return null;
  let colorClass = "text-gray-400";
  let bgClass = "bg-gray-50";
  if (value.includes('R')) { colorClass = "text-rose-700"; bgClass = "bg-rose-50 border-rose-100"; }
  else if (value.includes('A')) { colorClass = "text-amber-700"; bgClass = "bg-amber-50 border-amber-100"; }
  else if (value.includes('C')) { colorClass = "text-blue-700"; bgClass = "bg-blue-50 border-blue-100"; }
  else if (value.includes('I')) { colorClass = "text-slate-600"; bgClass = "bg-slate-100 border-slate-200"; }

  return (
    <div className={`w-8 h-8 flex items-center justify-center rounded-lg border font-bold text-xs mx-auto shadow-sm ${bgClass} ${colorClass}`}>
      {value}
    </div>
  );
};

const WorkflowModal = ({ taskName, steps, onClose }: { taskName: string, steps: WorkflowStep[], onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-fade-in-up">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          <h3 className="text-lg font-bold text-slate-800">{taskName}</h3>
          <p className="text-xs text-gray-500">Quy trình thực hiện chuẩn</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
          <X size={20} />
        </button>
      </div>
      <div className="overflow-y-auto p-6 custom-scrollbar">
        <div className="relative">
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-200"></div>
          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex gap-6">
                <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0 z-10 border-4 border-white">
                  {step.step}
                </div>
                <div className="flex-1 bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 text-sm">{step.title}</h4>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase tracking-wider">
                      {step.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">{step.description}</p>
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                    <FileCheck size={14} className="text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-700">Đầu ra: {step.output}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
        <button onClick={onClose} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 text-sm">
          Đóng quy trình
        </button>
      </div>
    </div>
  </div>
);

const ContractCard: React.FC<{ contract: Contract }> = ({ contract }) => {
  const paidPercentage = contract.totalValue > 0 ? Math.round((contract.paidValue / contract.totalValue) * 100) : 0;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in-up">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-orange-500/20 text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest border border-orange-500/30">
                {contract.contractType}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest border ${contract.status === 'Running' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                contract.status === 'Completed' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                  'bg-gray-500/20 text-gray-300 border-gray-500/30'
                }`}>
                {contract.status}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-1 tracking-tight flex items-center gap-2">
              <ScrollText size={20} className="text-slate-400" />
              {contract.code} - {contract.packageName}
            </h3>
            <p className="text-slate-400 text-sm pl-7">Ký ngày: {contract.signedDate || 'N/A'}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Tổng giá trị hợp đồng</p>
            <p className="text-3xl font-black text-orange-400 tracking-tight">
              {formatCurrency(contract.totalValue)}
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="font-bold text-slate-800 text-sm uppercase flex items-center gap-2">
            <CreditCard size={16} className="text-indigo-600" /> Tiến độ thanh toán
          </h4>
          <div>
            <div className="flex justify-between text-xs mb-1.5 font-bold">
              <span className="text-gray-500">Đã thanh toán</span>
              <span className="text-indigo-600">{paidPercentage}% ({formatCurrency(contract.paidValue)})</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${paidPercentage}%` }}></div>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <span className="text-xs font-bold text-indigo-800">Còn lại phải thu</span>
            <span className="text-sm font-black text-indigo-600">{formatCurrency(contract.totalValue - contract.paidValue)}</span>
          </div>
        </div>
        <div className="space-y-4">
          <h4 className="font-bold text-slate-800 text-sm uppercase flex items-center gap-2">
            <Landmark size={16} className="text-emerald-600" /> Thông tin pháp lý
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
              <span className="text-xs text-gray-500 font-medium">Đối tác (Bên A)</span>
              <span className="text-xs font-bold text-gray-800 truncate max-w-[180px]">{contract.sideAName}</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
              <span className="text-xs text-gray-500 font-medium">Hình thức HĐ</span>
              <span className="text-xs font-bold text-gray-800">{contract.contractType}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN WRAPPER COMPONENT ---
const ProjectDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('info');
  const [project, setProject] = useState<Project | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [raciData, setRaciData] = useState<any[]>([]);

  const [viewMode, setViewMode] = useState<'kanban' | 'gantt'>('kanban');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowStep[] | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Mock Data Fetching
    const fetchProjectData = async () => {
      // 1. Project Info
      const foundProject = PROJECTS.find(p => p.id === id);
      setProject(foundProject || null);

      // 2. Contracts
      const projectContracts = await ContractService.getContractsByProject(id);
      setContracts(projectContracts);

      // 3. Tasks
      const cleanTasks = await realtimeStore.getTasks(id); // Use realtimestore helper
      setTasks(cleanTasks);

      // 4. Members
      const projectMembers = await ProjectService.getProjectMembers(id);
      setMembers(projectMembers);

      // 5. RACI
      const raci = await ProjectService.getProjectRaci(id);
      setRaciData(raci);
    };

    fetchProjectData();

    // Subscribe to realtime updates
    const unsubscribe = realtimeStore.subscribe(id || '', async () => {
      const updatedTasks = await realtimeStore.getTasks(id || '');
      setTasks(updatedTasks);
    });

    return () => unsubscribe();
  }, [id]);

  const handleCreateTask = async (task: Partial<Task>) => {
    if (!id) return;
    setIsSyncing(true);
    try {
      await realtimeStore.createTask({ ...task, projectId: id } as any);
      const updated = await realtimeStore.getTasks(id);
      setTasks(updated);
      setIsTaskModalOpen(false);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!id) return;
    setIsSyncing(true);
    try {
      await realtimeStore.updateTask(taskId, updates);
      const updated = await realtimeStore.getTasks(id);
      setTasks(updated);
      setSelectedTask(undefined);
      setIsTaskModalOpen(false);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!id) return;
    if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      setIsSyncing(true);
      try {
        await realtimeStore.deleteTask(taskId);
        const updated = await realtimeStore.getTasks(id);
        setTasks(updated);
        setSelectedTask(undefined);
        setIsTaskModalOpen(false);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    await realtimeStore.updateTaskStatus(taskId, newStatus);
  };

  const openCreateTask = () => {
    setSelectedTask(undefined);
    setIsTaskModalOpen(true);
  };

  const openEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <Loader size={32} className="animate-spin text-indigo-600" />
          <p>Đang tải dữ liệu dự án...</p>
        </div>
      </div>
    );
  }

  const isStateBudget = project.capitalSource === 'StateBudget';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-inter">
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Chi tiết dự án" breadcrumb="Danh sách dự án / Chi tiết" />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="w-full space-y-6">

            {/* --- TOP BAR --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center gap-4">
                <Link to="/projects/list" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-gray-500">
                  <ArrowLeft size={20} />
                </Link>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">{project.name}</h1>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest border ${project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                      project.status === 'Delayed' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                        'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                      {project.status === 'Completed' ? 'Hoàn thành' : project.status === 'Delayed' ? 'Chậm tiến độ' : 'Đang thực hiện'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                    <span className="flex items-center gap-1.5"><Building2 size={12} /> {project.code}</span>
                    <span className="flex items-center gap-1.5">
                      {isStateBudget ? <Landmark size={12} className="text-amber-600" /> : <Shield size={12} className="text-indigo-600" />}
                      {isStateBudget ? 'Vốn Ngân Sách' : 'Vốn Ngoài NS'}
                    </span>
                    <span className="flex items-center gap-1.5"><MapPin size={12} /> {project.location || 'Chưa cập nhật'}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-200 text-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2">
                  <FileText size={16} /> Xuất báo cáo
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-indigo-700 flex items-center gap-2">
                  <Plus size={16} /> Tạo yêu cầu
                </button>
              </div>
            </div>

            {/* --- TAB NAVIGATION --- */}
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto custom-scrollbar bg-white rounded-t-xl px-2">
              {[
                { id: 'info', label: 'Thông tin dự án', icon: Info },
                { id: 'overview', label: 'Tổng quan', icon: Layout },
                { id: 'plan', label: 'Kế hoạch', icon: Calendar },
                { id: 'timesheet', label: 'Chấm công', icon: Clock },
                { id: 'contracts', label: 'Hợp đồng', icon: ScrollText },
                { id: 'personnel', label: 'Nhân sự', icon: Users },
                { id: 'cost', label: 'Chi phí', icon: DollarSign },
                { id: 'model', label: 'Mô hình BIM', icon: Box },
                { id: 'production', label: 'Quản lý Sản xuất', icon: BarChart3 },
                { id: 'documents', label: 'Hồ sơ tài liệu', icon: Layers },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                >
                  <tab.icon size={16} className={activeTab === tab.id ? 'animate-pulse' : ''} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* --- TAB CONTENT RENDER --- */}
            <div className="animate-fade-in">

              {/* 1. INFO TAB */}
              {activeTab === 'info' && (
                <ProjectInfoTab project={project} />
              )}

              {/* 2. OVERVIEW TAB (FIXED) */}
              {activeTab === 'overview' && (
                <ProjectOverviewTab
                  project={project}
                  tasks={tasks}
                  members={members}
                  contracts={contracts}
                />
              )}

              {/* 3. PLAN TAB */}
              {activeTab === 'plan' && (
                <ProjectPlanTab
                  project={project}
                  tasks={tasks} // Pass tasks for calculation
                />
              )}

              {/* 3. CONTRACTS TAB */}
              {activeTab === 'contracts' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <ScrollText size={20} className="text-indigo-600" /> Danh sách hợp đồng
                    </h3>
                    <button className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">
                      + Thêm Hợp đồng
                    </button>
                  </div>
                  {contracts.length > 0 ? (
                    contracts.map(contract => (
                      <ContractCard key={contract.id} contract={contract} />
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                      <ScrollText size={48} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 font-medium">Chưa có hợp đồng nào được ghi nhận</p>
                    </div>
                  )}
                </div>
              )}

              {/* 4. PERSONNEL TAB */}
              {activeTab === 'personnel' && (
                <ProjectPersonnelTab project={project} members={members} raciData={raciData} />
              )}

              {/* 5. TIMESHEET TAB (NEW) */}
              {activeTab === 'timesheet' && (
                <ProjectTimesheetTab projectId={id || ''} />
              )}

              {/* 6. COST TAB (NEW) */}
              {activeTab === 'cost' && (
                <ProjectCostTab projectId={id || ''} />
              )}

              {/* 7. BIM MODEL TAB */}
              {activeTab === 'model' && (
                <BIMModelViewer project={project} />
              )}

              {/* 7. PRODUCTION TAB (Gantt/Kanban) */}
              {activeTab === 'production' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg">Tiến độ sản xuất</h3>
                    <div className="bg-white border border-gray-200 p-1 rounded-lg flex items-center shadow-sm">
                      <button
                        onClick={() => setViewMode('kanban')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'kanban' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Kanban Board"
                      >
                        <Columns size={18} />
                      </button>
                      <button
                        onClick={() => setViewMode('gantt')}
                        className={`p-2 rounded-md transition-all ${viewMode === 'gantt' ? 'bg-indigo-100 text-indigo-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Gantt Chart"
                      >
                        <Gavel size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 w-full max-w-md bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                      <Filter size={16} className="text-gray-400" />
                      <input type="text" placeholder="Lọc theo tên công việc, người thực hiện..." className="bg-transparent border-none outline-none text-sm w-full font-medium text-gray-700 placeholder:text-gray-400" />
                    </div>
                    <button onClick={openCreateTask} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2">
                      <Plus size={18} /> Thêm công việc
                    </button>
                  </div>

                  {/* View Content */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm min-h-[500px] overflow-hidden">
                    {viewMode === 'kanban' ? (
                      <ProjectKanban
                        tasks={tasks}
                        onTaskMove={handleTaskMove}
                        onEditTask={openEditTask}
                      />
                    ) : (
                      <ProjectGantt tasks={tasks} />
                    )}
                  </div>
                </div>
              )}

              {/* 8. DOCUMENTS TAB */}
              {activeTab === 'documents' && (
                <ProjectDocuments projectId={id} />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* MODALS */}
      {selectedWorkflow && (
        <WorkflowModal
          taskName="Quy trình BIM"
          steps={selectedWorkflow}
          onClose={() => setSelectedWorkflow(null)}
        />
      )}

      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => { setIsTaskModalOpen(false); setSelectedTask(undefined); }}
          onSave={selectedTask ? (data) => handleUpdateTask(selectedTask.id, data) : handleCreateTask}
          taskToEdit={selectedTask}
          employees={members}
          projectId={id || ''}
          onDelete={selectedTask ? () => handleDeleteTask(selectedTask.id) : undefined}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
