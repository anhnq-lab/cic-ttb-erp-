
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Checking connection...');
    const { data, error } = await supabase.from('projects').select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Error fetching projects:', error.message);
        if (error.code === '42P01') {
            console.log('Table "projects" does not exist.');
        }
    } else {
        console.log('Table "projects" exists. Count:', data);
    }
}

check();
