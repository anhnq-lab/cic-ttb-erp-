-- Add new columns to tasks table for RACI integration
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS "phase" text; -- e.g., "1. Xúc tiến & Chuẩn bị"
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS "raci_role" text; -- e.g., "R", "A", "C", "I"
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS "order_index" integer DEFAULT 0; -- For sorting

-- Optional: Create index for faster querying by project and phase
CREATE INDEX IF NOT EXISTS idx_tasks_project_phase ON tasks("projectId", "phase");
