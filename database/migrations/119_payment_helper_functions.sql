-- ============================================
-- Helper Functions: Payment Milestones Management
-- Purpose: Các hàm tiện ích để quản lý thanh toán
-- ============================================

-- ========== 1. Function: Tạo milestones mặc định cho contract ==========
CREATE OR REPLACE FUNCTION create_default_payment_milestones(
    p_contract_id TEXT,
    p_milestone_type TEXT DEFAULT 'standard' -- 'standard', 'consulting', 'construction'
)
RETURNS VOID AS $$
DECLARE
    v_total_value BIGINT;
BEGIN
    -- Lấy giá trị hợp đồng
    SELECT total_value INTO v_total_value
    FROM public.contracts
    WHERE id = p_contract_id;

    IF v_total_value IS NULL THEN
        RAISE EXCEPTION 'Contract not found: %', p_contract_id;
    END IF;

    -- Xóa milestones cũ nếu có
    DELETE FROM public.payment_milestones WHERE contract_id = p_contract_id;

    -- Tạo milestones theo loại
    IF p_milestone_type = 'consulting' THEN
        -- Loại hợp đồng tư vấn (30-40-20-10)
        INSERT INTO public.payment_milestones (contract_id, phase, condition, percentage, amount, status)
        VALUES 
            (p_contract_id, 'Đợt 1 - Tạm ứng', 'Sau khi ký hợp đồng', 30.00, v_total_value * 0.30, 'Chưa thanh toán'),
            (p_contract_id, 'Đợt 2 - Thiết kế cơ sở', 'Hoàn thành thiết kế cơ sở', 40.00, v_total_value * 0.40, 'Chưa thanh toán'),
            (p_contract_id, 'Đợt 3 - Bản vẽ thi công', 'Hoàn thành bản vẽ thi công', 20.00, v_total_value * 0.20, 'Chưa thanh toán'),
            (p_contract_id, 'Đợt 4 - Nghiệm thu', 'Bàn giao và nghiệm thu', 10.00, v_total_value * 0.10, 'Chưa thanh toán');
    
    ELSIF p_milestone_type = 'construction' THEN
        -- Loại hợp đồng xây dựng (20-30-30-20)
        INSERT INTO public.payment_milestones (contract_id, phase, condition, percentage, amount, status)
        VALUES 
            (p_contract_id, 'Đợt 1 - Khởi công', 'Sau khi khởi công', 20.00, v_total_value * 0.20, 'Chưa thanh toán'),
            (p_contract_id, 'Đợt 2 - Hoàn thành móng', 'Hoàn thành móng và cột', 30.00, v_total_value * 0.30, 'Chưa thanh toán'),
            (p_contract_id, 'Đợt 3 - Hoàn thành thô', 'Hoàn thành công trình thô', 30.00, v_total_value * 0.30, 'Chưa thanh toán'),
            (p_contract_id, 'Đợt 4 - Nghiệm thu', 'Bàn giao và nghiệm thu', 20.00, v_total_value * 0.20, 'Chưa thanh toán');
    
    ELSE
        -- Loại chuẩn (25-25-25-25)
        INSERT INTO public.payment_milestones (contract_id, phase, condition, percentage, amount, status)
        VALUES 
            (p_contract_id, 'Đợt 1', 'Thanh toán đợt 1', 25.00, v_total_value * 0.25, 'Chưa thanh toán'),
            (p_contract_id, 'Đợt 2', 'Thanh toán đợt 2', 25.00, v_total_value * 0.25, 'Chưa thanh toán'),
            (p_contract_id, 'Đợt 3', 'Thanh toán đợt 3', 25.00, v_total_value * 0.25, 'Chưa thanh toán'),
            (p_contract_id, 'Đợt 4', 'Thanh toán đợt 4', 25.00, v_total_value * 0.25, 'Chưa thanh toán');
    END IF;

    RAISE NOTICE 'Created % milestones for contract %', p_milestone_type, p_contract_id;
END;
$$ LANGUAGE plpgsql;

