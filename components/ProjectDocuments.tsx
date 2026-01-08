
import React, { useState } from 'react';
import {
    Folder, File, FileText, Image, Download, MoreVertical,
    ChevronRight, Upload, Search, Share2, Grid, List as ListIcon,
    Trash2, Eye, X, FileCode
} from 'lucide-react';

interface FileItem {
    id: string;
    name: string;
    type: 'folder' | 'pdf' | 'img' | 'doc' | 'dwg' | 'rvt';
    size?: string;
    updatedAt: string;
    owner: string;
    url?: string; // Mock URL for preview
}

const MOCK_FILES: Record<string, FileItem[]> = {
    'root': [
        { id: 'f1', name: '01. Hồ sơ Pháp lý', type: 'folder', updatedAt: '2025-01-10', owner: 'Admin' },
        { id: 'f2', name: '02. Hồ sơ Thiết kế', type: 'folder', updatedAt: '2025-01-12', owner: 'Quản lý BIM' },
        { id: 'f3', name: '03. Quản lý Chất lượng', type: 'folder', updatedAt: '2025-01-15', owner: 'TNDH' },
        { id: 'f4', name: '04. Báo cáo Tiến độ', type: 'folder', updatedAt: '2025-01-20', owner: 'QLDA' },
        { id: 'd1', name: 'BEP_Execution_Plan_v1.0.pdf', type: 'pdf', size: '2.5 MB', updatedAt: '2025-01-05', owner: 'BIM Lead' },
    ],
    'f2': [
        { id: 'f21', name: 'Kiến trúc (ARC)', type: 'folder', updatedAt: '2025-01-12', owner: 'BIM Lead' },
        { id: 'f22', name: 'Kết cấu (STR)', type: 'folder', updatedAt: '2025-01-12', owner: 'BIM Lead' },
        { id: 'f23', name: 'Cơ điện (MEP)', type: 'folder', updatedAt: '2025-01-12', owner: 'BIM Lead' },
        { id: 'd21', name: 'MasterPlan_v2.dwg', type: 'dwg', size: '15.4 MB', updatedAt: '2025-01-11', owner: 'Staff ARC' },
    ]
};

const FileIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'folder': return <Folder className="text-blue-500 fill-blue-500/20" size={40} />;
        case 'pdf': return <FileText className="text-rose-500 bg-rose-50 p-1 rounded" size={40} />;
        case 'img': return <Image className="text-purple-500 bg-purple-50 p-1 rounded" size={40} />;
        case 'doc': return <FileText className="text-blue-600 bg-blue-50 p-1 rounded" size={40} />;
        case 'dwg':
        case 'rvt':
            return <div className="w-10 h-10 bg-slate-800 text-white rounded flex items-center justify-center text-[10px] font-black uppercase">{type}</div>;
        default: return <File className="text-gray-400" size={40} />;
    }
};

