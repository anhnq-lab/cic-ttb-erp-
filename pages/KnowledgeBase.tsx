import React, { useState, useEffect } from 'react';
import { Search, Book, AlertTriangle, CheckCircle, Sliders, Filter, Sparkles, BrainCircuit, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import { KnowledgeService } from '../services/knowledge.service';
import { ProjectService } from '../services/project.service';
import { LessonLearned } from '../types';

const KnowledgeBase = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [allLessons, setAllLessons] = useState<LessonLearned[]>([]);
    const [lessons, setLessons] = useState<LessonLearned[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            setLoading(true);
            const data = await KnowledgeService.getLessonsLearned();
            setAllLessons(data);
            setLessons(data);
            setLoading(false);
        };
        fetchLessons();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = allLessons.filter(l =>
            l.title.toLowerCase().includes(term) ||
            l.category.toLowerCase().includes(term) ||
            l.tags.some(tag => tag.toLowerCase().includes(term))
        );
        setLessons(filtered);
    };

    const handleScanProject = async () => {
        setIsScanning(true);
        // Realistic scanning process: fetch project data and analyze
        try {
            const projects = await ProjectService.getProjects();
            const latestProject = projects[0];

            // Artificial delay for "analysis" effect
            await new Promise(resolve => setTimeout(resolve, 2000));

            // In a real app, this would be an AI call. For now, we simulate finding a lesson
            const mockNewLesson: Omit<LessonLearned, 'id'> = {
                projectId: latestProject.id,
                title: `Tối ưu hóa cốt thép dầm tầng điển hình - Dự án ${latestProject.name}`,
                category: 'Technical',
                tags: ['Rebar', 'Optimization', 'BIM'],
                content: 'Phát hiện sai sót trong việc bố trí thép tăng cường tại các vị trí cột góc do không khớp giữa bản vẽ kiến trúc và kết cấu.',
                solution: 'Triển khai kiểm tra chéo (Clash Detection) giữa bộ môn Kết cấu và Kiến trúc ngay từ giai đoạn LOD 300.',
                author: 'AI Assistant',
            };

            const saved = await KnowledgeService.createLessonLearned(mockNewLesson);
            if (saved) {
                const updated = await KnowledgeService.getLessonsLearned();
                setAllLessons(updated);
                setLessons(updated);
                alert(`Đã hoàn thành phân tích dự án ${latestProject.name}! Phát hiện và lưu 1 bài học kinh nghiệm mới.`);
            }
        } catch (error) {
            console.error('Scan error:', error);
        } finally {
            setIsScanning(false);
        }
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
                                    "Phân tích dữ liệu lịch sử cho thấy rủi ro chậm tiến độ thường xảy ra ở giai đoạn phê duyệt hồ sơ thiết kế cơ sở."
                                </div>
                                <button
                                    onClick={handleScanProject}
                                    disabled={isScanning}
                                    className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    {isScanning ? (
                                        <Loader2 size={16} className="animate-spin" />
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
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                        <p className="text-gray-500 animate-pulse">Đang tải dữ liệu tri thức...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {lessons.map((lesson) => (
                            <div key={lesson.id} className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1
                                        ${lesson.category === 'Technical' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                            lesson.category === 'Financial' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                                        <Book size={12} /> {lesson.category.toUpperCase()}
                                    </div>
                                    <span className="text-gray-400 text-xs font-mono">{lesson.id}</span>
                                </div>

                                <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                    {lesson.title}
                                </h3>

                                <p className="text-gray-500 text-sm mb-4 line-clamp-3 h-16">
                                    {lesson.content}
                                </p>

                                <div className="bg-slate-50 rounded-lg p-3 mb-4 border border-slate-100">
                                    <div className="text-xs font-bold text-slate-500 mb-1 uppercase flex items-center gap-1">
                                        <CheckCircle size={10} className="text-emerald-500" /> Hành động đề xuất
                                    </div>
                                    <p className="text-sm text-slate-700 font-medium">
                                        {lesson.solution}
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
                                    <span className="text-xs text-gray-400">{lesson.created_at ? new Date(lesson.created_at).toLocaleDateString('vi-VN') : ''}</span>
                                </div>
                            </div>
                        ))}
                        {lessons.length === 0 && !loading && (
                            <div className="col-span-full py-10 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                                <p className="text-gray-400">Không tìm thấy bài học nào phù hợp.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KnowledgeBase;
