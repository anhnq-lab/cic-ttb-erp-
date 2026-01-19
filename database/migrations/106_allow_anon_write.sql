-- Migration 106: Allow anon access for seeding and development
-- This should be restricted in a real production environment

-- Customers
DROP POLICY IF EXISTS "anon_all_customers" ON public.customers;
CREATE POLICY "anon_all_customers" ON public.customers FOR ALL TO anon USING (true) WITH CHECK (true);

-- Contracts
DROP POLICY IF EXISTS "anon_all_contracts" ON public.contracts;
CREATE POLICY "anon_all_contracts" ON public.contracts FOR ALL TO anon USING (true) WITH CHECK (true);

-- Payments
ALTER TABLE public.payment_milestones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_milestones" ON public.payment_milestones;
CREATE POLICY "anon_all_milestones" ON public.payment_milestones FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_all_transactions" ON public.payment_transactions;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_transactions" ON public.payment_transactions FOR ALL TO anon USING (true) WITH CHECK (true);

-- Projects (Double check)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_projects" ON public.projects;
CREATE POLICY "anon_all_projects" ON public.projects FOR ALL TO anon USING (true) WITH CHECK (true);

-- Tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_all_tasks" ON public.tasks;
CREATE POLICY "anon_all_tasks" ON public.tasks FOR ALL TO anon USING (true) WITH CHECK (true);
