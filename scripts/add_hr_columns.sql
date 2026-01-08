
-- Add new columns for Employee HR Data
-- Run this in Supabase SQL Editor

ALTER TABLE employees ADD COLUMN IF NOT EXISTS dob TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS degree TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS certificates TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS "graduationYear" TEXT;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS "profileUrl" TEXT;
