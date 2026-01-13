import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { TimesheetService } from '../services/timesheet.service';
import { ProjectService } from '../services/project.service';
import { EmployeeService } from '../services/employee.service';
import { TimesheetLog, Employee, Project } from '../types';
import {
    Calendar, Download, Search, Filter, ChevronDown,
    FileText, TrendingUp, Clock, Users, FolderOpen, Loader2
} from 'lucide-react';

const DailyReportList = () => {
    const [reports, setReports] = useState<TimesheetLog[]>([]);
    const [filteredReports, setFilteredReports] = useState<TimesheetLog[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedProject, setSelectedProject] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedWorkType, setSelectedWorkType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [reports, searchQuery, selectedEmployee, selectedProject, selectedStatus, selectedWorkType, startDate, endDate]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [allReports, emps, projs] = await Promise.all([
                TimesheetService.getAllTimesheets(),
                EmployeeService.getEmployees(),
                ProjectService.getProjects()
            ]);

            setReports(allReports);
            setEmployees(emps);
            setProjects(projs);

            // Load stats
            const statistics = await TimesheetService.getSummaryStats();
            setStats(statistics);
        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...reports];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(r =>
                (r.description || '').toLowerCase().includes(query) ||
                r.taskId?.toLowerCase().includes(query)
            );
        }

        // Employee filter
        if (selectedEmployee) {
            filtered = filtered.filter(r => r.employeeId === selectedEmployee);
        }

        // Project filter
        if (selectedProject) {
            filtered = filtered.filter(r => r.projectId === selectedProject);
        }

        // Status filter
        if (selectedStatus) {
            filtered = filtered.filter(r => r.status === selectedStatus);
        }

        // Work type filter
        if (selectedWorkType) {
            filtered = filtered.filter(r => r.workType === selectedWorkType);
        }

        // Date range filter
        if (startDate) {
            filtered = filtered.filter(r => r.date >= startDate);
        }
        if (endDate) {
            filtered = filtered.filter(r => r.date <= endDate);
        }

        setFilteredReports(filtered);
        setCurrentPage(1); // Reset to first page
    };

    const handleExportCSV = async () => {
        try {
            const filters: any = {};
            if (selectedEmployee) filters.employeeId = selectedEmployee;
            if (selectedProject) filters.projectId = selectedProject;
            if (selectedStatus) filters.status = selectedStatus;
            if (selectedWorkType) filters.workType = selectedWorkType;
            if (startDate) filters.startDate = startDate;
            if (endDate) filters.endDate = endDate;

            const csvContent = await TimesheetService.exportToCSV(filters);

            // Download CSV
            const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); // UTF-8 BOM
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `bao-cao-ngay_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
        } catch (error) {
            console.error('Export error:', error);
            alert('Có lỗi khi xuất file!');
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedEmployee('');
        setSelectedProject('');
        setSelectedStatus('');
        setSelectedWorkType('');
        setStartDate('');
        setEndDate('');
    };

    const setQuickFilter = (filter: 'today' | 'thisWeek' | 'thisMonth') => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        switch (filter) {
            case 'today':
                setStartDate(todayStr);
                setEndDate(todayStr);
                break;
            case 'thisWeek':
                const weekStart = new Date(today);
                weekStart.setDate(today.getDate() - today.getDay() + 1); // Monday
                setStartDate(weekStart.toISOString().split('T')[0]);
                setEndDate(todayStr);
                break;
            case 'thisMonth':
                const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                setStartDate(monthStart.toISOString().split('T')[0]);
                setEndDate(todayStr);
                break;
        }
    };

    const getEmployeeName = (empId: string) => {
        const emp = employees.find(e => e.id === empId || e.code === empId);
        return emp ? emp.name : empId;
    };

    const getProjectName = (projectId: string) => {
        const proj = projects.find(p => p.id === projectId || p.code === projectId);
        return proj ? proj.name : projectId;
    };

    // Pagination
    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
    const paginatedReports = filteredReports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <Header title="Báo cáo công việc hàng ngày" breadcrumb="Trang chủ / Báo cáo ngày" />

            <main className="p-8">
                {/* Summary Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Tổng báo cáo</p>
                                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalReports}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Tổng giờ làm</p>
                                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalHours.toFixed(1)}h</h3>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Nhân sự</p>
                                    <h3 className="text-2xl font-bold text-gray-800">{Object.keys(stats.byEmployee).length}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                    <FolderOpen size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Dự án</p>
                                    <h3 className="text-2xl font-bold text-gray-800">{Object.keys(stats.byProject).length}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filter Panel */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                            <Filter size={20} className="text-orange-600" />
                            Bộ lọc
                        </h3>
                        <div className="flex gap-2">
                            <button onClick={() => setQuickFilter('today')} className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg">Hôm nay</button>
                            <button onClick={() => setQuickFilter('thisWeek')} className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg">Tuần này</button>
                            <button onClick={() => setQuickFilter('thisMonth')} className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg">Tháng này</button>
                            <button onClick={resetFilters} className="px-3 py-1 text-xs font-medium text-orange-600 hover:bg-orange-50 border border-orange-200 rounded-lg">Xóa lọc</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            />
                        </div>

                        {/* Employee Filter */}
                        <select
                            value={selectedEmployee}
                            onChange={(e) => setSelectedEmployee(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        >
                            <option value="">Tất cả nhân viên</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>

                        {/* Project Filter */}
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        >
                            <option value="">Tất cả dự án</option>
                            {projects.map(proj => (
                                <option key={proj.id} value={proj.id}>{proj.name}</option>
                            ))}
                        </select>

                        {/* Status Filter */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="Pending">Chờ duyệt</option>
                            <option value="Approved">Đã duyệt</option>
                            <option value="Rejected">Từ chối</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        {/* Start Date */}
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            placeholder="Từ ngày"
                        />

                        {/* End Date */}
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            placeholder="Đến ngày"
                        />

                        {/* Work Type Filter */}
                        <select
                            value={selectedWorkType}
                            onChange={(e) => setSelectedWorkType(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        >
                            <option value="">Tất cả loại công việc</option>
                            <option value="Modeling">Dựng hình / Modeling</option>
                            <option value="Review">Kiểm soát / Review</option>
                            <option value="Meeting">Họp / Meeting</option>
                            <option value="Coordination">Phối hợp</option>
                            <option value="Other">Khác</option>
                        </select>

                        {/* Export Button */}
                        <button
                            onClick={handleExportCSV}
                            className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-sm flex items-center justify-center gap-2 text-sm"
                        >
                            <Download size={16} />
                            Xuất CSV
                        </button>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        Hiển thị <span className="font-bold">{paginatedReports.length}</span> / <span className="font-bold">{filteredReports.length}</span> báo cáo
                    </p>
                </div>

                {/* Table */}
                {isLoading ? (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                        <Loader2 className="animate-spin mx-auto mb-4 text-orange-600" size={40} />
                        <p className="text-gray-500">Đang tải dữ liệu...</p>
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                        <p className="text-gray-500">Không tìm thấy báo cáo nào phù hợp.</p>
                        <button onClick={resetFilters} className="mt-4 text-orange-600 hover:underline font-medium text-sm">
                            Xóa bộ lọc
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Ngày</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nhân viên</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Dự án</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Task</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Giờ làm</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Loại CV</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Mô tả</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedReports.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                                {new Date(report.date).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                {getEmployeeName(report.employeeId)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {getProjectName(report.projectId)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                                                {report.taskId || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className="font-bold text-orange-600">{report.hours}h</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                                    {report.workType || '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={report.description}>
                                                {report.description || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${report.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                                                        report.status === 'Rejected' ? 'bg-rose-50 text-rose-700' :
                                                            'bg-amber-50 text-amber-700'
                                                    }`}>
                                                    {report.status === 'Approved' ? 'Đã duyệt' :
                                                        report.status === 'Rejected' ? 'Từ chối' : 'Chờ duyệt'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex justify-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trước
                                </button>
                                <span className="px-4 py-2 text-sm text-gray-600">
                                    Trang <span className="font-bold">{currentPage}</span> / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default DailyReportList;
