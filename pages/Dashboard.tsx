
import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import { PROJECTS, CONTRACTS } from '../constants';
import { ProjectStatus } from '../types';
import {
  DollarSign, TrendingUp, Activity, Users, AlertCircle, Clock, FileText, Wallet,
  RefreshCcw, Building2, Landmark, Trophy, AlertTriangle, BarChart3, PieChart as PieIcon,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { AnalyticsService, DashboardSummary } from '../services/analytics.service';

// Tính toán dữ liệu động
const Dashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AnalyticsService.getDashboardSummary();
        setSummary(data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Dữ liệu cho biểu đồ doanh thu theo quý
  const revenueChartData = useMemo(() => {
    if (!summary) return [];
    return summary.financial.revenueByQuarter.slice(-6).map(q => ({
      name: q.quarter,
      revenue: q.value / 1000000000, // Convert to Tỷ
    }));
  }, [summary]);

  // Dữ liệu cho biểu đồ công nợ theo khách hàng
  const receivablesChartData = useMemo(() => {
    if (!summary) return [];
    return summary.financial.receivablesByClient.slice(0, 5).map(r => ({
      name: r.client.length > 20 ? r.client.substring(0, 20) + '...' : r.client,
      value: r.value / 1000000000,
    }));
  }, [summary]);

  // Dữ liệu cho pie chart trạng thái dự án
  const projectStatusData = useMemo(() => {
    if (!summary) return [];
    return Object.entries(summary.projects.byStatus).map(([status, count]) => ({
      name: status,
      value: count,
      color: status === 'Đang thực hiện' ? '#f97316' :
        status === 'Hoàn thành' ? '#10b981' :
          status === 'Tạm hoãn' ? '#ef4444' : '#6b7280'
    }));
  }, [summary]);

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCcw className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <Header title="Tổng quan điều hành" breadcrumb="Trang chủ / Tổng quan" />

      <main className="p-8 w-full">
        {/* Main Message Banner with AI Insights */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white p-6 rounded-xl shadow-lg mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" /> CIC Intelligence Dashboard
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-2xl font-black mb-1">Tổng quan Portfolio</h3>
                <p className="text-indigo-200 text-sm mb-4">Dữ liệu từ {summary?.projects.totalProjects} dự án và {summary?.contracts.totalContracts} hợp đồng</p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-indigo-300 font-bold uppercase">Giá trị HĐ</p>
                    <p className="text-xl font-bold">{AnalyticsService.formatCurrency(summary?.financial.totalContractValue || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-300 font-bold uppercase">Đã thu</p>
                    <p className="text-xl font-bold text-emerald-400">{AnalyticsService.formatCurrency(summary?.financial.totalPaidValue || 0)}</p>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="font-bold text-sm text-indigo-100 mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-orange-400" /> Cảnh báo & Insight
                </h4>
                <ul className="space-y-2">
                  {summary?.topRisks.map((risk, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-[-20deg] transform translate-x-12"></div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Contracts */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Số lượng Hợp đồng</p>
                <h3 className="text-2xl font-bold text-gray-800">{summary?.contracts.totalContracts}</h3>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <FileText size={20} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {summary?.contracts.byStatus['Hiệu lực'] || 0} đang hiệu lực
              </span>
            </div>
          </div>

          {/* Total Contract Value */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Tổng giá trị HĐ</p>
                <h3 className="text-2xl font-bold text-gray-800">{AnalyticsService.formatCurrency(summary?.financial.totalContractValue || 0)}</h3>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Trung bình: {AnalyticsService.formatCurrency(summary?.contracts.avgContractValue || 0)}/HĐ</span>
            </div>
          </div>

          {/* Paid Value */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Doanh thu Thực thu</p>
                <h3 className="text-2xl font-bold text-gray-800">{AnalyticsService.formatCurrency(summary?.financial.totalPaidValue || 0)}</h3>
              </div>
              <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                <Wallet size={20} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${(summary?.financial.paymentProgress || 0) >= 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {(summary?.financial.paymentProgress || 0) >= 50 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {summary?.financial.paymentProgress.toFixed(0)}% thu hồi
              </span>
            </div>
          </div>

          {/* Receivables */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Công nợ Phải thu</p>
                <h3 className="text-2xl font-bold text-gray-800">{AnalyticsService.formatCurrency(summary?.financial.totalReceivables || 0)}</h3>
              </div>
              <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                <Clock size={20} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{summary?.financial.receivablesByClient.length} khách hàng còn nợ</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue by Quarter Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                  Doanh thu theo Quý
                </h3>
                <p className="text-sm text-gray-500 mt-1">Giá trị đã thanh toán (Tỷ VNĐ)</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(2)} Tỷ`, 'Doanh thu']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Project Status Pie */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-gray-500" />
              Trạng thái Dự án
            </h3>
            <p className="text-sm text-gray-500 mb-4">{summary?.projects.totalProjects} dự án trong portfolio</p>

            <div className="flex-1 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} dự án`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-gray-800">{summary?.projects.avgProgress.toFixed(0)}%</span>
                <span className="text-xs text-gray-500 font-medium">Tiến độ TB</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {projectStatusData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Receivables by Client & Project List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Top Receivables */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              Top Công nợ Phải thu
            </h3>
            <div className="space-y-3">
              {summary?.financial.receivablesByClient.slice(0, 5).map((item, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-medium text-gray-800 truncate flex-1">{item.client}</p>
                    <span className="text-xs font-bold text-rose-600 ml-2">{AnalyticsService.formatCurrency(item.value)}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-400 rounded-full"
                      style={{ width: `${Math.min((item.value / (summary?.financial.totalReceivables || 1)) * 100 * 5, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Table */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">Dự án Hoạt động</h3>
              <span className="text-sm text-gray-500">{summary?.projects.delayedCount} dự án chậm tiến độ</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Tên dự án</th>
                    <th className="px-4 py-3 font-semibold">Trạng thái</th>
                    <th className="px-4 py-3 font-semibold">Tiến độ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {PROJECTS.slice(0, 5).map(proj => (
                    <tr key={proj.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-800">{proj.name}</p>
                        <p className="text-xs text-gray-500">{proj.client}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                          ${proj.status === ProjectStatus.IN_PROGRESS ? 'bg-orange-50 text-orange-600' :
                            proj.status === ProjectStatus.PLANNING ? 'bg-gray-100 text-gray-600' :
                              proj.status === ProjectStatus.DELAYED ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                          {proj.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 w-40">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-700 w-10">{proj.progress}%</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${proj.progress > 80 ? 'bg-emerald-500' : proj.progress > 50 ? 'bg-orange-500' : 'bg-amber-500'}`}
                              style={{ width: `${proj.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cashflow Forecast & HR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cashflow Forecast */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Dự báo Dòng tiền (6 tháng)
            </h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary?.cashFlowForecast || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000000000).toFixed(1)}B`}
                  />
                  <CartesianGrid vertical={false} stroke="#f3f4f6" />
                  <Tooltip formatter={(value: number) => [AnalyticsService.formatCurrency(value), 'Dự kiến thu']} />
                  <Area type="monotone" dataKey="expected" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCf)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* HR Summary */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Nhân sự
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <span className="block text-2xl font-bold text-blue-600">{summary?.hr.totalEmployees}</span>
                <span className="block text-xs text-gray-600">Tổng nhân sự</span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg text-center">
                <span className="block text-2xl font-bold text-emerald-600">{summary?.hr.byStatus['Chính thức'] || 0}</span>
                <span className="block text-xs text-gray-600">Chính thức</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase">Phân bổ theo phòng ban</p>
              {summary?.hr.byDepartment.slice(0, 4).map((dept, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{dept.department}</span>
                  <span className="font-bold text-gray-800">{dept.count} người</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quality & Performance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quality KPIs */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-indigo-500" />
              Chất lượng & Hiệu suất
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Tỷ lệ Bàn giao Đúng hạn</span>
                  <span className="font-bold text-emerald-600">{summary?.quality.onTimeDeliveryRate.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${summary?.quality.onTimeDeliveryRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Tỷ lệ Rework (Làm lại)</span>
                  <span className="font-bold text-rose-600">{summary?.quality.reworkRate.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${summary?.quality.reworkRate}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">Mục tiêu: Dưới 5%</p>
              </div>

              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{summary?.quality.avgCompletionTime}</p>
                  <p className="text-xs text-gray-500">Ngày hoàn thành TB</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">4.8/5</p>
                  <p className="text-xs text-gray-500">Điểm hài lòng</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Top Nhân sự Xuất sắc (Tháng này)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-gray-50/50">
                  <tr>
                    <th className="px-4 py-3">Hạng</th>
                    <th className="px-4 py-3">Nhân sự</th>
                    <th className="px-4 py-3 text-center">Tasks Hoàn thành</th>
                    <th className="px-4 py-3 text-center">Đúng hạn</th>
                    <th className="px-4 py-3 text-right">Hiệu suất</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {summary?.performance.topPerformers.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs 
                          ${idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                            idx === 1 ? 'bg-gray-100 text-gray-700' :
                              idx === 2 ? 'bg-orange-100 text-orange-700' : 'text-gray-400'}`}>
                          {idx + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{p.name}</div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-gray-700">{p.tasksCompleted}</td>
                      <td className="px-4 py-3 text-center text-emerald-600">{p.onTimeRate.toFixed(0)}%</td>
                      <td className="px-4 py-3 text-right">
                        <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                          Xuất sắc
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
