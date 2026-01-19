import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://faxcibogggubmjsmtonz.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE5MzQ0OCwiZXhwIjoyMDgzNzY5NDQ4fQ.70lM9uuBJMvxlSqAsMUVisY-hwiscgHQiyDt_9mQBmA'
);

const { data } = await supabase.from('task_templates').select('*').limit(3);
console.log(JSON.stringify(data, null, 2));
