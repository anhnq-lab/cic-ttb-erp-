import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://faxcibogggubmjsmtonz.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE5MzQ0OCwiZXhwIjoyMDgzNzY5NDQ4fQ.70lM9uuBJMvxlSqAsMUVisY-hwiscgHQiyDt_9mQBmA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

// Sample data templates
const WEATHER_OPTIONS = ['Nắng', 'Mưa', 'Nhiều mây', 'Sương mù', 'Nắng nóng'];
const EQUIPMENT_OPTIONS = ['Máy xúc', 'Cần cẩu', 'Xe lu', 'Máy ủi', 'Xe ben', 'Máy khoan cọc nhồi'];
const ISSUES_OPTIONS = [
    null, null, null,
    'Mưa lớn ảnh hưởng tiến độ',
    'Thiếu vật tư',
    'Máy xúc hỏng',
    'Chờ phê duyệt mẫu vật liệu'
];

async function seedConstructionData() {
    console.log('🚀 Seeding construction logs and quality inspections...\n');

    // 1. Check if tables exist
    const { error: checkError } = await supabase.from('construction_logs').select('id').limit(1);

    if (checkError && checkError.code === '42P01') { // undefined_table
        console.error('❌ Table "construction_logs" does not exist!');
        console.error('⚠️  Please run the SQL migration "database/migrations/113_create_construction_tables.sql" in Supabase SQL Editor first.');

        // Try to read SQL file to show content
        try {
            const sql = fs.readFileSync('database/migrations/113_create_construction_tables.sql', 'utf8');
            console.log('\n--- SQL TO RUN ---');
            console.log(sql.substring(0, 500) + '... (truncated)');
            console.log('------------------\n');
        } catch (e) {
            console.log('Could not read migration file.');
        }
        return;
    }

    // 2. Get projects and employees
    const { data: projects, error: prjError } = await supabase.from('projects').select('id, code, name');
    const { data: employees, error: empError } = await supabase.from('employees').select('id, name');

    if (prjError || empError) {
        console.error('❌ Error fetching requirements:', prjError || empError);
        return;
    }

    console.log(`📊 Found ${projects.length} projects and ${employees.length} employees\n`);

    let totalLogs = 0;
    let totalInspections = 0;

    for (const project of projects) {
        // Seed Construction Logs (past 30 days)
        const logs = [];
        for (let i = 0; i < 15; i++) { // 15 logs per project
            const logDate = new Date();
            logDate.setDate(logDate.getDate() - i * 2);

            const loggedBy = employees[Math.floor(Math.random() * employees.length)];
            const weather = WEATHER_OPTIONS[Math.floor(Math.random() * WEATHER_OPTIONS.length)];
            const workers = 20 + Math.floor(Math.random() * 50);

            // Random equipment subset
            const equipCount = 1 + Math.floor(Math.random() * 3);
            const equipment = [];
            const shuffledEquip = [...EQUIPMENT_OPTIONS].sort(() => 0.5 - Math.random());
            for (let j = 0; j < equipCount; j++) equipment.push(shuffledEquip[j]);

            logs.push({
                project_id: project.id,
                log_date: logDate.toISOString().split('T')[0],
                weather: weather,
                temperature: 25 + Math.random() * 10,
                workers_count: workers,
                equipment_used: equipment,
                work_completed: `Thi công hạng mục ${['móng', 'thân', 'hoàn thiện', 'cơ điện'][Math.floor(Math.random() * 4)]} tầng ${1 + Math.floor(Math.random() * 10)}`,
                issues: ISSUES_OPTIONS[Math.floor(Math.random() * ISSUES_OPTIONS.length)],
                logged_by: loggedBy.id,
                logged_by_name: loggedBy.name
            });
        }

        const { error: logErr } = await supabase.from('construction_logs').insert(logs);
        if (logErr) console.error(`❌ Error inserting logs for ${project.code}:`, logErr.message);
        else totalLogs += logs.length;

        // Seed Quality Inspections
        const inspections = [];
        for (let i = 0; i < 5; i++) { // 5 inspections per project
            const inspDate = new Date();
            inspDate.setDate(inspDate.getDate() - i * 7);

            const inspector = employees[Math.floor(Math.random() * employees.length)];
            const types = ['Vật liệu đầu vào', 'Nghiệm thu cốt thép', 'Nghiệm thu bê tông', 'Hoàn thiện trát'];
            const results = ['passed', 'passed', 'passed', 'conditional', 'failed']; // weighted towards pass

            inspections.push({
                project_id: project.id,
                inspection_date: inspDate.toISOString().split('T')[0],
                inspection_type: types[Math.floor(Math.random() * types.length)],
                location: `Tầng ${1 + Math.floor(Math.random() * 5)}`,
                inspector_id: inspector.id,
                inspector_name: inspector.name,
                result: results[Math.floor(Math.random() * results.length)],
                findings: 'Kiểm tra theo tiêu chuẩn TCVN',
                actions_required: null
            });
        }

        const { error: inspErr } = await supabase.from('quality_inspections').insert(inspections);
        if (inspErr) console.error(`❌ Error inserting inspections for ${project.code}:`, inspErr.message);
        else totalInspections += inspections.length;

        console.log(`✅ [${project.code}] Seeded construction data`);
    }

    console.log(`\n🎉 Seeded ${totalLogs} logs and ${totalInspections} inspections!`);
}

seedConstructionData();
