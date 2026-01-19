-- Migration 117: Auto Generate Tasks Trigger
-- Automatically generates project tasks from task_templates when a new project is created

-- 1. Create Function to Generate Tasks
CREATE OR REPLACE FUNCTION public.fn_generate_project_tasks()
RETURNS TRIGGER AS $$
DECLARE
    template RECORD;
    project_start_date TIMESTAMP;
    target_capital_source TEXT;
BEGIN
    -- Determine Capital Source (map from project data if needed, or use direct value)
    -- Assuming projects table has a capital_source column or we check is_state_budget boolean?
    -- Creating a robust check assuming 'capital_source' column exists as textual 'StateBudget'/'NonStateBudget'
    -- If not, we map from other fields. Assuming 'capital_source' enum/text based on previous context.
    
    target_capital_source := NEW.capital_source;
    project_start_date := COALESCE(NEW.start_date, NEW.created_at, NOW());

    -- Log for debugging
    RAISE NOTICE 'Generating tasks for Project % (%), Source: %', NEW.code, NEW.id, target_capital_source;

    -- Loop through templates matching the capital source
    FOR template IN 
        SELECT * FROM public.task_templates 
        WHERE capital_source = target_capital_source
    LOOP
        INSERT INTO public.tasks (
            project_id,
            name,
            code,
            phase,
            description,
            status,
            priority,
            due_date,
            created_at,
            updated_at
        ) VALUES (
            NEW.id,
            template.name,
            template.code,
            template.phase,
            template.description,
            'Open', -- Default status
            'Medium', -- Default Priority
            project_start_date + (template.offset_days || ' days')::INTERVAL + (template.duration_days || ' days')::INTERVAL,
            NOW(),
            NOW()
        );
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create Trigger
DROP TRIGGER IF EXISTS tr_generate_project_tasks ON public.projects;

CREATE TRIGGER tr_generate_project_tasks
AFTER INSERT ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.fn_generate_project_tasks();

-- 3. Add comment
COMMENT ON TRIGGER tr_generate_project_tasks ON public.projects IS 'Automatically generates tasks from task_templates upon project creation';
