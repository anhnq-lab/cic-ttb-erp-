-- ============================================
-- Seed Data: Payment Milestones & Transactions for ALL Contracts
-- Purpose: Tạo milestones và lịch sử giao dịch cho TẤT CẢ hợp đồng
-- ============================================

-- ========== STEP 1: Tạo milestones cho tất cả contracts ==========
DO $$
DECLARE
    contract_record RECORD;
    v_milestone_count INTEGER := 0;
BEGIN
    -- Loop qua tất cả contracts
    FOR contract_record IN 
        SELECT id, code, total_value, contract_type
        FROM public.contracts
        WHERE total_value > 0
    LOOP
        -- Xóa milestones cũ nếu có
        DELETE FROM public.payment_milestones WHERE contract_id = contract_record.id;
        
        -- Tạo milestones dựa vào contract type
        IF contract_record.contract_type ILIKE '%tư vấn%' OR contract_record.contract_type ILIKE '%thiết kế%' THEN
            -- Loại tư vấn/thiết kế: 30-40-20-10
            INSERT INTO public.payment_milestones (contract_id, phase, condition, percentage, amount, status, completion_progress, due_date)
            VALUES 
                (contract_record.id, 'Đợt 1 - Tạm ứng', 'Sau khi ký hợp đồng', 30.00, contract_record.total_value * 0.30, 'Đã thanh toán', 100, CURRENT_DATE - INTERVAL '60 days'),
                (contract_record.id, 'Đợt 2 - Thiết kế cơ sở', 'Nghiệm thu thiết kế cơ sở', 40.00, contract_record.total_value * 0.40, 'Thanh toán một phần', 80, CURRENT_DATE - INTERVAL '30 days'),
                (contract_record.id, 'Đợt 3 - Bản vẽ thi công', 'Nghiệm thu bản vẽ thi công', 20.00, contract_record.total_value * 0.20, 'Chưa thanh toán', 40, CURRENT_DATE + INTERVAL '30 days'),
                (contract_record.id, 'Đợt 4 - Nghiệm thu', 'Bàn giao hoàn thành', 10.00, contract_record.total_value * 0.10, 'Chưa thanh toán', 0, CURRENT_DATE + INTERVAL '90 days');
        
        ELSIF contract_record.contract_type ILIKE '%xây dựng%' OR contract_record.contract_type ILIKE '%thi công%' THEN
            -- Loại xây dựng: 20-30-30-20
            INSERT INTO public.payment_milestones (contract_id, phase, condition, percentage, amount, status, completion_progress, due_date)
            VALUES 
                (contract_record.id, 'Đợt 1 - Khởi công', 'Sau khi khởi công', 20.00, contract_record.total_value * 0.20, 'Đã thanh toán', 100, CURRENT_DATE - INTERVAL '90 days'),
                (contract_record.id, 'Đợt 2 - Hoàn thành móng', 'Hoàn thành móng và cột', 30.00, contract_record.total_value * 0.30, 'Đã thanh toán', 100, CURRENT_DATE - INTERVAL '60 days'),
                (contract_record.id, 'Đợt 3 - Hoàn thành thô', 'Hoàn thành công trình thô', 30.00, contract_record.total_value * 0.30, 'Thanh toán một phần', 60, CURRENT_DATE - INTERVAL '20 days'),
                (contract_record.id, 'Đợt 4 - Nghiệm thu', 'Bàn giao và nghiệm thu', 20.00, contract_record.total_value * 0.20, 'Chưa thanh toán', 0, CURRENT_DATE + INTERVAL '60 days');
        
        ELSE
            -- Loại chuẩn: 25-25-25-25
            INSERT INTO public.payment_milestones (contract_id, phase, condition, percentage, amount, status, completion_progress, due_date)
            VALUES 
                (contract_record.id, 'Đợt 1 - 25%', 'Thanh toán đợt 1', 25.00, contract_record.total_value * 0.25, 'Đã thanh toán', 100, CURRENT_DATE - INTERVAL '75 days'),
                (contract_record.id, 'Đợt 2 - 50%', 'Thanh toán đợt 2', 25.00, contract_record.total_value * 0.25, 'Đã thanh toán', 100, CURRENT_DATE - INTERVAL '45 days'),
                (contract_record.id, 'Đợt 3 - 75%', 'Thanh toán đợt 3', 25.00, contract_record.total_value * 0.25, 'Chưa thanh toán', 50, CURRENT_DATE + INTERVAL '15 days'),
                (contract_record.id, 'Đợt 4 - 100%', 'Thanh toán cuối', 25.00, contract_record.total_value * 0.25, 'Chưa thanh toán', 0, CURRENT_DATE + INTERVAL '60 days');
        END IF;
        
        v_milestone_count := v_milestone_count + 4;
    END LOOP;
    
    RAISE NOTICE 'Created % payment milestones for % contracts', v_milestone_count, 
        (SELECT COUNT(*) FROM public.contracts WHERE total_value > 0);
