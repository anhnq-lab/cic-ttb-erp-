import { Task, TaskStatus, TaskPriority } from '../types';
import { PROJECT_TEMPLATES } from '../constants';
import { SAMPLE_TASKS } from '../constants_data/tasks';

// In-memory store for demo, initialized with SAMPLE_TASKS
let MOCK_STORE: Record<string, Task[]> = {};
// Initialize store with sample tasks grouped by projectId
SAMPLE_TASKS.forEach(task => {
  if (!MOCK_STORE[task.projectId]) {
    MOCK_STORE[task.projectId] = [];
  }
  MOCK_STORE[task.projectId].push(task);
});

export const realtimeStore = {
  // 1. Get Tasks (Mock Only)
  getTasks: async (projectId: string): Promise<Task[]> => {
    // Return from in-memory mock store
    return MOCK_STORE[projectId] || [];
  },

  // 2. Update Task Status (Mock Only)
  updateTaskStatus: async (taskId: string, newStatus: TaskStatus) => {
    for (const pid in MOCK_STORE) {
      const tIdx = MOCK_STORE[pid].findIndex(t => t.id === taskId);
      if (tIdx > -1) {
        MOCK_STORE[pid][tIdx].status = newStatus;
        break;
      }
    }
  },

  // 2.1 Create Task (Mock Only)
  createTask: async (task: Task): Promise<Task | null> => {
    if (!MOCK_STORE[task.projectId]) MOCK_STORE[task.projectId] = [];
    MOCK_STORE[task.projectId].push(task);
    return task;
  },

  // 2.2 Update Task (Mock Only)
  updateTask: async (taskId: string, updates: Partial<Task>): Promise<void> => {
    for (const pid in MOCK_STORE) {
      const tIdx = MOCK_STORE[pid].findIndex(t => t.id === taskId);
      if (tIdx > -1) {
        MOCK_STORE[pid][tIdx] = { ...MOCK_STORE[pid][tIdx], ...updates };
        break;
      }
    }
  },

  // 2.3 Delete Task (Mock Only)
  deleteTask: async (taskId: string): Promise<void> => {
    for (const pid in MOCK_STORE) {
      MOCK_STORE[pid] = MOCK_STORE[pid].filter(t => t.id !== taskId);
    }
  },

  // 3. Subscribe (Mock Stub)
  subscribe: (projectId: string, callback: () => void) => {
    // No-op for mock
    return () => { };
  },

  // 4. Unsubscribe (Mock Stub)
  unsubscribe: async (channel: any) => {
    // No-op
  }
};
