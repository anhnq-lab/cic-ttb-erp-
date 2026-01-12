// Quick test: Check if we can fetch tasks directly
console.log('=== SUPABASE CONNECTION TEST ===');

// Check environment
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET ✅' : 'MISSING ❌');

// Import and test
import { supabase } from './utils/supabaseClient';
import TaskService from './services/task.service';

async function testConnection() {
    console.log('\n1️⃣ Testing basic Supabase query...');

    try {
        // Test 1: Simple count
        const { count, error: countError } = await supabase
            .from('tasks')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            console.error('❌ Count error:', countError);
            return;
        }

        console.log(`✅ Found ${count} tasks in database`);

        // Test 2: Fetch with TaskService
        console.log('\n2️⃣ Testing TaskService.getAllTasks()...');
        const tasks = await TaskService.getAllTasks();
        console.log(`✅ TaskService returned ${tasks.length} tasks`);
        console.log('First task:', tasks[0]);

    } catch (err) {
        console.error('❌ Error:', err);
    }
}

// Run test
testConnection();
