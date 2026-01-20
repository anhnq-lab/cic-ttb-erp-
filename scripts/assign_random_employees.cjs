const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
const envConfig = dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || envConfig.parsed?.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || envConfig.parsed?.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY (Check .env)');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function assignEmployees() {
    console.log('🔄 Fetching employees and tasks...');

    // 1. Get Employees
    const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('id, name')
        .eq('status', 'Active');

    if (empError || !employees || employees.length === 0) {
        console.error('❌ Failed to fetch employees or no active employees found.', empError);
        return;
    }
    console.log(`✅ Found ${employees.length} active employees.`);

    // 2. Get Tasks (Unassigned or All)
    const { data: tasks, error: taskError } = await supabase
        .from('tasks')
        .select('id, name')
        .is('assignee_id', null); // Only target unassigned tasks for now? Or all? User said "gán thêm", implies filling gaps.

    if (taskError) {
        console.error('❌ Failed to fetch tasks.', taskError);
        return;
    }

    if (!tasks || tasks.length === 0) {
        console.log('ℹ️ No unassigned tasks found. Fetching ALL tasks to re-shuffle/ensure assignment?');
        // Optional: Uncomment to re-assign everything if needed. For now, let's just create a few random updates if list is empty.
        // But user said "unassigned" in screenshot.
        // Let's assume there ARE unassigned tasks.
        return;
    }

    console.log(`✅ Found ${tasks.length} unassigned tasks.`);

    // 3. Assign
    console.log('🔄 Assigning employees...');
    let updatedCount = 0;

    for (const task of tasks) {
        const randomEmp = employees[Math.floor(Math.random() * employees.length)];

        const { error: updateError } = await supabase
            .from('tasks')
            .update({
                assignee_id: randomEmp.id,
                updated_at: new Date().toISOString()
            })
            .eq('id', task.id);

        if (updateError) {
            console.error(`❌ Failed to update task ${task.name}:`, updateError.message);
        } else {
            updatedCount++;
            process.stdout.write('.'); // Progress indicator
        }
    }

    console.log(`\n\n✅ Successfully assigned employees to ${updatedCount} tasks!`);
}

assignEmployees();
