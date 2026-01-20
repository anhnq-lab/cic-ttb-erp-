# Phase 04: Integration & Testing
Status: ⬜ Pending
Dependencies: Phase 01, 02, 03

## Objective
Integrate all view modes (List/Kanban/Gantt) into ProjectDetail page, ensure seamless switching, test all functionality, and verify performance.

## Requirements

### Functional
- [ ] View mode toggle works correctly
- [ ] Data syncs across all views
- [ ] Real-time updates propagate to active view
- [ ] Permission checks work in all scenarios
- [ ] Error handling for all edge cases

### Non-Functional
- [ ] Performance: View switch < 500ms
- [ ] UX: Smooth transitions between views
- [ ] Accessibility: Keyboard navigation support

## Implementation Steps

1. [ ] **Update `ProjectDetail.tsx` layout**
   ```tsx
   const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'gantt'>('list');
   
   // View toggle buttons (Danh sách | Kanban | Gantt)
   // Render appropriate component based on viewMode
   ```

2. [ ] **Implement view mode persistence**
   - Save to localStorage: `lastViewMode_${projectId}`
   - Restore on page load

3. [ ] **Add real-time sync**
   ```typescript
   useEffect(() => {
     const channel = TaskService.subscribeToTasks(projectId, (payload) => {
       // Refresh current view on task changes
       if (viewMode === 'kanban') refreshKanban();
       if (viewMode === 'gantt') refreshGantt();
       if (viewMode === 'list') refreshList();
     });
     return () => TaskService.unsubscribe(channel);
   }, [projectId, viewMode]);
   ```

4. [ ] **Test all user flows**
   - See test scenarios below

5. [ ] **Performance optimization**
   - Lazy load Gantt library (code splitting)
   - Memoize heavy computations
   - Debounce real-time updates

6. [ ] **Error handling**
   - Network errors: Show retry button
   - Permission errors: Clear toast messages
   - Loading states: Skeleton loaders

7. [ ] **Responsive design check**
   - Desktop: Full features
   - Tablet: Kanban horizontal scroll
   - Mobile: Force List view (optional)

## Test Scenarios

### Kanban Board
- [ ] **Happy path**: Assignee drags their task S0 → S1
  - Expected: Confirmation dialog → Task moves → Telegram notification
  
- [ ] **Permission denied**: Non-member tries to drag task
  - Expected: Error toast "Không có quyền"
  
- [ ] **Concurrent update**: User A drags while User B drags same task
  - Expected: Last write wins, both see real-time update

### Gantt Chart
- [ ] **Render**: 50+ tasks in project
  - Expected: All tasks visible, timeline correct
  
- [ ] **Zoom**: Switch Day → Week → Month
  - Expected: Smooth transition, today marker adjusts
  
- [ ] **Click**: Click task bar
  - Expected: TaskDetailModal opens

### View Switching
- [ ] **List → Kanban**: Switch while tasks loading
  - Expected: Loading state shows, then data renders
  
- [ ] **Kanban → Gantt**: After moving a task
  - Expected: Gantt reflects new status/dates immediately

## Files to Create/Modify
- `pages/ProjectDetail.tsx` - View mode integration (100 lines modified)
- `components/ViewModeToggle.tsx` - Toggle buttons component (40 lines)
- `utils/viewPersistence.ts` - localStorage helper (30 lines)

## Test Criteria
- [ ] All 3 view modes render correctly
- [ ] Toggle buttons highlight active view
- [ ] Real-time updates work in all views
- [ ] Permission checks enforced in Kanban
- [ ] Gantt is read-only (no accidental edits)
- [ ] Performance: No lag with 100 tasks
- [ ] Mobile: Graceful degradation

## Notes
- Code splitting: `const GanttChart = lazy(() => import('./GanttChart'))`
- Consider adding "Beta" badge on Gantt initially
- Future: Add export to PDF for Gantt chart

---
**PLAN COMPLETE! Ready to start Phase 01.**
