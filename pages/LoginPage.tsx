/**
 * Login Page Component
 * Beautiful, modern login UI for CIC ERP
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn, UserPlus, Building2 } from 'lucide-react';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { signIn, signUp, loading } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Load saved credentials on mount
    React.useEffect(() => {
        const savedEmail = localStorage.getItem('remember_email');
        const savedPassword = localStorage.getItem('remember_password');
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleAutoFill = () => {
        setEmail('admin@cic.com.vn');
        setPassword('admin123');
        setMessage('Đã điền thông tin tài khoản Admin mẫu.');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (isLogin) {
            const { error: authError } = await signIn(email, password);
            if (authError) {
                setError(authError.message);
            } else {
                // Save credentials if rememberMe is checked
                if (rememberMe) {
                    localStorage.setItem('remember_email', email);
                    localStorage.setItem('remember_password', password);
                } else {
                    localStorage.removeItem('remember_email');
                    localStorage.removeItem('remember_password');
                }
                navigate('/');
            }
        } else {
            if (!name.trim()) {
                setError('Vui lòng nhập họ tên');
                return;
            }
            const { error: authError } = await signUp(email, password, name);
            if (authError) {
                setError(authError.message);
            } else {
                setMessage('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-5"></div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg mb-4">
                        <Building2 size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">CIC TTB ERP</h1>
                    <p className="text-gray-400 font-medium">Hệ thống Quản trị số</p>
                </div>

                {/* Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
                    {/* Toggle */}
                    <div className="flex bg-white/10 rounded-lg p-1 mb-6">
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${isLogin
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            <LogIn size={16} className="inline mr-2" />
                            Đăng nhập
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${!isLogin
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            <UserPlus size={16} className="inline mr-2" />
                            Đăng ký
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name (Only for signup) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Họ và tên
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Nguyễn Văn A"
                                        className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                    />
                                    <UserPlus size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    required
                                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                />
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                />
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Quick Fill */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-orange-500 focus:ring-orange-500/50"
                                />
                                <span className="text-gray-400 group-hover:text-white transition-colors">
                                    Ghi nhớ mật khẩu
                                </span>
                            </label>
                            <button
                                type="button"
                                onClick={handleAutoFill}
                                className="bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 px-3 py-1 rounded-full font-bold text-xs transition-all border border-orange-500/20 hover:border-orange-500/40"
                            >
                                ⚡ Tự động điền (Admin)
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-rose-500/20 border border-rose-500/50 rounded-lg p-3 text-rose-300 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {message && (
                            <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-3 text-emerald-300 text-sm">
                                {message}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : isLogin ? (
                                <>
                                    <LogIn size={20} />
                                    Đăng nhập
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} />
                                    Đăng ký
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-transparent text-gray-400">hoặc</span>
                        </div>
                    </div>

                    {/* Demo Login Removed for Production */
                    /* Uncomment if needed for testing
                    <button
                        type="button"
                        onClick={() => {
                            localStorage.setItem('demo_user', JSON.stringify({
                                id: 'demo-user-001',
                                email: 'demo@cic.vn',
                                name: 'Nguyễn Văn Demo',
                                role: 'BIM Manager',
                                department: 'Phòng BIM'
                            }));
                            navigate('/');
                            window.location.reload();
                        }}
                        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
                    >
                        🎭 Vào chế độ Demo
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-2">
                        Không cần tài khoản, dữ liệu mẫu
                    </p>
                    */}
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    © 2024 CIC - Trung tâm Tư vấn & Xây dựng Chuyển đổi số
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
