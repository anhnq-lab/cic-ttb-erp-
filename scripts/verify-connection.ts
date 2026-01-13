import { supabase, isSupabaseConfigured } from './utils/supabaseClient';

/**
 * Quick verification script to test Supabase connection
 * Run: npx tsx scripts/verify-connection.ts
 */

async function verifyConnection() {
    console.log('🔍 Verifying Supabase Connection...\n');

    // Check if configured
    if (!isSupabaseConfigured()) {
        console.error('❌ Supabase is not configured!');
        console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file');
        process.exit(1);
    }

    console.log('✅ Supabase client is configured\n');

    try {
        // Test database connection by querying projects
        console.log('📊 Testing database connection...');
        const { data: projects, error: projectsError } = await supabase!
            .from('projects')
            .select('id, name, code')
            .limit(5);

        if (projectsError) {
            console.error('❌ Error fetching projects:', projectsError.message);
        } else {
            console.log(`✅ Successfully fetched ${projects?.length || 0} projects`);
            if (projects && projects.length > 0) {
                console.log('\nSample projects:');
                projects.forEach(p => {
                    console.log(`  - ${p.code}: ${p.name}`);
                });
            }
        }

        // Test tasks table
        console.log('\n📋 Testing tasks table...');
        const { data: tasks, error: tasksError } = await supabase!
            .from('tasks')
            .select('id, name, status')
            .limit(5);

        if (tasksError) {
            console.error('❌ Error fetching tasks:', tasksError.message);
        } else {
            console.log(`✅ Successfully fetched ${tasks?.length || 0} tasks`);
        }

        // Test employees table
        console.log('\n👥 Testing employees table...');
        const { data: employees, error: employeesError } = await supabase!
            .from('employees')
            .select('id, name, role')
            .limit(5);

        if (employeesError) {
            console.error('❌ Error fetching employees:', employeesError.message);
        } else {
            console.log(`✅ Successfully fetched ${employees?.length || 0} employees`);
        }

        console.log('\n🎉 Verification complete!');

    } catch (error) {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    }
}

verifyConnection();
