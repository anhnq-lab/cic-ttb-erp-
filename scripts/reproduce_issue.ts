import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://faxcibogggubmjsmtonz.supabase.co';
// IMPORTANT: Use ANON KEY to test RLS (Service Role Key bypasses RLS)
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_ANON_KEY) {
    console.error('❌ VITE_SUPABASE_ANON_KEY is missing in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testTaskAccess() {
    console.log('🔍 Testing Task Access with ANON KEY...');
    console.log('URL:', SUPABASE_URL);

    // 1. Try to fetch tasks anonymously (should be blocked or see nothing if RLS is strict)
    console.log('\n--- Attempt 1: Anonymous Fetch ---');
    const { data: anonTasks, error: anonError } = await supabase
        .from('tasks')
        .select('id, name, status, project_id')
        .limit(5);

    if (anonError) {
        console.error('❌ Anonymous fetch error:', anonError);
    } else {
        console.log(`✅ Anonymous fetch success. Found ${anonTasks.length} tasks.`);
        anonTasks.forEach(t => console.log(`   - [${t.status}] ${t.name}`));
    }

    // 2. Try to "login" as Admin (simulate by calling the function if possible, but we can't easily sign in with password here without knowing it)
    // Instead, we will check if the 'current_user_employee_id' function is working as expected by calling a wrapper RPC if it exists, or just relying on the fact that we are anon.

    // If "Development mode" in RLS was active (current_user_employee_id() IS NULL), then Anon fetch SHOULD work.
    // If Anon fetch returns 0 items, then RLS is blocking it.

    // 3. Verify total tasks using SERVICE ROLE KEY (to confirm data exists)
    // We'll hardcode the service key just for this verification step if needed, but better to read from a separate env or assume data exists as per user claim.
    // Let's rely on the previous script's output that confirmed data existed.

    console.log('\n--- Diagnosis ---');
    if (anonTasks && anonTasks.length === 0) {
        console.log('⚠️  Zero tasks found with Anon key.');
        console.log('   Possible reasons:');
        console.log('   1. RLS is blocking access.');
        console.log('   2. current_user_employee_id() is NOT returning NULL (unexpected).');
        console.log('   3. The table is actually empty (unlikely given previous context).');
    }
}

testTaskAccess();
