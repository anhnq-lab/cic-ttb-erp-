
import React from 'react';
import { Task } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { Gantt } from 'gantt-task-react';
import { Task as AppTask, TaskStatus } from '../types';

interface ProjectGanttProps {
    tasks: AppTask[];
}

const ProjectGantt: React.FC<ProjectGanttProps> = ({ tasks }) => {
    if (!tasks || tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <p className="text-gray-400 font-medium">Chưa có dữ liệu tiến độ</p>
                <button className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 shadow-sm">
                    Tạo tiến độ mẫu
                </button>
            </div>
        );
    }

    // Convert AppTask to GanttTask
    const ganttTasks: Task[] = tasks.map(t => ({
        start: new Date(t.startDate || new Date()),
        end: new Date(t.dueDate || new Date()),
        name: t.name,
        id: t.id,
        type: 'task',
        progress: t.progress,
        isDisabled: false,
        styles: { progressColor: '#f97316', progressSelectedColor: '#ea580c' },
    }));

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">Biểu đồ Gantt</h3>
            <div className="overflow-x-auto">
                <div style={{ minWidth: '800px' }}>
                    <Gantt
                        tasks={ganttTasks}
                        viewMode={'Day'} // Type assertion might be needed if strict
                        locale="vi"
                        listCellWidth="155px"
                        columnWidth={60}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectGantt;
