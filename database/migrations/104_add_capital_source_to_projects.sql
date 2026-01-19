-- Migration 104: Add capital_source to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS capital_source TEXT DEFAULT 'NonStateBudget';
COMMENT ON COLUMN public.projects.capital_source IS 'Nguồn vốn: StateBudget (Ngân sách), NonStateBudget (Ngoài ngân sách)';
