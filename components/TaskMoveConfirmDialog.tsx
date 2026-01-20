import React, { useState } from 'react';

interface TaskMoveConfirmDialogProps {
    isOpen: boolean;
    taskName: string;
    oldStatus: string;
    newStatus: string;
    onConfirm: (notes?: string) => void;
    onCancel: () => void;
}

/**
 * TaskMoveConfirmDialog - Confirmation popup before changing task status
 * Shows old → new status and allows optional notes
 */
export const TaskMoveConfirmDialog: React.FC<TaskMoveConfirmDialogProps> = ({
    isOpen,
    taskName,
    oldStatus,
    newStatus,
    onConfirm,
    onCancel
}) => {
    const [notes, setNotes] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(notes || undefined);
        setNotes(''); // Reset for next use
    };

    const handleCancel = () => {
        setNotes(''); // Reset for next use
        onCancel();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={handleCancel}
            />

            {/* Dialog */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                    {/* Header */}
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Xác nhận thay đổi trạng thái</h3>
                    </div>

                    {/* Content */}
                    <div className="mb-6 space-y-3">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Task:</p>
                            <p className="font-medium text-gray-900">{taskName}</p>
                        </div>

                        <div className="flex items-center gap-2 bg-blue-50 p-3 rounded-lg">
                            <span className="text-sm text-gray-700">{oldStatus}</span>
                            <span className="text-blue-600">→</span>
                            <span className="text-sm font-semibold text-blue-700">{newStatus}</span>
                        </div>

                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">Ghi chú (tùy chọn):</label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Nhập ghi chú nếu cần..."
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
