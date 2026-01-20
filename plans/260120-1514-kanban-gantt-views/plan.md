# Plan: Kanban Board & Gantt Chart Views
Created: 2026-01-20 15:14
Status: 🟡 Planning

## Overview
Implement Kanban board and Gantt chart visualization modes for task management, allowing users to switch between List/Kanban/Gantt views for project tasks.

## Tech Stack
- **Frontend**: React + TypeScript, React DnD (drag-drop), Frappe Gantt
- **Backend**: Existing TaskService + new permission checks
- **Database**: Supabase (no new tables required)

## Design Decisions

### Kanban Board
- **8 columns**: S0 → S6 + COMPLETED (có cột riêng để review)
- **Drag-drop**: Chỉ Assignee hoặc Project Manager
- **Confirmation**: Popup confirm trước khi thay đổi status
- **Logging**: Tự động log vào `task_history`
- **Notification**: Telegram notification cho người liên quan

### Gantt Chart
- **Read-only**: Chỉ xem timeline, không edit trực tiếp
- **Library**: Frappe Gantt (lightweight, đẹp, dễ customize)
- **Grouping**: Theo phase nếu có
- **Features**: Zoom timeline, today marker, color theo status

## Phases

| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 01 | Backend Permission Logic | ⬜ Pending | 0% |
| 02 | Kanban Board Component | ⬜ Pending | 0% |
| 03 | Gantt Chart Component | ⬜ Pending | 0% |
| 04 | Integration & Testing | ⬜ Pending | 0% |

## Quick Commands
- Start Phase 1: `/code phase-01`
- Check progress: `/next`
- Save context: `/save-brain`

## Estimated Timeline
- Total: ~4 sessions (1 phase / session)
- Complexity: Medium (leveraging existing infrastructure)
