-- ============================================
-- Seed Data: Payment Milestones and Transactions
-- Purpose: Tạo dữ liệu mẫu cho các đợt thanh toán và lịch sử giao dịch
-- ============================================

-- ========== 1. Lấy Contract IDs để insert milestones ==========
-- Giả sử có contract với code '02/BIM-CICHD2025'
-- Bạn cần thay đổi contract_id phù hợp với database của bạn

-- ========== 2. INSERT Payment Milestones (Các đợt thanh toán) ==========
DO $$
DECLARE
    v_contract_id TEXT;
    v_total_value BIGINT;
    v_milestone_1_id TEXT;
    v_milestone_2_id TEXT;
    v_milestone_3_id TEXT;
    v_milestone_4_id TEXT;
BEGIN
    -- Lấy contract_id từ code (thay đổi code phù hợp)
    SELECT id, total_value INTO v_contract_id, v_total_value
    FROM public.contracts
    WHERE code = '02/BIM-CICHD2025'
    LIMIT 1;

    -- Nếu không tìm thấy contract, lấy contract đầu tiên
    IF v_contract_id IS NULL THEN
        SELECT id, total_value INTO v_contract_id, v_total_value
        FROM public.contracts
        ORDER BY created_at DESC
        LIMIT 1;
    END IF;

    -- Nếu vẫn không có contract nào, thoát
    IF v_contract_id IS NULL THEN
        RAISE NOTICE 'Không tìm thấy contract nào để thêm milestones';
        RETURN;
    END IF;

    RAISE NOTICE 'Adding milestones for contract: % (Total value: %)', v_contract_id, v_total_value;

    -- Xóa milestones cũ nếu có (để tránh duplicate)
    DELETE FROM public.payment_milestones WHERE contract_id = v_contract_id;

    -- Đợt 1: Tạm ứng 30%
    INSERT INTO public.payment_milestones (
        contract_id, phase, condition, percentage, amount, 
        due_date, status, completion_progress
    ) VALUES (
        v_contract_id,
        'Đợt 1 - Tạm ứng',
        'Sau khi ký hợp đồng',
        30.00,
        v_total_value * 0.30,
        CURRENT_DATE + INTERVAL '7 days',
        'Đã thanh toán',
        100
    ) RETURNING id INTO v_milestone_1_id;

    -- Đợt 2: Hoàn thành thiết kế cơ sở 40%
    INSERT INTO public.payment_milestones (
        contract_id, phase, condition, percentage, amount,
        due_date, status, completion_progress
    ) VALUES (
        v_contract_id,
        'Đợt 2 - Thiết kế cơ sở',
        'Hoàn thành và nghiệm thu thiết kế cơ sở',
        40.00,
        v_total_value * 0.40,
        CURRENT_DATE + INTERVAL '30 days',
        'Chưa thanh toán',
        60
    ) RETURNING id INTO v_milestone_2_id;

    -- Đợt 3: Hoàn thành bản vẽ thi công 20%
    INSERT INTO public.payment_milestones (
        contract_id, phase, condition, percentage, amount,
        due_date, status, completion_progress
    ) VALUES (
        v_contract_id,
        'Đợt 3 - Bản vẽ thi công',
        'Hoàn thành và nghiệm thu bản vẽ thi công',
        20.00,
        v_total_value * 0.20,
        CURRENT_DATE + INTERVAL '60 days',
        'Chưa thanh toán',
        0
    ) RETURNING id INTO v_milestone_3_id;

    -- Đợt 4: Nghiệm thu cuối cùng 10%
    INSERT INTO public.payment_milestones (
        contract_id, phase, condition, percentage, amount,
        due_date, status, completion_progress
    ) VALUES (
        v_contract_id,
        'Đợt 4 - Nghiệm thu',
        'Bàn giao và nghiệm thu hoàn thành',
        10.00,
        v_total_value * 0.10,
        CURRENT_DATE + INTERVAL '90 days',
        'Chưa thanh toán',
        0
    ) RETURNING id INTO v_milestone_4_id;

    -- ========== 3. INSERT Payment Transactions (Lịch sử giao dịch) ==========
    
    -- Giao dịch 1: Thanh toán đợt 1 (100%)
    INSERT INTO public.payment_transactions (
        contract_id, milestone_id, description,
        amount, payment_date, status,
        invoice_number, payment_method, notes
    ) VALUES (
        v_contract_id,
        v_milestone_1_id,
        'Thanh toán tạm ứng đợt 1',
        v_total_value * 0.30,
        CURRENT_DATE - INTERVAL '5 days',
        'Đã thanh toán',
        'INV-2025-001',
        'Chuyển khoản',
        'Đã nhận đủ tiền tạm ứng'
    );

    -- Cập nhật contract.paid_value (remaining_value sẽ tự động tính)
    UPDATE public.contracts
    SET paid_value = v_total_value * 0.30
    WHERE id = v_contract_id;

    RAISE NOTICE 'Successfully added 4 milestones and 1 transaction for contract %', v_contract_id;
END $$;

-- ========== 4. Verify Data ==========
SELECT 
    c.code as contract_code,
    c.total_value,
    c.paid_value,
    c.remaining_value,
    COUNT(pm.id) as milestone_count,
    COUNT(pt.id) as transaction_count
FROM public.contracts c
LEFT JOIN public.payment_milestones pm ON pm.contract_id = c.id
LEFT JOIN public.payment_transactions pt ON pt.contract_id = c.id
GROUP BY c.id, c.code, c.total_value, c.paid_value, c.remaining_value
ORDER BY c.created_at DESC
LIMIT 5;

-- ========== 5. View Payment Details ==========
SELECT 
    pm.phase,
    pm.condition,
    pm.percentage,
    pm.amount,
    pm.status,
    pm.completion_progress,
    pm.due_date,
    COUNT(pt.id) as payment_count,
    COALESCE(SUM(CASE WHEN pt.status = 'Đã thanh toán' THEN pt.amount ELSE 0 END), 0) as paid_amount
FROM public.payment_milestones pm
LEFT JOIN public.payment_transactions pt ON pt.milestone_id = pm.id
GROUP BY pm.id, pm.phase, pm.condition, pm.percentage, pm.amount, pm.status, pm.completion_progress, pm.due_date
ORDER BY pm.created_at;

-- ========== 6. View Transaction History ==========
SELECT 
    pt.payment_date,
    pt.description,
    pt.amount,
    pt.status,
    pt.payment_method,
    pt.invoice_number,
    pm.phase as milestone_phase
FROM public.payment_transactions pt
LEFT JOIN public.payment_milestones pm ON pm.id = pt.milestone_id
ORDER BY pt.payment_date DESC;

SELECT '✅ Payment milestones and transactions seed data created successfully!' as message;
