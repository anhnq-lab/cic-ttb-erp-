
import React from 'react';
import { LayoutDashboard, Layout, FileText, Users, PieChart, Settings, Building2, BookOpen, Handshake, User, LogOut, List, Sparkles } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface MenuItem {
  icon: any;
  label: string;
  path: string;
}

const NavItem: React.FC<{ item: MenuItem }> = ({ item }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  return (
    <Link
      to={item.path}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-lg mx-2 mb-1
      ${isActive
          ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20'
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
        }`}
    >
      <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
      <span>{item.label}</span>
    </Link>
  );
};

// CIC Logo Component - Corrected (Standard CIC)
const CicLogo = () => (
  <svg width="110" height="42" viewBox="0 0 110 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <defs>
      <linearGradient id="cic-orange" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF6B00" />
        <stop offset="1" stopColor="#FF4500" />
      </linearGradient>
    </defs>

    {/* Left C */}
    <path d="M0 6C0 2.68629 2.68629 0 6 0H32C33.6569 0 35 1.34315 35 3C35 4.65685 33.6569 6 32 6H6V6H32" fill="url(#cic-orange)" />
    <path d="M0 14C0 10.6863 2.68629 8 6 8H24C25.6569 8 27 9.34315 27 11C27 12.6569 25.6569 14 24 14H6V14H24" fill="url(#cic-orange)" />
    <path d="M0 22C0 18.6863 2.68629 16 6 16H24C25.6569 16 27 17.3431 27 19C27 20.6569 25.6569 22 24 22H6V22H24" fill="url(#cic-orange)" />
    <path d="M0 30C0 26.6863 2.68629 24 6 24H32C33.6569 24 35 25.3431 35 27C35 28.6569 33.6569 30 32 30H6V30H32" fill="url(#cic-orange)" />

    {/* Middle I */}
    <path d="M40 3C40 1.34315 41.3431 0 43 0H62C63.6569 0 65 1.34315 65 3C65 4.65685 63.6569 6 62 6H43C41.3431 6 40 4.65685 40 3Z" fill="url(#cic-orange)" />
    <path d="M40 11C40 9.34315 41.3431 8 43 8H62C63.6569 8 65 9.34315 65 11C65 12.6569 63.6569 14 62 14H43C41.3431 14 40 12.6569 40 11Z" fill="url(#cic-orange)" />
    <path d="M40 19C40 17.3431 41.3431 16 43 16H62C63.6569 16 65 17.3431 65 19C65 20.6569 63.6569 22 62 22H43C41.3431 22 40 20.6569 40 19Z" fill="url(#cic-orange)" />
    <path d="M40 27C40 25.3431 41.3431 24 43 24H62C63.6569 24 65 25.3431 65 27C65 28.6569 63.6569 30 62 30H43C41.3431 30 40 28.6569 40 27Z" fill="url(#cic-orange)" />

    {/* Right C - Normal Orientation */}
    <g transform="translate(75, 0)">
      <path d="M0 6C0 2.68629 2.68629 0 6 0H32C33.6569 0 35 1.34315 35 3C35 4.65685 33.6569 6 32 6H6V6H32" fill="url(#cic-orange)" />
      <path d="M0 14C0 10.6863 2.68629 8 6 8H24C25.6569 8 27 9.34315 27 11C27 12.6569 25.6569 14 24 14H6V14H24" fill="url(#cic-orange)" />
      <path d="M0 22C0 18.6863 2.68629 16 6 16H24C25.6569 16 27 17.3431 27 19C27 20.6569 25.6569 22 24 22H6V22H24" fill="url(#cic-orange)" />
      <path d="M0 30C0 26.6863 2.68629 24 6 24H32C33.6569 24 35 25.3431 35 27C35 28.6569 33.6569 30 32 30H6V30H32" fill="url(#cic-orange)" />
    </g>

    <text x="53.5" y="40" fill="#FF6B00" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">SINCE 1990</text>
  </svg>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const { profile, signOut, user } = useAuth();

  const menuItems: MenuItem[] = [
    { icon: User, label: 'Cá nhân', path: '/my-dashboard' },
    { icon: LayoutDashboard, label: 'Tổng quan', path: '/' },
    { icon: Layout, label: 'Dự án & Sản xuất', path: '/projects' },
    { icon: PieChart, label: 'Báo cáo & Reports', path: '/reports' },
    { icon: List, label: 'Quản lý công việc', path: '/tasks' },
    { icon: FileText, label: 'Hợp đồng & Tài chính', path: '/contracts' },
    { icon: Handshake, label: 'Khách hàng & Đối tác', path: '/crm' },
    { icon: Users, label: 'Nhân sự & HRM', path: '/hr' },
    { icon: Sparkles, label: 'Kho tri thức (AI)', path: '/knowledge-base' },
    { icon: BookOpen, label: 'Quy chế Trung tâm', path: '/policy' },
  ];

  const bottomItems: MenuItem[] = [
    { icon: Settings, label: 'Cấu hình', path: '/settings' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-50">
      {/* Brand */}
      <div className="h-24 flex flex-col justify-center items-center px-6 border-b border-slate-800 bg-slate-900/50">
        <div className="mt-2 transform translate-y-1">
          <CicLogo />
        </div>
        <span className="text-blue-400 text-[10px] mt-2 tracking-widest font-bold uppercase drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">
          BIM & DIGITAL TWIN
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
        <div className="px-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Chức năng chính
        </div>
        {menuItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}

        <div className="mt-8 px-6 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Hệ thống
        </div>
        {bottomItems.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </nav>

      {/* User Profile with Logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors">
          <img
            src={profile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || user?.email || 'User')}&background=f97316&color=fff`}
            alt="User"
            className="w-10 h-10 rounded-full border-2 border-slate-700"
          />
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-medium text-white truncate">{profile?.name || user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-xs text-slate-400 truncate">{profile?.role || 'Nhân viên'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-lg transition-colors"
            title="Đăng xuất"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
