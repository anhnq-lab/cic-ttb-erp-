
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://faxcibogggubmjsmtonz.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('--- Checking Task Templates ---');
    const { data: templates, error: tErr } = await supabase.from('task_templates').select('*').limit(5);
    if (tErr) console.error('Error fetching templates:', tErr);
    else console.log('Templates sample:', templates);

    console.log('\n--- Checking Tasks Column ---');
    const { data: task, error: kErr } = await supabase.from('tasks').select('*').limit(1);
    // seeing one task will verify columns
    if (kErr) console.error('Error fetching task:', kErr);
    else console.log('Task sample:', task);
}

checkSchema();
