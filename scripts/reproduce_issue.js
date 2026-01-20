import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Manual dotenv loading because 'dotenv' might not autoload in module mode easily without params or if path issues
const envConfig = dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || envConfig.parsed?.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || envConfig.parsed?.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Optional, strict check

console.log('--- CONFIG CHECK ---');
console.log('URL:', SUPABASE_URL);
console.log('ANON KEY Present:', !!SUPABASE_ANON_KEY);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ Missing Env vars');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const adminSupabase = SUPABASE_SERVICE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY) : null;

async function run() {
    console.log('\n--- TEST: Projects (Anon Access) ---');
    const { count, error: countErr } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true });

    if (countErr) {
        console.error('❌ Projects Error:', countErr);
    } else {
        console.log(`✅ Projects Count: ${count}`);
    }

    console.log('\n--- TEST: Anon Access (Frontend Simulation) ---');
    const { data, error } = await supabase
        .from('tasks')
        .select(`
            *,
            project:projects!project_id(id, code, name, client),
            assignee_employee:employees!assignee_id(id, name, avatar, role),
            reviewer_employee:employees!reviewer_id(id, name, avatar, role)
        `)
        .limit(5);
    if (error) {
        console.error('❌ Anon Error:', error);
    } else {
        console.log(`✅ Anon Result: Found ${data.length} tasks`);
        if (data.length === 0) {
            console.log('   (RLS likely blocking access, or table empty)');
        } else {
            console.table(data.slice(0, 5));
        }
    }

    if (adminSupabase) {
        console.log('\n--- TEST: Service Role Access (Truth) ---');
        const { data: adminData, error: adminError } = await adminSupabase.from('tasks').select('count');
        if (adminError) {
            console.error('❌ Service Error:', adminError);
        } else {
            console.log(`✅ Service Result: Table has ${adminData.length} rows (count approximation)`);
        }
    }
}

run();
