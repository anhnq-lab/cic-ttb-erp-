ALTER TABLE contracts ADD COLUMN IF NOT EXISTS transactions JSONB DEFAULT '[]'::jsonb;
