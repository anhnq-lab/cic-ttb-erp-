-- ============================================
-- FIX: Allow Anonymous INSERT/UPDATE/DELETE
-- For Demo Mode to work fully
-- ============================================

-- Projects
CREATE POLICY "anon_insert_projects" ON public.projects FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_projects" ON public.projects FOR UPDATE TO anon USING (true);
CREATE POLICY "anon_delete_projects" ON public.projects FOR DELETE TO anon USING (true);

-- Contracts
CREATE POLICY "anon_insert_contracts" ON public.contracts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_contracts" ON public.contracts FOR UPDATE TO anon USING (true);
CREATE POLICY "anon_delete_contracts" ON public.contracts FOR DELETE TO anon USING (true);

-- Employees
CREATE POLICY "anon_insert_employees" ON public.employees FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_employees" ON public.employees FOR UPDATE TO anon USING (true);
CREATE POLICY "anon_delete_employees" ON public.employees FOR DELETE TO anon USING (true);

-- Customers
CREATE POLICY "anon_insert_customers" ON public.customers FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_customers" ON public.customers FOR UPDATE TO anon USING (true);
CREATE POLICY "anon_delete_customers" ON public.customers FOR DELETE TO anon USING (true);

-- Tasks
CREATE POLICY "anon_insert_tasks" ON public.tasks FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_tasks" ON public.tasks FOR UPDATE TO anon USING (true);
CREATE POLICY "anon_delete_tasks" ON public.tasks FOR DELETE TO anon USING (true);

-- Subtasks
CREATE POLICY "anon_all_subtasks" ON public.subtasks FOR ALL TO anon USING (true) WITH CHECK (true);

-- Task Comments
CREATE POLICY "anon_all_task_comments" ON public.task_comments FOR ALL TO anon USING (true) WITH CHECK (true);

-- CRM Contacts
CREATE POLICY "anon_insert_crm_contacts" ON public.crm_contacts FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_crm_contacts" ON public.crm_contacts FOR UPDATE TO anon USING (true);
CREATE POLICY "anon_delete_crm_contacts" ON public.crm_contacts FOR DELETE TO anon USING (true);

-- CRM Activities
CREATE POLICY "anon_insert_crm_activities" ON public.crm_activities FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_delete_crm_activities" ON public.crm_activities FOR DELETE TO anon USING (true);

-- CRM Opportunities
CREATE POLICY "anon_insert_crm_opportunities" ON public.crm_opportunities FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_crm_opportunities" ON public.crm_opportunities FOR UPDATE TO anon USING (true);
CREATE POLICY "anon_delete_crm_opportunities" ON public.crm_opportunities FOR DELETE TO anon USING (true);

-- Payment Milestones
CREATE POLICY "anon_all_payment_milestones" ON public.payment_milestones FOR ALL TO anon USING (true) WITH CHECK (true);

-- Payment Transactions
CREATE POLICY "anon_all_payment_transactions" ON public.payment_transactions FOR ALL TO anon USING (true) WITH CHECK (true);

-- Project Members
CREATE POLICY "anon_all_project_members" ON public.project_members FOR ALL TO anon USING (true) WITH CHECK (true);

-- Contract Personnel
CREATE POLICY "anon_all_contract_personnel" ON public.contract_personnel FOR ALL TO anon USING (true) WITH CHECK (true);

SELECT 'Anon INSERT/UPDATE/DELETE policies added! Try creating a project now.' as message;
