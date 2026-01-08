
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyEmployees() {
    console.log('Verifying Employees Data...');

    // 1. Fetch DB Employees
    const { data: dbEmployees, error } = await supabase
        .from('employees')
        .select('id, name, code, role');

    if (error) {
        console.error('Error fetching DB employees:', error);
        return;
    }

    console.log(`Found ${dbEmployees.length} employees in DB.`);
    if (dbEmployees.length > 0) {
        console.log('Sample DB Employee:', dbEmployees[0]);
    }

    // 2. Load Constants (Simulated as we can't easily import TS file in node script without ts-node config)
    // I will just check if DB IDs look like UUIDs or "NV..." text.
    const sampleId = dbEmployees[0]?.id;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sampleId);

    console.log(`DB ID format check: ${sampleId} is ${isUuid ? 'UUID' : 'Non-UUID'}`);

    if (isUuid) {
        console.warn('WARNING: DB uses UUIDs. If constants.ts uses "NV001", "NV002", etc., there is a MISMATCH.');
        console.log('This will cause Foreign Key errors in project_members.');
    } else {
        console.log('DB uses text IDs (good sign if constants match).');
    }

}

verifyEmployees();
