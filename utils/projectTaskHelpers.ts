import { supabase as supabaseClient } from './supabaseClient';

/**
 * Auto-generate tasks for a new project based on task templates
 */
export async function generateTasksForProject(projectId: string, projectCode: string): Promise<void> {
    try {
        // 1. Fetch task templates
        const { data: templates, error: templateError } = await supabaseClient
            .from('task_templates')
            .select('*')
            .eq('is_active', true)
            .order('order_index');

        if (templateError) throw templateError;
        if (!templates || templates.length === 0) {
            console.warn('No task templates found');
            return;
        }

        // 2. Generate tasks from templates
        const today = new Date();
        let cumulativeDays = 0;

        const tasks = templates.map((template, index) => {
            const taskCode = `${projectCode}-T${String(index + 1).padStart(3, '0')}`;

            // Calculate start and due dates
            const startDate = new Date(today);
            startDate.setDate(startDate.getDate() + cumulativeDays);

            const dueDate = new Date(startDate);
            dueDate.setDate(dueDate.getDate() + (template.default_duration_days || 5));

            cumulativeDays += template.default_duration_days || 5;

            return {
                code: taskCode,
                name: template.task_name,
                project_id: projectId,
                phase: template.phase,
                status: 'Mở',
                priority: 'Trung bình',
                start_date: startDate.toISOString().split('T')[0],
                due_date: dueDate.toISOString().split('T')[0],
                progress: 0,
                assignee_role: template.default_assignee_role
            };
        });

        // 3. Insert all tasks
        const { error: insertError } = await supabaseClient
            .from('tasks')
            .insert(tasks);

        if (insertError) throw insertError;

        console.log(`✅ Generated ${tasks.length} tasks for project ${projectCode}`);
    } catch (error) {
        console.error('Error generating tasks:', error);
        throw error;
    }
}

/**
 * Calculate project progress based on tasks
 */
export async function calculateProjectProgress(projectId: string): Promise<number> {
    try {
        const { data: tasks } = await supabaseClient
            .from('tasks')
            .select('progress')
            .eq('project_id', projectId);

        if (!tasks || tasks.length === 0) return 0;

        const totalProgress = tasks.reduce((sum, task) => sum + (task.progress || 0), 0);
        return Math.round(totalProgress / tasks.length);
    } catch (error) {
        console.error('Error calculating project progress:', error);
        return 0;
    }
}

/**
 * Update project when task status changes  
 */
export async function syncProjectProgress(projectId: string): Promise<void> {
    try {
        const progress = await calculateProjectProgress(projectId);

        await supabaseClient
            .from('projects')
            .update({ progress })
            .eq('id', projectId);
    } catch (error) {
        console.error('Error syncing project progress:', error);
    }
}