END $$;

-- ========== STEP 2: Tạo transactions cho các milestones đã thanh toán ==========
DO $$
DECLARE
    milestone_record RECORD;
    v_transaction_count INTEGER := 0;
    v_payment_date DATE;
    v_invoice_num TEXT;
BEGIN
    -- Loop qua tất cả milestones đã thanh toán hoặc thanh toán một phần
    FOR milestone_record IN 
        SELECT 
            pm.id as milestone_id,
            pm.contract_id,
            pm.phase,
            pm.amount,
            pm.status,
            c.code as contract_code
        FROM public.payment_milestones pm
        JOIN public.contracts c ON c.id = pm.contract_id
        WHERE pm.status IN ('Đã thanh toán', 'Thanh toán một phần')
        ORDER BY pm.created_at
    LOOP
        -- Tính ngày thanh toán (ngẫu nhiên trong quá khứ)
        v_payment_date := CURRENT_DATE - INTERVAL '1 day' * (30 + (random() * 60)::INTEGER);
        
        -- Tạo số hóa đơn
        v_invoice_num := 'INV-' || TO_CHAR(v_payment_date, 'YYYYMM') || '-' || LPAD((v_transaction_count + 1)::TEXT, 3, '0');
        
        IF milestone_record.status = 'Đã thanh toán' THEN
            -- Thanh toán 100%
            INSERT INTO public.payment_transactions (
                contract_id, milestone_id, description,
                amount, payment_date, status,
                payment_method, invoice_number, notes
            ) VALUES (
                milestone_record.contract_id,
                milestone_record.milestone_id,
                'Thanh toán ' || milestone_record.phase,
                milestone_record.amount,
                v_payment_date,
                'Đã thanh toán',
                CASE (random() * 2)::INTEGER
                    WHEN 0 THEN 'Chuyển khoản'
                    WHEN 1 THEN 'Tiền mặt'
                    ELSE 'Séc'
                END,
                v_invoice_num,
                'Đã nhận đủ theo hợp đồng'
            );
            v_transaction_count := v_transaction_count + 1;
        
        ELSIF milestone_record.status = 'Thanh toán một phần' THEN
            -- Thanh toán 50-70%
            INSERT INTO public.payment_transactions (
                contract_id, milestone_id, description,
                amount, payment_date, status,
                payment_method, invoice_number, notes
            ) VALUES (
                milestone_record.contract_id,
                milestone_record.milestone_id,
                'Thanh toán một phần ' || milestone_record.phase,
                milestone_record.amount * (0.5 + random() * 0.2), -- 50-70%
                v_payment_date,
                'Đã thanh toán',
                'Chuyển khoản',
                v_invoice_num,
                'Thanh toán tạm, còn lại sẽ thanh toán sau'
            );
            v_transaction_count := v_transaction_count + 1;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Created % payment transactions', v_transaction_count;
END $$;

-- ========== STEP 3: Cập nhật paid_value cho tất cả contracts ==========
DO $$
DECLARE
    contract_record RECORD;
