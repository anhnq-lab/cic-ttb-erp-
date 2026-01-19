import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, DollarSign, Users, CheckSquare,
  Clock, FileText, Layers, Table, List, Shield, Landmark, ScrollText,
  MapPin, Scale, Briefcase, Info, BadgeCheck, Gavel, TrendingUp, CreditCard,
  MessageSquareWarning, Package, X, ChevronRight, FileCheck,
  Columns, Filter, Plus, User as UserIcon, Building2, Award, Ruler,
  ArrowRightCircle, ArrowLeftCircle, Loader, BarChart3, Box, Layout, Printer
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';

import { EMPLOYEES, CONTRACTS, PROJECTS } from '../constants';
import { Contract, TaskStatus, TaskPriority, Task, Project, WorkflowStep, ProjectStatus, ContractStatus, ProjectCost } from '../types';
import { realtimeStore } from '../utils/realtimeStore';
import { ContractService } from '../services/contract.service';
import { ProjectService } from '../services/project.service';
import { CostService } from '../services/cost.service';

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
import ProjectOverviewTab from '../components/ProjectOverviewTab';
import ProjectConstructionTab from '../components/ProjectConstructionTab';
import ProjectReportsTab from '../components/ProjectReportsTab';
import ProjectContractsTab from '../components/ProjectContractsTab';

