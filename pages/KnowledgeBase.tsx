import React, { useState } from 'react';
import { Search, Book, AlertTriangle, CheckCircle, Sliders, Filter, Sparkles, BrainCircuit } from 'lucide-react';
import Header from '../components/Header';
import { LESSONS_LEARNED } from '../constants';

const KnowledgeBase = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [lessons, setLessons] = useState(LESSONS_LEARNED);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = LESSONS_LEARNED.filter(l =>
            l.summary.toLowerCase().includes(term) ||
            l.project.toLowerCase().includes(term) ||
            l.tags.some(tag => tag.toLowerCase().includes(term))
        );
        setLessons(filtered);
    };

    const handleScanProject = () => {
        setIsScanning(true);
        // Mock scanning process
        setTimeout(() => {
            setIsScanning(false);
            alert('Đã quét xong dự án P-007! Phát hiện 2 bài học mới.');
            // Ideally we would add to state here, but for mock we just alert
        }, 2000);
    };

    return (
        <div className="flex-1 bg-gray-50 min-h-screen">
            <Header title="Kho Tri Thức (Digital Brain)" breadcrumb="Trang chủ / Knowledge Base" />

            <div className="p-6 w-full mx-auto space-y-6">

                {/* Hero Section */}
                <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="space-y-4 max-w-2xl">
                            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                                <BrainCircuit className="text-indigo-400" />
                                Central Intelligence Center
                            </h2>
                            <p className="text-indigo-100 text-lg">
                                Hệ thống tự động thu thập và phân tích bài học kinh nghiệm từ toàn bộ vòng đời dự án.
                                Giúp giảm thiểu rủi ro lặp lại và tối ưu hóa quy trình.
                            </p>
                            <div className="flex gap-4 pt-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs font-bold">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-sm text-indigo-300 flex items-center">
                                    +12 Chuyên gia đang đóng góp
                                </span>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-full md:w-80">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Sparkles size={16} className="text-amber-400" />
                                AI Insights
                            </h3>
                            <div className="space-y-3">
                                <div className="text-sm text-indigo-100 bg-black/20 p-3 rounded-lg">
                                    "Dự án P-007 có rủi ro cốt thép tương tự P-001. Cần review kỹ Shopdrawing khu vực Zone 3."
                                </div>
                                <button
                                    onClick={handleScanProject}
                                    disabled={isScanning}
                                    className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    {isScanning ? (
                                        <>Loading...</>
                                    ) : (
                                        <>Quét Dự án Mới</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài học, dự án, từ khóa..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 text-sm font-medium">
                            <Filter size={16} /> Lọc theo Dự án
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 text-sm font-medium">
                            <Sliders size={16} /> Mức độ nghiêm trọng
                        </button>
                    </div>
                </div>

                {/* Lessons Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lessons.map((lesson) => (
                        <div key={lesson.id} className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1
                                    ${lesson.severity === 'High' ? 'bg-red-50 text-red-600 border border-red-100' :
                                        lesson.severity === 'Medium' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                            'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                    <AlertTriangle size={12} /> {lesson.severity.toUpperCase()}
                                </div>
                                <span className="text-gray-400 text-xs font-mono">{lesson.id}</span>
                            </div>

                            <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                {lesson.summary}
                            </h3>

                            <p className="text-gray-500 text-sm mb-4 line-clamp-3 h-16">
                                {lesson.detail}
                            </p>

                            <div className="bg-slate-50 rounded-lg p-3 mb-4 border border-slate-100">
                                <div className="text-xs font-bold text-slate-500 mb-1 uppercase flex items-center gap-1">
                                    <CheckCircle size={10} className="text-emerald-500" /> Hành động đề xuất
                                </div>
                                <p className="text-sm text-slate-700 font-medium">
                                    {lesson.action}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {lesson.tags.map(tag => (
                                    <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                                        {lesson.author.charAt(0)}
                                    </div>
                                    <span className="text-xs text-gray-500 truncate max-w-[100px]">{lesson.author}</span>
                                </div>
                                <span className="text-xs text-gray-400">{lesson.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default KnowledgeBase;
