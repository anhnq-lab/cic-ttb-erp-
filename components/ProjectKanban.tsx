
import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Map sequence of statuses for movement
const STATUS_SEQUENCE = [
    TaskStatus.OPEN,
    TaskStatus.S0,
    TaskStatus.S1,
    TaskStatus.S2,
    TaskStatus.S3,
    TaskStatus.S4,
    TaskStatus.S5,
    TaskStatus.S6,
    TaskStatus.COMPLETED
];

interface DraggableCardProps {
    task: Task;
    onMove: (id: string, newStatus: TaskStatus) => void;
    onEdit: (task: Task) => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ task, onMove, onEdit }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const currentStatusIdx = STATUS_SEQUENCE.indexOf(task.status);
    const prevStatus = currentStatusIdx > 0 ? STATUS_SEQUENCE[currentStatusIdx - 1] : null;
    const nextStatus = currentStatusIdx < STATUS_SEQUENCE.length - 1 ? STATUS_SEQUENCE[currentStatusIdx + 1] : null;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onEdit(task)}
            className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group relative hover:border-orange-300"
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                    {task.code}
                </span>
                {task.priority === TaskPriority.HIGH && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                )}
            </div>
            <h4 className="text-sm font-semibold text-slate-800 mb-2 leading-tight group-hover:text-orange-600 transition-colors">
                {task.name}
            </h4>

            <div className="flex flex-wrap gap-1 mb-3">
                {task.tags?.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <div className="flex items-center gap-1.5" title={task.assignee?.name}>
                    {task.assignee?.avatar && <img src={task.assignee.avatar} alt="" className="w-5 h-5 rounded-full border border-gray-200" />}
                    <span className="text-xs text-gray-500 font-medium truncate max-w-[80px]">{task.assignee?.name || 'Unassigned'}</span>
                </div>

                {/* INTERACTIVE CONTROLS - Fallback buttons */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bottom-2 bg-white pl-2">
                    {prevStatus && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onMove(task.id, prevStatus); }}
                            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600" title="Quay lại bước trước"
                        >
                            <ArrowLeftCircle size={16} />
                        </button>
                    )}
                    {nextStatus && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onMove(task.id, nextStatus); }}
                            className="p-1 hover:bg-emerald-50 rounded text-emerald-500 hover:text-emerald-700" title="Chuyển bước tiếp theo"
                        >
                            <ArrowRightCircle size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