const FilePreviewModal = ({ file, onClose }: { file: FileItem, onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="transform scale-75"><FileIcon type={file.type} /></div>
                        <div>
                            <h3 className="font-bold text-slate-800">{file.name}</h3>
                            <p className="text-xs text-gray-500">{file.size} • {file.updatedAt}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700">
                            <Download size={14} /> Tải xuống
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-slate-100 flex items-center justify-center p-4">
                    {file.type === 'img' ? (
                        <img src="https://picsum.photos/800/600" alt="Preview" className="max-w-full max-h-full rounded shadow-lg" />
                    ) : file.type === 'pdf' ? (
                        <div className="w-full h-full bg-white shadow-lg rounded flex flex-col items-center justify-center text-gray-400">
                            <FileText size={64} className="mb-4 text-rose-500" />
                            <p>Trình xem PDF đang được tích hợp...</p>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">
                            <FileCode size={64} className="mx-auto mb-4 opacity-50" />
                            <p>Không có bản xem trước cho định dạng này</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProjectDocuments = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPath, setCurrentPath] = useState<string[]>(['root']);
    const [pathNames, setPathNames] = useState<string[]>(['Thư mục gốc']);
    const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

    const currentFolderId = currentPath[currentPath.length - 1];
    const files = MOCK_FILES[currentFolderId] || [];

    const handleNavigate = (folderId: string, folderName: string) => {
        setCurrentPath([...currentPath, folderId]);
        setPathNames([...pathNames, folderName]);
    };

    const handleNavigateUp = (idx: number) => {
        setCurrentPath(currentPath.slice(0, idx + 1));
        setPathNames(pathNames.slice(0, idx + 1));
    };

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm h-[800px] flex flex-col animate-fade-in relative z-0">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow hover:bg-blue-700 transition">
                            <Upload size={16} /> Tải lên
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition">
                            <Folder size={16} /> Thư mục mới
                        </button>
                    </div>

                    <div className="flex gap-2 items-center">
                        <div className="relative">
                            <input className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Tìm kiếm tài liệu..." />
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                        <div className="h-8 w-px bg-gray-300 mx-2"></div>
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}><Grid size={20} /></button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}><ListIcon size={20} /></button>
                    </div>
                </div>

                {/* Breadcrumb */}
                <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                    {pathNames.map((name, idx) => (
                        <React.Fragment key={idx}>
                            <span
                                className={`cursor-pointer hover:underline ${idx === pathNames.length - 1 ? 'font-bold text-slate-900' : ''}`}
                                onClick={() => handleNavigateUp(idx)}
                            >
                                {name}
                            </span>
                            {idx < pathNames.length - 1 && <ChevronRight size={14} className="text-gray-400" />}
                        </React.Fragment>
                    ))}
                </div>

                {/* File Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                    {files.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Folder size={64} className="mb-4 text-gray-300 opacity-50" />
                            <p>Thư mục trống</p>
                        </div>
                    ) : (
                        viewMode === 'grid' ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {files.map(file => (
                                    <div
                                        key={file.id}
                                        className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition-all group relative flex flex-col items-center text-center gap-3"
                                        onClick={() => file.type === 'folder' ? handleNavigate(file.id, file.name) : setPreviewFile(file)}
                                    >
                                        <FileIcon type={file.type} />
                                        <div className="w-full">
                                            <p className="text-sm font-medium text-slate-700 truncate w-full" title={file.name}>{file.name}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">{file.size || 'Item'} • {file.updatedAt}</p>
                                        </div>
                                        <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded text-gray-500">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4">Tên</th>
                                            <th className="px-6 py-4">Ngày cập nhật</th>
                                            <th className="px-6 py-4">Người tạo</th>
                                            <th className="px-6 py-4">Kích thước</th>
                                            <th className="px-6 py-4 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {files.map(file => (
                                            <tr
                                                key={file.id}
                                                className="hover:bg-blue-50/50 cursor-pointer group"
                                                onClick={() => file.type === 'folder' ? handleNavigate(file.id, file.name) : setPreviewFile(file)}
                                            >
                                                <td className="px-6 py-4 flex items-center gap-3 font-medium text-slate-700">
                                                    <div className="transform scale-75 origin-left"><FileIcon type={file.type} /></div>
                                                    {file.name}
                                                </td>
                                                <td className="px-6 py-4">{file.updatedAt}</td>
                                                <td className="px-6 py-4">{file.owner}</td>
                                                <td className="px-6 py-4 font-mono text-xs">{file.size || '-'}</td>
                                                <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 hover:bg-blue-100 text-blue-600 rounded" title="Xem trước"><Eye size={16} /></button>
                                                    <button className="p-2 hover:bg-gray-100 text-gray-600 rounded" title="Tải xuống"><Download size={16} /></button>
                                                    <button className="p-2 hover:bg-rose-100 text-rose-600 rounded" title="Xóa"><Trash2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                </div>
                {/* Footer Status */}
                <div className="p-3 bg-gray-50 text-xs text-center text-gray-500 rounded-b-2xl border-t border-gray-200">
                    Hiển thị {files.length} mục • Sử dụng 45% dung lượng
                </div>
            </div>

            {/* PREVIEW MODAL */}
            {previewFile && <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />}
        </>
    );
};

export default ProjectDocuments;
