
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://faxcibogggubmjsmtonz.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE5MzQ0OCwiZXhwIjoyMDgzNzY5NDQ4fQ.70lM9uuBJMvxlSqAsMUVisY-hwiscgHQiyDt_9mQBmA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function verify() {
    console.log('--- Verifying Import ---');

    // 1. Projects
    const { count: pWithId } = await supabase.from('projects').select('*', { count: 'exact', head: true }).neq('id', 'null');
    console.log(`✅ Projects: ${pWithId}`);

    // 2. Customers
    const { count: customers } = await supabase.from('customers').select('*', { count: 'exact', head: true });
    console.log(`✅ Customers: ${customers}`);

    // 3. Contracts
    const { count: contracts } = await supabase.from('contracts').select('*', { count: 'exact', head: true });
    console.log(`✅ Contracts: ${contracts}`);

    // 4. Sample Link
    const { data: sampleContracts } = await supabase
        .from('contracts')
        .select(`
            code, name, total_value,
            project:projects(code, name),
            customer:customers(name)
        `)
        .limit(3);

    console.log('\n--- Sample Linked Data ---');
    console.log(JSON.stringify(sampleContracts, null, 2));
}

verify();
