-- ============================================
-- ANALYTICS VIEWS FOR CIC.TTB.ERP
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. VIEW: Project Summary with Financials
-- ============================================
CREATE OR REPLACE VIEW v_project_summary AS
SELECT 
    p.id,
    p.code,
    p.name,
    p.client,
    p.manager,
    p.status,
    p.progress,
    p.budget,
    p.spent,
    p."capitalSource",
    p.deadline,
    p.members,
    -- Contract aggregations
    COALESCE(SUM(c."totalValue"), 0) as total_contract_value,
    COALESCE(SUM(c."paidValue"), 0) as total_paid,
    COALESCE(SUM(c."remainingValue"), 0) as total_receivables,
    COUNT(c.id) as contract_count,
    -- Derived metrics
    CASE WHEN p.budget > 0 THEN ROUND((p.spent::numeric / p.budget) * 100, 2) ELSE 0 END as budget_utilization,
    CASE WHEN p.deadline < CURRENT_DATE AND p.progress < 100 THEN TRUE ELSE FALSE END as is_overdue
FROM projects p
LEFT JOIN contracts c ON c."projectId" = p.id
GROUP BY p.id, p.code, p.name, p.client, p.manager, p.status, p.progress, p.budget, p.spent, p."capitalSource", p.deadline, p.members;

-- ============================================
-- 2. VIEW: Contract Receivables by Client
-- ============================================
CREATE OR REPLACE VIEW v_contract_receivables AS
SELECT 
    c."sideAName" as client_name,
    COUNT(*) as contract_count,
    SUM(c."totalValue") as total_value,
    SUM(c."paidValue") as paid_value,
    SUM(c."remainingValue") as receivables,
    ROUND(SUM(c."paidValue")::numeric / NULLIF(SUM(c."totalValue"), 0) * 100, 2) as payment_progress
FROM contracts c
WHERE c.status != 'Hoàn thành'
GROUP BY c."sideAName"
HAVING SUM(c."remainingValue") > 0
ORDER BY receivables DESC;

-- ============================================
-- 3. VIEW: Revenue by Period (Monthly)
-- ============================================
CREATE OR REPLACE VIEW v_revenue_by_month AS
SELECT 
    DATE_TRUNC('month', c."signedDate"::timestamp) as period,
    TO_CHAR(c."signedDate"::timestamp, 'MM/YYYY') as period_label,
    COUNT(*) as contract_count,
    SUM(c."totalValue") as total_value,
    SUM(c."paidValue") as paid_value
FROM contracts c
GROUP BY DATE_TRUNC('month', c."signedDate"::timestamp), TO_CHAR(c."signedDate"::timestamp, 'MM/YYYY')
ORDER BY period DESC;

-- ============================================
-- 4. VIEW: Revenue by Quarter
-- ============================================
CREATE OR REPLACE VIEW v_revenue_by_quarter AS
SELECT 
    EXTRACT(YEAR FROM c."signedDate"::timestamp) as year,
    EXTRACT(QUARTER FROM c."signedDate"::timestamp) as quarter,
    CONCAT('Q', EXTRACT(QUARTER FROM c."signedDate"::timestamp), '/', EXTRACT(YEAR FROM c."signedDate"::timestamp)) as quarter_label,
    COUNT(*) as contract_count,
    SUM(c."totalValue") as total_value,
    SUM(c."paidValue") as paid_value
FROM contracts c
GROUP BY EXTRACT(YEAR FROM c."signedDate"::timestamp), EXTRACT(QUARTER FROM c."signedDate"::timestamp)
ORDER BY year DESC, quarter DESC;

-- ============================================
-- 5. VIEW: Employee Distribution by Department
-- ============================================
CREATE OR REPLACE VIEW v_employee_by_department AS
SELECT 
    department,
    COUNT(*) as employee_count,
    COUNT(*) FILTER (WHERE status = 'Chính thức') as active_count,
    COUNT(*) FILTER (WHERE status = 'Thử việc') as probation_count,
    COUNT(*) FILTER (WHERE status = 'Nghỉ phép') as leave_count
FROM employees
GROUP BY department
ORDER BY employee_count DESC;

-- ============================================
-- 6. VIEW: Customer Overview with Opportunities
-- ============================================
CREATE OR REPLACE VIEW v_customer_overview AS
SELECT 
    cu.id,
    cu.code,
    cu.name,
    cu."shortName",
    cu.tier,
    cu.status,
    cu."totalProjectValue",
    -- Opportunity aggregations
    COUNT(o.id) as opportunity_count,
    COALESCE(SUM(o.value), 0) as pipeline_value,
    COALESCE(AVG(o.probability), 0) as avg_probability
FROM customers cu
LEFT JOIN crm_opportunities o ON o."customerId" = cu.id
GROUP BY cu.id, cu.code, cu.name, cu."shortName", cu.tier, cu.status, cu."totalProjectValue"
ORDER BY cu."totalProjectValue" DESC;

