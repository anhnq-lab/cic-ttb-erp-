import React, { useEffect, useRef, useState } from 'react';
import TaskService from '../services/task.service';

interface GanttChartProps {
    projectId: string;
    onTaskClick?: (taskId: string) => void;
}

// Frappe Gantt types (will be loaded from CDN)
declare global {
    interface Window {
        Gantt: any;
    }
}

/**
 * GanttChart - Timeline visualization of project tasks
 * Uses Frappe Gantt library (loaded via CDN)
 */
export const GanttChart: React.FC<GanttChartProps> = ({ projectId, onTaskClick }) => {
    const ganttContainerRef = useRef<HTMLDivElement>(null);
    const ganttInstance = useRef<any>(null);
    const [viewMode, setViewMode] = useState<'Day' | 'Week' | 'Month'>('Week');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load Frappe Gantt library on mount
    useEffect(() => {
        loadFrappeGantt();
    }, []);

    // Load tasks and render Gantt when projectId or viewMode changes
    useEffect(() => {
        if (window.Gantt && projectId) {
            loadTasksAndRender();
        }
    }, [projectId, viewMode]);

    const loadFrappeGantt = () => {
        // Check if already loaded
        if (window.Gantt) {
            setIsLoading(false);
            return;
        }

        // Load CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdn.jsdelivr.net/npm/frappe-gantt@0.6.1/dist/frappe-gantt.css';
        document.head.appendChild(cssLink);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/frappe-gantt@0.6.1/dist/frappe-gantt.umd.js';
        script.async = true;
        script.onload = () => {
            console.log('✅ Frappe Gantt loaded');
            setIsLoading(false);
        };
        script.onerror = () => {
            console.error('❌ Failed to load Frappe Gantt');
            setError('Không thể tải Gantt library');
            setIsLoading(false);
        };
        document.body.appendChild(script);
    };

    const loadTasksAndRender = async () => {
        if (!ganttContainerRef.current) return;

        try {
            setIsLoading(true);
            setError(null);

            const tasks = await TaskService.getTasksForGantt(projectId);

            if (tasks.length === 0) {
                setError('Chưa có task nào trong dự án này');
                setIsLoading(false);
                return;
            }

            // Destroy existing instance
            if (ganttInstance.current) {
                ganttInstance.current = null;
            }

            // Clear container
            ganttContainerRef.current.innerHTML = '';

            // Create new Gantt instance
            ganttInstance.current = new window.Gantt(ganttContainerRef.current, tasks, {
                view_mode: viewMode,
                date_format: 'DD/MM/YYYY',
                custom_popup_html: (task: any) => {
                    return `
            <div class="gantt-popup">
              <h4>${task.name}</h4>
              <p><strong>Tiến độ:</strong> ${task.progress}%</p>
              <p><strong>Bắt đầu:</strong> ${new Date(task._start).toLocaleDateString('vi-VN')}</p>
              <p><strong>Kết thúc:</strong> ${new Date(task._end).toLocaleDateString('vi-VN')}</p>
            </div>
          `;
                },
                on_click: (task: any) => {
                    if (onTaskClick) {
                        onTaskClick(task.id);
                    }
                },
                on_date_change: () => {
                    // Read-only: prevent date changes
                    alert('⚠️ Gantt chart chỉ để xem. Không thể thay đổi ngày trực tiếp.');
                    loadTasksAndRender(); // Reload to reset
                }
            });

            setIsLoading(false);
        } catch (err) {
            console.error('Error loading Gantt tasks:', err);
            setError('Lỗi tải dữ liệu Gantt');
            setIsLoading(false);
        }
    };

    const handleViewModeChange = (mode: 'Day' | 'Week' | 'Month') => {
        setViewMode(mode);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Đang tải Gantt chart...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="mb-4">{error}</div>
                <button
                    onClick={loadTasksAndRender}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="gantt-chart-container">
            {/* Zoom Controls */}
            <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-gray-600 mr-2">Zoom:</span>
                {(['Day', 'Week', 'Month'] as const).map(mode => (
                    <button
                        key={mode}
                        onClick={() => handleViewModeChange(mode)}
                        className={`
              px-3 py-1 text-sm rounded-md transition-colors
              ${viewMode === mode
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
            `}
                    >
                        {mode === 'Day' ? 'Ngày' : mode === 'Week' ? 'Tuần' : 'Tháng'}
                    </button>
                ))}
            </div>

            {/* Gantt Chart Container */}
            <div className="gantt-wrapper bg-white rounded-lg shadow-sm border border-gray-200 p-4 overflow-x-auto">
                <div ref={ganttContainerRef} />
            </div>

            {/* Note */}
            <div className="mt-3 text-xs text-gray-500 italic">
                💡 Click vào task để xem chi tiết. Gantt chart này chỉ để xem, không thể kéo thả.
            </div>
        </div>
    );
};
