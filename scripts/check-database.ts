import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://faxcibogggubmjsmtonz.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE5MzQ0OCwiZXhwIjoyMDgzNzY5NDQ4fQ.70lM9uuBJMvxlSqAsMUVisY-hwiscgHQiyDt_9mQBmA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

async function checkData() {
    console.log('🔍 Kiểm tra dữ liệu trong database...\n');

    // Check projects
    const { data: projects, error: prjError } = await supabase
        .from('projects')
        .select('id, code, name, client')
        .order('created_at', { ascending: false });

    if (prjError) {
        console.error('❌ Lỗi khi lấy projects:', prjError);
    } else {
        console.log(`📊 Tổng số dự án: ${projects.length}\n`);
        projects.forEach((p, i) => {
            console.log(`${i + 1}. [${p.code}] ${p.name}`);
            console.log(`   Khách hàng: ${p.client || 'N/A'}\n`);
        });
    }

    // Check employees
    const { data: employees, error: empError } = await supabase
        .from('employees')
        .select('id, code, name, role')
        .order('code');

    if (empError) {
        console.error('❌ Lỗi khi lấy employees:', empError);
    } else {
        console.log(`\n👥 Tổng số nhân viên: ${employees.length}\n`);
        employees.forEach((e, i) => {
            console.log(`${i + 1}. [${e.code}] ${e.name} - ${e.role}`);
        });
    }

    // Check customers
    const { data: customers, error: custError } = await supabase
        .from('customers')
        .select('id, code, name')
        .order('created_at', { ascending: false });

    if (custError) {
        console.error('\n❌ Lỗi khi lấy customers:', custError);
    } else {
        console.log(`\n\n🏢 Tổng số khách hàng: ${customers?.length || 0}\n`);
        if (customers && customers.length > 0) {
            customers.slice(0, 10).forEach((c, i) => {
                console.log(`${i + 1}. [${c.code}] ${c.name}`);
            });
        }
    }

    // Check contracts
    const { data: contracts, error: contractError } = await supabase
        .from('contracts')
        .select('id, code, name, project_id')
        .order('created_at', { ascending: false });

    if (contractError) {
        console.error('\n❌ Lỗi khi lấy contracts:', contractError);
    } else {
        console.log(`\n\n📄 Tổng số hợp đồng: ${contracts?.length || 0}\n`);
        if (contracts && contracts.length > 0) {
            contracts.slice(0, 10).forEach((c, i) => {
                console.log(`${i + 1}. [${c.code}] ${c.name || 'N/A'}`);
            });
        }
    }
}

checkData();
