import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://faxcibogggubmjsmtonz.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE5MzQ0OCwiZXhwIjoyMDgzNzY5NDQ4fQ.70lM9uuBJMvxlSqAsMUVisY-hwiscgHQiyDt_9mQBmA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function diagnoseDatabase() {
    console.log('🔍 Starting database diagnosis...\n');

    // 1. Check employees table
    console.log('1️⃣ Checking employees table...');
    const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('*');

    if (empError) {
        console.error('❌ Error fetching employees:', empError);
    } else {
        console.log(`✅ Found ${employees.length} employees:`);
        employees.forEach(emp => {
            console.log(`   - ${emp.name} (${emp.email}) - Role: ${emp.role}`);
        });
    }

    // 2. Check if admin@cic.com.vn exists
    console.log('\n2️⃣ Checking for admin@cic.com.vn...');
    const { data: admin, error: adminError } = await supabase
        .from('employees')
        .select('*')
        .eq('email', 'admin@cic.com.vn')
        .single();

    if (adminError || !admin) {
        console.log('❌ admin@cic.com.vn NOT FOUND in employees table');
        console.log('   Will need to insert this user...');
    } else {
        console.log('✅ admin@cic.com.vn exists:', admin);
    }

    // 3. Check task_templates table
    console.log('\n3️⃣ Checking task_templates table...');
    const { data: templates, error: templatesError } = await supabase
        .from('task_templates')
        .select('*');

    if (templatesError) {
        console.error('❌ Error fetching task_templates:', templatesError);
    } else {
        console.log(`✅ Found ${templates?.length || 0} task templates`);
    }

    // 4. Check projects table
    console.log('\n4️⃣ Checking projects table...');
    const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*');

    if (projectsError) {
        console.error('❌ Error fetching projects:', projectsError);
    } else {
        console.log(`✅ Found ${projects?.length || 0} projects`);
    }

    return { employees, admin, templates, projects };
}

async function fixDatabase() {
    console.log('\n\n🔧 Starting database fixes...\n');

    // Fix 1: Ensure admin@cic.com.vn exists
    console.log('1️⃣ Ensuring admin@cic.com.vn exists...');
    const { data: existingAdmin } = await supabase
        .from('employees')
        .select('*')
        .eq('email', 'admin@cic.com.vn')
        .single();

    if (!existingAdmin) {
        const { data: newAdmin, error: insertError } = await supabase
            .from('employees')
            .insert({
                code: 'ADMIN-NEW', // Different code to avoid conflict
                name: 'Administrator',
                email: 'admin@cic.com.vn',
                role: 'Admin',
                department: 'IT',
                status: 'Active'
            })
            .select()
            .single();

        if (insertError) {
            console.error('❌ Failed to insert admin:', insertError);
        } else {
            console.log('✅ Created admin user:', newAdmin);
        }
    } else {
        console.log('✅ admin@cic.com.vn already exists');
    }

    // Fix 2: Ensure task_templates exist
    console.log('\n2️⃣ Checking task templates...');
    const { data: existingTemplates } = await supabase
        .from('task_templates')
        .select('count');

    if (!existingTemplates || existingTemplates.length === 0) {
        console.log('⚠️  No task templates found. You need to run migration 102_seed_task_templates.sql');
    } else {
        console.log('✅ Task templates exist');
    }

    console.log('\n✅ Database fixes completed!');
}

async function main() {
    try {
        const diagnosis = await diagnoseDatabase();
        await fixDatabase();

        console.log('\n\n📊 FINAL STATUS:');
        console.log('================');
        console.log('If admin@cic.com.vn now exists, you can test project creation!');
        console.log('If task_templates are missing, run migration 102 in Supabase SQL Editor.');
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
