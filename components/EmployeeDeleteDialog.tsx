import React from 'react';
import { X, AlertTriangle, Users, Trash2 } from 'lucide-react';
import { Employee } from '../types';

interface EmployeeDeleteDialogProps {
    employee: Employee;
    onClose: () => void;
    onConfirmDelete: () => void;
    onChangeStatus: () => void;
    projectCount?: number;
}

const EmployeeDeleteDialog: React.FC<EmployeeDeleteDialogProps> = ({
    employee,
    onClose,
    onConfirmDelete,
    onChangeStatus,
    projectCount = 0
}) => {
    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-rose-50">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <AlertTriangle className="text-rose-600" size={20} />
                        Xác nhận xóa nhân viên
                    </h3>
                    <button onClick={onClose}>
                        <X size={20} className="text-gray-400 hover:text-gray-600" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Employee Info */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div className="flex-1">
                            <p className="font-bold text-gray-800">{employee.name}</p>
                            <p className="text-xs text-gray-500">{employee.code} • {employee.role}</p>
                        </div>
                    </div>

                    {/* Warning Message */}
                    {projectCount > 0 ? (
                        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                                <Users className="text-rose-600 shrink-0 mt-0.5" size={18} />
                                <div>
                                    <p className="font-bold text-rose-800 text-sm mb-1">
                                        Nhân viên đang tham gia {projectCount} dự án
                                    </p>
                                    <p className="text-xs text-rose-600">
                                        Để xóa nhân viên này, bạn cần xóa họ khỏi tất cả dự án trước,
                                        hoặc chuyển trạng thái sang "Nghỉ việc" thay vì xóa hoàn toàn.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                                <div>
                                    <p className="font-bold text-amber-800 text-sm mb-1">
                                        Cảnh báo: Hành động không thể hoàn tác
                                    </p>
                                    <p className="text-xs text-amber-600">
                                        Dữ liệu nhân viên sẽ bị xóa vĩnh viễn khỏi hệ thống.
                                        Nếu bạn muốn giữ lại lịch sử, hãy chọn "Chuyển trạng thái Nghỉ việc".
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-5 border-t border-gray-100 flex justify-end gap-2 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Hủy bỏ
                    </button>

                    {projectCount === 0 && (
                        <>
                            <button
                                onClick={onChangeStatus}
                                className="px-4 py-2 text-sm font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
                            >
                                Chuyển "Nghỉ việc"
                            </button>
                            <button
                                onClick={onConfirmDelete}
                                className="px-4 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm flex items-center gap-2 transition-colors"
                            >
                                <Trash2 size={16} />
                                Xóa vĩnh viễn
                            </button>
                        </>
                    )}

                    {projectCount > 0 && (
                        <button
                            onClick={onChangeStatus}
                            className="px-4 py-2 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
                        >
                            Chuyển "Nghỉ việc"
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeDeleteDialog;
