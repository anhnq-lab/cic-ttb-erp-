-- ============================================
-- Quick Test: Verify Payment Transactions
-- ============================================

-- 1. Check if payment_transactions table exists and has data
SELECT 
    'payment_transactions' as table_name,
    COUNT(*) as total_records
FROM public.payment_transactions;

-- 2. Check if payment_milestones exist
SELECT 
    'payment_milestones' as table_name,
    COUNT(*) as total_records
FROM public.payment_milestones;

-- 3. Show sample contracts with their transactions
SELECT 
    c.code as contract_code,
    c.total_value,
    c.paid_value,
    COUNT(DISTINCT pm.id) as milestone_count,
    COUNT(DISTINCT pt.id) as transaction_count
FROM public.contracts c
LEFT JOIN public.payment_milestones pm ON pm.contract_id = c.id
LEFT JOIN public.payment_transactions pt ON pt.contract_id = c.id
WHERE c.total_value > 0
GROUP BY c.id, c.code, c.total_value, c.paid_value
ORDER BY c.created_at DESC
LIMIT 10;

-- 4. Show actual payment transactions
SELECT 
    c.code as contract,
    pt.payment_date,
    pt.description,
    pt.amount,
    pt.status,
    pt.payment_method,
    pt.invoice_number
FROM public.payment_transactions pt
JOIN public.contracts c ON c.id = pt.contract_id
ORDER BY pt.payment_date DESC
LIMIT 20;

-- 5. If no data found, run seed again
DO $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM public.payment_transactions;
    
    IF v_count = 0 THEN
        RAISE NOTICE 'No transactions found! Please run seed file 005_all_contracts_payment_seed.sql';
    ELSE
        RAISE NOTICE 'Found % transaction records', v_count;
    END IF;
END $$;
