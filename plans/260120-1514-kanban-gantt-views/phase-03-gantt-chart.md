# Phase 03: Gantt Chart Component
Status: ⬜ Pending
Dependencies: Phase 01 (Backend Permission Logic)

## Objective
Build read-only Gantt chart visualization using Frappe Gantt library to display project task timeline with phase grouping and status coloring.

## Requirements

### Functional
- [ ] Display tasks as timeline bars (start_date → due_date)
- [ ] Group by phase if available
- [ ] Color-code by task status or priority
- [ ] Show today marker
- [ ] Zoom levels: Day, Week, Month
- [ ] Click task bar to open TaskDetailModal

### Non-Functional
- [ ] Performance: Render < 2s for 100 tasks
- [ ] UX: Smooth zoom transitions
- [ ] Responsive: Horizontal scroll for large datasets

## Implementation Steps

1. [ ] **Install Frappe Gantt**
   ```bash
   npm install frappe-gantt
   # or use CDN
   ```

2. [ ] **Create `GanttChart.tsx` component**
   - Props: `projectId: string`
   - Fetch tasks via `TaskService.getTasksForGantt(projectId)`
   - Initialize Frappe Gantt instance

3. [ ] **Format data for Frappe Gantt**
   ```typescript
   interface GanttTask {
     id: string;
     name: string;
     start: string; // YYYY-MM-DD
     end: string;   // YYYY-MM-DD
     progress: number; // 0-100
     dependencies: string; // comma-separated task IDs (optional)
     custom_class: string; // for color coding
   }
   ```

4. [ ] **Implement status-based coloring**
   ```css
   .gantt .bar-wrapper.status-s0 .bar { fill: #FFA500; }
   .gantt .bar-wrapper.status-s1 { fill: #4169E1; }
   .gantt .bar-wrapper.status-completed { fill: #28A745; }
   ```

5. [ ] **Add zoom controls**
   - Buttons: Day / Week / Month
   - Update Gantt view mode on click

6. [ ] **Handle task bar click**
   - Open TaskDetailModal with task details
   - Read-only mode (no drag to edit dates)

7. [ ] **Add today marker**
   - Vertical line at current date
   - Auto-scroll to today on load (optional)

## Files to Create/Modify
- `components/GanttChart.tsx` - Main Gantt component (200 lines)
- `services/task.service.ts` - Add `getTasksForGantt()` (30 lines)
- `types.ts` - Add `GanttTask` interface (10 lines)
- `index.css` - Gantt custom styles (80 lines)
- `pages/ProjectDetail.tsx` - Add Gantt view mode (30 lines modified)

## Test Criteria
- [ ] All tasks render as bars on timeline
- [ ] Timeline shows correct start/end dates
- [ ] Today marker visible and positioned correctly
- [ ] Zoom buttons switch between Day/Week/Month
- [ ] Click bar opens TaskDetailModal
- [ ] Empty state shows "Chưa có task nào" if no tasks
- [ ] Tasks grouped by phase (if phase field exists)

## Notes
- Frappe Gantt is lightweight but customization limited
- Alternative: If need more features, consider DHTMLX (but heavier)
- Phase grouping: Use Gantt "project" concept for phases
- Dependencies: Skip for MVP, add later if needed

---
Next Phase: [phase-04-integration-testing.md](./phase-04-integration-testing.md)
