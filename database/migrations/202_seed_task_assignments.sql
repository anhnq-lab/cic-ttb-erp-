-- ============================================
-- Migration 202: Seed Task Assignments
-- Purpose: Randomly assign employees to tasks that are currently unassigned.
-- ============================================

DO $$
DECLARE
    task_rec RECORD;
    emp_ids UUID[];
    random_emp_id UUID;
    updated_count INTEGER := 0;
BEGIN
    -- 1. Get all Active Employee IDs into an array
    SELECT ARRAY_AGG(id) INTO emp_ids
    FROM public.employees
    WHERE status = 'Active';

    -- Check if we have employees
    IF emp_ids IS NULL OR array_length(emp_ids, 1) = 0 THEN
        RAISE NOTICE '❌ No active employees found. Skipping assignment.';
        RETURN;
    END IF;

    -- 2. Loop through unassigned tasks
    FOR task_rec IN 
        SELECT id, name 
        FROM public.tasks 
        WHERE assignee_id IS NULL 
           OR assignee_id::text = '' -- handle potential empty strings if text
    LOOP
        -- Pick a random employee ID
        random_emp_id := emp_ids[floor(random() * array_length(emp_ids, 1)) + 1];

        -- Update the task
        UPDATE public.tasks
        SET 
            assignee_id = random_emp_id,
            updated_at = NOW()
        WHERE id = task_rec.id;

        updated_count := updated_count + 1;
    END LOOP;

    RAISE NOTICE '✅ Successfully assigned employees to % tasks.', updated_count;
END $$;