interface DroppableColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    count: number;
    onMove: (id: string, s: TaskStatus) => void;
    onEdit: (task: Task) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ title, status, tasks = [], count, onMove, onEdit }) => {
    const taskIds = tasks.map(t => t.id);

    return (
        <div className="flex-1 min-w-[200px] flex flex-col h-full bg-gray-50/50 rounded-xl border border-gray-200/60 transition-all duration-300">
            <div className="p-2 flex items-center justify-between border-b border-gray-100 bg-gray-50 rounded-t-xl">
                <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full 
                        ${status.includes('S0') ? 'bg-blue-500' :
                            status.includes('S6') ? 'bg-emerald-500' :
                                status.includes('S4') ? 'bg-amber-500' : 'bg-slate-400'}`}>
                    </div>
                    <h3 className="text-[10px] uppercase font-bold text-slate-700 tracking-wide truncate max-w-[120px]" title={title}>{title}</h3>
                </div>
                <span className="text-[10px] font-bold text-gray-400 bg-white px-1.5 py-0.5 rounded-full border border-gray-200 shadow-sm">{count}</span>
            </div>
            <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                <div className="flex-1 p-1.5 overflow-y-auto custom-scrollbar space-y-2 min-h-[100px]">
                    {tasks && tasks.length > 0 ? (
                        tasks.map(task => <DraggableCard key={task.id} task={task} onMove={onMove} onEdit={onEdit} />)
                    ) : (
                        <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-[10px] text-gray-400">
                            Kéo thả task vào đây
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
};

interface ProjectKanbanProps {
    tasks: Task[];
    onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
    onEditTask: (task: Task) => void;
}

const ProjectKanban: React.FC<ProjectKanbanProps> = ({ tasks, onMoveTask, onEditTask }) => {
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Prevent accidental drags
            },
        })
    );

    const tasksByStatus: Record<string, Task[]> = {
        [TaskStatus.OPEN]: tasks.filter(t => t.status === TaskStatus.OPEN),
        [TaskStatus.S0]: tasks.filter(t => t.status === TaskStatus.S0),
        [TaskStatus.S1]: tasks.filter(t => t.status === TaskStatus.S1),
        [TaskStatus.S2]: tasks.filter(t => t.status === TaskStatus.S2),
        [TaskStatus.S3]: tasks.filter(t => t.status === TaskStatus.S3),
        [TaskStatus.S4]: tasks.filter(t => t.status === TaskStatus.S4),
        [TaskStatus.S5]: tasks.filter(t => t.status === TaskStatus.S5),
        [TaskStatus.S6]: tasks.filter(t => t.status === TaskStatus.S6),
        [TaskStatus.COMPLETED]: tasks.filter(t => t.status === TaskStatus.COMPLETED),
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks.find(t => t.id === active.id);
        setActiveTask(task || null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        // Determine which column was dropped on
        const overId = over.id as string;
        let targetStatus: TaskStatus | null = null;

        // Check if dropped on a column (status) or another task
        Object.entries(tasksByStatus).forEach(([status, columnTasks]) => {
            if (columnTasks.some(t => t.id === overId)) {
                targetStatus = status as TaskStatus;
            }
        });

        // If no target status found, check if overId itself is a status
        if (!targetStatus && Object.values(TaskStatus).includes(overId as TaskStatus)) {
            targetStatus = overId as TaskStatus;
        }

        // Find the task being dragged
        const draggedTask = tasks.find(t => t.id === active.id);
        if (!draggedTask) return;

        // If we found a target status and it's different from current, move the task
        if (targetStatus && draggedTask.status !== targetStatus) {
            onMoveTask(active.id as string, targetStatus);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-2 pb-2 h-[calc(100vh-400px)] min-h-[500px] w-full overflow-x-auto custom-scrollbar">
                <DroppableColumn title="Chưa thực hiện" status={TaskStatus.OPEN} tasks={tasksByStatus[TaskStatus.OPEN]} count={tasksByStatus[TaskStatus.OPEN]?.length || 0} onMove={onMoveTask} onEdit={onEditTask} />
                <DroppableColumn title="S0 - Đang triển khai" status={TaskStatus.S0} tasks={tasksByStatus[TaskStatus.S0]} count={tasksByStatus[TaskStatus.S0]?.length || 0} onMove={onMoveTask} onEdit={onEditTask} />
                <DroppableColumn title="S1 - Phối hợp bộ môn" status={TaskStatus.S1} tasks={tasksByStatus[TaskStatus.S1]} count={tasksByStatus[TaskStatus.S1]?.length || 0} onMove={onMoveTask} onEdit={onEditTask} />
                <DroppableColumn title="S2 - Kiểm tra chéo" status={TaskStatus.S2} tasks={tasksByStatus[TaskStatus.S2]} count={tasksByStatus[TaskStatus.S2]?.length || 0} onMove={onMoveTask} onEdit={onEditTask} />
                <DroppableColumn title="S3 - Kiểm tra nội bộ" status={TaskStatus.S3} tasks={tasksByStatus[TaskStatus.S3]} count={tasksByStatus[TaskStatus.S3]?.length || 0} onMove={onMoveTask} onEdit={onEditTask} />
                <DroppableColumn title="S4 - Lãnh đạo duyệt" status={TaskStatus.S4} tasks={tasksByStatus[TaskStatus.S4]} count={tasksByStatus[TaskStatus.S4]?.length || 0} onMove={onMoveTask} onEdit={onEditTask} />
                <DroppableColumn title="S5 - Đã duyệt (Chờ trình)" status={TaskStatus.S5} tasks={tasksByStatus[TaskStatus.S5]} count={tasksByStatus[TaskStatus.S5]?.length || 0} onMove={onMoveTask} onEdit={onEditTask} />
                <DroppableColumn title="S6 - Trình khách hàng" status={TaskStatus.S6} tasks={tasksByStatus[TaskStatus.S6]} count={tasksByStatus[TaskStatus.S6]?.length || 0} onMove={onMoveTask} onEdit={onEditTask} />
                <DroppableColumn title="Hoàn thành" status={TaskStatus.COMPLETED} tasks={tasksByStatus[TaskStatus.COMPLETED]} count={tasksByStatus[TaskStatus.COMPLETED]?.length || 0} onMove={onMoveTask} onEdit={onEditTask} />
            </div>

            <DragOverlay>
                {activeTask ? (
                    <div className="bg-white p-3 rounded-lg border-2 border-orange-400 shadow-xl rotate-3 opacity-90">
                        <div className="text-sm font-semibold text-slate-800">{activeTask.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{activeTask.code}</div>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default ProjectKanban;