-- ============================================
-- 7. VIEW: Project Risk Assessment
-- ============================================
CREATE OR REPLACE VIEW v_project_risk AS
SELECT 
    p.id,
    p.code,
    p.name,
    p.status,
    p.progress,
    p.deadline,
    p.budget,
    p.spent,
    -- Risk factors
    CASE WHEN p.deadline < CURRENT_DATE AND p.progress < 100 THEN 'OVERDUE' ELSE 'ON_TRACK' END as schedule_status,
    CASE WHEN p.budget > 0 AND p.spent > p.budget THEN 'OVER_BUDGET' 
         WHEN p.budget > 0 AND (p.spent::numeric / p.budget) > 0.8 AND p.progress < 50 THEN 'HIGH_BURN'
         ELSE 'NORMAL' END as budget_status,
    -- Days overdue (if applicable)
    CASE WHEN p.deadline < CURRENT_DATE THEN CURRENT_DATE - p.deadline::date ELSE 0 END as days_overdue,
    -- Risk score (0-100)
    CASE 
        WHEN p.deadline < CURRENT_DATE AND p.progress < 100 THEN 50
        ELSE 0 
    END +
    CASE 
        WHEN p.budget > 0 AND p.spent > p.budget THEN 40
        WHEN p.budget > 0 AND (p.spent::numeric / p.budget) > 0.8 AND p.progress < 50 THEN 20
        ELSE 0 
    END as risk_score
FROM projects p
ORDER BY risk_score DESC, days_overdue DESC;

-- ============================================
-- 8. VIEW: Dashboard KPIs
-- ============================================
CREATE OR REPLACE VIEW v_dashboard_kpis AS
SELECT 
    -- Project metrics
    (SELECT COUNT(*) FROM projects) as total_projects,
    (SELECT COUNT(*) FROM projects WHERE status = 'Đang thực hiện') as active_projects,
    (SELECT COUNT(*) FROM projects WHERE deadline < CURRENT_DATE AND progress < 100) as delayed_projects,
    (SELECT ROUND(AVG(progress), 1) FROM projects) as avg_progress,
    -- Contract metrics
    (SELECT COUNT(*) FROM contracts) as total_contracts,
    (SELECT COALESCE(SUM("totalValue"), 0) FROM contracts) as total_contract_value,
    (SELECT COALESCE(SUM("paidValue"), 0) FROM contracts) as total_paid_value,
    (SELECT COALESCE(SUM("remainingValue"), 0) FROM contracts) as total_receivables,
    -- HR metrics
    (SELECT COUNT(*) FROM employees) as total_employees,
    (SELECT COUNT(*) FROM employees WHERE status = 'Chính thức') as active_employees,
    -- Customer metrics
    (SELECT COUNT(*) FROM customers WHERE status = 'Active') as active_customers,
    (SELECT COALESCE(SUM(value), 0) FROM crm_opportunities WHERE stage NOT IN ('Won', 'Lost')) as pipeline_value;

-- ============================================
-- FUNCTION: Calculate Project Risk Score
-- ============================================
CREATE OR REPLACE FUNCTION fn_calculate_project_risk(project_id TEXT)
RETURNS INTEGER AS $$
DECLARE
    risk_score INTEGER := 0;
    project_rec RECORD;
    overdue_tasks INTEGER;
BEGIN
    -- Get project details
    SELECT * INTO project_rec FROM projects WHERE id = project_id;
    
    IF NOT FOUND THEN
        RETURN 0;
    END IF;
    
    -- Check if overdue
    IF project_rec.deadline < CURRENT_DATE AND project_rec.progress < 100 THEN
        risk_score := risk_score + 50;
    END IF;
    
    -- Check budget
    IF project_rec.budget > 0 THEN
        IF project_rec.spent > project_rec.budget THEN
            risk_score := risk_score + 40;
        ELSIF (project_rec.spent::numeric / project_rec.budget) > 0.8 AND project_rec.progress < 50 THEN
            risk_score := risk_score + 20;
        END IF;
    END IF;
    
    -- Count overdue tasks
    SELECT COUNT(*) INTO overdue_tasks 
    FROM tasks 
    WHERE "projectId" = project_id 
      AND "dueDate" < CURRENT_DATE 
      AND progress < 100;
    
    risk_score := risk_score + LEAST(overdue_tasks * 5, 30);
    
    RETURN LEAST(risk_score, 100);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTION: Get Cashflow Forecast (6 months)
-- ============================================
CREATE OR REPLACE FUNCTION fn_get_cashflow_forecast()
RETURNS TABLE(month_label TEXT, expected_amount BIGINT) AS $$
DECLARE
    total_receivables BIGINT;
    monthly_avg BIGINT;
    i INTEGER;
    current_month DATE;
BEGIN
    -- Get total receivables from active contracts
    SELECT COALESCE(SUM("remainingValue"), 0) INTO total_receivables
    FROM contracts 
    WHERE status = 'Hiệu lực' AND "remainingValue" > 0;
    
    -- Distribute evenly over 6 months
    monthly_avg := total_receivables / 6;
    
    -- Return 6 months forecast
    FOR i IN 0..5 LOOP
        current_month := DATE_TRUNC('month', CURRENT_DATE + (i || ' months')::interval);
        month_label := TO_CHAR(current_month, 'TMMonth YYYY');
        expected_amount := monthly_avg;
        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Grant access to the views
GRANT SELECT ON v_project_summary TO authenticated;
GRANT SELECT ON v_contract_receivables TO authenticated;
GRANT SELECT ON v_revenue_by_month TO authenticated;
GRANT SELECT ON v_revenue_by_quarter TO authenticated;
GRANT SELECT ON v_employee_by_department TO authenticated;
GRANT SELECT ON v_customer_overview TO authenticated;
GRANT SELECT ON v_project_risk TO authenticated;
GRANT SELECT ON v_dashboard_kpis TO authenticated;

SELECT 'Analytics views and functions created successfully!' as message;
