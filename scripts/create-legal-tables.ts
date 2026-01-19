import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://faxcibogggubmjsmtonz.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE5MzQ0OCwiZXhwIjoyMDgzNzY5NDQ4fQ.70lM9uuBJMvxlSqAsMUVisY-hwiscgHQiyDt_9mQBmA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function createLegalTables() {
    console.log('🚀 Creating legal tables via Supabase RPC...\n');

    // Read the SQL file
    const sql = fs.readFileSync('database/migrations/112_create_legal_tables.sql', 'utf8');

    console.log('📄 SQL file loaded. Executing via Supabase...\n');
    console.log('⚠️  Note: Supabase JS client cannot execute DDL directly.');
    console.log('Please copy the SQL content from database/migrations/112_create_legal_tables.sql');
    console.log('and run it in Supabase SQL Editor at:');
    console.log('https://supabase.com/dashboard/project/faxcibogggubmjsmtonz/sql\n');

    console.log('Alternatively, checking if tables already exist...\n');

    // Check if tables exist
    const { data: docs, error: docsError } = await supabase
        .from('project_legal_documents')
        .select('count')
        .limit(1);

    const { data: checks, error: checksError } = await supabase
        .from('project_compliance_checks')
        .select('count')
        .limit(1);

    if (!docsError && !checksError) {
        console.log('✅ Tables already exist! Ready to seed data.');
        return true;
    } else {
        console.log('❌ Tables do not exist yet.');
        console.log('\nPlease run the following SQL in Supabase SQL Editor:\n');
        console.log('---START SQL---');
        console.log(sql);
        console.log('---END SQL---\n');
        return false;
    }
}

createLegalTables();
