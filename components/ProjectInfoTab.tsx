
import React from 'react';
import { Project, Contract } from '../types';
import {
    Calendar, DollarSign, MapPin, Users, Building2, Award, Ruler, Layers,
    FileText, Clock, TrendingUp, Briefcase, User, Phone, Mail, Globe
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ProjectInfoTabProps {
    project: Project;
    contract?: Contract;
}

const formatCurrency = (value: number | undefined): string => {
    if (!value) return '0 ₫';
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)} tỷ ₫`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)} triệu ₫`;
    return `${value.toLocaleString('vi-VN')} ₫`;
};

const InfoCard = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Icon size={18} className="text-indigo-500" />
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">{title}</h3>
        </div>
        <div className="p-5">{children}</div>
    </div>
);

const InfoRow = ({ label, value, icon: Icon }: { label: string; value: string | number | undefined; icon?: any }) => (
    <div className="flex items-start justify-between py-2.5 border-b border-gray-50 last:border-0">
        <span className="text-sm text-gray-500 flex items-center gap-2">
            {Icon && <Icon size={14} className="text-gray-400" />}
            {label}
        </span>
        <span className="text-sm font-medium text-slate-800 text-right max-w-[60%]">{value || '-'}</span>
    </div>
);

const ProjectInfoTab: React.FC<ProjectInfoTabProps> = ({ project, contract }) => {
    const budgetData = [
        { name: 'Đã chi', value: project.spent || 0, color: '#f97316' },
        { name: 'Còn lại', value: (project.budget || 0) - (project.spent || 0), color: '#e2e8f0' },
    ];

    const progressData = [
        { name: 'Hoàn thành', value: project.progress || 0, color: '#10b981' },
        { name: 'Còn lại', value: 100 - (project.progress || 0), color: '#e2e8f0' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <DollarSign size={24} className="opacity-80" />
                        <span className="text-xs font-bold uppercase opacity-80">Giá trị HĐ</span>
                    </div>
                    <p className="text-2xl font-black">{formatCurrency(contract?.totalValue || project.budget)}</p>
                    <p className="text-xs opacity-80 mt-1">Ký ngày: {contract?.signedDate || 'Chưa xác định'}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <TrendingUp size={24} className="opacity-80" />
                        <span className="text-xs font-bold uppercase opacity-80">Khối lượng HT</span>
                    </div>
                    <p className="text-2xl font-black">{formatCurrency((contract?.totalValue || project.budget) * (project.progress / 100))}</p>
                    <p className="text-xs opacity-80 mt-1">Đạt {project.progress}% kế hoạch</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <Clock size={24} className="opacity-80" />
                        <span className="text-xs font-bold uppercase opacity-80">Thời hạn</span>
                    </div>
                    <p className="text-2xl font-black">{project.deadline || 'TBD'}</p>
                    <p className="text-xs opacity-80 mt-1">
                        {project.deadline ? `Còn ${Math.max(0, Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 86400)))} ngày` : 'Chưa xác định'}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <Users size={24} className="opacity-80" />
                        <span className="text-xs font-bold uppercase opacity-80">Nhân sự</span>
                    </div>
                    <p className="text-2xl font-black">{project.members || 0} người</p>
                    <p className="text-xs opacity-80 mt-1">Quản lý: {project.manager || 'Chưa chỉ định'}</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Project Details */}
                <div className="lg:col-span-2 space-y-6">
                    <InfoCard title="Thông tin chung" icon={FileText}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <div>
                                <InfoRow label="Mã dự án" value={project.code} icon={FileText} />
                                <InfoRow label="Nhóm dự án" value={project.projectGroup} icon={Layers} />
                                <InfoRow label="Loại công trình" value={project.constructionType} icon={Building2} />
                                <InfoRow label="Cấp công trình" value={project.constructionLevel} icon={Award} />
                            </div>
                            <div>
                                <InfoRow label="Quy mô" value={project.scale} icon={Ruler} />
                                <InfoRow label="Địa điểm" value={project.location} icon={MapPin} />
                                <InfoRow label="Nguồn vốn" value={project.capitalSource === 'StateBudget' ? 'Ngân sách Nhà nước' : 'Ngoài Ngân sách'} icon={Briefcase} />
                                <InfoRow label="Trạng thái" value={project.status} />
                            </div>
                        </div>
                    </InfoCard>

                    <InfoCard title="Thông tin khách hàng" icon={Users}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <div>
                                <InfoRow label="Tên khách hàng" value={project.client} icon={Building2} />
                                <InfoRow label="Đại diện" value={contract?.sideARep || '-'} icon={User} />
                                <InfoRow label="Chức vụ" value={contract?.sideAPosition || '-'} icon={Briefcase} />
                            </div>
                            <div>
                                <InfoRow label="Mã số thuế" value={contract?.sideAMst || '-'} icon={FileText} />
                                <InfoRow label="Liên hệ" value={contract?.sideAStaff || '-'} icon={Phone} />
                            </div>
                        </div>
                    </InfoCard>

                    {contract && (
                        <InfoCard title="Thông tin hợp đồng" icon={FileText}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                                <div>
                                    <InfoRow label="Số hợp đồng" value={contract.code} icon={FileText} />
                                    <InfoRow label="Gói thầu" value={contract.packageName} icon={Layers} />
                                    <InfoRow label="Ngày ký" value={contract.signedDate} icon={Calendar} />
                                    <InfoRow label="Thời hạn" value={contract.duration} icon={Clock} />
                                </div>
                                <div>
                                    <InfoRow label="Giá trị" value={formatCurrency(contract.totalValue)} icon={DollarSign} />
                                    <InfoRow label="Đã thanh toán" value={formatCurrency(contract.paidValue)} icon={TrendingUp} />
                                    <InfoRow label="Còn lại" value={formatCurrency(contract.remainingValue)} icon={Clock} />
                                    <InfoRow label="Bảo hành" value={contract.warrantyPeriod} />
                                </div>
                            </div>
                        </InfoCard>
                    )}

                    {/* Scope & Deliverables Section */}
                    {(project.scope || project.deliverables) && (
                        <div className="grid grid-cols-1 gap-6">
                            {project.scope && (
                                <InfoCard title="Nội dung & Khối lượng công việc" icon={Layers}>
                                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                        {project.scope}
                                    </p>
                                </InfoCard>
                            )}

                            {project.deliverables && (
                                <InfoCard title="Sản phẩm bàn giao" icon={Award}>
                                    <div className="bg-slate-50 rounded-lg p-4 border border-gray-100">
                                        <p className="text-sm text-slate-700 whitespace-pre-line leading-loose">
                                            {project.deliverables}
                                        </p>
                                    </div>
                                </InfoCard>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column - Charts & Quick Stats */}
                <div className="space-y-6">
                    <InfoCard title="Tiến độ dự án" icon={TrendingUp}>
                        <div className="flex items-center justify-center">
                            <div className="relative w-40 h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={progressData}
                                            innerRadius={50}
                                            outerRadius={65}
                                            paddingAngle={2}
                                            dataKey="value"
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            {progressData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => `${value}%`} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-emerald-600">{project.progress}%</span>
                                    <span className="text-xs text-gray-500">Hoàn thành</span>
                                </div>
                            </div>
                        </div>
                    </InfoCard>

                    <InfoCard title="Ngân sách" icon={DollarSign}>
                        <div className="flex items-center justify-center">
                            <div className="relative w-40 h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={budgetData}
                                            innerRadius={50}
                                            outerRadius={65}
                                            paddingAngle={2}
                                            dataKey="value"
                                            startAngle={90}
                                            endAngle={-270}
                                        >
                                            {budgetData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-lg font-black text-orange-600">{formatCurrency(project.spent)}</span>
                                    <span className="text-xs text-gray-500">Đã chi</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Tổng ngân sách:</span>
                                <span className="font-bold text-slate-800">{formatCurrency(project.budget)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Đã sử dụng:</span>
                                <span className="font-bold text-orange-600">{formatCurrency(project.spent)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Còn lại:</span>
                                <span className="font-bold text-emerald-600">{formatCurrency((project.budget || 0) - (project.spent || 0))}</span>
                            </div>
                        </div>
                    </InfoCard>

                    <InfoCard title="Thời gian" icon={Calendar}>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Bắt đầu</span>
                                <span className="text-sm font-medium text-slate-800">{contract?.startDate || 'Chưa xác định'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Kết thúc (KH)</span>
                                <span className="text-sm font-medium text-slate-800">{project.deadline || 'Chưa xác định'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">Thời gian thực hiện</span>
                                <span className="text-sm font-medium text-slate-800">{contract?.duration || '-'}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-4">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                    style={{ width: `${project.progress}%` }}
                                />
                            </div>
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};

export default ProjectInfoTab;
