-- ============================================
-- Migration 103: Minimal Seed Data
-- Dữ liệu tối thiểu để test hệ thống
-- ============================================

-- ========== ADMIN USER ==========
-- IMPORTANT: Email phải khớp với Supabase Auth user
INSERT INTO public.employees (code, name, email, role, department, status) VALUES
('ADMIN', 'Administrator', 'admin@cic.com.vn', 'Admin', 'IT', 'Active')
ON CONFLICT (email) DO UPDATE 
SET name = EXCLUDED.name, role = EXCLUDED.role;

-- ========== TEST EMPLOYEES ==========
INSERT INTO public.employees (code, name, email, role, department, status) VALUES
('NV001', 'Nguyễn Văn A', 'leader@cic.vn', 'Leader', 'BIM', 'Active'),
('NV002', 'Trần Thị B', 'modeler@cic.vn', 'Modeler', 'BIM', 'Active')
ON CONFLICT (email) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Minimal seed data inserted!';
    RAISE NOTICE '   - 1 Admin user: admin@cic.com.vn';
    RAISE NOTICE '   - 2 Test employees';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Next steps:';
    RAISE NOTICE '   1. Verify Supabase Auth user email matches';
    RAISE NOTICE '   2. Test creating projects via app';
    RAISE NOTICE '   3. Verify auto-task generation';
    RAISE NOTICE '========================================';
END $$;