-- ========== 2. Function: Ghi nhận thanh toán ==========
CREATE OR REPLACE FUNCTION record_payment(
    p_contract_id TEXT,
    p_milestone_id TEXT,
    p_amount BIGINT,
    p_payment_date DATE,
    p_payment_method TEXT DEFAULT 'Chuyển khoản',
    p_invoice_number TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
    v_transaction_id TEXT;
    v_total_paid BIGINT;
BEGIN
    -- Tạo payment transaction
    INSERT INTO public.payment_transactions (
        contract_id, milestone_id, description,
        amount, payment_date, status,
        payment_method, invoice_number
    ) VALUES (
        p_contract_id,
        p_milestone_id,
        COALESCE(p_description, 'Thanh toán hợp đồng'),
        p_amount,
        p_payment_date,
        'Đã thanh toán',
        p_payment_method,
        p_invoice_number
    ) RETURNING id INTO v_transaction_id;

    -- Cập nhật milestone status nếu thanh toán đủ
    UPDATE public.payment_milestones
    SET 
        status = CASE 
            WHEN (SELECT COALESCE(SUM(amount), 0) 
                  FROM public.payment_transactions 
                  WHERE milestone_id = p_milestone_id 
                  AND status = 'Đã thanh toán') >= amount 
            THEN 'Đã thanh toán'
            ELSE 'Thanh toán một phần'
        END,
        updated_at = NOW()
    WHERE id = p_milestone_id;

    -- Cập nhật tổng tiền đã thanh toán cho contract
    SELECT COALESCE(SUM(amount), 0) INTO v_total_paid
    FROM public.payment_transactions
    WHERE contract_id = p_contract_id
    AND status = 'Đã thanh toán';

    UPDATE public.contracts
    SET 
        paid_value = v_total_paid,
        remaining_value = total_value - v_total_paid,
        updated_at = NOW()
    WHERE id = p_contract_id;

    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql;

-- ========== 3. Function: Tính toán tổng thanh toán ==========
CREATE OR REPLACE FUNCTION calculate_contract_payment_summary(p_contract_id TEXT)
RETURNS TABLE (
    total_value BIGINT,
    paid_value BIGINT,
    remaining_value BIGINT,
    milestone_count INTEGER,
    paid_milestone_count INTEGER,
    transaction_count INTEGER,
    payment_progress NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.total_value,
        c.paid_value,
        c.remaining_value,
        COUNT(DISTINCT pm.id)::INTEGER as milestone_count,
        COUNT(DISTINCT CASE WHEN pm.status = 'Đã thanh toán' THEN pm.id END)::INTEGER as paid_milestone_count,
        COUNT(DISTINCT pt.id)::INTEGER as transaction_count,
        CASE WHEN c.total_value > 0 
            THEN ROUND((c.paid_value::NUMERIC / c.total_value::NUMERIC) * 100, 2)
            ELSE 0 
        END as payment_progress
    FROM public.contracts c
    LEFT JOIN public.payment_milestones pm ON pm.contract_id = c.id
    LEFT JOIN public.payment_transactions pt ON pt.contract_id = c.id AND pt.status = 'Đã thanh toán'
    WHERE c.id = p_contract_id
    GROUP BY c.id, c.total_value, c.paid_value, c.remaining_value;
END;
$$ LANGUAGE plpgsql;

-- ========== 4. Function: Tự động tạo milestones khi tạo contract ==========
CREATE OR REPLACE FUNCTION auto_create_milestones_on_contract()
RETURNS TRIGGER AS $$
BEGIN
    -- Chỉ tạo milestones nếu contract có total_value > 0
    IF NEW.total_value > 0 THEN
        -- Gọi hàm tạo milestones (sử dụng contract_type để xác định loại)
        PERFORM create_default_payment_milestones(
            NEW.id,
            CASE 
                WHEN NEW.contract_type ILIKE '%tư vấn%' THEN 'consulting'
                WHEN NEW.contract_type ILIKE '%xây dựng%' THEN 'construction'
                ELSE 'standard'
            END
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger (optional - bật nếu muốn tự động tạo milestones)
-- DROP TRIGGER IF EXISTS trg_auto_create_milestones ON public.contracts;
-- CREATE TRIGGER trg_auto_create_milestones
--     AFTER INSERT ON public.contracts
--     FOR EACH ROW
--     EXECUTE FUNCTION auto_create_milestones_on_contract();

-- ========== 5. Example Usage ==========

-- Ví dụ 1: Tạo milestones cho contract
-- SELECT create_default_payment_milestones('contract-id-here', 'consulting');

-- Ví dụ 2: Ghi nhận thanh toán
-- SELECT record_payment(
--     'contract-id',
--     'milestone-id', 
--     100000000, 
--     CURRENT_DATE,
--     'Chuyển khoản',
--     'INV-2025-001',
--     'Thanh toán tạm ứng'
-- );

-- Ví dụ 3: Xem tổng hợp thanh toán
-- SELECT * FROM calculate_contract_payment_summary('contract-id');

SELECT '✅ Payment helper functions created successfully!' as message;
