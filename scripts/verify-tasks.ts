import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://faxcibogggubmjsmtonz.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE5MzQ0OCwiZXhwIjoyMDgzNzY5NDQ4fQ.70lM9uuBJMvxlSqAsMUVisY-hwiscgHQiyDt_9mQBmA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function verifyTasks() {
    console.log('Checking tasks...');
    const { data: tasks, error } = await supabase.from('tasks').select('id, name, project_id');
    if (error) {
        console.error('Error fetching tasks:', error);
    } else {
        console.log(`Found ${tasks.length} tasks.`);
        tasks.slice(0, 5).forEach(t => console.log(`- ${t.name} (${t.id})`));
    }

    console.log('\nChecking projects...');
    const { data: projects, error: pError } = await supabase.from('projects').select('id, name');
    if (pError) {
        console.error('Error fetching projects:', pError);
    } else {
        console.log(`Found ${projects.length} projects.`);
    }
}

verifyTasks();