// --- HELPER FUNCTIONS ---
const formatCurrency = (value: number | undefined) => {
  if (value === undefined || isNaN(value)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// --- SUB-COMPONENTS ---
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
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest border ${contract.status === ContractStatus.ACTIVE ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                contract.status === ContractStatus.COMPLETED ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
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
  const [activeTab, setActiveTab] = useState('overview');
  const [project, setProject] = useState<Project | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [raciData, setRaciData] = useState<any[]>([]);
  const [costs, setCosts] = useState<ProjectCost[]>([]);

  const [viewMode, setViewMode] = useState<'kanban' | 'gantt'>('kanban');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowStep[] | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProjectData = async () => {
      try {
        const foundProject = await ProjectService.getProjectById(id);
        if (foundProject) {
          setProject(foundProject);

          const [projectContracts, cleanTasks, projectMembers, projectRaci, projectCosts] = await Promise.all([
            ContractService.getContractsByProject(id),
            ProjectService.getProjectTasks(id),
            ProjectService.getProjectMembers(id),
            ProjectService.getProjectRaci(id),
            CostService.getCostsByProject(id)
          ]);

          setContracts(projectContracts);
          setTasks(cleanTasks);
          setMembers(projectMembers);
          setRaciData(projectRaci);
          setCosts(projectCosts);
        }
      } catch (err) {
        console.error("Error fetching project data:", err);
      }
    };

    fetchProjectData();

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
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-slate-600 animate-pulse uppercase tracking-widest">Đang tải dữ liệu PREMIUM...</p>
        </div>
      </div>
    );
  }

  const isStateBudget = project.capitalSource === 'StateBudget';

  return (
    <div className="flex h-screen bg-white overflow-hidden font-inter selection:bg-indigo-100 selection:text-indigo-900">
      <div className="flex-1 flex flex-col min-w-0">
        <Header title="Quản lý Dự án BIM" breadcrumb={`Dự án / ${project.code}`} />

        <main className="flex-1 overflow-y-auto p-2 md:p-4 custom-scrollbar bg-slate-50/50">
          <div className="max-w-[98%] mx-auto space-y-4">

            {/* --- COMPACT PROJECT HERO --- */}
            <div className="group relative rounded-2xl overflow-hidden border border-white shadow-lg bg-slate-900 min-h-[180px] animate-fade-in-up">
              {/* Background Layers */}
              <div className="absolute inset-0 z-0">
                <img
                  src={project.thumbnail || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"}
                  className="w-full h-full object-cover opacity-60 scale-100 group-hover:scale-110 transition-transform duration-[3000ms] ease-out"
                  alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/80 to-transparent"></div>
              </div>

              {/* Decorative Blur Orbs */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]"></div>

              <div className="relative z-10 p-4 md:p-6 h-full flex flex-col justify-between">
                {/* Top Row: Context & Badges */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-4">
                    <Link to="/projects" className="group/back flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                      <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl group-hover/back:-translate-x-1 transition-transform">
                        <ArrowLeft size={16} />
                      </div>
                      Quay lại danh sách
                    </Link>

                    <div className="flex flex-wrap gap-3">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-xl border-t border-white/20 shadow-xl ${project.status === ProjectStatus.COMPLETED ? 'bg-emerald-500/30 text-emerald-300' :
                        project.status === ProjectStatus.DELAYED ? 'bg-rose-500/30 text-rose-300' :
                          'bg-indigo-500/30 text-indigo-300'
                        }`}>
                        {project.status}
                      </span>
                      <span className="flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-xl rounded-full text-[10px] text-white font-black uppercase tracking-[0.2em] border-t border-white/20 shadow-xl">
                        {isStateBudget ? <Landmark size={12} className="text-amber-400" /> : <Shield size={12} className="text-blue-400" />}
                        {isStateBudget ? 'Vốn Ngân Sách' : 'Vốn Ngoài NS'}
                      </span>
                    </div>
                  </div>

                  <div className="hidden md:flex flex-col items-end text-right">
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mb-1">Cập nhật lần cuối</p>
                    <p className="text-white font-bold text-sm">Hôm nay, 14:30</p>
                  </div>
                </div>

                {/* Bottom Row: Title & Key Stats */}
                <div className="mt-4 flex flex-col lg:flex-row justify-between items-end gap-6">
                  <div className="flex-1 max-w-2xl text-left">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
                      <span className="text-orange-400 font-black text-xs uppercase tracking-widest">Project #{project.code}</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight mb-3 drop-shadow-2xl">
                      {project.name}
                    </h1>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Vị trí xây dựng</p>
                        <p className="text-white text-sm font-bold flex items-center gap-2"><MapPin size={12} className="text-rose-500" /> {project.location || 'Chưa rõ'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Ban điều hành</p>
                        <p className="text-white text-sm font-bold flex items-center gap-2"><Users size={12} className="text-indigo-400" /> {members.length} Nhân sự</p>
                      </div>
                      <div className="space-y-1 hidden md:block">
                        <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Giai đoạn hiện tại</p>
                        <p className="text-white text-sm font-bold flex items-center gap-2"><Layers size={12} className="text-emerald-400" /> Phối hợp BIM</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-80 space-y-3">
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                      <div className="flex justify-between items-end mb-3">
                        <div className="text-left">
                          <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-1">Tiến độ hoàn thành</p>
                          <div className="text-3xl font-black text-white italic">{project.progress}%</div>
                        </div>
                        <TrendingUp size={24} className="text-orange-500 animate-bounce" />
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500 rounded-full transition-all duration-[2000ms] relative"
                          style={{ width: `${project.progress}%` }}
                        >
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={openCreateTask} className="flex-1 py-2.5 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-100 transition-all active:scale-95 flex items-center justify-center gap-2">
                        <Plus size={14} /> Tạo Task
                      </button>
                      <button onClick={() => setActiveTab('reports')} className="flex-1 py-2.5 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                        <FileText size={14} /> Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- COMPACT TAB NAVIGATION --- */}
            <div className="sticky top-2 z-40 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-lg p-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: 'overview', label: 'Dashboard', icon: Layout },
                { id: 'plan', label: 'Kế hoạch', icon: Calendar },
                { id: 'timesheet', label: 'Chấm công', icon: Clock },
                { id: 'contracts', label: 'Hợp đồng', icon: FileCheck },
                { id: 'cost', label: 'Tài chính', icon: DollarSign },
                { id: 'personnel', label: 'RACI', icon: Users },
                { id: 'model', label: 'BIM 3D', icon: Box },
                { id: 'production', label: 'Sản xuất', icon: BarChart3 },
                { id: 'reports', label: 'Báo cáo', icon: Printer },
                { id: 'documents', label: 'Kho lưu trữ', icon: Layers },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
                      : 'text-gray-400 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                >
                  <tab.icon size={14} className={activeTab === tab.id ? 'text-orange-400' : ''} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="pb-12 min-h-[600px]">
              <div className="animate-fade-in-up duration-500">
                {activeTab === 'overview' && (
                  <ProjectOverviewTab project={project} tasks={tasks} members={members} contracts={contracts} />
                )}
                {activeTab === 'plan' && <ProjectPlanTab project={project} tasks={tasks} />}
                {activeTab === 'timesheet' && <ProjectTimesheetTab projectId={id || ''} />}
                {activeTab === 'contracts' && <ProjectContractsTab project={project} />}
                {activeTab === 'personnel' && <ProjectPersonnelTab project={project} members={members} raciData={raciData} />}
                {activeTab === 'cost' && <ProjectCostTab projectId={id || ''} />}
                {activeTab === 'model' && <BIMModelViewer project={project} />}
                {activeTab === 'production' && <ProjectConstructionTab project={project} />}
                {activeTab === 'reports' && <ProjectReportsTab project={project} />}
                {activeTab === 'documents' && <ProjectDocuments />}
              </div>
            </div>
          </div>
        </main>
      </div>

      {
        isTaskModalOpen && (
          <TaskModal
            isOpen={isTaskModalOpen}
            onClose={() => { setIsTaskModalOpen(false); setSelectedTask(undefined); }}
            onSave={selectedTask ? (data) => handleUpdateTask(selectedTask.id, data) : handleCreateTask}
            taskToEdit={selectedTask}
            employees={members}
            projectId={id || ''}
            onDelete={selectedTask ? () => handleDeleteTask(selectedTask.id) : undefined}
          />
        )
      }
    </div>
  );
};

export default ProjectDetail;
