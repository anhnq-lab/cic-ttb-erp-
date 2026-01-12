// Quick check: Test Supabase connection and view tasks
import { supabase } from './utils/supabase';

async function testConnection() {
    console.log('🔍 Testing Supabase connection...\n');

    // 1. Test basic connection
    try {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .limit(5);

        if (error) {
            console.error('❌ Error:', error.message);
            console.error('Details:', error);
            return;
        }

        console.log(`✅ Connection successful!`);
        console.log(`📊 Found ${data.length} tasks in database\n`);

        if (data.length === 0) {
            console.log('⚠️  No tasks found!');
            console.log('\n📝 Next steps:');
            console.log('1. Run migration 012_task_seed_data.sql');
            console.log('2. Copy file from: d:\\CIC.TTB.ERP\\database\\migrations\\012_task_seed_data.sql');
            console.log('3. Paste and run in Supabase SQL Editor');
            console.log('4. Refresh this page\n');
        } else {
            console.log('📋 Sample tasks:');
            data.forEach((task: any) => {
                console.log(`  - ${task.name} (${task.status})`);
            });
        }
    } catch (err) {
        console.error('❌ Connection failed:', err);
    }
}

testConnection();
