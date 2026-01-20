# Phase 02: Kanban Board Component
Status: ⬜ Pending
Dependencies: Phase 01 (Backend Permission Logic)

## Objective
Build interactive Kanban board component with drag-and-drop functionality, 8 status columns, permission-aware interactions, and confirmation dialogs.

## Requirements

### Functional
- [ ] Display tasks in 8 columns (S0-S6 + COMPLETED)
- [ ] Drag-and-drop between columns (với permission check)
- [ ] Confirmation popup before status update
- [ ] Real-time updates via Supabase subscription
- [ ] Loading states and error handling

### Non-Functional
- [ ] Performance: Smooth drag animation (60fps)
- [ ] UX: Visual feedback for drag operations
- [ ] Responsive: Works on desktop (mobile optional)

## Implementation Steps

1. [ ] **Install dependencies**
   ```bash
   npm install react-beautiful-dnd @types/react-beautiful-dnd
   # or
   npm install @dnd-kit/core @dnd-kit/sortable
   ```

2. [ ] **Create `KanbanBoard.tsx` component**
   - Props: `projectId: string`
   - State: `tasks`, `isLoading`, `viewMode`
   - Layout: 8 columns in horizontal scroll container

3. [ ] **Create `KanbanColumn.tsx` component**
   - Props: `status: TaskStatus`, `tasks: Task[]`, `onDrop`
   - Droppable zone với visual feedback

4. [ ] **Create `KanbanCard.tsx` component**
   - Display: Task name, assignee avatar, priority, due date
   - Draggable handle
   - Click to open TaskDetailModal

5. [ ] **Create `TaskMoveConfirmDialog.tsx`**
   - Show: Task name, old status → new status
   - Input: Optional notes
   - Actions: Confirm / Cancel

6. [ ] **Implement drag-drop logic**
   ```typescript
   const handleDragEnd = async (result) => {
     // 1. Check permission via TaskService.canMoveTask()
     // 2. Show confirmation dialog
     // 3. Update task status via TaskService.updateTaskStatusWithConfirmation()
     // 4. Refresh UI
   }
   ```

7. [ ] **Add view mode toggle**
   - Update existing List view to include toggle buttons
   - State management for `viewMode: 'list' | 'kanban' | 'gantt'`

## Files to Create/Modify
- `components/KanbanBoard.tsx` - Main board component (250 lines)
- `components/KanbanColumn.tsx` - Column component (100 lines)
- `components/KanbanCard.tsx` - Task card (80 lines)
- `components/TaskMoveConfirmDialog.tsx` - Confirmation modal (60 lines)
- `pages/ProjectDetail.tsx` - Add Kanban view mode (50 lines modified)
- `index.css` - Kanban styles (100 lines)

## Test Criteria
- [ ] All 8 columns render correctly with tasks
- [ ] Drag-drop works smoothly with permission check
- [ ] Confirmation dialog shows before update
- [ ] Unauthorized users see error toast
- [ ] Real-time updates when another user moves a task
- [ ] COMPLETED column can be toggled to hide/show (bonus)

## Notes
- Use `react-beautiful-dnd` for smooth animations
- Color-code columns by status (Mở=blue, S0=yellow, COMPLETED=green)
- Empty columns show "Kéo task vào đây" placeholder

---
Next Phase: [phase-03-gantt-chart.md](./phase-03-gantt-chart.md)
