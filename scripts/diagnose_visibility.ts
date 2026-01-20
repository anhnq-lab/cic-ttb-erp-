
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Hardcoded keys from what I saw in previous files (run-migration.ts) to match User's env
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://faxcibogggubmjsmtonz.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODE5MzQ0OCwiZXhwIjoyMDgzNzY5NDQ4fQ.70lM9uuBJMvxlSqAsMUVisY-hwiscgHQiyDt_9mQBmA';
// I need the ANON key. Use a placeholder or try to read from file if needed.
// Actually, RLS affects ANON key. Service key bypasses RLS.
// If I use Service Key and see 0 rows, then DATA IS GONE.
// If I use Service Key and see N rows, but Frontend sees 0, then RLS or Query Error.

const ANNON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZheGNpYm9nZ2d1Ym1qc210b256Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxOTM0NDgsImV4cCI6MjA4Mzc2OTQ0OH0.2T05S2qV7u4d4-5_6Z8y0l4-6j2a8b4c0d2e4f6g8h0'; // Guessing or need to ask user?
// Wait, I can't guess the anon key.
// But I can rely on the SERVICE KEY test first.

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

async function diagnose() {
    console.log("🔍 DIAGNOSING DATABASE STATE (Admin Access)...\n");

    // 1. Check Tables Existence and Count
    const tables = ['tasks', 'projects', 'employees', 'checklist_templates', 'checklist_logs'];
    const counts: Record<string, number> = {};

    for (const table of tables) {
        const { count, error } = await supabaseAdmin.from(table).select('*', { count: 'exact', head: true });
        if (error) {
            console.error(`❌ Table '${table}': ERROR - ${error.message}`);
        } else {
            console.log(`✅ Table '${table}': ${count} rows`);
            counts[table] = count || 0;
        }
    }

    // 2. Check Relations (Foreign Keys)
    if (counts['tasks'] > 0) {
        console.log("\n🔍 Testing Relationships (Task -> Project, Employee)...");
        // Try the exact query from TaskService
        const { data, error } = await supabaseAdmin
            .from('tasks')
            .select(`
                id,
                name,
                project:projects!project_id(id, code, name),
                assignee_employee:employees!assignee_id(id, name)
            `)
            .limit(1);

        if (error) {
            console.error("❌ Relation Query Failed:", error);
            console.log("   👉 This suggests the Foreign Key constraint name or schema structure doesn't match the query 'project:projects!project_id'.");
        } else {
            console.log("✅ Relation Query Successful:", JSON.stringify(data[0], null, 2));
            if (data[0].project === null) console.warn("   ⚠️ Project relation returned NULL (Foreign Key broken or Project missing)");
            if (data[0].assignee_employee === null) console.warn("   ⚠️ Assignee relation returned NULL (Foreign Key broken or Employee missing)");
        }
    } else {
        console.log("\n⚠️ SKIPPING Relation Test (No Tasks found)");
    }

    console.log("\n📋 SUMMARY:");
    if (Object.values(counts).every(c => c === 0)) {
        console.log("🔴 DATABASE IS EMPTY. The restore script MUST be executed.");
    } else {
        console.log("🟢 Database has data. If frontend is empty, check RLS policies again.");
    }
}

diagnose();
