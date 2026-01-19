
import React, { useState } from 'react';
import { Employee, Project } from '../types';
import { EMPLOYEES, RACI_TEMPLATES } from '../constants';
import {
    Users, User, Mail, Phone, Briefcase, Award,
    ChevronDown, ChevronRight, Plus, Search, Filter,
    CheckCircle2, AlertCircle, Clock, Settings
} from 'lucide-react';

interface ProjectPersonnelTabProps {
    project: Project;
    members: any[]; // Project members with roles
    raciData: any[]; // RACI matrix data
}

const RACI_COLORS: Record<string, string> = {
    'R': 'bg-rose-100 text-rose-700 border-rose-300',
    'A': 'bg-amber-100 text-amber-700 border-amber-300',
    'C': 'bg-blue-100 text-blue-700 border-blue-300',
    'I': 'bg-emerald-100 text-emerald-700 border-emerald-300',
};

const RACI_LABELS: Record<string, string> = {
    'R': 'Responsible (Thực hiện)',
    'A': 'Accountable (Phê duyệt)',
    'C': 'Consulted (Tham vấn)',
    'I': 'Informed (Thông báo)',
};

const RaciBadge = ({ value }: { value?: string }) => {
    if (!value) return <span className="text-gray-300">-</span>;

    return (
        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md border font-bold text-xs ${RACI_COLORS[value] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            {value}
        </span>
    );
};

interface MemberCardProps {
    employee: Employee;
    role: string;
    allocation: number;
}

const MemberCard: React.FC<MemberCardProps> = ({ employee, role, allocation }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-indigo-200 transition-all group">
        <div className="flex items-start gap-4">
            <img
                src={employee.avatar}
                alt={employee.name}
                className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
            />
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 truncate">{employee.name}</h4>
                <p className="text-xs text-orange-600 font-medium uppercase tracking-wider mb-2">{role}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <Award size={12} />
                        {employee.role}
                    </span>
                </div>
            </div>
            <div className="text-right">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${allocation >= 80 ? 'bg-rose-100 text-rose-700' :
                    allocation >= 50 ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                    }`}>
                    {allocation}%
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Allocation</p>
            </div>
        </div>

        {/* Contact Info */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex gap-4 text-xs text-gray-500">
            {employee.email && (
                <span className="flex items-center gap-1 truncate">
                    <Mail size={12} className="text-gray-400" />
                    {employee.email}
                </span>
            )}
            {employee.phone && (
                <span className="flex items-center gap-1">
                    <Phone size={12} className="text-gray-400" />
                    {employee.phone}
                </span>
            )}
        </div>

        {/* Skills */}
        {employee.skills && employee.skills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
                {(employee.skills || []).slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                        {skill}
                    </span>
                ))}
                {employee.skills.length > 3 && (
                    <span className="text-[10px] text-gray-400">+{employee.skills.length - 3}</span>
                )}
            </div>
        )}
    </div>
);

const ProjectPersonnelTab: React.FC<ProjectPersonnelTabProps> = ({ project, members, raciData }) => {
    // Get RACI template based on capital source
    const raciTemplate = (raciData && raciData.length > 0)
        ? raciData
        : (project.capitalSource === 'StateBudget'
            ? RACI_TEMPLATES.StateBudget
            : RACI_TEMPLATES.NonStateBudget);

    const [activeView, setActiveView] = useState<'team' | 'raci'>('team');
    const [searchQuery, setSearchQuery] = useState('');
    // Auto expand first phase
    const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set([raciTemplate[0]?.phase]));

    // Group RACI by phase
    const raciByPhase = raciTemplate.reduce((acc, item) => {
        if (!acc[item.phase]) {
            acc[item.phase] = [];
        }
        acc[item.phase].push(item);
        return acc;
    }, {} as Record<string, typeof raciTemplate>);

    // Get unique roles from RACI template
    const allRoles = [...new Set(raciTemplate.flatMap(phaseItem =>
        phaseItem.tasks.flatMap(task => Object.entries(task.roles).filter(([_, val]) => val).map(([role]) => role))
    ))].slice(0, 8); // Limit to 8 columns for display

    // Mock team members from EMPLOYEES if members is empty
    const teamMembers = members.length > 0 ? members : EMPLOYEES.slice(0, 8).map((emp, idx) => ({
        ...emp,
        projectRole: ['QLDA', 'QL BIM', 'ĐPBM', 'TBM', 'TNDH', 'NDH', 'TBP ADMIN', 'TBP XTDA'][idx] || 'TNDH',
        allocation: Math.floor(Math.random() * 60) + 40
    }));

    const filteredMembers = teamMembers.filter(m =>
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.projectRole?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const togglePhase = (phase: string) => {
        setExpandedPhases(prev => {
            const newSet = new Set(prev);
            if (newSet.has(phase)) {
                newSet.delete(phase);
            } else {
                newSet.add(phase);
            }
            return newSet;
        });
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Quản lý Nhân sự Dự án</h2>
                    <p className="text-sm text-gray-500">
                        {teamMembers.length} thành viên • Ma trận RACI theo Quy chế {project.capitalSource === 'StateBudget' ? '25.10' : '25.20'}
                    </p>
                </div>

                <div className="flex gap-3">
                    {/* View Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setActiveView('team')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeView === 'team' ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            <Users size={16} className="inline mr-2" />
                            Thành viên
                        </button>
                        <button
                            onClick={() => setActiveView('raci')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeView === 'raci' ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            <Settings size={16} className="inline mr-2" />
                            Ma trận RACI
                        </button>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow">
                        <Plus size={16} />
                        Thêm thành viên
                    </button>
                </div>
            </div>

            {activeView === 'team' && (
                <>
                    {/* Search */}
                    <div className="relative max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm theo tên, vai trò..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        />
                    </div>

                    {/* Team Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredMembers.map((member, idx) => (
                            <MemberCard
                                key={member.id || idx}
                                employee={member}
                                role={member.projectRole || 'Thành viên'}
                                allocation={member.allocation || 50}
                            />
                        ))}
                    </div>

                    {filteredMembers.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <Users size={48} className="mx-auto mb-4 opacity-30" />
                            <p>Không tìm thấy thành viên phù hợp</p>
                        </div>
                    )}
                </>
            )}

            {activeView === 'raci' && (
                <>
                    {/* RACI Legend */}
                    <div className="flex flex-wrap gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                        {Object.entries(RACI_LABELS).map(([key, label]) => (
                            <span key={key} className="flex items-center gap-2">
                                <RaciBadge value={key} />
                                <span className="text-gray-600">{label}</span>
                            </span>
                        ))}
                    </div>

                    {/* RACI Matrix by Phase */}
                    <div className="space-y-4">
                        {raciTemplate.map((phase, phaseIdx) => (
                            <div key={phaseIdx} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => togglePhase(phase.phase)}
                                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <h3 className="font-bold text-slate-800">{phase.phase}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">{phase.tasks.length} công việc</span>
                                        {expandedPhases.has(phase.phase) ? (
                                            <ChevronDown size={20} className="text-gray-400" />
                                        ) : (
                                            <ChevronRight size={20} className="text-gray-400" />
                                        )}
                                    </div>
                                </button>

                                {expandedPhases.has(phase.phase) && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm border-t border-gray-100">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-bold text-gray-600 min-w-[250px]">Công việc</th>
                                                    {allRoles.map(role => (
                                                        <th key={role} className="px-2 py-3 text-center font-bold text-gray-600 text-xs uppercase">
                                                            {role}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {phase.tasks.map((item: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-gray-50/50">
                                                        <td className="px-4 py-3 font-medium text-slate-700">{item.name}</td>
                                                        {allRoles.map(role => (
                                                            <td key={role} className="px-2 py-3 text-center">
                                                                <RaciBadge value={item.roles?.[role]} />
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
                </>
            )}
        </div>
    );
};

export default ProjectPersonnelTab;
