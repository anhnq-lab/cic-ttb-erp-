
import React, { useState, useMemo, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Header from '../components/Header';
import { TASKS } from '../constants';
import { Employee, TaskStatus } from '../types';
import { EmployeeService } from '../services/employee.service';
import ImportModal from '../components/ImportModal';
import EmployeeDeleteDialog from '../components/EmployeeDeleteDialog';
import {
    Users, Search, Filter, LayoutGrid, List, Plus,
    MoreHorizontal, Mail, Phone, MapPin, Briefcase,
    Award, UserPlus, Building, Calendar, CheckCircle, Clock,
    X, CreditCard, FileText, TrendingUp, Loader2, Upload, Download, Trash2, Folder
} from 'lucide-react';

const HRMList = () => {
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
    const [filterDept, setFilterDept] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // --- STATE FOR MODALS ---
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
    const [deleteProjectCount, setDeleteProjectCount] = useState(0);

    // --- DATA STATE (From Backend/Service) ---
    const [employees, setEmployees] = useState<Employee[]>([]);

    // New Employee Form State
    const [newEmp, setNewEmp] = useState<Partial<Employee>>({
        name: '', email: '', role: '', department: 'Kỹ thuật - BIM', status: 'Thử việc', joinDate: new Date().toISOString().split('T')[0]
    });

    // Edit Employee Form State
    const [editEmp, setEditEmp] = useState<Partial<Employee>>({});

    // --- FETCH EMPLOYEES FROM SERVICE ---
    useEffect(() => {
        const fetchEmployees = async () => {
            setIsLoading(true);
            try {
                const data = await EmployeeService.getEmployees();
                setEmployees(data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEmployees();

        // Subscribe to realtime changes
        const channel = EmployeeService.subscribeToEmployees(() => {
            fetchEmployees();
        });

        return () => {
            if (channel) EmployeeService.unsubscribe(channel);
        };
    }, []);

    const departments = ['All', ...Array.from(new Set(employees.map(e => e.department)))];

    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            // 1. Department Filter
            const matchesDept = filterDept === 'All' || emp.department === filterDept;

            // 2. Status Filter
            const matchesStatus = filterStatus === 'All' || emp.status === filterStatus;

            // 3. Search (Name, Email, Role, SKILLS)
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                emp.name.toLowerCase().includes(query) ||
                emp.email.toLowerCase().includes(query) ||
                emp.role.toLowerCase().includes(query) ||
                (emp.skills || []).some(skill => skill.toLowerCase().includes(query)); // Search in Skills

            return matchesDept && matchesStatus && matchesSearch;
        });
    }, [employees, filterDept, filterStatus, searchQuery]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Chính thức': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Nghỉ phép': return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'Thử việc': return 'bg-amber-50 text-amber-700 border-amber-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getEmployeeKPI = (empName: string) => {
        const empTasks = TASKS.filter(t => t.assignee?.name === empName);
        if (empTasks.length === 0) return { score: 0, total: 0, completed: 0 };

        const completed = empTasks.filter(t => t.status === TaskStatus.S5 || t.status === TaskStatus.S6).length;
        const score = Math.round((completed / empTasks.length) * 100);
        return { score, total: empTasks.length, completed };
    };

    const handleAddEmployee = async () => {
        if (!newEmp.name || !newEmp.email) return alert('Vui lòng nhập tên và email');

        const employeeData = {
            code: `CIC-${Math.floor(100 + Math.random() * 900)}`,
            name: newEmp.name!,
            email: newEmp.email!,
            role: newEmp.role || 'Nhân viên',
            department: newEmp.department || 'Kỹ thuật',
            phone: newEmp.phone || '09xx',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newEmp.name!)}&background=random&color=fff&size=150`,
            status: 'Thử việc' as const,
            joinDate: newEmp.joinDate!,
            skills: ['Mới']
        };

        const created = await EmployeeService.createEmployee(employeeData);
        if (created) {
            setEmployees([created, ...employees]);
        }
        setShowAddModal(false);
        setNewEmp({ name: '', email: '', role: '', department: 'Kỹ thuật - BIM', status: 'Thử việc', joinDate: new Date().toISOString().split('T')[0] });
    };

    // --- EDIT EMPLOYEE HANDLERS ---
    const openEditModal = (employee: Employee) => {
        setEditingEmployee(employee);
        setEditEmp({
            name: employee.name,
            email: employee.email,
            phone: employee.phone,
            role: employee.role,
            department: employee.department,
            status: employee.status,
            joinDate: employee.joinDate,
            dob: employee.dob,
            degree: employee.degree,
            certificates: employee.certificates
        });
        setShowEditModal(true);
    };

    const handleEditEmployee = async () => {
        if (!editingEmployee || !editEmp.name) return;

        const updated = await EmployeeService.updateEmployee(editingEmployee.id, editEmp as Employee);
        if (updated) {
            setEmployees(prev => prev.map(e => e.id === editingEmployee.id ? updated : e));
            // Also update selectedEmployee if viewing the same one
            if (selectedEmployee?.id === editingEmployee.id) {
                setSelectedEmployee(updated);
            }
        }
        setShowEditModal(false);
        setEditingEmployee(null);
        setEditEmp({});
    };

    // --- IMPORT/EXPORT HANDLERS ---
    const handleImportEmployees = async (data: any[]) => {
        const employeesToImport: Omit<Employee, 'id'>[] = data.map(row => ({
            code: row.Code || `CIC-${Math.floor(100 + Math.random() * 900)}`,
            name: row.Name || row['Họ và tên'],
            email: row.Email,
            phone: row.Phone || row['Số điện thoại'],
            department: row.Department || row['Phòng ban'],
            role: row.Role || row['Vị trí'],
            joinDate: row.JoinDate || row['Ngày vào làm'],
            status: (row.Status || row['Trạng thái'] || 'Thử việc') as any,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(row.Name || row['Họ và tên'])}&background=random&color=fff&size=150`,
            dob: row.DOB || row['Ngày sinh'],
            degree: row.Degree || row['Bằng cấp'],
            skills: row.Skills ? row.Skills.split(',').map((s: string) => s.trim()) : []
        }));

        const result = await EmployeeService.bulkCreateEmployees(employeesToImport);

        if (result.success.length > 0) {
            setEmployees(prev => [...result.success, ...prev]);
            alert(`Import thành công ${result.success.length} nhân viên!`);
        }

        if (result.failed.length > 0) {
            console.error('Failed imports:', result.failed);
            alert(`Có ${result.failed.length} nhân viên import thất bại. Kiểm tra console để xem chi tiết.`);
        }
    };

    const handleExportEmployees = async () => {
        const excelData = await EmployeeService.exportEmployeesToExcelData();
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Employees");
        XLSX.writeFile(wb, `Danh_sach_nhan_su_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    // --- DELETE HANDLERS ---
    const openDeleteDialog = async (employee: Employee) => {
        setDeletingEmployee(employee);
        // Check project participation
        const projects = await EmployeeService.getEmployeeProjects(employee.id);
        setDeleteProjectCount(projects.length);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!deletingEmployee) return;

        const result = await EmployeeService.deleteEmployeeWithValidation(deletingEmployee.id);

        if (result.success) {
            setEmployees(prev => prev.filter(e => e.id !== deletingEmployee.id));
            alert(result.message);
        } else {
            alert(result.message);
        }

        setShowDeleteDialog(false);
        setDeletingEmployee(null);
    };

    const handleChangeToInactive = async () => {
        if (!deletingEmployee) return;

        const updated = await EmployeeService.updateEmployee(deletingEmployee.id, { status: 'Inactive' as any });
        if (updated) {
            setEmployees(prev => prev.map(e => e.id === deletingEmployee.id ? updated : e));
            alert('Đã chuyển nhân viên sang trạng thái "Nghỉ việc"');
        }

        setShowDeleteDialog(false);
        setDeletingEmployee(null);
    };

    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <Header title="Quản trị Nguồn nhân lực" breadcrumb="Trang chủ / Nhân sự" />

            {/* --- ADD EMPLOYEE MODAL --- */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-fade-in-up">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-slate-800">Thêm nhân sự mới</h3>
                            <button onClick={() => setShowAddModal(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Họ và tên</label>
                                <input type="text" className="w-full p-2 border rounded-lg text-sm" value={newEmp.name} onChange={e => setNewEmp({ ...newEmp, name: e.target.value })} placeholder="Nguyễn Văn A" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                                    <input type="email" className="w-full p-2 border rounded-lg text-sm" value={newEmp.email} onChange={e => setNewEmp({ ...newEmp, email: e.target.value })} placeholder="email@cic.com.vn" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Số điện thoại</label>
                                    <input type="text" className="w-full p-2 border rounded-lg text-sm" value={newEmp.phone} onChange={e => setNewEmp({ ...newEmp, phone: e.target.value })} placeholder="09xx..." />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phòng ban</label>
                                    <select className="w-full p-2 border rounded-lg text-sm bg-white" value={newEmp.department} onChange={e => setNewEmp({ ...newEmp, department: e.target.value })}>
                                        {departments.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Vị trí / Role</label>
                                    <input type="text" className="w-full p-2 border rounded-lg text-sm" value={newEmp.role} onChange={e => setNewEmp({ ...newEmp, role: e.target.value })} placeholder="Kỹ sư..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ngày gia nhập</label>
                                <input type="date" className="w-full p-2 border rounded-lg text-sm" value={newEmp.joinDate} onChange={e => setNewEmp({ ...newEmp, joinDate: e.target.value })} />
                            </div>
                        </div>
                        <div className="p-5 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
                            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg">Hủy bỏ</button>
                            <button onClick={handleAddEmployee} className="px-4 py-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm">Lưu nhân sự</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- EDIT EMPLOYEE MODAL --- */}
            {showEditModal && editingEmployee && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-fade-in-up max-h-[90vh]">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-lg text-slate-800">✏️ Chỉnh sửa nhân sự</h3>
                            <button onClick={() => { setShowEditModal(false); setEditingEmployee(null); }}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Họ và tên</label>
                                <input type="text" className="w-full p-2 border rounded-lg text-sm" value={editEmp.name || ''} onChange={e => setEditEmp({ ...editEmp, name: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                                    <input type="email" className="w-full p-2 border rounded-lg text-sm" value={editEmp.email || ''} onChange={e => setEditEmp({ ...editEmp, email: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Số điện thoại</label>
                                    <input type="text" className="w-full p-2 border rounded-lg text-sm" value={editEmp.phone || ''} onChange={e => setEditEmp({ ...editEmp, phone: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phòng ban</label>
                                    <select className="w-full p-2 border rounded-lg text-sm bg-white" value={editEmp.department || ''} onChange={e => setEditEmp({ ...editEmp, department: e.target.value })}>
                                        {departments.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Vị trí / Role</label>
                                    <input type="text" className="w-full p-2 border rounded-lg text-sm" value={editEmp.role || ''} onChange={e => setEditEmp({ ...editEmp, role: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ngày gia nhập</label>
                                    <input type="date" className="w-full p-2 border rounded-lg text-sm" value={editEmp.joinDate || ''} onChange={e => setEditEmp({ ...editEmp, joinDate: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Ngày sinh</label>
                                    <input type="text" className="w-full p-2 border rounded-lg text-sm" value={editEmp.dob || ''} onChange={e => setEditEmp({ ...editEmp, dob: e.target.value })} placeholder="VD: 01/01/1990" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Trạng thái</label>
                                    <select className="w-full p-2 border rounded-lg text-sm bg-white" value={editEmp.status || ''} onChange={e => setEditEmp({ ...editEmp, status: e.target.value as any })}>
                                        <option value="Chính thức">Chính thức</option>
                                        <option value="Thử việc">Thử việc</option>
                                        <option value="Nghỉ phép">Nghỉ phép</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Bằng cấp</label>
                                <input type="text" className="w-full p-2 border rounded-lg text-sm" value={editEmp.degree || ''} onChange={e => setEditEmp({ ...editEmp, degree: e.target.value })} placeholder="VD: Kỹ sư Xây dựng - ĐH Bách Khoa" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Chứng chỉ</label>
                                <textarea className="w-full p-2 border rounded-lg text-sm resize-none" rows={3} value={editEmp.certificates || ''} onChange={e => setEditEmp({ ...editEmp, certificates: e.target.value })} placeholder="Liệt kê các chứng chỉ..." />
                            </div>
                        </div>
                        <div className="p-5 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
                            <button onClick={() => { setShowEditModal(false); setEditingEmployee(null); }} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg">Hủy bỏ</button>
                            <button onClick={handleEditEmployee} className="px-4 py-2 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm">Lưu thay đổi</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- EMPLOYEE DETAIL MODAL (WITH TABS FOR REQUESTS & TIMEKEEPING) --- */}
            {selectedEmployee && (
                <EmployeeDetailModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
            )}

            {/* --- IMPORT MODAL --- */}
            {showImportModal && (
                <ImportModal
                    isOpen={showImportModal}
                    onClose={() => setShowImportModal(false)}
                    onImport={handleImportEmployees}
                    type="Employee"
                />
            )}

            {/* --- DELETE CONFIRMATION DIALOG --- */}
            {showDeleteDialog && deletingEmployee && (
                <EmployeeDeleteDialog
                    employee={deletingEmployee}
                    onClose={() => { setShowDeleteDialog(false); setDeletingEmployee(null); }}
                    onConfirmDelete={handleConfirmDelete}
                    onChangeStatus={handleChangeToInactive}
                    projectCount={deleteProjectCount}
                />
            )}

            <main className="p-8 w-full">

                {/* HRM Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-0.5">Tổng nhân sự</p>
                            <h3 className="text-2xl font-bold text-gray-800">{employees.length}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-0.5">Đang hoạt động</p>
                            <h3 className="text-2xl font-bold text-gray-800">{employees.filter(e => e.status === 'Chính thức').length}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <UserPlus size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-0.5">Thử việc</p>
                            <h3 className="text-2xl font-bold text-gray-800">{employees.filter(e => e.status === 'Thử việc').length}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Building size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-0.5">Phòng ban</p>
                            <h3 className="text-2xl font-bold text-gray-800">{departments.length - 1}</h3>
                        </div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-3 overflow-x-auto max-w-full">
                        {/* Department Filter Tabs */}
                        <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                            {departments.map(dept => (
                                <button
                                    key={dept}
                                    onClick={() => setFilterDept(dept)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap
                                ${filterDept === dept
                                            ? 'bg-orange-50 text-orange-700 shadow-sm'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
                                >
                                    {dept === 'All' ? 'Tất cả' : dept}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Tìm tên, skill, email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-64 shadow-sm transition-all"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 appearance-none shadow-sm cursor-pointer"
                            >
                                <option value="All">Trạng thái: Tất cả</option>
                                <option value="Chính thức">Chính thức</option>
                                <option value="Thử việc">Thử việc</option>
                                <option value="Nghỉ phép">Nghỉ phép</option>
                            </select>
                            <Filter className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                        </div>

                        <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-white shadow-sm">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <LayoutGrid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-gray-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <List size={18} />
                            </button>
                        </div>

                        <button
                            onClick={() => setShowImportModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition-all text-sm"
                        >
                            <Upload size={18} /> Import Excel
                        </button>

                        <button
                            onClick={handleExportEmployees}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-md hover:bg-emerald-700 transition-all text-sm"
                        >
                            <Download size={18} /> Export Excel
                        </button>

                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 transition-all text-sm"
                        >
                            <Plus size={18} /> Thêm nhân sự
                        </button>
                    </div>
                </div>

                {/* Content */}
                {filteredEmployees.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-xl border border-gray-200 border-dashed">
                        <p className="text-gray-500">Không tìm thấy nhân sự phù hợp.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setFilterDept('All'); setFilterStatus('All'); }}
                            className="mt-2 text-orange-600 hover:underline text-sm font-medium"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                {filteredEmployees.map((emp) => (
                                    <div
                                        key={emp.id}
                                        onClick={() => setSelectedEmployee(emp)}
                                        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer flex flex-row overflow-hidden h-44 group"
                                    >
                                        {/* LEFT: Avatar Zone (30%) */}
                                        <div className="w-32 bg-slate-50 border-r border-gray-100 flex flex-col items-center justify-center p-2 shrink-0 relative">
                                            <div className="relative">
                                                <img src={emp.avatar} alt={emp.name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm group-hover:scale-105 transition-transform duration-300" />
                                                <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${emp.status === 'Chính thức' ? 'bg-emerald-500' : emp.status === 'Thử việc' ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                                            </div>
                                            <span className="mt-2 text-[10px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">
                                                {emp.code}
                                            </span>
                                        </div>

                                        {/* RIGHT: Info Zone (70%) */}
                                        <div className="flex-1 p-4 flex flex-col justify-between overflow-hidden">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-bold text-slate-900 text-base leading-tight truncate pr-2 group-hover:text-orange-600 transition-colors flex-1">
                                                        {emp.name}
                                                    </h3>
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); openEditModal(emp); }}
                                                            className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors shrink-0"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <FileText size={14} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); openDeleteDialog(emp); }}
                                                            className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 p-1 rounded transition-colors shrink-0"
                                                            title="Xóa"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wide truncate mb-3">
                                                    {emp.role}
                                                </p>

                                                <div className="space-y-1.5">
                                                    <p className="text-xs text-slate-500 flex items-center gap-2 truncate" title={emp.email}>
                                                        <Mail size={12} className="shrink-0 text-slate-400" /> {emp.email}
                                                    </p>
                                                    <p className="text-xs text-slate-500 flex items-center gap-2 truncate">
                                                        <Phone size={12} className="shrink-0 text-slate-400" /> {emp.phone}
                                                    </p>
                                                </div>

                                                <div className="mt-3 flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-orange-500 rounded-full"
                                                            style={{ width: `${getEmployeeKPI(emp.name).score || 0}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-slate-600">
                                                        KPI: {getEmployeeKPI(emp.name).score}%
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Skills Tag Cloud */}
                                            <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-50">
                                                {(emp.skills || []).slice(0, 2).map((skill, idx) => (
                                                    <span key={idx} className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded border border-gray-200 truncate max-w-[80px]">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {(emp.skills || []).length > 2 && (
                                                    <span className="text-[9px] text-gray-400 px-1 pt-0.5">+{(emp.skills || []).length - 2}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-bold text-gray-500">
                                        <tr>
                                            <th className="px-6 py-4">Nhân sự</th>
                                            <th className="px-6 py-4">Vị trí & Phòng ban</th>
                                            <th className="px-6 py-4">Liên hệ</th>
                                            <th className="px-6 py-4">Ngày gia nhập</th>
                                            <th className="px-6 py-4">Trạng thái</th>
                                            <th className="px-6 py-4 text-right">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {filteredEmployees.map((emp) => (
                                            <tr key={emp.id} className="hover:bg-gray-50 group transition-colors cursor-pointer" onClick={() => setSelectedEmployee(emp)}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={emp.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                                        <div>
                                                            <p className="font-bold text-gray-800">{emp.name}</p>
                                                            <p className="text-xs text-gray-500 font-mono">{emp.code}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-800">{emp.role}</p>
                                                    <p className="text-xs text-gray-500">{emp.department}</p>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 space-y-0.5">
                                                    <div className="flex items-center gap-2 text-xs"><Mail size={12} /> {emp.email}</div>
                                                    <div className="flex items-center gap-2 text-xs"><Phone size={12} /> {emp.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} className="text-gray-400" />
                                                        {emp.joinDate}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${getStatusColor(emp.status)}`}>
                                                        {emp.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); openEditModal(emp); }}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <FileText size={16} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); openDeleteDialog(emp); }}
                                                            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                                                            title="Xóa"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

// --- SUB-COMPONENTS FOR DETAIL MODAL ---

const EmployeeDetailModal = ({ employee, onClose }: { employee: Employee, onClose: () => void }) => {
    const [activeTab, setActiveTab] = useState('info');
    const [employeeProjects, setEmployeeProjects] = useState<any[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(false);

    useEffect(() => {
        const loadProjects = async () => {
            setLoadingProjects(true);
            const projects = await EmployeeService.getEmployeeProjects(employee.id);
            setEmployeeProjects(projects);
            setLoadingProjects(false);
        };
        loadProjects();
    }, [employee.id]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col animate-fade-in-up">
                {/* Header (Increased Height for Depth) */}
                <div className="h-40 bg-gradient-to-r from-slate-800 to-slate-900 relative shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 backdrop-blur-md z-10"><X size={20} /></button>

                    {/* Floating Avatar (Overlapping) */}
                    <div className="absolute -bottom-10 left-8 z-20">
                        <img src={employee.avatar} className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-white object-cover" />
                        <span className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${employee.status === 'Chính thức' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    </div>
                </div>

                {/* Info Section (Under Header, beside Avatar) */}
                <div className="pt-2 px-8 pb-0">
                    <div className="pl-36 mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">{employee.name}</h2>
                        <div className="flex items-center gap-3 text-sm mt-1">
                            <span className="font-bold text-orange-600 uppercase tracking-wide">{employee.role}</span>
                            <span className="text-gray-300">|</span>
                            <span className="text-gray-500 font-medium">{employee.department}</span>
                        </div>
                    </div>

                    <div className="border-b border-gray-200">
                        <div className="flex gap-8">
                            <button onClick={() => setActiveTab('info')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Thông tin cá nhân</button>
                            <button onClick={() => setActiveTab('projects')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'projects' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Dự án tham gia</button>
                            <button onClick={() => setActiveTab('timekeeping')} className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'timekeeping' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Báo cáo ngày (Daily Report)</button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
                    {activeTab === 'info' && <EmployeeInfoTab employee={employee} />}
                    {activeTab === 'projects' && <EmployeeProjectsTab projects={employeeProjects} loading={loadingProjects} />}
                    {activeTab === 'timekeeping' && <TimekeepingTab />}
                </div>
            </div>
        </div>
    );
};

const EmployeeInfoTab = ({ employee }: { employee: Employee }) => (
    <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-2">Thông tin liên hệ</h4>
                <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-sm text-gray-500">Email</span>
                        <span className="text-sm font-medium text-gray-800">{employee.email}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-sm text-gray-500">Điện thoại</span>
                        <span className="text-sm font-medium text-gray-800">{employee.phone}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-sm text-gray-500">Ngày sinh</span>
                        <span className="text-sm font-medium text-gray-800">{employee.dob || '-'}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-sm text-gray-500">Mã nhân viên</span>
                        <span className="text-sm font-mono text-gray-800 bg-gray-100 px-2 rounded">{employee.code}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-sm text-gray-500">Ngày vào làm</span>
                        <span className="text-sm font-medium text-gray-800">{employee.joinDate}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-sm text-gray-500">Hồ sơ năng lực</span>
                        <span className="text-sm font-medium text-gray-800">
                            {employee.profileUrl ? (
                                <a href={employee.profileUrl} target="_blank" rel="noreferrer" className="text-orange-600 hover:underline">Xem hồ sơ</a>
                            ) : '-'}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4">Học vấn & Chứng chỉ</h4>
                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Bằng cấp</p>
                        <p className="text-sm font-medium text-gray-800 whitespace-pre-line">{employee.degree || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Năm tốt nghiệp</p>
                        <p className="text-sm font-medium text-gray-800">{employee.graduationYear || '-'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Chứng chỉ</p>
                        <p className="text-sm font-medium text-gray-800 whitespace-pre-line">{employee.certificates || '-'}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4">Kỹ năng & Chuyên môn</h4>
                <div className="flex flex-wrap gap-2">
                    {(employee.skills || []).map(skill => (
                        <span key={skill} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const EmployeeProjectsTab = ({ projects, loading }: { projects: any[], loading: boolean }) => (
    <div className="space-y-6">
        {loading ? (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-gray-400" size={32} />
                <p className="ml-3 text-gray-500">Đang tải dự án...</p>
            </div>
        ) : projects.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 border-dashed p-12 text-center">
                <Folder className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-500">Nhân viên chưa tham gia dự án nào</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
                {projects.map((pm: any) => (
                    <div key={pm.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5">
                        <div className="flex items-start gap-4">
                            <img
                                src={pm.project?.thumbnail || 'https://via.placeholder.com/80'}
                                alt={pm.project?.name}
                                className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                            />
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-gray-800">{pm.project?.name || 'Dự án'}</h4>
                                        <p className="text-xs text-gray-500 font-mono">{pm.project?.code}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${pm.project?.status === 'Đang thực hiện' ? 'bg-blue-50 text-blue-700' :
                                            pm.project?.status === 'Hoàn thành' ? 'bg-emerald-50 text-emerald-700' :
                                                'bg-gray-50 text-gray-700'
                                        }`}>
                                        {pm.project?.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">Vai trò</p>
                                        <p className="font-medium text-gray-800">{pm.projectRole || pm.role || 'Thành viên'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">Phân bổ</p>
                                        <p className="font-medium text-gray-800">{pm.allocation || 100}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-0.5">Tham gia từ</p>
                                        <p className="font-medium text-gray-800">{pm.joinedAt ? new Date(pm.joinedAt).toLocaleDateString('vi-VN') : '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const TimekeepingTab = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <p className="text-xs text-gray-500 uppercase">Công chuẩn</p>
                <p className="text-2xl font-bold text-gray-800">22</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <p className="text-xs text-gray-500 uppercase">Công thực tế</p>
                <p className="text-2xl font-bold text-emerald-600">20.5</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <p className="text-xs text-gray-500 uppercase">Đi muộn / Về sớm</p>
                <p className="text-2xl font-bold text-orange-600">2</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                <p className="text-xs text-gray-500 uppercase">Nghỉ phép</p>
                <p className="text-2xl font-bold text-blue-600">1</p>
            </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-sm text-gray-700">Lịch sử báo cáo công việc (Tháng 03/2025)</div>
            <table className="w-full text-left text-sm">
                <thead className="bg-white text-gray-500 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-3 font-normal">Ngày</th>
                        <th className="px-6 py-3 font-normal">Check In</th>
                        <th className="px-6 py-3 font-normal">Check Out</th>
                        <th className="px-6 py-3 font-normal">Công</th>
                        <th className="px-6 py-3 font-normal text-right">Ghi chú</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {[...Array(5)].map((_, i) => (
                        <tr key={i}>
                            <td className="px-6 py-3 font-medium text-gray-800">2{5 - i}/03/2025</td>
                            <td className="px-6 py-3 text-emerald-600">08:0{i} AM</td>
                            <td className="px-6 py-3 text-emerald-600">17:3{i} PM</td>
                            <td className="px-6 py-3 font-bold">1.0</td>
                            <td className="px-6 py-3 text-right text-gray-400">-</td>
                        </tr>
                    ))}
                    <tr>
                        <td className="px-6 py-3 font-medium text-gray-800">20/03/2025</td>
                        <td className="px-6 py-3 text-orange-500">08:45 AM</td>
                        <td className="px-6 py-3 text-emerald-600">17:30 PM</td>
                        <td className="px-6 py-3 font-bold">1.0</td>
                        <td className="px-6 py-3 text-right text-orange-500 text-xs font-bold">ĐI MUỘN</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

// RequestTab component removed as it has been moved to MyDashboard.tsx

export default HRMList;
