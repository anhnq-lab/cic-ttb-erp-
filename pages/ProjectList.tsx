
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Header from '../components/Header';
import ImportModal from '../components/ImportModal';
import ProjectCreationWizard from '../components/ProjectCreationWizard';
import { PROJECTS, MOCK_USERS, EMPLOYEES, RACI_ROLES_MAPPING, PROJECT_TEMPLATES, PROJECT_GROUPS, CONSTRUCTION_TYPES, CONSTRUCTION_LEVELS } from '../constants';
import { MoreHorizontal, Calendar, Users, Filter, LayoutGrid, List, MapPin, Clock, Plus, X, ChevronRight, Check, Sparkles, User, Search as SearchIcon, Building2, Download, Upload, FileSpreadsheet, Link as LinkIcon, RefreshCw, Save, AlertTriangle, Code, Copy, Pencil, CheckCircle, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Project, ProjectStatus, TaskStatus, TaskPriority, Employee } from '../types';
import { fetchProjectsFromGoogleSheet, saveProjectToGoogleSheet } from '../utils/googleSheets';

import { ProjectService } from '../services/project.service';
import { EmployeeService } from '../services/employee.service';

// --- EDIT PROJECT FORM COMPONENT ---
const EditProjectForm = ({ project, onSave, onCancel }: {
    project: Project,
    onSave: (data: Project) => void,
    onCancel: () => void
}) => {
    const [formData, setFormData] = useState({
        code: project.code || '',
        name: project.name || '',
        client: project.client || '',
        location: project.location || '',
        manager: project.manager || '',
        status: project.status || ProjectStatus.PLANNING,
        progress: project.progress || 0,
        budget: project.budget || 0,
        deadline: project.deadline || ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        const updatedProject: Project = { ...project, ...formData };
        onSave(updatedProject);
        setIsSaving(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Mã dự án</label>
                    <input name="code" value={formData.code} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Trạng thái</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white">
                        <option value={ProjectStatus.PLANNING}>Chuẩn bị</option>
                        <option value={ProjectStatus.IN_PROGRESS}>Thực hiện</option>
                        <option value={ProjectStatus.COMPLETED}>Hoàn thành</option>
                        <option value={ProjectStatus.DELAYED}>Chậm tiến độ</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Tên dự án</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Khách hàng</label>
                    <input name="client" value={formData.client} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Người quản lý</label>
                    <input name="manager" value={formData.manager} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Địa điểm</label>
                    <input name="location" value={formData.location} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Deadline</label>
                    <input name="deadline" type="text" value={formData.deadline} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" placeholder="VD: Q4/2025" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Tiến độ (%)</label>
                    <input name="progress" type="number" min="0" max="100" value={formData.progress} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Giá trị (VNĐ)</label>
                    <input name="budget" type="number" value={formData.budget} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Hủy</button>
                <button type="submit" disabled={isSaving} className="px-6 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    Lưu thay đổi
                </button>
            </div>
        </form>
    );
};

const ProjectList = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

    // Local state to simulate adding projects (in a real app, this is API/Global State)
    const [localProjects, setLocalProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);

    // FETCH PROJECTS AND EMPLOYEES
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const [projects, employees] = await Promise.all([
                ProjectService.getProjects(),
                EmployeeService.getEmployees()
            ]);
            setLocalProjects(projects);
            setAvailableEmployees(employees);
            setIsLoading(false);
        };
        loadData();
    }, []);

    // --- FILTER STATES ---
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [capitalFilter, setCapitalFilter] = useState<string>('All');

    // --- GOOGLE SHEETS STATE ---
    const [showSheetModal, setShowSheetModal] = useState(false);

    const [showScriptCode, setShowScriptCode] = useState(false); // Toggle view script
    const [sheetId, setSheetId] = useState('');
    const [sheetGid, setSheetGid] = useState('0');
    const [scriptUrl, setScriptUrl] = useState(''); // New State for Write API
    const [isSyncing, setIsSyncing] = useState(false);

    // Load saved config on mount
    useEffect(() => {
        const savedSheetId = localStorage.getItem('sheetId');
        const savedScriptUrl = localStorage.getItem('scriptUrl');
        if (savedSheetId) setSheetId(savedSheetId);
        if (savedScriptUrl) setScriptUrl(savedScriptUrl);
    }, []);

    // --- CREATE PROJECT MODAL STATE ---
    const [isSmartWizardOpen, setIsSmartWizardOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [step, setStep] = useState(1);
    const [createdTasksCount, setCreatedTasksCount] = useState(0); // Track số lượng tasks đã tạo

    // --- EDIT PROJECT STATE ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const [newProjectData, setNewProjectData] = useState<Partial<Project> & {
        // Chủ đầu tư (Investor)
        investorName?: string;
        investorRepresentative?: string;
        investorTaxCode?: string;
        investorPhone?: string;
        // Khách hàng (Client) - có thể trùng hoặc khác Chủ đầu tư
        clientRepresentative?: string;
        clientTaxCode?: string;
        clientPhone?: string;
        clientEmail?: string;
        // Đầu mối liên hệ bên Khách hàng
        clientContactPerson?: string;   // Người liên hệ
        clientContactRole?: string;     // Chức vụ
        clientContactPhone?: string;    // SĐT
        clientContactEmail?: string;    // Email
        sameAsInvestor?: boolean;
    }>({
        name: '',
        code: '',
        client: '',
        location: '',
        manager: '',
        budget: 0,
        capitalSource: 'StateBudget',
        projectGroup: PROJECT_GROUPS[2],
        constructionType: CONSTRUCTION_TYPES[0],
        constructionLevel: CONSTRUCTION_LEVELS[2],
        scale: '',
        investorName: '',
        investorRepresentative: '',
        investorTaxCode: '',
        investorPhone: '',
        clientRepresentative: '',
        clientTaxCode: '',
        clientPhone: '',
        clientEmail: '',
        clientContactPerson: '',
        clientContactRole: '',
        clientContactPhone: '',
        clientContactEmail: '',
        sameAsInvestor: false
    });
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);

    // Role Mapping: Key = Abstract Role, Value = User ID
    // Cập nhật: Bỏ GĐTT, PGĐTT, Kế toán - thêm TBPXT
    const [roleMapping, setRoleMapping] = useState<Record<string, string>>({
        'QLDA': '',      // Quản lý dự án (PM)
        'QL BIM': '',    // Quản lý BIM
        'ĐPBM': '',     // Điều phối BIM
        'TBPXT': '',     // Trưởng bộ phận Xúc tiến dự án
        'NDH': '',       // Nhân viên dựng hình
        'TNDH': '',      // Trưởng nhóm dựng hình
        'Admin': ''      // Hành chính - không hardcode
    });

    // --- SMART FILTERING LOGIC ---
    const filteredProjects = useMemo(() => {
        return localProjects.filter(project => {
            // 1. Keyword Search (Name, Code, Client)
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                project.name.toLowerCase().includes(query) ||
                project.code.toLowerCase().includes(query) ||
                project.client.toLowerCase().includes(query);

            // 2. Status Filter
            const matchesStatus = statusFilter === 'All' || project.status === statusFilter;

            // 3. Capital Source Filter
            const matchesCapital = capitalFilter === 'All' || project.capitalSource === capitalFilter;

            return matchesSearch && matchesStatus && matchesCapital;
        });
    }, [localProjects, searchQuery, statusFilter, capitalFilter]);

    // --- EXPORT FUNCTION ---
    const handleExport = () => {
        // Define headers
        const headers = ['Mã DA', 'Tên Dự Án', 'Khách Hàng', 'Địa Điểm', 'Quản Lý (PM)', 'Trạng Thái', 'Tiến Độ (%)', 'Ngân Sách', 'Nguồn Vốn'];

        // Convert data to CSV format
        const csvContent = [
            headers.join(','),
            ...filteredProjects.map(p => {
                // Wrap strings in quotes to handle commas within fields
                return [
                    `"${p.code}"`,
                    `"${p.name}"`,
                    `"${p.client}"`,
                    `"${p.location || ''}"`,
                    `"${p.manager || ''}"`,
                    `"${p.status}"`,
                    p.progress,
                    p.budget,
                    `"${p.capitalSource}"`
                ].join(',');
            })
        ].join('\n');

        // Create blob and download link
        const blob = new Blob([`\uFEFF${csvContent} `], { type: 'text/csv;charset=utf-8;' }); // Add BOM for Excel UTF-8
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Danh_sach_du_an_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- IMPORT STATE ---
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    // --- IMPORT HANDLER ---
    const handleImportProjects = async (data: any[]) => {
        for (const row of data) {
            const newProject: Project = {
                id: `IMP - ${Date.now()} -${Math.random().toString(36).substr(2, 4)} `,
                code: row.Code || `P - ${Date.now()} `,
                name: row.Name || 'Imported Project',
                client: row.Client || 'Unknown Client',
                location: row.Location || '',
                manager: row.Manager || '',
                status: row.Status || ProjectStatus.PLANNING,
                progress: Number(row.Progress) || 0,
                budget: Number(row.Budget) || 0,
                capitalSource: 'StateBudget', // Default
                spent: 0,
                deadline: new Date().toISOString().split('T')[0],
                members: 1,
                thumbnail: 'https://picsum.photos/seed/import/400/300',
                projectGroup: PROJECT_GROUPS[0],
                constructionType: CONSTRUCTION_TYPES[0],
                constructionLevel: CONSTRUCTION_LEVELS[0],
                scale: ''
            } as any;
            await ProjectService.createProject(newProject);
        }

        // Refresh
        const updated = await ProjectService.getProjects();
        setLocalProjects(updated);
    };

    // --- GOOGLE SHEETS SYNC ---
    const handleSyncSheet = async () => {
        if (!sheetId) return alert('Vui lòng nhập ID Google Sheet');

        const cleanScriptUrl = scriptUrl.trim(); // Trim whitespace

        setIsSyncing(true);
        try {
            // Save config
            localStorage.setItem('sheetId', sheetId);
            localStorage.setItem('scriptUrl', cleanScriptUrl);

            const sheetProjects = await fetchProjectsFromGoogleSheet(sheetId, sheetGid);
            if (sheetProjects.length > 0) {
                setLocalProjects(sheetProjects);
                setShowSheetModal(false);
                alert(`Kết nối thành công! Đã tải ${sheetProjects.length} dự án từ Sheet.`);
            } else {
                alert('Kết nối thành công nhưng Sheet trống hoặc không đúng định dạng cột.');
            }
        } catch (error: any) {
            console.error(error);
            if (error.message.includes('Publish to web')) {
                alert(`LỖI QUYỀN TRUY CẬP: \nSheet chưa được công khai.\n\nVui lòng vào Sheet > File > Share > Publish to web > Chọn CSV > Publish.`);
            } else {
                alert('Lỗi kết nối: Vui lòng kiểm tra kỹ Sheet ID.');
            }
        } finally {
            setIsSyncing(false);
        }
    };

    const STANDARD_SCRIPT = `function doPost(e) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        var doc = SpreadsheetApp.getActiveSpreadsheet();
        // Lấy Sheet đầu tiên (thay vì tìm theo tên 'Sheet1' dễ lỗi)
        var sheet = doc.getSheets()[0];

        var data = JSON.parse(e.postData.contents);
        var nextRow = sheet.getLastRow() + 1;

        // Ghi dữ liệu vào hàng tiếp theo
        sheet.getRange(nextRow, 1, 1, data.length).setValues([data]);

        return ContentService
            .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
            .setMimeType(ContentService.MimeType.JSON);
    }
    catch (e) {
        return ContentService
            .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
            .setMimeType(ContentService.MimeType.JSON);
    }
        lock.releaseLock();
    }
} `;

    // Calculate Tasks based on Template
    const calculateAutoTasks = () => {
        const templateObj = (newProjectData.capitalSource || 'StateBudget') === 'StateBudget'
            ? PROJECT_TEMPLATES.find(t => t.type === 'Giao thông')
            : PROJECT_TEMPLATES.find(t => t.type === 'Dân dụng');

        const template = templateObj?.defaultTasks || [];
        if (!template.length) return [];

        const start = new Date(startDate);
        let cumulativeOffset = 0;

        return template.map((t, idx) => {
            // Calc dates
            const taskStart = new Date(start);
            taskStart.setDate(start.getDate() + cumulativeOffset);

            const taskEnd = new Date(taskStart);
            taskEnd.setDate(taskStart.getDate() + t.durationDays);

            cumulativeOffset += t.durationDays;

            // Find assignee based on role mapping
            const mappedUserId = roleMapping[t.role] || '';
            const assignedUser = MOCK_USERS.find(u => u.id === mappedUserId) || MOCK_USERS[0];

            return {
                id: `NEW-T-${idx}`,
                code: `T-${idx + 1}`,
                name: t.name,
                projectId: `NEW-${newProjectData.code}`,
                assignee: {
                    name: assignedUser.name,
                    avatar: assignedUser.avatar,
                    role: t.role
                },
                status: TaskStatus.OPEN,
                priority: TaskPriority.MEDIUM,
                startDate: taskStart.toISOString().split('T')[0],
                dueDate: taskEnd.toISOString().split('T')[0],
                progress: 0,
                tags: ['Tự động tạo']
            };
        });
    };

    const handleCreateProject = async () => {
        // ===== VALIDATION =====
        if (!newProjectData.code || !newProjectData.name) {
            alert('⚠️ Vui lòng nhập đầy đủ Mã dự án và Tên dự án');
            return;
        }

        const membersToAdd = Object.entries(roleMapping)
            .filter(([_, empId]) => empId)
            .map(([role, empId]) => ({ employeeId: empId as string, role }));

        if (membersToAdd.length === 0) {
            alert('⚠️ Vui lòng chọn ít nhất một thành viên cho dự án');
            return;
        }

        setIsSaving(true);

        try {
            // 1. Create Project Object
            const newProject: Project = {
                id: `NEW-${newProjectData.code || Date.now()}`,
                code: newProjectData.code || '',
                name: newProjectData.name || '',
                client: newProjectData.client || '',
                location: newProjectData.location || '',
                manager: newProjectData.manager || '',
                capitalSource: newProjectData.capitalSource as 'StateBudget' | 'NonStateBudget',
                status: ProjectStatus.PLANNING,
                progress: 0,
                budget: newProjectData.budget || 0,
                spent: 0,
                deadline: new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 6)).toISOString().split('T')[0],
                members: membersToAdd.length,
                thumbnail: 'https://picsum.photos/seed/new/400/300',
                projectGroup: newProjectData.projectGroup,
                constructionType: newProjectData.constructionType,
                constructionLevel: newProjectData.constructionLevel,
                scale: newProjectData.scale
            };

            // 2. Save to DB
            await ProjectService.createProject(newProject);

            // 3. Save Project Members
            if (membersToAdd.length > 0) {
                await ProjectService.addProjectMembers(newProject.id, membersToAdd);
                console.log('✅ Added members:', membersToAdd);
            }

            // 4. Sync RACI Tasks (Auto-generates tasks and assigns to members)
            // No longer needed as generateTasksFromTemplate is called in createProject
            setCreatedTasksCount(0);
            console.log(`✅ Created tasks automatically`);

            // 5. Save to Google Sheets if Script URL is present
            if (scriptUrl) {
                try {
                    const cleanScriptUrl = scriptUrl.trim();
                    const success = await saveProjectToGoogleSheet(newProject, cleanScriptUrl);
                    if (!success) {
                        console.warn('⚠️ Google Sheets sync failed');
                    }
                } catch (e) {
                    console.error('Google Sheets error:', e);
                }
            }

            // 6. Update State & UI
            const updatedList = await ProjectService.getProjects();
            setLocalProjects(updatedList);
            setIsModalOpen(false);

            // Reset form
            setStep(1);
            setNewProjectData({
                name: '', code: '', client: '', location: '', manager: '',
                budget: 0, capitalSource: 'StateBudget',
                projectGroup: PROJECT_GROUPS[2],
                constructionType: CONSTRUCTION_TYPES[0],
                constructionLevel: CONSTRUCTION_LEVELS[2],
                scale: '',
                investorName: '',
                investorRepresentative: '',
                investorTaxCode: '',
                investorPhone: '',
                clientRepresentative: '',
                clientTaxCode: '',
                clientPhone: '',
                clientEmail: '',
                clientContactPerson: '',
                clientContactRole: '',
                clientContactPhone: '',
                clientContactEmail: '',
                sameAsInvestor: false
            });
            setStartDate(new Date().toISOString().split('T')[0]);
            setRoleMapping({
                'QLDA': '',
                'QL BIM': '',
                'ĐPBM': '',
                'TBPXT': '',
                'NDH': '',
                'TNDH': '',
                'Admin': 'u7'
            });

            // Success Message
            alert(`✅ Đã tạo dự án thành công!

📋 Mã dự án: ${newProject.code}
📁 Tên: ${newProject.name}
👥 Thành viên: ${membersToAdd.length} người
✓ Tự động sinh công việc theo ${newProjectData.capitalSource === 'StateBudget' ? 'Quy chế 25.10 (Vốn NS)' : 'Quy chế 25.20 (Vốn ngoài NS)'}
✓ Đã gán công việc cho thành viên theo ma trận RACI`);

        } catch (error) {
            console.error('❌ Error creating project:', error);
            alert('❌ Lỗi khi tạo dự án. Vui lòng kiểm tra console và thử lại.');
        } finally {
            setIsSaving(false);
        }
    };

    // --- EDIT PROJECT HANDLERS ---
    const openEditProjectModal = (project: Project, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingProject(project);
        setIsEditModalOpen(true);
    };

    const handleEditProject = async (updatedProject: Project) => {
        await ProjectService.updateProject(updatedProject.id, updatedProject);
        // Update local projects list
        setLocalProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        setIsEditModalOpen(false);
        setEditingProject(null);
    };

    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <Header title="Danh mục Dự án" breadcrumb="Trang chủ / Dự án" />

            {/* --- EDIT PROJECT MODAL --- */}
            {isEditModalOpen && editingProject && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">✏️ Chỉnh sửa Dự án</h2>
                            <button onClick={() => { setIsEditModalOpen(false); setEditingProject(null); }} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <EditProjectForm
                            project={editingProject}
                            onSave={handleEditProject}
                            onCancel={() => { setIsEditModalOpen(false); setEditingProject(null); }}
                        />
                    </div>
                </div>
            )}


            {/* --- GOOGLE SHEET MODAL --- */}
            {showSheetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-emerald-800 flex items-center gap-2">
                                <FileSpreadsheet size={20} /> Kết nối Google Sheets
                            </h3>
                            <button onClick={() => setShowSheetModal(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                        </div>

                        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
                            <div className="bg-blue-50 p-4 rounded-lg text-xs text-blue-800 leading-relaxed border border-blue-100">
                                <strong>Hướng dẫn nhanh:</strong><br />
                                1. <b>Read Data:</b> File &gt; Share &gt; Publish to web (CSV).<br />
                                2. <b>Write Data:</b> Extensions &gt; Apps Script. Dán mã chuẩn và Deploy as Web App (Anyone).
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Sheet ID (Đọc Dữ Liệu)</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-mono"
                                    placeholder="VD: 1BxiMVs0XRA5n2He..."
                                    value={sheetId}
                                    onChange={(e) => setSheetId(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Apps Script URL (Ghi Dữ Liệu)</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-mono"
                                    placeholder="https://script.google.com/macros/s/.../exec"
                                    value={scriptUrl}
                                    onChange={(e) => setScriptUrl(e.target.value)}
                                />
                                <p className="text-[10px] text-gray-400 mt-1 italic">Để trống nếu bạn chỉ muốn đọc dữ liệu.</p>
                            </div>

                            <div className="pt-2 border-t border-gray-100">
                                <button
                                    onClick={() => setShowScriptCode(!showScriptCode)}
                                    className="flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                                >
                                    <Code size={14} /> {showScriptCode ? 'Ẩn mã Script chuẩn' : 'Xem mã Script chuẩn (Copy để tránh lỗi)'}
                                </button>

                                {showScriptCode && (
                                    <div className="mt-3 relative group">
                                        <textarea
                                            readOnly
                                            className="w-full h-40 p-3 bg-slate-900 text-slate-300 text-[10px] font-mono rounded-lg outline-none resize-none custom-scrollbar"
                                            value={STANDARD_SCRIPT}
                                        />
                                        <button
                                            onClick={() => { navigator.clipboard.writeText(STANDARD_SCRIPT); alert('Đã copy mã!'); }}
                                            className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
                                            title="Copy Code"
                                        >
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-2 shrink-0">
                            <button onClick={() => setShowSheetModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg">Hủy</button>
                            <button
                                onClick={handleSyncSheet}
                                disabled={isSyncing}
                                className="px-6 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-70"
                            >
                                {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <LinkIcon size={16} />}
                                {isSyncing ? 'Đang kiểm tra...' : 'Lưu & Kết nối'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CREATE PROJECT MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-fade-in-up">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Sparkles className="text-orange-500 fill-orange-500" size={20} /> Khởi tạo Dự án mới
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">Hệ thống sẽ tự động cấu hình quy trình theo loại vốn</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Wizard Progress */}
                        <div className="w-full bg-gray-100 h-1">
                            <div className={`h - full bg - orange - 600 transition - all duration - 300`} style={{ width: step === 1 ? '50%' : '100%' }}></div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {step === 1 ? (
                                <div className="space-y-5 animate-fade-in">
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Mã Dự án</label>
                                            <input
                                                type="text"
                                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                                placeholder="VD: 25015"
                                                value={newProjectData.code}
                                                onChange={e => setNewProjectData({ ...newProjectData, code: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Nguồn vốn (Quy chế áp dụng)</label>
                                            <select
                                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                                                value={newProjectData.capitalSource}
                                                onChange={e => setNewProjectData({ ...newProjectData, capitalSource: e.target.value as any })}
                                            >
                                                <option value="StateBudget">Vốn Ngân Sách (Quy chế 25.10)</option>
                                                <option value="NonStateBudget">Vốn Ngoài NS (Quy chế 25.20)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Tên Dự án</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                            placeholder="VD: KHU ĐÔ THỊ SINH THÁI..."
                                            value={newProjectData.name}
                                            onChange={e => setNewProjectData({ ...newProjectData, name: e.target.value })}
                                        />
                                    </div>

                                    {/* --- NEW FIELDS FOR CLASSIFICATION --- */}
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Nhóm dự án (Luật ĐTC 58/2024)</label>
                                            <select
                                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                                                value={newProjectData.projectGroup}
                                                onChange={e => setNewProjectData({ ...newProjectData, projectGroup: e.target.value })}
                                            >
                                                {PROJECT_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Loại công trình (06/2021/TT-BXD)</label>
                                            <select
                                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                                                value={newProjectData.constructionType}
                                                onChange={e => setNewProjectData({ ...newProjectData, constructionType: e.target.value })}
                                            >
                                                {CONSTRUCTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Cấp công trình</label>
                                            <select
                                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                                                value={newProjectData.constructionLevel}
                                                onChange={e => setNewProjectData({ ...newProjectData, constructionLevel: e.target.value })}
                                            >
                                                {CONSTRUCTION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Quy mô (m2 sàn / chiều dài)</label>
                                            <input
                                                type="text"
                                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                                placeholder="VD: 35.000 m2"
                                                value={newProjectData.scale}
                                                onChange={e => setNewProjectData({ ...newProjectData, scale: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    {/* --- CHỦ ĐẦU TƯ (INVESTOR) SECTION --- */}
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-4">
                                        <h4 className="font-bold text-blue-800 text-sm flex items-center gap-2">
                                            <Building2 size={16} /> Thông tin Chủ đầu tư
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Tên Chủ đầu tư</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                                                    placeholder="VD: Ban QLDA Đầu tư XD..."
                                                    value={newProjectData.investorName || ''}
                                                    onChange={e => setNewProjectData({ ...newProjectData, investorName: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Đại diện CĐT</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                                                    placeholder="Họ và tên..."
                                                    value={newProjectData.investorRepresentative || ''}
                                                    onChange={e => setNewProjectData({ ...newProjectData, investorRepresentative: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Mã số thuế CĐT</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                                                    placeholder="VD: 0102182292"
                                                    value={newProjectData.investorTaxCode || ''}
                                                    onChange={e => setNewProjectData({ ...newProjectData, investorTaxCode: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">SĐT Chủ đầu tư</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                                                    placeholder="VD: 0901234567"
                                                    value={newProjectData.investorPhone || ''}
                                                    onChange={e => setNewProjectData({ ...newProjectData, investorPhone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- KHÁCH HÀNG (CLIENT) SECTION --- */}
                                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-orange-800 text-sm flex items-center gap-2">
                                                <User size={16} /> Thông tin Khách hàng (Bên A ký hợp đồng)
                                            </h4>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                                    checked={newProjectData.sameAsInvestor || false}
                                                    onChange={e => {
                                                        const checked = e.target.checked;
                                                        if (checked) {
                                                            // Copy từ Chủ đầu tư sang Khách hàng
                                                            setNewProjectData({
                                                                ...newProjectData,
                                                                sameAsInvestor: true,
                                                                client: newProjectData.investorName || '',
                                                                clientRepresentative: newProjectData.investorRepresentative || '',
                                                                clientTaxCode: newProjectData.investorTaxCode || '',
                                                                clientPhone: newProjectData.investorPhone || ''
                                                            });
                                                        } else {
                                                            setNewProjectData({ ...newProjectData, sameAsInvestor: false });
                                                        }
                                                    }}
                                                />
                                                <span className="text-xs font-medium text-orange-700">Trùng với Chủ đầu tư</span>
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Tên Khách hàng</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                                                    placeholder="VD: Công ty TNHH ABC..."
                                                    value={newProjectData.client}
                                                    onChange={e => setNewProjectData({ ...newProjectData, client: e.target.value, sameAsInvestor: false })}
                                                    disabled={newProjectData.sameAsInvestor}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Đại diện Khách hàng</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                                                    placeholder="Họ và tên..."
                                                    value={newProjectData.clientRepresentative || ''}
                                                    onChange={e => setNewProjectData({ ...newProjectData, clientRepresentative: e.target.value, sameAsInvestor: false })}
                                                    disabled={newProjectData.sameAsInvestor}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Mã số thuế KH</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                                                    placeholder="VD: 0102182292"
                                                    value={newProjectData.clientTaxCode || ''}
                                                    onChange={e => setNewProjectData({ ...newProjectData, clientTaxCode: e.target.value, sameAsInvestor: false })}
                                                    disabled={newProjectData.sameAsInvestor}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">SĐT Khách hàng</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                                                    placeholder="VD: 0901234567"
                                                    value={newProjectData.clientPhone || ''}
                                                    onChange={e => setNewProjectData({ ...newProjectData, clientPhone: e.target.value, sameAsInvestor: false })}
                                                    disabled={newProjectData.sameAsInvestor}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Email Khách hàng</label>
                                            <input
                                                type="email"
                                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                                                placeholder="VD: contact@company.com.vn"
                                                value={newProjectData.clientEmail || ''}
                                                onChange={e => setNewProjectData({ ...newProjectData, clientEmail: e.target.value, sameAsInvestor: false })}
                                                disabled={newProjectData.sameAsInvestor}
                                            />
                                        </div>

                                        {/* Đầu mối liên hệ */}
                                        <div className="pt-3 mt-3 border-t border-orange-200">
                                            <p className="text-xs font-bold text-orange-700 uppercase mb-3 flex items-center gap-1">
                                                📞 Đầu mối liên hệ (Người phụ trách làm việc)
                                            </p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Họ tên người liên hệ</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                                                        placeholder="VD: Nguyễn Văn A"
                                                        value={newProjectData.clientContactPerson || ''}
                                                        onChange={e => setNewProjectData({ ...newProjectData, clientContactPerson: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Chức vụ</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                                                        placeholder="VD: Trưởng phòng Kỹ thuật"
                                                        value={newProjectData.clientContactRole || ''}
                                                        onChange={e => setNewProjectData({ ...newProjectData, clientContactRole: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">SĐT liên hệ</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                                                        placeholder="VD: 0912345678"
                                                        value={newProjectData.clientContactPhone || ''}
                                                        onChange={e => setNewProjectData({ ...newProjectData, clientContactPhone: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Email liên hệ</label>
                                                    <input
                                                        type="email"
                                                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                                                        placeholder="VD: nguyenvana@company.com"
                                                        value={newProjectData.clientContactEmail || ''}
                                                        onChange={e => setNewProjectData({ ...newProjectData, clientContactEmail: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Ngày bắt đầu (Dự kiến)</label>
                                            <input
                                                type="date"
                                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                                value={startDate}
                                                onChange={e => setStartDate(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Địa điểm thực hiện</label>
                                            <input
                                                type="text"
                                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                                placeholder="Tỉnh/Thành phố..."
                                                value={newProjectData.location}
                                                onChange={e => setNewProjectData({ ...newProjectData, location: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Quản lý dự án (PM)</label>
                                            <input
                                                type="text"
                                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                                placeholder="Họ và tên..."
                                                value={newProjectData.manager}
                                                onChange={e => setNewProjectData({ ...newProjectData, manager: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Ngân sách dự kiến (VNĐ)</label>
                                            <input
                                                type="number"
                                                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none"
                                                placeholder="0"
                                                value={newProjectData.budget}
                                                onChange={e => setNewProjectData({ ...newProjectData, budget: parseInt(e.target.value) || 0 })}
                                            />
                                        </div>
                                    </div>

                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-start gap-3">
                                        <User className="text-orange-600 shrink-0 mt-0.5" size={18} />
                                        <div className="text-sm text-orange-800">
                                            <p className="font-bold mb-1">Cấu hình Đội ngũ & RACI</p>
                                            <p className="opacity-80 text-xs leading-relaxed">
                                                Hệ thống sẽ tự động gán nhiệm vụ (Tasks) cho các thành viên dưới đây dựa trên Ma trận trách nhiệm (RACI) của quy chế <strong>{newProjectData.capitalSource === 'StateBudget' ? '25.10' : '25.20'}</strong>.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {['GĐTT', 'TBM', 'QLDA', 'QL BIM', 'ĐPBM', 'TBP XTDA', 'NDH', 'TNDH', 'TBP ADMIN'].map((role) => {
                                            const roleLabels: Record<string, string> = {
                                                'QLDA': 'Quản lý Dự án (PM)',
                                                'QL BIM': 'Quản lý BIM',
                                                'ĐPBM': 'Điều phối BIM',
                                                'TBP XTDA': 'Trưởng BP Xúc tiến DA',
                                                'NDH': 'Nhân viên Dựng hình',
                                                'TNDH': 'Trưởng nhóm Dựng hình',
                                                'TBP ADMIN': 'Hành chính / Admin',
                                                'GĐTT': 'Giám đốc Trung tâm',
                                                'TBM': 'Trưởng Bộ môn'
                                            };

                                            // Mapping vai trò với keywords để gợi ý
                                            // NOW USING GLOBAL CONFIG FROM constants.ts
                                            // const roleKeywords = RACI_ROLES_MAPPING; 

                                            // Sắp xếp users: người phù hợp lên đầu
                                            const allEmployees = EMPLOYEES;

                                            // Helper to check if employee matches role
                                            const isMatch = (emp: any, roleKey: string) => {
                                                const keyword = RACI_ROLES_MAPPING[roleKey] || '';
                                                if (!keyword) return false;
                                                const empRole = (emp.role || '').toLowerCase();
                                                const empDept = (emp.department || '').toLowerCase();
                                                const k = keyword.toLowerCase();
                                                return empRole.includes(k) || empDept.includes(k);
                                            };

                                            const sortedUsers = [...allEmployees].sort((a, b) => {
                                                const aMatch = isMatch(a, role);
                                                const bMatch = isMatch(b, role);
                                                if (aMatch && !bMatch) return -1;
                                                if (!aMatch && bMatch) return 1;
                                                return 0;
                                            });

                                            // Đếm số người phù hợp
                                            const suggestedCount = allEmployees.filter(u => isMatch(u, role)).length;

                                            const isRequired = ['QLDA', 'QL BIM'].includes(role);

                                            return (
                                                <div key={role}>
                                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 flex justify-between">
                                                        <span>{role} <span className="font-normal text-gray-400 normal-case">({roleLabels[role]})</span></span>
                                                        {isRequired && <span className="text-orange-500 font-normal normal-case text-[10px]">*Bắt buộc</span>}
                                                    </label>
                                                    <select
                                                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white"
                                                        value={roleMapping[role] || ''}
                                                        onChange={(e) => setRoleMapping({ ...roleMapping, [role]: e.target.value })}
                                                    >
                                                        <option value="">-- Chọn nhân sự --</option>
                                                        {suggestedCount > 0 && (
                                                            <optgroup label="✨ Gợi ý phù hợp">
                                                                {sortedUsers.slice(0, suggestedCount).map(u => (
                                                                    <option key={u.id} value={u.id}>⭐ {u.name} - {u.role}</option>
                                                                ))}
                                                            </optgroup>
                                                        )}
                                                        <optgroup label={suggestedCount > 0 ? "📋 Nhân sự khác" : "Tất cả nhân sự"}>
                                                            {sortedUsers.slice(suggestedCount).map(u => (
                                                                <option key={u.id} value={u.id}>{u.name} - {u.role}</option>
                                                            ))}
                                                        </optgroup>
                                                    </select>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Xem trước Task tự động:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {(() => {
                                                const tpl = (newProjectData.capitalSource || 'StateBudget') === 'StateBudget'
                                                    ? PROJECT_TEMPLATES.find(t => t.type === 'Giao thông')
                                                    : PROJECT_TEMPLATES.find(t => t.type === 'Dân dụng');
                                                const tasks = tpl?.defaultTasks || [];

                                                return (
                                                    <>
                                                        {tasks.map((t, idx) => (
                                                            <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                                                                T-{idx + 1}: {t.name}
                                                            </span>
                                                        ))}
                                                        <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 rounded border border-orange-100 font-bold">
                                                            +{tasks.length} Tasks
                                                        </span>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between">
                            {step === 2 ? (
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-white transition-all text-sm"
                                >
                                    Quay lại
                                </button>
                            ) : (
                                <div></div>
                            )}

                            {step === 1 ? (
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all text-sm flex items-center gap-2"
                                >
                                    Tiếp tục <ChevronRight size={16} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleCreateProject}
                                    disabled={isSaving}
                                    className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all text-sm flex items-center gap-2 disabled:opacity-70"
                                >
                                    {isSaving ? <RefreshCw className="animate-spin" size={16} /> : <Check size={16} />}
                                    {isSaving ? 'Đang lưu...' : 'Hoàn tất & Tạo Dự án'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <main className="p-8 w-full">

                {/* Statistics Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Tổng dự án</p>
                        <div className="flex justify-between items-end">
                            <h2 className="text-3xl font-bold text-gray-800">124</h2>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+12% so với tháng trước</span>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Đang hoạt động</p>
                        <div className="flex justify-between items-end">
                            <h2 className="text-3xl font-bold text-gray-800">45</h2>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+5 dự án mới</span>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Đúng tiến độ</p>
                        <div className="flex justify-between items-end">
                            <h2 className="text-3xl font-bold text-gray-800">38</h2>
                            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">84% hoạt động</span>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Chậm tiến độ</p>
                        <div className="flex justify-between items-end">
                            <h2 className="text-3xl font-bold text-gray-800">7</h2>
                            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded">-1% cải thiện</span>
                        </div>
                    </div>
                </div>

                {/* Filters & View Toggle */}
                <div className="bg-white rounded-t-xl border border-gray-200 p-4 flex flex-wrap justify-between items-center gap-4 mb-0.5">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Tìm dự án, mã, đối tác..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-64 transition-all"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <Filter size={14} className="text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
                            >
                                <option value="All">Trạng thái: Tất cả</option>
                                <option value={ProjectStatus.PLANNING}>{ProjectStatus.PLANNING}</option>
                                <option value={ProjectStatus.IN_PROGRESS}>{ProjectStatus.IN_PROGRESS}</option>
                                <option value={ProjectStatus.DELAYED}>{ProjectStatus.DELAYED}</option>
                                <option value={ProjectStatus.COMPLETED}>{ProjectStatus.COMPLETED}</option>
                            </select>
                        </div>

                        {/* Capital/Type Filter */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <MapPin size={14} className="text-gray-400" />
                            <select
                                value={capitalFilter}
                                onChange={(e) => setCapitalFilter(e.target.value)}
                                className="bg-transparent border-none outline-none text-sm font-medium text-gray-700 cursor-pointer"
                            >
                                <option value="All">Nguồn vốn: Tất cả</option>
                                <option value="StateBudget">Ngân sách (25.10)</option>
                                <option value="NonStateBudget">Ngoài NS (25.20)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* IMPORT/EXPORT BUTTONS */}
                        <div className="flex gap-2 mr-2">
                            <button
                                onClick={() => setShowSheetModal(true)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-emerald-200 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-all text-sm font-bold"
                                title="Kết nối Google Sheet"
                            >
                                <FileSpreadsheet size={16} /> <span className="hidden xl:inline">Google Sheet</span>
                            </button>
                            <button
                                onClick={() => setIsImportModalOpen(true)}
                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                                title="Nhập danh sách từ Excel"
                            >
                                <Upload size={16} className="text-gray-500" /> <span className="hidden xl:inline">Import</span>
                            </button>

                            <button
                                onClick={handleExport}
                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                                title="Xuất danh sách ra file Excel/CSV"
                            >
                                <Download size={16} className="text-emerald-600" /> <span className="hidden xl:inline">Export</span>
                            </button>
                        </div>

                        {/* CREATE PROJECT BUTTON */}
                        <button
                            onClick={() => setIsSmartWizardOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 transition-all text-sm"
                        >
                            <Plus size={18} /> Tạo Dự án mới
                        </button>

                        <ProjectCreationWizard
                            isOpen={isSmartWizardOpen}
                            onClose={() => setIsSmartWizardOpen(false)}
                            onSuccess={(newProject) => {
                                setLocalProjects(prev => [newProject, ...prev]);
                                // Direct navigate to project detail
                                navigate(`/projects/${newProject.id}`);
                            }}
                        />

                        <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-gray-50 ml-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p - 2 rounded transition - all ${viewMode === 'grid' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} `}
                                title="Dạng lưới"
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p - 2 rounded transition - all ${viewMode === 'list' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'} `}
                                title="Dạng danh sách"
                            >
                                <List size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className={`transition - opacity duration - 300 ${viewMode === 'grid' ? 'bg-transparent' : 'bg-white border-x border-b border-gray-200 rounded-b-xl overflow-hidden shadow-sm'} `}>

                    {filteredProjects.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <SearchIcon size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800">Không tìm thấy dự án</h3>
                            <p className="text-gray-500">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setStatusFilter('All'); setCapitalFilter('All'); }}
                                className="mt-4 px-4 py-2 text-orange-600 font-medium hover:bg-orange-50 rounded-lg transition-colors"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* GRID / DECK VIEW */}
                            {viewMode === 'grid' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
                                    {filteredProjects.map((project) => (
                                        <Link to={`/projects/${project.id}`} key={project.id} className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                                            {/* Card Image */}
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={project.thumbnail?.startsWith('http') ? project.thumbnail : `/ images / ${project.thumbnail} `}
                                                    alt={project.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                {/* Edit button overlay */}
                                                <button
                                                    onClick={(e) => openEditProjectModal(project, e)}
                                                    className="absolute top-3 left-3 p-2 bg-white/90 hover:bg-white text-gray-600 hover:text-blue-600 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md z-10"
                                                    title="Chỉnh sửa dự án"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <div className="absolute top-3 right-3">
                                                    <span className={`px - 2.5 py - 1 rounded - lg text - [10px] font - bold uppercase tracking - wider shadow - sm backdrop - blur - md
                                                ${project.status === ProjectStatus.IN_PROGRESS ? 'bg-orange-500/90 text-white' :
                                                            project.status === ProjectStatus.PLANNING ? 'bg-gray-500/90 text-white' :
                                                                project.status === ProjectStatus.DELAYED ? 'bg-rose-500/90 text-white' :
                                                                    'bg-emerald-500/90 text-white'
                                                        } `}>
                                                        {project.status}
                                                    </span>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                <div className="absolute bottom-3 left-4 text-white">
                                                    <p className="text-[10px] font-mono opacity-80 mb-0.5">{project.code}</p>
                                                    <h3 className="font-bold text-lg leading-tight line-clamp-1">{project.name}</h3>
                                                </div>
                                            </div>

                                            {/* Card Body */}
                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="mb-4 space-y-2">
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Building2 size={14} className="text-gray-400 shrink-0" />
                                                        <span className="font-medium text-gray-700 truncate">{project.client}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <MapPin size={14} className="text-gray-400 shrink-0" />
                                                        <span className="truncate">{project.location || 'Chưa cập nhật'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <User size={14} className="text-gray-400 shrink-0" />
                                                        <span className="truncate">PM: <span className="font-medium text-gray-700">{project.manager || 'Chưa chỉ định'}</span></span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Clock size={14} className="text-amber-500 shrink-0" />
                                                        <span>Deadline: {project.deadline}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-3 border-t border-gray-50">
                                                    {/* Work Progress Bar */}
                                                    <div className="mb-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Tiến độ</span>
                                                            <span className="text-sm font-bold text-orange-600">{project.progress}%</span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                            <div
                                                                className={`h - full rounded - full transition - all duration - 1000 ${project.status === ProjectStatus.DELAYED ? 'bg-rose-500' : 'bg-orange-600'} `}
                                                                style={{ width: `${project.progress}% ` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    {/* Payment Progress Bar */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Thanh toán</span>
                                                            <span className="text-xs font-bold text-emerald-600">
                                                                {project.budget > 0 ? Math.round((project.spent / project.budget) * 100) : 0}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                                                                style={{ width: `${project.budget > 0 ? (project.spent / project.budget) * 100 : 0}% ` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* LIST VIEW */}
                            {viewMode === 'list' && (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
                                            <th className="px-6 py-4">Tên & Mã Dự án</th>
                                            <th className="px-6 py-4">Trạng thái</th>
                                            <th className="px-6 py-4 w-1/4">Tiến độ</th>
                                            <th className="px-6 py-4">Các bên liên quan</th>
                                            <th className="px-6 py-4 text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredProjects.map((project) => (
                                            <tr key={project.id} className="hover:bg-gray-50/50 transition group">
                                                <td className="px-6 py-4">
                                                    <Link to={`/projects/${project.id}`} className="flex items-center gap-4 group-hover:opacity-80 transition-opacity">
                                                        <img src={project.thumbnail?.startsWith('http') ? project.thumbnail : `/ images / ${project.thumbnail} `} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm" />
                                                        <div>
                                                            <h3 className="font-bold text-gray-800 text-sm group-hover:text-orange-600 transition-colors">{project.name}</h3>
                                                            <div className="flex gap-2 items-center mt-1">
                                                                <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200 font-mono">
                                                                    {project.code}
                                                                </span>
                                                                <span className="text-xs text-gray-500">• {project.client}</span>
                                                            </div>
                                                            <div className="flex gap-2 items-center mt-1 text-xs text-gray-400">
                                                                <MapPin size={10} /> {project.location || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline - flex items - center px - 2.5 py - 1 rounded - full text - xs font - medium border
                                            ${project.status === ProjectStatus.IN_PROGRESS ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                            project.status === ProjectStatus.PLANNING ? 'bg-gray-100 text-gray-700 border-gray-200' :
                                                                project.status === ProjectStatus.DELAYED ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                                                    'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                        } `}>
                                                        <span className={`w - 1.5 h - 1.5 rounded - full mr - 1.5 
                                                ${project.status === ProjectStatus.IN_PROGRESS ? 'bg-orange-600' :
                                                                project.status === ProjectStatus.PLANNING ? 'bg-gray-500' :
                                                                    project.status === ProjectStatus.DELAYED ? 'bg-rose-600' :
                                                                        'bg-emerald-600'
                                                            } `}>
                                                        </span>
                                                        {project.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-between mb-1">
                                                        <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                                                        <span className="text-xs text-gray-500">Mục tiêu: 70%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                                        <div
                                                            className={`h - 2 rounded - full ${project.status === ProjectStatus.DELAYED ? 'bg-rose-500' : 'bg-orange-600'} `}
                                                            style={{ width: `${project.progress}% ` }}
                                                        ></div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex -space-x-2 overflow-hidden mb-1">
                                                        {[...Array(3)].map((_, i) => (
                                                            <img
                                                                key={i}
                                                                className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                                                                src={`https://picsum.photos/id/${100 + i}/100/100`}
                                                                alt=""
                                                            />
                                                        ))}
                                                        <div className="h-8 w-8 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center text-xs font-medium text-gray-600">
                                                            +{project.members}
                                                        </div>
                                                    </div >
                                                    <div className="text-xs text-gray-500">
                                                        PM: <span className="font-medium text-gray-700">{project.manager || 'N/A'}</span>
                                                    </div>
                                                </td >
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                                                        <MoreHorizontal size={20} />
                                                    </button>
                                                </td>
                                            </tr >
                                        ))}
                                    </tbody >
                                </table >
                            )}
                        </>
                    )}

                    {/* Pagination (Common) */}
                    <div className={`px-6 py-4 border-t border-gray-200 flex justify-between items-center bg-gray-50/30 ${viewMode === 'grid' ? 'mt-6 rounded-xl border' : ''}`}>
                        <p className="text-sm text-gray-500">Hiển thị {filteredProjects.length} kết quả</p>
                        <div className="flex gap-1">
                            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">Trước</button>
                            <button className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700">1</button>
                            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">Sau</button>
                        </div>
                    </div>
                </div >
            </main >
        </div >
    );
};

export default ProjectList;
