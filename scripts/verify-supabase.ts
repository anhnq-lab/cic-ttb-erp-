
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Manual env loading because we are outside of Vite for this script
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const SUPABASE_URL = envConfig.VITE_SUPABASE_URL;
const SUPABASE_KEY = envConfig.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing credentials in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
    console.log('Testing connection to:', SUPABASE_URL);

    // Test 1: Simple connection (auth check not strictly needed for public tables but good to have)
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
        console.error('⚠️ Auth Check Failed:', authError.message);
    } else {
        console.log('✅ Connected to Supabase Instance');
    }

    // Test 2: Check Customers Table
    const { data: customers, error: dbError } = await supabase.from('customers').select('count', { count: 'exact', head: true });

    if (dbError) {
        if (dbError.code === '42P01') { // undefined_table
            console.error('❌ Table "customers" NOT FOUND. Did you run the SQL script?');
        } else {
            console.error('❌ Connection Error:', dbError.message, dbError.code);
        }
    } else {
        console.log('✅ Table "customers" exists.');
    }
}

testConnection();
