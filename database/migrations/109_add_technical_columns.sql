-- Migration 109: Add missing technical columns to projects table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='construction_type') THEN
        ALTER TABLE public.projects ADD COLUMN construction_type TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='construction_level') THEN
        ALTER TABLE public.projects ADD COLUMN construction_level TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='scale') THEN
        ALTER TABLE public.projects ADD COLUMN scale TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='project_group') THEN
        ALTER TABLE public.projects ADD COLUMN project_group TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='scope') THEN
        ALTER TABLE public.projects ADD COLUMN scope TEXT;
    END IF;
END $$;
