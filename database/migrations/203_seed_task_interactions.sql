-- ============================================
-- Migration 203: Seed Task Interactions
-- Purpose: Add random comments and history to tasks to demonstrate backend completeness.
-- ============================================

DO $$
DECLARE
    task_rec RECORD;
    emp_ids UUID[];
    random_emp_id UUID;
    comment_texts TEXT[] := ARRAY[
        'Đã nhận thông tin, sẽ xử lý sớm.',
        'Cần thêm thông tin về yêu cầu này.',
        'Tiến độ đang tốt, dự kiến xong trước deadline.',
        'Đã cập nhật tài liệu liên quan.',
        'Vui lòng kiểm tra lại file đính kèm.',
        'Task này có vẻ phức tạp hơn dự kiến.',
        'Đã trao đổi với khách hàng về vấn đề này.',
        'Xin phép dời deadline thêm 1 ngày.'
    ];
    random_comment TEXT;
BEGIN
    -- 1. Get Employees
    SELECT ARRAY_AGG(id) INTO emp_ids FROM public.employees WHERE status = 'Active';

    -- 2. Add Comments to random tasks
    FOR task_rec IN SELECT id, assignee_id FROM public.tasks ORDER BY random() LIMIT 20
    LOOP
        -- Use assignee or random employee
        random_emp_id := COALESCE(task_rec.assignee_id, emp_ids[floor(random() * array_length(emp_ids, 1)) + 1]);
        random_comment := comment_texts[floor(random() * array_length(comment_texts, 1)) + 1];

        INSERT INTO public.task_comments (task_id, employee_id, content, created_at)
        VALUES (
            task_rec.id,
            random_emp_id,
            random_comment,
            NOW() - (random() * interval '5 days')
        );
    END LOOP;

    RAISE NOTICE '✅ Seeded random comments.';

END $$;