BEGIN
    FOR contract_record IN 
        SELECT id FROM public.contracts WHERE total_value > 0
    LOOP
        UPDATE public.contracts c
        SET paid_value = (
            SELECT COALESCE(SUM(pt.amount), 0)
            FROM public.payment_transactions pt
            WHERE pt.contract_id = c.id
            AND pt.status = 'Đã thanh toán'
        )
        WHERE c.id = contract_record.id;
    END LOOP;
    
    RAISE NOTICE 'Updated paid_value for all contracts';
END $$;

-- ========== STEP 4: Thêm một số giao dịch ngẫu nhiên (lịch sử phong phú) ==========
DO $$
DECLARE
    contract_record RECORD;
    v_extra_count INTEGER := 0;
BEGIN
    -- Thêm 1-2 giao dịch bổ sung cho một số contracts (ngẫu nhiên)
    FOR contract_record IN 
        SELECT 
            c.id as contract_id,
            c.code,
            c.total_value
        FROM public.contracts c
        WHERE c.total_value > 0
        AND random() < 0.3 -- 30% contracts sẽ có giao dịch bổ sung
        LIMIT 10
    LOOP
        -- Thêm giao dịch điều chỉnh hoặc bổ sung
        INSERT INTO public.payment_transactions (
            contract_id, description,
            amount, payment_date, status,
            payment_method, invoice_number, notes
        ) VALUES (
            contract_record.contract_id,
            'Điều chỉnh thanh toán',
            contract_record.total_value * (0.01 + random() * 0.05), -- 1-6%
            CURRENT_DATE - INTERVAL '1 day' * (10 + (random() * 20)::INTEGER),
            'Đã thanh toán',
            'Chuyển khoản',
            'ADJ-' || TO_CHAR(CURRENT_DATE, 'YYYYMM') || '-' || LPAD(v_extra_count::TEXT, 3, '0'),
            'Điều chỉnh do thay đổi phạm vi công việc'
        );
        v_extra_count := v_extra_count + 1;
    END LOOP;
    
    RAISE NOTICE 'Added % additional transactions', v_extra_count;
END $$;

-- ========== VERIFICATION ==========

-- Kiểm tra số lượng milestones và transactions
SELECT 
    'Summary' as type,
    COUNT(DISTINCT c.id) as total_contracts,
    COUNT(DISTINCT pm.id) as total_milestones,
    COUNT(DISTINCT pt.id) as total_transactions,
    ROUND(AVG(CASE WHEN c.total_value > 0 THEN (c.paid_value::NUMERIC / c.total_value::NUMERIC) * 100 ELSE 0 END), 2) as avg_payment_progress
FROM public.contracts c
LEFT JOIN public.payment_milestones pm ON pm.contract_id = c.id
LEFT JOIN public.payment_transactions pt ON pt.contract_id = c.id
WHERE c.total_value > 0;

-- Xem chi tiết một số contracts
SELECT 
    c.code,
    c.total_value,
    c.paid_value,
    c.remaining_value,
    COUNT(DISTINCT pm.id) as milestone_count,
    COUNT(DISTINCT CASE WHEN pm.status = 'Đã thanh toán' THEN pm.id END) as paid_milestones,
    COUNT(DISTINCT pt.id) as transaction_count,
    ROUND((c.paid_value::NUMERIC / NULLIF(c.total_value, 0)::NUMERIC) * 100, 2) as payment_percent
FROM public.contracts c
LEFT JOIN public.payment_milestones pm ON pm.contract_id = c.id
LEFT JOIN public.payment_transactions pt ON pt.contract_id = c.id AND pt.status = 'Đã thanh toán'
WHERE c.total_value > 0
GROUP BY c.id, c.code, c.total_value, c.paid_value, c.remaining_value
ORDER BY c.created_at DESC
LIMIT 10;

-- Xem lịch sử giao dịch mẫu
SELECT 
    c.code as contract,
    pt.payment_date,
    pt.description,
    pt.amount,
    pt.payment_method,
    pt.invoice_number,
    pm.phase as milestone
FROM public.payment_transactions pt
JOIN public.contracts c ON c.id = pt.contract_id
LEFT JOIN public.payment_milestones pm ON pm.id = pt.milestone_id
ORDER BY pt.payment_date DESC
LIMIT 20;

SELECT '✅ Payment data seeded for ALL contracts successfully!' as message;
