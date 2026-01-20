# Phase 01: Backend Permission Logic
Status: ⬜ Pending
Dependencies: None

## Objective
Enhance TaskService with permission checking logic for Kanban drag-drop operations and prepare data structure for Gantt visualization.

## Requirements

### Functional
- [x] Add `canMoveTask()` permission check function
- [ ] Add `updateTaskStatus()` method with confirmation flow
- [ ] Ensure task history logging works correctly
- [ ] Prepare task data formatting for Gantt chart

### Non-Functional
- [ ] Performance: Permission check < 100ms
- [ ] Security: RLS policies enforced
- [ ] Logging: All status changes tracked

## Implementation Steps

1. [ ] **Update `task.service.ts`** - Add permission checking
   ```typescript
   canMoveTask: async (userId: string, taskId: string, projectId: string): Promise<boolean> => {
     // Check if user is assignee OR project manager OR admin
   }
   ```

2. [ ] **Add `updateTaskStatusWithConfirmation`** method
   ```typescript
   updateTaskStatusWithConfirmation: async (
     taskId: string, 
     newStatus: TaskStatus, 
     userId: string,
     notes?: string
   ): Promise<{ success: boolean, task?: Task, error?: string }>
   ```

3. [ ] **Add Gantt data formatter**
   ```typescript
   getTasksForGantt: async (projectId: string): Promise<GanttTask[]> => {
     // Format tasks for Frappe Gantt library
   }
   ```

4. [ ] **Test permission logic**
   - Test assignee can move their tasks
   - Test project manager can move all project tasks
   - Test other users are blocked

## Files to Create/Modify
- `services/task.service.ts` - Add new methods (150 lines)
- `types.ts` - Add GanttTask interface (20 lines)

## Test Criteria
- [ ] Assignee can move their own task
- [ ] Project manager can move any task in their project
- [ ] Non-member gets permission denied
- [ ] Admin can move any task
- [ ] Task history logged with correct user_id

## Notes
- Leverage existing RLS policies (already implemented)
- Use existing `notifyTaskUpdated()` for Telegram notifications
- No database migration needed

---
Next Phase: [phase-02-kanban-board.md](./phase-02-kanban-board.md)
